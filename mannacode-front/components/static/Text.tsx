
export const getExamplesTests = (funcaosolution, funcaoTestes) => {
  return `<p>O nome do método para testes devera se chamar <u class="ql-font-monospace">testes</u><span class="ql-font-monospace">.</span></p><p>Exemplo de Solução:</p><pre class="ql-syntax" spellcheck="false">${funcaosolution}</pre>
  <p>Exemplo de Testes:</p>
  <pre class="ql-syntax" spellcheck="false">${funcaoTestes}</pre>
    <p><br></p><p><span class="ql-size-large">Operações para fazer testes:</span></p><p><br></p><p><span class="ql-font-monospace">areEqual: </span>é usado para verificar o valor de retorno de um método em relação ao valor esperado.</p><p>Exemplo:</p><pre class="ql-syntax" spellcheck="false">função testes(){
    areEqual(soma(1,1), 2);
  }</pre>
    <p><span class="ql-font-monospace">areNotEqual:</span> é usado para verificar o valor de retorno de um método é diferente em relação ao valor esperado.</p><p>Exemplo:</p><pre class="ql-syntax" spellcheck="false">função testes(){
    areNotEqual(soma(1,1), 0);
  }</pre>
    <p><span class="ql-font-monospace">isTrue:</span> é usado para verificar o valor de retorno de um método é verdadeiro.</p><p>Exemplo:</p><pre class="ql-syntax" spellcheck="false">função testes(){
    isTrue(numeroPar(2));
  }</pre>
    <p><span class="ql-font-monospace">isFalse:</span> é usado para verificar o valor de retorno de um método é falso.</p><p>Exemplo:</p><pre class="ql-syntax" spellcheck="false">função testes(){
    isFalse(numeroPar(3));
  } </pre>
   <p><span class="ql-font-monospace">isType:</span> é usado para verificar o tipo de retorno de um método em relação ao tipo esperado</p><p>Exemplo:</p><pre class="ql-syntax" spellcheck="false">função testes(){
    isType(soma(1,1),'número');
  } </pre>
   <p><span class="ql-font-monospace">isNotType:</span> é usado para verificar o tipo de retorno de um método é diferente em relação ao tipo esperado.</p><p>Exemplo:</p><pre class="ql-syntax" spellcheck="false">função testes(){
    isNotType(soma(1,1),'palavra');
  }</pre>
    <p><span class="ql-font-monospace">isContains:</span> é usado para verificar o valor de retorno de um método está contido em relação ao valores esperado.</p><p>Exemplo:</p><pre class="ql-syntax" spellcheck="false">função testes(){
    isContains(soma(1,1),[1,2,3]);
  }</pre>
    <p><span class="ql-font-monospace">isNotContains:</span> é usado para verificar o valor de retorno de um método não está contido em relação ao valores esperado.</p><p>Exemplo:</p><pre class="ql-syntax" spellcheck="false">função testes(){
    isNotContains(soma(1,1),[1,3,4]);
  }</pre>`; }
