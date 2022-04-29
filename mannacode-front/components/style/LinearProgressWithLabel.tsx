import React from 'react'
import { Box, LinearProgress, makeStyles, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import paletteCode from 'components/singleton/paletteCode';

export default function LinearProgressWithLabel(props) {
  const { value } = props

  const useStyles = makeStyles(() => ({
    progress: {
      '& .MuiLinearProgress-barColorPrimary': {
        backgroundColor: paletteCode.get().color
      }
    }
  }));
  const classes = useStyles()

  return (
    <Box display="flex" alignItems="center" style={{ backgroundColor: paletteCode.get().background }}>
      <Box width="100%" >
        <LinearProgress style={{ backgroundColor: paletteCode.get().head, color: 'green' }} className={classes.progress} variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography style={{ color: paletteCode.get().color, fontSize: '1.5rem' }}>{`${Math.round(
          value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.defaultProps = {
  value: null,
};

LinearProgressWithLabel.propTypes = {
  colors: PropTypes.any,
  value: PropTypes.any,
};