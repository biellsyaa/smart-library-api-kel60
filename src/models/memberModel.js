import { pool } from '../config/db.js';

export const MemberModel = {

  async getAll() {
    const result = await pool.query(
      'SELECT * FROM members ORDER BY joined_at DESC'
    );
    return result.rows;
  },

  // 🔍 OPTIONAL SEARCH
  async search(name, email) {
    let query = 'SELECT * FROM members WHERE 1=1';
    let values = [];

    if (name) {
      values.push(`%${name}%`);
      query += ` AND full_name ILIKE $${values.length}`;
    }

    if (email) {
      values.push(`%${email}%`);
      query += ` AND email ILIKE $${values.length}`;
    }

    const result = await pool.query(query, values);
    return result.rows;
  },

  // GET BY ID
  async getById(id) {
    const result = await pool.query(
      'SELECT * FROM members WHERE id=$1',
      [id]
    );
    return result.rows[0];
  },

  // CREATE
  async create(data) {
    const { full_name, email, member_type } = data;

    const result = await pool.query(
      `INSERT INTO members (full_name, email, member_type)
       VALUES ($1, $2, $3) RETURNING *`,
      [full_name, email, member_type]
    );

    return result.rows[0];
  },

  // UPDATE
  async update(id, data) {
    const { full_name, email, member_type } = data;

    const result = await pool.query(
      `UPDATE members 
       SET full_name=$1, email=$2, member_type=$3 
       WHERE id=$4 RETURNING *`,
      [full_name, email, member_type, id]
    );

    return result.rows[0];
  },

  // DELETE
  async delete(id) {
    await pool.query(
      'DELETE FROM members WHERE id=$1',
      [id]
    );
  }

};