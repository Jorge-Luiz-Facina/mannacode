import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { FormHelperText, Select as MuiSelect, FormControl, InputLabel } from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = makeStyles(() => ({
  textError: {
    paddingLeft: '15px',
    fontSize: '1.5rem',
    color: '#DA1E27',
    fontFamily: 'IBM Plex Sans',
    margin: 0,
  },
  form: {
    '& .MuiInputBase-fullWidth': {
      fontSize: '2rem !important',
    },
    '& p': {
      fontSize: '1.4rem',
    }
  },
  select: {
    '& .MuiSelect-outlined.MuiSelect-outlined': {
      padding: '10.5px'
    }
  }
}))

function Select({ id, input, label, meta, children, _valueInitial, ...props }) {
  if (!input || !meta) {
    throw Error('Sorry my friend. Did you forget field from final form?')
  }
  const [value, setValue] = useState(null);
  const classes = useStyles()
  const handleChange = event => {
    setValue(event.target.value);
    input.onChange(event.target.value);
  };

  return (

    <FormControl variant="outlined" fullWidth className={classes.form} >
      <InputLabel htmlFor={id} style={{ fontSize: '1.5rem' }}>{label}</InputLabel>
      <MuiSelect fullWidth className={classes.select}
        {...input}
        {...props}
        displayEmpty
        value={value ? value : _valueInitial}
        onChange={handleChange}
        inputProps={{
          id: id,
        }}
      >
        {children}
      </MuiSelect>
      <FormHelperText {...({ error: meta.touched && !!meta.error })}>{meta.touched && meta.error}</FormHelperText>
    </FormControl>
  )
}

Select.defaultProps = {
  id: null,
  _valueInitial: '',
  input: null,
  meta: null,
  children: null,
  label: null
};

Select.propTypes = {
  id: PropTypes.any,
  _valueInitial: PropTypes.string,
  input: PropTypes.object,
  children: PropTypes.any,
  meta: PropTypes.object,
  label: PropTypes.string
};

export default Select;

