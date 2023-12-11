export interface LogDetail {
    level: string;
    message: any;
    meta: any;
}
export declare const cleanDescription: (logDetail: any) => string;
