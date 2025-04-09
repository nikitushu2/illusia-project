import { Model, DataTypes } from "sequelize";
import { sequelize } from "../util/db";

class User extends Model {}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        displayName: {
            type: DataTypes.STRING(255),
            field: "display_name"
        },
        role: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        isApproved: {
            type: DataTypes.BOOLEAN,
            field: "is_approved"
        },
        createdAt: {
            type: DataTypes.DATE,
            field: "created_at",
        }
    },
    {
        sequelize,
        underscored: true,
        timestamps: false,
        modelName: "user",
        tableName: "users",
      }
);

export default User;