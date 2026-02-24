import express from "express";
import { validateBody } from "../middleware/validateBody.mjs";

export const usersRouter = express.Router();

const userStatus = {
  userId: "usr_1",
  displayName: "Kevin",
  status: "BUSY",
  updatedAt: new Date().toISOString(),
};

usersRouter.put(
  "/status",
  validateBody({
    status: {
      required: true,
      type: "string",
      trim: true,
    },
  }),
  (req, res) => {
    const allowedStatuses = ["FREE_NOW", "BUSY"];
    const newStatus = req.body.status.trim().toUpperCase();

    if (!allowedStatuses.includes(newStatus)) {
      return res.status(400).json({
        error: "Invalid status value",
        allowed: allowedStatuses,
      });
    }

    userStatus.status = newStatus;
    userStatus.updatedAt = new Date().toISOString();

    res.json(userStatus);
  }
);
