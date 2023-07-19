"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initRouters = void 0;
const express_1 = require("express");
const upload_1 = require("./upload");
function initRouters() {
    const router = (0, express_1.Router)();
    (0, upload_1.initRoutersUpload)(router);
    return router;
}
exports.initRouters = initRouters;
//# sourceMappingURL=index.js.map