import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import palette from 'components/singleton/palette';

export default function AlertDialog(props) {
  const { children, title, open, handleClose } = props
  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" style={{ background: palette.get().background, color: palette.get().secondaryText }}>{title}</DialogTitle>
      <DialogContent style={{ background: palette.get().background, color: palette.get().secondaryText }}>
        <DialogContentText id="alert-dialog-description">
        </DialogContentText>
        {children}
      </DialogContent>
      <DialogActions style={{ background: palette.get().background, color: palette.get().secondaryText}}>
        <Button onClick={handleClose} fullWidth
          style={{ color: palette.get().colorCode, backgroundColor: palette.get().buttonCode }}
        >
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

AlertDialog.defaultProps = {
  children: null,
  title: null,
  handleClose: null,
  open: null,
};

AlertDialog.propTypes = {
  children: PropTypes.any,
  title: PropTypes.string,
  handleClose: PropTypes.any,
  open: PropTypes.bool,
};