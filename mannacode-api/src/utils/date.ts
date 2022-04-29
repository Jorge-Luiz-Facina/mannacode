import moment from 'moment-timezone';

export function formatDateServer() {
  return new Date(moment(new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }), 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'));
}

export const getDateEnd = (time: number) => {
  const data = formatDateServer();
  data.setMinutes(data.getMinutes() + time);
  return data;
};
