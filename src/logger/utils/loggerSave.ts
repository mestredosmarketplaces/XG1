import { Logger } from "../schemas/logs-schema";
import { maskedLogging } from "./masking";
import { LogDetail } from "./cleanedDescription";
import { cleanDescription } from "./cleanedDescription";

interface LoggerSaveInfo {
  level: string;
  message: string;
  metaJson: any; 
  logDetail: LogDetail
}

const loggerSave = async (logInfo: LoggerSaveInfo) => {
  const {
    level,
    message,
    metaJson,
    logDetail
  } = logInfo;

  let requestBodyMasked;
  let requestResponseMasked;
  let cleanedDescription;

  if(metaJson.requestBody) {
    requestBodyMasked = await maskedLogging(metaJson.requestBody);
  }

  if(metaJson.requestResponse) {
    requestResponseMasked = await maskedLogging(metaJson.requestResponse);
  }

  const maskedDescription = await maskedLogging(logDetail);

  if(maskedDescription) {
    cleanedDescription = cleanDescription(maskedDescription);
  }

  try {
    Logger.build({
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
  } catch (error) {
    console.error('Failed to save log:', error);
  }
};

export {loggerSave};
export { LoggerSaveInfo }