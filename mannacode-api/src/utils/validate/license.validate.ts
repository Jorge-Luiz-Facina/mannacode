import { throwRuleException } from '../exception';
import { BaseValidate } from './base.validate';

export class License extends BaseValidate {
  constructor(field: any) {
    super(field);
  }
  public action() {
    throwRuleException('Você precisa aceitar os Termos de uso.');
  }
  public verifyField() {
    return !this.field;
  }
}
