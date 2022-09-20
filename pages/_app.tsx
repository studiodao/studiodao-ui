import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'

import { BigNumber } from '@ethersproject/bignumber'
import coinbaseWalletModule from '@web3-onboard/coinbase'
import gnosisModule from '@web3-onboard/gnosis'
import injectedModule from '@web3-onboard/injected-wallets'
import keystoneModule from '@web3-onboard/keystone'
import ledgerModule from '@web3-onboard/ledger'
import { init, useAccountCenter, useWallets } from '@web3-onboard/react'
import walletConnectModule from '@web3-onboard/walletconnect'
import { unpadLeadingZerosString } from 'utils/bigNumbers'
import { NETWORKS } from 'constants/networks'
import { ReactQueryDevtools } from 'react-query/devtools'

import {
  useLoadWalletFromLocalStorage,
  useStoreWalletsInLocalStorage,
} from 'hooks/Network'


const injected = injectedModule()
const gnosis = gnosisModule()
const ledger = ledgerModule()
const keystone = keystoneModule()
const walletConnect = walletConnectModule()
const coinbaseWalletSdk = coinbaseWalletModule()

init({
  wallets: [
    injected,
    gnosis,
    ledger,
    keystone,
    walletConnect,
    coinbaseWalletSdk,
  ],
  chains: Object.values(NETWORKS).map(n => ({
    id: unpadLeadingZerosString(BigNumber.from(n.chainId).toHexString()),
    rpcUrl: n.rpcUrl,
    token: n.token ?? 'ETH',
    label: n.name,
  })),
  appMetadata: {
    icon: 'https://assets.website-files.com/62c4a1bbbb81016b15e64da5/62c4b4c079fd5838d3f8ccb5_StudioDao_Type01.svg',
    name: 'StudioDao',
    description: 'the first million person movie studio',
  },
})

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {
  const updateAccountCenter = useAccountCenter()
  const loadWalletFromLocalStorage = useLoadWalletFromLocalStorage()
  const storeWalletsInLocalStorage = useStoreWalletsInLocalStorage()
  const connectedWallets = useWallets()

  // Load any previously connected wallets
  useEffect(() => {
    loadWalletFromLocalStorage()
  }, [loadWalletFromLocalStorage])

  // store any wallets
  useEffect(() => {
    storeWalletsInLocalStorage(connectedWallets)
  }, [storeWalletsInLocalStorage, connectedWallets])

  // disable account center in web3-onboard
  useEffect(() => {
    updateAccountCenter({ enabled: false })
  }, [updateAccountCenter])
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={true} />
      <Component {...pageProps} />
    </QueryClientProvider>
  )
}

export default MyApp
