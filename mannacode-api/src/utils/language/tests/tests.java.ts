export const javaTest = (code, test) => {
  return `
  public class Main {
    ${code}

  public static void main(String args[]) throws Exception {
    testes();
  }
  
  public static void areEqual(Object expected, Object  atual, String message) throws Exception{
    if(!expected.equals(atual)){
        throw new TestesException(message);
    }
  }
  
  public static void areEqual(Object expected, Object  atual) throws Exception{
    if(!expected.equals(atual)){
        throw new TestesException("entrada [" + atual.toString() + "] esperado [" + expected.toString() + "]");
    }
  }
  
  public static void areNotEqual(Object expected, Object  atual, String message) throws Exception{
    if(expected.equals(atual)){
        throw new TestesException(message);
    }
  }
  
  public static void areNotEqual(Object expected, Object  atual) throws Exception{
    if(expected.equals(atual)){
        throw new TestesException("entrada [" + atual.toString() + "] esperado diferente [" + expected.toString() + "]");
    }
  }
  
  public static void isTrue(Object expected,  String message) throws Exception{
    if(!expected.equals(true)){
        throw new TestesException(message);
    }
  }
  
  public static void isTrue(Object expected) throws Exception{
    if(!expected.equals(true)){
        throw new TestesException("é diferente de falso");
    }
  }
  
  public static void isFalse(Object expected,  String message) throws Exception{
    if(!expected.equals(false)){
        throw new TestesException(message);
    }
  }
  
  public static void isFalse(Object expected) throws Exception{
    if(!expected.equals(false)){
        throw new TestesException("é diferente de verdadeiro");
    }
  }
  
  public static void isType(Object expected, Object atual, String message) throws Exception{
    if(!expected.getClass().getName().equals(atual.getClass().getName())){
        throw new TestesException(message);
    }
  }
  
  public static void isType(Object expected, Object  atual) throws Exception{
    if(!expected.getClass().getName().equals(atual.getClass().getName())){
        throw new TestesException("entrada [" + atual.getClass().getName() + "] esperado [" + expected.getClass().getName() + "]");
    }
  }
  
  public static void isNotType(Object expected, Object atual, String message) throws Exception{
    if(expected.getClass().getName().equals(atual.getClass().getName())){
        throw new TestesException(message);
    }
  }
  
  public static void isNotType(Object expected, Object  atual) throws Exception{
    if(expected.getClass().getName().equals(atual.getClass().getName())){
        throw new TestesException("entrada [" + atual.getClass().getName() + "] esperado diferente [" + expected.getClass().getName() + "]");
    }
  }
  
  public static void isContains(String value, String pool, String message) throws Exception{
    if(!pool.contains(value)){
        throw new TestesException(message);
    }
  }
  
  public static void isContains(String value, String pool) throws Exception{
    if(!pool.contains(value)){
        throw new TestesException("[" + value + "] não está contido em [" + pool + "]");
    }
  }
  
  public static void isNotContains(String value, String pool, String message) throws Exception{
    if(pool.contains(value)){
        throw new TestesException(message);
    }
  }
  
  public static void isNotContains(String value, String pool) throws Exception{
    if(pool.contains(value)){
        throw new TestesException("[" + value + "] está contido em [" + pool + "]");
    }
  }
  
  public static class TestesException extends Exception {
  
    public TestesException(String message) {
      super(message);
    }
  
    public TestesException(Throwable t) {
      super(t);
    }
  }
  ${test}
}
`;
};