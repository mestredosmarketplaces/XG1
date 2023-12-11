"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEncryptionKey = void 0;
const crypto_1 = require("crypto");
const generateEncryptionKey = () => {
    const bytes = (0, crypto_1.randomBytes)(32); // 32 bytes é igual a 64 caracteres hexadecimais
    return bytes.toString('hex');
};
exports.generateEncryptionKey = generateEncryptionKey;
