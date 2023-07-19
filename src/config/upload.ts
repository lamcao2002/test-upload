import multer from "multer";
import fs from "fs-extra";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(
      __dirname,
      "../../resources/",
      req.query.projectName as string,
      "present"
    );

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const fileExtension = file.mimetype.split("/")[1];
    const fileName = file.originalname.split(".").slice(0, -1).join(".");
    cb(null, `${fileName}.${fileExtension}`);
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  if (!file.originalname.match(/\.(zip)$/)) {
    return cb(
      new multer.MulterError(
        "LIMIT_UNEXPECTED_FILE",
        "Uploaded file is invalid. Only *.zip is acceptable"
      ),
      false
    );
  }

  cb(null, true);
};

export const parserUpload = multer({ storage, fileFilter });
