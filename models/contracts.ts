import { Contract } from "@ethersproject/contracts";

export enum ContractName {
  // ERC20 = "ERC20",
  // ERC721 = "ERC721",
  // Prices = 'Prices',
  JBController = 'JBController',
  JBDirectory = 'JBDirectory',
  JBETHPaymentTerminal = 'JBETHPaymentTerminal',
  JBFundingCycleStore = 'JBFundingCycleStore',
  JBOperatorStore = 'JBOperatorStore',
  JBPrices = 'JBPrices',
  JBProjects = 'JBProjects',
  JBSplitsStore = 'JBSplitsStore',
  JBTokenStore = 'JBTokenStore',
  JBSingleTokenPaymentTerminalStore = 'JBSingleTokenPaymentTerminalStore',
  JBETHERC20ProjectPayerDeployer = 'JBETHERC20ProjectPayerDeployer',

  JBProjectHandles = 'JBProjectHandles',
  PublicResolver = 'PublicResolver',

  JBVeNftDeployer = 'JBVeNftDeployer',
  JBVeTokenUriResolver = 'JBVeTokenUriResolver',


  DeprecatedJBController = 'DeprecatedJBController',
  DeprecatedJBSplitsStore = 'DeprecatedJBSplitsStore',
  DeprecatedJBDirectory = 'DeprecatedJBDirectory',

  JBTiered721DelegateProjectDeployer = 'JBTiered721DelegateProjectDeployer',
  JBTiered721DelegateStore = 'JBTiered721DelegateStore',
}

export type Contracts = Record<ContractName, Contract>;
