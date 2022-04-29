import { Application } from '../../declarations';
import { Params, Id } from '@feathersjs/feathers';
import { AdapterService } from '../adapter-service';
import axios from 'axios';
import { throwRuleException } from '../../utils/exception';

export class ApplicatorStartSocket extends AdapterService {
  private app: Application;

  constructor(app: Application) {
    super();
    this.app = app;
  }

  public async create(data: Partial<any>, params: Params = {}): Promise<any> {
    const mannaapi = this.app.get('mannaapi');

    const response: any = await axios({
      method: 'post',
      url: `${mannaapi.host}/applicator-start-socket`,
      data: data,
      headers: { Authorization: `Bearer ${data.token}` }
    }).catch(function (error) {
      if (error.response) {
        throwRuleException(error.response.data.message);
      } else if (error.request) {
        throwRuleException(error.request);
      } else {
        throwRuleException(error.request);
      }
    });
    if (params.connection && response?.data && response?.data.id) {
      this.app.channel(`room:${response?.data.id}`).join(params.connection);
      this.app.channel(`applicator:${response?.data.id}`).join(params.connection);
    }
    return response?.data;
  }

  public async patch(
    id: Id,
    data: Partial<any>,
    params: Params = {},
  ): Promise<any> {
    const mannaapi = this.app.get('mannaapi');

    const response: any = await axios({
      method: 'patch',
      url: `${mannaapi.host}/applicator-start-socket/${id}`,
      data: data,
      headers: { Authorization: `Bearer ${data.token}` }
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
      this.app.channel(`room:${id}`).join(params.connection);
      this.app.channel(`applicator:${id}`).join(params.connection);
    }
    return await this.socketStatusPlayersAndStatusChallenges(id, data.token);
  }

  private async socketStatusPlayersAndStatusChallenges(id, token) {
    const mannaapi = this.app.get('mannaapi');
    const response: any = await axios({
      method: 'get',
      url: `${mannaapi.host}/applicator-start-socket/${id}`,
      data: { applicatorStartId: id },
      headers: { Authorization: `Bearer ${token}` }
    }).catch(function (error) {
      if (error.response) {
        throwRuleException(error.response.data.message);
      } else if (error.request) {
        throwRuleException(error.request);
      } else {
        throwRuleException(error.request);
      }
    });
    return response?.data
  }
}
