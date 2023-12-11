"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CipherManager = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_update_if_current_1 = require("mongoose-update-if-current");
const uuid_1 = require("uuid");
const updateDates_1 = require("../utils/updateDates");
const CipherManagerSchema = new mongoose_1.default.Schema({
    _id: { type: String, default: uuid_1.v4 },
    app_name: {
        type: String,
        required: true
    },
    encryption_key: {
        type: String,
        required: true
    },
    effective_date: {
        type: Number,
        required: true
    },
    expiry_date: {
        type: Number,
        required: true
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
CipherManagerSchema.set('versionKey', 'version');
CipherManagerSchema.plugin(mongoose_update_if_current_1.updateIfCurrentPlugin);
//index
CipherManagerSchema.index({ app_name: 1 });
CipherManagerSchema.index({ encryption_key: 1 });
CipherManagerSchema.index({ app_name: 1, effective_date: 1 });
CipherManagerSchema.index({ app_name: 1, expiry_date: 1 });
CipherManagerSchema.index({ app_name: 1, effective_date: 1, expiry_date: 1 });
CipherManagerSchema.statics.build = async (attrs) => {
    const cipherManager = new CipherManager({
        _id: (0, uuid_1.v4)(),
        app_name: attrs.app_name,
        encryption_key: attrs.encryption_key,
        effective_date: attrs.effective_date,
        expiry_date: attrs.expiry_date
    });
    await cipherManager.save();
    return cipherManager;
};
CipherManagerSchema.pre('save', updateDates_1.updateDates);
CipherManagerSchema.pre('findOneAndUpdate', updateDates_1.updateDates);
const CipherManager = mongoose_1.default.model('CipherManager', CipherManagerSchema);
exports.CipherManager = CipherManager;
