import { DataTypes, Model, Sequelize } from 'sequelize';
import { HookReturn } from 'sequelize/types/lib/hooks';
import { Application } from '../declarations';
import { BaseModel } from './base.model';

export default function(app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const plans = sequelizeClient.define('plans', {
    ...BaseModel,

    validity: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    started: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    numberPlayers: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    value: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    tableName: 'plan',
    hooks: {
      beforeCount(options: any): HookReturn {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (plans as any).associate = (models: any) => {
  };

  return plans;
}
