"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.maskedLogging = void 0;
const keyword_schema_1 = require("../schemas/keyword-schema");
const logger_1 = __importDefault(require("../logger"));
const maskDataObject = async (data, registeredAttributes) => {
    try {
        const keysToMask = Object.keys(data).filter((key) => registeredAttributes.some((obj) => obj.keyword === key));
        for (const key of keysToMask) {
            const keywordEntry = registeredAttributes.find((obj) => obj.keyword === key);
            if (keywordEntry) {
                data[key] =
                    data[key].length > 8
                        ? data[key].substring(0, 3) + '*'.repeat(data[key].length - 5) + data[key].slice(-2)
                        : data[key][0] + '*'.repeat(data[key].length - 1);
            }
        }
    }
    catch (err) {
        logger_1.default.error(`It is not possible to parse maskDataObject: ${err}`);
    }
};
const getRegisteredAttributes = async (data) => {
    const keywordList = Object.keys(data);
    const registeredAttributes = await keyword_schema_1.Keyword.find({ keyword: { $in: keywordList } });
    return registeredAttributes;
};
const modifyData = async (data, processedObjects = new Set()) => {
    try {
        if (processedObjects.has(data)) {
            return data;
        }
        processedObjects.add(data);
        if (typeof (data) === 'string') {
            return data;
        }
        if ('_doc' in data) {
            const modifiedData = Object.assign({}, data._doc);
            const registeredAttributes = await getRegisteredAttributes(modifiedData);
            await maskDataObject(modifiedData, registeredAttributes);
            return modifiedData;
        }
        else if ('data' in data) {
            const modifiedData = Object.assign({}, data);
            if (Array.isArray(modifiedData.data)) {
                for (let i = 0; i < modifiedData.data.length; i++) {
                    modifiedData.data[i] = await modifyData(modifiedData.data[i], processedObjects);
                }
            }
            const registeredAttributes = await getRegisteredAttributes(modifiedData);
            await maskDataObject(modifiedData, registeredAttributes);
            return modifiedData;
        }
        else {
            const modifiedData = Object.assign({}, data);
            const registeredAttributes = await getRegisteredAttributes(modifiedData);
            await maskDataObject(modifiedData, registeredAttributes);
            return modifiedData;
        }
    }
    catch (err) {
        logger_1.default.error(`It is not possible to modify data do maske it: ${err}`);
    }
};
const maskedLogging = async (data) => {
    try {
        if (!data) {
            return;
        }
        const { level, message } = data;
        if (!data.meta) {
            const modifiedData = await modifyData(data, new Set());
            return modifiedData;
        }
        if (data.meta) {
            const metaJsonOriginal = typeof data.meta === 'string' ? JSON.parse(data.meta) : data.meta;
            if (metaJsonOriginal.requestBody) {
                const requestBody = await modifyData(metaJsonOriginal.requestBody, new Set());
                const metaJson = JSON.stringify(Object.assign(Object.assign({}, metaJsonOriginal), { requestBody }));
                return { level, message, metaJson };
            }
            if (metaJsonOriginal.requestResponse) {
                const requestResponse = await modifyData(metaJsonOriginal.requestResponse, new Set());
                const metaJson = JSON.stringify(Object.assign(Object.assign({}, metaJsonOriginal), { requestResponse }));
                return { level, message, metaJson };
            }
            if (metaJsonOriginal.requestBody && metaJsonOriginal.requestResponse) {
                const requestResponse = await modifyData(metaJsonOriginal.requestResponse, new Set());
                const requestBody = await modifyData(metaJsonOriginal.requestBody, new Set());
                const metaJson = JSON.stringify(Object.assign(Object.assign({}, metaJsonOriginal), { requestResponse, requestBody }));
                return { level, message, metaJson };
            }
            return data;
        }
    }
    catch (err) {
        logger_1.default.error(`It is not possible to mask log: ${err}`);
    }
};
exports.maskedLogging = maskedLogging;
