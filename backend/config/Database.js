import { Sequelize } from "sequelize";

const db = new Sequelize("jwt_token", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default db;
