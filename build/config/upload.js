"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parserUploadLocal = void 0;
const multer_1 = __importDefault(require("multer"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        const path = `./resources/${req.query.projectName}/present`;
        if (!fs_extra_1.default.existsSync(path)) {
            fs_extra_1.default.mkdirSync(path, { recursive: true });
        }
        cb(null, path);
    },
    filename: function (req, file, cb) {
        const fileExtension = file.mimetype.split("/")[1];
        const fileName = file.originalname.split('.').slice(0, -1).join('.');
        cb(null, `${fileName}.${fileExtension}`);
    },
});
exports.parserUploadLocal = (0, multer_1.default)({ storage });
//# sourceMappingURL=upload.js.map