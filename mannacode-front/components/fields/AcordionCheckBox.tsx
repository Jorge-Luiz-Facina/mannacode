import React, { useState } from 'react';
import {
  Checkbox, Accordion, AccordionSummary, FormControlLabel, AccordionDetails, Typography,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { ExpandMore } from '@material-ui/icons';

const convertToDefEventPara = (name, value) => ({
  target: {
    name, value,
  },
});

function AcordionCheckBox({
  input, meta, name, _initialValue, detail, text, ...props
}) {
  if (!input || !meta) {
    throw Error('Sorry my friend. Did you forget field from final form?');
  }
  const [value, setValue] = useState(undefined);

  const handleChange = (event) => {
    setValue(event.target.value)
    input.onChange(event.target.value);
  };
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-label="Expand"
        aria-controls="additional-actions1-content"
        id="additional-actions1-header"
      >
        <FormControlLabel
          {...input}
          {...props}
          name={name}

          onClick={(event) => event.stopPropagation()}
          onFocus={(event) => event.stopPropagation()}
          control={<Checkbox checked={(value === true || value === false) ? value : _initialValue} onChange={(e) => handleChange(convertToDefEventPara(name, e.target.checked))}></Checkbox>}
          label={text}
        />
      </AccordionSummary>
      <AccordionDetails>
        <Typography color="textSecondary">
          {detail}
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
}

AcordionCheckBox.defaultProps = {
  _initialValue: false,
  detail: null,
  text: null,
  input: null,
  meta: null,
  name: null
};

AcordionCheckBox.propTypes = {
  _initialValue: PropTypes.bool,
  detail: PropTypes.string,
  text: PropTypes.string,
  input: PropTypes.object,
  meta: PropTypes.object,
  name: PropTypes.any,
};

export default AcordionCheckBox;
