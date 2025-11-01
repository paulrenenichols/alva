/**
 * @fileoverview Web user service for managing web app user accounts
 */

import { eq } from 'drizzle-orm';
import { webUsers, webRefreshTokens, webVerificationTokens } from '@alva/database';
import { Database } from '@alva/database';
import { randomBytes } from 'crypto';
import { createHash } from 'crypto';

export class WebUserService {
  constructor(private db: Database) {}

  /**
   * @description Finds a web user by email
   */
  async findWebUserByEmail(email: string) {
    const [user] = await this.db
      .select()
      .from(webUsers)
      .where(eq(webUsers.email, email))
      .limit(1);
    return user;
  }

  /**
   * @description Finds a web user by ID
   */
  async findWebUserById(id: string) {
    const [user] = await this.db
      .select()
      .from(webUsers)
      .where(eq(webUsers.id, id))
      .limit(1);
    return user;
  }

  /**
   * @description Creates a new web user
   */
  async createWebUser(email: string) {
    const [user] = await this.db
      .insert(webUsers)
      .values({
        email,
        emailVerified: false,
      })
      .returning();
    return user;
  }

  /**
   * @description Creates a verification token for a web user
   */
  async createWebVerificationToken(userId: string) {
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await this.db.insert(webVerificationTokens).values({
      token,
      webUserId: userId,
      expiresAt,
    });

    return token;
  }

  /**
   * @description Verifies a token and marks user as verified
   */
  async verifyWebToken(token: string) {
    const verificationToken = await this.db.query.webVerificationTokens.findFirst({
      where: eq(webVerificationTokens.token, token),
    });

    if (!verificationToken || verificationToken.expiresAt < new Date()) {
      return null;
    }

    // Mark user as verified
    await this.db
      .update(webUsers)
      .set({ emailVerified: true })
      .where(eq(webUsers.id, verificationToken.webUserId));

    // Delete used token
    await this.db
      .delete(webVerificationTokens)
      .where(eq(webVerificationTokens.id, verificationToken.id));

    return verificationToken.webUserId;
  }

  /**
   * @description Creates a refresh token for a web user
   */
  async createWebRefreshToken(userId: string, token: string) {
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await this.db.insert(webRefreshTokens).values({
      tokenHash,
      webUserId: userId,
      expiresAt,
    });
  }

  /**
   * @description Validates a refresh token for a web user
   */
  async validateWebRefreshToken(token: string) {
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const refreshToken = await this.db.query.webRefreshTokens.findFirst({
      where: eq(webRefreshTokens.tokenHash, tokenHash),
    });

    if (!refreshToken || refreshToken.expiresAt < new Date()) {
      return null;
    }

    return refreshToken.webUserId;
  }
}

