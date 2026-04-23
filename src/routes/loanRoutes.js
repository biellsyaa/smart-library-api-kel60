import express from 'express';
import { LoanController } from '../controllers/loanController.js';

const router = express.Router();

router.get('/', LoanController.getLoans);
router.post('/', LoanController.createLoan);

// 🔥 RETURN BOOK (lebih proper)
router.put('/:id/return', LoanController.returnBook);

export default router;