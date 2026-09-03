import { describe, it, expect } from 'vitest';
import { generateToken, verifyToken } from '../utils/jwt';

describe('JWT Utility', () => {
  it('harus membuat token valid dan mengekstrak payload-nya', () => {
    const payload = {
      userId: 'test-user-uuid-123',
      email: 'admin@smkn1pakuanratu.sch.id',
      role: 'SUPER_ADMIN',
      name: 'Super Admin',
    };

    const token = generateToken(payload);
    expect(typeof token).toBe('string');

    const decoded = verifyToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.userId).toBe(payload.userId);
    expect(decoded?.email).toBe(payload.email);
    expect(decoded?.role).toBe(payload.role);
  });

  it('harus mengembalikan null untuk token yang rusak', () => {
    const decoded = verifyToken('invalid.jwt.token');
    expect(decoded).toBeNull();
  });
});
