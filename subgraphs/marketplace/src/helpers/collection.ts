import { Address, BigInt, Bytes, TypedMap, log } from '@graphprotocol/graph-ts'
import { ERC165 } from '../../generated/TrevorMarketplace/ERC165'
import {
  Collection,
  CollectionDailySnapshot,
  Token,
} from '../../generated/schema'
import {
  BIGINT_ZERO,
  BIG_DECIMAL_MAX,
  BIG_DECIMAL_ZERO,
  ERC721_INTERFACE_IDENTIFIER,
  ERC1155_INTERFACE_IDENTIFIER,
  SECONDS_PER_DAY,
} from './constants'

export namespace NftStandard {
  export const ERC721 = 'ERC721'
  export const ERC1155 = 'ERC1155'
  export const UNKNOWN = 'UNKNOWN'
}

export function getOrCreateCollection(id: Bytes): Collection {
  let collection = Collection.load(id)

  if (!collection) {
    collection = new Collection(id)

    collection.address = id
    collection.standard = getNftStandard(Address.fromBytes(id))

    collection.owners = []
    collection.totalItems = BIGINT_ZERO
    collection.totalOwners = BIGINT_ZERO

    collection.floorPrice = BIGINT_ZERO
    collection.totalListings = BIGINT_ZERO
    collection.totalSales = BIGINT_ZERO
    collection.totalVolume = BIGINT_ZERO

    collection.royaltyFee = BIGINT_ZERO
    collection.cumulativeTradeVolumeETH = BIG_DECIMAL_ZERO
    collection.cumulativeTradeVolumeTRV = BIG_DECIMAL_ZERO
    collection.cumulativeTradeVolumeUSD = BIG_DECIMAL_ZERO
    collection.marketplaceRevenueETH = BIG_DECIMAL_ZERO
    collection.marketplaceRevenueTRV = BIG_DECIMAL_ZERO
    collection.marketplaceRevenueUSD = BIG_DECIMAL_ZERO
    collection.creatorRevenueETH = BIG_DECIMAL_ZERO
    collection.creatorRevenueTRV = BIG_DECIMAL_ZERO
    collection.creatorRevenueUSD = BIG_DECIMAL_ZERO
    collection.totalRevenueETH = BIG_DECIMAL_ZERO
    collection.totalRevenueUSD = BIG_DECIMAL_ZERO
    collection.tradeCount = 0
    collection.buyerCount = 0
    collection.sellerCount = 0

    collection.save()
  }

  return collection
}

export function getNftStandard(nftAddress: Address): string {
  let erc165 = ERC165.bind(nftAddress)

  const isERC721Result = erc165.try_supportsInterface(
    Bytes.fromHexString(ERC721_INTERFACE_IDENTIFIER),
  )
  if (isERC721Result.reverted) {
    log.warning('[getNftStandard] isERC721 reverted, nft address: {}', [
      nftAddress.toHexString(),
    ])
  } else {
    if (isERC721Result.value) {
      return NftStandard.ERC721
    }
  }

  const isERC1155Result = erc165.try_supportsInterface(
    Bytes.fromHexString(ERC1155_INTERFACE_IDENTIFIER),
  )
  if (isERC1155Result.reverted) {
    log.warning('[getNftStandard] isERC1155 reverted, nft address: {}', [
      nftAddress.toHexString(),
    ])
  } else {
    if (isERC1155Result.value) {
      return NftStandard.ERC1155
    }
  }

  return NftStandard.UNKNOWN
}

export function updateCollectionFloorAndTotal(collection: Collection): void {
  let floorPrices = new TypedMap<Bytes, BigInt>()
  let listings = collection.listings.load()
  let floorPrice = collection.floorPrice

  for (let index = 0; index < listings.length; index++) {
    let listing = listings[index]
    let pricePerItem = listing.pricePerItem

    if (collection.standard == NftStandard.ERC1155) {
      const tokenId = Bytes.fromHexString(listing.token)
      let tokenFloorPrice = floorPrices.get(tokenId)

      if (!tokenFloorPrice || tokenFloorPrice.gt(pricePerItem)) {
        floorPrices.set(tokenId, pricePerItem)
      }
    }

    if (floorPrice.isZero() || floorPrice.gt(pricePerItem)) {
      collection.floorPrice = pricePerItem
    }

    collection.totalListings = collection.totalListings.plus(listing.quantity)
  }

  for (let index = 0; index < floorPrices.entries.length; index++) {
    let entry = floorPrices.entries[index]
    let token = Token.load(entry.key.toHexString())

    if (token) {
      token.floorPrice = entry.value
      token.save()
    }
  }

  collection.save()
}

export function getOrCreateCollectionDailySnapshot(
  collection: Bytes,
  timestamp: BigInt,
): CollectionDailySnapshot {
  const snapshotID = collection.concatI32(timestamp.toI32() / SECONDS_PER_DAY)
  let snapshot = CollectionDailySnapshot.load(snapshotID)
  if (!snapshot) {
    snapshot = new CollectionDailySnapshot(snapshotID)
    snapshot.collection = collection
    snapshot.blockNumber = BIGINT_ZERO
    snapshot.timestamp = BIGINT_ZERO
    snapshot.royaltyFee = BIGINT_ZERO
    snapshot.dailyMinSalePriceETH = BIG_DECIMAL_MAX
    snapshot.dailyMinSalePriceTRV = BIG_DECIMAL_MAX
    snapshot.dailyMinSalePriceUSD = BIG_DECIMAL_MAX
    snapshot.dailyMaxSalePriceETH = BIG_DECIMAL_ZERO
    snapshot.dailyMaxSalePriceTRV = BIG_DECIMAL_ZERO
    snapshot.dailyMaxSalePriceUSD = BIG_DECIMAL_ZERO
    snapshot.cumulativeTradeVolumeETH = BIG_DECIMAL_ZERO
    snapshot.cumulativeTradeVolumeTRV = BIG_DECIMAL_ZERO
    snapshot.cumulativeTradeVolumeUSD = BIG_DECIMAL_ZERO
    snapshot.dailyTradeVolumeETH = BIG_DECIMAL_ZERO
    snapshot.dailyTradeVolumeTRV = BIG_DECIMAL_ZERO
    snapshot.dailyTradeVolumeUSD = BIG_DECIMAL_ZERO
    snapshot.marketplaceRevenueETH = BIG_DECIMAL_ZERO
    snapshot.marketplaceRevenueTRV = BIG_DECIMAL_ZERO
    snapshot.marketplaceRevenueUSD = BIG_DECIMAL_ZERO
    snapshot.creatorRevenueETH = BIG_DECIMAL_ZERO
    snapshot.creatorRevenueTRV = BIG_DECIMAL_ZERO
    snapshot.creatorRevenueUSD = BIG_DECIMAL_ZERO
    snapshot.totalRevenueETH = BIG_DECIMAL_ZERO
    snapshot.totalRevenueUSD = BIG_DECIMAL_ZERO
    snapshot.tradeCount = 0
    snapshot.dailyTradedItemCount = 0
    snapshot.save()
  }
  return snapshot
}
