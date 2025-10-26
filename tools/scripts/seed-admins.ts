/**
 * @fileoverview Seed script to create initial admin users
 */

import { eq, and } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { createDbPool } from '../../libs/database/src/lib/database';
import { users, roles, userRoles } from '../../libs/database/src/schemas';

const db = createDbPool(process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5433/alva');

const ADMIN_EMAILS = [
  'nicholaspino209@gmail.com',
  'paul.rene.nichols@gmail.com',
];

const DEFAULT_PASSWORD = 'admin';

/**
 * @description Seeds the database with initial admin users
 */
export async function seedAdmins() {
  console.log('🌱 Seeding admin users...');

  // Get admin role
  const [adminRole] = await db
    .select()
    .from(roles)
    .where(eq(roles.name, 'admin'))
    .limit(1);

  if (!adminRole) {
    throw new Error('❌ Admin role not found. Run "pnpm seed:roles" first.');
  }

  console.log(`Found admin role: ${adminRole.id}`);

  // Create each admin
  for (const email of ADMIN_EMAILS) {
    // Check if user exists
    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existing) {
      console.log(`User "${email}" already exists, checking admin role...`);

      // Ensure user has admin role
      const [userRole] = await db
        .select()
        .from(userRoles)
        .where(and(eq(userRoles.userId, existing.id), eq(userRoles.roleId, adminRole.id)))
        .limit(1);

      if (!userRole) {
        await db.insert(userRoles).values({
          userId: existing.id,
          roleId: adminRole.id,
        });
        console.log(`✅ Added admin role to existing user: ${email}`);
      } else {
        console.log(`User "${email}" already has admin role`);
      }
      continue;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);

    // Create user
    const [user] = await db
      .insert(users)
      .values({
        email,
        passwordHash,
        emailVerified: true,
        mustResetPassword: true, // Force password reset on first login
      })
      .returning();

    // Assign admin role
    await db.insert(userRoles).values({
      userId: user.id,
      roleId: adminRole.id,
    });

    console.log(`✅ Created admin user: ${email}`);
  }

  console.log('🎉 Admin seeding complete!');
  console.log('\n📋 Default admin credentials:');
  console.log(`Email: ${ADMIN_EMAILS[0]}`);
  console.log(`Email: ${ADMIN_EMAILS[1]}`);
  console.log('Password: "admin" (must be reset on first login)');
  console.log('\n⚠️  IMPORTANT: Change passwords after first login!');
}

// Run if called directly
if (require.main === module) {
  seedAdmins()
    .then(() => {
      console.log('\n✅ Seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error seeding admins:', error);
      process.exit(1);
    });
}

