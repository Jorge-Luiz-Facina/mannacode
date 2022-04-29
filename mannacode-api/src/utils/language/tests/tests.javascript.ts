export const javascriptTest = (code, test) => {
  return `
${code}
  
const areEqual = (expected, atual, message = '') => {
  if (expected !== atual) {
    if (message === '') {
      const _message = 'entrada [' + atual + '] esperado [' + expected + ']'
      throw new Error(_message).stack;
    }
    else{
      throw new Error(message).stack;
    }
  }
}

const areNotEqual = (expected, atual, message = '') => {
  if (expected === atual) {
    if (message === '') {
      const _message = 'entrada [' + atual + '] esperado diferente [' + expected + ']'
      throw new Error(_message).stack;
    }
    else{
      throw new Error(message).stack;
    }
  }
}

const isTrue = (atual, message = '') => {
  if (atual !== true) {
    if (message === '') {
      const _message = 'é diferente de verdadeiro'
      throw new Error(_message).stack;
    }
    else{
      throw new Error(message).stack;
    }
  }
}

const isFalse = (atual, message = '') => {
  if (atual !== false) {
    if (message === '') {
      const _message = 'é diferente de falso'
      throw new Error(_message).stack;
    }
    else{
      throw new Error(message).stack;
    }
  }
}

const isType = (expected, atual, message = '') => {
  if (typeof expected !== typeof atual) {
    if (message === '') {
      const _message = 'entrada [' + typeof atual + '] esperado [' + typeof expected + ']'
      throw new Error(_message).stack;
    }
    else{
      throw new Error(message).stack;
    }
  }
}

const isNotType = (expected, atual, message = '') => {
  if (typeof expected === typeof atual) {
    if (message === '') {
      const _message = 'entrada [' + atual + '] esperado diferente [' + expected + ']'
      throw new Error(_message).stack;
    }
    else{
      throw new Error(message).stack;
    }
  }
}

const isContains = (value, pool, message = '') => {
  if (pool.indexOf(value) < 0) {
    if (message === '') {
      const _message = 'entrada [' + value + '] não está contido em [' + pool + ']'
      throw new Error(_message).stack;
    }
    else{
      throw new Error(message).stack;
    }
  }
}

const isNotContains = (value, pool, message = '') => {
  if (pool.indexOf(value) > -1) {
    if (message === '') {
      const _message = 'entrada [' + value + '] está contido em [' + pool + ']'
      throw new Error(_message).stack;
    }
    else{
      throw new Error(message).stack;
    }
  }
}

${test}
testes()
`;
};