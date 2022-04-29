import { Application as ExpressFeathers } from '@feathersjs/express';

// tslint:disable-next-line
export interface IServiceTypes {}
// The application instance type that will be used everywhere else
export type Application = ExpressFeathers<IServiceTypes>;
