/* eslint-disable-next-line no-unused-vars */
import { Palette, paletteDark } from 'components/base/Theme';

let palette: Palette  = paletteDark;

export default {
  get: () => palette,
  set: _palette => {
    palette = _palette;
  } 
}