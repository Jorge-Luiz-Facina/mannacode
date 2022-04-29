import { DataTypes, Model, Sequelize } from 'sequelize';
import { HookReturn } from 'sequelize/types/lib/hooks';
import { Application } from '../declarations';
import { BaseModel } from './base.model';

export default function(app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const applicatorStartGroupChallenge = sequelizeClient.define('applicator-start-group-challenge', {
    ...BaseModel,

    groupChallengeId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    applicatorStartId: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    tableName: 'applicator_start_group_challenge',
    hooks: {
      beforeCount(options: any): HookReturn {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (applicatorStartGroupChallenge as any).associate = (models: any) => {

  };

  return applicatorStartGroupChallenge;
}
