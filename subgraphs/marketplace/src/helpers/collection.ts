import { Address, BigInt, Bytes, TypedMap, log } from '@graphprotocol/graph-ts'
import { ERC165 } from '../../generated/TrevorMarketplace/ERC165'
import { Collection, Token } from '../../generated/schema'
import {
  BIGINT_ZERO,
  ERC721_INTERFACE_IDENTIFIER,
  ERC1155_INTERFACE_IDENTIFIER,
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
      let tokenFloorPrice = floorPrices.get(listing.token)

      if (!tokenFloorPrice || tokenFloorPrice.gt(pricePerItem)) {
        floorPrices.set(listing.token, pricePerItem)
      }
    }

    if (floorPrice.isZero() || floorPrice.gt(pricePerItem)) {
      collection.floorPrice = pricePerItem
    }

    collection.totalListings = collection.totalListings.plus(listing.quantity)
  }

  for (let index = 0; index < floorPrices.entries.length; index++) {
    let entry = floorPrices.entries[index]
    let token = Token.load(entry.key)

    if (token) {
      token.floorPrice = entry.value
      token.save()
    }
  }

  collection.save()
}
