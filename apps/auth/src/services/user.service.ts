/**
 * @fileoverview User service for managing user accounts, verification, and authentication
 */

import { eq } from 'drizzle-orm';
import { users, verificationTokens, refreshTokens } from '@alva/database';
import { Database } from '@alva/database';
import { randomBytes } from 'crypto';
import { createHash } from 'crypto';

export class UserService {
  constructor(private db: Database) {}

  async findUserByEmail(email: string) {
    return await this.db.query.users.findFirst({
      where: eq(users.email, email),
    });
  }

  async createUser(email: string) {
    const [user] = await this.db
      .insert(users)
      .values({
        email,
        emailVerified: false,
      })
      .returning();
    return user;
  }

  async createVerificationToken(userId: string) {
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await this.db.insert(verificationTokens).values({
      token,
      userId,
      expiresAt,
    });

    return token;
  }

  async verifyToken(token: string) {
    const verificationToken = await this.db.query.verificationTokens.findFirst({
      where: eq(verificationTokens.token, token),
    });

    if (!verificationToken || verificationToken.expiresAt < new Date()) {
      return null;
    }

    // Mark user as verified
    await this.db
      .update(users)
      .set({ emailVerified: true })
      .where(eq(users.id, verificationToken.userId));

    // Delete used token
    await this.db
      .delete(verificationTokens)
      .where(eq(verificationTokens.id, verificationToken.id));

    return verificationToken.userId;
  }

  async createRefreshToken(userId: string, token: string) {
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await this.db.insert(refreshTokens).values({
      tokenHash,
      userId,
      expiresAt,
    });
  }

  async validateRefreshToken(token: string) {
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const refreshToken = await this.db.query.refreshTokens.findFirst({
      where: eq(refreshTokens.tokenHash, tokenHash),
    });

    if (!refreshToken || refreshToken.expiresAt < new Date()) {
      return null;
    }

    return refreshToken.userId;
  }
}
