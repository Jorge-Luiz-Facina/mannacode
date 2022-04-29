import React from 'react';
import BasePage from '../components/page/general/BasePage';
import { makeStyles } from '@material-ui/core/styles';
import { defaultProperties } from '../components/base/Theme';
import { Grid, Paper, FormHelperText } from '@material-ui/core';
import MuiButton from '@material-ui/core/Button';
import { Form, Field } from 'react-final-form'
import Typography from '@material-ui/core/Typography';
import Link from '../components/style/Link'
import { useState } from 'react';
import { useRouter } from 'next/router'
import TextField from '../components/fields/TextField';
import palette from 'components/singleton/palette';
import { useAuth } from 'components/context/auth';
import { PathName } from 'components/static/Route';

const useStyles = makeStyles(theme => ({
  div: {
    minHeight: defaultProperties.globalHeigth,
    width: '100%',
    position: 'relative',
    scrollMarginTop: defaultProperties.globalHeaderHeigth,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0
  },
  textFields: {
    fontSize: '1.6rem',
    fontFamily: 'Bahnschrift',
  },
  textTitleHead: {
    color: '#4c4c4c',
    fontFamily: 'Bahnschrift',
    fontSize: '5.0rem',
    fontWeight: 'bold',
    fontStretch: 'condensed',
    textAlign: 'center'
  },
  divRootLogin: {
    borderRadius: 5,
    padding: 0,
    backgroundColor: 'white',
    zIndex: 10,
    width: '30%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      width: '65%',
    },
    [theme.breakpoints.down('xs')]: {
      width: '90%',
    },
  },
  divContainer: {
    zIndex: 10,
    width: '100%',
    maxWidth: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  divContainerBody: {
    zIndex: 10,
    width: '100%',
    maxWidth: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fields: {
    width: '100%',
    zIndex: 10,
    position: 'relative',
    verticalAlign: 'middle',
  },
  head: {
    paddingTop: '1rem',
    paddingBottom: '0.5rem',
    borderBottomColor: 'rgba(112, 112, 112, 0.3)',
    borderBottom: '1px solid',
    [theme.breakpoints.down('xs')]: {
      paddingTop: '0.25rem',
      paddingBottom: '0.25rem',
    },
  },
  button: {
    fontSize: '1.5rem',
    width: '100%',
    height: '45px'
  },
  containerButton: {
    paddingTop: '2rem',
    width: '100%',
  },
  errorMessage: {
    margin: '2rem',
  },
  textFooter: {
    textAlign: 'center',
    color: '#0F61FD',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    fontStretch: 'condensed',
    fontFamily: 'Bahnschrift',
  },
  containerFooter: {
    paddingTop: '2rem',
    paddingBottom: '0rem',
  },
  textErrorButton: {
    fontSize: '1.5rem',
    color: '#DA1E27',
    fontFamily: 'IBM Plex Sans',
    margin: 0,
    textAlign: 'center'
  },
  containerFields: {
    padding: theme.spacing(3)
  },
}));

export default function login() {
  const classes = useStyles()
  const router = useRouter()
  const [messageError, setMessageError] = useState<any>(null)
  const { signIn } = useAuth();
  const onSubmit = async (values) => {
    const response = await signIn(values);
    if (response.ok) {
      router.push('/');
    } else {
      setMessageError('E-mail ou senha incorreta');
    }
  };

  return (
    BasePage(
      <div className={classes.div}
        style={{
          backgroundColor: palette.get().background,
        }}>
        <Grid className={classes.divRootLogin}
          container
          direction="column"
          justify="center"
          alignItems="center"
        >
          <Grid className={classes.head}
            container
            direction="column"
            justify="center"
            alignItems="center"
          >
            <div className={classes.fields}>

              <Grid className={classes.divContainer} item >
                <Typography className={classes.textTitleHead}>
                  Login
                </Typography>
              </Grid>
            </div>
          </Grid>

          <Paper className={classes.divContainerBody}>
            <Form
              onSubmit={onSubmit}
              render={({ handleSubmit, submitting }) => (
                <form onSubmit={handleSubmit}>
                  <Grid container className={classes.containerFields}
                    justify="center"
                    alignItems="flex-start"
                    spacing={2}
                  >
                    <Grid item xs={12} >
                      <Field
                        autoFocus={true}
                        name="email"
                        label={<Typography className={classes.textFields}>E-mail</Typography>}
                        size="small"
                        fullWidth
                        component={TextField}
                        variant="outlined"
                      />
                    </Grid>

                    <Grid item xs={12} >
                      <Field
                        name="password"
                        label={<Typography className={classes.textFields}>Senha</Typography>}
                        size="small"
                        type="password"
                        fullWidth
                        component={TextField}
                        variant="outlined"
                      />
                    </Grid>

                    <Grid item className={classes.containerButton}>
                      <MuiButton
                        type="submit"
                        disabled={submitting}
                        className={classes.button}
                        color="primary"
                        style={{
                          color: 'white', backgroundColor: palette.get().topGradient,
                        }}
                        fullWidth
                        variant='contained'
                      >Entrar</MuiButton>
                    </Grid>

                    {messageError && <div className={classes.errorMessage}>
                      <FormHelperText className={classes.textErrorButton} {...(messageError && { error: true })}>{messageError ? messageError : ''}</FormHelperText>
                    </div>
                    }

                    <Grid className={classes.containerFooter}
                      container
                      direction="row"
                      justify="space-between"
                      alignItems="center"
                    >
                      <Grid item xs={6}>
                        <Link href="/register">
                          <Typography className={classes.textFooter}  style={{ textAlign: 'start' }}>
                            Não tenho conta. Cadastrar.
                          </Typography>
                        </Link>
                      </Grid>
                      <Grid item xs={6}>
                        <Link href={PathName.forgotPassword}>
                          <Typography className={classes.textFooter}  style={{ textAlign: 'end' }}>
                          Esqueceu a senha ?
                          </Typography>
                        </Link>
                      </Grid>
                    </Grid>
                  </Grid>
                </form>
              )}
            />
          </Paper>
        </Grid>
      </div >
    )
  )
}