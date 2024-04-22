import { BigInt, Bytes } from '@graphprotocol/graph-ts'
import { UserToken } from '../../generated/schema'
import { BIGINT_ZERO } from './constants'

export function getOrCreateUserToken(userId: Bytes, tokenId: Bytes): UserToken {
  let id = userId.concat(tokenId)
  let userToken = UserToken.load(id)

  if (!userToken) {
    userToken = new UserToken(id)
    userToken.user = userId
    userToken.token = tokenId
    userToken.quantity = BIGINT_ZERO
    userToken.save()
  }

  return userToken
}
