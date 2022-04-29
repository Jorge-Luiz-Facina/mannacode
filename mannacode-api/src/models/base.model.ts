import { DataTypes } from 'sequelize';

export const BaseModel = {
  createdAt: {
    allowNull: false,
    defaultValue: DataTypes.NOW,
    type: DataTypes.DATE,
    field: 'created_at',
  },
  updatedAt: {
    allowNull: false,
    defaultValue: DataTypes.NOW,
    type: DataTypes.DATE,
    field: 'updated_at',
  },
  deletedAt: {
    allowNull: true,
    defaultValue: null,
    type: DataTypes.DATE,
    field: 'deleted_at',
  },
};
