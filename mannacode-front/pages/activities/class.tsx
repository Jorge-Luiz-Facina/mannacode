import React, { useEffect, useState } from 'react';
import {
  Button,
  FormHelperText,
  Grid, Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import BasePage from '../../components/page/general/BasePage';
import { useAuth } from 'components/context/auth';
import { useRouter } from 'next/router';
import { PathName } from 'components/static/Route';
import palette from 'components/singleton/palette';
import { getApplicatorclass, sendActivitiesToClass } from '@/services/applicatorStart';
import ListCheckBox from 'components/style/ListCheckBox';
import { Form } from 'react-final-form';

const useStyles = makeStyles((theme) => ({
  div: {
    minHeight: '93vh',
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
  textErrorButton: {
    fontSize: '1.5rem',
    color: '#DA1E27',
    fontFamily: 'IBM Plex Sans',
    margin: 0,
    textAlign: 'center',
  },
  textTitleHead: {
    color: '#4c4c4c',
    fontFamily: 'Bahnschrift',
    fontSize: '5.0rem',
    fontWeight: 'bold',
    fontStretch: 'condensed',
    textAlign: 'center'
  },
  textPlayer: {
    '& span': {
      fontSize: '1.6rem',
      fontFamily: 'Bahnschrift',
    },
  },
}));

function myClass({ groupChallengeId }) {
  const classes = useStyles();
  const router = useRouter();
  const { signed, token, statusRedirect } = useAuth();
  const [applicatorStart, setApplicatorStart] = useState<any[]>([]);
  const [messageError, setMessageError] = useState<string>(null);
  const [teamsSelected, setTeamsSelected] = useState<any[]>(null);

  const [removed, setRemoved] = useState<boolean>(false);

  const updateClass = values => {
    setTeamsSelected(values);
  }

  const onSubmit = async () => {
    const applicatorStartsid = teamsSelected.map(item => item.id);
    const response = await sendActivitiesToClass({ groupChallengeId, applicatorStarts: applicatorStartsid }, token);
    if (response.ok) {
      router.push(`${PathName.activities}`);
    } else {
      setMessageError(response.data.message)
    }
  }

  useEffect(() => {
    let active = true;
    if (signed) {
      getApplicatorclass({ type: 'ROOM_SOLO' }, token)
        .then((response) => {
          statusRedirect(response.data.code);
          if (response.ok) {
            const _applicatorStart = response.data.data.map(data => {
              return {
                id: data.id,
                name: data.name,
                key: data.key,
                updatedAt: new Date(data.updatedAt).toLocaleString('pt-BR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                }),
              };
            });

            if (!active) {
              return;
            }
            setApplicatorStart(_applicatorStart);
            setMessageError('');
            setRemoved(false);
          } else {
            setMessageError(response.data.message);
          }
        });
    }
  }, [signed, removed])

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
          <Grid item xs={12} sm={8} style={{ background: 'white' }}>
            <Typography className={classes.textTitleHead}>
              Enviar atividade para turma
            </Typography>
            <FormHelperText className={classes.textErrorButton} {...(messageError && { error: true })}>{messageError || ''}</FormHelperText>

            <div style={{ width: '100%' }}>
              {applicatorStart ? <ListCheckBox titleLeft='Turmas' onSelected={updateClass} title={'Turmas'}
                targets={applicatorStart} firstView={'name'}></ListCheckBox>
                : <></>}
            </div>
          </Grid>
          <Grid item xs={12} sm={1}>
            <Form
              onSubmit={onSubmit}
              render={({ handleSubmit, submitting }) => (
                <form onSubmit={handleSubmit}>
                  <Button fullWidth
                    type='submit'
                    variant="outlined"
                    color="primary"
                    style={{ background: palette.get().bottomGradient, color: palette.get().primaryText, height: 45 }}
                  >
                    {submitting ? 'Enviando' : 'Enviar'}</Button>
                </form>
              )}
            />
          </Grid>
        </Grid >
      </div>
    )
  );
}
export default myClass;

export async function getServerSideProps({ query }) {
  const groupChallengeId = query.groupChallengeId ? query.groupChallengeId : false
  return { props: { groupChallengeId } };
}