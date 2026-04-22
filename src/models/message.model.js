const pool = require('../config/db');

class MessageModel {
  static async create({ user_id, username, text }) {
    const query = `
      INSERT INTO messages (user_id, username, text)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [user_id, username, text];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async getLast10() {
    const query = `
      SELECT id, user_id, username, text, created_at
      FROM messages
      ORDER BY created_at DESC
      LIMIT 10;
    `;
    const { rows } = await pool.query(query);
    return rows.reverse();
  }
}

module.exports = MessageModel;