import { LoanModel } from '../models/loanModel.js';

export const LoanController = {

  // CREATE LOAN
  async createLoan(req, res) {
    const { book_id, member_id, due_date } = req.body;

    try {
      const loan = await LoanModel.createLoan(book_id, member_id, due_date);
      res.status(201).json({
        message: "Peminjaman berhasil dicatat!",
        data: loan
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // GET ALL LOANS
  async getLoans(req, res) {
    try {
      const loans = await LoanModel.getAllLoans();
      res.json(loans);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // RETURN BOOK (RESTFUL VERSION)
  async returnBook(req, res) {
    const { id } = req.params;

    try {
      const loan = await LoanModel.returnBook(id);
      res.json({
        message: "Buku berhasil dikembalikan!",
        data: loan
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

};