// import "reflect-metadata";
import cookieParser from "cookie-parser";
// import morgan from 'morgan';
import helmet from 'helmet';
import cors from "cors";
import "dotenv/config";

import express, { NextFunction, Request, Response } from "express";
import { initRouters } from "./routes";
import { createModuleLogger } from "./logging/logger";

const logger = createModuleLogger("VR360.Server");

const app = express();
const handleError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err) {
    // logger.error(`HTTP ${req.method} ${req.originalUrl}`);

    // if (err instanceof AppError) {
    //   res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR);
    // } else {
    //   res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    // }
    res.json(err);
  }
  next();
};

/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/
app.use(cors());
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
  crossOriginEmbedderPolicy: process.env.NODE_ENV !== 'local'
}))
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json('OK')
});

// Add API
app.use(initRouters());
app.use("/resources", express.static("resources"));
app.use(handleError)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`🚀 REST API server is running on http://localhost:${PORT}`);
});

