import bycript from 'bcryptjs';

export const checkPassword = (password: string, passwordHash: string): Promise<boolean> => {
  return bycript.compare(password, passwordHash);
}