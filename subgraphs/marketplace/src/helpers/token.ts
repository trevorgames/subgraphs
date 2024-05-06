import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts'
import { Token } from '../../generated/schema'
import { getOrCreateCollection } from './collection'

export function getTokenId(nftAddress: Address, tokenId: BigInt): string {
  return nftAddress.concatI32(tokenId.toI32()).toHexString()
}

export function getOrCreateToken(nftAddress: Address, tokenId: BigInt): Token {
  const id = getTokenId(nftAddress, tokenId)
  let token = Token.load(id)

  if (token == null) {
    token = new Token(id)
    const collection = getOrCreateCollection(nftAddress)
    token.collection = collection.id
    token.tokenId = tokenId
    token.save()
  }

  return token
}
