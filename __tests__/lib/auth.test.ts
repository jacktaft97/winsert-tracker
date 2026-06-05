jest.mock('next/headers', () => ({ cookies: jest.fn() }));
jest.mock('next/navigation', () => ({ redirect: jest.fn() }));

import { isValidPassword } from '@/lib/auth';

describe('isValidPassword', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv, ADMIN_PASSWORD: 'correct-horse-battery' };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('returns true when input matches ADMIN_PASSWORD', () => {
    expect(isValidPassword('correct-horse-battery')).toBe(true);
  });

  it('returns false when input does not match', () => {
    expect(isValidPassword('wrong')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(isValidPassword('')).toBe(false);
  });
});
