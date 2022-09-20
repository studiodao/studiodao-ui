import { InfoCircleOutlined } from "@ant-design/icons";
import Grid from "components/Grid";
import Loading from "components/Loading";
import ProjectCard from "components/ProjectCard";
import { useProjectsQuery } from "hooks/Projects";
import { useWallet } from "hooks/Wallet";

export default function AllProjects() {
  const disabledColor = "gray";
  const { userAddress } = useWallet();

  const { data: projects, isLoading } = useProjectsQuery({
    projectIds: [4630, 4631, 4633, 4639],
  });

  return (
    <>
      {projects?.length !== 0 && (
        <h1 >
          Now Funding:
        </h1>
      )}
      {projects && projects.length > 0 && (
        <Grid list={true}>
          {projects.map((p) => (
            <ProjectCard key={`${p.id}_${p.cv}`} project={p} />
          ))}
        </Grid>
      )}

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
    </>
  );
}
