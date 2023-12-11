import { randomBytes } from 'crypto';

const generateEncryptionKey = (): string => {
  const bytes = randomBytes(32); // 32 bytes é igual a 64 caracteres hexadecimais
  return bytes.toString('hex');
};

export { generateEncryptionKey }
