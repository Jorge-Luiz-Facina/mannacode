
const LineLibCsharpTest = 128;
const LineInitialCsharp = 6;

export const getOutputCsharp = (text, countSolution) => {
  text = getOutputSolution(text, countSolution);
  text = getOutputTests(text, countSolution);
  text = getOutputLib(text, countSolution);
  return text;
};

const getOutputSolution = (text, countSolution) => {
  let output = text.replace(/Main.cs\(\d+/g, function aplicarIndice(value) {
    let valueLine = value.replace(/Main.cs\(/gi, '');
    valueLine = valueLine - LineInitialCsharp;
    if (valueLine <= countSolution) {
      return 'Solucao.cs(' + valueLine;
    }
    return value;
  });
  return output;
};
const getOutputLib = (text, countSolution) => {
  let output = text.replace(/Main.cs:\d+/g, function aplicarIndice(value) {
    let valueLine = value.replace(/Main.cs:/gi, '');
    if (valueLine > countSolution && valueLine < LineLibCsharpTest) {
      valueLine = valueLine - countSolution;
      return 'BibliotecaTestes.cs:' + valueLine;
    }
    return value;
  });
  return output;
};

const getOutputTests = (text, countSolution) => {
  let output = text.replace(/Main.cs\(\d+/g, function aplicarIndice(value) {
    const couuntLine = (LineLibCsharpTest + countSolution);
    let valueLine = value.replace(/Main.cs\(/gi, '');
    if (valueLine >= couuntLine) {
      valueLine = valueLine - couuntLine;
      return 'Testes.cs:' + valueLine;
    }
    return value;
  });
  return output;
};
