import React from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useEffect, useState } from 'react';
import {
  defaultProperties,
  /* eslint-disable-next-line no-unused-vars */
  PaletteCode,
  paletteCodeDark, palettesCode
} from 'components/base/Theme';
import client from '@/services/feathers'
import { v4 as uuidv4 } from 'uuid';
import Challenge from 'components/page/Challenge';
import { LocalStorageItem, getLocalStorage } from 'components/static/LocalStorage';
import dynamic from 'next/dynamic'
import { StatusChallenges } from 'components/Enums/statusChallenges';
import TabError from 'components/style/TabError';
import paletteCode from 'components/singleton/paletteCode';

const DynamicLoading = dynamic(() => import('../components/page/dynamicRoomPlayer/DynamicLoading'), {
  ssr: false
});

const DynamicReload = dynamic(() => import('../components/page/dynamicRoomPlayer/DynamicReload'), {
  ssr: false
});
const DynamicInitial = dynamic(() => import('../components/page/dynamicRoomPlayer/DynamicInitial'), {
  ssr: false
});
const View = dynamic(() => import('components/page/View'), {
  ssr: false
});
const Classification = dynamic(() => import('components/page/Classification'), {
  ssr: false
});

const useStyles = makeStyles(() => ({
  divWaitingApplciation: {
    minHeight: '100vh',
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

interface Status {
  applicatorStartId: string,
  status: string,
  playerCount: number,
  challengeId: string,
  startTime: Date,
  endTime: Date,
  player: object,
  punctuations: object,
  percentage: number,
  challenge: object,
  permissionPunctuation: object,
}

export default function Room(props) {
  const classes = useStyles();
  const [messageError, setMessageError] = useState<any>('');
  const [status, setStatus] = useState<Status>(null);
  const [isReload, setReload] = useState<boolean>(false);
  const [isTimeFinished, setIsTimeFinished] = useState<boolean>(false);
  const [paletteTheme, setPaletteTheme] = useState<PaletteCode>(paletteCodeDark);

  /* eslint-disable-next-line no-unused-vars */
  const [statusRoom, setStatusRoom,] = useState<string>('INITIAL')

  const onChangeRoom = value => {
    setMessageError('');
    setStatusRoom(value);
  }
  const { reload, keyRoom } = props;

  const getStatus = async (_isReload) => {
    client.service('player-start').get(getLocalStorage(LocalStorageItem.player)
    ).then(response => {
      setStatus(response);
      setMessageError('');
    }).catch(e => {
      setMessageError(e.message)
    });
    setReload(_isReload);
    localStorage.setItem('reload', reload);
  }

  useEffect(() => {
    if (getLocalStorage(LocalStorageItem.reload) === null) {
      localStorage.setItem(LocalStorageItem.reload, reload);
    }
    else if (getLocalStorage(LocalStorageItem.room) !== null && getLocalStorage(LocalStorageItem.reload) !== reload) {
      getStatus(true);
    }
  }, [])

  useEffect(() => {
    if (isTimeFinished) {
      getStatus(false);
    }
  }, [isTimeFinished])

  useEffect(() => {
    let isUnmount = false;
    client.service('status-challenges').on('created', statusRoomApi => {
      if (!isUnmount) {
        setStatus(statusRoomApi.data);
      }
    });
    return () => {
      isUnmount = true;
    }
  }, [])


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

  if (isReload) {
    return (
      <DynamicReload setReload={setReload} messageError={messageError} setMessageError={setMessageError} setStatus={setStatus}></DynamicReload>
    )
  }
  else if (getLocalStorage(LocalStorageItem.room) === null || getLocalStorage(LocalStorageItem.room) === undefined && status === null) {
    return (
      <DynamicInitial keyRoom={keyRoom} handleChangePaletteCode={handleChangePaletteCode} paletteTheme={paletteTheme} 
        messageError={messageError} setMessageError={setMessageError} onChangeRoom={onChangeRoom}></DynamicInitial>
    )
  }
  else if (status === null || status.status === 'INITIAL') {
    return (
      <DynamicLoading messageError={messageError} setMessageError={setMessageError}></DynamicLoading>
    )
  }
  else if (status.status === StatusChallenges.EXECUTION) {
    return (
      <>
        <Challenge onChangePaletteCode={handleChangePaletteCode} groupChallengeId={null} paletteTheme={paletteTheme} challenge={status.challenge} room={status.applicatorStartId} startTime={status.startTime} endTime={status.endTime} setIsTimeFinished={setIsTimeFinished}></Challenge>
        <TabError text={messageError} open={messageError !== ''} setMessageError={setMessageError}></TabError>
      </>
    )
  }
  else if (status.status === StatusChallenges.PUNCTUATE) {
    return (
      <>
        <View isViewResult={false} permissionPunctuation={status.permissionPunctuation} onChangePaletteCode={handleChangePaletteCode} paletteTheme={paletteTheme} isPlayer={true} applicatorStartId={status.applicatorStartId} percentage={status.percentage} token={null} player={status.player} setMessageError={setMessageError}></View>
        <TabError text={messageError} open={messageError !== ''} setMessageError={setMessageError}></TabError>
      </>
    )
  }
  else if (status.status === StatusChallenges.SCORE) {
    return (
      <>
        <div style={{ height: '100vh' }}>
          <Classification onChangePaletteCode={handleChangePaletteCode} paletteTheme={paletteTheme} isPlayer={true} punctuations={status.punctuations}> </Classification>
        </div>
        <TabError text={messageError} open={messageError !== ''} setMessageError={setMessageError}></TabError>
      </>
    )
  }
  else if (status.status === StatusChallenges.END) {
    return (
      <div className={classes.divWaitingApplciation} style={{ height: '100vh', background: paletteCode.get().background }}>
        <Typography className={classes.waitingApplication} style={{ color: paletteCode.get().color }}>A partida acabou⠀</Typography>
        <TabError text={messageError} open={messageError !== ''} setMessageError={setMessageError}></TabError>
      </div>
    )
  } else {
    return (
      <> </>
    )
  }
}

export async function getServerSideProps({ query }) {
  const keyRoom = query.keyRoom ? query.keyRoom : '';

  return {
    props: {
      reload: uuidv4(),
      keyRoom
    },
  }
}

