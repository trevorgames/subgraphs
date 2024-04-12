import { newMockEvent } from 'matchstick-as'
import { ethereum, Address, BigInt, Bytes } from '@graphprotocol/graph-ts'
import {
  BidAccepted,
  CollectionBidCancelled,
  CollectionBidCreatedOrUpdated,
  Initialized,
  ItemCanceled,
  ItemListed,
  ItemSold,
  ItemUpdated,
  Paused,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  TokenApprovalStatusUpdated,
  TokenBidCancelled,
  TokenBidCreatedOrUpdated,
  Unpaused,
  UpdateCollectionOwnerFee,
  UpdateFee,
  UpdateFeeRecipient,
  UpdateFeeWithCollectionOwner,
  UpdateSalesTracker,
} from '../generated/TrevorMarketplace/TrevorMarketplace'

export function createBidAcceptedEvent(
  seller: Address,
  bidder: Address,
  nftAddress: Address,
  tokenId: BigInt,
  quantity: BigInt,
  pricePerItem: BigInt,
  paymentToken: Address,
  bidType: i32,
): BidAccepted {
  let bidAcceptedEvent = changetype<BidAccepted>(newMockEvent())

  bidAcceptedEvent.parameters = new Array()

  bidAcceptedEvent.parameters.push(
    new ethereum.EventParam('seller', ethereum.Value.fromAddress(seller)),
  )
  bidAcceptedEvent.parameters.push(
    new ethereum.EventParam('bidder', ethereum.Value.fromAddress(bidder)),
  )
  bidAcceptedEvent.parameters.push(
    new ethereum.EventParam(
      'nftAddress',
      ethereum.Value.fromAddress(nftAddress),
    ),
  )
  bidAcceptedEvent.parameters.push(
    new ethereum.EventParam(
      'tokenId',
      ethereum.Value.fromUnsignedBigInt(tokenId),
    ),
  )
  bidAcceptedEvent.parameters.push(
    new ethereum.EventParam(
      'quantity',
      ethereum.Value.fromUnsignedBigInt(quantity),
    ),
  )
  bidAcceptedEvent.parameters.push(
    new ethereum.EventParam(
      'pricePerItem',
      ethereum.Value.fromUnsignedBigInt(pricePerItem),
    ),
  )
  bidAcceptedEvent.parameters.push(
    new ethereum.EventParam(
      'paymentToken',
      ethereum.Value.fromAddress(paymentToken),
    ),
  )
  bidAcceptedEvent.parameters.push(
    new ethereum.EventParam(
      'bidType',
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(bidType)),
    ),
  )

  return bidAcceptedEvent
}

export function createCollectionBidCancelledEvent(
  bidder: Address,
  nftAddress: Address,
): CollectionBidCancelled {
  let collectionBidCancelledEvent = changetype<CollectionBidCancelled>(
    newMockEvent(),
  )

  collectionBidCancelledEvent.parameters = new Array()

  collectionBidCancelledEvent.parameters.push(
    new ethereum.EventParam('bidder', ethereum.Value.fromAddress(bidder)),
  )
  collectionBidCancelledEvent.parameters.push(
    new ethereum.EventParam(
      'nftAddress',
      ethereum.Value.fromAddress(nftAddress),
    ),
  )

  return collectionBidCancelledEvent
}

export function createCollectionBidCreatedOrUpdatedEvent(
  bidder: Address,
  nftAddress: Address,
  quantity: BigInt,
  pricePerItem: BigInt,
  expirationTime: BigInt,
  paymentToken: Address,
): CollectionBidCreatedOrUpdated {
  let collectionBidCreatedOrUpdatedEvent =
    changetype<CollectionBidCreatedOrUpdated>(newMockEvent())

  collectionBidCreatedOrUpdatedEvent.parameters = new Array()

  collectionBidCreatedOrUpdatedEvent.parameters.push(
    new ethereum.EventParam('bidder', ethereum.Value.fromAddress(bidder)),
  )
  collectionBidCreatedOrUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      'nftAddress',
      ethereum.Value.fromAddress(nftAddress),
    ),
  )
  collectionBidCreatedOrUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      'quantity',
      ethereum.Value.fromUnsignedBigInt(quantity),
    ),
  )
  collectionBidCreatedOrUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      'pricePerItem',
      ethereum.Value.fromUnsignedBigInt(pricePerItem),
    ),
  )
  collectionBidCreatedOrUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      'expirationTime',
      ethereum.Value.fromUnsignedBigInt(expirationTime),
    ),
  )
  collectionBidCreatedOrUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      'paymentToken',
      ethereum.Value.fromAddress(paymentToken),
    ),
  )

  return collectionBidCreatedOrUpdatedEvent
}

