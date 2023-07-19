"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initRoutersUpload = void 0;
const upload_1 = require("../config/upload");
const decompress_1 = __importDefault(require("decompress"));
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const moment_1 = __importDefault(require("moment"));
function initRoutersUpload(router) {
    router.post("/uploads/vr360/", removeFile, upload_1.parserUploadLocal.single("file"), uploadSingleFile);
}
exports.initRoutersUpload = initRoutersUpload;
function removeFile(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { projectName } = req.query;
            const dir = path_1.default.join(__dirname, "../../resources/", projectName, "present");
            const destination = path_1.default.join(__dirname, "../../resources/", projectName, "history");
            const isExistDir = yield fs_extra_1.default.exists(dir);
            if (isExistDir) {
                const files = fs_extra_1.default.readdirSync(dir);
                const file = files.find((file) => path_1.default.extname(file) == ".zip");
                if (file) {
                    const deletedTime = (0, moment_1.default)(Date.now()).format("DDMMYYYY_HHmmss");
                    const fileName = file.split('.').slice(0, -1).join('.');
                    const fileExtension = path_1.default.extname(file);
                    fs_extra_1.default.moveSync(`${dir}/${file}`, `${destination}/${fileName}_${deletedTime}${fileExtension}`);
                }
            }
            next();
        }
        catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    });
}
function uploadSingleFile(req, res) {
    var _a;
    try {
        console.log(req.file);
        const { projectName } = req.query;
        console.log("upload projectName", projectName);
        const link = path_1.default.join(__dirname, "../../resources/", projectName, "present", (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename);
        (0, decompress_1.default)(link, `resources/${projectName}/present`)
            .then((files) => {
            // console.log(files);
        })
            .catch((error) => {
            console.log(error);
        });
        return res.json({ data: req.file });
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}
//# sourceMappingURL=upload.js.map