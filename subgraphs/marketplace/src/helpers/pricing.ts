import { Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts'
// import { Factory } from '../../generated/TrevorMarketplace/Factory'
import { Pair } from '../../generated/TrevorMarketplace/Pair'
import { BIG_DECIMAL_ZERO } from './constants'

// export const factoryContract = Factory.bind(Address.fromHexString(''))

const STABLE_TOKEN_ADDRESSES: Address[] = [
  Address.fromString('0x8556Bcbf3C4104Bea0465d9fCaBf1b74293CF936'),
]
const STABLE_POOL_ADDRESSES: Address[] = [
  Address.fromString('0x0ae4240b3c5171b81ceb33f3dfbd1d7c5879ab59'),
]

const TRV_NATIVE_POOL_ADDRESS = Address.fromString(
  '0xe71ab7ef9ad5c63f2194d69129cd6a163a687a17',
)

const TRV_ADDRESS = Address.fromString(
  '0x0D2191DC1E93f62d4Da99A011bB29DF652a5e8EB',
)

const TRV_NATIVE_PAIR = Pair.bind(TRV_NATIVE_POOL_ADDRESS)

export function getTRVPriceInNative(): BigDecimal {
  const getReservesResult = TRV_NATIVE_PAIR.getReserves()
  const reserve0 = getReservesResult.value0.toBigDecimal()
  const reserve1 = getReservesResult.value1.toBigDecimal()

  const token0 = TRV_NATIVE_PAIR.token0()
  const trvFirst = token0 == TRV_ADDRESS

  return trvFirst ? reserve1.div(reserve0) : reserve0.div(reserve1)
}

export function getTRVPriceInUSD(): BigDecimal {
  return getTRVPriceInNative().times(getNativePriceInUSD())
}

export function getNativePriceInUSD(): BigDecimal {
  let count = 0
  let weightedPrice = BIG_DECIMAL_ZERO
  let nativeReserve = BIG_DECIMAL_ZERO
  let nativeReserves: BigDecimal[] = []
  let stablePrices: BigDecimal[] = []

  for (let i = 0; i < STABLE_POOL_ADDRESSES.length; i++) {
    const pairAddress = STABLE_POOL_ADDRESSES[i]

    const stablePair = Pair.bind(pairAddress)

    const stableFirst = STABLE_TOKEN_ADDRESSES.includes(stablePair.token0())

    let getReservesResult = stablePair.getReserves()
    let reserve0: BigDecimal
    let reserve1: BigDecimal

    if (stableFirst) {
      reserve0 = convertTokenToDecimal(
        getReservesResult.get_reserve0(),
        BigInt.fromI32(6),
      )
      reserve1 = convertTokenToDecimal(
        getReservesResult.get_reserve1(),
        BigInt.fromI32(18),
      )
    } else {
      reserve1 = convertTokenToDecimal(
        getReservesResult.get_reserve1(),
        BigInt.fromI32(6),
      )
      reserve0 = convertTokenToDecimal(
        getReservesResult.get_reserve1(),
        BigInt.fromI32(18),
      )
    }

    nativeReserve = nativeReserve.plus(!stableFirst ? reserve0 : reserve1)

    nativeReserves.push(!stableFirst ? reserve0 : reserve1)

    if (stableFirst) {
      stablePrices.push(reserve0.div(reserve1))
    } else {
      stablePrices.push(reserve1.div(reserve0))
    }

    count = count + 1
  }

  if (count > 0) {
    for (let j = 0; j < count; j++) {
      const price = stablePrices[j]
      const weight = nativeReserves[j].div(nativeReserve)
      weightedPrice = weightedPrice.plus(price.times(weight))
    }
  }

  return weightedPrice
}

export function convertTokenToDecimal(
  tokenAmount: BigInt,
  exchangeDecimals: BigInt,
): BigDecimal {
  if (exchangeDecimals == BigInt.fromI32(0)) {
    return tokenAmount.toBigDecimal()
  }
  return tokenAmount.toBigDecimal().div(exponentToBigDecimal(exchangeDecimals))
}

function exponentToBigDecimal(decimals: BigInt): BigDecimal {
  let bd = BigDecimal.fromString('1')
  for (
    let i = BigInt.fromI32(0);
    i.lt(decimals as BigInt);
    i = i.plus(BigInt.fromI32(1))
  ) {
    bd = bd.times(BigDecimal.fromString('10'))
  }
  return bd
}
