/**
 * @fileoverview Seed script to create initial user roles
 */

import { db } from '@alva/database';
import { roles } from '@alva/database/schemas';
import { eq } from 'drizzle-orm';

export const INITIAL_ROLES = [
  {
    name: 'admin',
    description: 'Administrator with full system access',
  },
  {
    name: 'app_user',
    description: 'Regular application user',
  },
];

/**
 * @description Seeds the database with initial roles
 */
export async function seedRoles() {
  console.log('🌱 Seeding user roles...');

  for (const roleData of INITIAL_ROLES) {
    // Check if role exists
    const [existing] = await db
      .select()
      .from(roles)
      .where(eq(roles.name, roleData.name))
      .limit(1);

    if (existing) {
      console.log(`Role "${roleData.name}" already exists, skipping...`);
      continue;
    }

    // Create role
    await db.insert(roles).values(roleData);
    console.log(`✅ Created role: ${roleData.name}`);
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

