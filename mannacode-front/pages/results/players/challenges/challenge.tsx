import React, { useEffect, useState } from 'react';
import { getPlayerChallengeById } from '@/services/playerChallenges';
import { Grid, makeStyles } from '@material-ui/core';
/* eslint-disable-next-line no-unused-vars */
import { PaletteCode, paletteCodeDark, palettesCode } from 'components/base/Theme';
import { useAuth } from 'components/context/auth';
import View from 'components/page/View';
import paletteCode from 'components/singleton/paletteCode';
import { getLocalStorage, LocalStorageItem } from 'components/static/LocalStorage';
import HeaderPunctuations from 'components/style/HeaderPunctuation';
import TabError from 'components/style/TabError';
import BasePage from '../../../../components/page/general/BasePage';

const useStyles = makeStyles(() => ({
  div: {
    minHeight: '93vh',
    width: '100%',
    position: 'relative',
    display: 'flex',
  },
}));

export default function challenge({ playerChallengeId, groupChallengeId }) {
  const classes = useStyles();
  const { signed, token, statusRedirect } = useAuth();
  const [messageError, setMessageError] = useState<string>('');
  const [playerChallenge, setPlayerChallenge] = useState<any>(null);
  const [paletteTheme, setPaletteTheme] = useState<PaletteCode>(paletteCodeDark);
  useEffect(() => {
    if (signed) {
      getPlayerChallengeById({playerChallengeId, groupChallengeId}, token)
        .then((response) => {
          statusRedirect(response.data.code);
          if (response.ok) {
            setPlayerChallenge(response.data)
          } else {
            setMessageError(response.data.message);
          }
        });
    }
  }, [signed])

  const handleChangePaletteCode = (event: React.ChangeEvent<{ value: PaletteCode }>) => {
    paletteCode.set(event.target.value as PaletteCode);
    localStorage.setItem(LocalStorageItem.paletteCode, event.target.value.tag);
    setPaletteTheme(event.target.value as PaletteCode);
  };

  useEffect(() => {
    const paletteLocalStorage = getLocalStorage(LocalStorageItem.paletteCode);
    if (paletteLocalStorage && paletteLocalStorage !== paletteTheme.tag) {
      const paletteColors = palettesCode.find(p => p.tag === paletteLocalStorage)
      paletteCode.set(paletteColors);
      setPaletteTheme(paletteColors);
    }
  }, [])

  return (
    BasePage(
      <div className={classes.div} style={{ background: paletteCode.get().head }}>
        {!playerChallenge ? <></> :
          <Grid style={{ height: '100%' }}
            container
            direction="row"
            justify="space-between"
            alignItems="flex-start"
          >
            <Grid item xs={6} md={10} style={{ height: '100%' }}
              container
              direction="column"
              justify="center"
              alignItems="center"
            >
              <View isViewResult={true} permissionPunctuation={null} onChangePaletteCode={handleChangePaletteCode} paletteTheme={paletteTheme} isPlayer={false} applicatorStartId={null} percentage={null} token={token} player={playerChallenge} setMessageError={setMessageError}></View>
            </Grid>
            <HeaderPunctuations applicatorPunctuation={playerChallenge?.applicator?.punctuation} playersPunctuation={playerChallenge?.players} playerWeight={playerChallenge?.playerWeight} applicatorWeight={playerChallenge?.applicatorWeight} ></HeaderPunctuations>
          </Grid>
        }
        <TabError text={messageError} open={messageError !== ''} setMessageError={setMessageError}></TabError>
      </div>
    )
  )
}

export async function getServerSideProps({ query }) {
  const playerChallengeId = query.playerChallengeId ? query.playerChallengeId : false;
  const groupChallengeId = query.groupChallengeId ? query.groupChallengeId : false;
  return { props: { playerChallengeId, groupChallengeId} };
}