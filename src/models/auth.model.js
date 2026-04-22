const pool = require('../config/db');

class AuthModel {
  static async createUser({ username, email, passwordHash, role }) {
    const query = `
      INSERT INTO users (username, email, password_hash, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, username, email, role, created_at
    `;
    const values = [username, email, passwordHash, role || 'client'];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findByEmail(email) {
    const query = `SELECT * FROM users WHERE email = $1`;
    const { rows } = await pool.query(query, [email]);
    return rows[0];
  }
}

module.exports = AuthModel;