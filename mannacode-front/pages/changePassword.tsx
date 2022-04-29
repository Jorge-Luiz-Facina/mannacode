import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Paper, FormHelperText } from '@material-ui/core';
import MuiButton from '@material-ui/core/Button';
import { Form, Field } from 'react-final-form';
import Typography from '@material-ui/core/Typography';
import { useState } from 'react';
import { useRouter } from 'next/router';
import TextField from '../components/fields/TextField';
import BasePage from '../components/page/general/BasePage';
import { changePassword as serviceChangePassword } from '@/services/users';
import { confirmPassword, password } from 'components/form/rules/registerUser';
import { PathName } from 'components/static/Route';
import palette from 'components/singleton/palette';

const useStyles = makeStyles((theme) => ({
  div: {
    minHeight: '93vh',
    width: '100%',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textTitleHead: {
    color: '#4c4c4c',
    fontFamily: 'Bahnschrift',
    fontSize: '5.0rem',
    fontWeight: 'bold',
    fontStretch: 'condensed',
    textAlign: 'center',
  },
  divRootChangePassword: {
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
    justifyContent: 'center',
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
    height: '45px',
  },
  containerButton: {
    paddingTop: '2rem',
    width: '100%',
  },
  errorMessage: {
    margin: '2rem',
  },
  textErrorButton: {
    fontSize: '1.5rem',
    color: '#DA1E27',
    fontFamily: 'IBM Plex Sans',
    margin: 0,
    textAlign: 'center',
  },
  containerFields: {
    padding: theme.spacing(3),
  },
  textTitleArea: {
    color: '#4c4c4c',
    fontFamily: 'Bahnschrift',
    fontSize: '3.5rem',
    fontWeight: 'bold',
    fontStretch: 'condensed',
    textAlign: 'center',
    padding: '2rem',
  },
}));

export default function changePassword() {
  const classes = useStyles();
  const router = useRouter();
  const [messageError, setMessageError] = useState<any>(null);
  const [sucess, setSucess] = useState<boolean>(false);

  const onSubmit = async (values) => {
    const response = await serviceChangePassword(values, router.query.token);
    if (response.ok) {
      setMessageError('');
      setSucess(true);
      window.setTimeout(() => {
        router.push(PathName.login);
      }, 3000);
    } else {
      setMessageError(response.data.message);
    }
  };

  const validate = (data) => ({
    password: password(data, 'password'),
    confirmPassword: confirmPassword(data, 'password', 'confirmPassword'),
  });
  return (
    BasePage(
      <div className={classes.div} style={{ background: palette.get().background }}>
        <Grid
          className={classes.divRootChangePassword}
          container
          direction="column"
          justify="center"
          alignItems="center"
          style={{ display: sucess ? 'none' : 'flex' }}
        >
          <Grid
            className={classes.head}
            container
            direction="column"
            justify="center"
            alignItems="center"
          >
            <div className={classes.fields}>
              <Grid className={classes.divContainer} item>
                <Typography className={classes.textTitleHead}>
                  Alterar Senha
                </Typography>
              </Grid>
            </div>
          </Grid>

          <Paper className={classes.divContainerBody}>
            <Form
              validate={validate}
              onSubmit={onSubmit}
              render={({ handleSubmit, submitting }) => (
                <form onSubmit={handleSubmit}>
                  <Grid
                    container
                    className={classes.containerFields}
                    justify="center"
                    alignItems="flex-start"
                    spacing={2}
                  >
                    <Grid item xs={12}>
                      <Field
                        type="password"
                        name="password"
                        label="Nova senha"
                        size="small"
                        fullWidth
                        component={TextField}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Field
                        type="password"
                        name="confirmPassword"
                        label="Confirmação da nova senha"
                        size="small"
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
                        style={{ color: palette.get().primaryText, background: palette.get().topGradient }}
                        fullWidth
                        variant="contained"
                      >
                        {submitting ? 'Alterando...' : 'Alterar'}
                      </MuiButton>
                    </Grid>

                    {messageError && (
                      <div className={classes.errorMessage}>
                        <FormHelperText className={classes.textErrorButton} {...(messageError && { error: true })}>{messageError || ''}</FormHelperText>
                      </div>
                    )}

                  </Grid>
                </form>
              )}
            />
          </Paper>
        </Grid>
        <Grid className={classes.divRootChangePassword}
          style={{ display: sucess ? 'flex' : 'none', paddingTop: '8rem', paddingBottom: '8rem' }}>
          <Typography className={classes.textTitleArea} >
            Senha alterada com sucesso!
          </Typography>
        </Grid>
      </div>,
    )
  );
}