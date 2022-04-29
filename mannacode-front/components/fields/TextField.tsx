import React, { useEffect, useRef } from 'react';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';

const CustomTextField = ({
  input, onChange, autoFocus, meta, error, helperText, ...props
}) => {
  const inputRef: any = useRef();

  if (!input || !meta) {
    throw Error('Sorry my friend. Did you forget field from final form?');
  }
  const handleChange = (event) => {
    onChange && onChange(event);
    input.onChange(event);
  };

  useEffect(() => {
    if (autoFocus) {
      inputRef.current.focus();
    }
  }, [autoFocus, inputRef]);
  return (
    <TextField
      {...input}
      {...props}
      inputRef={inputRef}
      error={(meta.touched && !!meta.error) || error}
      helperText={(meta.touched && meta.error) || helperText}
      onChange={handleChange}
    />
  );
};

CustomTextField.defaultProps = {
  input: null,
  onChange: null,
  autoFocus: null,
  meta: null,
  error: null,
  helperText: null
};

CustomTextField.propTypes = {
  input: PropTypes.object,
  onChange: PropTypes.func,
  autoFocus: PropTypes.any,
  meta: PropTypes.object,
  error: PropTypes.any,
  helperText: PropTypes.string
};

export default CustomTextField;
