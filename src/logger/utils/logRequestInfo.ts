import { Request, Response, NextFunction } from 'express';
import logger from '../logger';

const logRequestInfo = (logMessage: string) => {
  return (req: Request, res: Response, next: NextFunction) => {

    logger.info(logMessage, { requestBody: req.body, ...req.requestHandledHeader });

    next();
  };
};

export { logRequestInfo };