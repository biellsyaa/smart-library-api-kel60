import { pool } from '../config/db.js';

export const LoanModel = {

  async createLoan(book_id, member_id, due_date) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // 1. cek buku ada atau tidak
      const bookCheck = await client.query(
        'SELECT available_copies FROM books WHERE id = $1',
        [book_id]
      );

      if (bookCheck.rows.length === 0) {
        throw new Error('Buku tidak ditemukan.');
      }

      if (bookCheck.rows[0].available_copies <= 0) {
        throw new Error('Buku sedang tidak tersedia (stok habis).');
      }

      // 2. kurangi stok
      await client.query(
        'UPDATE books SET available_copies = available_copies - 1 WHERE id = $1',
        [book_id]
      );

      // 3. insert loan
      const insertResult = await client.query(
        `INSERT INTO loans (book_id, member_id, due_date)
         VALUES ($1, $2, $3) RETURNING *`,
        [book_id, member_id, due_date]
      );

      const loanId = insertResult.rows[0].id;

      // 4. ambil data lengkap (JOIN)
      const result = await client.query(
        `SELECT l.*, b.title as book_title, m.full_name as member_name
         FROM loans l
         JOIN books b ON l.book_id = b.id
         JOIN members m ON l.member_id = m.id
         WHERE l.id = $1`,
        [loanId]
      );

      await client.query('COMMIT');
      return result.rows[0];

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  async getAllLoans() {
    const result = await pool.query(
      `SELECT l.*, b.title as book_title, m.full_name as member_name
       FROM loans l
       JOIN books b ON l.book_id = b.id
       JOIN members m ON l.member_id = m.id`
    );
    return result.rows;
  },

  // RETURN BOOK
  async returnBook(loan_id) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // 1. cek loan
      const loanCheck = await client.query(
        'SELECT * FROM loans WHERE id = $1',
        [loan_id]
      );

      if (loanCheck.rows.length === 0) {
        throw new Error('Data peminjaman tidak ditemukan.');
      }

      if (loanCheck.rows[0].status !== 'BORROWED') {
        throw new Error('Buku sudah dikembalikan.');
      }

      const book_id = loanCheck.rows[0].book_id;

      // 2. update loan
      const updateLoan = await client.query(
        `UPDATE loans
         SET status = 'RETURNED', return_date = NOW()
         WHERE id = $1
         RETURNING *`,
        [loan_id]
      );

      // 3. tambah stok
      await client.query(
        'UPDATE books SET available_copies = available_copies + 1 WHERE id = $1',
        [book_id]
      );

      await client.query('COMMIT');
      return updateLoan.rows[0];

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

};