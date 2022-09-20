import Grid from "components/Grid";
import Loading from "components/Loading";
import { FundedProjectCard } from "components/FundedProjectCard";
import { ProjectCardProject } from "components/FundedProjectCard";
import { useHoldingsProjectsQuery } from "hooks/Projects";
import { useWallet } from "hooks/Wallet";
import { useReducer, useEffect, useState } from "react";
import { fromWad, formatWad, parseWad } from "utils/formatNumber";
import useTotalBalanceOf from "hooks/TotalBalanceOf";
import { useSnapshotProposalsQuery } from "hooks/SnapshotQuery";
import { ProposalCard } from "components/ProposalCard";

const fundedProjects = (
  state: { power: number; tokenBalances: number[]; projectIds: number[] },
  action: { tokens: number; projectId?: number }
) => {
  if (
    action.tokens > 0 &&
    action.projectId &&
    state.projectIds.indexOf(action.projectId) === -1
  ) {
    return {
      power: state.power + +action.tokens,
      tokenBalances: [...state.tokenBalances, action.tokens],
      projectIds: [...state.projectIds, action.projectId],
    };
  }
  return state;
};

export default function FundedProjects() {
  const [fProjects, dispatch] = useReducer(fundedProjects, {
    power: 0,
    tokenBalances: [],
    projectIds: [],
  });
  const disabledColor = "gray";
  const { userAddress } = useWallet();
  const { data: projects, isLoading } = useHoldingsProjectsQuery(userAddress);
  const { data: snapshot } = useSnapshotProposalsQuery();

  function UserBalanceForProject({
    project,
  }: {
    project?: ProjectCardProject;
  }) {
    const totalBalance = useTotalBalanceOf(userAddress, project?.projectId);
    useEffect(() => {
      if (!totalBalance.loading && totalBalance.data !== undefined) {
        const b = +fromWad(totalBalance.data);
        dispatch({ tokens: b, projectId: project?.projectId });
      }
    }, [totalBalance, project]);
    return <></>;
  }

  return (
    <>
      {projects && projects?.length !== 0 && (
        <>
          <h1
            style={{
              marginBottom: 40,
              marginTop: 40,
              maxWidth: 800,
              color: "white",
              backgroundColor: "#2EC869",
              padding: 10,
              borderRadius: 5,
              textAlign: "center",
            }}
          >
            Your Greenlight Power: {formatWad(parseWad(fProjects.power))}
          </h1>
          <h2>
            {projects?.map((p) => (
              <UserBalanceForProject
                key={`${p.id}_${p.cv}_balance`}
                project={p}
              />
            ))}
          </h2>

          <h1>Funded Films:</h1>
          <Grid list={true}>
            {projects?.map((p) => (
              <FundedProjectCard
                key={`${p.id}_${p.cv}`}
                project={p}
                tokenBalance={
                  fProjects.tokenBalances.length > 0
                    ? fProjects.tokenBalances[
                        fProjects.projectIds.indexOf(p.projectId)
                      ]
                    : 0
                }
              />
            ))}
          </Grid>

          {!isLoading &&
            projects &&
            (projects.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  color: disabledColor,
                  padding: 20,
                }}
                hidden={isLoading}
              >
                You have not funded any films yet from wallet {userAddress}
              </div>
            ) : (
              <></>
            ))}

          {isLoading && (
            <div style={{ marginTop: 40 }}>
              <Loading />
            </div>
          )}
          {snapshot && snapshot.proposals && (
            <>
              <h1 style={{ marginTop: 10 }}>{`Today's Greenlight Vote`}</h1>
              {snapshot.proposals?.map((p) => (
                <ProposalCard key={p.id} proposal={p} />
              ))}
            </>
          )}
        </>
      )}
      <div style={{ textAlign: "center" }}>
        {projects && projects?.length === 0 && (
          <>
            <h1 style={{ marginBottom: 0, marginTop: "1em", fontSize: 50 }}>
              Be the Green-Light
            </h1>
            <p>Join StudioDao - a movie studio owned by filmmakers and fans</p>
            <span style={{ fontWeight: "bolder" }}>
              <p>
                Green-Light Movies
                <br />
                Make Movies
                <br />
                Watch Movies
              </p>
            </span>
          </>
        )}
        {!userAddress && <p>Connect your wallet to start funding films</p>}
      </div>
    </>
  );
}
