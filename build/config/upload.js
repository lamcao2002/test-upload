"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parserUploadLocal = void 0;
const multer_1 = __importDefault(require("multer"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importStar(require("path"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        var _a;
        const path1 = `../resources/${req.query.projectName}/present`;
        const dir = path_1.default.join(__dirname, "../../resources/", req.query.projectName, "present");
        const appDir = (0, path_1.dirname)((_a = require === null || require === void 0 ? void 0 : require.main) === null || _a === void 0 ? void 0 : _a.filename);
        console.log(appDir);
        console.log(__dirname);
        console.log(dir);
        console.log(path_1.default.join(appDir, path1));
        const a = path_1.default.join(appDir, path1);
        if (!fs_extra_1.default.existsSync(a)) {
            fs_extra_1.default.mkdirSync(a, { recursive: true });
        }
        cb(null, a);
    },
    filename: function (req, file, cb) {
        const fileExtension = file.mimetype.split("/")[1];
        const fileName = file.originalname.split(".").slice(0, -1).join(".");
        cb(null, `${fileName}.${fileExtension}`);
    },
});
exports.parserUploadLocal = (0, multer_1.default)({ storage });
//# sourceMappingURL=upload.js.map