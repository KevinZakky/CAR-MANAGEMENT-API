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
  },
  {
    freezeTableName: true,
  }
);

Users.hasMany(Car);
Car.belongsTo(Users, { foreignKey: "userId" });

export default Car;

// (async () => {
//   await db.sync();
// })();
