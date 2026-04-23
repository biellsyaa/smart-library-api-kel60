import { ReportModel } from '../models/reportModel.js';

export const ReportController = {

  async getStats(req, res) {
    try {
      const stats = await ReportModel.getStats();

      res.json({
        message: "Statistik perpustakaan",
        data: stats
      });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

};