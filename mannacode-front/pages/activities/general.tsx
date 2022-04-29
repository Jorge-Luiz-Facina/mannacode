import { create } from '@/services/groupChallenges';
import { useAuth } from 'components/context/auth';
import { PathName } from 'components/static/Route';
import { useRouter } from 'next/router';
import React from 'react';
import General from '../../components/page/groupChallenges/General';

export default function general(props) {
  const router = useRouter();
  const { groupChallengeId, mode } = props;
  const { token, statusRedirect } = useAuth();
  const createChallenges = async (data) => {
    const response = await create(data, token);
    statusRedirect(response.data.code);
    router.push(`${PathName.activities}${PathName.challenges}?groupChallengeId=${response.data.id}&mode=${mode}`)
  }
  return (<General edit={false} mode={mode} groupChallengeId={groupChallengeId} api={createChallenges}></General>)
}

export async function getServerSideProps({ query }) {
  const mode = query.mode ? query.mode : false
  const groupChallengeId = query.groupChallengeId ? query.groupChallengeId : false
  return { props: { groupChallengeId, mode, } };
}
