import { BigNumber } from '@ethersproject/bignumber'
import {
  parseParticipantJson,
  ParticipantJson,
} from 'models/subgraph-entities/participant'

import { CV } from '../cv'

import { Participant } from './participant'

type BaseProject = {
  id: string
  projectId: number
  cv: CV
  owner: string
  createdAt: number
  trendingPaymentsCount: number
  trendingScore: BigNumber
  trendingVolume: BigNumber
  createdWithinTrendingWindow: boolean
  totalPaid: BigNumber
  totalRedeemed: BigNumber
  currentBalance: BigNumber
  participants: Partial<Participant>[]
  userTokenBalance?: any
}

type ProjectV1 = {
  terminal: string
  metadataUri: string
  metadataDomain: null
  handle: string
} & BaseProject

type ProjectV2 = {
  terminal: null
  metadataUri: string
  metadataDomain: BigNumber
  handle: null
} & BaseProject

export type Project = ProjectV1 | ProjectV2 // Separate entity used for testing

export type ProjectJson = Partial<
  Omit<
    Project,
    | 'participants'
    | 'printPremineEvents'
    | 'payEvents'
    | 'tapEvents'
    | 'redeemEvents'
    | 'printReservesEvents'
    | 'deployedERC20Events'
    | 'distributeToPayoutModEvents'
    | 'distributeToTicketModEvents'
    | 'trendingScore'
    | 'trendingVolume'
    | 'totalPaid'
    | 'totalRedeemed'
    | 'currentBalance'
    | 'veNftContract'
  > & {
    participants: ParticipantJson[]
    trendingScore: string
    trendingVolume: string
    totalPaid: string
    totalRedeemed: string
    currentBalance: string
  }
>

export const parseProjectJson = (project: ProjectJson): Partial<Project> =>
  ({
    ...project,
    currentBalance: project.currentBalance
      ? BigNumber.from(project.currentBalance)
      : undefined,
    totalPaid: project.totalPaid
      ? BigNumber.from(project.totalPaid)
      : undefined,
    totalRedeemed: project.totalRedeemed
      ? BigNumber.from(project.totalRedeemed)
      : undefined,
    participants: project.participants?.map(parseParticipantJson) ?? undefined,
    trendingVolume: project.trendingVolume
      ? BigNumber.from(project.trendingVolume)
      : undefined,
    trendingScore: project.trendingScore
      ? BigNumber.from(project.trendingScore)
      : undefined,
  } as Project)
