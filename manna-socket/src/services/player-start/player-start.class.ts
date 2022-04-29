import { Application } from '../../declarations';
import { Params, Id } from '@feathersjs/feathers';
import { AdapterService } from '../adapter-service';
import axios from 'axios';
import { throwRuleException } from '../../utils/exception';

export class PlayerStart extends AdapterService {
  private app: Application;

  constructor(app: Application) {
    super();
    this.app = app;
  }

  public async create(data: Partial<any>, params: Params = {}): Promise<any> {
    const mannaapi = this.app.get('mannaapi');
    const response: any = await axios({
      method: 'post',
      url: `${mannaapi.host}/player-start`,
      data: data,
    }).catch(function (error) {
      if (error.response) {
        throwRuleException(error.response.data.message);
      } else if (error.request) {
        throwRuleException(error.request);
      } else {
        throwRuleException(error.request);
      }
    });
    if (params.connection && response?.data) {
      this.app.channel(`room:${response?.data.applicatorStartId}`).join(params.connection);
    }
    return response?.data;
  }

  public async get(id: Id, params: Params = {}): Promise<any> {
    const mannaapi = this.app.get('mannaapi');
    const response: any = await axios({
      method: 'get',
      url: `${mannaapi.host}/player-start/${id}`,
    }).catch(function (error) {
      if (error.response) {
        throwRuleException(error.response.data.message);
      } else if (error.request) {
        throwRuleException(error.request);
      } else {
        throwRuleException(error.request);
      }
    });
    if (params.connection && response?.data) {
      this.app.channel(`room:${response?.data.applicatorStartId}`).join(params.connection);
    }
    return response?.data;
  }
}