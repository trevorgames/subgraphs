import { Address, BigInt, log, store } from '@graphprotocol/graph-ts'
import { ERC20 } from '../generated/TrevorMarketplace/ERC20'
import {
  BidAccepted as BidAcceptedEvent,
  ItemCanceled as ItemCanceledEvent,
  ItemListed as ItemListedEvent,
  ItemSold as ItemSoldEvent,
  ItemUpdated as ItemUpdatedEvent,
  TrevorMarketplace,
  UpdateCollectionOwnerFee as UpdateCollectionOwnerFeeEvent,
} from '../generated/TrevorMarketplace/TrevorMarketplace'
import { Listing, Trade } from '../generated/schema'
import {
  BIGINT_ONE,
  BIGINT_ZERO,
  MANTISSA_FACTOR,
  NftStandard,
  convertTokenToDecimal,
  getListingId,
  getNativePriceInUSD,
  getOrCreateCollection,
  getOrCreateCollectionDailySnapshot,
  getOrCreateToken,
  getOrCreateUserToken,
  getTRVPriceInNative,
  getTokenId,
  max,
  min,
  updateCollectionFloorAndTotal,
} from './helpers'

export function handleItemListed(event: ItemListedEvent): void {
  let nftAddress = event.params.nftAddress
  let tokenId = event.params.tokenId
  let seller = event.params.seller

  const quantity = event.params.quantity
  const pricePerItem = event.params.pricePerItem
  const paymentToken = event.params.paymentToken
  const expirationTime = event.params.expirationTime

  let token = getOrCreateToken(nftAddress, tokenId)
  let collection = getOrCreateCollection(token.collection)

  // Update collection floor price
  let floorPrice = collection.floorPrice
  if (floorPrice.isZero() || floorPrice.gt(event.params.pricePerItem)) {
    collection.floorPrice = event.params.pricePerItem
  }

  // Update token floor price
  if (collection.standard == NftStandard.ERC1155) {
    let tokenFloorPrice = token.floorPrice
    if (!tokenFloorPrice || tokenFloorPrice.gt(pricePerItem)) {
      token.floorPrice = pricePerItem
      token.save()
    }
  }

  collection.totalListings = collection.totalListings.plus(quantity)
  collection.save()

  let listingId = getListingId(nftAddress, tokenId, seller)
  let listing = Listing.load(listingId)

  if (!listing) {
    listing = new Listing(listingId)
    listing.collection = collection.id
    listing.tokenId = tokenId
    listing.token = token.id
    listing.seller = seller.toHexString()
  }

  // Update user token quantity
  const userToken = getOrCreateUserToken(seller.toHexString(), token.id)
  if (userToken.quantity.equals(quantity)) {
    store.remove('UserToken', userToken.id.toHexString())
  } else {
    userToken.quantity = userToken.quantity.minus(quantity)
    userToken.save()
  }

  listing.quantity = quantity
  listing.pricePerItem = pricePerItem
  listing.paymentToken = paymentToken
  listing.expirationTime = expirationTime

  listing.save()
}

export function handleItemUpdated(event: ItemUpdatedEvent): void {
  const nftAddress = event.params.nftAddress
  const tokenId = event.params.tokenId
  const seller = event.params.seller

  const quantity = event.params.quantity
  const pricePerItem = event.params.pricePerItem
  const paymentToken = event.params.paymentToken
  const expirationTime = event.params.expirationTime

  const listingId = getListingId(nftAddress, tokenId, seller)
  let listing = Listing.load(listingId)

  if (!listing) {
    log.warning('handleItemUpdated: Listing not found: {}-{}-{}', [
      nftAddress.toHexString(),
      tokenId.toString(),
      seller.toHexString(),
    ])

    return
  }

  // Update user token quantity
  if (listing.quantity.notEqual(quantity)) {
    let userToken = getOrCreateUserToken(seller.toHexString(), listing.token)

    const userTokenQuantity = userToken.quantity.plus(
      listing.quantity.minus(quantity),
    )

    if (userTokenQuantity.isZero()) {
      store.remove('UserToken', userToken.id.toHexString())
    } else {
      userToken.quantity = userTokenQuantity
      userToken.save()
    }
  }

  if (listing.pricePerItem.notEqual(pricePerItem)) {
    // TODO: Update block timestamp
  }

  listing.quantity = quantity
  listing.pricePerItem = pricePerItem
  listing.paymentToken = paymentToken
  listing.expirationTime = expirationTime

  listing.save()

  updateCollectionFloorAndTotal(getOrCreateCollection(listing.collection))
}

