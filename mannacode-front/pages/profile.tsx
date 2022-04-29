import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  DialogContentText,
  Grid, IconButton, MenuItem, Paper, Tooltip
} from '@material-ui/core';
import MuiButton from '@material-ui/core/Button';
import { Form, Field } from 'react-final-form';
import Typography from '@material-ui/core/Typography';
import FormHelperText from '@material-ui/core/FormHelperText';
import { editProfile, newPassword as serviceNewPassword } from '@/services/users';
import { name } from '../components/form/rules/registerUser';
import Checkbox from '../components/fields/Checkbox';
import TextField from '../components/fields/TextField';
import BasePage from '../components/page/general/BasePage';
import { useAuth } from 'components/context/auth';
import { Edit as EditIcon } from '@material-ui/icons';
import AlertDialog from 'components/style/AlertDialog';
import palette from 'components/singleton/palette';
import Select from 'components/fields/Select';
import { userType } from 'components/static/List';

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
  option: {
    fontSize: '1.5rem'
  }
}));

export default function profile() {
  const classes = useStyles();

  const [messageError, setMessageError] = useState<any>(null);
  const [edit, setEdit] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [textNewPassword, setTextNewPassword] = useState<string>('');

  const { user, setUser, signed, token, setRequiredSigned, statusRedirect } = useAuth();

  useEffect(() => {
    setRequiredSigned(true);
  }, []);

  const onSubmit = async (values) => {
    const response = await editProfile(values, token);
    statusRedirect(response.data.code);
    if (response.ok) {
      setUser(response.data);
      setEdit(false);
      setMessageError('');
    } else { setMessageError(response.data.message); }
  };

  const validate = (data) => ({
    name: name(data, 'name'),
  });

  const handleClickOpen = async () => {
    const response = await serviceNewPassword(user.email);
    setTextNewPassword(response.data.message)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    BasePage(
      <div className={classes.div} style={{ background: palette.get().background }}>
        {signed ? <Grid
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
            <Form
              onSubmit={onSubmit}
              validate={validate}
              render={({
                handleSubmit, form, submitting
              }) => (
                <form style={{ width: '95%' }} onSubmit={handleSubmit}>
                  <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="flex-start"
                  >
                    <Grid item xs={12} md={6}>
                      <Grid item xs={11} className={classes.gridTextField}>
                        <Field
                          defaultValue={user.name}
                          disabled={!edit}
                          name="name"
                          label="Nome"
                          size="small"
                          fullWidth
                          component={TextField}
                          variant={edit ? 'outlined' : 'filled'}
                        />
                      </Grid>

                      <Grid item xs={11} className={classes.gridTextField}>
                        <Field
                          id='type'
                          name="type"
                          size="small"
                          component={Select}
                          displayEmpty
                          disabled={!edit}
                          _valueInitial={user?.type}
                          variant={!edit ? 'filled' : 'outlined'}
                        >
                          {userType.map((item) => (
                            <MenuItem key={item} value={item} className={classes.option} style={{ width: '100%' }}>
                              {item}
                            </MenuItem>
                          ))}
                        </Field>
                      </Grid>

                    </Grid>

                    <Grid item xs={12} md={6}
                      container
                      direction="row"
                      justify="flex-start"
                      alignItems="flex-start"
                    >
                      <Grid item xs={11} className={classes.gridTextField}>
                        <Field
                          defaultValue={user.email}
                          disabled
                          name="email"
                          label="E-mail"
                          size="small"
                          fullWidth
                          component={TextField}
                          variant={'filled'}
                        />
                      </Grid>
                      <Grid item xs={11} className={classes.gridTextField}>
                        <Field
                          disabled
                          defaultValue={'************'}
                          name="password"
                          label="Senha"
                          size="small"
                          fullWidth
                          type="password"
                          component={TextField}
                          variant="filled"
                        />
                      </Grid>
                      <Grid item xs={1} style={{ alignSelf: 'center' }}>
                        {edit ? <div>

                          <Tooltip placement="left"
                            classes={{
                              tooltip: classes.tooltip,
                            }}
                            title={<Typography>Alterar senha</Typography>}
                            className={classes.tooltip}
                          >
                            <IconButton onClick={handleClickOpen}
                              style={{ backgroundColor: 'transparent' }}>
                              <EditIcon ></EditIcon>
                            </IconButton>

                          </Tooltip>
                          <AlertDialog open={open} title='Alteração de senha' handleClose={handleClose}><DialogContentText>{textNewPassword}</DialogContentText></AlertDialog> </div> : <div></div>}
                      </Grid>

                      <Grid item xs={12} className={classes.gridTextField}>
                        <Field
                          disabled={!edit}
                          defaultChecked={user.newsInfo}
                          name="newsInfo"
                          component={Checkbox}>
                          <Typography style={{ color: palette.get().background }} className={classes.text}>Desejo receber novidades da plataforma</Typography>
                        </Field>
                      </Grid>
                      {edit ? <div></div> : <Grid item xs={11} className={classes.gridTextField} >
                        <MuiButton
                          style={{ background: palette.get().bottomGradient, color: palette.get().secondaryText, height: 45 }}
                          fullWidth
                          disabled={submitting}
                          variant="contained"
                          onClick={() => { setEdit(true) }}
                        >
                          Editar
                        </MuiButton>
                      </Grid>}
                    </Grid>
                    {edit ? <Grid item xs={12}
                      container
                      direction="row"
                      justify="flex-start"
                      alignItems="flex-start">
                      <Grid item xs={12} md={6}>
                        <Grid item xs={11} className={classes.gridTextField} >
                          <MuiButton
                            className={classes.buttonGray}
                            fullWidth
                            disabled={submitting}
                            style={{ background: palette.get().topGradient, color: palette.get().secondaryText, height: 45 }}
                            variant="contained"
                            color="primary"
                            onClick={() => {
                              setEdit(false);
                              form.reset({
                                name: user.name,
                                email: user.email,
                                newsInfo: user.newsInfo,
                                password: '************'
                              });
                            }}
                          >
                            Cancelar
                          </MuiButton>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Grid item xs={11} className={classes.gridTextField} >
                          <MuiButton
                            type="submit"
                            fullWidth
                            disabled={submitting}
                            style={{ background: palette.get().bottomGradient, color: palette.get().secondaryText, height: 45 }}
                            variant="contained"
                            color="primary"
                          >
                            {submitting ? 'Salvando...' : 'Salvar'}
                          </MuiButton>
                        </Grid>
                      </Grid>
                    </Grid> : <div></div>}
                  </Grid>
                </form>
              )}
            />
          </Paper>
        </Grid> : <Grid>
        </Grid>}
      </div>
    )
  );
}
