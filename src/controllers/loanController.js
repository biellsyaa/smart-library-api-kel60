import LoanModel from "../models/loanModel.js";

// =========================
// RETURN LOAN CONTROLLER
// =========================
export const returnLoan = async (req, res) => {
  try {
    const { loan_id } = req.params;

    if (!loan_id) {
      return res.status(400).json({
        error: "loan_id wajib diisi"
      });
    }

    const result = await LoanModel.returnLoan(loan_id);

    return res.status(200).json(result);

  } catch (err) {
    return res.status(400).json({
      error: err.message
    });
  }
};