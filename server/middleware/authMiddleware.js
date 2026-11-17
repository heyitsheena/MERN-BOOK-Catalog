const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Please login first.",
    });
  }

  const actualToken = token.split(" ")[1];

  try {
    const decoded = jwt.verify(
      actualToken,
      process.env.JWT_SECRET
    );

    req.userId = decoded.id;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token. Please login again.",
    });
  }
}

module.exports = verifyToken;