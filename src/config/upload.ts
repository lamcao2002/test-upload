import multer from "multer";
import fs from "fs-extra";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const path1 = `./resources/${req.query.projectName}/present`;
    const dir = path.join(
      __dirname,
      "../../resources/",
      req.query.projectName as string,
      "present"
    );
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    cb(null, dir)
  },
  filename: function (req, file, cb) {
    const fileExtension = file.mimetype.split("/")[1];
    const fileName = file.originalname.split('.').slice(0,-1).join('.')
    cb(
      null,
      `${fileName}.${fileExtension}`
    );
  },
});

export const parserUploadLocal = multer({ storage });
