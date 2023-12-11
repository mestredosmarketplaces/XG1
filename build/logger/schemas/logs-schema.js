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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const uuid_1 = require("uuid");
const mongoose_update_if_current_1 = require("mongoose-update-if-current");
const LoggerSchema = new mongoose_1.Schema({
    _id: { type: String, default: uuid_1.v4 },
    level: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    meta: {
        type: mongoose_1.Schema.Types.Mixed,
        required: true
    },
    description: {
        type: String,
        required: true,
        index: true,
        set: function (value) {
            try {
                return JSON.parse(value);
            }
            catch (err) {
                return value;
            }
        },
        get: function (value) {
            return JSON.stringify(value);
        }
    },
    createdAt: {
        type: Date
    },
    lastUpdatedAt: {
        type: Date
    },
    fingerprint: {
        type: String,
        index: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});
LoggerSchema.set('versionKey', 'version');
LoggerSchema.pre('save', function (next) {
    const meta = this.meta;
    const fingerprintString = ((meta.ip_address || '') +
        (meta.browser_name || '') +
        (meta.browser_version || '') +
        (meta.os_name || '') +
        (meta.os_version || '') +
        (meta.device_name || '') +
        (meta.device_type || '') +
        (meta.resolution || '') +
        (meta.user_agent_source || ''));
    if (fingerprintString) {
        this.fingerprint = fingerprintString;
    }
    else {
        this.fingerprint = undefined; // or this.fingerprint = '';
    }
    next();
});
LoggerSchema.statics.build = async function (attrs) {
    const logs = new this(attrs);
    return logs.save();
};
LoggerSchema.pre('save', function (next) {
    const date = new Date();
    const currentDate = date.setHours(date.getHours() - 3 + date.getTimezoneOffset() / 60);
    if (!this.createdAt) {
        this.createdAt = new Date(currentDate);
    }
    this.lastUpdatedAt = new Date(currentDate);
    next();
});
LoggerSchema.pre('findOneAndUpdate', function (next) {
    const date = new Date();
    const currentDate = date.setHours(date.getHours() - 3 + date.getTimezoneOffset() / 60);
    this.updateOne({}, { $set: { lastUpdatedAt: new Date(currentDate) } });
    next();
});
LoggerSchema.statics.searchLogs = async function (options) {
    const { keyword, fromDateTime, toDateTime, page = 1, pageSize = 10 } = options;
    const queryBuilder = Logger.find();
    if (keyword) {
        const regex = new RegExp(`${keyword.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}`, "i");
        queryBuilder.where('description').regex(regex);
    }
    if (fromDateTime) {
        queryBuilder.where('createdAt').gte(fromDateTime.getTime());
    }
    if (toDateTime) {
        queryBuilder.where('createdAt').lte(toDateTime.getTime());
    }
    const totalRecordsQuery = Logger.find(queryBuilder.getFilter()).countDocuments();
    const totalRecords = await totalRecordsQuery.exec();
    const totalPages = Math.ceil(totalRecords / pageSize);
    queryBuilder.skip((page - 1) * pageSize).limit(pageSize);
    const logs = await queryBuilder.exec();
    const responseBody = {
        page,
        page_size: logs.length < 25 ? logs.length : pageSize,
        total_pages: totalPages,
        data: logs
    };
    return responseBody;
};
if (!process.env.MONGO_URI_LOGGER_MANAGER || !process.env.APP_SCENARIO_ENVIRONMENT) {
    throw new Error('You should define the environment variables: MONGO_URI_LOGGER_MANAGER and APP_SCENARIO_ENVIRONMENT');
}
const newMongoDBUrl = `${process.env.MONGO_URI_LOGGER_MANAGER}/${process.env.APP_SCENARIO_ENVIRONMENT}?retryWrites=true&w=majority`;
const newMongoose = mongoose_1.default.createConnection(newMongoDBUrl);
const Logger = newMongoose.model('Logger', LoggerSchema);
exports.Logger = Logger;
// Use the schema.plugin() function to add the updateIfCurrentPlugin
Logger.schema.plugin(mongoose_update_if_current_1.updateIfCurrentPlugin);
