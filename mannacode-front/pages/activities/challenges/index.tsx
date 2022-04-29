import React from 'react';
import Challenges from '../../../components/page/groupChallenges/Challenges';

export default function challenges({ groupChallengeId, mode}) {
  return (<Challenges edit={false} mode={mode} groupChallengeId={groupChallengeId}></Challenges>)
}

export async function getServerSideProps({ query }) {
  const groupChallengeId = query.groupChallengeId ? query.groupChallengeId : false;
  const mode = query.mode ? query.mode : false

  return { props: { groupChallengeId, mode } };
}