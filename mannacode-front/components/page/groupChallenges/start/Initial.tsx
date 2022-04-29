import React from 'react';
import {
  Button,
  createStyles,
  Grid, makeStyles, Typography,
} from '@material-ui/core';

// eslint-disable-next-line no-unused-vars
import { useAuth } from 'components/context/auth';
import palette from 'components/singleton/palette';
import { Form } from 'react-final-form';
import client from '@/services/feathers'
import { LocalStorageItem } from 'components/static/LocalStorage';

const useStyles = makeStyles((theme) => ({
  div: {
    minHeight: '93vh',
    width: '100%',
    position: 'relative',
    display: 'flex',
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
  button: {
    fontSize: '1.4rem',
    fontFamily: 'Bahnschrift',
    fontWeight: 'bold',
    paddingTop: '1rem',
    paddingBottom: '1rem',
    paddingLeft: '0px',
    paddingRight: '0px',
    width: '100%',
  },
}));

export default function initial(props) {
  const classes = useStyles();
  const { activitiyStart, groupChallenge, groupChallengeId, setActivitiyStart, setMessageError } = props;
  const { token } = useAuth();

  const onSubmit = async () => {
    try {
      const response = await client.service('applicator-start-socket').create(
        { groupChallengeId: groupChallengeId, token: token }
      )
      if (response.id) {
        const _key = { id: response.id, key: response.key, groupChallengeId: response. groupChallengeId};
        localStorage.setItem(LocalStorageItem.key, JSON.stringify(_key));
        setActivitiyStart(_key);
      } else {
        setMessageError(response.message)
      }
    } catch (e) {
      setMessageError(e.message)
    }
  }

  const useStylesTheme = makeStyles(() =>
    createStyles({
      typographyText: {
        color: palette.get().primaryText,
        textAlign: 'center',
        fontSize: '2.5rem',
        paddingTop: '4rem',
        paddingBottom: '4rem'
      }
    }),
  );
  const classesTheme = useStylesTheme();
  return (
    <div className={classes.div} style={{ background: palette.get().background }}>
      <Grid
        className={classes.divActivities}
        container
        direction="row"
        justify="space-evenly"
        alignItems="flex-start"
      >
        <Grid item xs={12} sm={6}>
          <Typography className={classesTheme.typographyText}>Título: {groupChallenge?.title}</Typography>
        </Grid>
        <Grid item xs={12} sm={12} >
          <Typography style={{
            color: palette.get().primaryText,
            textAlign: 'center',
            fontSize: '2.5rem',
          }}>Descrição:</Typography>
        </Grid>
        <Grid item xs={12} sm={10} >
          <Typography className={classesTheme.typographyText} style={{ paddingTop: '1rem' }}>{groupChallenge?.description}</Typography>
        </Grid>

        {activitiyStart ? <></> :
          <Grid item xs={12} sm={12}
            container
            direction="row"
            justify="center"
            alignItems="center" >
            <Grid item xs={12} sm={3} >
              <Form
                onSubmit={onSubmit}
                render={({ handleSubmit, form, submitting }) => (
                  <form onSubmit={handleSubmit} >
                    <Button
                      type='submit'
                      disabled={submitting || !!activitiyStart}
                      className={classes.button}
                      style={{ color: palette.get().colorCode, backgroundColor: palette.get().buttonCode }}
                      fullWidth
                      variant='contained'>
                      {submitting ? 'Iniciando...' : activitiyStart ? 'Iniciado' : 'Criar sala'}
                    </Button>
                  </form>
                )}
              />
            </Grid>
          </Grid>
        }
        {activitiyStart ?
          <Grid item xs={12} sm={10} >
            <Typography style={{ color: palette.get().primaryText, textAlign: 'center', fontSize: '2.5rem' }}>Chave: {activitiyStart.key}</Typography>
          </Grid>
          :
          <div></div>
        }
      </Grid>
    </div>
  )
}