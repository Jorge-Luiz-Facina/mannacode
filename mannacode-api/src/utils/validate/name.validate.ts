import { throwRuleException } from '../exception';
import { BaseValidate } from './base.validate';

export class Name extends BaseValidate {
  constructor(field: any) {
    super(field);
  }
  public action() {
    if (this.rule === '1 caracter') {
      throwRuleException('O Nome deve conter no mínimo 1 caracteres');
    } else {
      throwRuleException('O Nome deve conter no máximo 64 caracteres.');
    }
  }

  public verifyField() {
    if (!this.field || this.field.length < 1) {
      this.rule = '1 caracter';
      return true;
    } else if (this.field.length > 64) {
      this.rule = '64 caracter';
      return true;
    }
    return false;
  }
}
