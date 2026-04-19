import express from "express";
import { returnLoan } from "../controllers/loanController.js";

const router = express.Router();

/**
 * PUT /api/loans/return/:loan_id
 * Untuk mengembalikan buku (RETURNED)
 */
router.put("/return/:loan_id", returnLoan);

export default router;