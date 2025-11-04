const {Pool} = require('pg');
const bcrypt = require('bcrypt');

const url = `postgresql://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_ENDPOINT}:5432/alva`;
const pool = new Pool({connectionString: url, ssl: {rejectUnauthorized: false}});

const ADMIN_EMAILS = [
  'nicholaspino209@gmail.com',
  'paul.rene.nichols@gmail.com',
];

const DEFAULT_PASSWORD = 'admin';

async function seedAdmins() {
  try {
    console.log('🌱 Seeding admin users...');

    // Check/Get admin role
    const roleResult = await pool.query('SELECT id FROM admin_roles WHERE name=$1', ['admin']);
    let roleId;

    if (!roleResult.rows[0]) {
      console.log('Creating admin role...');
      const newRoleResult = await pool.query(
        'INSERT INTO admin_roles (name, description) VALUES($1, $2) RETURNING id',
        ['admin', 'Administrator with full system access']
      );
      roleId = newRoleResult.rows[0].id;
      console.log('✅ Created admin role');
    } else {
      roleId = roleResult.rows[0].id;
      console.log('✅ Admin role exists');
    }

    // Create each admin
    for (const email of ADMIN_EMAILS) {
      // Check if admin user exists
      const existing = await pool.query('SELECT id FROM admin_users WHERE email=$1', [email]);

      if (existing.rows[0]) {
        console.log(`Admin user "${email}" already exists, checking admin role...`);
        
        // Ensure user has admin role
        const userRole = await pool.query(
          'SELECT id FROM admin_user_roles WHERE admin_user_id=$1 AND role_id=$2',
          [existing.rows[0].id, roleId]
        );

        if (!userRole.rows[0]) {
          await pool.query(
            'INSERT INTO admin_user_roles (admin_user_id, role_id) VALUES($1, $2)',
            [existing.rows[0].id, roleId]
          );
          console.log(`✅ Added admin role to existing user: ${email}`);
        } else {
          console.log(`✅ Admin user "${email}" already has admin role`);
        }
        continue;
      }

      // Hash password
      const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);

      // Create admin user
      const user = await pool.query(
        'INSERT INTO admin_users (email, password_hash, email_verified, must_reset_password) VALUES($1, $2, $3, $4) RETURNING id',
        [email, passwordHash, true, true]
      );

      // Assign admin role
      await pool.query(
        'INSERT INTO admin_user_roles (admin_user_id, role_id) VALUES($1, $2)',
        [user.rows[0].id, roleId]
      );

      console.log(`✅ Created admin user: ${email}`);
    }

    console.log('🎉 Admin seeding complete!');
    console.log('\n📋 Default admin credentials:');
    ADMIN_EMAILS.forEach(email => console.log(`Email: ${email}`));
    console.log('Password: "admin" (must be reset on first login)');
    
    await pool.end();
    process.exit(0);
  } catch (e) {
    console.error('❌ Seeding failed:', e.message);
    console.error(e.stack);
    await pool.end();
    process.exit(1);
  }
}

seedAdmins();
