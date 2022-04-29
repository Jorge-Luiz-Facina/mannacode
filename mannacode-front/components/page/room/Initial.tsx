import React, { useState } from 'react';
import {
  Button,
  createStyles,
  FormHelperText,
  Grid, makeStyles, Paper, Typography,
} from '@material-ui/core';
import { LocalStorageItem } from 'components/static/LocalStorage';
import { defaultProperties } from 'components/base/Theme';
import { Field, Form } from 'react-final-form';
import CustomTextField from 'components/fields/TextField';
import client from '@/services/feathers';
import paletteCode from 'components/singleton/paletteCode';
import ButtonMode from 'components/style/ButtonMode';

const useStyles = makeStyles((theme) => ({
  div: {
    minHeight: '100vh',
    width: '100%',
    position: 'relative',
    scrollMarginTop: `${defaultProperties.globalHeaderHeigth}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  error: {
    fontFamily: 'Bahnschrift',
    fontSize: '1.8rem',
    fontWeight: 'bold',
    fontStretch: 'condensed',
    textAlign: 'center',
  },
  button: {
    height: '5rem',
    Family: 'Bahnschrift',
    fontSize: '2rem',
    fontWeight: 'bold',
    fontStretch: 'condensed',
    textAlign: 'center',
  },
  divContainerBody: {
    zIndex: 10,
    boxShadow: 'none',
    width: '20%',
    maxWidth: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      paddingTop: '1rem',
    },
    [theme.breakpoints.down('sm')]: {
      width: '35%',
    },
  },
  containerFields: {
    padding: theme.spacing(3)
  },
}));

export default function initial(props) {
  const classes = useStyles();
  const { setStatusRoom, onChangePaletteCode, paletteTheme, keyRoom } = props;
  const [messageError, setMessageError] = useState<any>(null);

  const onSubmit = (values) => {
    client.service('player-start').create({
      name: values.name,
      key: values.key
    }).then(response => {
      localStorage.setItem(LocalStorageItem.room, response.applicatorStartId);
      localStorage.setItem(LocalStorageItem.player, response.keyOnline);
      localStorage.setItem(LocalStorageItem.playerName, response.name);
      setMessageError('');
      setStatusRoom('JOIN ROOM');
    }).catch(e => {
      setMessageError(e.message)
    });
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
    }),
  );
  const classesTheme = useStylesTheme();

  return (
    <div className={classes.div} style={{ background: paletteCode.get().background }}>
      <Grid
        container
        direction="column"
        justify="space-evenly"
        alignItems="center"
      >
        <Grid item xs={12} style={{ paddingBottom: '10rem' }}>
          <Typography style={{
            textAlign: 'center', color: paletteCode.get().color,
            fontFamily: 'Bahnschrift',
            fontSize: '4.5rem',
            fontWeight: 'bold',
            fontStretch: 'condensed',
          }}>Pronto para o desafio ?</Typography>
        </Grid>
        <Paper className={classes.divContainerBody} style={{ background: paletteCode.get().background }}>
          <Form
            onSubmit={onSubmit}
            render={({ handleSubmit, submitting }) => (
              <form onSubmit={handleSubmit}>

                <Grid container
                  className={classes.containerFields}
                  spacing={2}
                >
                  <Grid item xs={12}>
                    <Field
                      className={classesTheme.textFieldRoot}
                      autoFocus={true}
                      name="key"
                      placeholder='CHAVE DA SALA'
                      defaultValue={keyRoom}
                      size="small"
                      fullWidth
                      component={CustomTextField}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      className={classesTheme.textFieldRoot}
                      name="name"
                      placeholder='NOME'
                      size="small"
                      fullWidth
                      component={CustomTextField}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button type="submit" disabled={submitting} fullWidth className={classes.button}
                      style={{ color: paletteCode.get().color, background: paletteCode.get().button }}>{(submitting && !messageError) ? 'Entrando...' : 'Entrar'}</Button>
                  </Grid>
                </Grid>

                <FormHelperText className={classes.error}  {...(messageError && { error: true })}>{messageError ? messageError : ''}</FormHelperText>
              </form>
            )}
          />
        </Paper>
        <Grid style={{ textAlign: 'center', paddingTop: '5rem' }}
          item xs={12}>
          <ButtonMode onChangePaletteCode={onChangePaletteCode} paletteTheme={paletteTheme}></ButtonMode>
        </Grid>
      </Grid>
    </div>
  )
}