import express from "express";
import { validateBody } from "../middleware/validateBody.mjs";

export const contentRouter = express.Router();

const groups = [];

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
  (req, res) => {
    const name = req.body.name.trim();

    const group = {
      groupId: `G${groups.length + 1}`,
      name,
      memberCount: 1,
    };

    groups.push(group);

    res.status(201).json(group);
  }
);
