import { ContractName } from 'models/contracts'
import { BigNumberish } from '@ethersproject/bignumber'

import useContractReader from './contractReader'

export default function useProjectToken({ projectId }: { projectId?: BigNumberish }) {
  return useContractReader<string>({
    contract: ContractName.JBTokenStore,
    functionName: 'tokenOf',
    args: projectId ? [projectId] : null,
  })
}
