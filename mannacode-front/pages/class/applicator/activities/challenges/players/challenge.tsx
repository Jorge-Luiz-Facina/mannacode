
import React, { useEffect, useState } from 'react';
import paletteCode from 'components/singleton/paletteCode';
/* eslint-disable-next-line no-unused-vars */
import { PaletteCode, paletteCodeDark, palettesCode } from 'components/base/Theme';
import { getLocalStorage, LocalStorageItem } from 'components/static/LocalStorage';
import { createStyles, Grid, makeStyles, Typography } from '@material-ui/core';
import TabError from 'components/style/TabError';
import View from 'components/page/View';
import { getPlayerFinalizedChallenge, setPunctuationPlayerFinalizedChallenge, updatePunctuationPlayerFinalizedChallenge } from '@/services/applicatorPlayerFinalizedChallenge';
import { useAuth } from 'components/context/auth';
import BasePage from 'components/page/general/BasePage';
import MuiButton from '@material-ui/core/Button';
import { Field, Form } from 'react-final-form';
import CustomTextField from 'components/fields/TextField';

const useStyles = makeStyles(() => ({
  div: {
    minHeight: '93vh',
    width: '100%',
    position: 'relative',
    display: 'flex',
  },
}));


export default function ChallengePlayer(props) {
  const classes = useStyles();
  const { playerChallengeId } = props;
  const [messageError, setMessageError] = useState<any>('');
  const [playerChallenge, setPlayerChallenge] = useState<any>(null);
  const [paletteTheme, setPaletteTheme] = useState<PaletteCode>(paletteCodeDark);
  const [typePunctuation, setTypePunctuation] = useState<string>('');

  const { signed, token, statusRedirect } = useAuth();

  const handleChangePaletteCode = (event: React.ChangeEvent<{ value: PaletteCode }>) => {
    paletteCode.set(event.target.value as PaletteCode);
    localStorage.setItem(LocalStorageItem.paletteCode, event.target.value.tag);
    setPaletteTheme(event.target.value as PaletteCode);
  };

  useEffect(() => {
    const paletteLocalStorage = getLocalStorage(LocalStorageItem.paletteCode);
    if (paletteLocalStorage && paletteLocalStorage !== paletteTheme.tag) {
      const paletteColors = palettesCode.find(p => p.tag === paletteLocalStorage)
      paletteCode.set(paletteColors);
      setPaletteTheme(paletteColors);
    }
  }, [])

  useEffect(() => {
    if (signed) {
      getPlayerFinalizedChallenge(playerChallengeId, token).then((response) => {
        statusRedirect(response.data.code);
        if (response.ok) {
          setPlayerChallenge(response.data);
        } else {
          setMessageError(response.data.message);
        }
      });
    }
  }, [signed])

  const onSubmit = async (values) => {
    if (typePunctuation === 'create') {
      values.playerChallengeId = playerChallengeId;
      setPunctuationPlayerFinalizedChallenge(values, token).then((response) => {
        if (response.ok) {
          setTypePunctuation('');
        } else {
          setMessageError(response.data.message);
        }
      });
    } else {
      updatePunctuationPlayerFinalizedChallenge(playerChallengeId, values, token).then((response) => {
        if (response.ok) {
          setTypePunctuation('');
        } else {
          setMessageError(response.data.message);
        }
      });
    }
  }

  const useStylesTheme = makeStyles(() =>
    createStyles({
      textFieldRoot: {
        '& label.Mui-focused': {
          color: paletteCode.get().color,
        },
        '& .MuiInputBase-input': {
          color: paletteCode.get().color,
        },
        '& .MuiInput-underline:after': {
          borderBottomColor: paletteCode.get().color,
        },
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: paletteCode.get().color,
          },
          '&:hover fieldset': {
            borderColor: paletteCode.get().color,
          },
          '&.Mui-focused fieldset': {
            borderColor: paletteCode.get().color,
          },
        },
      },
      input: {
        color: paletteCode.get().color,
      },

    }),
  );
  const classesTheme = useStylesTheme();

  return (
    BasePage(
      <div className={classes.div} style={{ background: paletteCode.get().head }}>
        {!playerChallenge?.challenge ? <></> :
          <Grid style={{ height: '100%' }}
            container
            direction="row"
            justify="space-between"
            alignItems="flex-start"
          >
            <Grid item xs={6} md={10} style={{ height: '100%' }}
              container
              direction="column"
              justify="center"
              alignItems="center"
            >
              <View isViewResult={true} permissionPunctuation={null} onChangePaletteCode={handleChangePaletteCode} paletteTheme={paletteTheme} isPlayer={false} applicatorStartId={null} percentage={null} token={null} player={playerChallenge} setMessageError={setMessageError}></View>
            </Grid>
            <Grid item xs={3} md={2} style={{ height: '100%' }}
              container
              direction="column"
              justify="space-evenly"
              alignItems="center"
            >
              <Form
                onSubmit={onSubmit}
                render={({ handleSubmit }) => (
                  <form onSubmit={handleSubmit} style={{ width: '100%', height: '100%', display: 'contents' }}>
                    <Field
                      name="punctuation"
                      InputProps={{
                        className: classesTheme.input
                      }}
                      defaultValue={playerChallenge?.punctuation}
                      classes={{ root: classesTheme.textFieldRoot }}
                      label={<Typography style={{ color: 'white' }}>Pontuação</Typography>}
                      size="small"
                      fullWidth
                      component={CustomTextField}
                      variant={'outlined'}
                    />
                    <MuiButton
                      type='submit'
                      onClick={() => { setTypePunctuation(playerChallenge?.punctuation ? 'patch' : 'create') }}
                      fullWidth
                      style={{ color: paletteCode.get().color, background: paletteCode.get().button }}
                      variant="contained"
                    >{playerChallenge?.punctuation ? 'Repontuar' : 'Pontuar'}
                    </MuiButton>


                  </form>
                )}
              />
            </Grid>
          </Grid>
        }
        <TabError text={messageError} open={messageError !== ''} setMessageError={setMessageError}></TabError>
      </div>
    )
  )
}

export async function getServerSideProps({ query }) {
  const playerChallengeId = query.playerChallengeId ? query.playerChallengeId : false
  return { props: { playerChallengeId } };
}
