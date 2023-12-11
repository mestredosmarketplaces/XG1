"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logRequestInfo = void 0;
const logger_1 = __importDefault(require("../logger"));
const logRequestInfo = (logMessage) => {
    return (req, res, next) => {
        logger_1.default.info(logMessage, Object.assign({ requestBody: req.body }, req.requestHandledHeader));
        next();
    };
};
exports.logRequestInfo = logRequestInfo;
