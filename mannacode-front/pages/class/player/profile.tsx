import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  FormLabel,
  Grid, Paper, TextField
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import FormHelperText from '@material-ui/core/FormHelperText';
import BasePage from 'components/page/general/BasePage';
import palette from 'components/singleton/palette';
import { getLocalStorage, LocalStorageItem } from 'components/static/LocalStorage';
import { getPunctuationTotal } from '@/services/challengePlayersFinalized';

const useStyles = makeStyles((theme) => ({
  div: {
    width: '100%',
    height: '100vh',
    padding: theme.spacing(2),
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    zIndex: 0,
    width: '100%',
    height: '100%',
    position: 'absolute',
    mixBlendMode: 'lighten',
    opacity: '0.5',
  },
  text: {
    fontSize: '1.45rem',
    fontFamily: 'IBM Plex Sans',
  },
  textTitleHead: {
    color: theme.palette.text.primary,
    fontFamily: 'IBM Plex Sans',
    fontSize: '4.0rem',
    fontWeight: 'bold',
    fontStretch: 'condensed',
    textAlign: 'center',
    padding: '2rem'
  },
  divRootRegister: {
    borderRadius: 5,
    padding: 0,
    backgroundColor: 'white',
    zIndex: 10,
    width: '70%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.only('md')]: {
      width: '80%',
    },
    [theme.breakpoints.down('sm')]: {
      width: '90%',
    },
    [theme.breakpoints.down('xs')]: {
      width: '98%',
    },
  },
  divContainer: {
    zIndex: 10,
    width: '100%',
    maxWidth: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divContainerBody: {
    paddingTop: '2rem',
    paddingBottom: '2rem',
    zIndex: 10,
    width: '100%',
    maxWidth: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      paddingTop: '1rem',
    },
  },
  head: {
    padding: theme.spacing(1),
    borderBottomColor: 'rgba(112, 112, 112, 0.3)',
    borderBottom: '1px solid',
    background: 'white',
    [theme.breakpoints.down('xs')]: {
      paddingTop: '0.5rem',
      paddingBottom: '0.5rem',
    },
  },
  divField: {
    paddingTop: '0.25rem',
    paddingBottom: '0.25rem',
    width: '100%',
  },
  textErrorButton: {
    fontSize: '1.5rem',
    color: '#DA1E27',
    fontFamily: 'IBM Plex Sans',
    margin: 0,
    textAlign: 'center',
  },
  gridTextField: {
    padding: '1rem'
  },
  buttonGray: {
    fontSize: '1.4rem',
    fontFamily: 'Bahnschrift',
    fontWeight: 'bold',
    color: 'white',
    width: '100%',
    paddingLeft: '0px',
    paddingRight: '0px',
    paddingTop: '1rem',
    paddingBottom: '1rem',
    backgroundColor: '#707070',
    '&:hover': {
      backgroundColor: '#505050'
    }
  },
  tooltip: {
    backgroundColor: '#033379',
  },
  option: {
    fontSize: '1.5rem'
  }
}));

export default function profile() {
  const classes = useStyles();

  const [messageError, setMessageError] = useState<any>(null);
  const [punctuationTotal, setPunctuationTotal] = useState<number>(0);

  const tokenPlayer = getLocalStorage(LocalStorageItem.tokenPlayer);
  const playerName = getLocalStorage(LocalStorageItem.playerName);
  const playerSoloEmail = getLocalStorage(LocalStorageItem.playerSoloEmail);

  useEffect(() => {
    if (tokenPlayer !== 'undefined' && tokenPlayer !== undefined && tokenPlayer !== null) {
      getPunctuationTotal(tokenPlayer)
        .then((response) => {
          if (response.ok) {
            setPunctuationTotal(response.data.punctuationTotal)
          } else {
            setMessageError(response.data.message)
          }
        });
    }

  }, [tokenPlayer])

  return (
    BasePage(
      <div className={classes.div} style={{ background: palette.get().background }}>
        {tokenPlayer ? <Grid
          className={classes.divRootRegister}
          container
          direction="column"
          justify="center"
          alignItems="center"
        >
          <Grid
            className={classes.head}
            container
            direction="column"
            justify="center"
            alignItems="center"
          >

            <Grid className={classes.divContainer} item>
              <Typography className={classes.textTitleHead}>
                PERFIL
              </Typography>
            </Grid>
            <Grid className={classes.divContainer} item>
              <div className={classes.divField}>
                <FormHelperText className={classes.textErrorButton} {...(messageError && { error: true })}>{messageError || ''}</FormHelperText>
              </div>
            </Grid>
          </Grid>

          <Paper className={classes.divContainerBody}>
            <Grid
              container
              direction="row"
              justify="space-evenly"
              alignItems="flex-start"
            >
              <Grid item xs={12} md={5} className={classes.gridTextField}>
                <Grid item xs={12} md={5}>
                  <FormLabel style={{ fontSize: '2rem', fontWeight: 'bold', paddingBottom: '1rem' }} component="legend">Nome</FormLabel>
                </Grid>
                <TextField
                  value={playerName}
                  disabled
                  name="name"
                  size="small"
                  fullWidth
                  variant={'filled'}
                />
                <div style={{paddingBottom:'2rem'}}></div>
                <Grid item xs={12} md={5}>
                  <FormLabel style={{ fontSize: '2rem', fontWeight: 'bold', paddingBottom: '1rem' }} component="legend">E-mail</FormLabel>
                </Grid>
                <TextField
                  value={playerSoloEmail}
                  disabled
                  name="email"
                  size="small"
                  fullWidth
                  variant={'filled'}
                />
              </Grid>

              <Grid item xs={12} md={5} className={classes.gridTextField}>
                <Grid item xs={12} md={5}>
                  <FormLabel style={{ fontSize: '2rem', fontWeight: 'bold', paddingBottom: '1rem' }} component="legend">Pontuação total</FormLabel>
                </Grid>
                <TextField
                  value={punctuationTotal}
                  disabled
                  name="key"
                  size="small"
                  fullWidth
                  variant={'filled'}
                />
              </Grid>
            </Grid>

          </Paper>
        </Grid> : <Grid
          className={classes.divRootRegister}
          container
          direction="column"
          justify="center"
          alignItems="center"
        >
          <Grid
            className={classes.head}
            container
            direction="column"
            justify="center"
            alignItems="center"
          >
            <Grid className={classes.divContainer} item>
              <Typography className={classes.textTitleHead}>
                Você não esta logado
              </Typography>
            </Grid>
          </Grid>
        </Grid>}
      </div>
    )
  );
}
