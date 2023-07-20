import {
  type Request,
  type Response,
  type Router,
  type NextFunction,
} from "express";
import decompress from "decompress";
import path from "path";
import fs from "fs-extra";
import moment from "moment";
import multer from "multer";
import { createModuleLogger } from "src/logging/logger";
import { parserUpload } from "../config/upload";
import { StatusCodes } from "http-status-codes";
import { ResponseError } from "src/models/error";

const logger = createModuleLogger("VR360.UploadFile");
const upload = parserUpload.single("file");

export function initRoutersUpload(router: Router): void {
  router.post(
    "/uploads/vr360/",
    removeFile,
    function (req, res, next) {
      upload(req, res, function (err) {
        // A Multer error occurred when uploading
        if (err instanceof multer.MulterError) {
          logger.error(JSON.stringify(err.field));
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json(
              new ResponseError(
                StatusCodes.BAD_REQUEST,
                err.field as string
              ).getError()
            );
        } else if (err) {
          // A unknown error occurred when uploading
          logger.error(JSON.stringify(err.message));
          return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(
              new ResponseError(
                StatusCodes.INTERNAL_SERVER_ERROR,
                err.message as string
              ).getError()
            );
        }

        next();
      });
    },
    uploadSingleFile
  );
}

async function removeFile(req: Request, res: Response, next: NextFunction) {
  try {
    const { projectName } = req.query;
    const dir = path.join(
      __dirname,
      "../../resources/",
      projectName as string,
      "present"
    );

    const destination = path.join(
      __dirname,
      "../../resources/",
      projectName as string,
      "history"
    );

    const isExistDir = await fs.exists(dir);
    if (isExistDir) {
      const files = fs.readdirSync(dir);
      const file = files.find((file) => path.extname(file) === ".zip");
      if (file) {
        const deletedTime = moment(Date.now()).format("DDMMYYYY_HHmmss");
        const fileName = file.split(".").slice(0, -1).join(".");
        const fileExtension = path.extname(file);

        fs.moveSync(
          `${dir}/${file}`,
          `${destination}/${fileName}_${deletedTime}${fileExtension}`
        );
        logger.info("Remove File Successful");

        fs.rmSync(dir, { recursive: true, force: true });
      }
    }
    next();
  } catch (error: any) {
    logger.error(JSON.stringify(error));
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        new ResponseError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          error.message as string
        ).getError()
      );
  }
}

async function uploadSingleFile(req: Request, res: Response) {
  try {
    const { projectName } = req.query;
    const pathDecompress = `resources/${projectName}/present`;

    const dirFile = path.join(
      __dirname,
      "../../",
      pathDecompress,
      req.file?.filename as string
    );

    const dirPresent = path.join(
      __dirname,
      "../../",
      pathDecompress
    );

    logger.info(`Upload ${req.file?.filename} file successful`);
    try {
      await decompress(dirFile, dirPresent);
      logger.info(`Decompression ${req.file?.filename} file successful`);
    } catch (error: any) {
      logger.error(
        `Decompression ${req.file?.filename} file fail : ${JSON.stringify(
          error
        )}`
      );
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          new ResponseError(
            StatusCodes.BAD_REQUEST,
            error.message as string
          ).getError()
        );
    }

    const proxyHost = req.headers["x-forwarded-host"];
    const host = proxyHost ? proxyHost : req.headers.host;
    console.log(host);
    console.log(req.protocol);
    

    let url: string = '';

    const isExistDir = await fs.exists(dirPresent);
    if (isExistDir) {
      const files = fs.readdirSync(dirPresent);
      const file = files.find((file) =>  [".htm", '.html'].includes(path.extname(file)));
      if (file) {
        url = `${req.protocol}://${host}/${pathDecompress}/${file}`;
      }
    }
    
    const result = { ...req.file, url}

    return res.json(result);
  } catch (error: any) {
    logger.error(JSON.stringify(error));
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        new ResponseError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          error.message as string
        ).getError()
      );
  }
}
