import * as bcrypt from 'bcryptjs';

let argon2: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  argon2 = require('argon2');
} catch {
  // Fallback to bcrypt if argon2 native binary is not available on environment
}

export async function hashPassword(password: string): Promise<string> {
  if (argon2) {
    try {
      return await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 65536,
        timeCost: 3,
        parallelism: 4,
      });
    } catch {
      // If argon2 fails, fallback to bcrypt
    }
  }
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  if (hash.startsWith('$argon2') && argon2) {
    try {
      return await argon2.verify(hash, password);
    } catch {
      return false;
    }
  }
  return bcrypt.compare(password, hash);
}
