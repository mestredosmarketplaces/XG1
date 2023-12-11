/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Document, Model } from "mongoose";
interface LoggerAttrs {
    level: string;
    message: string;
    meta: {
        ip_address?: string;
        correlation_id?: string;
        flow_id?: string;
        status_code?: number;
        route?: string;
        method?: string;
        browser_name?: string;
        browser_version?: string;
        os_name?: string;
        os_version?: string;
        device_name?: string;
        device_type?: string;
        resolution?: string;
        user_agent_source?: string;
        request_body?: string;
        request_response?: string;
        request_params?: string;
        application_name?: string;
        description?: string;
        url?: string;
        params?: {};
        query?: {};
        host?: string;
    };
    description: string;
}
interface LoggerDoc extends Document {
    level: string;
    message: string;
    meta: {
        ip_address?: string;
        correlation_id?: string;
        flow_id?: string;
        status_code?: number;
        route?: string;
        method?: string;
        browser_name?: string;
        browser_version?: string;
        os_name?: string;
        os_version?: string;
        device_name?: string;
        device_type?: string;
        resolution?: string;
        user_agent_source?: string;
        request_body?: string;
        request_response?: string;
        request_params?: string;
        application_name?: string;
        description?: string;
        url?: string;
        params?: {};
        query?: {};
        host?: string;
    };
    description: string;
    createdAt: Date;
    lastUpdatedAt: Date;
    version: number;
    fingerprint?: string;
}
interface LoggerModel extends Model<LoggerDoc> {
    build(attrs: LoggerAttrs): Promise<LoggerDoc>;
    searchLogs(options: {
        keyword?: string;
        fromDateTime?: Date;
        toDateTime?: Date;
        page?: number;
        pageSize?: number;
    }): Promise<any>;
}
declare const Logger: LoggerModel;
export { Logger };
