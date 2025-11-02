/**
 * @fileoverview Token service for generating and validating JWT tokens and refresh tokens
 */

import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';

export interface TokenPayload {
  userId: string;
  email: string;
  userType: 'admin' | 'web';
}

export class TokenService {
  private algorithm: 'RS256' | 'HS256';
  private signKey: string;
  private verifyKey: string;

  constructor() {
    const privateKey = process.env['JWT_PRIVATE_KEY'];
    const publicKey = process.env['JWT_PUBLIC_KEY'];
    const hmacSecret = process.env['JWT_SECRET'];

    if (privateKey && publicKey) {
      this.algorithm = 'RS256';
      this.signKey = privateKey;
      this.verifyKey = publicKey;
    } else if (hmacSecret) {
      this.algorithm = 'HS256';
      this.signKey = hmacSecret;
      this.verifyKey = hmacSecret;
    } else {
      throw new Error('JWT configuration missing. Provide JWT_PRIVATE_KEY/JWT_PUBLIC_KEY or JWT_SECRET');
    }
  }

  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.signKey, {
      algorithm: this.algorithm,
      expiresIn: process.env['JWT_ACCESS_EXPIRY'] || '15m',
    } as any);
  }

  generateRefreshToken(): string {
    return randomBytes(32).toString('hex');
  }

  verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, this.verifyKey, { algorithms: [this.algorithm] }) as TokenPayload;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  verifyRefreshToken(token: string): boolean {
    // Additional validation logic can be added here
    return token.length === 64; // 32 bytes = 64 hex characters
  }
}
