import { Pool } from "pg";
export const pool = new Pool({
  connectionString: "postgres://postgres:6601@localhost:5432/Dev-Hub",
});

pool.on("connect", () => {
  console.log("Connected to PostgreSQL");
});

pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL error:", err);
  process.exit(-1);
});
