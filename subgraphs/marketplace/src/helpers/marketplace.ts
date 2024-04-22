import { Bytes } from '@graphprotocol/graph-ts'
import { Marketplace } from '../../generated/schema'
import { BIG_DECIMAL_ZERO, Network } from './constants'

export function getOrCreateMarketplace(id: Bytes): Marketplace {
  let marketplace = Marketplace.load(id)

  if (!marketplace) {
    marketplace = new Marketplace(id)
    // marketplace.name = 'Trevor Marketplace'
    // marketplace.slug = 'trevor-marketplace'
    // marketplace.network = Network.TREVOR_SEPOLIA
    // marketplace.schemaVersion = '1.0.0' // TODO
    // marketplace.subgraphVersion = '1.0.0' // TODO
    // marketplace.methodologyVersion = '1.0.0' // TODO
    // marketplace.collectionCount = 0
    // marketplace.tradeCount = 0
    // marketplace.cumulativeTradeVolumeETH = BIG_DECIMAL_ZERO
    // marketplace.marketplaceRevenueETH = BIG_DECIMAL_ZERO
    // marketplace.creatorRevenueETH = BIG_DECIMAL_ZERO
    // marketplace.totalRevenueETH = BIG_DECIMAL_ZERO
    // marketplace.cumulativeUniqueTraders = 0
    marketplace.save()
  }

  return marketplace
}