export function handleItemCanceled(event: ItemCanceledEvent): void {
  const nftAddress = event.params.nftAddress
  const tokenId = event.params.tokenId
  const seller = event.params.seller

  const listingId = getListingId(nftAddress, tokenId, seller)
  let listing = Listing.load(listingId)

  if (!listing) {
    log.warning('handleItemCanceled: Listing not found: {}-{}-{}', [
      nftAddress.toHexString(),
      tokenId.toString(),
      seller.toHexString(),
    ])

    return
  }

  let userToken = getOrCreateUserToken(seller.toHexString(), listing.token)
  userToken.quantity = userToken.quantity.plus(listing.quantity)
  userToken.token = listing.token
  userToken.user = listing.seller
  userToken.save()

  store.remove('Listing', listingId.toHexString())

  updateCollectionFloorAndTotal(getOrCreateCollection(listing.collection))
}

export function handleItemSold(event: ItemSoldEvent): void {
  const nftAddress = event.params.nftAddress
  const tokenId = event.params.tokenId
  const seller = event.params.seller
  const buyer = event.params.buyer

  const quantity = event.params.quantity
  const pricePerItem = event.params.pricePerItem
  const paymentTokenAddress = event.params.paymentToken

  const listingId = getListingId(nftAddress, tokenId, seller)
  let listing = Listing.load(listingId)

  if (!listing) {
    log.warning('handleItemSold: Listing not found: {}-{}-{}', [
      nftAddress.toHexString(),
      tokenId.toString(),
      seller.toHexString(),
    ])

    return
  }

  // Update collection
  let collection = getOrCreateCollection(listing.collection)
  collection.totalSales = collection.totalSales.plus(BIGINT_ONE)
  collection.totalVolume = collection.totalVolume.plus(
    listing.pricePerItem.times(quantity),
  )

  if (listing.quantity.equals(quantity)) {
    store.remove('Listing', listingId.toHexString())

    if (collection.standard == NftStandard.ERC1155) {
      // TODO
    }
  } else {
    listing.quantity = listing.quantity.minus(quantity)
    listing.save()
  }

  // update collection
  const paymentToken = ERC20.bind(paymentTokenAddress)
  const paymentTokenDecimals = BigInt.fromI32(paymentToken.decimals())
  const totalAmount = pricePerItem.times(quantity)
  const totalAmountDec = convertTokenToDecimal(
    totalAmount,
    paymentTokenDecimals,
  )

  const trvPriceInNative = getTRVPriceInNative()
  const nativePriceInUSD = getNativePriceInUSD()

  collection.cumulativeTradeVolumeTRV =
    collection.cumulativeTradeVolumeTRV.plus(totalAmountDec)
  collection.cumulativeTradeVolumeETH =
    collection.cumulativeTradeVolumeETH.plus(
      totalAmountDec.times(trvPriceInNative),
    )
  collection.cumulativeTradeVolumeUSD =
    collection.cumulativeTradeVolumeUSD.plus(
      totalAmountDec.times(trvPriceInNative).times(nativePriceInUSD),
    )

  let protocolFee: BigInt = BIGINT_ZERO
  let royaltyFee: BigInt = BIGINT_ZERO

  if (collection.royaltyFee && collection.royaltyFee.gt(BIGINT_ZERO)) {
    const fee = TrevorMarketplace.bind(event.address).feeWithCollectionOwner()
    protocolFee = totalAmount.times(fee).div(BigInt.fromI32(10000))
    royaltyFee = totalAmount
      .times(collection.royaltyFee)
      .div(BigInt.fromI32(10000))
  } else {
    const fee = TrevorMarketplace.bind(event.address).fee()
    protocolFee = totalAmount.times(fee).div(BigInt.fromI32(10000))
  }

  const protocolFeeDec = convertTokenToDecimal(
    protocolFee,
    paymentTokenDecimals,
  )
  const royaltyFeeDec = convertTokenToDecimal(royaltyFee, paymentTokenDecimals)

  collection.marketplaceRevenueTRV =
    collection.marketplaceRevenueTRV.plus(protocolFeeDec)
  collection.marketplaceRevenueETH = collection.marketplaceRevenueETH.plus(
    protocolFeeDec.times(trvPriceInNative),
  )
  collection.marketplaceRevenueUSD = collection.marketplaceRevenueUSD.plus(
    protocolFeeDec.times(trvPriceInNative).times(nativePriceInUSD),
  )

  collection.creatorRevenueTRV =
    collection.creatorRevenueTRV.plus(royaltyFeeDec)
  collection.creatorRevenueETH = collection.creatorRevenueETH.plus(
    royaltyFeeDec.times(trvPriceInNative),
  )
  collection.creatorRevenueUSD = collection.creatorRevenueUSD.plus(
    royaltyFeeDec.times(trvPriceInNative).times(nativePriceInUSD),
  )

  collection.tradeCount += 1

  collection.save()

  let trade = new Trade(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )

  trade.timestamp = event.block.timestamp
  trade.blockNumber = event.block.number
  trade.transactionHash = event.transaction.hash
  trade.logIndex = event.logIndex

  trade.collection = listing.collection
  trade.token = listing.token
  trade.from = seller.toHexString()
  trade.to = buyer.toHexString()
  trade.quantity = quantity
  trade.pricePerItem = pricePerItem
  trade.paymentToken = paymentTokenAddress
  trade.save()

  updateCollectionFloorAndTotal(collection)

  const collectionSnapshot = getOrCreateCollectionDailySnapshot(
    collection.id,
    event.block.timestamp,
  )
  collectionSnapshot.blockNumber = event.block.number
  collectionSnapshot.timestamp = event.block.timestamp
  collectionSnapshot.royaltyFee = collection.royaltyFee

  collectionSnapshot.dailyMinSalePriceTRV = min(
    collectionSnapshot.dailyMinSalePriceTRV,
    pricePerItem.toBigDecimal().div(MANTISSA_FACTOR),
  )
  collectionSnapshot.dailyMinSalePriceETH =
    collectionSnapshot.dailyMinSalePriceTRV.times(trvPriceInNative)
  collectionSnapshot.dailyMinSalePriceUSD =
    collectionSnapshot.dailyMinSalePriceETH.times(nativePriceInUSD)

  collectionSnapshot.dailyMaxSalePriceTRV = max(
    collectionSnapshot.dailyMaxSalePriceTRV,
    pricePerItem.toBigDecimal().div(MANTISSA_FACTOR),
  )
  collectionSnapshot.dailyMaxSalePriceETH =
    collectionSnapshot.dailyMaxSalePriceTRV.times(trvPriceInNative)
  collectionSnapshot.dailyMaxSalePriceUSD =
    collectionSnapshot.dailyMaxSalePriceETH.times(nativePriceInUSD)

  collectionSnapshot.cumulativeTradeVolumeTRV =
    collection.cumulativeTradeVolumeTRV
  collectionSnapshot.cumulativeTradeVolumeETH =
    collection.cumulativeTradeVolumeETH
  collectionSnapshot.cumulativeTradeVolumeUSD =
    collection.cumulativeTradeVolumeUSD
  collectionSnapshot.marketplaceRevenueTRV = collection.marketplaceRevenueTRV
  collectionSnapshot.marketplaceRevenueETH = collection.marketplaceRevenueETH
  collectionSnapshot.marketplaceRevenueUSD = collection.marketplaceRevenueUSD
  collectionSnapshot.creatorRevenueTRV = collection.creatorRevenueTRV
  collectionSnapshot.creatorRevenueETH = collection.creatorRevenueETH
  collectionSnapshot.creatorRevenueUSD = collection.creatorRevenueUSD
  collectionSnapshot.totalRevenueETH = collection.totalRevenueETH
  collectionSnapshot.tradeCount = collection.tradeCount
  collectionSnapshot.dailyTradeVolumeTRV =
    collectionSnapshot.dailyTradeVolumeTRV.plus(
      pricePerItem.times(quantity).toBigDecimal().div(MANTISSA_FACTOR),
    )
  collectionSnapshot.dailyTradeVolumeETH =
    collectionSnapshot.dailyTradeVolumeTRV.times(trvPriceInNative)
  collectionSnapshot.dailyTradeVolumeUSD =
    collectionSnapshot.dailyTradeVolumeETH.times(nativePriceInUSD)
  collectionSnapshot.dailyTradedItemCount += 1
  collectionSnapshot.save()
}

