import express from "express";
import dotenv from "dotenv";

import bookRoutes from "./routes/bookRoutes.js";
import loanRoutes from "./routes/loanRoutes.js";
import memberRoutes from "./routes/memberRoutes.js";
import authorRoutes from "./routes/authorRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());

// ROUTES
app.use("/api/books", bookRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/authors", authorRoutes);
app.use("/api/categories", categoryRoutes);

// HEALTH CHECK
app.get("/", (req, res) => {
  res.json({
    message: "Smart Library API is Running..."
  });
});

export default app;