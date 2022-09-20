import { CrownOutlined, LogoutOutlined } from '@ant-design/icons'
import { Dropdown, Menu } from 'antd'
import { ItemType } from 'antd/lib/menu/hooks/useItems'
import CopyTextButton from 'components/CopyTextButton'
import EtherscanLink from 'components/EtherscanLink'
import FormattedAddress from 'components/FormattedAddress'
import { useWallet } from 'hooks/Wallet'
import Link from 'next/link'
import { useContext } from 'react'
import Balance from './Balance'

export default function Wallet({ userAddress }: { userAddress: string }) {
  

  const isMobile = false
  const primaryTextColor = 'black'
  const backgroundColor = '#d3ffdb'

  const height = 45

  const { disconnect } = useWallet()

  const CopyableAddress = () => (
    <div style={{ color: primaryTextColor }}>
      <EtherscanLink value={userAddress} type="address" truncated />{' '}
      <CopyTextButton value={userAddress} style={{ zIndex: 1 }} />
    </div>
  )

  const Disconnect = () => (
    <>
      <span style={{ color: primaryTextColor }}>
        Disconnect 
      </span>
      <LogoutOutlined style={{ color: primaryTextColor, marginLeft:'5px' }} rotate={-90} />
    </>
  )

  const items: ItemType[] = [
    {
      key: 0,
      label: <CopyableAddress />,
    },
  ]
  if (!isMobile) {
    items.push({
      key: 2,
      label: <Disconnect />,
      onClick: async () => {
        await disconnect()
      },
    })
  }

  return (
    <Dropdown
      overlay={<Menu items={items} />}
      placement={!isMobile ? 'bottomRight' : 'top'}
      overlayStyle={{ padding: 0 }}
    >
      <div
        style={{
          height,
          borderRadius: 2,
          padding: '4px 19px 7px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: backgroundColor,
          cursor: 'default',
          userSelect: 'all',
          width: '100%',
        }}
      >
        <FormattedAddress address={userAddress} tooltipDisabled={true} />
        <Balance address={userAddress} hideTooltip />
      </div>
    </Dropdown>
  )
}
