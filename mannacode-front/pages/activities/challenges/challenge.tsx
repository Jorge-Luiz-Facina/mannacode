import React from 'react';
import EditChallenge from '../../../components/page/EditChallenge';

export default function newChallenges({ groupChallengeId, challengeId, mode }) {
  return (<EditChallenge edit={false} challengeId={challengeId} groupChallengeId={groupChallengeId} mode={mode}></EditChallenge>)
}

export async function getServerSideProps({ query }) {
  const groupChallengeId = query.groupChallengeId ? query.groupChallengeId : false;
  const mode = query.mode ? query.mode : false;
  const challengeId = query.challengeId ? query.challengeId : false;

  return { props: { groupChallengeId, challengeId, mode } };
}