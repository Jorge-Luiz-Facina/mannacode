
//eslint-disable-next-line
const regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)

export const validateRequiredField = (data, field) => {
  return data[field] ? undefined : 'Obrigatório';
}

export const password = (data: any, field) => {
  const fieldValue = data[field];
  if (!fieldValue) {
    return 'Obrigatório'
  }
  
  return fieldValue.length <= 5 ? 'A senha precisa conter no mínimo 6 caracteres' : undefined
}

export const confirmPassword = (data, password, confirmPassword) => {
  return data[password] === data[confirmPassword] ? undefined : 'As senhas não são idênticas'
}

export const email = (data, email) => {
  return (regexp.test(data[email]) && data[email]) ? undefined : 'E-mail não é valido.'
}

export const license = function (data, license) {
  return data[license]? undefined : 'Você precisa aceitar os Termos de uso'
}

export const nickName = function (data, nickName) {
  const fieldValue = data[nickName];
  if (!fieldValue) {
    return 'Obrigatório'
  }
  return fieldValue.length <= 1 ? 'O apelido precisa conter no mínimo 2 caracteres' : undefined
}

export const name = function (data, name) {
  const fieldValue = data[name];
  if (!fieldValue) {
    return 'Obrigatório'
  }
  
  if (fieldValue.length <= 2) { 
    return 'O nome precisa conter no mínimo 3 caracteres' 
  }
  
  if (fieldValue.length >= 65) { 
    return 'O nome precisa conter no máximo 64 caracteres' 
  }
}
