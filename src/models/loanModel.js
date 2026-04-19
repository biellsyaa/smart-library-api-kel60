const pool = require("../config/db");

const LoanModel = {
  // =========================
  // CREATE LOAN (PINJAM BUKU)
  // =========================
  async createLoan(member_id, book_id) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // 1. Cek stok buku
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

      // 2. Insert loan
      const loanRes = await client.query(
        `INSERT INTO loans (member_id, book_id, status, loan_date)
         VALUES ($1, $2, 'BORROWED', CURRENT_DATE)
         RETURNING *`,
        [member_id, book_id]
      );

      // 3. Kurangi stok buku
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
  // RETURN LOAN (KEMBALIKAN BUKU)
  // =========================
  async returnLoan(loan_id) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // 1. Ambil data loan
      const loanRes = await client.query(
        "SELECT * FROM loans WHERE id = $1",
        [loan_id]
      );

      if (loanRes.rows.length === 0) {
        throw new Error("Loan tidak ditemukan");
      }

      const loan = loanRes.rows[0];

      if (loan.status === "RETURNED") {
        throw new Error("Buku sudah dikembalikan");
      }

      // 2. Update loan jadi returned
      await client.query(
        `UPDATE loans 
         SET status = 'RETURNED', return_date = CURRENT_DATE
         WHERE id = $1`,
        [loan_id]
      );

      // 3. Tambah stok buku
      await client.query(
        `UPDATE books 
         SET available_copies = available_copies + 1
         WHERE id = $1`,
        [loan.book_id]
      );

      await client.query("COMMIT");

      return { message: "Buku berhasil dikembalikan" };

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
  // GET LOAN BY ID
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