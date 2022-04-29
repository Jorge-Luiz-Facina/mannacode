
const LineLibPythonTest = 114;
const LineInitialJava = 2;

export const getOutputJava = (text, countSolution) => {
  let output = getOutputSolution(text, countSolution);
  output = getOutputLib(output, countSolution);
  output = getOutputTests(output, countSolution);
  return output;
};

const getOutputSolution = (text, countSolution) => {
  let output = text.replace(/Main.java:\d+/g, function aplicarIndice(value) {
    let valueLine = value.replace(/Main.java:/gi, '');
    valueLine = valueLine - LineInitialJava;
    if (valueLine <= countSolution) {
      return 'Solucao.java:' + valueLine;
    }
    return value;
  });
  return output;
};
const getOutputLib = (text, countSolution) => {
  let output = text.replace(/Main.java:\d+/g, function aplicarIndice(value) {
    let valueLine = value.replace(/Main.java:/gi, '');
    if (valueLine > countSolution && valueLine < LineLibPythonTest) {
      valueLine = valueLine - countSolution;
      return 'BibliotecaTestes.java:' + valueLine;
    }
    return value;
  });
  return output;
};

const getOutputTests = (text, countSolution) => {
  let output = text.replace(/Main.java:\d+/g, function aplicarIndice(value) {
    const couuntLine = (LineLibPythonTest + countSolution);
    let valueLine = value.replace(/Main.java:/gi, '');
    if (valueLine >= couuntLine) {
      valueLine = valueLine - couuntLine;
      return 'Testes.java:' + valueLine;
    }
    return value;
  });
  return output;
};
