import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import palette from 'components/singleton/palette';

export default function AlertDialog(props) {
  const { text, title, open, error, handleClose, handleRemove, label, buttonTextAction } = props
  const [name, setName] = useState<string>('');
  const onChangeName = (value) => {
    setName(value.target.value);
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {text}
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          onChange={onChangeName}
          label={label}
          fullWidth
          error={error}
          helperText={error ? 'Nome Incorreto' : ''}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}
          style={{ color: palette.get().colorCode, backgroundColor: palette.get().buttonCode }}
        >
          Fechar
        </Button>
        <Button onClick={() => { handleRemove(name); setName(''); }} color="primary" autoFocus
          style={{ color: palette.get().colorCode, backgroundColor: '#DC143C' }}>
          {buttonTextAction}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

AlertDialog.defaultProps = {
  buttonTextAction: null,
  label: null,
  handleRemove: null,
  text: null,
  title: null,
  handleClose: null,
  open: null,
  error: null,
};

AlertDialog.propTypes = {
  buttonTextAction: PropTypes.string,
  label: PropTypes.string,
  handleRemove: PropTypes.any,
  text: PropTypes.string,
  title: PropTypes.string,
  handleClose: PropTypes.any,
  open: PropTypes.bool,
  error: PropTypes.bool,
};