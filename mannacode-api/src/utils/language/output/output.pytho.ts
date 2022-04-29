
const LineLibPythonTest = 68;

export const getOutputPython = (text, countSolution) => {
  let output = getOutputSolution(text, countSolution);
  output = getOutputLib(output, countSolution);
  output = getOutputTests(output, countSolution);
  return output;
};

const getOutputSolution = (text, countSolution) => {
  let output = text.replace(/Main.py", line \d+/g, function aplicarIndice(value) {
    let valueLine = value.replace(/Main.py", line /gi, '');
    if (valueLine <= countSolution) {
      return 'Solucao.py", line ' + (valueLine -1);
    }
    return value;
  });
  return output;
};
const getOutputLib = (text, countSolution) => {
  let output = text.replace(/Main.py", line \d+/g, function aplicarIndice(value) {
    let valueLine = value.replace(/Main.py", line /gi, '');
    if (valueLine > countSolution && valueLine < LineLibPythonTest) {
      valueLine = valueLine - countSolution - 1;
      return 'BibliotecaTestes.py", line ' + valueLine;
    }
    return value;
  });
  return output;
};

const getOutputTests = (text, countSolution) => {
  let output = text.replace(/Main.py", line \d+/g, function aplicarIndice(value) {
    const couuntLine = (LineLibPythonTest + countSolution);
    let valueLine = value.replace(/Main.py", line /gi, '');
    if (valueLine >= couuntLine) {
      valueLine = valueLine - couuntLine - 1;
      return 'Testes.py", line ' + valueLine;
    }
    return value;
  });
  return output;
};
