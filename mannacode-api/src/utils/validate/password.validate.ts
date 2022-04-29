import { throwRuleException } from '../exception';
import { BaseValidate } from './base.validate';

export class Password extends BaseValidate {
  constructor(field: any) {
    super(field);
  }
  public action() {
    if (this.rule === '6 caracter') {
      throwRuleException('A senha deve conter no mínimo 6 caracteres');
    } else {
      throwRuleException('A senha deve conter no máximo 64.');
    }
  }

  public verifyField() {
    if (!this.field || this.field.length < 6) {
      this.rule = '6 caracter';
      return true;
    } else if (this.field.length > 64) {
      this.rule = '64 caracter';
      return true;
    }
    return false;
  }
}
