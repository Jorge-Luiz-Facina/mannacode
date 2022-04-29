import { DataTypes, Model, Sequelize } from 'sequelize';
import { HookReturn } from 'sequelize/types/lib/hooks';
import { Application } from '../declarations';
import { BaseModel } from './base.model';

export default function(app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');

  const users = sequelizeClient.define('player-challenge-punctuations', {
    ...BaseModel,

    punctuation: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    playerStartId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    playerStartPunctuatedId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    playerChallengeId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'player_challenge_punctuation',
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
