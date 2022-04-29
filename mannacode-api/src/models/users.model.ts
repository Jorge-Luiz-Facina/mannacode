import { DataTypes, Model, Sequelize } from 'sequelize';
import { HookReturn } from 'sequelize/types/lib/hooks';
import { Application } from '../declarations';
import { BaseModel } from './base.model';
import { Role } from './enums/roles.enum';
import { UserType } from './enums/user-type.enum';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const roles = Object.keys(Role);
  const types = Object.keys(UserType);

  const users = sequelizeClient.define('users', {
    ...BaseModel,

    idFk: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'role',
      values: roles,
      validate: {
        isIn: [roles],
      },
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'type',
      values: types,
      validate: {
        isIn: [types],
      },
    },
    newsInfo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    verifyToken: {
      type: DataTypes.STRING,
    },
    verifiedEmail: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    newPasswordToken: {
      type: DataTypes.STRING,
    }, 
    newPasswordDate:{
      type: DataTypes.DATE,
    }
  }, {
    tableName: 'user',
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
