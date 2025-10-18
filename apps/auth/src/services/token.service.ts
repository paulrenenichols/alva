import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';

export interface TokenPayload {
  userId: string;
  email: string;
}

export class TokenService {
  private privateKey: string;
  private publicKey: string;

  constructor() {
    this.privateKey = process.env.JWT_PRIVATE_KEY!;
    this.publicKey = process.env.JWT_PUBLIC_KEY!;
  }

  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.privateKey, {
      algorithm: 'RS256',
      expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m'
    });
  }

  generateRefreshToken(): string {
    return randomBytes(32).toString('hex');
  }

  verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, this.publicKey, { algorithms: ['RS256'] }) as TokenPayload;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  verifyRefreshToken(token: string): boolean {
    // Additional validation logic can be added here
    return token.length === 64; // 32 bytes = 64 hex characters
  }
}
