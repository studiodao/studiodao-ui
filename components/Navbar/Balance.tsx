import EthPrice from 'components/Navbar/EthPrice'

import { useEthBalanceQuery } from 'hooks/EthBalance'
import { useContext } from 'react'

import ETHAmount from 'components/currency/ETHAmount'

export default function Balance({
  address,
  showEthPrice,
  hideTooltip,
}: {
  address: string | undefined
  showEthPrice?: boolean
  hideTooltip?: boolean
}) {

  const tertiaryColor = 'black'
  const { data: balance } = useEthBalanceQuery(address)

  return (
    <div
      style={{
        verticalAlign: 'middle',
        lineHeight: 1,
        color: tertiaryColor,
      }}
    >
      <ETHAmount amount={balance} fallback="--" hideTooltip={hideTooltip} />

      {showEthPrice && (
        <div style={{ color: tertiaryColor }}>
          <EthPrice />
        </div>
      )}
    </div>
  )
}
