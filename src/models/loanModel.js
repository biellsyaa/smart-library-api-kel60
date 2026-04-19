const pool = require("../config/db");

const LoanModel = {
  // =========================
  // CREATE LOAN (BORROW BOOK)
  // =========================
  async createLoan(member_id, book_id) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // 1. cek buku
      const bookRes = await client.query(
        "SELECT available_copies FROM books WHERE id = $1",
        [book_id]
      );

      if (bookRes.rows.length === 0) {
        throw new Error("Buku tidak ditemukan");
      }

      if (bookRes.rows[0].available_copies <= 0) {
        throw new Error("Stok buku habis");
      }

      // 2. insert loan
      const loanRes = await client.query(
        `INSERT INTO loans (member_id, book_id, status, loan_date)
         VALUES ($1, $2, 'BORROWED', CURRENT_DATE)
         RETURNING *`,
        [member_id, book_id]
      );

      // 3. update stok
      await client.query(
        `UPDATE books 
         SET available_copies = available_copies - 1
         WHERE id = $1`,
        [book_id]
      );

      await client.query("COMMIT");

      return loanRes.rows[0];

    } catch (err) {
      await client.query("ROLLBACK");
      throw err;

    } finally {
      client.release();
    }
  },

  // =========================
  // RETURN BOOK
  // =========================
  async returnLoan(loan_id) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // 1. get loan
      const loanRes = await client.query(
        "SELECT * FROM loans WHERE id = $1",
        [loan_id]
      );

      if (loanRes.rows.length === 0) {
        throw new Error("Loan tidak ditemukan");
      }

      const loan = loanRes.rows[0];

      // 2. prevent double return
      if (loan.status !== "BORROWED") {
        throw new Error("Buku sudah dikembalikan atau status tidak valid");
      }

      // 3. update loan
      await client.query(
        `UPDATE loans 
         SET status = 'RETURNED', return_date = CURRENT_DATE
         WHERE id = $1`,
        [loan_id]
      );

      // 4. update book stock
      await client.query(
        `UPDATE books 
         SET available_copies = available_copies + 1
         WHERE id = $1`,
        [loan.book_id]
      );

      await client.query("COMMIT");

      return {
        message: "Buku berhasil dikembalikan"
      };

    } catch (err) {
      await client.query("ROLLBACK");
      throw err;

    } finally {
      client.release();
    }
  },

  // =========================
  // GET ALL LOANS
  // =========================
  async getAllLoans() {
    const result = await pool.query(
      `SELECT l.*, m.full_name, b.title
       FROM loans l
       JOIN members m ON l.member_id = m.id
       JOIN books b ON l.book_id = b.id
       ORDER BY l.loan_date DESC`
    );

    return result.rows;
  },

  // =========================
  // GET BY ID
  // =========================
  async getLoanById(id) {
    const result = await pool.query(
      `SELECT l.*, m.full_name, b.title
       FROM loans l
       JOIN members m ON l.member_id = m.id
       JOIN books b ON l.book_id = b.id
       WHERE l.id = $1`,
      [id]
    );

    return result.rows[0];
  }
};

module.exports = LoanModel;