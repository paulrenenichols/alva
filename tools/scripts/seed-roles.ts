/**
 * @fileoverview Seed script to create initial user roles
 */

import { eq } from 'drizzle-orm';
import { createDbPool } from '../../libs/database/src/lib/database';
import { adminRoles, webRoles } from '../../libs/database/src/schemas';

const db = createDbPool(process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5433/alva');

export const INITIAL_ADMIN_ROLES = [
  {
    name: 'admin',
    description: 'Administrator with full system access',
  },
];

export const INITIAL_WEB_ROLES = [
  {
    name: 'user',
    description: 'Regular application user',
  },
];

/**
 * @description Seeds the database with initial roles
 */
export async function seedRoles() {
  console.log('🌱 Seeding user roles...');

  // Seed admin roles
  for (const roleData of INITIAL_ADMIN_ROLES) {
    // Check if role exists
    const [existing] = await db
      .select()
      .from(adminRoles)
      .where(eq(adminRoles.name, roleData.name))
      .limit(1);

    if (existing) {
      console.log(`Admin role "${roleData.name}" already exists, skipping...`);
      continue;
    }

    // Create role
    await db.insert(adminRoles).values(roleData);
    console.log(`✅ Created admin role: ${roleData.name}`);
  }

  // Seed web roles
  for (const roleData of INITIAL_WEB_ROLES) {
    // Check if role exists
    const [existing] = await db
      .select()
      .from(webRoles)
      .where(eq(webRoles.name, roleData.name))
      .limit(1);

    if (existing) {
      console.log(`Web role "${roleData.name}" already exists, skipping...`);
      continue;
    }

    // Create role
    await db.insert(webRoles).values(roleData);
    console.log(`✅ Created web role: ${roleData.name}`);
  }

  console.log('🎉 Role seeding complete!');
}

// Run if called directly
if (require.main === module) {
  seedRoles()
    .then(() => {
      console.log('✅ Seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error seeding roles:', error);
      process.exit(1);
    });
}

