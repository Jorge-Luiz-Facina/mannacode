export abstract class BaseValidate {
  public field: any;
  public rule: any;

  constructor(field: any) {
    this.field = field;
  }
  public abstract  verifyField(): boolean;
  public abstract  action();
}
