/**
 * @fileoverview Admin user service for managing admin user accounts
 */

import { eq } from 'drizzle-orm';
import { adminUsers, adminRefreshTokens, adminPasswordResetTokens } from '@alva/database';
import { Database } from '@alva/database';
import { randomBytes } from 'crypto';
import { createHash } from 'crypto';

export class AdminUserService {
  constructor(private db: Database) {}

  /**
   * @description Finds an admin user by email
   */
  async findAdminUserByEmail(email: string) {
    const [user] = await this.db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, email))
      .limit(1);
    return user;
  }

  /**
   * @description Finds an admin user by ID
   */
  async findAdminUserById(id: string) {
    const [user] = await this.db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.id, id))
      .limit(1);
    return user;
  }

  /**
   * @description Creates a new admin user
   */
  async createAdminUser(email: string, passwordHash: string) {
    const [user] = await this.db
      .insert(adminUsers)
      .values({
        email,
        passwordHash,
        emailVerified: true,
        mustResetPassword: true,
      })
      .returning();
    return user;
  }

  /**
   * @description Creates a refresh token for an admin user
   */
  async createAdminRefreshToken(userId: string, token: string) {
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await this.db.insert(adminRefreshTokens).values({
      tokenHash,
      adminUserId: userId,
      expiresAt,
    });
  }

  /**
   * @description Validates a refresh token for an admin user
   */
  async validateAdminRefreshToken(token: string) {
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const refreshToken = await this.db.query.adminRefreshTokens.findFirst({
      where: eq(adminRefreshTokens.tokenHash, tokenHash),
    });

    if (!refreshToken || refreshToken.expiresAt < new Date()) {
      return null;
    }

    return refreshToken.adminUserId;
  }

  /**
   * @description Creates a password reset token for an admin user
   */
  async createAdminPasswordResetToken(userId: string) {
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.db.insert(adminPasswordResetTokens).values({
      token,
      adminUserId: userId,
      expiresAt,
    });

    return token;
  }

  /**
   * @description Updates an admin user's password
   */
  async updateAdminUserPassword(userId: string, passwordHash: string) {
    await this.db
      .update(adminUsers)
      .set({ 
        passwordHash,
        mustResetPassword: false,
        updatedAt: new Date(),
      })
      .where(eq(adminUsers.id, userId));
  }
}

