import { parserUpload } from "../config/upload";
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
import { createModuleLogger } from "src/logging/logger";
import multer from "multer";

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

          return res.status(404).json(err.field);
        } else if (err) {
          // A unknown error occurred when uploading
          logger.error(JSON.stringify(err.message));
          return res.status(500).json(err.message);
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
      const file = files.find((file) => path.extname(file) == ".zip");
      if (file) {
        const deletedTime = moment(Date.now()).format("DDMMYYYY_HHmmss");
        const fileName = file.split(".").slice(0, -1).join(".");
        const fileExtension = path.extname(file);

        fs.moveSync(
          `${dir}/${file}`,
          `${destination}/${fileName}_${deletedTime}${fileExtension}`
        );
        logger.info("Remove File Successful");
      }
    }
    next();
  } catch (error) {
    logger.error(JSON.stringify(error));
    res.status(500).json(error);
  }
}

function uploadSingleFile(req: Request, res: Response) {
  try {
    console.log(req.file);
    const { projectName } = req.query;
    const link = path.join(
      __dirname,
      "../../resources/",
      projectName as string,
      "present",
      req.file?.filename as string
    );
    decompress(link, `resources/${projectName}/present`)
      .then((files) => {
        logger.info(`Decompression ${req.file?.filename} file successful`);
      })
      .catch((error) => {
        logger.error(JSON.stringify(error));
      });

    logger.info(`Upload ${req.file?.filename} file successful`);

    return res.json({ data: req.file });
  } catch (error) {
    logger.error(JSON.stringify(error));
    res.status(500).json(error);
  }
}
