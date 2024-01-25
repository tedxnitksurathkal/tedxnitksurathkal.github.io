import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Endpoint: /retrieve
// Method: GET
router.get("/", async (req, res) => {
  try {
    const users = await User.find({})
      .sort({ Score: -1 })
      .limit(10);

    if (!users || users.length === 0) {
      return res.status(404).json({
        message: "No users found",
        description: "There are no users in the database.",
      });
    }

    return res.status(200).json({ users });
  } catch (error) {
    console.error("Error retrieving scores:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      description: "There was an error while processing the request.",
    });
  }
});

export default router;
