export const pythonTest = (code, test) => {
  return `# -*- coding: utf-8 -*-
${code}
  
class Erro(Exception):
  pass

def areEqual(expected, atual, message=''):
  if expected!=atual:
      if message=='':
          this = 'entrada [' + str(atual) + '] esperado [' + str(expected) + ']'
          raise Erro(this)
      else:
          raise Erro(message)

def areNotEqual(expected, atual, message=''):
  if expected==atual:
      if message=='':
          this = 'entrada [' + str(atual) + '] esperado diferente [' + str(expected) + ']'
          raise Erro(this)
      else:
          raise Erro(message)

def isTrue(atual, message=''):
  if atual!=True:
      if message=='':
          this = "é diferente de verdadeiro"
          raise Erro(this)
      else:
          raise Erro(message)

def isFalse(atual, message=''):
  if atual!=False:
      if message=='':
          this = "é diferente de falso"
          raise Erro(this)
      else:
          raise Erro(message)

def isType(expected, atual, message=''):
  if type(expected)!=type(atual):
      if message=='':
          this = 'entrada [' + str(type(atual)) + '] esperado [' + str(type(expected)) + ']'
          raise Erro(this)
      else:
          raise Erro(message)

def isNotType(expected, atual, message=''):
  if type(expected)==type(atual):
      if message=='':
          this = 'entrada [' + str(type(atual)) + '] esperado diferente [' + str(type(expected)) + ']'
          raise Erro(this)
      else:
          raise Erro(message)

def isContains(value, pool, message=''):
  if not value in pool:
      if message=='':
          this = '[' + str(value) + ' não está contido em [' + str(pool) + ']'
          raise Erro(this)
      else:
          raise Erro(message)

def isNotContains(value, pool, message=''):
  if value in pool:
      if message=='':
          this = '[' + str(value) + '] está contido em [' + str(pool) + ']'
          raise Erro(this)
      else:
          raise Erro(message)

${test}
testes()
`;
};