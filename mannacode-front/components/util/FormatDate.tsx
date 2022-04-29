import moment from 'moment-timezone'

export function FormatDate(date, type='') {
  date = new Date(date)
  date.setSeconds(date.getSeconds() + 1);
  const day = ('0' + (date.getDate() + 1)).slice(-2)
  const month = ('0' + (date.getMonth() + 1)).slice(-2)
  const year = date.getFullYear();

  if (type === 'date')
    return day
  else if (type === 'month')
    return day + '/' + month
  else
    return day + '/' + month + '/' + year
}

export function formatDateServer() {
  return new Date(moment(new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }), 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'));
}

export const getDateEnd = (time: number) => {
  const data = formatDateServer();
  data.setMinutes(data.getMinutes() + time);
  return data;
};

export const calculateTime = (timeEnd) => {
  const dateEnd = new Date(timeEnd);
  const dateNow = formatDateServer();

  let secondsTotal = Math.trunc(((dateEnd.valueOf() - dateNow.valueOf()) / 1000));
  if (secondsTotal < 0) {
    return { time: '00 : 00 : 00', isTimeFinished: true }
  }
  const seconds = secondsTotal % 60;
  const minutes = (Math.trunc(secondsTotal / 60) % 60);
  const hours = (Math.trunc(secondsTotal / 3600));
  return { time: `${('0' + hours).slice(-2)} : ${('0' + minutes).slice(-2)} : ${('0' + seconds).slice(-2)}`, isTimeFinished: false }
};
