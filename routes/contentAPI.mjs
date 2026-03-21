import express from "express";
import { validateBody } from "../middleware/validateBody.mjs";
import pool from "../database/database.mjs";

export const contentRouter = express.Router();

function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

contentRouter.post(
  "/groups",
  validateBody({
    name: {
      required: true,
      type: "string",
      trim: true,
      minLength: 2,
      maxLength: 30,
    },
  }),
  async (req, res) => {
    const name = req.body.name.trim();
    const joinCode = generateCode();

    try {
      const result = await pool.query(
        "INSERT INTO groups (name, join_code) VALUES ($1, $2) RETURNING *",
        [name, joinCode]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

contentRouter.post("/groups/join", async (req, res) => {
  const { joinCode } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM groups WHERE join_code = $1",
      [joinCode.toUpperCase()]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Invalid code" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

contentRouter.get("/groups", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM groups");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
