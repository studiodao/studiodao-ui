import axios from "axios";
import { useQuery } from "react-query";

const snapshotUrl =
  process.env.NEXT_PUBLIC_SNAPSHOT_URL || "https://hub.snapshot.org/graphql";
const staleTime = 60 * 1000; // 60 seconds

type SnapshotSpace = {
  id: string;
  name: string;
  about: string;
  network: string;
  symbol: string;
  members: string[];
};

type SnapshotProposalState = "open" | "closed";

export type SnapshotProposal = {
  id: string;
  title: string;
  body: string;
  choices: string[];
  start: number;
  end: number;
  snapshot: string;
  state: SnapshotProposalState;
  author: string;
  space: Partial<SnapshotSpace>;
};

type GraphQlData = { [key: string]: any; [index: number]: never };

interface GraphQLError {
  locations: { column: number; line: number }[];
  message: string;
}

interface GraphQlResponse<T extends GraphQlData> {
  data: T;
  errors?: Array<GraphQLError>;
}

type SnapshotGraphQLResponse = GraphQlResponse<{
  space?: SnapshotSpace;
  spaces?: SnapshotSpace[];
  proposal?: SnapshotProposal;
  proposals?: SnapshotProposal[];
}>;

async function querySnapshotGraphQL<T extends GraphQlData>(query: string) {
  const response = await axios.post<SnapshotGraphQLResponse>(
    snapshotUrl,
    {
      query,
    },
    { headers: { "Content-Type": "application/json" } }
  );

  if ("errors" in response.data) {
    throw new Error(
      response.data.errors?.[0]?.message ||
        "Something is wrong with this request"
    );
  }

  return response.data?.data;
}

const proposalsQuery = `query Proposals {
    proposals(
      first: 1,
      skip: 0,
      where: {
        space_in: ["studiodao.eth"]
      },
      orderBy: "created",
      orderDirection: desc
    ) {
      id
      title
      body
      choices
      start
      end
      snapshot
      state
      author
      space {
        id
        name
      }
    }
  }`;

export function useSnapshotProposalsQuery() {
  return useQuery(
    ["subgraph-query", proposalsQuery],
    () => querySnapshotGraphQL(proposalsQuery),
    {
      staleTime,
    }
  );
}
