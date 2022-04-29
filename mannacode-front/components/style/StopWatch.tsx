
import React, { useEffect, useState } from 'react'
import { Box, Tooltip, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { formatDateServer } from 'components/util/FormatDate';

const calculateTime = (timeEnd) => {
  const dateEnd = new Date(timeEnd.replace(/.\d+Z$/g, ''));
  const dateNow = formatDateServer();

  let secondsTotal = Math.trunc(((dateEnd.valueOf() - dateNow.valueOf()) / 1000));
  if (secondsTotal < 0) {
    return { time: '00 : 00 : 00', isTimeFinished: true }
  }
  const seconds = secondsTotal % 60;
  const minutes = (Math.trunc(secondsTotal / 60) % 60);
  const hours = (Math.trunc(secondsTotal / 3600));
  return { time: `${('0' + hours).slice(-2)} : ${('0' + minutes).slice(-2)} : ${('0' + seconds).slice(-2)}`, isTimeFinished: false }
};

function StopWatch(props) {
  const { colors, endTime, setIsTimeFinished } = props;
  const [statusTime, setStatusTime] = useState(calculateTime(endTime));

  useEffect(() => {
    let interval = null;

    if (!statusTime.isTimeFinished) {
      interval = setInterval(() => {
        const _statusTime = calculateTime(endTime);
        if (_statusTime.isTimeFinished) {
          setIsTimeFinished(true);
        }
        setStatusTime(_statusTime);
      }, 1000);
      setIsTimeFinished(false);
    } else {
      clearInterval(interval);
      setIsTimeFinished(true);
    }
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Tooltip placement="right"
      title={<Typography>Cronômetro</Typography>} style={{ backgroundColor: colors.head }}>
      <Box style={{ backgroundColor: colors.head, borderRadius: '25PX', width: '25%', height: '100%', textAlign: 'center' }}>
        <Typography style={{ height: '100%', fontSize: '2rem', color: colors.color }}>{statusTime.time}</Typography>
      </Box>
    </Tooltip>
  )
}
StopWatch.defaultProps = {
  setIsTimeFinished: null,
  endTime: null,
  colors: null,
};

StopWatch.propTypes = {
  setIsTimeFinished: PropTypes.any,
  endTime: PropTypes.any,
  colors: PropTypes.any,
};

export default StopWatch;