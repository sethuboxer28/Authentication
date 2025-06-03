// import express from "express";
// const router = express.Router();
// import User from "../models/User.js";
// import bcrypt from "bcryptjs";


// router.get("/api/users/", async (req, res) => {
//   try {
//     const { limit } = req.query;
//     const hasInvalidQuery = Object.keys(req.query).some(
//       (key) => key !== "limit"
//     );

//     if (hasInvalidQuery) {
//       return res
//         .status(400)
//         .json({ message: "Invalid query parameter/ give query as limit" });
//     }

//     if (!limit) {
//       const allUsers = await User.find();
//       return res.status(200).json(allUsers);
//     }

//     const parsedLimit = Number(limit);
//     if (isNaN(parsedLimit) || parsedLimit <= 0) {
//       return res.status(404).json({
//         message: "query limit should be a number and it should be more than 0",
//       });
//     }

//     const totalUsers = await User.countDocuments();

//     if (parsedLimit > totalUsers) {
//       return res
//         .status(404)
//         .json({ message: `There are only ${totalUsers} users` });
//     }

//     const limitedUsers = await User.find().limit(parsedLimit);
//     return res.status(200).json(limitedUsers);
//   } catch (error) {
//     res.status(500).json({ message: `Error fetching users ${error}` });
//   }
// });

// router.get("/api/users/:id", async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);

//     if (user) {
//       res.status(200).json(user);
//     } else {
//       res
//         .status(404)
//         .json({ message: `User with ID ${req.params.id} not found` });
//     }
//   } catch (error) {
//     res.status(500).json({ message: `Error feching users, ${error}` });
//   }
// });

// router.delete("/api/users/:id", async (req, res) => {
//   const deletedUser = await User.findByIdAndDelete(req.params.id);

//   if (deletedUser) {
//     res.status(200).json({ message: `User with id ${req.params.id} deleted` });
//   } else {
//     res
//       .status(404)
//       .json({ message: `User with ID ${req.params.id} not found` });
//   }
// });

// // router.put("/api/users/:id", async (req, res) => {
// //   try {
// //     const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
// //       new: true,
// //     });
// //     if (updatedUser) {
// //       res.status(200).json(updatedUser);
// //     } else {
// //       res.status(404).json({
// //         message: `User with ID ${req.params.id} not found`,
// //       });
// //     }
// //   } catch (error) {
// //     res.status(500).json({ message: `Error feching users, ${error}` });
// //   }
// // });

// router.put("/api/users/:id", async (req, res) => {
//   try {
//     const updateData = { ...req.body };
//     if (updateData) {
//       const salt = await bcrypt.genSalt(10);
//       updateData.password = await bcrypt.hash(updateData.password, salt);
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//       req.params.id,
//       updateData,
//       { new: true }
//     );

//     if (updatedUser) {
//       res.status(200).json(updatedUser);
//     } else {
//       res
//         .status(400)
//         .json({ message: `User with ID ${req.params.id} not found ` });
//     }
//   } catch (error) {
//     res.status(500).json({ message: `Error editing  users, ${error} ` });
//   }
// });


// // router.post("/api/users/", async (req, res) => {
// //   const newUser = new User({
// //     username: req.body.username,
// //     password: req.body.password,
// //     age: req.body.age,
// //     jobrole: req.body.jobrole,
// //     location: req.body.location,
// //     education: req.body.education,
// //   });

// //   try {
// //     const savedUser = await newUser.save();
// //     res.status(200).json(savedUser);
// //   } catch (error) {
// //     res.status(400).json({ message: `Error creating new user: ${error}` });
// //   }
// // });

// router.post("/api/users", async (req, res) => {

//   const {username, password, jobrole, biodata} = req.body

//   try{
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const newUser = new User({
//       username,
//       password : hashedPassword,
//       jobrole,
//       biodata
//     })

//     const savedUser = await newUser.save();
//     res.status(200).json(savedUser);
//   }catch (error) {
//     res.status(400).json({ message: `Error creating new user: ${error}` });
//    }
// })


// router.post("/api/users/login", async (req,res)=> {
//   console.log(req)
//   try{
//     const {username, password} = req.body;
//     const user = await User.findOne({ username });
//     console.log(user)

//     if(!user) {
//       return res.status(404).json({message: `User ${username} not found`});
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if(!isMatch){
//       return res.status(404).json({message: "invalid password"});
//     }
//      res.status(200).json({message: `login successfull`, user});
//   }catch (error){
//     res.status(500).json({message: `Login error ${error}`})
//   }
// })

// export default router;


import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// Get all users (optionally with limit)
router.get("/api/users", async (req, res) => {
  try {
    const { limit } = req.query;
    const parsedLimit = limit ? Number(limit) : null;

    if (parsedLimit && (isNaN(parsedLimit) || parsedLimit <= 0)) {
      return res.status(400).json({ message: "Query 'limit' must be a positive number" });
    }

    const users = parsedLimit
      ? await User.find().limit(parsedLimit)
      : await User.find();

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: `Error fetching users: ${error}` });
  }
});

// Get user by ID
router.get("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user
      ? res.status(200).json(user)
      : res.status(404).json({ message: `User with ID ${req.params.id} not found` });
  } catch (error) {
    res.status(500).json({ message: `Error fetching user: ${error}` });
  }
});

// Delete user by ID
router.delete("/api/users/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    deletedUser
      ? res.status(200).json({ message: `User with ID ${req.params.id} deleted` })
      : res.status(404).json({ message: `User with ID ${req.params.id} not found` });
  } catch (error) {
    res.status(500).json({ message: `Error deleting user: ${error}` });
  }
});

// Update user
router.put("/api/users/:id", async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });

    updatedUser
      ? res.status(200).json(updatedUser)
      : res.status(404).json({ message: `User with ID ${req.params.id} not found` });
  } catch (error) {
    res.status(500).json({ message: `Error updating user: ${error}` });
  }
});

// Register user
router.post("/api/users", async (req, res) => {
  const { userName, password, jobrole, biodata } = req.body;

  if (!userName || !password || !biodata) {
    return res.status(400).json({ message: "userName, password, and biodata are required" });
  }

  try {
    const existingUser = await User.findOne({ userName });
    if (existingUser) return res.status(409).json({ message: "UserName already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ userName, password: hashedPassword, jobrole, biodata });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: `Error creating new user: ${error}` });
  }
});

// Login user
router.post("/api/users/login", async (req, res) => {
  const { userName, password } = req.body;

  try {
    const user = await User.findOne({ userName });
    if (!user) return res.status(404).json({ message: `User ${userName} not found` });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Login error: ${error}` });
  }
});

export default router;
