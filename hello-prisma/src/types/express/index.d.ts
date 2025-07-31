import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      auth: JwtPayload & {
        sub?: string;
        email?: string;
        name?: string;
        [key: string]: any;
      };
    }
  }
}