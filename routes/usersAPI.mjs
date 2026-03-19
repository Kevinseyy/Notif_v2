import express from "express";
import { validateBody } from "../middleware/validateBody.mjs";
import pool from "../database/database.mjs";

export const usersRouter = express.Router();

usersRouter.post(
  "/",
  validateBody({
    username: { required: true, type: "string", trim: true, minLength: 3 },
    password: { required: true, type: "string", minLength: 6 },
    tosAgreed: { required: true, type: "boolean" },
  }),
  async (req, res) => {
    const { username, password, tosAgreed } = req.body;

    if (!tosAgreed) {
      return res.status(400).json({
        error: "You must accept the Terms of Service to create an account.",
      });
    }

    try {
      const result = await pool.query(
        "INSERT INTO users (username, password, tos_agreed) VALUES ($1, $2, $3) RETURNING id, username, created_at",
        [username, password, tosAgreed]
      );

      res.status(201).json({
        message: "User created successfully",
        userId: result.rows[0].id,
      });
    } catch (err) {
      if (err.code === "23505") {
        return res.status(409).json({ error: "Username already taken" });
      }
      res.status(500).json({ error: err.message });
    }
  }
);

usersRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = result.rows[0];

    if (user.password !== password) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    res.json({
      message: "Login successful",
      userId: user.id,
      username: user.username,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

usersRouter.put("/username", async (req, res) => {
  const { userId, newUsername } = req.body;

  if (!newUsername || newUsername.trim().length < 3) {
    return res.status(400).json({
      error: "Username must be at least 3 characters.",
    });
  }

  try {
    const result = await pool.query(
      "UPDATE users SET username = $1 WHERE id = $2 RETURNING username",
      [newUsername.trim(), userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "Username updated successfully",
      username: result.rows[0].username,
    });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "Username already taken" });
    }
    res.status(500).json({ error: err.message });
  }
});

usersRouter.put("/status", (req, res) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: "Status is required" });
  }

  res.json({ status });
});

usersRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Account and personal data deleted." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
