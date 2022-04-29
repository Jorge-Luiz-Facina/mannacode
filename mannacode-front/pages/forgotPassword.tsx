import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Paper, FormHelperText } from '@material-ui/core';
import MuiButton from '@material-ui/core/Button';
import { Form, Field } from 'react-final-form';
import Typography from '@material-ui/core/Typography';
import { useState } from 'react';
import Link from '../components/style/Link';
import TextField from '../components/fields/TextField';
import BasePage from '../components/page/general/BasePage';
import { newPassword } from '@/services/users';
import { email } from 'components/form/rules/registerUser';
import AlertDialogPassword from 'components/style/AlertDialogPassword';
import { PathName } from 'components/static/Route';
import DialogContentText from '@material-ui/core/DialogContentText';
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
  divRootForgotPassword: {
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
  textFooter: {
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
    textAlign: 'center',
  },
  containerFields: {
    padding: theme.spacing(3),
  },
}));

export default function forgotPassword() {
  const classes = useStyles();
  const [messageError, setMessageError] = useState<any>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [textNewPassword, setTextNewPassword] = useState<string>('');

  const onSubmit = async (values) => {
    const response = await newPassword(values.email);
    if (response.ok) {
      setTextNewPassword(response.data.message)
      setOpen(true);
      setMessageError('');
    } else {
      setMessageError(response.data.message);
    }
  };

  const validate = (data) => ({
    email: email(data, 'email'),
  });

  const handleClose = () => {
    setOpen(false);
  };

  return (
    BasePage(
      <div className={classes.div} style={{ background: palette.get().background }}>
        <Grid
          className={classes.divRootForgotPassword}
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
            <div className={classes.fields}>

              <Grid className={classes.divContainer} item>
                <Typography className={classes.textTitleHead}>
                  Esqueceu a senha
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
                        autoFocus
                        name="email"
                        label="E-mail"
                        size="small"
                        fullWidth
                        component={TextField}
                        variant="outlined"
                      />
                    </Grid>


                    <Grid item className={classes.containerButton}>
                      <div>
                        <MuiButton
                          type="submit"
                          disabled={submitting}
                          className={classes.button}
                          color="primary"
                          style={{ color: palette.get().primaryText, background: palette.get().topGradient }}
                          fullWidth
                          variant="contained"
                        >
                          {submitting ? 'Enviando...' : 'Enviar'}
                        </MuiButton>
                        <AlertDialogPassword open={open} title='Alteração de senha' handleClose={handleClose}>
                          <DialogContentText style={{ color: palette.get().background }}>{textNewPassword}</DialogContentText>
                        </AlertDialogPassword> </div>
                    </Grid>

                    {messageError && (
                      <div className={classes.errorMessage}>
                        <FormHelperText className={classes.textErrorButton} {...(messageError && { error: true })}>{messageError || ''}</FormHelperText>
                      </div>
                    )}

                    <Grid
                      className={classes.containerFooter}
                      container
                      direction="row"
                      justify="space-between"
                      alignItems="center"
                    >
                      <Grid item xs={6}>
                        <Link
                          href={PathName.register}
                        >
                          <Typography className={classes.textFooter} style={{ textAlign: 'start' }}>
                            Não tenho conta. Cadastrar.
                          </Typography>
                        </Link>
                      </Grid>
                      <Grid item xs={6}>
                        <Link
                          href={PathName.login}
                        >
                          <Typography className={classes.textFooter} style={{ textAlign: 'end' }}>
                            Já tenho conta. Fazer login.
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
      </div>,
    )
  );
}
