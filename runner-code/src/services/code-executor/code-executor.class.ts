import { Application } from '../../declarations';
import { Params } from '@feathersjs/feathers';
import { AdapterService } from '../adapter-service';
import { CodeExecutor as code_executor } from 'code-executor';
import { throwRuleException } from '../../utils/exception';
import { CodeExecutorMessage } from './code-executor.message';
import { getRedis, setRedis } from '../../utils/redist';

export class CodeExecutor extends AdapterService {
  private app: Application;

  constructor(app: Application) {
    super();
    this.app = app;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async create(data: Partial<any>, params: Params = {}): Promise<any> {
    const user = this.app.get('user');
    if (user.login !== data.login || user.password !== data.password) {
      throwRuleException(CodeExecutorMessage.naoTemPermissao);
    }
    const redis = this.app.get('redis');
    const cacheRunner = `queue`;
    const qeueJson = await getRedis(redis, cacheRunner);
    let queueList
    if (qeueJson === null) {
      const _queueJson = { queue: '1' }
      setRedis(redis, cacheRunner, _queueJson);
      queueList = _queueJson;
    } else {
      queueList = JSON.parse(qeueJson);
    }
    const _Qeue = queueList.queue;
    if (queueList.queue === 1) {
      queueList.queue = 2
    } else {
      queueList.queue = 1
    }
    setRedis(redis, cacheRunner, queueList);
    const codeExecutor = new code_executor(`Executor/${_Qeue}`, `redis://${redis.address}`);

    const input = {
      language: data.language,
      code: data.code,
      testCases: [
        {
          input: '',
          output: '',
        },
      ],
      timeout: 5,
    };

    const results = await codeExecutor.runCode(input);
    return results;
  }
}
