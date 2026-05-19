import { pool } from "../../config/db.js";
export async function list() {
  const [r] = await pool.query(
    "SELECT * FROM pricing_configs ORDER BY airline_code IS NULL DESC, id DESC",
  );
  return r;
}
export async function active() {
  const [r] = await pool.query(
    "SELECT * FROM pricing_configs WHERE is_active=1 ORDER BY airline_code IS NULL ASC",
  );
  return r;
}
export async function create(data) {
  const [r] = await pool.query(
    "INSERT INTO pricing_configs(airline_code,airline_name,markup_type,markup_value,commission_type,commission_value,is_active) VALUES(?,?,?,?,?,?,?)",
    [
      data.airline_code || null,
      data.airline_name || null,
      data.markup_type,
      data.markup_value,
      data.commission_type,
      data.commission_value,
      data.is_active ?? 1,
    ],
  );
  return { id: r.insertId, ...data };
}
export async function update(id, data) {
  await pool.query(
    "UPDATE pricing_configs SET airline_code=?, airline_name=?, markup_type=?, markup_value=?, commission_type=?, commission_value=?, is_active=? WHERE id=?",
    [
      data.airline_code || null,
      data.airline_name || null,
      data.markup_type,
      data.markup_value,
      data.commission_type,
      data.commission_value,
      data.is_active ?? 1,
      id,
    ],
  );
  return { id, ...data };
}
export async function remove(id) {
  await pool.query("DELETE FROM pricing_configs WHERE id=?", [id]);
}
