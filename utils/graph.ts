// TODO: Should we fix these ts-ignore. At very least, we should consider documenting why it is done

import axios from 'axios'
import { CV } from 'models/cv'

import {
  parseProjectJson,
  Project,
  ProjectJson,
} from 'models/subgraph-entities/project'


import {
  Participant,
  ParticipantJson,
  parseParticipantJson,
} from 'models/subgraph-entities/participant'

import {
  ETHERC20ProjectPayer,
  ETHERC20ProjectPayerJson,
  parseETHERC20ProjectPayer,
} from '../models/subgraph-entities/eth-erc20-project-payer'

export interface SubgraphEntities {
  project: Project
  projectSearch: Project
  participant: Participant
}

export interface SubgraphQueryReturnTypes {
  project: { projects: ProjectJson[] }
  projectSearch: { projectSearch: ProjectJson[] }
  participant: { participants: ParticipantJson[] }
  etherc20ProjectPayer: { etherc20ProjectPayers: ETHERC20ProjectPayerJson[] }
}

export type EntityKey = keyof SubgraphEntities

export interface SubgraphError {
  locations: { column: number; line: number }[]
  message: string
}

export type OrderDirection = 'asc' | 'desc'

export type WhereConfig<E extends EntityKey> = {
  key: EntityKeys<E>
  value: string | number | boolean | string[] | number[] | null
  operator?:
    | 'not'
    | 'gt'
    | 'lt'
    | 'gte'
    | 'lte'
    | 'in'
    | 'not_in'
    | 'contains'
    | 'not_contains'
    | 'starts_with'
    | 'ends_with'
    | 'not_starts_with'
    | 'not_ends_with'
}

type BlockConfig = {
  number?: number
  number_gte?: number
  hash?: string
}

export type EntityKeys<E extends EntityKey> = keyof SubgraphEntities[E]

export interface GraphQueryOpts<E extends EntityKey, K extends EntityKeys<E>> {
  entity: E
  text?: string
  first?: number
  skip?: number
  orderBy?: keyof SubgraphEntities[E]
  block?: BlockConfig
  url?: string

  // `keys` can be a mix of the entity's keys or an entity specifier with its own keys
  keys: (
    | K
    | {
        entity: EntityKey
        keys: string[] // hard to type accurate nested keys. All bets are off when this is used.
      }
  )[]
  orderDirection?: OrderDirection
  where?: WhereConfig<E> | WhereConfig<E>[]
}

// Re-type GraphQueryOpts to remove skip and add pageSize.
// This is so we can calculate our own `skip` value based on
// the react-query managed page number multiplied by the provided
// page size.
export type InfiniteGraphQueryOpts<
  E extends EntityKey,
  K extends EntityKeys<E>,
> = Omit<GraphQueryOpts<E, K>, 'skip'> & {
  pageSize: number
}

// https://thegraph.com/docs/graphql-api#filtering
export const formatGraphQuery = <E extends EntityKey, K extends EntityKeys<E>>(
  opts: GraphQueryOpts<E, K>,
) => {
  if (!opts) return

  let args = ''

  const addArg = (
    name: string,
    value?: string | number | keyof SubgraphEntities[E],
  ) => {
    if (value === undefined) return
    args += (args.length ? ', ' : '') + `${name}: ` + String(value)
  }
  const formatWhere = (where: WhereConfig<E>) =>
    `${String(where.key)}${where.operator ? '_' + where.operator : ''}:` +
    (Array.isArray(where.value)
      ? `[${where.value
          .map(v => (typeof v === 'string' ? `"${v}"` : v))
          .join(',')}]`
      : typeof where.value === 'string'
      ? `"${where.value}"`
      : where.value)

  addArg('text', opts.text ? `"${opts.text}"` : undefined)
  addArg('first', opts.first)
  addArg('skip', opts.skip)
  addArg('orderBy', opts.orderBy)
  addArg('orderDirection', opts.orderDirection)
  if (opts.block) {
    if (opts.block.number) {
      addArg('block', `{ number: ${opts.block.number} }`)
    } else if (opts.block.hash) {
      addArg('block', `{ hash: ${opts.block.hash} }`)
    } else if (opts.block.number_gte) {
      addArg('block', `{ number_gte: ${opts.block.number_gte} }`)
    }
  }
  addArg(
    'where',
    opts.where
      ? Array.isArray(opts.where)
        ? `{${opts.where.map(w => ` ${formatWhere(w)}`)} }`
        : `{ ${formatWhere(opts.where)} }`
      : undefined,
  )

  const overrideEntity: string = opts.entity

  const res = `{ ${overrideEntity}${isPluralQuery(opts.entity) ? 's' : ''}${
    args ? `(${args})` : ''
  } {${opts.keys.reduce(
    (acc, key) =>
      typeof key === 'string' ||
      typeof key === 'number' ||
      typeof key === 'symbol'
        ? acc + ' ' + key.toString()
        : acc + ` ${key.entity} { ${key.keys.join(' ')} }`,
    '',
  )} } }`
  return res
}

const subgraphUrl = process.env.NEXT_PUBLIC_SUBGRAPH_URL

