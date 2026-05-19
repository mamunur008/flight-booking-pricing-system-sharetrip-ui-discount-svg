import { pool } from "../../config/db.js";
export async function list() {
  const [r] = await pool.query("SELECT * FROM discount_codes ORDER BY id DESC");
  return r;
}
export async function findActive(code) {
  const [r] = await pool.query(
    `SELECT * FROM discount_codes WHERE code=? AND is_active=1 AND (valid_from IS NULL OR valid_from<=CURDATE()) AND (valid_to IS NULL OR valid_to>=CURDATE())`,
    [code],
  );
  return r[0];
}
export async function create(d) {
  const [r] = await pool.query(
    "INSERT INTO discount_codes(code,description,discount_type,discount_value,airline_code,origin,destination,max_discount,min_fare,usage_limit,valid_from,valid_to,is_active) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)",
    [
      d.code,
      d.description || "",
      d.discount_type,
      d.discount_value,
      d.airline_code || null,
      d.origin || null,
      d.destination || null,
      d.max_discount || null,
      d.min_fare || 0,
      d.usage_limit || null,
      d.valid_from || null,
      d.valid_to || null,
      d.is_active ?? 1,
    ],
  );
  return { id: r.insertId, ...d };
}
export async function remove(id) {
  await pool.query("DELETE FROM discount_codes WHERE id=?", [id]);
}
