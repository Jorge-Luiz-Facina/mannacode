import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, IconButton, makeStyles, Tooltip, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import palette from 'components/singleton/palette';

const useStyles = makeStyles(() => ({
  iconItem: {
    '& svg': {
      fontSize: '2.2rem',
      color: 'red',
    },
  },
}));
export default function TabError(props) {
  const { text, open, setMessageError } = props;
  const classes = useStyles();
  
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  return (
    <div style={{ zIndex:9999, display: isOpen ? 'flex':'none', paddingLeft: '10px', paddingRight: '10px',  borderTop: '1px dashed red',
      borderBottom: '1px dashed red', minHeight: '50px', width: '100%', bottom: '0', background: palette.get().background, position: 'fixed' }}>
      <Grid
        style={{ minHeight: '50px' }}
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Grid
          item xs={10}>
          <Typography style={{ color: palette.get().primaryText }}>{text}</Typography>
        </Grid>

        <Grid style={{ textAlignLast: 'right' }}
          item xs={2}>
          <IconButton component="span" onClick={()=>{setIsOpen(false); setMessageError('')}} style={{ bottom: '0', right: '0', position: 'fixed' }} className={classes.iconItem}>
            <Tooltip placement="left"
              title={<Typography>Fechar</Typography>} >
              <CloseIcon />
            </Tooltip>
          </IconButton>
        </Grid>
      </Grid>
    </div>
  );
}

TabError.defaultProps = {
  open: false,
  text: null,
  setMessageError: null,
};

TabError.propTypes = {
  open: PropTypes.bool,
  text: PropTypes.string,
  setMessageError: PropTypes.any
};