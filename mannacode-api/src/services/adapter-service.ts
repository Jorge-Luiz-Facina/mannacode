import errors from '@feathersjs/errors';
import { Id, Paginated, Params, ServiceMethods } from '@feathersjs/feathers';
import { reject } from 'bluebird';
/* eslint-disable @typescript-eslint/no-unused-vars */

export abstract class AdapterService<T = any> implements ServiceMethods<T> {

  public async find(params?: Params): Promise<T[] | Paginated<T>> {
    return reject(new errors.MethodNotAllowed());
  }

  public async get(id: Id, params: Params = {}): Promise<T> {
    return reject(new errors.MethodNotAllowed());
  }

  public async create(data: Partial<T>, params: Params = {}): Promise<T> {
    return reject(new errors.MethodNotAllowed());
  }

  public async update(): Promise<T> {
    return reject(new errors.MethodNotAllowed());
  }

  public async patch(id: Id, data: Partial<T>, params: Params = {}): Promise<T> {
    return reject(new errors.MethodNotAllowed());
  }

  public async remove(id: Id, params: Params = {}): Promise<T> {
    return reject(new errors.MethodNotAllowed());
  }
}
