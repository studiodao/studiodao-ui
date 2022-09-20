import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { useWallet } from 'hooks/Wallet'
import { useContext } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbers'
import { ContractName } from 'models/contracts'

import useContractReader from './contractReader'

/** Returns unclaimed balance of user with `userAddress`. */
export default function useUserUnclaimedTokenBalance(projectId: BigNumberish | undefined,) {
  const { userAddress } = useWallet()


  return useContractReader<BigNumber>({
    contract: ContractName.JBTokenStore,
    functionName: 'unclaimedBalanceOf',
    args:
      userAddress && projectId
        ? [userAddress, BigNumber.from(projectId).toHexString()]
        : null,
    valueDidChange: bigNumbersDiff,
    // updateOn: TODO: useShouldUpdateTokens(projectId, terminal?.name, userAddress),
  })
}
