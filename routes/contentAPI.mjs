import express from "express";
import { validateBody } from "../middleware/validateBody.mjs";
import pool from "../database/database.mjs";
import webpush from "web-push";

webpush.setVapidDetails(
  process.env.VAPID_EMAIL,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

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
    const { userId } = req.body;
    const name = req.body.name.trim();
    const joinCode = generateCode();

    try {
      const result = await pool.query(
        "INSERT INTO groups (name, join_code) VALUES ($1, $2) RETURNING *",
        [name, joinCode]
      );
      const group = result.rows[0];

      await pool.query(
        "INSERT INTO user_groups (user_id, group_id) VALUES ($1, $2)",
        [userId, group.id]
      );

      res.status(201).json(group);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

contentRouter.post("/groups/join", async (req, res) => {
  const { joinCode, userId } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM groups WHERE join_code = $1",
      [joinCode.toUpperCase()]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Invalid code" });
    }

    const group = result.rows[0];

    await pool.query(
      "INSERT INTO user_groups (user_id, group_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [userId, group.id]
    );

    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

contentRouter.get("/groups/:id/members", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT users.id, users.username FROM users
       JOIN user_groups ON users.id = user_groups.user_id
       WHERE user_groups.group_id = $1`,
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

contentRouter.get("/groups", async (req, res) => {
  const { userId } = req.query;

  try {
    const result = await pool.query(
      `SELECT groups.* FROM groups
       JOIN user_groups ON groups.id = user_groups.group_id
       WHERE user_groups.user_id = $1`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

contentRouter.delete("/groups/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM groups WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Group not found" });
    }

    res.json({ message: "Group deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

contentRouter.put("/groups/:id/status", async (req, res) => {
  const { userId, status } = req.body;
  const { id: groupId } = req.params;

  try {
    const result = await pool.query(
      `SELECT users.username, subscriptions.subscription 
       FROM subscriptions
       JOIN users ON subscriptions.user_id = users.id
       JOIN user_groups ON users.id = user_groups.user_id
       WHERE user_groups.group_id = $1 AND users.id != $2`,
      [groupId, userId]
    );

    const senderResult = await pool.query(
      "SELECT username FROM users WHERE id = $1",
      [userId]
    );
    const senderName = senderResult.rows[0].username;

    const notifications = result.rows.map((row) => {
      const payload = JSON.stringify({
        title: "NOTIF",
        body: `${senderName} is free now!`,
      });

      return webpush
        .sendNotification(row.subscription, payload)
        .catch((err) => console.error("Push failed:", err));
    });

    await Promise.all(notifications);

    res.json({ status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
