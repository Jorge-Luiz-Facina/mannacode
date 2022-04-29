
import React from 'react'
import TabError from 'components/style/TabError';
import Reload from '../room/Reload';
import PropTypes from 'prop-types';

export default function DynamicReload(props) {
  const { setReload, setStatus, messageError, setMessageError } = props;
  return (<>
    <Reload setReload={setReload} setStatus={setStatus}></Reload>
    <TabError text={messageError} open={messageError !== ''} setMessageError={setMessageError}></TabError>
  </>)
}

DynamicReload.defaultProps = {
  messageError: null,
  setMessageError: null,
  setReload: null,
  setStatus: null,
};

DynamicReload.propTypes = {
  messageError: PropTypes.string,
  setMessageError: PropTypes.any,
  setReload: PropTypes.any,
  setStatus: PropTypes.any,
};