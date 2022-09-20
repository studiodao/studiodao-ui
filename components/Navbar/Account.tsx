import { Button, Space } from 'antd'

import { useWallet } from '../../hooks/Wallet'

import Wallet from './Wallet'

export default function Account() {
  const {
    userAddress,
    isConnected,
    connect,
    chainUnsupported,
    changeNetworks,
  } = useWallet()

  const warnColor = 'blue'

  if (!isConnected) {
    return (
      <Button onClick={() => connect()} block>
        <a>Connect</a>
      </Button>
    )
  }

  if (!userAddress) return null

  if (chainUnsupported) {
    return (
      <Space direction="horizontal">
        {chainUnsupported && (
          <Button
            size="small"
            style={{
              borderColor: warnColor,
              color: warnColor,
            }}
            onClick={changeNetworks}
          >
            Wrong network
          </Button>
        )}
        <Wallet userAddress={userAddress} />
      </Space>
    )
  }

  return <Wallet userAddress={userAddress} />
}
