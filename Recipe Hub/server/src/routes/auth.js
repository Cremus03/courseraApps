const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");
const { requireAuth, JWT_SECRET } = require("../middleware/auth");

const router = express.Router();

function toPublicUser(user) {
  return { id: user.id, email: user.email, name: user.name };
}

router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ error: "email, password și name sunt obligatorii" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: "Există deja un cont cu acest email" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, passwordHash, name },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ token, user: toPublicUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Eroare la înregistrare" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "email și password sunt obligatorii" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Email sau parolă incorecte" });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Email sau parolă incorecte" });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: toPublicUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Eroare la autentificare" });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) return res.status(404).json({ error: "Utilizator inexistent" });
    res.json(toPublicUser(user));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Eroare la preluarea contului" });
  }
});

module.exports = router;
