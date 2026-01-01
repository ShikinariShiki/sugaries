// Script to restore letter ownership
// Run with: node restore_letters.js

require('dotenv').config();
const { Client } = require('pg');

async function restoreLetters() {
    const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL;

    if (!connectionString) {
        console.error('❌ No database connection string found!');
        console.log('Please check your .env.local file for DATABASE_URL or DIRECT_URL');
        process.exit(1);
    }

    console.log('🔗 Connecting to database...');

    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('✅ Connected to database');

        // First, show current state
        const beforeResult = await client.query(`
      SELECT id, "recipientName", "userId" 
      FROM "Letter" 
      WHERE "userId" IS NULL
    `);

        console.log(`\n📊 Found ${beforeResult.rows.length} orphaned letters (no userId):`);
        beforeResult.rows.forEach(row => {
            console.log(`   - ${row.recipientName} (${row.id})`);
        });

        if (beforeResult.rows.length === 0) {
            console.log('\n✨ No orphaned letters found. All letters are already linked!');
            return;
        }

        // Update orphaned letters
        const updateResult = await client.query(`
      UPDATE "Letter"
      SET "userId" = 'cmiycb56p0000hqr6woyrwic7'
      WHERE "userId" IS NULL
      RETURNING id, "recipientName"
    `);

        console.log(`\n✅ Successfully restored ${updateResult.rowCount} letters!`);
        updateResult.rows.forEach(row => {
            console.log(`   ✓ ${row.recipientName}`);
        });

        // Verify
        const afterResult = await client.query(`
      SELECT COUNT(*) as count FROM "Letter" WHERE "userId" = 'cmiycb56p0000hqr6woyrwic7'
    `);
        console.log(`\n📬 Total letters now linked to your account: ${afterResult.rows[0].count}`);
        console.log('\n🎉 Done! Refresh your dashboard to see the letters.');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.end();
    }
}

restoreLetters();
