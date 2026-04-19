async returnLoan(req, res) {
  const { loan_id } = req.body;

  try {
    const result = await LoanModel.returnLoan(loan_id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}