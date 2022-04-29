import { createMuiTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import { ptBR } from '@material-ui/core/locale';

const theme = createMuiTheme({
  typography: {
    fontFamily: 'Gilroy, Roboto, Helvetica, Arial, sans-serif',
    htmlFontSize: 10,
  },
  palette: {
    primary: {
      main: '#FFFFFF',
    },
    secondary: {
      main: '#0582CA',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#00000',
    },
  },
  overrides: {
    MuiFormLabel: {
      root: {
        '&$focused': {
          color: '#000000'
        },
      }
    },
    MuiOutlinedInput: {
      root: {
        position: 'relative',
        '& $notchedOutline': {
          borderColor: 'rgba(0, 0, 0, 0.23)',
        },
        '&:hover:not($disabled):not($focused):not($error) $notchedOutline': {
          borderColor: '#000000',
          '@media (hover: none)': {
            borderColor: 'rgba(0, 0, 0, 0.23)',
          },
        },
        '&$focused $notchedOutline': {
          borderColor: '#000000',
          borderWidth: 1,
        },
      },
    },
  }
}, ptBR);

export const defaultProperties = {
  link: {
    color: '#e4e3e3'
  },
  text: {
    primary: '#e4e3e3',
    secondary: '#C8C7C8'
  },

  globalHeaderHeigth: '58px',
  globalHeigth: 'calc(100% - 58px)',
  globalHeigthVH: 'calc(100vh - 58px)',
  globalHeaderWidth: '73px',
  globalWidthXS: 'calc(100% - 57px)',
  globalWidth: 'calc(100% - 73px)'
}

export const paletteDark = {
  name: 'Escuro',
  tag: 'DARK',
  background: '#121212',
  card: '#181818',
  topGradient: '#404040',
  bottomGradient: '#282828',
  primaryText: '#FFFFFF',
  secondaryText: '#b3b3b3',
  backgroundCode: '#303030',
  colorCode: '#F0F0F0',
  headCode: '#292929',
  terminalCode: 'tomorrow_night',
  buttonCode: '#393939',
  buttonBack: '#404040',
  buttonNext: '#003297'
}

export const paletteBlueDark = {
  name: 'Azul Escuro',
  tag: 'BLUE_DARK',
  background: '#15202b',
  card: '#192734',
  topGradient: '#22303c',
  bottomGradient: '#263238',
  primaryText: '#FFFFFF',
  secondaryText: '#8899a6',
  backgroundCode: '#303030',
  colorCode: '#F0F0F0',
  headCode: '#292929',
  terminalCode: 'tomorrow_night',
  buttonCode: '#393939',
  buttonBack: '#404040',
  buttonNext: '#003297'
}

export const palettes: Palette[] = [paletteDark, paletteBlueDark];

export interface Palette {
  name: string;
  tag: string;
  background: string;
  card: string;
  topGradient: string;
  bottomGradient: string;
  primaryText: string;
  secondaryText: string;
  backgroundCode: string;
  colorCode: string;
  headCode: string;
  terminalCode: string;
  buttonCode: string;
  buttonBack: string;
  buttonNext: string;
}

export const paletteCodeDark = {
  name: 'Escuro', tag: 'DARK', background: '#303030', color: '#F0F0F0', head: '#292929', terminal: 'tomorrow_night', button: '#393939'
}
export const paletteCodeLight = {
  name: 'Claro', tag: 'LIGHT', background: '#F0F0F0', color: 'black', head: '#dbdbdb', terminal: 'textmate', button: '#e0e0e0'
}
export const palettesCode: PaletteCode[] = [paletteCodeDark, paletteCodeLight];

export interface PaletteCode {
  name: string;
  tag: string;
  background: string;
  head: string;
  color: string;
  terminal: string;
  button: string;
}
export default theme;
