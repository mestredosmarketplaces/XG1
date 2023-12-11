"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerSave = void 0;
const logs_schema_1 = require("../schemas/logs-schema");
const masking_1 = require("./masking");
const cleanedDescription_1 = require("./cleanedDescription");
const loggerSave = async (logInfo) => {
    const { level, message, metaJson, logDetail } = logInfo;
    let requestBodyMasked;
    let requestResponseMasked;
    let cleanedDescription;
    if (metaJson.requestBody) {
        requestBodyMasked = await (0, masking_1.maskedLogging)(metaJson.requestBody);
    }
    if (metaJson.requestResponse) {
        requestResponseMasked = await (0, masking_1.maskedLogging)(metaJson.requestResponse);
    }
    const maskedDescription = await (0, masking_1.maskedLogging)(logDetail);
    if (maskedDescription) {
        cleanedDescription = (0, cleanedDescription_1.cleanDescription)(maskedDescription);
    }
    try {
        logs_schema_1.Logger.build({
            level,
            message,
            meta: {
                ip_address: metaJson.ipAddress,
                status_code: metaJson.statusCode,
                route: metaJson.route,
                method: metaJson.method,
                browser_name: metaJson.browserName,
                browser_version: metaJson.browserVersion,
                os_name: metaJson.osName,
                os_version: metaJson.osVersion,
                device_name: metaJson.deviceName,
                device_type: metaJson.deviceType,
                resolution: metaJson.resolution,
                url: metaJson.url,
                params: metaJson.params,
                query: metaJson.query,
                host: metaJson.host,
                user_agent_source: JSON.stringify(metaJson.userAgentSource),
                request_body: JSON.stringify(requestBodyMasked || metaJson.requestBody),
                request_response: JSON.stringify(requestResponseMasked || metaJson.requestResponse),
                request_params: metaJson.requestParams,
                application_name: process.env.SERVICE_NAME || undefined,
            },
            description: cleanedDescription || ''
        });
    }
    catch (error) {
        console.error('Failed to save log:', error);
    }
};
exports.loggerSave = loggerSave;
