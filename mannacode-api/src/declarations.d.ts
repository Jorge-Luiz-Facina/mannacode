import { Application as ExpressFeathers } from '@feathersjs/express';
export interface IServiceTypes {}
export type Application = ExpressFeathers<IServiceTypes>;
