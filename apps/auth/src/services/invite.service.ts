/**
 * @fileoverview Service for managing user invites in the authentication system
 */

import crypto from 'crypto';
import { invites, type Database } from '@alva/database';
import { eq, sql } from 'drizzle-orm';

export class InviteService {
  private readonly database: Database;

  constructor(database: Database) {
    this.database = database;
  }
  /**
   * @description Generates a random invite token
   * @returns A hex-encoded token string (64 characters)
   */
  generateInviteToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * @description Creates a new invite in the database
   * @param email - Email address to invite
   * @param createdBy - User ID of the admin creating the invite
   * @param expiryDays - Number of days until invite expires (default 7)
   * @returns The created invite record
   */
  async createInvite(email: string, createdBy: string, expiryDays: number = 7) {
    const token = this.generateInviteToken();
    const expiresAt = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000);

    const [invite] = await this.database
      .insert(invites)
      .values({
        email,
        token,
        createdBy,
        expiresAt,
      })
      .returning();

    return invite;
  }

  /**
   * @description Validates an invite token
   * @param token - Invite token to validate
   * @returns Validation result with invite data if valid
   */
  async validateInvite(token: string) {
    const [invite] = await this.database.select().from(invites).where(eq(invites.token, token));

    if (!invite) return { valid: false, error: 'Invalid invite token' };
    if (invite.usedAt) return { valid: false, error: 'Invite has already been used' };
    if (new Date(invite.expiresAt) < new Date()) return { valid: false, error: 'Invite has expired' };

    return { valid: true, invite };
  }

  /**
   * @description Marks an invite as used
   * @param token - Invite token to mark as used
   * @param userId - User ID who used the invite
   */
  async markInviteAsUsed(token: string, userId: string) {
    return await this.database.update(invites).set({ usedBy: userId, usedAt: new Date() }).where(eq(invites.token, token));
  }

  /**
   * @description Gets all invites with pagination
   * @param page - Page number (1-indexed)
   * @param limit - Number of invites per page
   */
  async getInvites(page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit;
    const result = await this.database.select().from(invites).limit(limit).offset(offset);

    const [{ count }] = await this.database.select({ count: sql<number>`count(*)` }).from(invites);

    return {
      invites: result,
      total: Number(count),
      page,
      limit,
      totalPages: Math.ceil(Number(count) / limit),
    };
  }

  /**
   * @description Gets a single invite by ID
   * @param inviteId - Invite ID
   */
  async getInviteById(inviteId: string) {
    const [invite] = await this.database.select().from(invites).where(eq(invites.id, inviteId));
    return invite;
  }
}

