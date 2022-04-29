import React, { useState } from 'react';
import {
  Box,
  createStyles,
  Grid, IconButton, List, ListItem, ListItemIcon, ListItemText, Tooltip, Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useAuth } from 'components/context/auth';
import AlertDialogRemove from 'components/style/AlertDialogRemove';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { remove } from '@/services/player';
import DoneIcon from '@material-ui/icons/Done';
import palette from 'components/singleton/palette';

const useStyles = makeStyles(() => ({
  div: {
    minHeight: '93vh',
    width: '100%',
    position: 'relative',
    display: 'flex',
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
    textAlign: 'center'
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

interface player {
  id: number;
  name: string;
  applicatorStartId: string;
  passTest: boolean;
  punctuated: boolean;
}

export default function headerPlayers() {
  const classes = useStyles();
  const { token, signed } = useAuth();
  const [playerSelected, setPlayerSelected] = useState<any>(null);
  const [openAlertDialog, setOpenAlertDialog] = useState<boolean>(false);
  const [errorAlertDialog, setErrorAlertDialog] = useState<boolean>(false);
  const [statusJoinPlayer, setStatusJoinPlayer] = useState<player[]>([]);

  const handleRemove = async (value) => {
    if (value === 'BAN') {
      if (signed) {
        const response = await remove(playerSelected.id, token);
        if (response.ok) {
          setStatusJoinPlayer(statusJoinPlayer.filter((player) => player.id !== playerSelected.id));
        }
      }
      setOpenAlertDialog(false);
    } else {
      setErrorAlertDialog(true);
    }
  };

  const handleClose = () => {
    setOpenAlertDialog(false);
    setErrorAlertDialog(false);
  };

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
      iconItemPlayerOrange: {
        '& svg': {
          fontSize: '2.2rem',
          color: 'orange',
        },
      },
      iconItemPlayerGreen: {
        '& svg': {
          fontSize: '2.2rem',
          color: 'green',
        },
      },
    }),
  );

  const classesTheme = useStylesTheme();
  return (
    <Grid item xs={6} sm={3} md={2} style={{ background: palette.get().background }}>
      <div style={{ paddingTop: '4rem' }}></div>
      <Typography className={classes.headPlayers} style={{ color: palette.get().primaryText }}>Jogadores</Typography>
      <Box>
        <div style={{ maxHeight: '79vh', height: '100%', width: '100%', overflow: 'hidden', overflowY: 'auto' }}
          className={classesTheme.textScroll} >
          <List dense component="div" role="list" style={{ width: '100%' }}>
            {statusJoinPlayer ? statusJoinPlayer.map((player) => (
              <Tooltip key={player.id}
                placement='left'
                title={<Typography>{player.name}</Typography>} style={{ color: palette.get().primaryText }}>
                <ListItem key={player.id} role="listitem" button onClick={() => { setPlayerSelected({ id: player.id, name: player.name }); }}>
                  <Grid item xs={8}>
                    <ListItemText className={classes.textPlayer} style={{ color: palette.get().primaryText }} id={player.id.toString()} primary={player.name} />
                  </Grid>
                  {(player.punctuated || player.passTest !== undefined) ?
                    <Grid item xs={2}>
                      <ListItemIcon style={{ color: '#707070' }} className={player.passTest === false ? classesTheme.iconItemPlayerOrange : classesTheme.iconItemPlayerGreen}>
                        <IconButton
                          aria-label="more"
                          aria-controls="long-menu"
                          aria-haspopup="true"
                        >
                          <DoneIcon />
                        </IconButton>
                      </ListItemIcon>
                    </Grid>
                    :
                    <Grid item xs={2}>
                    </Grid>
                  }
                  <Grid item xs={2}>
                    <ListItemIcon style={{ color: '#707070' }} className={classes.iconItem}>
                      <IconButton
                        aria-label="more"
                        aria-controls="long-menu"
                        aria-haspopup="true"
                        onClick={() => { setOpenAlertDialog(true); }}
                      >
                        <HighlightOffIcon />
                      </IconButton>
                    </ListItemIcon>
                  </Grid>
                </ListItem>
              </Tooltip>
            )) : ''}
            <ListItem />
          </List>
        </div>
      </Box>
      <AlertDialogRemove buttonTextAction='Banir' error={errorAlertDialog} handleRemove={handleRemove} open={openAlertDialog} title={`Banir ${playerSelected?.name}`} text='Para banir jogador preencha com o texto (BAN) e exclua' label={'BAN'} handleClose={handleClose}></AlertDialogRemove>
    </Grid>
  )
}