const jwt = require("jsonwebtoken");
exports.requiredProfile = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    const user = jwt.verify(token, process.env.SCRET);
    req.user = user;
  } else {
    return res.status(400).json({
      message: "authoriztion is required",
    });
  }
  next();
};

exports.requiredAdmin = (req, res, next) => {
  if (req.user.role != "admin") {
    return res.status(400).json({
      message: "admin access denied",
    });
  }
  next();
};
exports.requiredUser = (req, res, next) => {
  if (req.user.role != "user") {
    return res.status(400).json({
      message: "User access denied",
    });
  }
  next();
};
