import { Contracts } from "../models/contracts";
import { createContext } from "react";

export const UserContext: React.Context<{
  contracts?: Contracts;
  version: 'v2';
}> = createContext({version: 'v2'});
