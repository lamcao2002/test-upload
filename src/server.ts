// import "reflect-metadata";
import cookieParser from "cookie-parser";
// import morgan from 'morgan';
// import helmet from 'helmet';
import cors from "cors";
import "dotenv/config";

import express, { NextFunction, Request, Response } from "express";
import { initRouters } from "./routes";

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

// Run listen events
// run();

const PORT = process.env.PORT || 3000;

// console.log(__dirname);

app.listen(PORT, () => {
  console.log(`🚀 REST API server is running on http://localhost:${PORT}`);
});

