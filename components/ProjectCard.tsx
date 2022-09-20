import { Skeleton, Tooltip } from 'antd'

import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import * as constants from '@ethersproject/constants'
import { useProjectMetadata } from 'hooks/ProjectMetadata'
import { Project } from 'models/subgraph-entities/project'
import { CSSProperties, useContext } from 'react'
import { formatDate } from 'utils/formatDate'
import { formatWad } from 'utils/formatNumber'
import useSubgraphQuery from 'hooks/SubgraphQuery'


import Link from 'next/link'

import ETHAmount from './currency/ETHAmount'
import Loading from './Loading'
import ProjectLogo from './ProjectLogo'

export type ProjectCardProject = Pick<
  Project,
  | 'id'
  | 'handle'
  | 'metadataUri'
  | 'totalPaid'
  | 'createdAt'
  | 'terminal'
  | 'projectId'
  | 'cv'
>

export default function ProjectCard({
  project,
}: {
  project?: ProjectCardProject | BigNumber
}) {
  
  const primaryColor = 'green'
  const secondaryColor = 'gray'
  const tertiaryColor = 'black'
  const radii = '1px'

  const cardStyle: CSSProperties = {
    display: 'flex',
    position: 'relative',
    alignItems: 'center',
    whiteSpace: 'pre',
    overflow: 'hidden',
    padding: '25px 20px',
  }

  // Get ProjectCardProject object if this component was passed a projectId (bigNumber)
  const projectQuery: ProjectCardProject[] | undefined = useSubgraphQuery(
    BigNumber.isBigNumber(project)
      ? {
          entity: 'project',
          keys: [
            'id',
            'handle',
            'metadataUri',
            'totalPaid',
            'createdAt',
            'terminal',
            'projectId',
            'cv',
          ],
          where: {
            key: 'projectId',
            value: project.toString(),
          },
        }
      : null,
  ).data

  // Must use any to convert (ProjectCardProject | bigNumber) to ProjectCardProject
  const projectObj: any = project 
  let _project: ProjectCardProject

  // If we were given projectId (BN) and therefore projectQuery returned something,
  // we assign _project to that. Otherwise assign it to the initial
  // project passed to this component which must be ProjectCardProject
  if (projectQuery?.length) {
    _project = projectQuery[0]
  } else {
    _project = projectObj
  }

  const { data: metadata } = useProjectMetadata(_project?.metadataUri)
  // If the total paid is greater than 0, but less than 10 ETH, show two decimal places.
  const precision =
    _project?.totalPaid?.gt(0) && _project?.totalPaid.lt(constants.WeiPerEther)
      ? 2
      : 0

  const projectRoute = ({
      projectId,
      handle,
    }: {
      projectId?: BigNumberish
      handle?: string | null
    }) => {
      const base = process.env.NEXT_PUBLIC_INFURA_NETWORK === 'mainnet' ?
        'https://juicebox.money' : 'https://rinkeby.juicebox.money'
      if (handle) return `${base}/@${handle}`
      return `${base}/v2/p/${BigNumber.from(projectId).toNumber()}`
    }



  return (
    
    
        <div
          style={{
            borderRadius: radii,

            overflow: 'hidden',

            ...cardStyle,
          }}
          className="clickable-border"
        >
          <div style={{ marginRight: 20 }}>
            <ProjectLogo
              uri={metadata?.logoUri}
              name={metadata?.name}
              size={140}
            />
          </div>
          <div
            style={{
              flex: 1,
              minWidth: 0,
              fontWeight: 400,
              height: '140px',
            }}
          >
          <div style = {{width: '430px',
              float: 'left'}}>
            {metadata ? (
              <h2
                style={{
                  color: primaryColor,
                  margin: 0,
                  textOverflow: 'ellipsis',
                  fontSize: 21,
                }}
              >
                {metadata.name}
              </h2>
            ) : (
              <Skeleton paragraph={false} title={{ width: 120 }} active />
            )}
            </div>

<div
                  style={{
                    width: '430px',float: 'left'}}>
              <span style={{ color: secondaryColor, fontWeight: 500 }}>
                <ETHAmount amount={_project?.totalPaid} precision={precision} />{' '}
              </span>

              <span style={{ color: secondaryColor }}>
                since{' '}
                {!!_project?.createdAt &&
                  formatDate(_project?.createdAt * 1000, 'yyyy-MM-DD')}
              </span>
            </div>
            
            <div>
              {_project?.handle && (
                <span
                  style={{
                    color: primaryColor,
                    fontWeight: 500,
                    marginRight: 10,
                  }}
                >
                  @{_project?.handle}
                </span>
              )}
            </div>

            

            {metadata?.description && (
              <Tooltip title={metadata.description} placement="bottom">
                <div
                  style={{
                    width: '300px',
                    height: 40,
                    color: tertiaryColor,
                    overflow: 'auto',
                    wordWrap: 'break-word',
                    textOverflow: 'ellipsis',
                    display: 'inline-block',
                    whiteSpace: 'normal',
                    float: 'left'
                  }}
                >
                  {metadata.description}
                </div>
              </Tooltip>
            )}
            <div style={{float:'inherit'}}>
              <button onClick={()=>{location.href=projectRoute(_project);}} style={{ marginRight: 20, cursor:'pointer' }}>Learn More</button>
              <button onClick={()=>{location.href=projectRoute(_project);}} style={{ marginRight: 20, cursor:'pointer' }}>Fund</button></div>
          </div>
          {!metadata && <Loading />}
        </div>

  )
}
