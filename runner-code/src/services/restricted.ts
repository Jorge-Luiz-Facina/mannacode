
import { Id, Paginated, Params } from '@feathersjs/feathers';
import { SequelizeServiceOptions } from 'feathers-sequelize';

import { BaseService } from './base';

export class RestrictedClienteService<T = any> extends BaseService {
  constructor(options: Partial<SequelizeServiceOptions>) {
    super(options);
  }

  public async find(params: Params = {}): Promise<T[] | Paginated<T>> {

    return super.find({
      ...params,
      query: this.getQuery(params),
    });
  }

  public async get(id: Id, params: Params = {}): Promise<T> {

    return super.get(id, {
      ...params,
      query: this.getQuery(params),
    });
  }

  public async create(data: Partial<T>, params: Params = {}): Promise<T> {
    return super.create(
      {
        ...data,
        clienteId: params.clienteId,
      },
      params,
    );
  }

  public async patch(
    id: Id,
    data: Partial<T>,
    params: Params = {},
  ): Promise<T> {

    return super.patch(id, data, {
      ...params,
      query: this.getQuery(params),
    });
  }

  public async remove(id: Id, params: Params = {}): Promise<T> {

    return super.remove(id, {
      ...params,
      query: this.getQuery(params),
    });
  }

  private getQuery(params: Params = {}): Params {
    const query = params.query || {};
    if (params.playerId) {
      return {
        ...query,
        playerId: params.playerId,
      };
    }

    return query;
  }
}
