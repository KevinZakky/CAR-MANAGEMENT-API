import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./userModel.js";

const { DataTypes } = Sequelize;

const Car = db.define(
  "car",
  {
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    name: DataTypes.STRING,
    rentPerDay: DataTypes.INTEGER,
    image: DataTypes.STRING,
    url: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    updatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    deletedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    is_deleted: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

Users.hasMany(Car);
Car.belongsTo(Users, { foreignKey: "userId" });
Car.belongsTo(Users, { as: "CreatedBy", foreignKey: "createdBy" });
Car.belongsTo(Users, { as: "UpdatedBy", foreignKey: "updatedBy" });
Car.belongsTo(Users, { as: "DeletedBy", foreignKey: "deletedBy" });

export default Car;

// (async () => {
//   await db.sync({ alter: true });
// })();
