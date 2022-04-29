import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Paper, FormHelperText, FormLabel, Divider, MenuItem } from '@material-ui/core';
import MuiButton from '@material-ui/core/Button';
import { Form, Field } from 'react-final-form'
import Typography from '@material-ui/core/Typography';
import { useState } from 'react';
import { useRouter } from 'next/router'
import palette from 'components/singleton/palette';
import TextField from 'components/fields/TextField';
import Select from 'components/fields/Select';
import { get, update } from '@/services/groupChallenges';
import { useAuth } from 'components/context/auth';
import { PathName } from 'components/static/Route';
import { PageMode } from 'components/Enums/pageMode';
import { classifications, punctuations, modes, classificationsPlayerSolo } from 'components/static/List';
import { defaultProperties } from 'components/base/Theme';
import BasePage from '../general/BasePage';
import AcordionCheckBox from 'components/fields/AcordionCheckBox';
import Link from 'components/style/Link';

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
  divRootGeneral: {
    borderRadius: 5,
    padding: 0,
    backgroundColor: 'white',
    zIndex: 10,
    width: '40%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      width: '55%',
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
  errorMessage: {
    width: '100%',
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
  containerFieldsSub: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
  option: {
    fontSize: '1.5rem'
  }
}));

export default function general(props) {
  const router = useRouter();
  const { groupChallengeId, mode } = props;
  const { signed, token, statusRedirect } = useAuth();
  const classes = useStyles();
  const [messageError, setMessageError] = useState<any>(null);
  const [_mode, setMode] = useState<any>(null)
  const [punctuation, setPunctuation] = useState<any>(null)
  const [classification, setClassification] = useState<any>(null)
  const [groupChallenge, setGroupChallenge] = useState<any>(null);
  const [edited, setEdited] = useState<boolean>(!groupChallengeId);

  const onSubmit = async (values) => {
    values.id = undefined;
    values.updatedAt = undefined;
    values.userId = undefined;
    values.createdAt = undefined;
    values.deletedAt = undefined;
    values.type = undefined;
    if (values.classificationAll === 'ZERO') {
      values.classificationLength = 0;
    }
    else if (values.classificationAll === 'ALL') {
      values.classificationLength = undefined;
    }
    const response = await update(groupChallengeId, values, token);
    statusRedirect(response.data.code);
    if (response.ok) {
      if (mode === PageMode.new) {
        router.push(`${PathName.activities}`);
      }
    } else {
      setMessageError(response.data.message)
    }
    setEdited(false);
  };


  const getClassification = (value) => {
    if (!value) {
      return 'ALL'
    }
    else {
      setClassification(classificationsPlayerSolo.find(item => item.value === 'COUNT'))
      return 'COUNT'
    }
  }

  const getClassificationSolo = (value) => {
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
  const updateMode = (item) => {
    setMode(item);
  };

  const updatePunctuation = (item) => {
    setPunctuation(item);
  };
  const updateClassification = (item) => {
    setClassification(item);
  };

  useEffect(() => {
    if (groupChallengeId !== 'undefined' && signed) {
      get(groupChallengeId, token)
        .then((response) => {
          statusRedirect(response.data.code);
          if (response.ok) {
            if(response.data.validity){
              response.data.validity = response.data.validity.replace(/.\d+Z$/g, '')
            }
            setGroupChallenge(response.data);
            setPunctuation(punctuations.find(p => p.value === response.data.scoreEvaluation));
            setMode(modes.find(m => m.value === response.data.mode));
            setClassification(classifications.find(t => t.value === (response.data.classificationLength === 0).toString()));
          }
          else {
            setMessageError(response.data.message);
          }
        });
    }
  }, [signed, mode])

  return (
    BasePage(
      <div className={classes.div}
        style={{
          backgroundColor: palette.get().background,
        }}>
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
                  Configurações
                </Typography>
              </Grid>
            </div>
          </Grid>

          <Paper className={classes.divContainerBody}>
            <Form
              onSubmit={onSubmit}
              initialValues={groupChallenge}
              render={({ handleSubmit, form, submitting }) => (
                <form style={{ width: '100%' }} onSubmit={handleSubmit} noValidate>

                  <Divider style={{ padding: '0.1rem' }} />
                  <Grid container className={classes.containerFields}
                    justify="flex-start"
                    alignItems="flex-start"
                    spacing={1}
                  >


                    <Grid item xs={12} >
                      <FormLabel style={{ fontSize: '2rem', fontWeight: 'bold', paddingBottom: '1rem' }} component="legend">Escolha o modo</FormLabel>
                    </Grid>

                    <Grid item sm={12} md={12} >
                      <Field
                        id='mode'
                        name="mode"
                        size="small"
                        component={Select}
                        displayEmpty
                        disabled={!edited}
                        _valueInitial={groupChallenge?.mode}
                        variant={edited ? 'outlined' : 'filled'}
                      >
                        {modes.map((item) => (
                          <MenuItem key={item.value} value={item.value} className={classes.option} onClick={() => { updateMode(item) }} style={{ width: '100%' }}>
                            {item.title}
                          </MenuItem>
                        ))}
                      </Field>
                      <Grid item xs={12} >
                        <FormLabel style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{_mode?.description}</FormLabel>
                      </Grid>
                    </Grid>

                    {_mode?.value === 'MULTIPLAYER' ?
                      <>
                        <Grid container className={classes.containerFieldsSub}
                          justify="flex-start"
                          alignItems="flex-start"
                          spacing={1}
                        >
                          <Grid item xs={12} >
                            <FormLabel style={{ fontSize: '2rem', fontWeight: 'bold', paddingBottom: '1rem' }} component="legend">Pontuação</FormLabel>
                          </Grid>
                          <Grid item sm={12} md={12} >
                            <Field
                              id='scoreEvaluation'
                              name="scoreEvaluation"
                              size="small"
                              component={Select}
                              displayEmpty
                              disabled={!edited}
                              _valueInitial={groupChallenge?.scoreEvaluation}
                              variant={edited ? 'outlined' : 'filled'}
                            >
                              {punctuations.map((item) => (
                                <MenuItem key={item.value} value={item.value} className={classes.option} onClick={() => { updatePunctuation(item) }} style={{ width: '100%' }}>
                                  {item.title}
                                </MenuItem>
                              ))}
                            </Field>

                          </Grid>
                          {(punctuation?.value === 'ALL' || (groupChallenge?.scoreEvaluation === 'ALL' && !punctuation?.value)) ?
                            <>
                              <Grid item xs={12}  >
                                <Field
                                  disabled={!edited}
                                  defaultValue={groupChallenge?.applicatorWeight}
                                  variant={edited ? 'outlined' : 'filled'}
                                  name="applicatorWeight"
                                  label={<Typography className={classes.textFields}>Peso pontuação aplicador</Typography>}
                                  size="small"
                                  fullWidth
                                  component={TextField}
                                />
                              </Grid>
                              <Grid item xs={12}  >
                                <Field
                                  disabled={!edited}
                                  defaultValue={groupChallenge?.playerWeight}
                                  variant={edited ? 'outlined' : 'filled'}
                                  name="playerWeight"
                                  label={<Typography className={classes.textFields}>Peso pontuação Jogador</Typography>}
                                  size="small"
                                  fullWidth
                                  component={TextField}
                                />
                              </Grid>
                            </> : <div></div>
                          }
                          <Grid item xs={12} >
                            <FormLabel style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{punctuation?.description}</FormLabel>
                          </Grid>

                        </Grid>

                        <Divider style={{ padding: '0.1rem' }} />

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
                              _valueInitial={getClassification(groupChallenge?.classificationLength )}
                              variant={edited ? 'outlined' : 'filled'}
                            >
                              {classifications.map((item) => (
                                <MenuItem key={item.value} value={item.value} className={classes.option} onClick={() => { updateClassification(item) }} style={{ width: '100%' }}>
                                  {item.title}
                                </MenuItem>
                              ))}
                            </Field>
                          </Grid>
                          <Grid item xs={12} >
                            <FormLabel style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{classification?.description}</FormLabel>
                          </Grid>
                          {( classification?.value === 'COUNT') ? <>
                            <Grid item xs={12}  >
                              <Field
                                disabled={!edited}
                                defaultValue={groupChallenge?.classificationLength}
                                variant={edited ? 'outlined' : 'filled'}
                                name="classificationLength"
                                label={<Typography className={classes.textFields}>Quantidade classificado</Typography>}
                                size="small"
                                fullWidth
                                component={TextField}
                              />
                            </Grid>
                          </> : <div></div>
                          }

                        </Grid>
                        <Divider style={{ padding: '0.1rem' }} />

                        <Grid container className={classes.containerFieldsSub}
                          justify="flex-start"
                          alignItems="flex-start"
                          spacing={1}
                        >
                          <Grid item xs={12} >
                            <FormLabel style={{ fontSize: '2rem', fontWeight: 'bold', paddingBottom: '1rem' }} component="legend">Jogador</FormLabel>
                          </Grid>
                          <Grid item sm={12} md={12} >
                            <Field
                              name="viewCodeName"
                              text='Visualizar jogador da resolução'
                              detail='Permite visualizar o nome do jogador da resolução'
                              size="small"
                              component={AcordionCheckBox}
                              disabled={!edited}
                              _initialValue={groupChallenge?.viewCodeName}
                              variant={edited ? 'outlined' : 'filled'}
                            />
                          </Grid>
                        </Grid>
                      </> : <></>}
                    {_mode?.value === 'SOLO' ?
                      <>
                        <Grid container className={classes.containerFieldsSub}
                          justify="flex-start"
                          alignItems="flex-start"
                          spacing={1}
                        >
                          <Grid item xs={12} >
                            <FormLabel style={{ fontSize: '2rem', fontWeight: 'bold', paddingBottom: '1rem' }} component="legend">Entrega da atividade até</FormLabel>
                          </Grid>
                          <Grid item sm={12} md={12} >
                            <Field
                              name="validity"
                              size="small"
                              type='datetime-local'
                              component={TextField}
                              disabled={!edited}
                              fullWidth={true}
                              variant={edited ? 'outlined' : 'filled'}
                            />
                          </Grid>
                        </Grid>
                        <Divider style={{ padding: '0.1rem' }} />

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
                              _valueInitial={getClassificationSolo(groupChallenge?.classificationLength )}
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
                          {( classification?.value === 'COUNT') ? <>
                            <Grid item xs={12}  >
                              <Field
                                disabled={!edited}
                                defaultValue={groupChallenge?.classificationLength}
                                variant={edited ? 'outlined' : 'filled'}
                                name="classificationLength"
                                label={<Typography className={classes.textFields}>Quantidade classificado</Typography>}
                                size="small"
                                fullWidth
                                component={TextField}
                              />
                            </Grid>
                          </> : <div></div>
                          }

                        </Grid>
                        <Divider style={{ padding: '0.1rem' }} />

                        <Grid container className={classes.containerFieldsSub}
                          justify="flex-start"
                          alignItems="flex-start"
                          spacing={1}
                        >
                          <Grid item xs={12} >
                            <FormLabel style={{ fontSize: '2rem', fontWeight: 'bold', paddingBottom: '1rem' }} component="legend">Jogador</FormLabel>
                          </Grid>
                          <Grid item sm={12} md={12} >
                            <Field
                              name="viewPlayersFinishedChallenge"
                              text='Visualizar jogador do desafio'
                              detail='Permite que o jogador depois de terminar o desafio visualize os jogadores que já terminaram o desafio'
                              size="small"
                              component={AcordionCheckBox}
                              disabled={!edited}
                              _initialValue={groupChallenge?.viewPlayersFinishedChallenge}
                              variant={edited ? 'outlined' : 'filled'}
                            />
                          </Grid>
                        </Grid>
                      </> : <></>}

                    <Grid container className={classes.containerFields}
                      justify="space-between"
                      alignItems="center"
                      spacing={2}
                    >
                      <Grid item xs={5} >
                        <Link href={`${PathName.activities}`}>
                          <MuiButton
                            disabled={submitting}
                            className={classes.button}
                            color="primary"
                            style={{
                              color: palette.get().buttonBack, border: '2px solid', borderColor: palette.get().buttonBack
                            }}
                            fullWidth={true}
                            variant='contained'
                          >Atividades</MuiButton>
                        </Link>
                      </Grid>

                      {edited ? <></> : <Grid item xs={5} >
                        <MuiButton
                          disabled={submitting}
                          className={classes.button}
                          onClick={() => { setEdited(true) }}
                          color="primary"
                          style={{
                            color: 'white', backgroundColor: palette.get().topGradient,
                          }}
                          fullWidth
                          variant='contained'
                        >Editar</MuiButton>
                      </Grid>
                      }
                      {edited ?
                        <Grid item xs={5} >
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
                          >{submitting ? 'Salvando...' : 'Salvar'}</MuiButton>
                        </Grid> : <></>
                      }

                      {messageError && <div className={classes.errorMessage}>
                        <FormHelperText className={classes.textErrorButton} style={{ textAlign: 'center' }} {...(messageError && { error: true })}>{messageError ? messageError : ''}</FormHelperText>
                      </div>
                      }
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