import bcrypt from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import * as repo from "./auth.repository.js";
const router = express.Router();
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res
        .status(422)
        .json({ message: "Name, email and password are required" });
    const exists = await repo.findByEmail(email);
    if (exists)
      return res.status(409).json({ message: "Email already registered" });
    const hash = await bcrypt.hash(password, 10);
    const user = await repo.createUser({ name, email, password: hash });
    res.status(201).json({ user });
  } catch (e) {
    next(e);
  }
});
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await repo.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "8h" },
    );
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (e) {
    next(e);
  }
});
export default router;
