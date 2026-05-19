import { pool } from "../../config/db.js";
export async function findByEmail(email) {
  const [r] = await pool.query("SELECT * FROM users WHERE email=?", [email]);
  return r[0];
}
export async function createUser({ name, email, password }) {
  const [r] = await pool.query(
    "INSERT INTO users(name,email,password) VALUES(?,?,?)",
    [name, email, password],
  );
  return { id: r.insertId, name, email };
}
