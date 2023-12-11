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
import mongoose from "mongoose";
interface CipherKeysAttrs {
    app_name: string;
    encryption_key: string;
    effective_date: number;
    expiry_date: number;
}
interface CipherKeysDoc extends mongoose.Document {
    app_name: string;
    encryption_key: string;
    effective_date: number;
    expiry_date: number;
    version: number;
    createdAt: Date;
    lastUpdatedAt: Date;
}
interface CipherKeysModel extends mongoose.Model<CipherKeysDoc> {
    build(attrs: CipherKeysAttrs): Promise<CipherKeysDoc>;
}
declare const CipherKeys: CipherKeysModel;
export { CipherKeys };
