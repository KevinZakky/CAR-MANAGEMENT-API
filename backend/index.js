import express from "express";
import cors from "cors";
import FileUpload from "express-fileupload";
import userRoute from "./routes/userRoute.js";
import carRoute from "./routes/carRoute.js";
import dotenv from "dotenv";
import session from "express-session";
import cookieParser from "cookie-parser";
import db from "./config/Database.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import SequelizeStore from "connect-session-sequelize";
dotenv.config();

const app = express();
const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
  db: db,
});
// (async () => {
//   await db.sync();
// })();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(FileUpload());
app.use(
  session({
    secret: "My secret key",
    resave: false,
    saveUninitialized: false,
    store: store,
    resave: false,
  })
);

app.use(userRoute);
app.use(carRoute);

// store.sync();

app.listen(5000, () => console.log(`Server Up and Running...`));
