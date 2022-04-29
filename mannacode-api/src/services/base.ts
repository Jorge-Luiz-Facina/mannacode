
import errors from '@feathersjs/errors';
import { Id, Paginated, Params } from '@feathersjs/feathers';
import { SequelizeServiceOptions, Service } from 'feathers-sequelize';

export class BaseService<T = any> extends Service {
  constructor(options: Partial<SequelizeServiceOptions>) {
    super(options);
  }

  public async find(params: Params = {}): Promise<T[] | Paginated<T>> {
    const query = params.query || {};

    return super.find({
      ...params,
      query: {
        ...query,
        deletedAt: null,
      },
    });
  }

  public async get(id: Id, params: Params = {}): Promise<T> {
    const query = params.query || {};

    return super.get(id, {
      ...params,
      query: {
        ...query,
        deletedAt: null,
      },
    });
  }

  public async update(): Promise<T> {
    return Promise.reject(new errors.MethodNotAllowed());
  }

  public async patch(
    id: Id,
    data: Partial<T>,
    params: Params = {},
  ): Promise<T> {
    return super.patch(
      id,
      {
        ...data,
        updatedAt: new Date(),
      },
      params,
    );
  }

  public async remove(id: Id, params: Params = {}): Promise<T> {
    const query = params.query || {};

    return super.patch(
      id,
      {
        deletedAt: new Date(),
      },
      {
        ...params,
        $returning: false,
        query: {
          ...query,
          deletedAt: null,
        },
      },
    );
  }
}
