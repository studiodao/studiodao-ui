import { useWallet } from 'hooks/Wallet'
import { ContractName, Contracts } from 'models/contracts'
import { useEffect, useState } from 'react'

import { loadContract } from 'utils/loadContract'

import { readNetwork } from 'constants/networks'
import { readProvider } from 'constants/readProvider'

export function useContractLoader() {
  const { signer } = useWallet()
  const [contracts, setContracts] = useState<Contracts>()

  useEffect(() => {
    async function loadContracts() {
      try {
        const network = readNetwork.name

        // Contracts can be used read-only without a signer, but require a signer to create transactions.
        const signerOrProvider = signer ?? readProvider

        const contractLoaders = await Promise.all(
          Object.values(ContractName).map(contractName =>
            loadContract(contractName, network, signerOrProvider),
          ),
        )

        const newContractMap = Object.values(ContractName).reduce(
          (accumulator, contractName, idx) => ({
            ...accumulator,
            [contractName]: contractLoaders[idx],
          }),
          {} as Contracts,
        )

        setContracts(newContractMap)
      } catch (e) {
        console.error('CONTRACT LOADER ERROR:', e)
      }
    }

    loadContracts()
  }, [setContracts, signer])

  return contracts
}
