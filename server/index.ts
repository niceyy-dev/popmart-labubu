import { config } from "dotenv";
config(); // Permet de charger les variables d'environnement
import cors from "cors";
import * as bodyParser from "body-parser";
import mongoose from "mongoose";
import express from "express";
import path from "path";

import { LabubuController, UserController } from "./controllers";
import { RoleController } from "./controllers/role.controller";

async function startServer(): Promise<void> {
  await mongoose.connect(process.env.MONGO_URI, {
    auth: {
      username: process.env.MONGO_USER,
      password: process.env.MONGO_PASSWORD,
    },
  });
  const app = express();
  app.use(cors());
  //   app.use(
  //     "/music",
  //     express.static(path.join(__dirname, "../front/public/music"))
  //   ); // Correct path to music
  //   app.use(
  //     "/imgs",
  //     express.static(path.join(__dirname, "../front/public/imgs"))
  //   ); // Correct path to images

  app.use(bodyParser.json());
  app.use("/labubu", LabubuController.getInstance().buildRouter());
  app.use("/user", UserController.getInstance().buildRouter());
  app.use("/role", RoleController.getInstance().buildRouter());
  app.listen(process.env.PORT, async function () {
    await bootstrap();
    console.log("Server started on port " + process.env.PORT);
  });
}

async function bootstrap(): Promise<void> {}

startServer();