export function handleBidAccepted(event: BidAcceptedEvent): void {
  const nftAddress = event.params.nftAddress
  const tokenId = event.params.tokenId
  const bidder = event.params.bidder

  const quantity = event.params.quantity
  const pricePerItem = event.params.pricePerItem
  const paymentTokenAddress = event.params.paymentToken

  let collection = getOrCreateCollection(nftAddress)

  // update collection
  const paymentToken = ERC20.bind(paymentTokenAddress)
  const paymentTokenDecimals = BigInt.fromI32(paymentToken.decimals())
  const totalAmount = pricePerItem.times(quantity)
  const totalAmountDec = convertTokenToDecimal(
    totalAmount,
    paymentTokenDecimals,
  )

  const trvPriceInNative = getTRVPriceInNative()
  const nativePriceInUSD = getNativePriceInUSD()

  collection.cumulativeTradeVolumeTRV =
    collection.cumulativeTradeVolumeTRV.plus(totalAmountDec)
  collection.cumulativeTradeVolumeETH =
    collection.cumulativeTradeVolumeETH.plus(
      totalAmountDec.times(trvPriceInNative),
    )
  collection.cumulativeTradeVolumeUSD =
    collection.cumulativeTradeVolumeUSD.plus(
      totalAmountDec.times(trvPriceInNative).times(nativePriceInUSD),
    )

  let protocolFee: BigInt = BIGINT_ZERO
  let royaltyFee: BigInt = BIGINT_ZERO

  if (collection.royaltyFee && collection.royaltyFee.gt(BIGINT_ZERO)) {
    const fee = TrevorMarketplace.bind(event.address).feeWithCollectionOwner()
    protocolFee = totalAmount.times(fee).div(BigInt.fromI32(10000))
    royaltyFee = totalAmount
      .times(collection.royaltyFee)
      .div(BigInt.fromI32(10000))
  } else {
    const fee = TrevorMarketplace.bind(event.address).fee()
    protocolFee = totalAmount.times(fee).div(BigInt.fromI32(10000))
  }

  const protocolFeeDec = convertTokenToDecimal(
    protocolFee,
    paymentTokenDecimals,
  )
  const royaltyFeeDec = convertTokenToDecimal(royaltyFee, paymentTokenDecimals)

  collection.marketplaceRevenueTRV =
    collection.marketplaceRevenueTRV.plus(protocolFeeDec)
  collection.marketplaceRevenueETH = collection.marketplaceRevenueETH.plus(
    protocolFeeDec.times(trvPriceInNative),
  )
  collection.marketplaceRevenueUSD = collection.marketplaceRevenueUSD.plus(
    protocolFeeDec.times(trvPriceInNative).times(nativePriceInUSD),
  )

  collection.creatorRevenueTRV =
    collection.creatorRevenueTRV.plus(royaltyFeeDec)
  collection.creatorRevenueETH = collection.creatorRevenueETH.plus(
    royaltyFeeDec.times(trvPriceInNative),
  )
  collection.creatorRevenueUSD = collection.creatorRevenueUSD.plus(
    royaltyFeeDec.times(trvPriceInNative).times(nativePriceInUSD),
  )

  collection.tradeCount += 1

  collection.save()
}

export function handleUpdateCollectionOwnerFee(
  event: UpdateCollectionOwnerFeeEvent,
): void {
  let collection = getOrCreateCollection(event.params._collection)
  if (event.params._recipient != Address.zero()) {
    collection.royaltyFee = event.params._fee
    collection.save()
  }
}
