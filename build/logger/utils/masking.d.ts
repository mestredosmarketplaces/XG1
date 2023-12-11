import { LogDetail } from "./cleanedDescription";
declare const maskedLogging: (data: Record<string, any> | LogDetail) => Promise<any>;
export { maskedLogging };
