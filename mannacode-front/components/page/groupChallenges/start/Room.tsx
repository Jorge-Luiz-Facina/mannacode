import React from 'react';
import {
  Button,
  createStyles,
  Grid, IconButton, Tooltip, Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useAuth } from 'components/context/auth';
import palette from 'components/singleton/palette';
import { Form } from 'react-final-form';
import { startRoom as serviceStartRoom } from '@/services/applicatorStart';
import { PathName } from 'components/static/Route';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import paletteCode from 'components/singleton/paletteCode';
import PropTypes from 'prop-types';

const useStyles = makeStyles(() => ({
  button: {
    fontSize: '1.4rem',
    fontFamily: 'Bahnschrift',
    fontWeight: 'bold',
    paddingTop: '1rem',
    paddingBottom: '1rem',
    paddingLeft: '0px',
    paddingRight: '0px',
    width: '100%',
  }
}));

export default function Room(props) {
  const classes = useStyles();

  const { activitiyStart, setMessageError } = props;
  const { token } = useAuth();
  const startRoom = async () => {
    const response = await serviceStartRoom(activitiyStart.id,{groupChallengeId: activitiyStart.groupChallengeId}, token);
    if (!response.ok) {
      setMessageError(response.data.message)
    }
  }
  const useStylesTheme = makeStyles(() =>
    createStyles({
      iconItem: {
        '& svg': {
          fontSize: '3.5rem',
          color: paletteCode.get().color,
        }
      },
    }),
  );
  const classesTheme = useStylesTheme()

  const room = `${window.location.hostname}${PathName.room}?keyRoom=${activitiyStart?.key}`
  return (
    <>
      <Grid item xs={6} md={9} style={{ height: '100%' }} container
        direction="column"
        justify="center"
        alignItems="center"
      >

        <Typography style={{ color: palette.get().primaryText, textAlign: 'center', fontSize: '2.5rem' }}>Sala:{' '}
          {room}
          <CopyToClipboard text={room}>
            <IconButton component="span" className={classesTheme.iconItem}>
              <Tooltip placement="left"
                title={<Typography>Copiar</Typography>} style={{ backgroundColor: paletteCode.get().head }}>
                <FileCopyOutlinedIcon />
              </Tooltip>
            </IconButton>
          </CopyToClipboard>
        </Typography>
        <Grid item xs={6} sm={5} md={3} style={{ width: '100%', paddingTop: '4rem' }}>
          <Form
            onSubmit={startRoom}
            render={({ handleSubmit, form, submitting }) => (
              <form onSubmit={handleSubmit} >
                <Button
                  type='submit'
                  disabled={submitting || !activitiyStart}
                  className={classes.button}
                  style={{ color: palette.get().colorCode, backgroundColor: palette.get().buttonCode }}
                  fullWidth
                  variant='contained'>
                  {submitting ? 'Iniciando...' : ' Iniciar Atividade'}
                </Button>
              </form>
            )}
          />
        </Grid>
      </Grid>
    </>
  );
}

Room.defaultProps = {
  setMessageError: null,
  activitiyStart: null,
};

Room.propTypes = {
  setMessageError: PropTypes.any,
  activitiyStart: PropTypes.any,
};