const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) return res.status(401).send("access denied");

  try {
    token = token.split(" ")[1];

    if (token === "null" || !token) {
      return res.status(401).send("unauthorized request");
    }

    let verifiedUser = jwt.verify(token, "coding-its-easy");
    if (!verifiedUser) return res.status(401).send("unauthorized request");
    console.log("verifiedUser = ", verifiedUser);
    req.user = verifiedUser;
    next();
  } catch (err) {
    res.status(400).send("invalid token");
  }
};

const checkRole = async (req, res, next) => {
  console.log("req.user = ", req.user.isAdmin == 1);
  if (req.user.isAdmin == 1) {
    return next();
  }
  return res.status(401).send("unauthorized");
};

module.exports = { verifyToken, checkRole };