export function formatGraphResponse<E extends EntityKey>(
  entity: E,
  response: SubgraphQueryReturnTypes[E],
): SubgraphEntities[E][] {
  if (!response || typeof response !== 'object') {
    return []
  }

  // This code works perfectly, but there's an unusual TypeScript issue that
  // makes it appear type unsafe...
  //
  // For example, `response.projects` is a ProjectJson[], as dictated by
  // SubgraphQueryReturnTypes['projects']
  // We then map over that array to return a Project[], but for some reason,
  // TypeScript isn't equating `Project` with `SubgraphEntities['project']`,
  // even though they're the same type.
  //
  // If you think you can solve it and remove the @ts-ignore, be my guest.
  // My best guess is a conditional resolver type, ie:
  // type EntityResolver<E extends EntityKey> = E extends 'project' ? Project : ...
  // in favor of the main SubgraphEntities type. I tried it, though, to no avail.

  switch (entity) {
    case 'protocolLog':
      if ('protocolLogs' in response) {
        // @ts-ignore
        return response.protocolLogs.map(parseProtocolLogJson)
      }
      break
    case 'project':
      if ('projects' in response) {
        // @ts-ignore
        return response.projects.map(parseProjectJson)
      }
      break
    case 'projectEvent':
      if ('projectEvents' in response) {
        // @ts-ignore
        return response.projectEvents.map(parseProjectEventJson)
      }
      break
    case 'projectCreateEvent':
      if ('projectCreateEvents' in response) {
        // @ts-ignore
        return response.projectCreateEvents.map(parseProjectCreateEventJson)
      }
      break
    case 'projectSearch':
      if ('projectSearch' in response) {
        // @ts-ignore
        return response.projectSearch.map(parseProjectJson)
      }
      break
    case 'payEvent':
      if ('payEvents' in response) {
        // @ts-ignore
        return response.payEvents.map(parsePayEventJson)
      }
      break
    case 'redeemEvent':
      if ('redeemEvents' in response) {
        // @ts-ignore
        return response.redeemEvents.map(parseRedeemEventJson)
      }
      break
    case 'participant':
      if ('participants' in response) {
        // @ts-ignore
        return response.participants.map(parseParticipantJson)
      }
      break
    case 'tapEvent':
      if ('tapEvents' in response) {
        // @ts-ignore
        return response.tapEvents.map(parseTapEventJson)
      }
      break
    case 'printReservesEvent':
      if ('printReservesEvents' in response) {
        // @ts-ignore
        return response.printReservesEvents.map(parsePrintReservesEventJson)
      }
      break
    case 'mintTokensEvent':
      if ('mintTokensEvents' in response) {
        // @ts-ignore
        return response.mintTokensEvents.map(parseMintTokensEventJson)
      }
      break
    case 'deployedERC20Event':
      if ('deployedERC20Events' in response) {
        // @ts-ignore
        return response.deployedERC20Events.map(parseDeployedERC20EventJson)
      }
      break
    case 'useAllowanceEvent':
      if ('useAllowanceEvents' in response) {
        // @ts-ignore
        return response.useAllowanceEvents.map(parseUseAllowanceEventJson)
      }
      break
    case 'etherc20ProjectPayer':
      if ('etherc20ProjectPayers' in response) {
        // @ts-ignore
        return response.etherc20ProjectPayers.map(parseETHERC20ProjectPayer)
      }
      break
    case 'veNftToken':
      if ('veNftTokens' in response) {
        // @ts-ignore
        return response.veNftTokens.map(parseVeNftTokenJson)
      }
      break
    case 'veNftContract':
      if ('veNftContracts' in response) {
        // @ts-ignore
        return response.veNftContracts.map(parseVeNftContractJson)
      }
  }

  return []
}

export async function querySubgraph<
  E extends EntityKey,
  K extends EntityKeys<E>,
>(opts: GraphQueryOpts<E, K> | null) {
  if (!subgraphUrl) {
    // This should _only_ happen in development
    throw new Error('env.NEXT_PUBLIC_SUBGRAPH_URL is missing')
  }

  if (!opts) return []

  const response = await axios.post<{
    errors?: SubgraphError | SubgraphError[]
    data: SubgraphQueryReturnTypes[E]
  }>(
    opts.url ?? subgraphUrl,
    {
      query: formatGraphQuery(opts),
    },
    { headers: { 'Content-Type': 'application/json' } },
  )

  if ('errors' in response.data) {
    throw new Error(
      (Array.isArray(response.data.errors)
        ? response.data.errors?.[0]?.message
        : response.data.errors?.message) ||
        'Something is wrong with this Graph request',
    )
  }

  return formatGraphResponse(opts.entity, response.data?.data)
}

/** Repeats a max page size query until all entities have been returned. */
export async function querySubgraphExhaustive<
  E extends EntityKey,
  K extends EntityKeys<E>,
>(opts: Omit<GraphQueryOpts<E, K>, 'first' | 'skip'> | null) {
  const pageSize = 1000
  const entities: SubgraphEntities[E][] = []

  const query = async (page: number) => {
    if (!opts) return

    const data = await querySubgraph({
      ...opts,
      first: pageSize,
      ...(page > 0
        ? {
            skip: pageSize * page,
          }
        : {}),
    })

    if (!data) return

    entities.push(...data)

    if (data.length === pageSize) await query(page + 1)
  }

  await query(0)

  return entities
}

const isPluralQuery = (key: EntityKey): boolean => {
  if (key === 'projectSearch') return false

  return true
}

/**
 * Get the subgraph representation of a project ID, based on given [cv] and [projectId]
 *
 * Reference implementation: https://github.com/jbx-protocol/juice-subgraph/blob/main/src/utils.ts#L84
 *
 * @param cv Contracts version
 * @param projectId the on-chain project ID
 */
export const getSubgraphIdForProject = (cv: CV, projectId: number) => {
  return `${cv}-${projectId}`
}
