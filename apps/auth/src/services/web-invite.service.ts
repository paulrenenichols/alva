/**
 * @fileoverview Service for managing web app invites
 */

import crypto from 'crypto';
import { webInvites, type Database } from '@alva/database';
import { eq, sql } from 'drizzle-orm';

export class WebInviteService {
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
   * @param createdBy - Admin user ID creating the invite
   * @param expiryDays - Number of days until invite expires (default 7)
   * @returns The created invite record
   */
  async createInvite(email: string, createdBy: string, expiryDays: number = 7) {
    // Check if invite already exists and is still valid
    const [existing] = await this.database
      .select()
      .from(webInvites)
      .where(eq(webInvites.email, email))
      .limit(1);

    if (existing && !existing.usedAt && new Date(existing.expiresAt) > new Date()) {
      throw new Error('Invite already exists and is still valid');
    }

    const token = this.generateInviteToken();
    const expiresAt = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000);

    const [invite] = await this.database
      .insert(webInvites)
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
    const [invite] = await this.database.select().from(webInvites).where(eq(webInvites.token, token));

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
    return await this.database
      .update(webInvites)
      .set({ usedBy: userId, usedAt: new Date() })
      .where(eq(webInvites.token, token));
  }

  /**
   * @description Gets all invites with pagination
   * @param page - Page number (1-indexed)
   * @param limit - Number of invites per page
   */
  async getInvites(page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit;
    const result = await this.database.select().from(webInvites).limit(limit).offset(offset);

    const [{ count }] = await this.database.select({ count: sql<number>`count(*)` }).from(webInvites);

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
    const [invite] = await this.database.select().from(webInvites).where(eq(webInvites.id, inviteId));
    return invite;
  }
}

