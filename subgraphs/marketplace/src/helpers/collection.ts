import { BigInt, Bytes } from '@graphprotocol/graph-ts'
import { Collection } from '../../generated/schema'

export function getOrCreateCollection(id: Bytes, standard: string): Collection {
  let collection = Collection.load(id)

  if (!collection) {
    collection = new Collection(id)

    collection.address = id
    collection.standard = standard

    collection.owners = []
    collection.totalItems = BigInt.zero()
    collection.totalOwners = BigInt.zero()

    collection.save()
  }

  return collection
}
