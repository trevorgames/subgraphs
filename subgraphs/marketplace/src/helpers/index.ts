import { BigDecimal } from '@graphprotocol/graph-ts'

export * from './constants'
export * from './collection'
export * from './token'
export * from './user'
export * from './user-token'
export * from './listing'
export * from './pricing'

export function min(a: BigDecimal, b: BigDecimal): BigDecimal {
  return a.lt(b) ? a : b
}

export function max(a: BigDecimal, b: BigDecimal): BigDecimal {
  return a.lt(b) ? b : a
}
