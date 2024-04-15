import { BigInt, Bytes } from '@graphprotocol/graph-ts'
import { UserToken } from '../../generated/schema'

export function getOrCreateUserToken(
  userId: Bytes,
  tokenId: Bytes,
  quantity: BigInt,
): UserToken {
  let userToken = UserToken.load(userId.concat(tokenId))
  if (!userToken) {
    userToken = new UserToken(userId.concat(tokenId))
    userToken.user = userId
    userToken.token = tokenId
    userToken.quantity = quantity
    userToken.save()
  }

  return userToken
}
