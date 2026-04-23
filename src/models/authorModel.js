import { pool } from '../config/db.js';

export const AuthorModel = {

  // GET ALL
  async getAll() {
    const result = await pool.query(
      'SELECT * FROM authors ORDER BY name ASC'
    );
    return result.rows;
  },

  // 🔍 SEARCH BY NAME
  async searchByName(name) {
    const result = await pool.query(
      'SELECT * FROM authors WHERE name ILIKE $1',
      [`%${name}%`]
    );
    return result.rows;
  },

  // GET BY ID
  async getById(id) {
    const result = await pool.query(
      'SELECT * FROM authors WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },

  // CREATE
  async create(name, nationality) {
    const result = await pool.query(
      `INSERT INTO authors (name, nationality)
       VALUES ($1, $2) RETURNING *`,
      [name, nationality]
    );
    return result.rows[0];
  },

  // UPDATE
  async update(id, name, nationality) {
    const result = await pool.query(
      `UPDATE authors 
       SET name=$1, nationality=$2 
       WHERE id=$3 RETURNING *`,
      [name, nationality, id]
    );
    return result.rows[0];
  },

  // DELETE
  async delete(id) {
    await pool.query(
      'DELETE FROM authors WHERE id=$1',
      [id]
    );
  }

};