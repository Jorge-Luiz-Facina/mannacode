import { throwRuleException } from '../exception';
import { BaseValidate } from './base.validate';

export class RequiredField extends BaseValidate {
  constructor(field: any) {
    super(field);
  }
  public action() {
    throwRuleException(`O campo ${this.field.name} está vazio`);
  }

  public verifyField() {
    
    if (!this.field.value || this.field.value.length < 1) {
      return true;
    }
    return false;
  }
}
