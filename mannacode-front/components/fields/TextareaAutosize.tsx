import React from 'react';
import { FormHelperText, makeStyles, TextareaAutosize as MuiTextareaAutosize } from '@material-ui/core/';
import PropTypes from 'prop-types';

const useStyles = makeStyles(() => ({
  textError: {
    paddingLeft: '15px',
    fontSize: '1.35rem',
    color: '#ff1744',
    fontFamily: 'IBM Plex Sans',
    margin: 0,
  },
}));

const TextareaAutosize = ({
  input, onChange, meta, ...props
}) => {
  const classes = useStyles();
  if (!input || !meta) {
    throw Error('Sorry my friend. Did you forget field from final form?');
  }
  const handleChange = (event) => {
    onChange && onChange(event);
    input.onChange(event);
  };
  return (
    <>
      <MuiTextareaAutosize
        {...input}
        {...props}
        onChange={handleChange}
      />
      {meta.error && meta.touched && <FormHelperText className={classes.textError}>{meta.error}</FormHelperText>}
    </>
  );
}

TextareaAutosize.defaultProps = {
  input: null,
  onChange: null,
  meta: null,
};

TextareaAutosize.propTypes = {
  input: PropTypes.object,
  onChange: PropTypes.func,
  autoFocus: PropTypes.any,
  meta: PropTypes.object,
};


export default TextareaAutosize