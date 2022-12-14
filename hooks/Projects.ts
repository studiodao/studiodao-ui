import { CV } from "models/cv";
import { ProjectState } from "models/project-visibility";
import { Project } from "models/subgraph-entities/project";
import { useEffect, useState } from "react";
import { StudioDaoProjectIds } from "constants/StudioDaoProjectIds";
import {
  EntityKeys,
  getSubgraphIdForProject,
  GraphQueryOpts,
  InfiniteGraphQueryOpts,
  querySubgraphExhaustive,
  WhereConfig,
} from "utils/graph";

// import { V2ArchivedProjectIds } from "constants/archivedProjects";

import useSubgraphQuery, { useInfiniteSubgraphQuery } from "./SubgraphQuery";
import { ScrollNumberState } from "antd/lib/badge/ScrollNumber";

interface ProjectsOptions {
  pageNumber?: number;
  projectId?: number;
  projectIds?: number[];
  orderBy?: "createdAt" | "currentBalance" | "totalPaid";
  orderDirection?: "asc" | "desc";
  pageSize?: number;
  state?: ProjectState;
  keys?: (keyof Project)[];
  cv?: CV[];
}

const staleTime = 60 * 1000; // 60 seconds

const keys: (keyof Project)[] = [
  "id",
  "projectId",
  "handle",
  "owner",
  "createdAt",
  "metadataUri",
  "metadataDomain",
  "currentBalance",
  "totalPaid",
  "totalRedeemed",
  "terminal",
  "cv",
];

const StudioDaoProjectKeys = StudioDaoProjectIds.map((projectId) =>
    getSubgraphIdForProject("2", projectId)
  );

const queryOpts = (
  opts: ProjectsOptions
): Partial<
  | GraphQueryOpts<"project", EntityKeys<"project">>
  | InfiniteGraphQueryOpts<"project", EntityKeys<"project">>
> => {
  const where: WhereConfig<"project">[] = [];

  if (opts.cv) {
    where.push({
      key: "cv",
      value: opts.cv,
      operator: "in",
    });
  }

  if (opts.projectId) {
    where.push({
      key: "projectId",
      value: opts.projectId,
    });
  } else if (opts.projectIds) {
    where.push({
      key: "projectId",
      value: opts.projectIds,
      operator: "in",
    });
  } else {
    where.push({
      key: "projectId",
      value: StudioDaoProjectKeys,
      operator: "in",
    });
  }

  return {
    entity: "project",
    keys: opts.keys ?? keys,
    orderDirection: opts.orderDirection ?? "desc",
    orderBy: opts.orderBy ?? "totalPaid",
    pageSize: opts.pageSize,
    where,
  };
};

export function useProjectsQuery(opts: ProjectsOptions) {
  return useSubgraphQuery(
    {
      ...(queryOpts(opts) as GraphQueryOpts<"project", EntityKeys<"project">>),
      first: opts.pageSize,
      skip:
        opts.pageNumber && opts.pageSize
          ? opts.pageNumber * opts.pageSize
          : undefined,
    },
    {
      staleTime,
    }
  );
}

export function useProjectsSearch(handle: string | undefined) {
  return useSubgraphQuery(
    handle
      ? {
          text: `${handle}:*`,
          entity: "projectSearch",
          keys,
        }
      : null,
    {
      staleTime,
    }
  );
}

export function useTrendingProjects(count: number) {
  return useSubgraphQuery({
    entity: "project",
    keys: [
      ...keys,
      "trendingScore",
      "trendingPaymentsCount",
      "trendingVolume",
      "createdWithinTrendingWindow",
    ],
    first: count,
    orderBy: "trendingScore",
    orderDirection: "desc",
  });
}

// Query all projects that a wallet has previously made payments to
export function useHoldingsProjectsQuery(wallet: string | undefined) {
  const [loadingParticipants, setLoadingParticipants] = useState<boolean>();
  const [projectIds, setProjectIds] = useState<string[]>();

  useEffect(() => {
    // Get all participant entities for wallet
    const loadParticipants = async () => {
      setLoadingParticipants(true);

      const participants = await querySubgraphExhaustive(
        wallet
          ? {
              entity: "participant",
              orderBy: "balance",
              orderDirection: "desc",
              keys: [
                {
                  entity: "project",
                  keys: ["id"],
                },
              ],
              where: [
                {
                  key: "wallet",
                  value: wallet,
                },
              ],
            }
          : null
      );

      if (!participants) {
        setProjectIds(undefined);
        return;
      }

      // Reduce list of paid project ids
      setProjectIds(
        participants?.reduce((acc, curr) => {
          const projectId = curr?.project.id;

          return [
            ...acc,
            ...(projectId ? (acc.includes(projectId) ? [] : [projectId]) : []),
          ];
        }, [] as string[])
      );

      setLoadingParticipants(false);
    };

    loadParticipants();
  }, [wallet]);
  const filteredProjectIds: string[] | undefined = projectIds
    ? projectIds.filter((value) => StudioDaoProjectKeys.includes(value))
    : undefined;
  const projectsQuery = useSubgraphQuery(
    filteredProjectIds
      ? {
          entity: "project",
          keys,
          where: {
            key: "id",
            operator: "in",
            value: filteredProjectIds,
          },
        }
      : null
  );

  return {
    ...projectsQuery,
    isLoading: projectsQuery.isLoading || loadingParticipants,
  };
}

export function useMyProjectsQuery(wallet: string | undefined) {
  const projectsQuery = useSubgraphQuery(
    wallet
      ? {
          entity: "project",
          keys,
          where: {
            key: "owner",
            operator: "in",
            value: [wallet],
          },
        }
      : null
  );

  return {
    ...projectsQuery,
  };
}

export function useInfiniteProjectsQuery(opts: ProjectsOptions) {
  return useInfiniteSubgraphQuery(
    queryOpts(opts) as InfiniteGraphQueryOpts<"project", EntityKeys<"project">>,
    { staleTime }
  );
}
