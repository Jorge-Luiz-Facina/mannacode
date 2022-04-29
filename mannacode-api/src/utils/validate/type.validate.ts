import { throwRuleException } from '../exception';
import { BaseValidate } from './base.validate';

export class Type extends BaseValidate {
  constructor(field: any) {
    super(field);
  }

  public action() {
    throwRuleException('O tipo de pessoa não enquadra no registro');
  }

  public verifyField() {
    if(this.field.types.some(e => e ===  this.field.value)){
      return false;
    }
    return true;
  }
}
