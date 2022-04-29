export const modes = [{ value: 'SOLO', title: 'Solo', description: 'Permite que a atividade seja feita até uma data especifica e atribuída a uma turma' },
  { value: 'MULTIPLAYER', title: 'Multiplayer', description: 'Permite que seja feito em conjunto com os jogadores' }];

export const punctuations = [{ value: 'ALL', title: 'Todos', description: 'Permite que todas pontue' },
  { value: 'TEACHER', title: 'Aplicador', description: 'Permite que só o aplicador pontue' },
  { value: 'PLAYER', title: 'Jogador', description: 'Permite que só o jogador pontue' }];

export const classifications = [{ value: 'ALL', title: 'Todos', description: 'Será visualizado todas posições dos jogadores com suas pontuações' },
  { value: 'COUNT', title: 'Quantidade', description: 'Será visualizado a quantidade especifica de posições com suas pontuações' }];

export const classificationsPlayerSolo = [{ value: 'ALL', title: 'Todos', description: 'Será visualizado todas posições dos jogadores com suas pontuações' },
  { value: 'COUNT', title: 'Quantidade', description: 'Será visualizado a quantidade especifica de posições com suas pontuações' },
  { value: 'ZERO', title: 'Sem classificação', description: 'Sem classifcação' }];

export const times = [{ value: 'false', title: 'Tempo total', description: 'Será definido um tempo total para toda atividade' },
  { value: 'true', title: 'Tempo por desafios', description: 'Será possível definir tempos separados para cada desafio' }];

export const userType = ['STUDENT', 'TEACHER', 'COMPANY', 'OTHER'];