export function createInitializedEvent(version: BigInt): Initialized {
  let initializedEvent = changetype<Initialized>(newMockEvent())

  initializedEvent.parameters = new Array()

  initializedEvent.parameters.push(
    new ethereum.EventParam(
      'version',
      ethereum.Value.fromUnsignedBigInt(version),
    ),
  )

  return initializedEvent
}

export function createItemCanceledEvent(
  seller: Address,
  nftAddress: Address,
  tokenId: BigInt,
): ItemCanceled {
  let itemCanceledEvent = changetype<ItemCanceled>(newMockEvent())

  itemCanceledEvent.parameters = new Array()

  itemCanceledEvent.parameters.push(
    new ethereum.EventParam('seller', ethereum.Value.fromAddress(seller)),
  )
  itemCanceledEvent.parameters.push(
    new ethereum.EventParam(
      'nftAddress',
      ethereum.Value.fromAddress(nftAddress),
    ),
  )
  itemCanceledEvent.parameters.push(
    new ethereum.EventParam(
      'tokenId',
      ethereum.Value.fromUnsignedBigInt(tokenId),
    ),
  )

  return itemCanceledEvent
}

export function createItemListedEvent(
  seller: Address,
  nftAddress: Address,
  tokenId: BigInt,
  quantity: BigInt,
  pricePerItem: BigInt,
  expirationTime: BigInt,
  paymentToken: Address,
): ItemListed {
  let itemListedEvent = changetype<ItemListed>(newMockEvent())

  itemListedEvent.parameters = new Array()

  itemListedEvent.parameters.push(
    new ethereum.EventParam('seller', ethereum.Value.fromAddress(seller)),
  )
  itemListedEvent.parameters.push(
    new ethereum.EventParam(
      'nftAddress',
      ethereum.Value.fromAddress(nftAddress),
    ),
  )
  itemListedEvent.parameters.push(
    new ethereum.EventParam(
      'tokenId',
      ethereum.Value.fromUnsignedBigInt(tokenId),
    ),
  )
  itemListedEvent.parameters.push(
    new ethereum.EventParam(
      'quantity',
      ethereum.Value.fromUnsignedBigInt(quantity),
    ),
  )
  itemListedEvent.parameters.push(
    new ethereum.EventParam(
      'pricePerItem',
      ethereum.Value.fromUnsignedBigInt(pricePerItem),
    ),
  )
  itemListedEvent.parameters.push(
    new ethereum.EventParam(
      'expirationTime',
      ethereum.Value.fromUnsignedBigInt(expirationTime),
    ),
  )
  itemListedEvent.parameters.push(
    new ethereum.EventParam(
      'paymentToken',
      ethereum.Value.fromAddress(paymentToken),
    ),
  )

  return itemListedEvent
}

export function createItemSoldEvent(
  seller: Address,
  buyer: Address,
  nftAddress: Address,
  tokenId: BigInt,
  quantity: BigInt,
  pricePerItem: BigInt,
  paymentToken: Address,
): ItemSold {
  let itemSoldEvent = changetype<ItemSold>(newMockEvent())

  itemSoldEvent.parameters = new Array()

  itemSoldEvent.parameters.push(
    new ethereum.EventParam('seller', ethereum.Value.fromAddress(seller)),
  )
  itemSoldEvent.parameters.push(
    new ethereum.EventParam('buyer', ethereum.Value.fromAddress(buyer)),
  )
  itemSoldEvent.parameters.push(
    new ethereum.EventParam(
      'nftAddress',
      ethereum.Value.fromAddress(nftAddress),
    ),
  )
  itemSoldEvent.parameters.push(
    new ethereum.EventParam(
      'tokenId',
      ethereum.Value.fromUnsignedBigInt(tokenId),
    ),
  )
  itemSoldEvent.parameters.push(
    new ethereum.EventParam(
      'quantity',
      ethereum.Value.fromUnsignedBigInt(quantity),
    ),
  )
  itemSoldEvent.parameters.push(
    new ethereum.EventParam(
      'pricePerItem',
      ethereum.Value.fromUnsignedBigInt(pricePerItem),
    ),
  )
  itemSoldEvent.parameters.push(
    new ethereum.EventParam(
      'paymentToken',
      ethereum.Value.fromAddress(paymentToken),
    ),
  )

  return itemSoldEvent
}

