"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailableCombinationModel = void 0;
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
const AvailableCombinationSchema = new mongoose_1.Schema({
    _id: {
        type: String,
        default: uuid_1.v4
    },
    combination: {
        type: String,
        required: true,
        unique: true
    },
    used: {
        type: Boolean,
        default: false
    },
});
const AvailableCombinationModel = (0, mongoose_1.model)('AvailableCombination', AvailableCombinationSchema);
exports.AvailableCombinationModel = AvailableCombinationModel;
