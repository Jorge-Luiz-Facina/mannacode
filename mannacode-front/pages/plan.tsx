import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,  Paper, TextField
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import FormHelperText from '@material-ui/core/FormHelperText';
import {  getPlan } from '@/services/users';
import BasePage from '../components/page/general/BasePage';
import { useAuth } from 'components/context/auth';
import palette from 'components/singleton/palette';
import { FormatDate } from 'components/util/FormatDate';

const useStyles = makeStyles((theme) => ({
  div: {
    width: '100%',
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
  root: {
    paddingTop:'27px',
    '& .MuiInputBase-root.Mui-disabled': {
      color: 'black'
    },
    '& .MuiFormLabel-root.Mui-disabled': {
      color: 'black',
      fontSize:'2.5rem'
    },
  }
}));

export default function profile() {
  const classes = useStyles();

  const [messageError, setMessageError] = useState<any>(null);
  const [plan, setPlan] = useState<any>(null);

  const { signed, token, setRequiredSigned, statusRedirect } = useAuth();

  useEffect(() => {
    setRequiredSigned(true);
  }, []);

  useEffect(() => {
    if (signed) {
      getPlan(token).then((response) => {
        statusRedirect(response.data.code);
        if (response.ok) {
          const _plan = response.data;
          _plan.started = FormatDate(_plan.started);
          _plan.validity = FormatDate(_plan.validity);
          setPlan(response.data);
          setMessageError('');
        } else { setMessageError(response.data.message); }
      });
    }
  }, [signed]);

  return (
    BasePage(
      <div className={classes.div} style={{ background: palette.get().background }}>
        {signed && plan ? <Grid
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
                Plano
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
              justify="space-between"
              alignItems="flex-start"
            >
              <Grid item xs={12} md={6}>
                <Grid item xs={11} className={classes.gridTextField}>
                  <TextField
                    className={classes.root}
                    value={plan?.numberPlayers}
                    disabled
                    name="numberPlayers"
                    label="Quantidade de jogadores"
                    size="small"
                    fullWidth
                    variant={'filled'}
                  />
                </Grid>

                <Grid item xs={11} className={classes.gridTextField}>
                  <TextField
                    className={classes.root}
                    value={plan?.value === 0 ? 'Gratuito' : plan?.value}
                    disabled
                    name="value"
                    label="Valor"
                    size="small"
                    fullWidth
                    variant={'filled'}
                  />
                </Grid>
              </Grid>

              <Grid item xs={12} md={6}
                container
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
              >
                <Grid item xs={11} className={classes.gridTextField}>
                  <TextField
                    className={classes.root}
                    value={plan?.started}
                    disabled
                    name="started"
                    label="Início"
                    size="small"
                    fullWidth
                    variant={'filled'}
                  />
                </Grid>
                <Grid item xs={11} className={classes.gridTextField}>
                  <TextField
                    className={classes.root}
                    value={plan?.validity}
                    disabled
                    name="validity"
                    label="Validado até"
                    size="small"
                    fullWidth
                    variant={'filled'}
                  />
                </Grid>
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
                Você não tem nenhum plano
              </Typography>
            </Grid>
          </Grid>
        </Grid>}
      </div>
    )
  );
}
