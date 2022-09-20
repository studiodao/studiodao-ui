import { BigNumber } from '@ethersproject/bignumber'
import { UserContext } from 'contexts/userContext'
import { useContractLoader } from 'hooks/contractLoader'

type Props = {
  children: React.ReactNode
}

export const UserProvider: React.FC<Props> = ({ children  }) => {
  const contracts = useContractLoader()
  console.info("loading contract loader")
  console.info(contracts)
  const version = 'v2'
  return (
    <UserContext.Provider
      value={{
        contracts,
        version
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
