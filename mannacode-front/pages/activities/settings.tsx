import React from 'react';
import Settings from '../../components/page/groupChallenges/Settings';

export default function settings({ groupChallengeId, mode}) {
  return (<Settings mode={mode} groupChallengeId={groupChallengeId}></Settings>)
}

export async function getServerSideProps({ query }) {
  const groupChallengeId = query.groupChallengeId ? query.groupChallengeId : false;
  const mode = query.mode ? query.mode : false
  return { props: { groupChallengeId, mode} };
}