const User = require("../../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
exports.createAdmin = (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  User.findOne({ email: req.body.email }).exec(async (err, user) => {
    if (user) {
      return res.status(400).json({ message: "user is all ready registered" });
    }
    const hashed_password = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      hashed_password,
      role: "admin",
    });
    newUser.save((error, data) => {
      if (error) {
        return res.status(400).json({
          message: "Something went wrong",
        });
      }
      if (data) {
        return res.status(200).json({
          message: "admin is created successfully",
        });
      }
    });
  });
};

exports.signin = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (error) {
      return res.status(400).json({ error: error });
    }
    if (user) {
      const password = user.hashed_password;
      const comparedPass = await bcrypt.compare(req.body.password, password);
      if (comparedPass) {
        const token = jwt.sign(
          { _id: user._id, role: user.role },
          process.env.SCRET
        );
        const { _id, firstName, lastName, email, role } = user;
        return res.status(200).json({
          token,
          user: {
            _id,
            firstName,
            lastName,
            email,
            role,
          },
        });
      } else {
        return res.status(400).json({ message: "check your password" });
      }
    } else {
      return res.status(400).json({ message: "user not found " });
    }
  });
};
exports.signout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    message: "Signout successfully...!",
  });
};
