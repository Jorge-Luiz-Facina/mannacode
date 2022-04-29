import React from 'react';
import {
  Button,
  Grid, makeStyles, Typography,
} from '@material-ui/core';
import { LocalStorageItem } from 'components/static/LocalStorage';
import { defaultProperties } from 'components/base/Theme';
import paletteCode from 'components/singleton/paletteCode';

const useStyles = makeStyles((theme) => ({
  divWaitingApplication: {
    height: '100vh',
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
  buttonReload: {
    width: '40%',
    fontSize: '2rem',
    [theme.breakpoints.down('xs')]: {
      width: '60%',
    },
  },
  gridWaiting: {
    width: '100% !important',
    height: '100% !important'
  }
}));

export default function reload(props) {
  const classes = useStyles();
  const { setReload, setStatus } = props;
  return (
    <div suppressHydrationWarning className={classes.divWaitingApplication} style={{ background: paletteCode.get().background }}>
      <Grid suppressHydrationWarning
        container
        direction="column"
        justify="center"
        alignItems="center"
        className={classes.gridWaiting}
      >
        <Typography className={classes.waitingApplication} style={{ paddingBottom: '50px', color: paletteCode.get().color }}>Tentativa de recarregamento da pagina⠀</Typography>
        <Button fullWidth onClick={() => { setReload(false) }} className={classes.buttonReload} style={{ color: paletteCode.get().color }}>Continuar na sala</Button>
        <Button fullWidth onClick={() => { setReload(false); localStorage.removeItem(LocalStorageItem.room); setStatus(null) }} className={classes.buttonReload}
          style={{ color: paletteCode.get().color }}>Entrar em nova sala</Button>
      </Grid>
    </div>
  )
}