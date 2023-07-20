import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from 'helmet';
import morgan from 'morgan';
import "dotenv/config";

import cookieParser from "cookie-parser";
import { initRouters } from "./routes";
import { createModuleLogger } from "./logging/logger";
import { ResponseError } from "./models/error";
import { StatusCodes } from "http-status-codes";

const logger = createModuleLogger("VR360.Server");

const app = express();
const handleError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err) {
    logger.error(`HTTP ${req.method} ${req.originalUrl}`);

    if (err instanceof ResponseError) {
      res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR);
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
    res.json(err);
  }
  next();
};

/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/
app.use(cors());

if (process.env.NODE_ENV === 'local') {
  app.use(morgan('dev'));
}

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

