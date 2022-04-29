import { Sequelize } from 'sequelize';
import { Application } from './declarations';

export default function (app: Application): void {
  const pg = app.get(process.env.NODE_ENV === 'test' ? 'postgrestest' : 'postgres');
  const connectionString = `postgres://${pg.user}:${pg.password}@${pg.host}:${pg.port}/${pg.database}`;

  const sequelize = new Sequelize(connectionString, {
    dialect: 'postgres',
    // tslint:disable-next-line
    logging: !(process.env.NODE_ENV === 'production') ? console.log : undefined,
    timezone: 'America/Sao_Paulo',
    define: {
      freezeTableName: true,
      underscored: true
    }
  });
  const oldSetup = app.setup;

  app.set('sequelizeClient', sequelize);

  app.setup = function (...args): Application {
    const result = oldSetup.apply(this, args);

    const models = sequelize.models;
    Object.keys(models).forEach(name => {
      if ('associate' in models[name]) {
        (models[name] as any).associate(models);
      }
    });

    return result;
  };
}
