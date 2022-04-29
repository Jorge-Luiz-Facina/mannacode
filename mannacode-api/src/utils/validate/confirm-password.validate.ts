import { throwRuleException } from '../exception';
import { BaseValidate } from './base.validate';

export class ConfirmPassword extends BaseValidate {
  constructor(field: any) {
    super(field);
  }
  public action() {
    throwRuleException('As senhas não são idênticas');
  }

  public verifyField() {
    return this.field.password !== this.field.confirmPassword;
  }
}
