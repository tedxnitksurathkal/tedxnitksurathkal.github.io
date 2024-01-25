import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Endpoint: /update
// Method: POST
router.post("/", async (req, res) => {
  try {
    // Request body will consist of three properties {Name, Roll Number, Score}
    const { Name, Roll_No, Score } = req.body; // Destructuring object properties.

    // Check if a user with the given Name or Roll_No already exists
    let user =
      (await User.findOne({ Name })) || (await User.findOne({ Roll_No }));

    // If the user exists, update the score; otherwise, create a new user
    if (user) {
      user.Score = Score;
    } else {
      user = new User({ Name, Roll_No, Score });
    }

    // Save the user to the database
    await user.save();

    // Send a success response
    return res.status(200).json({
      message: "User's details were updated!",
      description:
        "New score of player was updated in the DB and can now be accessed through the appropriate endpoint.",
    });
  } catch (error) {
    // Handle errors and send an error response
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      description: "There was an error while processing the request.",
    });
  }
});

export default router;
