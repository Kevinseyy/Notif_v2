import express from "express";
import { validateBody } from "../middleware/validateBody.mjs";

export const usersRouter = express.Router();

const users = [];

function generateID() {
  let id = null;
  do {
    id = (Math.random() * Number.MAX_SAFE_INTEGER).toString(16);
  } while (users[id]);
  return id;
}

usersRouter.post(
  "/",
  validateBody({
    username: { required: true, type: "string", trim: true, minLength: 3 },
    password: { required: true, type: "string", minLength: 6 },
    tosAgreed: { required: true, type: "boolean" },
  }),
  (req, res) => {
    const { username, password, tosAgreed } = req.body;

    if (!tosAgreed) {
      return res.status(400).json({
        error: "You must accept the Terms of Service to create an account.",
      });
    }

    const existingUser = users.find((u) => u.username === username);

    if (existingUser) {
      return res.status(409).json({
        error: "Username already taken",
      });
    }

    const id = generateID();

    const newUser = {
      id,
      username,
      password,
      tosAgreed,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);

    res.status(201).json({
      message: "User created successfully",
      userId: id,
    });
  }
);

usersRouter.post("/login", (req, res) => {
  const { username, password } = req.body;

  console.log("Current users:", users);

  const user = users.find((u) => u.username === username);

  if (!user) {
    return res.status(404).json({
      error: "User not found",
    });
  }

  if (user.password !== password) {
    return res.status(401).json({
      error: "Incorrect password",
    });
  }

  res.json({
    message: "Login successful",
    userId: user.id,
    username: user.username,
  });
});

usersRouter.put("/status", (req, res) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({
      error: "Status is required",
    });
  }

  res.json({
    status,
  });
});

usersRouter.delete("/:id", (req, res) => {
  const { id } = req.params;

  if (!users[id]) {
    return res.status(404).json({ error: "User not found" });
  }

  delete users[id];

  res.json({ message: "Account and personal data deleted." });
});
