declare const logger: {
    error: (message: string, meta?: any) => void;
    warn: (message: string, meta?: any) => void;
    info: (message: string, meta?: any) => void;
    verbose: (message: string, meta?: any) => void;
    debug: (message: string, meta?: any) => void;
};
export default logger;
