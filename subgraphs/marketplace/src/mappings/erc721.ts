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
  BIGINT_ONE,
  getOrCreateCollection,
  getOrCreateUser,
  getOrCreateUserToken,
} from '../helpers'

export function handleTransfer(event: TransferEvent): void {
  let collection = getOrCreateCollection(event.address)

  let token = Token.load(
    event.address.concatI32(event.params.tokenId.toI32()).toHexString(),
  )
  if (!token) {
    token = new Token(
      event.address.concatI32(event.params.tokenId.toI32()).toHexString(),
    )

    token.collection = collection.id
    token.tokenId = event.params.tokenId
  }

  let fromUser = getOrCreateUser(event.params.from)
  let toUser = getOrCreateUser(event.params.to)

  if (event.params.from.equals(Address.zero())) {
    collection.totalItems = collection.totalItems.plus(BigInt.fromI32(1))
  } else {
    store.remove(
      'UserToken',
      Bytes.fromHexString(fromUser.id)
        .concat(Bytes.fromHexString(token.id))
        .toHexString(),
    )
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
    if (!owners.isSet(Bytes.fromHexString(owner))) {
      owners.set(Bytes.fromHexString(owner), true)
    }
  }
  collection.totalOwners = BigInt.fromI32(owners.entries.length)

  // create UserToken
  let userToken = getOrCreateUserToken(toUser.id, token.id)
  userToken.quantity = BIGINT_ONE
  userToken.save()

  token.owner = toUser.id

  collection.save()
  token.save()
}
