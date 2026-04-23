import { pool } from '../config/db.js';

export const CategoryModel = {

  async getAll() {
    const result = await pool.query(
      'SELECT * FROM categories ORDER BY name ASC'
    );
    return result.rows;
  },

  // 🔍 SEARCH
  async searchByName(name) {
    const result = await pool.query(
      'SELECT * FROM categories WHERE name ILIKE $1',
      [`%${name}%`]
    );
    return result.rows;
  },

  // GET BY ID
  async getById(id) {
    const result = await pool.query(
      'SELECT * FROM categories WHERE id=$1',
      [id]
    );
    return result.rows[0];
  },

  // CREATE
  async create(name) {
    const result = await pool.query(
      'INSERT INTO categories (name) VALUES ($1) RETURNING *',
      [name]
    );
    return result.rows[0];
  },

  // UPDATE
  async update(id, name) {
    const result = await pool.query(
      'UPDATE categories SET name=$1 WHERE id=$2 RETURNING *',
      [name, id]
    );
    return result.rows[0];
  },

  // DELETE
  async delete(id) {
    await pool.query(
      'DELETE FROM categories WHERE id=$1',
      [id]
    );
  }

};