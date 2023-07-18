import multer from "multer";
import fs from "fs-extra";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const path = `./resources/${req.query.projectName}/present`;
    
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true })
    }

    cb(null, path)
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
