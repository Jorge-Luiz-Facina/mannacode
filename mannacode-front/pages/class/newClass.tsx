import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Paper, FormHelperText, FormLabel, MenuItem } from '@material-ui/core';
import MuiButton from '@material-ui/core/Button';
import { Form, Field } from 'react-final-form'
import Typography from '@material-ui/core/Typography';
import { useState } from 'react';
import { useRouter } from 'next/router'
import palette from 'components/singleton/palette';
import { getPlan } from '@/services/users';
import { create, get, update } from '@/services/applicatorStartSolo';
import { create as createPlayers } from '@/services/playerStartSolo';
import { useAuth } from 'components/context/auth';
import { PathName } from 'components/static/Route';
import { validateRequiredField } from 'components/form/rules/registerUser';
import CustomTextField from 'components/fields/TextField';
import { defaultProperties } from 'components/base/Theme';
import BasePage from 'components/page/general/BasePage';
import Link from 'components/style/Link';
import Select from 'components/fields/Select';
import { classificationsPlayerSolo } from 'components/static/List';

const useStyles = makeStyles(theme => ({
  div: {
    minHeight: defaultProperties.globalHeigth,
    width: '100%',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divActivities: {
    borderRadius: 5,
    padding: 0,
    zIndex: 10,
    width: '100%',
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      width: '65%',
    },
    [theme.breakpoints.down('xs')]: {
      width: '98%',
    },
  },
  textTitleHead: {
    color: '#4c4c4c',
    fontFamily: 'Bahnschrift',
    fontSize: '5.0rem',
    fontWeight: 'bold',
    fontStretch: 'condensed',
    textAlign: 'center'
  },
  divRootGeneral: {
    borderRadius: 5,
    padding: 0,
    backgroundColor: 'white',
    zIndex: 10,
    width: '75%',
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
  textarea: {
    width: '100%',
    fontSize: '1.6rem',
    color: 'rgba(0, 0, 0, 0.87)',
    fontFamily: 'Gilroy, Roboto, Helvetica, Arial, sans-serif',
    padding: '14'
  },
  option: {
    fontSize: '1.5rem'
  },
  textFields: {
    fontSize: '1.6rem',
    fontFamily: 'Bahnschrift',
  },
  containerFieldsSub: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
}));

export default function newClass(props) {
  const { mode, applicatorStartId } = props;
  const classes = useStyles();
  const router = useRouter();
  const [messageError, setMessageError] = useState<any>(null);
  const [applicatorStart, setApplicatorStart] = useState<any>(null);
  const [plan, setPlan] = useState<any>();
  const [edited, setEdited] = useState<boolean>(!applicatorStartId);
  const [button, setButton] = useState<string>('');
  const [classification, setClassification] = useState<any>(null)
  const [isUpdate, setIsUpdate] = useState<boolean>(false)
  const [userAdd, setUserAdd] = useState<string>('')


  const { signed, token, statusRedirect } = useAuth();

  const validate = (data) => ({
    name: validateRequiredField(data, 'name'),
  });

  const onSubmit = async (values) => {

    if (button === 'ADDPLAYER') {
      if (!applicatorStartId) {
        setMessageError('Você tem que criar primeiro a turma')
      } else {
        const response = await createPlayers({ applicatorStartId, player:{ name: values.namePlayer, email: values.emailPlayer} }, token);
        statusRedirect(response.data.code);
        if (response.ok) {
          values.namePlayer = ''
          values.emailPlayer = ''
          setUserAdd(`Adicionado ${response.data.name}`)
          setMessageError('')
          setIsUpdate(!isUpdate);
        } else {
          setMessageError(response.data.message)
        }
      }
    } else {
      if (applicatorStartId && edited && button === 'RENAMECLASS') {
        let _classificationLength;
        if (values.classificationAll === 'ZERO') {
          _classificationLength = 0;
        }
        else if (values.classificationAll === 'ALL') {
          _classificationLength = null;
        } else {
          _classificationLength = values.classificationLength
        }
        const response = await update(applicatorStartId, { name: values.name, classificationLength: _classificationLength }, token);
        if (response.ok) {
          setApplicatorStart(response.data)
          setEdited(false);
          setMessageError('');
          setIsUpdate(!isUpdate);
        } else {
          setMessageError(response.data.message)
        }
      } else if (button === 'ADDCLASS') {
        const response = await create({ name: values.name }, token);
        if (response.ok) {
          setEdited(false);
          setMessageError('')
          router.push(`${PathName.class}${PathName.newClass}?&applicatorStartId=${response.data.id}&mode=edit`)
        } else {
          setMessageError(response.data.message)
        }
      }
    }
  };

  const autoSeparator = (stringPlayers) => {
    let splitted = stringPlayers.split(';');
    let farr = splitted.filter(function (entry) { return /\S/.test(entry); });
    farr = farr.map(str => str.replace(/\s/g, ''));
    let array = farr.map(function (el) {
      return el.trim();
    });
    return array;
  }

  const getClassification = (value) => {
    if (!value && value !== 0) {
      return 'ALL'
    }
    else if (value === 0) {
      return 'ZERO'
    } else {
      setClassification(classificationsPlayerSolo.find(item => item.value === 'COUNT'))
      return 'COUNT'
    }
  }


  useEffect(() => {
    if (signed) {
      if (applicatorStartId) {
        get(applicatorStartId, token)
          .then((response) => {
            statusRedirect(response.data.code);
            if (response.ok) {
              setApplicatorStart(response.data);
            } else {
              setMessageError(response.data.message);
            }
            setApplicatorStart(response.data);
          });
      }
      getPlan(token)
        .then((response) => {
          statusRedirect(response.data.code);
          if (response.ok) {
            setPlan(response.data);
          } else {
            setMessageError(response.data.message);
          }
          setPlan(response.data);
        });
    }
  }, [signed, mode, isUpdate])


  const updateClassification = (item) => {
    setClassification(item);
  };
  return (
    BasePage(
      <div lang='pt-br' className={classes.div} style={{ background: palette.get().background }}>
        <Grid
          className={classes.divActivities}
          container
          direction="row"
          justify="space-evenly"
          alignItems="flex-start"
        >
          <Grid item xs={12} sm={9} style={{ height: '100%' }} container
            direction="column"
            justify="center"
            alignItems="center"
          >
            <Grid className={classes.divRootGeneral}
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
                      Turma
                    </Typography>
                  </Grid>
                  <Grid className={classes.divContainer} item >
                    <Typography style={{ width: '95%', textAlign: 'center' }}> Total de jogadores usando as turmas{`  ${plan?.playersClass}/${plan?.numberPlayers}  `}turma atual {`  ${applicatorStart?.numberPlayers ? applicatorStart?.numberPlayers : 0}  `} jogadores </Typography>
                  </Grid>
                </div>
              </Grid>

              <Paper className={classes.divContainerBody}>
                <Form
                  mutators={{
                    autoCorrection: (args, state, utils) => {
                      utils.changeValue(state, 'players', () => autoSeparator(state.lastFormState.values.players).join(';'))
                    }
                  }}
                  onSubmit={onSubmit}
                  validate={validate}
                  render={({
                    handleSubmit, form, submitting
                  }) => (
                    <form style={{ width: '100%' }} onSubmit={handleSubmit}>
                      <Grid container className={classes.containerFields}
                        justify="center"
                        alignItems="flex-start"
                        spacing={2}
                      >
                        <Grid item xs={12}
                          container
                          direction="row"
                          justify="space-between"
                          alignItems="center"
                        >

                          <Grid item xs={8} >
                            <Grid item xs={12} >
                              <FormLabel style={{ fontSize: '2rem', fontWeight: 'bold', paddingBottom: '1rem' }} component="legend">Nome</FormLabel>
                            </Grid>
                            <Field
                              disabled={!edited}
                              defaultValue={applicatorStart?.name}
                              autoFocus={true}
                              name="name"
                              size="small"
                              fullWidth={true}
                              component={CustomTextField}
                              variant={edited ? 'outlined' : 'filled'}
                            />
                            <Grid container className={classes.containerFieldsSub}
                              justify="flex-start"
                              alignItems="flex-start"
                              spacing={1}
                            >
                              <Grid item xs={12} >
                                <FormLabel style={{ fontSize: '2rem', fontWeight: 'bold', paddingBottom: '1rem' }} component="legend">Classificação</FormLabel>
                              </Grid>

                              <Grid item sm={12} md={12} >
                                <Field
                                  id='classificationAll'
                                  name="classificationAll"
                                  size="small"
                                  component={Select}
                                  displayEmpty
                                  disabled={!edited}
                                  _valueInitial={getClassification(applicatorStart?.classificationLength)}
                                  variant={edited ? 'outlined' : 'filled'}
                                >
                                  {classificationsPlayerSolo.map((item) => (
                                    <MenuItem key={item.value} value={item.value} className={classes.option} onClick={() => { updateClassification(item) }} style={{ width: '100%' }}>
                                      {item.title}
                                    </MenuItem>
                                  ))}
                                </Field>
                              </Grid>
                              <Grid item xs={12} >
                                <FormLabel style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{classification?.description}</FormLabel>
                              </Grid>
                              {(classification?.value === 'COUNT') ? <>
                                <Grid item xs={12}  >
                                  <Field
                                    disabled={!edited}
                                    defaultValue={applicatorStart?.classificationLength}
                                    variant={edited ? 'outlined' : 'filled'}
                                    name="classificationLength"
                                    label={<Typography className={classes.textFields}>Quantidade classificado</Typography>}
                                    size="small"
                                    fullWidth
                                    component={CustomTextField}
                                  />
                                </Grid>
                              </> : <div></div>
                              }

                            </Grid>
                          </Grid>


                          <Grid item xs={3} >
                            {mode === 'edit' && !edited ?
                              <MuiButton
                                type='submit'
                                disabled={submitting}
                                onClick={() => { setEdited(true); setButton('') }}
                                className={classes.button}
                                color="primary"
                                style={{
                                  color: 'white', backgroundColor: palette.get().topGradient,
                                }}
                                fullWidth={true}
                                variant='contained'
                              >Editar</MuiButton> : <></>}
                            {mode === 'edit' && edited ?
                              <MuiButton
                                type='submit'
                                disabled={submitting}
                                onClick={() => { setEdited(true); setButton('RENAMECLASS') }}
                                className={classes.button}
                                color="primary"
                                style={{
                                  color: 'white', backgroundColor: palette.get().topGradient,
                                }}
                                fullWidth={true}
                                variant='contained'
                              >Salvar</MuiButton> : <></>}
                            {mode !== 'edit' ?
                              <MuiButton
                                type='submit'
                                disabled={submitting}
                                onClick={() => { setButton('ADDCLASS') }}
                                className={classes.button}
                                color="primary"
                                style={{
                                  color: 'white', backgroundColor: palette.get().topGradient,
                                }}
                                fullWidth={true}
                                variant='contained'
                              >Criar</MuiButton> : <></>}
                          </Grid>
                        </Grid>

                        <Grid item xs={12}
                          container
                          direction="row"
                          justify="space-between"
                          alignItems="center"
                        >

                          <Grid item xs={8} >
                            <Grid item xs={6} >
                              <FormLabel style={{ fontSize: '2rem', fontWeight: 'bold', paddingBottom: '1rem' }} component="legend">Nome jogador</FormLabel>
                            </Grid>
                            <Field
                              name="namePlayer"
                              size="small"
                              fullWidth={true}
                              component={CustomTextField}
                              variant={'outlined'}
                            />
                            <Grid style={{padding:'1rem'}}>
                              
                            </Grid>
                            <Grid item xs={6} >
                              <FormLabel style={{ fontSize: '2rem', fontWeight: 'bold', paddingBottom: '1rem' }} component="legend">E-mail jogador</FormLabel>
                            </Grid>
                            <Field
                              name="emailPlayer"
                              size="small"
                              fullWidth={true}
                              component={CustomTextField}
                              variant={'outlined' }
                            />

                          </Grid>
                          <Grid item xs={3} >
                            <MuiButton
                              type='submit'
                              disabled={submitting}
                              onClick={() => { setButton('ADDPLAYER') }}
                              className={classes.button}
                              color="primary"
                              style={{
                                color: 'white', backgroundColor: palette.get().topGradient,
                              }}
                              fullWidth={true}
                              variant='contained'
                            >Adicionar</MuiButton>
                          </Grid>
                        </Grid>
                        <Typography style={{ width: '95%', color: '#0F61FD' }}> {userAdd}</Typography>
                        <Typography style={{ width: '95%' }}> Ao adicionar o jogador será enviado um e-mail com informações para ter acesso a turma </Typography>

                        {messageError && <div className={classes.errorMessage}>
                          <FormHelperText className={classes.textErrorButton} {...(messageError && { error: true })}>{messageError ? messageError : ''}</FormHelperText>
                        </div>
                        }

                      </Grid>
                    </form>
                  )}
                />
              </Paper>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={1}>
            <div style={{ height: '100px' }}>
              <Grid style={{ height: '100%' }}
                container
                direction="column"
                justify="space-between"
                alignItems="center"
              >
                <Link
                  href={`${PathName.class}${PathName.applicator}${PathName.players}?applicatorStartId=${applicatorStartId}`}
                >
                  <MuiButton fullWidth
                    variant="outlined"
                    style={{ background: palette.get().bottomGradient, height: 45, color: palette.get().primaryText }}
                  >
                    Jogadores</MuiButton>
                </Link>
                <Link
                  href={`${PathName.class}`}
                >
                  <MuiButton fullWidth
                    variant="outlined"
                    style={{ background: palette.get().bottomGradient, height: 45, color: palette.get().primaryText }}
                  >
                    Turmas</MuiButton>
                </Link>

              </Grid>
            </div >
          </Grid>
        </Grid>
      </div >
    )
  )
}

export async function getServerSideProps({ query }) {
  const mode = query.mode ? query.mode : false
  const applicatorStartId = query.applicatorStartId ? query.applicatorStartId : false
  return { props: { applicatorStartId, mode, } };
}