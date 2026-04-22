const pool = require('../config/db');

class UserController {
  static async getMyStats(req, res) {
    try {
      const query = `
        SELECT 
          u.id,
          u.username,
          COUNT(p.id)::int AS "productsCount"
        FROM users u
        LEFT JOIN products p ON p.created_by = u.id
        WHERE u.id = $1
        GROUP BY u.id, u.username
      `;

      const { rows } = await pool.query(query, [req.user.id]);

      if (!rows[0]) {
        return res.status(404).json({
          message: 'Usuario no encontrado'
        });
      }

      return res.status(200).json(rows[0]);
    } catch (error) {
      return res.status(500).json({
        message: 'Error interno',
        error: error.message
      });
    }
  }
}

module.exports = UserController;