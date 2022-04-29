
const LineLibJavaScriptTest = 99;

export const getOutputJavaScript = (text, countSolution) => {
  let output = getOutputSolution(text, countSolution);
  output = getOutputLib(output, countSolution);
  output = getOutputTests(output, countSolution);
  return output;
};

const getOutputSolution = (text, countSolution) => {
  let output = text.replace(/Main.js:\d+/g, function aplicarIndice(value) {
    let valueLine = value.replace(/Main.js:/gi, '');
    if (valueLine <= countSolution + 1) {
      return 'Solucao.js:' + (valueLine -1);
    }
    return value;
  });
  return output;
};
const getOutputLib = (text, countSolution) => {
  let output = text.replace(/Main.js:\d+/g, function aplicarIndice(value) {
    let valueLine = value.replace(/Main.js:/gi, '');
    if (valueLine > (countSolution + 1) && valueLine < LineLibJavaScriptTest) {
      valueLine = valueLine - countSolution - 1;
      return 'BibliotecaTestes.js:' + valueLine;
    }
    return value;
  });
  return output;
};

const getOutputTests = (text, countSolution) => {
  let output = text.replace(/Main.js:\d+/g, function aplicarIndice(value) {
    const couuntLine = (LineLibJavaScriptTest + countSolution);
    let valueLine = value.replace(/Main.js:/gi, '');
    if (valueLine >= couuntLine ) {
      valueLine = valueLine - couuntLine + 1;
      return 'Testes.js:' + valueLine;
    }
    return value;
  });
  return output;
};
