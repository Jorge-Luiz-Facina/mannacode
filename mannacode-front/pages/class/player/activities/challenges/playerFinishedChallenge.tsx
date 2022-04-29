
import React, { useEffect, useState } from 'react';
import paletteCode from 'components/singleton/paletteCode';
/* eslint-disable-next-line no-unused-vars */
import { PaletteCode, paletteCodeDark, palettesCode } from 'components/base/Theme';
import { getLocalStorage, LocalStorageItem } from 'components/static/LocalStorage';
import { Grid, Typography } from '@material-ui/core';
import TabError from 'components/style/TabError';
import View from 'components/page/View';
import { getPlayerFinalizedChallenge } from '@/services/playerFinalizedChallenge';
import PropTypes from 'prop-types';

export default function PlayerFinishedChallenge(props) {

  const { challengeId, groupChallengeId, playerId } = props;
  const [messageError, setMessageError] = useState<any>('');
  const [playerChallenge, setPlayerChallenge] = useState<any>(null);
  const [paletteTheme, setPaletteTheme] = useState<PaletteCode>(paletteCodeDark);

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

  useEffect(() => {
    getPlayerFinalizedChallenge({ challengeId, groupChallengeId, playerId }, getLocalStorage(LocalStorageItem.tokenPlayer)).then((response) => {
      if (response.ok) {
        setPlayerChallenge(response.data);
      } else {
        setMessageError(response.data.message);
      }
    });
  }, [])

  return (
    <div style={{ background: paletteCode.get().head }}>
      {!playerChallenge ? <></> :
        <Grid style={{ height: '100vh' }}
          container
          direction="row"
          justify="space-between"
          alignItems="flex-start"
        >
          <Grid item xs={9} md={11} style={{ height: '100%' }}
            container
            direction="column"
            justify="center"
            alignItems="center"
          >
            <View isViewResult={true} permissionPunctuation={null} onChangePaletteCode={handleChangePaletteCode} paletteTheme={paletteTheme} isPlayer={false} applicatorStartId={null} percentage={null} token={null} player={playerChallenge} setMessageError={setMessageError}></View>
          </Grid>
          <Grid item xs={3} md={1} style={{ height: '100%' }}
            container
            direction="column"
            justify="center"
            alignItems="center"
          >
            <Typography style={{ color: paletteCode.get().color, textAlign: 'center' }}>Pontuação:<br></br>{` ${playerChallenge.punctuation ? playerChallenge.punctuation : 'pendente'}`}</Typography>
          </Grid>
        </Grid>
      }
      <TabError text={messageError} open={messageError !== ''} setMessageError={setMessageError}></TabError>
    </div>
  )

}

export async function getServerSideProps({ query }) {
  const challengeId = query.challengeId ? query.challengeId : false;
  const playerId = query.playerId ? query.playerId : false;
  const groupChallengeId = query.groupChallengeId ? query.groupChallengeId : false;


  return { props: { challengeId, playerId, groupChallengeId } };
}

PlayerFinishedChallenge.defaultProps = {
  challengeId: null,
  groupChallengeId: null,
  playerId: null,

};

PlayerFinishedChallenge.propTypes = {
  challengeId: PropTypes.string,
  groupChallengeId:  PropTypes.string,
  playerId:  PropTypes.string,
};