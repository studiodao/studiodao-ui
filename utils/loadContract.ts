import { Contract, ContractInterface } from '@ethersproject/contracts'
import { NetworkName } from 'models/networkName'
import { ContractName } from 'models/contracts'
import { SignerOrProvider } from 'utils/types'
import {
  getLatestNftDelegateStoreContractAddress,
  getLatestNftProjectDeployerContractAddress,
} from 'utils/nftRewards'

import { mainnetPublicResolver } from 'constants/contracts/mainnet/PublicResolver'
import { rinkebyPublicResolver } from 'constants/contracts/rinkeby/PublicResolver'
import { NETWORKS_BY_NAME } from 'constants/networks'
import {
  VENFT_DEPLOYER_ADDRESS,
  VENFT_RESOLVER_ADDRESS,
} from 'constants/veNft/veNftProject'

export const loadContract = async (
  contractName: ContractName,
  network: NetworkName,
  signerOrProvider: SignerOrProvider,
): Promise<Contract | undefined> => {
  let contractJson: { abi: ContractInterface; address: string } | undefined =
    undefined

  if (contractName === ContractName.JBProjectHandles) {
    contractJson = await loadJBProjectHandlesContract(network)
  } else if (contractName === ContractName.PublicResolver) {
    contractJson = loadPublicResolverContract(network)
  } else if (
    contractName === ContractName.JBTiered721DelegateProjectDeployer
  ) {
    contractJson = await loadJBTiered721DelegateProjectDeployerContract()
  } else if (contractName === ContractName.JBTiered721DelegateStore) {
    contractJson = await loadJBTiered721DelegateStoreContract()
  } else if (contractName === ContractName.JBVeNftDeployer) {
    contractJson = await loadVeNftDeployer()
  } else if (contractName === ContractName.JBVeTokenUriResolver) {
    contractJson = await loadVeTokenUriResolver()
  } else {
    contractJson = await loadJuiceboxV2Contract(contractName, network)
  }

  if (!contractJson) {
    throw new Error(
      `Error importing contract ${contractName}. Network: ${network})`,
    )
  }

  return new Contract(contractJson.address, contractJson.abi, signerOrProvider)
}

interface ForgeDeploy {
  receipts: { contractAddress: string }[]
}

/**
 *  Defines the ABI filename to use for a given V2ContractName.
 */
const CONTRACT_ABI_OVERRIDES: {
  [k in ContractName]?: { filename: string; version: string }
} = {
  DeprecatedJBController: {
    version: '4.0.0',
    filename: 'JBController',
  },
  DeprecatedJBSplitsStore: {
    version: '4.0.0',
    filename: 'JBSplitsStore',
  },
  DeprecatedJBDirectory: {
    version: '4.0.0',
    filename: 'JBDirectory',
  },
}

const loadJBProjectHandlesContract = async (network: NetworkName) => {
  const contractJson = {
    abi: (
      await import(
        `@jbx-protocol/project-handles/out/JBProjectHandles.sol/JBProjectHandles.json`
      )
    ).abi,
    address: (
      (await import(
        `@jbx-protocol/project-handles/broadcast/Deploy.sol/${NETWORKS_BY_NAME[network].chainId}/run-latest.json`
      )) as ForgeDeploy
    ).receipts[0].contractAddress, // contractAddress is prefixed `0x0x` in error, trim first `0x`
  }

  return contractJson
}

const loadPublicResolverContract = (network: NetworkName) => {
  // ENS contracts package currently doesn't include rinkeby information, and ABI contains errors
  if (network === NetworkName.mainnet) return mainnetPublicResolver
  if (network === NetworkName.rinkeby) return rinkebyPublicResolver
}

const loadJuiceboxV2Contract = async (
  contractName: ContractName,
  network: NetworkName,
) => {
  const contractOverride = CONTRACT_ABI_OVERRIDES[contractName]
  const version = 'latest'
  const filename = contractOverride?.filename ?? contractName
  return await import(
    `@jbx-protocol/contracts-v2-${version}/deployments/${network}/${filename}.json`
  )
}

const loadJBTiered721DelegateProjectDeployerContract = async () => {
  const JBTiered721DelegateProjectDeployerContractAddress =
    await getLatestNftProjectDeployerContractAddress()

  const nftDeployerContractJson = {
    address: JBTiered721DelegateProjectDeployerContractAddress,
    abi: (
      await import(
        `@jbx-protocol/juice-nft-rewards/out/IJBTiered721DelegateProjectDeployer.sol/IJBTiered721DelegateProjectDeployer.json`
      )
    ).abi,
  }

  return nftDeployerContractJson
}

const loadJBTiered721DelegateStoreContract = async () => {
  const JBTiered721DelegateStoreContractAddress =
    await getLatestNftDelegateStoreContractAddress()

  const nftDeployerContractJson = {
    address: JBTiered721DelegateStoreContractAddress,
    abi: (
      await import(
        `@jbx-protocol/juice-nft-rewards/out/IJBTiered721DelegateStore.sol/IJBTiered721DelegateStore.json`
      )
    ).abi,
  }

  return nftDeployerContractJson
}

const loadVeNftDeployer = async () => {
  const contractJson = {
    abi: (
      await import(
        `@jbx-protocol/ve-nft/out/JBVeNftDeployer.sol/JBVeNftDeployer.json`
      )
    ).abi,
    address: VENFT_DEPLOYER_ADDRESS,
    // TODO: replace when broadcast is updated
    // address: (
    //   (await import(
    //     `@jbx-protocol/ve-nft/broadcast/deploy.sol/${NETWORKS_BY_NAME[network].chainId}/run-latest.json`
    //   )) as ForgeDeploy
    // ).receipts[0].contractAddress,
  }

  return contractJson
}

const loadVeTokenUriResolver = async () => {
  const contractJson = {
    abi: (
      await import(
        `@jbx-protocol/ve-nft/out/JBVeTokenUriResolver.sol/JBVeTokenUriResolver.json`
      )
    ).abi,
    address: VENFT_RESOLVER_ADDRESS,
    // TODO: replace when broadcast is updated
    // address: (
    //   (await import(
    //     `@jbx-protocol/ve-nft/broadcast/deploy.sol/${NETWORKS_BY_NAME[network].chainId}/run-latest.json`
    //   )) as ForgeDeploy
    // ).receipts[1].contractAddress,
  }

  return contractJson
}

export const loadVeNftContract = async (
  signerOrProvider: SignerOrProvider,
  address: string,
) => {
  const contractJson = {
    abi: (await import(`@jbx-protocol/ve-nft/out/JBVeNft.sol/JBVeNft.json`))
      .abi,
    address,
  }

  return new Contract(contractJson.address, contractJson.abi, signerOrProvider)
}
