import multer from "multer";
import fs from "fs-extra";
import path, { dirname } from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const path1 = `../resources/${req.query.projectName}/present`;
    const dir = path.join(
      __dirname,
      "../../resources/",
      req.query.projectName as string,
      "present"
    );

    const appDir = dirname(require?.main?.filename as string);
    console.log(appDir);
    console.log(__dirname);
    console.log(dir);
    console.log(path.join(appDir, path1));
    const a = path.join(appDir, path1);

    if (!fs.existsSync(a)) {
      fs.mkdirSync(a, { recursive: true });
    }

    cb(null, a);
  },
  filename: function (req, file, cb) {
    const fileExtension = file.mimetype.split("/")[1];
    const fileName = file.originalname.split(".").slice(0, -1).join(".");
    cb(null, `${fileName}.${fileExtension}`);
  },
});

export const parserUploadLocal = multer({ storage });
