import { DataTypes, Model, Sequelize } from 'sequelize';
import { HookReturn } from 'sequelize/types/lib/hooks';
import { Application } from '../declarations';
import { BaseModel } from './base.model';
import { StatusChallenges } from './enums/status-challenges';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const status = Object.keys(StatusChallenges);

  const users = sequelizeClient.define('applicator-start', {
    ...BaseModel,
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    classificationLength: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'status',
      values: status,
      validate: {
        isIn: [status],
      },
    },
  }, {
    tableName: 'applicator_start',
    hooks: {
      beforeCount(options: any): HookReturn {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (users as any).associate = (models: any) => {

  };

  return users;
}
