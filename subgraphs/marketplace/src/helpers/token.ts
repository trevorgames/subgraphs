import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts'
import { Token } from '../../generated/schema'

export function getTokenId(nftAddress: Address, tokenId: BigInt): Bytes {
  return nftAddress.concatI32(tokenId.toI32())
}

export function getOrCreateToken(id: Bytes): Token {
  let token = Token.load(id)

  if (token == null) {
    token = new Token(id)
    token.save()
  }

  return token
}