export function createItemUpdatedEvent(
  seller: Address,
  nftAddress: Address,
  tokenId: BigInt,
  quantity: BigInt,
  pricePerItem: BigInt,
  expirationTime: BigInt,
  paymentToken: Address,
): ItemUpdated {
  let itemUpdatedEvent = changetype<ItemUpdated>(newMockEvent())

  itemUpdatedEvent.parameters = new Array()

  itemUpdatedEvent.parameters.push(
    new ethereum.EventParam('seller', ethereum.Value.fromAddress(seller)),
  )
  itemUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      'nftAddress',
      ethereum.Value.fromAddress(nftAddress),
    ),
  )
  itemUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      'tokenId',
      ethereum.Value.fromUnsignedBigInt(tokenId),
    ),
  )
  itemUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      'quantity',
      ethereum.Value.fromUnsignedBigInt(quantity),
    ),
  )
  itemUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      'pricePerItem',
      ethereum.Value.fromUnsignedBigInt(pricePerItem),
    ),
  )
  itemUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      'expirationTime',
      ethereum.Value.fromUnsignedBigInt(expirationTime),
    ),
  )
  itemUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      'paymentToken',
      ethereum.Value.fromAddress(paymentToken),
    ),
  )

  return itemUpdatedEvent
}

export function createPausedEvent(account: Address): Paused {
  let pausedEvent = changetype<Paused>(newMockEvent())

  pausedEvent.parameters = new Array()

  pausedEvent.parameters.push(
    new ethereum.EventParam('account', ethereum.Value.fromAddress(account)),
  )

  return pausedEvent
}

export function createRoleAdminChangedEvent(
  role: Bytes,
  previousAdminRole: Bytes,
  newAdminRole: Bytes,
): RoleAdminChanged {
  let roleAdminChangedEvent = changetype<RoleAdminChanged>(newMockEvent())

  roleAdminChangedEvent.parameters = new Array()

  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam('role', ethereum.Value.fromFixedBytes(role)),
  )
  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam(
      'previousAdminRole',
      ethereum.Value.fromFixedBytes(previousAdminRole),
    ),
  )
  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam(
      'newAdminRole',
      ethereum.Value.fromFixedBytes(newAdminRole),
    ),
  )

  return roleAdminChangedEvent
}

export function createRoleGrantedEvent(
  role: Bytes,
  account: Address,
  sender: Address,
): RoleGranted {
  let roleGrantedEvent = changetype<RoleGranted>(newMockEvent())

  roleGrantedEvent.parameters = new Array()

  roleGrantedEvent.parameters.push(
    new ethereum.EventParam('role', ethereum.Value.fromFixedBytes(role)),
  )
  roleGrantedEvent.parameters.push(
    new ethereum.EventParam('account', ethereum.Value.fromAddress(account)),
  )
  roleGrantedEvent.parameters.push(
    new ethereum.EventParam('sender', ethereum.Value.fromAddress(sender)),
  )

  return roleGrantedEvent
}

export function createRoleRevokedEvent(
  role: Bytes,
  account: Address,
  sender: Address,
): RoleRevoked {
  let roleRevokedEvent = changetype<RoleRevoked>(newMockEvent())

  roleRevokedEvent.parameters = new Array()

  roleRevokedEvent.parameters.push(
    new ethereum.EventParam('role', ethereum.Value.fromFixedBytes(role)),
  )
  roleRevokedEvent.parameters.push(
    new ethereum.EventParam('account', ethereum.Value.fromAddress(account)),
  )
  roleRevokedEvent.parameters.push(
    new ethereum.EventParam('sender', ethereum.Value.fromAddress(sender)),
  )

  return roleRevokedEvent
}

export function createTokenApprovalStatusUpdatedEvent(
  nft: Address,
  status: i32,
  paymentToken: Address,
): TokenApprovalStatusUpdated {
  let tokenApprovalStatusUpdatedEvent = changetype<TokenApprovalStatusUpdated>(
    newMockEvent(),
  )

  tokenApprovalStatusUpdatedEvent.parameters = new Array()

  tokenApprovalStatusUpdatedEvent.parameters.push(
    new ethereum.EventParam('nft', ethereum.Value.fromAddress(nft)),
  )
  tokenApprovalStatusUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      'status',
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(status)),
    ),
  )
  tokenApprovalStatusUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      'paymentToken',
      ethereum.Value.fromAddress(paymentToken),
    ),
  )

  return tokenApprovalStatusUpdatedEvent
}

export function createTokenBidCancelledEvent(
  bidder: Address,
  nftAddress: Address,
  tokenId: BigInt,
): TokenBidCancelled {
  let tokenBidCancelledEvent = changetype<TokenBidCancelled>(newMockEvent())

  tokenBidCancelledEvent.parameters = new Array()

  tokenBidCancelledEvent.parameters.push(
    new ethereum.EventParam('bidder', ethereum.Value.fromAddress(bidder)),
  )
  tokenBidCancelledEvent.parameters.push(
    new ethereum.EventParam(
      'nftAddress',
      ethereum.Value.fromAddress(nftAddress),
    ),
  )
  tokenBidCancelledEvent.parameters.push(
    new ethereum.EventParam(
      'tokenId',
      ethereum.Value.fromUnsignedBigInt(tokenId),
    ),
  )

  return tokenBidCancelledEvent
}

