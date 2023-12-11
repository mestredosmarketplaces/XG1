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
exports.Keyword = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const mongoose_update_if_current_1 = require("mongoose-update-if-current");
const uuid_1 = require("uuid");
;
;
;
const KeywordSchema = new mongoose_1.Schema({
    _id: { type: String, default: uuid_1.v4 },
    keyword: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    createdAt: {
        type: Date
    },
    lastUpdatedAt: {
        type: Date
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
KeywordSchema.set('versionKey', 'version');
KeywordSchema.statics.build = async (attrs) => {
    const keyword = new Keyword(Object.assign({}, attrs));
    await keyword.save();
    return keyword;
};
if (!process.env.MONGO_URI_LOGGER_MANAGER || !process.env.APP_SCENARIO_ENVIRONMENT) {
    throw new Error('You should define the environment variables: MONGO_URI_LOGGER_MANAGER and APP_SCENARIO_ENVIRONMENT');
}
const newMongoDBUrl = `${process.env.MONGO_URI_LOGGER_MANAGER}/${process.env.APP_SCENARIO_ENVIRONMENT}?retryWrites=true&w=majority`;
const newMongoose = mongoose_1.default.createConnection(newMongoDBUrl);
const Keyword = newMongoose.model('Keyword', KeywordSchema);
exports.Keyword = Keyword;
Keyword.schema.plugin(mongoose_update_if_current_1.updateIfCurrentPlugin);
