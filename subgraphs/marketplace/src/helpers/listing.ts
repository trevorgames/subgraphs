import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts'
import { Listing } from '../../generated/schema'

export function getListingId(
  nftAddress: Address,
  tokenId: BigInt,
  seller: Address,
): Bytes {
  return nftAddress.concatI32(tokenId.toI32()).concat(seller)
}

export function getOrCreateListing(
  nftAddress: Address,
  tokenId: BigInt,
  seller: Address,
): Listing {
  let id = nftAddress.concatI32(tokenId.toI32()).concat(seller)

  let listing = Listing.load(id)

  if (!listing) {
    listing = new Listing(id)
    // listing.save()
  }

  return listing
}
