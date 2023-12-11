"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const loggerSave_1 = require("./utils/loggerSave");
const date_fns_1 = require("date-fns");
const logFormat = winston_1.format.combine(winston_1.format.timestamp({
    format: () => (0, date_fns_1.format)((0, date_fns_1.subHours)(new Date(), 3), 'EEE, MMM dd, yyyy, h:mm:ss a')
}), winston_1.format.printf((_a) => {
    var { level, message, timestamp } = _a, meta = __rest(_a, ["level", "message", "timestamp"]);
    const logData = Object.assign({ level,
        message,
        timestamp }, meta);
    const logMessage = `${level}: ${message} at ${timestamp}`;
    return `${logMessage} ${JSON.stringify(logData)}`;
}));
const customLogger = (0, winston_1.createLogger)({
    transports: [
        new winston_1.transports.Console({
            format: logFormat
        })
    ]
});
async function processAndSaveLog(level, message, splat) {
    try {
        const validLevels = ['error', 'warn', 'info', 'verbose', 'debug'];
        if (validLevels.includes(level)) {
            // Save the log asynchronously
            const logDetail = {
                level,
                message,
                meta: splat || {}
            };
            // Save the log asynchronously
            const metaJson = typeof (logDetail.meta) === 'string' ? JSON.parse(logDetail.meta) : logDetail.meta;
            const logInfo = {
                level,
                message,
                metaJson,
                logDetail
            };
            (0, loggerSave_1.loggerSave)(logInfo);
            if (process.env.APP_SCENARIO_ENVIRONMENT === 'hom' || process.env.APP_SCENARIO_ENVIRONMENT === 'dev') {
                // Use a dynamic function call based on the log level
                customLogger.log(Object.assign({ level, message }, splat));
            }
        }
        else {
            console.error('Invalid log level:', level);
        }
    }
    catch (error) {
        console.error('Failed to process and save log:', error);
    }
}
const logger = {
    error: (message, meta) => {
        processAndSaveLog('error', message, meta);
    },
    warn: (message, meta) => {
        processAndSaveLog('warn', message, meta);
    },
    info: (message, meta) => {
        processAndSaveLog('info', message, meta);
    },
    verbose: (message, meta) => {
        processAndSaveLog('verbose', message, meta);
    },
    debug: (message, meta) => {
        processAndSaveLog('debug', message, meta);
    },
};
exports.default = logger;
