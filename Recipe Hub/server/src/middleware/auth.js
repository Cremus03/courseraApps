const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Autentificare necesară" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token invalid sau expirat" });
  }
}

// Attaches req.userId if a valid token is present, but does not fail if absent.
function optionalAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (token) {
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      req.userId = payload.userId;
    } catch (err) {
      // ignore invalid token for optional auth
    }
  }
  next();
}

module.exports = { requireAuth, optionalAuth, JWT_SECRET };
