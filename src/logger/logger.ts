import { transports, createLogger, format } from 'winston';
import { loggerSave, LoggerSaveInfo } from "./utils/loggerSave";
import { LogDetail } from "./utils/cleanedDescription";
import { format as dateFnsFormat, subHours } from 'date-fns';

const logFormat = format.combine(
  format.timestamp({ 
    format: () => dateFnsFormat(subHours(new Date(), 3), 'EEE, MMM dd, yyyy, h:mm:ss a')
  }),
  format.printf(({ level, message, timestamp, ...meta }) => {
    const logData = {
      level,
      message,
      timestamp,
      ...meta, // Winston já formata os metadados corretamente como JSON
    };
    const logMessage = `${level}: ${message} at ${timestamp}`;
    return `${logMessage} ${JSON.stringify(logData)}`;
  })
);

const customLogger = createLogger({
  transports: [
    new transports.Console({
      format: logFormat
    })
  ]
});

async function processAndSaveLog(level: string, message: string, splat: any) {
  try {
    const validLevels = ['error', 'warn', 'info', 'verbose', 'debug'];

    if (validLevels.includes(level)) {
      // Save the log asynchronously
      const logDetail: LogDetail = {
        level,
        message,
        meta: splat || {}
      };

      // Save the log asynchronously
      const metaJson =  typeof(logDetail.meta) === 'string' ? JSON.parse(logDetail.meta) : logDetail.meta;

      const logInfo: LoggerSaveInfo = {
        level,
        message,
        metaJson,
        logDetail
      };

      loggerSave(logInfo);

      if (process.env.APP_SCENARIO_ENVIRONMENT === 'hom' || process.env.APP_SCENARIO_ENVIRONMENT === 'dev') {
        // Use a dynamic function call based on the log level
        customLogger.log({ level, message, ...splat });
      }
    } else {
      console.error('Invalid log level:', level);
    }
  } catch (error) {
    console.error('Failed to process and save log:', error);
  }
}

const logger = {
  error: (message: string, meta?: any) => {
    processAndSaveLog('error', message, meta);
  },
  warn: (message: string, meta?: any) => {
    processAndSaveLog('warn', message, meta);
  },
  info: (message: string, meta?: any) => {
    processAndSaveLog('info', message, meta);
  },
  verbose: (message: string, meta?: any) => {
    processAndSaveLog('verbose', message, meta);
  },
  debug: (message: string, meta?: any) => {
    processAndSaveLog('debug', message, meta);
  },
};

export default logger;