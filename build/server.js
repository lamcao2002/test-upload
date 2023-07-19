"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import "reflect-metadata";
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// import morgan from 'morgan';
// import helmet from 'helmet';
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes");
const app = (0, express_1.default)();
const handleError = (err, req, res, next) => {
    if (err) {
        // logger.error(`HTTP ${req.method} ${req.originalUrl}`);
        // if (err instanceof AppError) {
        //   res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR);
        // } else {
        //   res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        // }
        res.json(err);
    }
    next();
};
/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
app.use((0, cookie_parser_1.default)());
app.get("/", (req, res) => {
    res.json('OK');
});
// Add API
app.use((0, routes_1.initRouters)());
app.use("/resources", express_1.default.static("resources"));
app.use(handleError);
// Run listen events
// run();
const PORT = process.env.PORT || 3000;
// console.log(__dirname);
app.listen(PORT, () => {
    console.log(`🚀 REST API server is running on http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map