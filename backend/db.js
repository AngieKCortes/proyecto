const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'sistema_gestion_inventario',
  password: '123',
  port: 5432,
});

module.exports = pool;

