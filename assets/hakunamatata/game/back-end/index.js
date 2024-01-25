import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import path from "path";
import bodyParser from "body-parser";

import updateController from "./controllers/addScore.js";
import retrieveController from "./controllers/retrieveScores.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors());
app.use(bodyParser.json({ extended: "true" }));
app.use(bodyParser.urlencoded({ extended: "true" }));
app.use(morgan("common"));
app.use(cookieParser());

app.use("/update", updateController);
app.use("/retrieve", retrieveController);

const port = process.env.PORT || 3001;
mongoose
  .connect('mongodb://localhost:27017/your-database-name', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(port, () => {
      console.log("Server is running on port " + port);
    });
  })
  .catch((error) => {
    console.error(error);
  });
