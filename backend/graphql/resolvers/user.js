const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// const User = require("../../models/user");

module.exports = {
  createUser: async (args) => {
    // try {
    //   const existingUser = await User.findOne({
    //     email: args.userInput.email,
    //     username: args.userInput.username,
    //   });
    //   if (existingUser) {
    //     throw new Error("User exists already.");
    //   }
    //   const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
    //
    //   const user = new User({
    //     email: args.userInput.email,
    //     username: args.userInput.username,
    //     password: hashedPassword,
    //   });
    //
    //   const result = await user.save();
    //
    //   return { ...result._doc, password: null, _id: result.id };
    // } catch (err) {
    //   throw err;
    // }
    // email: String!
    // username: String!
    // password: String
    return { email: "someemailhere", username: "testusername", password: null };
  },
  login: async ({ username, password }) => {
    // const user = await User.findOne({ email: email });
    // if (!user) {
    //   throw new Error("User does not exist!");
    // }
    // const isEqual = await bcrypt.compare(password, user.password);
    // if (!isEqual) {
    //   throw new Error("Password is incorrect!");
    // }
    // const token = jwt.sign(
    //   { userId: user.id, email: user.email },
    //   "somesupersecretkey",
    //   {
    //     expiresIn: "1h",
    //   }
    // );
    // return { userId: user.id, token: token, tokenExpiration: 1 };
    return { userId: "someUserID", token: "someToken", tokenExpiration: 1 };
  },
};
