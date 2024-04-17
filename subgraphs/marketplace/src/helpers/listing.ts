import { Address, BigInt } from '@graphprotocol/graph-ts'
import { Listing } from '../../generated/schema'

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
