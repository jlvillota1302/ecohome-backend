const pool = require('../config/db');

class ProductModel {
  static async getAll() {
    const query = `
      SELECT 
        p.id,
        p.name,
        p.price,
        p.created_at,
        p.updated_at,
        p.created_by,
        u.username AS creator_username
      FROM products p
      LEFT JOIN users u ON p.created_by = u.id
      ORDER BY p.id
    `;
    const { rows } = await pool.query(query);
    return rows;
  }

  static async getById(id) {
    const query = `
      SELECT 
        p.id,
        p.name,
        p.price,
        p.created_at,
        p.updated_at,
        p.created_by,
        u.username AS creator_username
      FROM products p
      LEFT JOIN users u ON p.created_by = u.id
      WHERE p.id = $1
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async create({ name, price, created_by }) {
    const query = `
      INSERT INTO products (name, price, created_by)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const { rows } = await pool.query(query, [name, price, created_by]);
    return rows[0];
  }

  static async update(id, { name, price }) {
    const query = `
      UPDATE products
      SET name = $1,
          price = $2,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `;
    const { rows } = await pool.query(query, [name, price, id]);
    return rows[0];
  }

  static async remove(id) {
    const query = `
      DELETE FROM products
      WHERE id = $1
      RETURNING *
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
}

module.exports = ProductModel;