import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { defaultProperties } from 'components/base/Theme';
import paletteCode from 'components/singleton/paletteCode';
import TabError from 'components/style/TabError';
import PropTypes from 'prop-types';

const useStyles = makeStyles(() => ({
  divWaitingApplciation: {
    minHeight: '100vh',
    width: '100%',
    position: 'relative',
    scrollMarginTop: `${defaultProperties.globalHeaderHeigth}`,
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  waitingApplication: {
    Family: 'Bahnschrift',
    fontSize: '4rem',
    fontWeight: 'bold',
    fontStretch: 'condensed',
    textAlign: 'center',
  },
}));

export default function DynamicLoading(props) {
  const classes = useStyles();
  const { messageError, setMessageError } = props;
  return (
    <div className={classes.divWaitingApplciation} style={{ background: paletteCode.get().background }}>
      <Typography className={classes.waitingApplication} style={{ color: paletteCode.get().color }}>Esperando o aplicador iniciar⠀</Typography><p className={classes.waitingApplication}>&#128540;</p>
      <TabError text={messageError} open={messageError !== ''} setMessageError={setMessageError}></TabError>
    </div>
  )
}

DynamicLoading.defaultProps = {
  messageError: null,
  setMessageError: null,
};

DynamicLoading.propTypes = {
  messageError: PropTypes.string,
  setMessageError: PropTypes.any,
};