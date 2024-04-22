import { BigDecimal, BigInt } from '@graphprotocol/graph-ts'

export const BIGINT_ZERO = BigInt.zero()
export const BIGINT_ONE = BigInt.fromI32(1)

export const BIG_DECIMAL_ZERO = BigDecimal.zero()
export const BIG_DECIMAL_MAX = BigInt.fromI32(i32.MAX_VALUE).toBigDecimal()
export const MANTISSA_FACTOR = BigInt.fromI32(10).pow(18).toBigDecimal()
export const SECONDS_PER_DAY = 24 * 60 * 60

export const ERC721_INTERFACE_IDENTIFIER = '0x80ac58cd'
export const ERC1155_INTERFACE_IDENTIFIER = '0xd9b67a26'

export namespace Network {
  export const TREVOR_SEPOLIA = 'trevor-sepolia'
}
