const { raw } = require("mysql2");
const db = require("../models");
const User = db.user;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authController = {
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      const isEmailExist = await User.findOne({
        where: {
          email: email,
        },
      });

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      if (isEmailExist) {
        return res.status(400).json({
          message: "email has been used",
        });
      }

      await User.create({ username, email, password: hashPassword });

      return res.status(200).json({
        message: "register success",
      });
    } catch (err) {
      return res.status(err.statusCode || 500).json({
        message: err.message,
      });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const checkLogin = await User.findOne({
        where: {
          email: email,
        },
        raw: true,
      });

      if (!checkLogin) {
        return res.status(401).json({
          message: "email or password is incorrect",
        });
      }

      const isValid = await bcrypt.compare(password, checkLogin.password);

      if (!isValid) {
        return res.status(401).json({
          message: "email or password is incorrect",
        });
      }

      let payload = { id: checkLogin.id, isAdmin: checkLogin.isAdmin };
      const token = jwt.sign(payload, "coding-its-easy", { expiresIn: "1h" });

      return res.status(200).json({
        message: "login success",
        token: token,
      });
    } catch (err) {
      return res.status(err.statusCode || 500).json({
        message: err.message,
      });
    }
  },
  users: async (req, res) => {
    try {
      const users = await User.findAll();

      return res.status(200).send({
        message: "ok",
        data: users,
      });
    } catch (err) {
      return res.status(500).send({
        message: err.message,
      });
    }
  },
};

module.exports = { authController };
