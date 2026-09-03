import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from '../utils/password';

describe('Password Utility', () => {
  it('harus menghasilkan hash yang valid dan memverifikasinya dengan benar', async () => {
    const rawPassword = 'PasswordRahasia123!';
    const hash = await hashPassword(rawPassword);

    expect(hash).toBeDefined();
    expect(hash).not.toBe(rawPassword);

    const isValid = await verifyPassword(rawPassword, hash);
    expect(isValid).toBe(true);

    const isInvalid = await verifyPassword('PasswordSalah', hash);
    expect(isInvalid).toBe(false);
  });
});
