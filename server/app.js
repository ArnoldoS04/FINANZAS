import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import routes from "./routes/index.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { corsOptions } from "./middlewares/cors.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));

app.use("/api", routes);
app.listen(process.env.PORT, () => {
  console.log(`Server corriendo en https://api.infracod.com:${process.env.PORT}`);
});
