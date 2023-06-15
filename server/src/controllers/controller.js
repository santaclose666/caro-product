const jwt = require("jsonwebtoken");
const User = require("../models/user");
const History = require("../models/history");
const multer = require("multer");
const path = require("path");

let refreshArr = [];

const controller = {
  registerUser: async (req, res) => {
    try {
      const checkUser = await User.findOne({
        $or: [{ username: req.body.user }, { email: req.body.email }],
      });

      if (checkUser) {
        return res.status(403).json("Username or email are exist!");
      }

      if (!checkUser) {
        const newUser = await new User({
          username: req.body.user,
          email: req.body.email,
          password: req.body.pwd,
        });
        await newUser.save();
        res.status(200).json("Saved success");
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  },

  //generate access token
  generateAccessToken: (checkUser) => {
    return jwt.sign(
      {
        id: checkUser.id,
        username: checkUser.username,
        email: checkUser.email,
        admin: checkUser.admin,
      },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "10s" }
    );
  },

  //generate fresh token
  generateRefreshToken: (checkUser) => {
    return jwt.sign(
      {
        id: checkUser.id,
        username: checkUser.username,
        email: checkUser.email,
        admin: checkUser.admin,
      },
      process.env.JWT_REFRESH_KEY,
      { expiresIn: "30d" }
    );
  },

  loginUser: async (req, res) => {
    try {
      const checkUser = await User.findOne({ username: req.body.user });

      if (!checkUser) {
        return res.status(404).json("Username or password incorrect!");
      }

      const validPwd = checkUser.password === req.body.pwd;

      if (!validPwd) {
        return res.status(403).json("Username or password incorrect!");
      }

      if (checkUser && validPwd) {
        const accessToken = controller.generateAccessToken(checkUser);
        const refreshToken = controller.generateRefreshToken(checkUser);

        refreshArr.push(refreshToken);

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          path: "/",
          sameSite: "strict",
        });

        const { password, ...other } = checkUser._doc;
        res.status(200).json({ ...other, accessToken });
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  },

  historyUser: async (req, res) => {
    try {
      const limit = 4;
      const { userName, page } = req.params;

      const history = await History.find({
        $or: [{ player1: userName }, { player2: userName }],
      })
        .sort({ createAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      let totalHistory = await History.countDocuments({
        $or: [{ player1: userName }, { player2: userName }],
      });

      let totalPage = Math.ceil(totalHistory / limit);

      if (history.length !== 0 && totalHistory.length !== 0) {
        return res.status(200).json({ history, totalPage });
      } else {
        const msg = "Can't find any your history game!";
        return res.status(200).json(msg);
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  },

  upload: (req, res) => {
    res.status(200).json("Sucess");
  },

  requestRefresh: async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json("U are not authentication");
    }
    if (!refreshArr.includes(refreshToken)) {
      return res.status(403).json("Refresh token is not valid");
    }

    await jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
      if (err) {
        console.log(err);
      }

      refreshArr = refreshArr.filter((token) => token !== refreshToken);

      const newAccessToken = controller.generateAccessToken(user);
      const newRefreshToken = controller.generateRefreshToken(user);

      refreshArr.push(newRefreshToken);

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });

      res.status(200).json({
        accessToken: newAccessToken,
      });
    });
  },

  logoutUser: async (req, res) => {
    res.clearCookie("refreshToken");
    res.status(200).json("logout success");
  },

  lobbyUser: async (req, res) => {
    try {
      const user = await User.find();
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  deleteUser: async (req, res) => {
    try {
      await User.findById(req.params.id);
      res.status(200).json("Delete success");
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = controller;
