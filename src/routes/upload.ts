import { parserUploadLocal } from "../config/upload";
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

export function initRoutersUpload(router: Router): void {
  router.post(
    "/uploads/vr360/",
    removeFile,
    parserUploadLocal.single("file"),
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
        const fileName = file.split('.').slice(0,-1).join('.');
        const fileExtension = path.extname(file);

        fs.moveSync(
          `${dir}/${file}`,
          `${destination}/${fileName}_${deletedTime}${fileExtension}`
        );
      }
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

function uploadSingleFile(req: Request, res: Response) {
  try {
    console.log(req.file);
    const { projectName } = req.query;
    console.log("upload projectName", projectName);
    const link = path.join(
      __dirname,
      "../../resources/",
      projectName as string,
      "present",
      req.file?.filename as string
    );
    decompress(link, `resources/${projectName}/present`)
      .then((files) => {
        // console.log(files);
      })
      .catch((error) => {
        console.log(error);
      });
    return res.json({ data: req.file });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}
