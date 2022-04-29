/*eslint no-useless-escape:0 */
const regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

export default function validateCPF(cpf) {
  let addition = 0;
  let rest;
  if (cpf.length !== 11) { return false; }
  if (cpf === '00000000000') { return false; }
  for (let i = 1; i <= 9; i++) { addition = addition + parseInt(cpf.substring(i - 1, i), 10) * (11 - i); }
  rest = (addition * 10) % 11;

  if ((rest === 10) || (rest === 11)) { rest = 0; }
  if (rest !== parseInt(cpf.substring(9, 10), 10)) { return false; }

  addition = 0;
  for (let i = 1; i <= 10; i++) { addition = addition + parseInt(cpf.substring(i - 1, i), 10) * (12 - i); }
  rest = (addition * 10) % 11;

  if ((rest === 10) || (rest === 11)) { rest = 0; }
  if (rest !== parseInt(cpf.substring(10, 11), 10)) { return false; }
  return true;
}

export const validateEmail = email => {
  return (regexp.test(email) && email) ? true : false;
};
