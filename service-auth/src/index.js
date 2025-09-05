import express from "express";
import dotenv from "dotenv";
import indexRoutes from "./routes/index.js";

dotenv.config();
const app = express();
app.use(express.json());

// Routes
app.use(indexRoutes);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`${process.env.SERVICE_NAME} running on port ${PORT}`);
});
