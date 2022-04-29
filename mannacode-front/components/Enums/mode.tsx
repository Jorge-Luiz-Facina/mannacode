export interface ConfigColor {
  background: string;
  head: string;
  color: string;
  terminal: string;
  button: string;
}

export enum Mode {
  /* eslint-disable-next-line no-unused-vars */
  ESCURO = 'ESCURO',
  /* eslint-disable-next-line no-unused-vars */
  CLARO = 'CLARO'
}
export const ESCURO: ConfigColor = { background: '#303030', color: '#F0F0F0', head: '#292929', terminal: 'tomorrow_night', button: '#393939' };
export const CLARO: ConfigColor = { background: '#F0F0F0', color: 'black', head: '#dbdbdb', terminal: 'textmate', button: '#e0e0e0' }

