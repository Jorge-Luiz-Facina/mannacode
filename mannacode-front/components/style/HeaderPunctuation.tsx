import React from 'react';
import {
  Box, createStyles,
  Grid, List, ListItem, ListItemText, Tooltip, Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import paletteCode from 'components/singleton/paletteCode';
import PropTypes from 'prop-types';

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
  headPlayers: {
    fontSize: '2rem',
    fontFamily: 'Bahnschrift',
    textAlign: 'left'
  },
  iconItem: {
    '& svg': {
      fontSize: '2.2rem',
      color: 'red',
    },
  },
  textPlayer: {
    '& span': {
      fontSize: '1.6rem',
      fontFamily: 'Bahnschrift',
    },
  },
}));

export default function HeaderPunctuations({ playersPunctuation, applicatorPunctuation = 0, applicatorWeight = 0, playerWeight = 0 }) {
  const classes = useStyles();
  let punctuationTotal = applicatorWeight === 0 ? 0 : applicatorPunctuation * applicatorWeight;
  if (playerWeight !== 0 && playersPunctuation) {
    for (const player of playersPunctuation) {
      punctuationTotal += player.punctuation * playerWeight;
    }
  }


  const useStylesTheme = makeStyles(() =>
    createStyles({
      textScroll: {
        '&::-webkit-scrollbar': {
          width: '1.2em'
        },
        '&::-webkit-scrollbar-track': {
          boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
          webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'red',
          outline: '1px solid slategrey'
        }
      },
    }),
  );

  const classesTheme = useStylesTheme();
  return (
    <Grid item xs={6} sm={3} md={2} style={{ background: paletteCode.get().head }}>
      <div style={{ paddingTop: '4rem' }}></div>
      <Typography className={classes.headPlayers} style={{ color: paletteCode.get().color, textAlign: 'center' }}>Pontuação : {punctuationTotal}</Typography>
      <br></br>
      <Typography className={classes.headPlayers} style={{ color: paletteCode.get().color }}>Peso Jogador : {playerWeight}</Typography>
      <Typography className={classes.headPlayers} style={{ color: paletteCode.get().color }}>Peso Aplicador : {applicatorWeight}</Typography>
      <Box>
        <div style={{ maxHeight: '79vh', height: '100%', width: '100%', overflow: 'hidden', overflowY: 'auto' }}
          className={classesTheme.textScroll} >
          <List dense component="div" role="list" style={{ width: '100%' }}>
            <Tooltip key={'Aplicador'}
              placement='left'
              title={<Typography>{'Aplicador'}</Typography>} style={{ color: paletteCode.get().color }}>
              <ListItem key={'Aplicador'} role="listitem" >
                <Grid item xs={8}>
                  <ListItemText className={classes.textPlayer} style={{ color: paletteCode.get().color }} id={'Aplicador'} primary='Aplicador' />
                </Grid>
                <Grid item xs={4}>
                  <ListItemText className={classes.textPlayer} style={{ color: paletteCode.get().color }} id={'Aplicador'} primary={applicatorPunctuation} />
                </Grid>
              </ListItem>
            </Tooltip>
            {playersPunctuation ? playersPunctuation.map((player) => (
              <Tooltip key={player.id}
                placement='left'
                title={<Typography>{player.name}</Typography>} style={{ color: paletteCode.get().color }}>
                <ListItem key={player.id} role="listitem" >
                  <Grid item xs={8}>
                    <ListItemText className={classes.textPlayer} style={{ color: paletteCode.get().color }} id={player.id.toString()} primary={player.name} />
                  </Grid>
                  <Grid item xs={4}>
                    <ListItemText className={classes.textPlayer} style={{ color: paletteCode.get().color }} id={player.id.toString()} primary={player.punctuation} />
                  </Grid>
                </ListItem>
              </Tooltip>
            )) : ''}
            <ListItem />
          </List>
        </div>
      </Box>
    </Grid>
  )
}

HeaderPunctuations.defaultProps = {
  playersPunctuation: null,
  applicatorPunctuation: 0,
  applicatorWeight: 0,
  playerWeight: 0
};

HeaderPunctuations.propTypes = {
  playersPunctuation: PropTypes.any,
  applicatorPunctuation: PropTypes.number,
  applicatorWeight: PropTypes.number,
  playerWeight: PropTypes.number
};