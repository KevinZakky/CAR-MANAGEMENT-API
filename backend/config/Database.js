import { Sequelize } from "sequelize";

const db = new Sequelize("crud_with_auth_db", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default db;
