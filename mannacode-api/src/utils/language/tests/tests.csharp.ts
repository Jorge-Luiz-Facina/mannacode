export const csharpTest = (code, test) => {
  return `
using System;
using System.Diagnostics;

public class Program
{
  ${code}

  public static void Main(string[] args)
  {
    try
    {
      testes();
    }
    catch (Exception ex)
    {
      Console.Write(ex);
    }  
  }
  public static void areEqual(object expected, object atual, String message)
  {
    if(!expected.Equals(atual)){
      throw new Exception(message);
    }
  }

public static void areEqual(object expected, object atual) 
{
  if(!expected.Equals(atual)){
    throw new Exception("entrada [" + atual.ToString() + "] esperado [" + expected.ToString() + "]");
}
}

public static void areNotEqual(object expected, object atual, String message) 
{
  if(expected.Equals(atual)){
    throw new Exception(message);
}
}

public static void areNotEqual(object expected, object atual)
{
  if(expected.Equals(atual)){
    throw new Exception("entrada [" + atual.ToString() + "] esperado diferente [" + expected.ToString() + "]");
}
}

public static void isTrue(object expected, String message) { 
  if(!expected.Equals(true)){
    throw new Exception(message);
}
}

public static void isTrue(object expected)
{
  if(!expected.Equals(true)){
    throw new Exception("é diferente de falso");
}
}

public static void isFalse(object expected, String message) 
{
  if(!expected.Equals(false)){
    throw new Exception(message);
}
}

public static void isFalse(object expected) 
{
  if(!expected.Equals(false)){
    throw new Exception("é diferente de verdadeiro");
}
}

public static void isType(object expected, object atual, String message) 
{
  if(!expected.GetType().Name.Equals(atual.GetType().Name)){
    throw new Exception(message);
}
}

public static void isType(object expected, object atual)
{
        if (!expected.GetType().Name.Equals(atual.GetType().Name)){
            throw new Exception("entrada [" + atual.GetType().Name + "] esperado [" + expected.GetType().Name + "]");
}
}

public static void isNotType(Object expected, Object atual, String message)
{
  if(expected.GetType().Name.Equals(atual.GetType().Name)){
    throw new Exception(message);
}
}

public static void isNotType(Object expected, Object atual)
{
  if(expected.GetType().Name.Equals(atual.GetType().Name)){
    throw new Exception("entrada [" + atual.GetType().Name + "] esperado diferente [" + expected.GetType().Name + "]");
}
}

public static void isContains(String value, String pool, String message)
{
  if(!pool.Contains(value)){
    throw new Exception(message);
}
}

public static void isContains(String value, String pool) { 
  if(!pool.Contains(value)){
    throw new Exception("[" + value + "] não está contido em [" + pool + "]");
}
}

public static void isNotContains(String value, String pool, String message)
{
  if(pool.Contains(value)){
    throw new Exception(message);
}
}

public static void isNotContains(String value, String pool) 
{
  if(pool.Contains(value)){
    throw new Exception("[" + value + "] está contido em [" + pool + "]");
}
}
${test}
  }
  `;
};