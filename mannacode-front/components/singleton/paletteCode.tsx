/* eslint-disable-next-line no-unused-vars */
import { PaletteCode, paletteCodeDark } from 'components/base/Theme';

let paletteCode: PaletteCode  = paletteCodeDark;

export default {
  get: () => paletteCode,
  set: _paletteCode => {
    paletteCode = _paletteCode;
  }
}