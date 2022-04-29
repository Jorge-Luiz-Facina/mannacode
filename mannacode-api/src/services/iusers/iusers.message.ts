export abstract class IUsersMessage {
  public static autenticado = 'É necessário estar autenticado para consumir esse serviço';
  public static emailNaoRegistrado = 'O e-mail não está registrado';
  public static emailConfirmado = 'O e-mail já foi confirmado';
  public static emailInvalido = 'O e-mail é inválido';
  public static emailVinculadoConta = 'Caso seu e-mail esteja vinculado a uma conta já existente, enviaremos um e-mail de recuperação de senha dentro de alguns minutos e será valido durante 10 minutos. Caso ainda não tenha recebido o e-mail, confira sua pasta de spam.';
  public static cadastroExistente = 'Já existe um usuário cadastrado com esse email';
  public static naoAlterarRole = 'Não é permitido alterar a role ou abilities de um cliente';
  public static linkPreRegistradoInvalido = 'Link de pré-registro inválido';
  public static linkPreRegistradoDuplicado = 'Link de pré-registro duplicado';
  public static linkVerificacaoEmailInvalido = 'Link de verificação de e-mail inválido';
  public static linkVerificacaoEmailDuplicado = 'Link de verificação de e-mail duplicado';
  public static linkVerificacaoEmailNaoExiste = 'Link de verificação de e-mail não exite';
  public static buscaInvalida = 'Busca inválida';
  public static naoAlterarEmail = 'Não pode alterar e-mail';
  public static planoExpirou = 'Seu plano expirou';
  public static ultrapassouLimiteJogadores = 'Você ultrapassou o limite de jogadores do seu plano';

}
