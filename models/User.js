// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//   username: { type: String, required: true },
//   password: { type: String, required: true },
//   biodata: { type: String, required: true },
//   jobrole: { type: String, required: false }
// });

// const User = mongoose.model("User", userSchema);

// export default User;


import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  biodata: { type: String, required: true },
  jobrole: { type: String, required: false }
});

const User = mongoose.model("User", userSchema);
export default User;
