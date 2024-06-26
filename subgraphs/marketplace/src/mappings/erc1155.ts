import {
  Address,
  BigInt,
  Bytes,
  TypedMap,
  store,
} from '@graphprotocol/graph-ts'
import {
  TransferBatch as TransferBatchEvent,
  TransferSingle as TransferSingleEvent,
  URI as URIEvent,
} from '../../generated/ERC1155/ERC1155'
import { Token, UserToken } from '../../generated/schema'
import { getOrCreateCollection, getOrCreateUser } from '../helpers'

export function handleTransferBatch(event: TransferBatchEvent): void {}

export function handleTransferSingle(event: TransferSingleEvent): void {
  let collection = getOrCreateCollection(event.address)

  let token = Token.load(
    event.address.concatI32(event.params.id.toI32()).toHexString(),
  )
  if (!token) {
    token = new Token(
      event.address.concatI32(event.params.id.toI32()).toHexString(),
    )

    token.collection = collection.id
    token.tokenId = event.params.id
    token.save()
  }

  let fromUser = getOrCreateUser(event.params.from)
  let toUser = getOrCreateUser(event.params.to)

  if (event.params.from.equals(Address.zero())) {
    let toUserToken = new UserToken(
      Bytes.fromHexString(toUser.id.concat(token.id)),
    )
    toUserToken.user = toUser.id
    toUserToken.token = token.id
    toUserToken.quantity = event.params.value
    toUserToken.save()

    collection.owners = collection.owners.concat([toUser.id])
    collection.totalItems = collection.totalItems.plus(event.params.value)
  } else {
    let fromUserToken = UserToken.load(
      Bytes.fromHexString(fromUser.id.concat(token.id)),
    )
    let toUserToken = UserToken.load(
      Bytes.fromHexString(toUser.id.concat(token.id)),
    )

    if (!toUserToken) {
      toUserToken = new UserToken(
        Bytes.fromHexString(toUser.id.concat(token.id)),
      )
      toUserToken.user = toUser.id
      toUserToken.token = token.id
      toUserToken.quantity = event.params.value
    } else {
      toUserToken.quantity = toUserToken.quantity.plus(event.params.value)
    }

    toUserToken.save()

    collection.owners = collection.owners.concat([toUser.id])

    if (fromUserToken) {
      let owners = collection.owners
      let index = collection.owners.indexOf(fromUser.id)
      collection.owners = event.params.value.lt(fromUserToken.quantity)
        ? owners
        : index == -1
          ? owners
          : owners.slice(0, index).concat(owners.slice(index + 1))

      if (event.params.value.equals(fromUserToken.quantity)) {
        store.remove('UserToken', fromUserToken.id.toHexString())
      } else if (event.params.value.lt(fromUserToken.quantity)) {
        fromUserToken.quantity = fromUserToken.quantity.minus(
          event.params.value,
        )
        fromUserToken.save()
      }
    }
  }

  let owners = new TypedMap<Bytes, boolean>()
  for (let index = 0; index < collection.tokens.load().length; index++) {
    let tokenId = collection.tokens.load().at(index).tokenId
    let token = Token.load(
      collection.id.concatI32(tokenId.toI32()).toHexString(),
    )

    if (token) {
      for (let j = 0; j < token.owners.load().length; j++) {
        let owner = token.owners.load()[j].user
        if (!owners.isSet(Bytes.fromHexString(owner))) {
          owners.set(Bytes.fromHexString(owner), true)
        }
      }
    }
  }
  collection.totalOwners = BigInt.fromI32(owners.entries.length)

  collection.save()
  token.save()
}

export function handleURI(event: URIEvent): void {}
