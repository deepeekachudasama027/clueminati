const { Pool } = require("pg");
var config = {
  connectionString:
    process.env.DATABASE_URL ||
    ":",
 ssl: { rejectUnauthorized: false },
 //ssl:process.env.DATABASE_URL?true:false,
  max: 10,
  idleTimeoutMillis: 1000000,
};
const pool = new Pool(config);
pool.on("error", function (err, client) {
  console.error("idle client error", err.message, err.stack);
});

module.exports = pool;
