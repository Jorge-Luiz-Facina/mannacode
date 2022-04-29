import { Application } from '../declarations';
import code_exeecutor from './code-executor/code-executor.service';

// Don't remove this comment. It's needed to format import lines nicely.

export default function(app: Application): void {
  app.configure(code_exeecutor);
}
