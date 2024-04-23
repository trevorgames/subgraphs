import { Bytes } from '@graphprotocol/graph-ts'
import { User } from '../../generated/schema'

export function getOrCreateUser(id: Bytes): User {
  let user = User.load(id.toHexString())

  if (!user) {
    user = new User(id.toHexString())
    user.save()
  }

  return user
}
