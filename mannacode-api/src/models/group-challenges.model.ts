import { DataTypes, Model, Sequelize } from 'sequelize';
import { HookReturn } from 'sequelize/types/lib/hooks';
import { Application } from '../declarations';
import { BaseModel } from './base.model';
import { ScoreEvaluation } from './enums/score_evaluation.enum';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const scoreEvaluation = Object.keys(ScoreEvaluation);
  const users = sequelizeClient.define('group-challenges', {
    ...BaseModel,

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    viewCodeName: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    classificationLength: {
      type: DataTypes.INTEGER,
    },
    scoreEvaluation: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'score_evaluation',
      values: scoreEvaluation,
      validate: {
        isIn: [scoreEvaluation],
      },
    },
    applicatorWeight: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    playerWeight: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    timePlayerWeight: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    validity: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    viewPlayersFinishedChallenge: {
      type: DataTypes.BOOLEAN,
    },
  }, {
    tableName: 'group_challenge',
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
