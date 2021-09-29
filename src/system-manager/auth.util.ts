import * as bcrypt from 'bcrypt';

export function hash(password: string) {
  return bcrypt.hashSync(password, 12);
}