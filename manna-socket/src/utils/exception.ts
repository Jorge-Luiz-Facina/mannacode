import { Unprocessable } from '@feathersjs/errors';

export const throwRuleException = (message: string) => {
  throw new Unprocessable(message);
};
