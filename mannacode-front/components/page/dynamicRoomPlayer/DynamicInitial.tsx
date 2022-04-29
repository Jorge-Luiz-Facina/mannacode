import React from 'react'
import TabError from 'components/style/TabError';
import Initial from '../room/Initial';
import PropTypes from 'prop-types';

export default function DynamicInitial(props) {
  const { keyRoom, handleChangePaletteCode, messageError, setMessageError, paletteTheme, onChangeRoom } = props;
  return (
    <>
      <Initial keyRoom={keyRoom} onChangePaletteCode={handleChangePaletteCode} paletteTheme={paletteTheme} setStatusRoom={onChangeRoom}></Initial>
      <TabError text={messageError} open={messageError !== ''} setMessageError={setMessageError}></TabError>
    </>
  )
}

DynamicInitial.defaultProps = {
  keyRoom: null,
  handleChangePaletteCode: null,
  messageError: null,
  setMessageError: null,
  paletteTheme: null,
  onChangeRoom: null,
};

DynamicInitial.propTypes = {
  keyRoom: PropTypes.string,
  handleChangePaletteCode: PropTypes.any,
  messageError: PropTypes.string,
  setMessageError: PropTypes.any,
  paletteTheme: PropTypes.any,
  onChangeRoom: PropTypes.any,
};