import { NetworkName } from "models/networkName";
import { readNetwork } from "constants/networks";

const ProjectIdsByNetwork: Partial<Record<NetworkName, number[]>> = {
  [NetworkName.mainnet]: [],
  [NetworkName.rinkeby]: [4630, 4631, 4633, 4639],
};

export const StudioDaoProjectIds = ProjectIdsByNetwork[readNetwork.name] ?? [];
