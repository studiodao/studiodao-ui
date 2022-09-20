import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { ContractName } from 'models/contracts'
import { bigNumbersDiff } from 'utils/bigNumbers'

import useContractReader from './contractReader'
import {ContractReadResult} from './contractReader'

/** Returns combined ERC20 + unclaimed balance of user with `userAddress`. */
export default function useTotalBalanceOf(
  userAddress: string | undefined,
  projectId: BigNumberish | undefined,
) {
  return useContractReader<BigNumber>({
    contract: ContractName.JBTokenStore,
    functionName: 'balanceOf',
    args:
      userAddress && projectId
        ? [userAddress, BigNumber.from(projectId).toHexString()]
        : null,
    valueDidChange: bigNumbersDiff,
    // TODO: updateOn: useShouldUpdateTokens(projectId, terminalName, userAddress),
  })
}
