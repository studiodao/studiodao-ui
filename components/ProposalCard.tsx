import { SnapshotProposal } from "hooks/SnapshotQuery";

export function ProposalCard({ proposal }: { proposal: SnapshotProposal }) {
  return (
    <a
      key={proposal.id}
      href={`https://snapshot.org/#/${proposal.space.id}/proposal/${proposal.id}`}
    >
      <div
        style={{
          backgroundColor: "#2EC869",
          borderRadius: 5,
          padding: 10,
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        <h2>{proposal.title}</h2>
        <h3>{proposal.body}</h3>
        <ul>
          {proposal.choices.map((c, index) => (
            <li key={index}>{c}</li>
          ))}
        </ul>
        {proposal.state === "closed" && (
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              backgroundColor: "red",
            }}
          ></div>
        )}
      </div>
    </a>
  );
}
