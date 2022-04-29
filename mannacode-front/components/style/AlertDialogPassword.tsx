import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import palette from 'components/singleton/palette';

export default function AlertDialog(props) {
  const { children, title, open, handleClose } = props


  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        {children}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} style={{ background: palette.get().background, color: palette.get().secondaryText }} autoFocus>
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