import React, { useEffect, useState } from 'react';
import {
  Grid, Typography, withWidth,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { get } from '@/services/groupChallenges';
import BasePage from '../../components/page/general/BasePage';
// eslint-disable-next-line no-unused-vars
import { useAuth } from 'components/context/auth';
import client from '@/services/feathers'
import { getLocalStorage, LocalStorageItem } from 'components/static/LocalStorage';
import Initial from 'components/page/groupChallenges/start/Initial';
import Room from 'components/page/groupChallenges/start/Room';
import HeaderPlayers from 'components/page/groupChallenges/start/HeaderPlayers';
import { StatusChallenges } from 'components/Enums/statusChallenges';
import Challenge from 'components/page/Challenge';
import Classification from 'components/page/Classification';
import View from 'components/page/View';
import TabError from 'components/style/TabError';
/* eslint-disable-next-line no-unused-vars */
import { defaultProperties, PaletteCode, paletteCodeDark, palettesCode } from 'components/base/Theme';
import paletteCode from 'components/singleton/paletteCode';

const useStyles = makeStyles(() => ({
  div: {
    minHeight: '93vh',
    width: '100%',
    position: 'relative',
    display: 'flex',
  },
  divWaitingApplciation: {
    minHeight: '93vh',
    width: '100%',
    position: 'relative',
    scrollMarginTop: `${defaultProperties.globalHeaderHeigth}`,
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  waitingApplication: {
    Family: 'Bahnschrift',
    fontSize: '4rem',
    fontWeight: 'bold',
    fontStretch: 'condensed',
    textAlign: 'center',
  },
}));

interface ActivitiyStart {
  id: number;
  key: string;
  groupChallengeId: string;
}

function start(props) {
  const classes = useStyles();
  const { groupChallengeId } = props;

  const [messageError, setMessageError] = useState<string>('');
  const [groupChallenge, setGroupChallenge] = useState<any>(null);
  const [activitiyStart, setActivitiyStart] = useState<ActivitiyStart>(JSON.parse(getLocalStorage(LocalStorageItem.key)));
  const [statusChallenges, setStatusChallenges] = useState<any>(null);
  const [isTimeFinished, setIsTimeFinished] = useState<boolean>(false)
  const [paletteTheme, setPaletteTheme] = useState<PaletteCode>(paletteCodeDark);

  const { signed, token, statusRedirect } = useAuth();

  const getStatus = async () => {
    if (getLocalStorage(LocalStorageItem.key)) {
      client.service('applicator-start-socket').patch(activitiyStart?.id, { token: token }).then((response) => {
        if (response.status) {
          setStatusChallenges(response)
        }
      });
    }
  }

  useEffect(() => {
    let isUnmount = false;
    getStatus();
    client.service('status-challenges').on('created', statusChallenges => {
      if (!isUnmount) {
        setStatusChallenges(statusChallenges.data);
      }
    });
    return () => {
      isUnmount = true;
    }
  }, [])

  useEffect(() => {
    if (groupChallengeId && signed) {
      get(groupChallengeId, token)
        .then((response) => {
          statusRedirect(response.data.code);
          if (response.ok) {
            setGroupChallenge(response.data);
          } else {
            setMessageError(response.data.message);
          }
          setGroupChallenge(response.data);
        });
    }
  }, [signed])

  useEffect(() => {
    if (isTimeFinished) {
      getStatus();
    }
  }, [isTimeFinished])

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
  function window() {
    const status = statusChallenges?.status;

    if (status === StatusChallenges.EXECUTION) {
      return (
        <div className={classes.div} style={{ background: paletteCode.get().head }}>
          <Grid style={{ height: '100%' }}
            container
            direction="row"
            justify="space-between"
            alignItems="flex-start"
          >
            <Grid item xs={6} md={10} style={{ height: '100%' }} container
              direction="column"
              justify="center"
              alignItems="center"
            ><Challenge groupChallengeId={groupChallengeId} onChangePaletteCode={handleChangePaletteCode} paletteTheme={paletteTheme} challenge={statusChallenges.challenge} user='APPLICATOR' setIsTimeFinished={setIsTimeFinished} room={statusChallenges.applicatorStartId} startTime={statusChallenges.startTime} endTime={statusChallenges.endTime}></Challenge>
            </Grid>
            <HeaderPlayers></HeaderPlayers>
          </Grid>
          <TabError text={messageError} open={messageError !== ''} setMessageError={setMessageError}></TabError>
        </div>
      )
    }
    else if (status === StatusChallenges.PUNCTUATE) {
      return (
        <div className={classes.div} style={{ background: paletteCode.get().head }}>
          <Grid style={{ height: '100%' }}
            container
            direction="row"
            justify="space-between"
            alignItems="flex-start"
          >
            <Grid item xs={6} md={10} style={{ height: '100%' }} container
              direction="column"
              justify="center"
              alignItems="center"
            >
              <View isViewResult={false} permissionPunctuation={statusChallenges.permissionPunctuation} onChangePaletteCode={handleChangePaletteCode} paletteTheme={paletteTheme} isPlayer={false} applicatorStartId={activitiyStart.id} percentage={statusChallenges.percentage} token={token} player={statusChallenges.player} setMessageError={setMessageError}></View>
            </Grid>
            <HeaderPlayers></HeaderPlayers>
          </Grid>
          <TabError text={messageError} open={messageError !== ''} setMessageError={setMessageError}></TabError>
        </div>
      )
    }
    else if (status === StatusChallenges.SCORE) {
      return (
        <div className={classes.div} style={{ background: paletteCode.get().head }}>
          <Grid style={{ height: '100%' }}
            container
            direction="row"
            justify="space-between"
            alignItems="flex-start"
          >
            <Grid item xs={6} md={10} style={{ height: '100%' }} container
              direction="column"
              justify="center"
              alignItems="center"
            >
              <Classification toFinish={statusChallenges.toFinish} onChangePaletteCode={handleChangePaletteCode} paletteTheme={paletteTheme} isPlayer={false} applicatorStartId={activitiyStart.id}
                groupChallengeId={activitiyStart.groupChallengeId} setMessageError={setMessageError} punctuations={statusChallenges.punctuations}></Classification>
            </Grid>
            <HeaderPlayers></HeaderPlayers>
          </Grid>
          <TabError text={messageError} open={messageError !== ''} setMessageError={setMessageError}></TabError>
        </div>
      )
    }
    else if (status === StatusChallenges.END) {
      return (
        <div className={classes.divWaitingApplciation} style={{ background: paletteCode.get().background }}>
          <Typography className={classes.waitingApplication} style={{ color: paletteCode.get().color }}>A partida acabou⠀</Typography>
          <TabError text={messageError} open={messageError !== ''} setMessageError={setMessageError}></TabError>
        </div>
      )
    }
    else if (activitiyStart) {
      return (
        <div className={classes.div} style={{ background: paletteCode.get().head }}>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="flex-start"
          >
            <Room activitiyStart={activitiyStart} setMessageError={setMessageError}></Room>
            <HeaderPlayers></HeaderPlayers>
          </Grid>
          <TabError text={messageError} open={messageError !== ''} setMessageError={setMessageError}></TabError>
        </div>
      )
    } else {
      return (
        <>
          <Initial activitiyStart={activitiyStart} groupChallenge={groupChallenge} groupChallengeId={groupChallengeId} setActivitiyStart={setActivitiyStart} setMessageError={setMessageError}></Initial>
          <TabError text={messageError} open={messageError !== ''} setMessageError={setMessageError}></TabError>
        </>
      )
    }
  }
  return (BasePage(window()));
}

export async function getServerSideProps({ query }) {
  const groupChallengeId = query.groupChallengeId ? query.groupChallengeId : false;

  return { props: { groupChallengeId } };
}

export default withWidth()(start);