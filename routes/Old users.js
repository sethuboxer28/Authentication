import express from "express";
const router = express.Router();
import User from "../models/User.js";

router.get("/api/users/", async (req, res) => {
  try {
    const { limit } = req.query;
    const hasInvalidQuery = Object.keys(req.query).some(
      (key) => key !== "limit"
    );

    if (hasInvalidQuery) {
      return res
        .status(400)
        .json({ message: "Invalid query parameter/ give query as limit" });
    }

    if (!limit) {
      const allUsers = await User.find();
      return res.status(200).json(allUsers);
    }

    const parsedLimit = Number(limit);
    if (isNaN(parsedLimit) || parsedLimit <= 0) {
      return res.status(404).json({
        message: "query limit should be a number and it should be more than 0",
      });
    }

    const totalUsers = await User.countDocuments();

    if (parsedLimit > totalUsers) {
      return res
        .status(404)
        .json({ message: `There are only ${totalUsers} users` });
    }

    const limitedUsers = await User.find().limit(parsedLimit);
    return res.status(200).json(limitedUsers);
  } catch (error) {
    res.status(500).json({ message: `Error fetching users ${error}` });
  }
});

router.get("/api/users/:id", async (req, res) => {
  try {
    const users = await User.findById(req.params.id);

    if (users) {
      res.status(200).json(users);
    } else {
      res
        .status(404)
        .json({ message: `User with ID ${req.params.id} not found` });
    }
  } catch (error) {
    res.status(500).json({ message: `Error feching users, ${error}` });
  }
});

router.delete("/api/users/:id", async (req, res) => {
  const deletedUser = await User.findByIdAndDelete(req.params.id);

  if (deletedUser) {
    res.status(200).json({ message: `Users with id ${req.params.id} deleted` });
  } else {
    res
      .status(404)
      .json({ message: `Users with ID ${req.params.id} not found` });
  }
});

router.put("/api/users/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({
        message: `Users with ID ${req.params.id} not found`,
      });
    }
  } catch (error) {
    res.status(500).json({ message: `Error feching users, ${error}` });
  }
});

router.post("/api/users/", async (req, res) => {
  const newUser = new User({
    userName: req.body.userName,
    password: req.body.password,
    jobRole: req.body.jobRole,
    description:req.body.description,
  });

  try {
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: `Error creating new User: ${error}` });
  }
});

export default router;
