import { Request, Response, NextFunction } from 'express';
declare const logRequestInfo: (logMessage: string) => (req: Request, res: Response, next: NextFunction) => void;
export { logRequestInfo };
