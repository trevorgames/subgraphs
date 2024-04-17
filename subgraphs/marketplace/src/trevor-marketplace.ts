import { BigInt, log, store } from '@graphprotocol/graph-ts'
import {
  ItemCanceled as ItemCanceledEvent,
  ItemListed as ItemListedEvent,
  ItemSold as ItemSoldEvent,
  ItemUpdated as ItemUpdatedEvent,
} from '../generated/TrevorMarketplace/TrevorMarketplace'
import { Listing } from '../generated/schema'
import {
  BIGINT_ONE,
  BIGINT_ZERO,
  NftStandard,
  getOrCreateCollection,
  getOrCreateListing,
  getOrCreateToken,
  getOrCreateUserToken,
  getTokenId,
  updateCollectionFloorAndTotal,
} from './helpers'

export function handleItemListed(event: ItemListedEvent): void {
  let nftAddress = event.params.nftAddress
  let tokenId = event.params.tokenId
  let seller = event.params.seller

  const pricePerItem = event.params.pricePerItem
  const quantity = event.params.quantity

  let token = getOrCreateToken(getTokenId(nftAddress, tokenId))
  let collection = getOrCreateCollection(token.collection)

  let floorPrice = collection.floorPrice
  if (floorPrice.isZero() || floorPrice.gt(event.params.pricePerItem)) {
    collection.floorPrice = event.params.pricePerItem
  }

  if (collection.standard == NftStandard.ERC1155) {
    let tokenFloorPrice = token.floorPrice
    if (!tokenFloorPrice || tokenFloorPrice.gt(pricePerItem)) {
      token.floorPrice = pricePerItem
      token.save()
    }
  }

  collection.totalListings = collection.totalListings.plus(quantity)

  let listing = getOrCreateListing(nftAddress, tokenId, seller)
  listing.collection = collection.id
  listing.token = token.id
  listing.seller = seller
  listing.quantity = quantity
  listing.pricePerItem = pricePerItem
  listing.expirationTime = event.params.expirationTime
  listing.paymentToken = event.params.paymentToken

  const userToken = getOrCreateUserToken(seller, token.id, BigInt.zero())
  if (userToken.quantity.equals(quantity)) {
    store.remove('UserToken', userToken.id.toHexString())
  } else {
    userToken.quantity = userToken.quantity.minus(quantity)
    userToken.save()
  }

  collection.save()
  listing.save()
}

export function handleItemUpdated(event: ItemUpdatedEvent): void {
  let nftAddress = event.params.nftAddress
  let tokenId = event.params.tokenId
  let seller = event.params.seller

  let listingId = nftAddress.concatI32(tokenId.toI32()).concat(seller)

  let listing = Listing.load(listingId)

  if (!listing) {
    log.warning('handleItemUpdated: Listing not found: {}-{}-{}', [
      nftAddress.toHexString(),
      tokenId.toString(),
      seller.toHexString(),
    ])

    return
  }

  if (!listing.quantity.equals(event.params.quantity)) {
    let userToken = getOrCreateUserToken(seller, listing.token, BigInt.zero())

    userToken.quantity = userToken.quantity.plus(
      listing.quantity.minus(event.params.quantity),
    )

    if (userToken.quantity.isZero()) {
      store.remove('UserToken', userToken.id.toHexString())
    } else {
      userToken.token = listing.token
      userToken.user = seller
      userToken.save()
    }
  }

  if (!listing.pricePerItem.equals(event.params.pricePerItem)) {
  }

  listing.quantity = event.params.quantity
  listing.pricePerItem = event.params.pricePerItem
  listing.expirationTime = event.params.expirationTime

  listing.save()

  updateCollectionFloorAndTotal(getOrCreateCollection(listing.collection))
}

export function handleItemCanceled(event: ItemCanceledEvent): void {
  let nftAddress = event.params.nftAddress
  let tokenId = event.params.tokenId
  let seller = event.params.seller

  let listingId = nftAddress.concatI32(tokenId.toI32()).concat(seller)
  let listing = Listing.load(listingId)

  if (!listing) {
    log.warning('handleItemCanceled: Listing not found: {}-{}-{}', [
      nftAddress.toHexString(),
      tokenId.toString(),
      seller.toHexString(),
    ])

    return
  }

  let userToken = getOrCreateUserToken(seller, listing.token, BigInt.zero())
  userToken.quantity = userToken.quantity.plus(listing.quantity)
  userToken.token = listing.token
  userToken.user = listing.seller
  userToken.save()

  store.remove('Listing', listingId.toHexString())

  updateCollectionFloorAndTotal(getOrCreateCollection(listing.collection))
}

export function handleItemSold(event: ItemSoldEvent): void {
  let nftAddress = event.params.nftAddress
  let tokenId = event.params.tokenId
  let seller = event.params.seller

  let listingId = nftAddress.concatI32(tokenId.toI32()).concat(seller)
  let listing = Listing.load(listingId)

  if (!listing) {
    log.warning('handleItemSold: Listing not found: {}-{}-{}', [
      nftAddress.toHexString(),
      tokenId.toString(),
      seller.toHexString(),
    ])

    return
  }

  let collection = getOrCreateCollection(listing.collection)

  collection.totalSales = collection.totalSales.plus(BIGINT_ONE)
  collection.totalVolume = collection.totalVolume.plus(
    listing.pricePerItem.times(listing.quantity),
  )

  if (listing.quantity.equals(event.params.quantity)) {
    store.remove('Listing', listingId.toHexString())

    if (collection.standard == NftStandard.ERC1155) {
      // TODO
    }
  } else {
    listing.quantity = listing.quantity.minus(event.params.quantity)
    listing.save()
  }

  collection.save()

  let soldId = event.transaction.hash
    .concatI32(event.transactionLogIndex.toI32())
    .concat(listing.id)
  let sold = new Listing(soldId)

  sold.collection = listing.collection
  sold.token = listing.token
  sold.seller = listing.seller
  sold.quantity = event.params.quantity
  sold.pricePerItem = event.params.pricePerItem
  sold.expirationTime = BIGINT_ZERO
  sold.paymentToken = event.params.paymentToken
  sold.buyer = event.params.buyer

  sold.save()

  updateCollectionFloorAndTotal(collection)
}
