import {
  Address,
  BigInt,
  Bytes,
  TypedMap,
  store,
} from '@graphprotocol/graph-ts'
import { Transfer as TransferEvent } from '../../generated/ERC721/ERC721'
import { Token } from '../../generated/schema'
import {
  getOrCreateCollection,
  getOrCreateUser,
  getOrCreateUserToken,
} from '../helpers'

export function handleTransfer(event: TransferEvent): void {
  let collection = getOrCreateCollection(event.address)

  let token = Token.load(event.address.concatI32(event.params.tokenId.toI32()))
  if (!token) {
    token = new Token(event.address.concatI32(event.params.tokenId.toI32()))

    token.collection = collection.id
    token.tokenId = event.params.tokenId
  }

  let fromUser = getOrCreateUser(event.params.from)
  let toUser = getOrCreateUser(event.params.to)

  if (event.params.from.equals(Address.zero())) {
    collection.totalItems = collection.totalItems.plus(BigInt.fromI32(1))
  } else {
    store.remove('UserToken', fromUser.id.concat(token.id).toHexString())
  }

  let collectionOwners = collection.owners.concat([toUser.id])
  let index = collection.owners.indexOf(fromUser.id)
  collection.owners =
    index == -1
      ? collectionOwners
      : collectionOwners
          .slice(0, index)
          .concat(collectionOwners.slice(index + 1))

  let owners = new TypedMap<Bytes, boolean>()
  for (let index = 0; index < collection.owners.length; index++) {
    let owner = collection.owners[index]
    if (!owners.isSet(owner)) {
      owners.set(owner, true)
    }
  }
  collection.totalOwners = BigInt.fromI32(owners.entries.length)

  // create UserToken
  getOrCreateUserToken(toUser.id, token.id, BigInt.fromI32(1))
  token.owner = toUser.id

  collection.save()
  token.save()
}
