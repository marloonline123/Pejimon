import "dotenv/config";
import pg from "pg";
async function run() {
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
    const client = await pool.connect();
    const tables = [
        "projects",
        "teams",
        "team_users",
        "tasks",
        "task_assignments",
        "task_dependencies",
        "milestones",
        "comments",
        "attachments",
        "time_entries",
        "clients",
        "project_clients",
        "client_approvals",
        "conversations",
        "conversation_members",
        "messages",
        "notifications",
        "activities",
        "project_templates",
        "template_milestones",
        "template_tasks",
    ];
    console.log("🔄 Syncing PostgreSQL sequences...");
    for (const table of tables) {
        try {
            const res = await client.query(`
        SELECT setval(
          pg_get_serial_sequence('"${table}"', 'id'),
          COALESCE((SELECT MAX(id) FROM "${table}"), 0) + 1,
          false
        );
      `);
            console.log(`   ✅ Synced sequence for ${table} -> nextval will start at ${res.rows[0].setval}`);
        }
        catch (e) {
            console.log(`   ⏭️ Skipped ${table}: ${e.message}`);
        }
    }
    console.log("✨ Done!");
    client.release();
    await pool.end();
}
run();
//# sourceMappingURL=sync-sequences.js.map