import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts'
import { Token } from '../../generated/schema'

export function getTokenId(nftAddress: Address, tokenId: BigInt): string {
  return nftAddress.concatI32(tokenId.toI32()).toHexString()
}

export function getOrCreateToken(id: string): Token {
  let token = Token.load(id)

  if (token == null) {
    token = new Token(id)
    token.save()
  }

  return token
}
