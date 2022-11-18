const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");

module.exports = {
  // create a new user
  createUser: async (args) => {
    try {
      const existingUser = await User.findOne({
        username: args.userInput.username,
      });
      const existingEmail = await User.findOne({
        email: args.userInput.email,
      });

      if (existingUser) {
        throw new Error("User exists already.");
      } else if (existingEmail) {
        throw new Error("Email exists already.");
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      const user = new User({
        email: args.userInput.email,
        username: args.userInput.username,
        password: hashedPassword,
      });

      const result = await user.save();

      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      throw err;
    }
  },

  // login a user
  login: async ({ username, password }) => {
    // Look at the database to find existing user
    const user = await User.findOne({ username: username });
    if (!user) {
      throw new Error("User does not exist!");
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error("Password is incorrect!");
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      "somesupersecretkey",
      {
        expiresIn: "1h",
      }
    );
    return {
      userId: user.id,
      token: token,
      tokenExpiration: 1,
      username: user.username,
      email: user.email,
    };
  },

  // follow another user by a logged in user
  // if the logged in user is already following the other user, unfollow the other user
  follow: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    const authUser = await User.findById(req.userId);

    const followUsername = await User.findOne({
      username: args.followUsername,
    });

    if (!followUsername) {
      throw new Error("Follow User does not exist!");
    }

    if (authUser.listFollowing.includes(followUsername.username)) {
      authUser.listFollowing = authUser.listFollowing.filter(
        (username) => username !== followUsername.username
      );
      followUsername.listFollower = followUsername.listFollower.filter(
        (username) => username !== authUser.username
      );
    } else {
      authUser.listFollowing.push(followUsername.username);
      followUsername.listFollower.push(authUser.username);
    }

    await followUsername.save();
    await authUser.save();

    return true;
  },

  // check if a logged in user is following another user
  isFollowing: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    const authUser = await User.findById(req.userId);

    if (authUser.listFollowing.includes(args.followUser)) {
      return true;
    }
    return false;
  },

  // get user info by username
  getUserInfo: async (args) => {
    const user = await User.findOne({
      username: args.username,
    });

    if (!user) {
      throw new Error("User does not exist!");
    }
    return {
      username: user.username,
      email: user.email,
      numberFollowing: user.listFollowing.length,
      numberFollower: user.listFollower.length,
    };
  },

  // check if a logged in user is authenticated
  isUserAuth: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    const user = await User.findById(req.userId);
    return {
      username: user.username,
      email: user.email,
      numberFollowing: user.listFollowing.length,
      numberFollower: user.listFollower.length,
    };
  },

};