export function createTokenBidCreatedOrUpdatedEvent(
  bidder: Address,
  nftAddress: Address,
  tokenId: BigInt,
  quantity: BigInt,
  pricePerItem: BigInt,
  expirationTime: BigInt,
  paymentToken: Address,
): TokenBidCreatedOrUpdated {
  let tokenBidCreatedOrUpdatedEvent = changetype<TokenBidCreatedOrUpdated>(
    newMockEvent(),
  )

  tokenBidCreatedOrUpdatedEvent.parameters = new Array()

  tokenBidCreatedOrUpdatedEvent.parameters.push(
    new ethereum.EventParam('bidder', ethereum.Value.fromAddress(bidder)),
  )
  tokenBidCreatedOrUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      'nftAddress',
      ethereum.Value.fromAddress(nftAddress),
    ),
  )
  tokenBidCreatedOrUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      'tokenId',
      ethereum.Value.fromUnsignedBigInt(tokenId),
    ),
  )
  tokenBidCreatedOrUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      'quantity',
      ethereum.Value.fromUnsignedBigInt(quantity),
    ),
  )
  tokenBidCreatedOrUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      'pricePerItem',
      ethereum.Value.fromUnsignedBigInt(pricePerItem),
    ),
  )
  tokenBidCreatedOrUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      'expirationTime',
      ethereum.Value.fromUnsignedBigInt(expirationTime),
    ),
  )
  tokenBidCreatedOrUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      'paymentToken',
      ethereum.Value.fromAddress(paymentToken),
    ),
  )

  return tokenBidCreatedOrUpdatedEvent
}

export function createUnpausedEvent(account: Address): Unpaused {
  let unpausedEvent = changetype<Unpaused>(newMockEvent())

  unpausedEvent.parameters = new Array()

  unpausedEvent.parameters.push(
    new ethereum.EventParam('account', ethereum.Value.fromAddress(account)),
  )

  return unpausedEvent
}

export function createUpdateCollectionOwnerFeeEvent(
  _collection: Address,
  _recipient: Address,
  _fee: BigInt,
): UpdateCollectionOwnerFee {
  let updateCollectionOwnerFeeEvent = changetype<UpdateCollectionOwnerFee>(
    newMockEvent(),
  )

  updateCollectionOwnerFeeEvent.parameters = new Array()

  updateCollectionOwnerFeeEvent.parameters.push(
    new ethereum.EventParam(
      '_collection',
      ethereum.Value.fromAddress(_collection),
    ),
  )
  updateCollectionOwnerFeeEvent.parameters.push(
    new ethereum.EventParam(
      '_recipient',
      ethereum.Value.fromAddress(_recipient),
    ),
  )
  updateCollectionOwnerFeeEvent.parameters.push(
    new ethereum.EventParam('_fee', ethereum.Value.fromUnsignedBigInt(_fee)),
  )

  return updateCollectionOwnerFeeEvent
}

export function createUpdateFeeEvent(fee: BigInt): UpdateFee {
  let updateFeeEvent = changetype<UpdateFee>(newMockEvent())

  updateFeeEvent.parameters = new Array()

  updateFeeEvent.parameters.push(
    new ethereum.EventParam('fee', ethereum.Value.fromUnsignedBigInt(fee)),
  )

  return updateFeeEvent
}

export function createUpdateFeeRecipientEvent(
  feeRecipient: Address,
): UpdateFeeRecipient {
  let updateFeeRecipientEvent = changetype<UpdateFeeRecipient>(newMockEvent())

  updateFeeRecipientEvent.parameters = new Array()

  updateFeeRecipientEvent.parameters.push(
    new ethereum.EventParam(
      'feeRecipient',
      ethereum.Value.fromAddress(feeRecipient),
    ),
  )

  return updateFeeRecipientEvent
}

export function createUpdateFeeWithCollectionOwnerEvent(
  fee: BigInt,
): UpdateFeeWithCollectionOwner {
  let updateFeeWithCollectionOwnerEvent =
    changetype<UpdateFeeWithCollectionOwner>(newMockEvent())

  updateFeeWithCollectionOwnerEvent.parameters = new Array()

  updateFeeWithCollectionOwnerEvent.parameters.push(
    new ethereum.EventParam('fee', ethereum.Value.fromUnsignedBigInt(fee)),
  )

  return updateFeeWithCollectionOwnerEvent
}

export function createUpdateSalesTrackerEvent(
  _priceTrackerAddress: Address,
): UpdateSalesTracker {
  let updateSalesTrackerEvent = changetype<UpdateSalesTracker>(newMockEvent())

  updateSalesTrackerEvent.parameters = new Array()

  updateSalesTrackerEvent.parameters.push(
    new ethereum.EventParam(
      '_priceTrackerAddress',
      ethereum.Value.fromAddress(_priceTrackerAddress),
    ),
  )

  return updateSalesTrackerEvent
}
