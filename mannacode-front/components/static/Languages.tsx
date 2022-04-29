export interface Language {
  name: string;
  editor: string;
  executor: string;
  solution: string;
  test: string;
}

const languages: Language[] = [
  { name: 'Java', editor: 'java', executor: 'Java', solution: `public static int soma(int x, int y) {
    return x+y;
}`,
  test:`public static void testes() throws Exception{
    areEqual(soma(2,2),4);
}` },
{ name: 'C#', editor: 'csharp', executor: 'Csharp', solution: `public static int soma(int x, int y) {
  return x+y;
}`,
test:`public static void testes() {
  areEqual(soma(2,2),4);
}` },
  { name: 'Python', editor: 'python', executor: 'Python', solution:`def soma(x,y):
  return x+y;`,
  test:`def testes():
  areEqual(soma(1,2), 3)` },
  { name: 'JavaScript', editor: 'javascript', executor: 'Javascript', solution:`const soma = (x,y) => {
  return x+y;
}`,
  test:`const testes = () =>{
  areEqual(soma(1,2), 3)
}` }];

export default languages;