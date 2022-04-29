import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Paper, FormHelperText, FormLabel } from '@material-ui/core';
import MuiButton from '@material-ui/core/Button';
import { Form, Field } from 'react-final-form'
import Typography from '@material-ui/core/Typography';
import { useState } from 'react';
import { useRouter } from 'next/router'
import palette from 'components/singleton/palette';
import TextareaAutosize from 'components/fields/TextareaAutosize';
import { create, get, update } from '@/services/groupChallenges';
import { useAuth } from 'components/context/auth';
import { PathName } from 'components/static/Route';
import { validateRequiredField } from 'components/form/rules/registerUser';
import BasePage from '../general/BasePage';
import Link from 'components/style/Link';
import CustomTextField from 'components/fields/TextField';
import { defaultProperties } from 'components/base/Theme';

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
    width: '50%',
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
}));

export default function general(props) {
  const { mode, groupChallengeId } = props;
  const classes = useStyles()
  const router = useRouter();
  const [messageError, setMessageError] = useState<any>(null);
  const [groupChallenge, setGroupChallenge] = useState<any>(null);
  const [edited, setEdited] = useState<boolean>(!groupChallengeId);

  const { signed, token, statusRedirect } = useAuth();

  const validate = (data) => ({
    title: validateRequiredField(data, 'title'),
    description: validateRequiredField(data, 'description'),
  });

  const onSubmit = async (values) => {
    if (groupChallengeId && edited) {
      delete groupChallenge.type;
      const valuesAll = { ...groupChallenge, userId: undefined, title: values.title, description: values.description }
      const response = await update(groupChallengeId, valuesAll, token);
      statusRedirect(response.data.code);
      if (response.ok) {
        setEdited(false);
      }
      else {
        setMessageError(response.data.message);
      }
    } else {
      const response = await create(values, token);
      statusRedirect(response.data.code);
      if (response.ok) {
        router.push(`${PathName.activities}${PathName.challenges}?groupChallengeId=${response.data.id}&mode=${mode}`)
      }
      else {
        setMessageError(response.data.message);
      }
    }
  };

  useEffect(() => {
    if (groupChallengeId && signed) {
      get(groupChallengeId, token)
        .then((response) => {
          statusRedirect(response.data.code);
          if (response.ok) {
            setGroupChallenge(response.data);
          } else {
            setMessageError(response.data.message);
          }
          setGroupChallenge(response.data);
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
                  Geral
                </Typography>
              </Grid>
            </div>
          </Grid>

          <Paper className={classes.divContainerBody}>
            <Form
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
                    <Grid item xs={12} >
                      <FormLabel component="legend">Nome</FormLabel>
                      <Field
                        disabled={!edited}
                        defaultValue={groupChallenge?.title}
                        autoFocus={true}
                        name="title"
                        size="small"
                        fullWidth={true}
                        component={CustomTextField}
                        variant={edited ? 'outlined' : 'filled'}
                      />
                    </Grid>

                    <Grid item xs={12} >
                      <FormLabel component="legend">Descrição</FormLabel>
                      <Field
                        disabled={!edited}
                        defaultValue={groupChallenge?.description}
                        name="description"
                        rowsMin={8}
                        rowsMax={8}
                        size="small"
                        component={TextareaAutosize}
                        variant={edited ? 'outlined' : 'filled'}
                        className={classes.textarea}
                      />
                    </Grid>

                    {groupChallengeId ? <Grid container
                      direction="row"
                      justify="space-between"
                      alignItems="center"
                      item xs={12} className={classes.containerButton}>
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
                      {edited ? <></> :
                        <Grid item xs={5} >
                          <MuiButton
                            disabled={submitting}
                            onClick={() => { setEdited(true); }}
                            className={classes.button}
                            color="primary"
                            style={{
                              color: 'white', backgroundColor: palette.get().topGradient,
                            }}
                            fullWidth={true}
                            variant='contained'
                          >Editar</MuiButton>
                        </Grid>}
                      {edited ? <Grid item xs={5} >
                        <MuiButton
                          type="submit"
                          disabled={submitting}
                          className={classes.button}
                          color="primary"
                          style={{
                            color: 'white', backgroundColor: palette.get().topGradient,
                          }}
                          fullWidth={true}
                          variant='contained'
                        >{submitting ? 'Salvando...' : 'Salvar'}</MuiButton>
                      </Grid> : <></>}
                      <Grid item xs={12} style={{ paddingTop: '1rem' }} >
                        <Link href={`${PathName.activities}${PathName.challenges}?groupChallengeId=${groupChallengeId}&mode=${mode}`}>
                          <MuiButton
                            disabled={submitting}
                            className={classes.button}
                            color="primary"
                            style={{
                              color: palette.get().buttonNext, border: '2px solid', borderColor: palette.get().buttonNext
                            }}
                            fullWidth={true}
                            variant='contained'
                          >Próximo</MuiButton>
                        </Link>
                      </Grid>
                    </Grid> :
                      <Grid container
                        direction="row"
                        justify="space-between"
                        alignItems="center"
                        item xs={12} className={classes.containerButton}>
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
                        <Grid item xs={5} >
                          <MuiButton
                            type="submit"
                            disabled={submitting}
                            className={classes.button}
                            color="primary"
                            style={{
                              color: palette.get().buttonNext, border: '2px solid', borderColor: palette.get().buttonNext
                            }}
                            fullWidth={true}
                            variant='contained'
                          >{submitting ? 'Salvando...' : 'Próximo'}</MuiButton>

                        </Grid>
                      </Grid>}

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
      </div >
    )
  )
}