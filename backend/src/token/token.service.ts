import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import jwt from 'jsonwebtoken';

export interface TokenPayload {
  _id: string;
  role: string;
}

@Injectable()
export class TokenService {
  constructor(private configService: ConfigService) {}

  generateToken(payload: TokenPayload) {
    const secret = this.configService.get<string>('JWT_SECRET') as string;
    const expiresIn =
      this.configService.get<string>('JWT_EXPIRES_IN') ||
      ('1h' as string | any);

    if (!secret) throw new Error('JWT_SECRET is not defined in .env');

    return jwt.sign(payload, secret, { expiresIn });
  }

  verifyToken(token: string) {
    const secret = this.configService.get<string>('JWT_SECRET');
    if (!secret) throw new Error('JWT_SECRET is not defined in .env');

    try {
      return jwt.verify(token, secret) as TokenPayload;
    } catch (error) {
      return null;
    }
  }
}
