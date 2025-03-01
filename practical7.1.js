require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected successfully"))
.catch(err => console.error("MongoDB connection error:", err));

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  age: Number,
});

const User = mongoose.model("User", userSchema);

const insertUser = async () => {
  try {
    const newUser = new User({
      name: "John Doe",
      email: "john@example.com",
      age: 25,
    });

    const savedUser = await newUser.save();
    console.log("User added:", savedUser);
  } catch (error) {
    console.error("Error inserting user:", error);
  }
};

const fetchUsers = async () => {
  try {
    const users = await User.find();
    console.log("All Users:", users);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

insertUser().then(() => fetchUsers());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
