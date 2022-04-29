import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid, FormHelperText, Checkbox as MuiCheckbox,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import palette from 'components/singleton/palette';

const useStyles = makeStyles(() => ({
  textError: {
    paddingLeft: '15px',
    fontSize: '1.5rem',
    color: '#DA1E27',
    fontFamily: 'IBM Plex Sans',
    margin: 0,
  },
}));

const convertToDefEventPara = (name, value) => ({
  target: {
    name, value,
  },
});

function Checkbox({
  input, onChange, meta, name, children, ...props
}) {
  if (!input || !meta) {
    throw Error('Sorry my friend. Did you forget field from final form?');
  }
  const handleChange = (event) => {
    onChange && onChange(event);
    input.onChange(event);
  };

  const classes = useStyles();
  return (
    <Grid
      style={{
        marginLeft: '-11px',
        marginRight: '16px',
      }}
      container
      direction="row"
      justify="flex-start"
      alignItems="center"
    >
      <MuiCheckbox
        {...input}
        {...props}
        onChange={(e) => handleChange(convertToDefEventPara(name, e.target.checked))}
        style ={{
          color: palette.get().topGradient,
        }}
      />
      {children}
      {meta.error && meta.touched && <FormHelperText className={classes.textError}>{meta.error}</FormHelperText>}
    </Grid>
  );
}

Checkbox.defaultProps = {
  input: null,
  onChange: null,
  meta: null,
  children: null,
  name: null
};

Checkbox.propTypes = {
  input: PropTypes.object,
  onChange: PropTypes.func,
  children: PropTypes.element,
  meta: PropTypes.object,
  name: PropTypes.any,
};

export default Checkbox;
