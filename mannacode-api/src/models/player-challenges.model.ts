import { DataTypes, Model, Sequelize } from 'sequelize';
import { HookReturn } from 'sequelize/types/lib/hooks';
import { Application } from '../declarations';
import { BaseModel } from './base.model';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');

  const users = sequelizeClient.define('player-challenges', {
    ...BaseModel,

    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    time: {
      type: DataTypes.INTEGER,
    },
    passTest: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    errorLog: {
      type: DataTypes.STRING,
    },
    playerStartId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    challengeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    punctuated: {
      type: DataTypes.BOOLEAN,
    },
    started: {
      type: DataTypes.DATE,
    },
  }, {
    tableName: 'player_challenge',
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
