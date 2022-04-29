import { Application } from '../../declarations';
import { Params } from '@feathersjs/feathers';
import { AdapterService } from '../adapter-service';
import { pythonTest } from '../../utils/language/tests/tests.python';
import { javaTest } from '../../utils/language/tests/tests.java';
import { getLines } from '../../utils/count-lines';
import { getOutputJava } from '../../utils/language/output/output.java';
import { getOutputPython } from '../../utils/language/output/output.pytho';
import { CodeError } from '../../models/enums/code-error.enum';
import axios from 'axios';
import { javascriptTest } from '../../utils/language/tests/tests.javascript';
import { getOutputJavaScript } from '../../utils/language/output/output.javascript';
import { throwRuleException } from '../../utils/exception';
import { getRedis, setRedis } from '../../utils/redist';
import { getOutputCsharp } from '../../utils/language/output/output.csharp';
import { csharpTest } from '../../utils/language/tests/tests.csharp';

export class CodeExecutor extends AdapterService {
  private app: Application;

  constructor(app: Application) {
    super();
    this.app = app;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async create(data: Partial<any>, params: Params = {}): Promise<any> {
    const cacheClient = this.app.get('redis');
    const cacheRunner = `${data.playerId}`;
    const messageErroRunner = 'Você já esta executando um código';
    try {
      const userRunnerJson = await getRedis(cacheClient, cacheRunner);
      if (userRunnerJson !== null) {
        const userRunner = JSON.parse(userRunnerJson);
        const dateVerify = new Date();
        dateVerify.setSeconds(dateVerify.getSeconds() - 30);
        if (userRunner.execute && userRunner.date > dateVerify.toUTCString()) {
          throwRuleException(messageErroRunner);
        }
        const date = new Date();
        date.setSeconds(date.getSeconds() - 6);
        if (userRunner.date > date.toUTCString()) {
          const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
          await delay(3000);
        }
      }
      const executeJson = { execute: true, date: new Date().toUTCString() };
      setRedis(cacheClient, cacheRunner, executeJson);

      const runnercode = this.app.get('runnercode');
      let code;
      if (data.language === 'Python') {
        code = pythonTest(data.code, data.test);
      } else if (data.language === 'Java') {
        code = javaTest(data.code, data.test);
      }
      else if (data.language === 'Csharp') {
        code = csharpTest(data.code, data.test);
      }
      else {
        code = javascriptTest(data.code, data.test);
      }

      const results: any = await axios({
        method: 'post',
        url: `${runnercode.host}/code-executor`,
        data: {
          code: code,
          language: data.language,
          login: runnercode.login,
          password: runnercode.password
        }
      }).catch(function (error) {
        if (error.response) {
          const executeJsonFalse = { execute: false, date: new Date().toUTCString() };
          setRedis(cacheClient, cacheRunner, executeJsonFalse);
          throwRuleException(error.response.data.message);
        } else if (error.request) {
          const executeJsonFalse = { execute: false, date: new Date().toUTCString() };
          setRedis(cacheClient, cacheRunner, executeJsonFalse);
          throwRuleException(error.request);
        } else {
          const executeJsonFalse = { execute: false, date: new Date().toUTCString() };
          setRedis(cacheClient, cacheRunner, executeJsonFalse);
          throwRuleException(error.request);
        }
      });
      const executeJsonFalse = { execute: false, date: new Date().toUTCString() };
      setRedis(cacheClient, cacheRunner, executeJsonFalse);
      return results?.data;
    }
    catch (e) {
      const executeJsonFalse = { execute: false, date: new Date().toUTCString() };
      if (e.message !== messageErroRunner) {
        setRedis(cacheClient, cacheRunner, executeJsonFalse);
      }
      this.verifyErrorContainer(e.message);
      throwRuleException(e.message);
    }
  }

  private verifyErrorContainer(message) {
    if (message && message.includes('no such container')) {
      throwRuleException('Estamos criando o ambiente para execução do seu código tente executar novamente');
    }
  }
  public getOutput(tests, language, code) {
    if (tests.remarks === CodeError.Fail) {
      return this.getOutputLanguage(tests.obtainedOutput, language, code);
    }
    else if (tests.remarks === CodeError.Error) {
      return this.getOutputLanguage(tests.error, language, code);
    }
    return 'Testes Passou com sucesso!';
  }
  private getOutputLanguage(error, language, code) {
    if (language === 'Java') {
      return getOutputJava(error, getLines(code));
    } else if (language === 'Python') {
      return getOutputPython(error, getLines(code));
    }
    else if (language === 'Csharp') {
      return getOutputCsharp(error, getLines(code));
    } else {
      return getOutputJavaScript(error, getLines(code));
    }
  }
}
