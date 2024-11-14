const bcrypt = require("bcrypt");
const { User } = require("../models/user");

const AuthHelper = require("../helper/AuthHelper");



const AuthController = module.exports;

AuthController.signUp = async (req, res) => {
  try {
    const { firstName, lastName, email, password, roles } = req.body;
    console.log("Req body", req.body); 
  const existingUser = await User.findOne({ email });
  console.log("Existing User", existingUser)
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }
  const newUser = new User({
    firstName,
    lastName,
    email,
    password,
    roles,
  });
  console.log("new user", newUser)
  await newUser.save();
  const payload = {
    user: {
      id: newUser.id,
      email: newUser.email,
      roles : newUser.roles
    },
  };
  const userToken = AuthHelper.createJWTToken(payload); 
  console.log("new user", newUser);
  res.status(201).json({
    message : "User registered successfully", 
    userToken, 
    user : newUser
  })
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};
AuthController.SignIn = async(req, res) =>{
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const isMatch = await user.comparePassword(password); 
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const payload = {
            user: {
                id: user.id, 
                email: user.email, 
                roles : user.roles
            }
        }
        const userToken = AuthHelper.createJWTToken(payload); 
        res.status(200).json({
            message: "User Login Successfully", 
            userToken,
            role : user.roles, 
            user
        })
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
}
