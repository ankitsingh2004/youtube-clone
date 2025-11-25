import users from "../Modals/Auth.js";
import mongoose from "mongoose";

export const login = async (req, res) => {
  const { email, name, image } = req.body;
  try {
    const existinguser = await users.findOne({ email });
    if (!existinguser) {
      try {
        const newuser = await users.create({ email, name, image });
        res.status(200).json({ result: newuser });
      } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
        return;
      }
    } else {
      res.status(200).json({ result: existinguser });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    return;
  }
};

export const updateprofile = async (req, res) => {
  const { email, name, image, channelname, description } = req.body;
  const { id } = req.params;
  
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const updatedUser = await users.findByIdAndUpdate(
      id,
      { email, name, image, channelname, description },
      { new: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({ result: updatedUser });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};