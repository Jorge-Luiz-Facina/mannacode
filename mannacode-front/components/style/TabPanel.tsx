import { Box } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';

export default function TabPanel(props) {
  const { text, value, index, children, scroolbar, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          {children ? <div style={{ maxHeight: '79vh', height: '100%', overflow: 'hidden', overflowY: 'auto' }}
            className={scroolbar} >{children}</div> :
            <div style={{ maxHeight: '79vh', height: '100%', overflow: 'hidden', overflowY: 'auto' }}
              className={scroolbar} dangerouslySetInnerHTML={{ __html: text }} />}
        </Box>
      )
      }
    </div >
  );
}

TabPanel.defaultProps = {
  children: null,
  text: null,
  value: null,
  index: null,
  other: null,
  scroolbar: null
};

TabPanel.propTypes = {
  children: PropTypes.any,
  text: PropTypes.any,
  value: PropTypes.number,
  index: PropTypes.number,
  other: PropTypes.any,
  scroolbar: PropTypes.any
};