import {
  BidAccepted as BidAcceptedEvent,
  CollectionBidCancelled as CollectionBidCancelledEvent,
  CollectionBidCreatedOrUpdated as CollectionBidCreatedOrUpdatedEvent,
  Initialized as InitializedEvent,
  ItemCanceled as ItemCanceledEvent,
  ItemListed as ItemListedEvent,
  ItemSold as ItemSoldEvent,
  ItemUpdated as ItemUpdatedEvent,
  Paused as PausedEvent,
  RoleAdminChanged as RoleAdminChangedEvent,
  RoleGranted as RoleGrantedEvent,
  RoleRevoked as RoleRevokedEvent,
  TokenApprovalStatusUpdated as TokenApprovalStatusUpdatedEvent,
  TokenBidCancelled as TokenBidCancelledEvent,
  TokenBidCreatedOrUpdated as TokenBidCreatedOrUpdatedEvent,
  Unpaused as UnpausedEvent,
  UpdateCollectionOwnerFee as UpdateCollectionOwnerFeeEvent,
  UpdateFee as UpdateFeeEvent,
  UpdateFeeRecipient as UpdateFeeRecipientEvent,
  UpdateFeeWithCollectionOwner as UpdateFeeWithCollectionOwnerEvent,
  UpdateSalesTracker as UpdateSalesTrackerEvent,
} from '../generated/TrevorMarketplace/TrevorMarketplace'
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
} from '../generated/schema'

export function handleBidAccepted(event: BidAcceptedEvent): void {
  let entity = new BidAccepted(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.seller = event.params.seller
  entity.bidder = event.params.bidder
  entity.nftAddress = event.params.nftAddress
  entity.tokenId = event.params.tokenId
  entity.quantity = event.params.quantity
  entity.pricePerItem = event.params.pricePerItem
  entity.paymentToken = event.params.paymentToken
  entity.bidType = event.params.bidType

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCollectionBidCancelled(
  event: CollectionBidCancelledEvent,
): void {
  let entity = new CollectionBidCancelled(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.bidder = event.params.bidder
  entity.nftAddress = event.params.nftAddress

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCollectionBidCreatedOrUpdated(
  event: CollectionBidCreatedOrUpdatedEvent,
): void {
  let entity = new CollectionBidCreatedOrUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.bidder = event.params.bidder
  entity.nftAddress = event.params.nftAddress
  entity.quantity = event.params.quantity
  entity.pricePerItem = event.params.pricePerItem
  entity.expirationTime = event.params.expirationTime
  entity.paymentToken = event.params.paymentToken

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleInitialized(event: InitializedEvent): void {
  let entity = new Initialized(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.version = event.params.version

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleItemCanceled(event: ItemCanceledEvent): void {
  let entity = new ItemCanceled(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.seller = event.params.seller
  entity.nftAddress = event.params.nftAddress
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleItemListed(event: ItemListedEvent): void {
  let entity = new ItemListed(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.seller = event.params.seller
  entity.nftAddress = event.params.nftAddress
  entity.tokenId = event.params.tokenId
  entity.quantity = event.params.quantity
  entity.pricePerItem = event.params.pricePerItem
  entity.expirationTime = event.params.expirationTime
  entity.paymentToken = event.params.paymentToken

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleItemSold(event: ItemSoldEvent): void {
  let entity = new ItemSold(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.seller = event.params.seller
  entity.buyer = event.params.buyer
  entity.nftAddress = event.params.nftAddress
  entity.tokenId = event.params.tokenId
  entity.quantity = event.params.quantity
  entity.pricePerItem = event.params.pricePerItem
  entity.paymentToken = event.params.paymentToken

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleItemUpdated(event: ItemUpdatedEvent): void {
  let entity = new ItemUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.seller = event.params.seller
  entity.nftAddress = event.params.nftAddress
  entity.tokenId = event.params.tokenId
  entity.quantity = event.params.quantity
  entity.pricePerItem = event.params.pricePerItem
  entity.expirationTime = event.params.expirationTime
  entity.paymentToken = event.params.paymentToken

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePaused(event: PausedEvent): void {
  let entity = new Paused(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.account = event.params.account

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRoleAdminChanged(event: RoleAdminChangedEvent): void {
  let entity = new RoleAdminChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.role = event.params.role
  entity.previousAdminRole = event.params.previousAdminRole
  entity.newAdminRole = event.params.newAdminRole

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRoleGranted(event: RoleGrantedEvent): void {
  let entity = new RoleGranted(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.role = event.params.role
  entity.account = event.params.account
  entity.sender = event.params.sender

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRoleRevoked(event: RoleRevokedEvent): void {
  let entity = new RoleRevoked(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.role = event.params.role
  entity.account = event.params.account
  entity.sender = event.params.sender

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTokenApprovalStatusUpdated(
  event: TokenApprovalStatusUpdatedEvent,
): void {
  let entity = new TokenApprovalStatusUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.nft = event.params.nft
  entity.status = event.params.status
  entity.paymentToken = event.params.paymentToken

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTokenBidCancelled(event: TokenBidCancelledEvent): void {
  let entity = new TokenBidCancelled(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.bidder = event.params.bidder
  entity.nftAddress = event.params.nftAddress
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTokenBidCreatedOrUpdated(
  event: TokenBidCreatedOrUpdatedEvent,
): void {
  let entity = new TokenBidCreatedOrUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.bidder = event.params.bidder
  entity.nftAddress = event.params.nftAddress
  entity.tokenId = event.params.tokenId
  entity.quantity = event.params.quantity
  entity.pricePerItem = event.params.pricePerItem
  entity.expirationTime = event.params.expirationTime
  entity.paymentToken = event.params.paymentToken

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUnpaused(event: UnpausedEvent): void {
  let entity = new Unpaused(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.account = event.params.account

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUpdateCollectionOwnerFee(
  event: UpdateCollectionOwnerFeeEvent,
): void {
  let entity = new UpdateCollectionOwnerFee(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity._collection = event.params._collection
  entity._recipient = event.params._recipient
  entity._fee = event.params._fee

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUpdateFee(event: UpdateFeeEvent): void {
  let entity = new UpdateFee(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.fee = event.params.fee

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUpdateFeeRecipient(event: UpdateFeeRecipientEvent): void {
  let entity = new UpdateFeeRecipient(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.feeRecipient = event.params.feeRecipient

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUpdateFeeWithCollectionOwner(
  event: UpdateFeeWithCollectionOwnerEvent,
): void {
  let entity = new UpdateFeeWithCollectionOwner(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.fee = event.params.fee

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUpdateSalesTracker(event: UpdateSalesTrackerEvent): void {
  let entity = new UpdateSalesTracker(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity._priceTrackerAddress = event.params._priceTrackerAddress

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
