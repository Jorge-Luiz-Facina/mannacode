import React from 'react'
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Button, createStyles, Divider, Grid, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import EmojiEventsIcon from '@material-ui/icons/EmojiEvents';
/* eslint-disable-next-line no-unused-vars */
import ButtonMode from '../style/ButtonMode';
import { create } from '@/services/applicatorNextChallenge';
import { useAuth } from 'components/context/auth';
import { Form } from 'react-final-form';
import paletteCode from 'components/singleton/paletteCode';
import PropTypes from 'prop-types';

const useStyles = makeStyles(() => ({
  div: {
    width: '100%',
    position: 'relative',
    display: 'flex',
    height: '100%'
  },
  divPadding: {
    width: '100%',
    padding: '15rem',
    paddingTop: '10rem',
    height: '100%'
  },
  divClassification: {
    width: '100%',
  },
}));

interface player {
  id: number;
  name: string;
  punctuation: number;
}

export default function Classification(props) {
  const classes = useStyles();
  const { isPlayer, applicatorStartId, groupChallengeId, setMessageError, punctuations, onChangePaletteCode, paletteTheme, toFinish } = props;
  var position = 0;
  const { token } = useAuth();
  const onSubmit = async () => {
    const response = await create({ applicatorStartId, groupChallengeId }, token);
    if (!response.ok) {
      setMessageError(response.data.message)
    }
  }

  /* eslint-disable-next-line no-sparse-arrays */
  punctuations.sort((a, b) => a.punctuation - b.punctuation).reverse();

  const useStylesTheme = makeStyles(() =>
    createStyles({
      text: {
        '& span': {
          fontSize: '2rem',
          fontFamily: 'Bahnschrift',
          color: paletteCode.get().color,
        },
      },
      gridItem: {
        background: `linear-gradient(45deg, ${paletteCode.get().button} 30%, ${paletteCode.get().head} 90%)`,
        boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
        color: 'white',
        padding: '0 30px',
      },
      textHead: {
        '& span': {
          fontSize: '3rem',
          fontFamily: 'Bahnschrift',
          color: paletteCode.get().color
        },
      },
      textScroll: {
        '&::-webkit-scrollbar': {
          width: '1.2em'
        },
        '&::-webkit-scrollbar-track': {
          boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
          webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: paletteCode.get().button,
          outline: '1px solid slategrey'
        }
      },
    }),
  );
  const classesTheme = useStylesTheme();
  return (
    < div className={classes.div} style={{ backgroundColor: paletteCode.get().background }}>
      <div className={classes.divPadding}>

        <Typography style={{ textAlign: 'center', paddingBottom: '11rem', fontFamily: 'Bahnschrift', color: paletteCode.get().color }}
          variant='h1'>Classificação</Typography>
        <div className={classes.divClassification} style={{}}>
          <Grid style={{ paddingLeft: '16px', paddingRight: '30px' }}
            container
            direction="row"
            alignItems="center"
          >
            <Grid item xs={2} >
              <ListItemIcon>
                <ListItemText className={classesTheme.text}
                  primary={'Posição'} style={{ fontSize: '3rem' }}>
                </ListItemText>
              </ListItemIcon>
            </Grid>
            <Grid item xs={7}>
              <ListItemText className={classesTheme.text}
                primary={'Nome'} style={{ fontSize: '3rem' }} />
            </Grid>
            <Grid item xs={2}>
              <ListItemText className={classesTheme.text}
                primary={'Pontuação'} style={{ fontSize: '3rem' }} />
            </Grid>
          </Grid>
          <List dense component="div" role="list" className={classesTheme.textScroll}
            style={{
              maxHeight: '50vh', overflow: 'hidden',
              overflowY: 'auto', border: `2px solid ${paletteCode.get().head}`,
              width: '100%', padding: '0px'
            }}>
            <Divider variant="fullWidth" component="li" />
            {punctuations.map((item) => {
              position++;
              return (
                <div key={item.id}>
                  <Divider variant="fullWidth" component="li" />
                  <ListItem key={item.id} role="listitem" className={classesTheme.gridItem}>
                    <Grid item xs={2} >
                      <ListItemIcon>
                        <ListItemText className={classesTheme.text}
                          primary={position}> <EmojiEventsIcon />
                        </ListItemText>
                      </ListItemIcon>
                    </Grid>
                    <Grid item xs={7}>
                      <ListItemText className={classesTheme.text} primary={item.name} />
                    </Grid>
                    <Grid item xs={2}>
                      <ListItemText className={classesTheme.text} primary={item.punctuation} />
                    </Grid>
                  </ListItem>
                  <Divider variant="fullWidth" component="li" />
                </div>
              );
            })}
            <Divider variant="fullWidth" component="li" />
          </List>
        </div>
        <Grid style={{ padding: '2rem', textAlign: 'center', width: '100%' }}
          container
          direction="row"
          justify="center"
          alignItems="center">
          <Grid item xs={1}>
            <ButtonMode onChangePaletteCode={onChangePaletteCode} paletteTheme={paletteTheme}></ButtonMode>
          </Grid>
          {isPlayer ? <></> : <Grid item xs={2}>
            <Form
              onSubmit={onSubmit}
              render={({
                handleSubmit, submitting
              }) => (
                <form style={{ width: '100%' }} onSubmit={handleSubmit}>
                  <Button type='submit' variant="outlined" disabled={submitting}
                    style={{ backgroundColor: toFinish ? 'red' : paletteCode.get().button, color: paletteCode.get().color, border: '2px solid', borderColor: paletteCode.get().button, height: 45 }}>
                    {submitting ? 'Criando...' : (toFinish ? 'Encerrar atividade' : 'Próximo desafio')}
                  </Button>
                </form>
              )}
            />
          </Grid>}
        </Grid>
      </div >
    </div >
  )
}

Classification.defaultProps = {
  isPlayer: null,
  groupChallengeId: null,
  applicatorStartId: null,
  setMessageError: null,
  punctuations: null,
  onChangePaletteCode: null,
  paletteTheme: null,
  toFinish: false,
};

Classification.propTypes = {
  isPlayer: PropTypes.bool,
  applicatorStartId: PropTypes.any,
  groupChallengeId: PropTypes.any,
  setMessageError: PropTypes.any,
  punctuations: PropTypes.any,
  onChangePaletteCode: PropTypes.any,
  paletteTheme: PropTypes.any,
  toFinish: PropTypes.bool
};