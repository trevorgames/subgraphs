import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll,
} from 'matchstick-as/assembly/index'
import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts'
import { BidAccepted } from '../generated/schema'
import { BidAccepted as BidAcceptedEvent } from '../generated/TrevorMarketplace/TrevorMarketplace'
import { handleBidAccepted } from '../src/trevor-marketplace'
import { createBidAcceptedEvent } from './trevor-marketplace-utils'

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe('Describe entity assertions', () => {
  beforeAll(() => {
    let seller = Address.fromString(
      '0x0000000000000000000000000000000000000001',
    )
    let bidder = Address.fromString(
      '0x0000000000000000000000000000000000000001',
    )
    let nftAddress = Address.fromString(
      '0x0000000000000000000000000000000000000001',
    )
    let tokenId = BigInt.fromI32(234)
    let quantity = BigInt.fromI32(234)
    let pricePerItem = BigInt.fromI32(234)
    let paymentToken = Address.fromString(
      '0x0000000000000000000000000000000000000001',
    )
    let bidType = 123
    let newBidAcceptedEvent = createBidAcceptedEvent(
      seller,
      bidder,
      nftAddress,
      tokenId,
      quantity,
      pricePerItem,
      paymentToken,
      bidType,
    )
    handleBidAccepted(newBidAcceptedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test('BidAccepted created and stored', () => {
    assert.entityCount('BidAccepted', 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      'BidAccepted',
      '0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1',
      'seller',
      '0x0000000000000000000000000000000000000001',
    )
    assert.fieldEquals(
      'BidAccepted',
      '0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1',
      'bidder',
      '0x0000000000000000000000000000000000000001',
    )
    assert.fieldEquals(
      'BidAccepted',
      '0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1',
      'nftAddress',
      '0x0000000000000000000000000000000000000001',
    )
    assert.fieldEquals(
      'BidAccepted',
      '0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1',
      'tokenId',
      '234',
    )
    assert.fieldEquals(
      'BidAccepted',
      '0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1',
      'quantity',
      '234',
    )
    assert.fieldEquals(
      'BidAccepted',
      '0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1',
      'pricePerItem',
      '234',
    )
    assert.fieldEquals(
      'BidAccepted',
      '0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1',
      'paymentToken',
      '0x0000000000000000000000000000000000000001',
    )
    assert.fieldEquals(
      'BidAccepted',
      '0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1',
      'bidType',
      '123',
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
