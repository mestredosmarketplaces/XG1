import { LogDetail } from "./cleanedDescription";
interface LoggerSaveInfo {
    level: string;
    message: string;
    metaJson: any;
    logDetail: LogDetail;
}
declare const loggerSave: (logInfo: LoggerSaveInfo) => Promise<void>;
export { loggerSave };
export { LoggerSaveInfo };
