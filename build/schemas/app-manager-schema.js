"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppManager = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_update_if_current_1 = require("mongoose-update-if-current");
const uuid_1 = require("uuid");
const updateDates_1 = require("../utils/updateDates");
const generateUniqueAppName_1 = require("../utils/generateUniqueAppName");
const AppManagerSchema = new mongoose_1.default.Schema({
    _id: { type: String, default: uuid_1.v4 },
    app_name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
    },
    account_id: {
        type: String,
        required: true
    },
    git_url: {
        type: String
    },
    git_html_url: {
        type: String
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
AppManagerSchema.set('versionKey', 'version');
AppManagerSchema.plugin(mongoose_update_if_current_1.updateIfCurrentPlugin);
AppManagerSchema.statics.build = async (attrs) => {
    const generatedAppName = await (0, generateUniqueAppName_1.generateUniqueAppName)();
    const appManager = new AppManager({
        _id: (0, uuid_1.v4)(),
        app_name: generatedAppName,
        description: attrs.description,
        account_id: attrs.account_id
    });
    await appManager.save();
    return appManager;
};
AppManagerSchema.pre('save', updateDates_1.updateDates);
AppManagerSchema.pre('findOneAndUpdate', updateDates_1.updateDates);
const AppManager = mongoose_1.default.model('AppManager', AppManagerSchema);
exports.AppManager = AppManager;
