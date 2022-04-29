import { throwRuleException } from '../exception';
import { validateEmail } from '../validate';
import { BaseValidate } from './base.validate';

export class Email extends BaseValidate {
  constructor(field: any) {
    super(field);
  }
  public action() {
    throwRuleException('E-mail não é valido.');
  }

  public verifyField() {
    return !this.field || !validateEmail(this.field);
  }
}
