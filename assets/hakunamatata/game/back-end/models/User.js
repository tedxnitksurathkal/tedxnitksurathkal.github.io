import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    Name: { type: String, required: true },
    Roll_No: { type: String, required: true },
    Score: { type: Number, required: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
