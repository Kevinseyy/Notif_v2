if (process.env.NODE_ENV !== "production") {
  const { default: dotenv } = await import("dotenv");
  dotenv.config();
}

import express from "express";
import { contentRouter } from "./routes/contentAPI.mjs";
import { usersRouter } from "./routes/usersAPI.mjs";
import pool from "./database/database.mjs";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.use(express.static("public"));
app.use(express.static("src"));

app.use("/api/v1", contentRouter);
app.use("/api/v1", usersRouter);

await pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    tos_agreed BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  )
`);

console.log("Database ready");

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
