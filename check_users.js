const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'blogsphere',
    password: 'your_password', // Replace with your actual password
    port: 5432,
});

async function checkUserData() {
    try {
        const result = await pool.query('SELECT id, username, email, first_name, last_name, created_at FROM users LIMIT 5');
        console.log('Users in database:');
        result.rows.forEach((user, index) => {
            console.log(`User ${index + 1}:`);
            console.log(`  ID: ${user.id}`);
            console.log(`  Username: ${user.username}`);
            console.log(`  Email: ${user.email}`);
            console.log(`  First Name: ${user.first_name}`);
            console.log(`  Last Name: ${user.last_name}`);
            console.log(`  Created At: ${user.created_at}`);
            console.log('---');
        });
    } catch (error) {
        console.error('Database query failed:', error);
    } finally {
        await pool.end();
    }
}

checkUserData();

