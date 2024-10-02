// models/ventaModel.js
const pool = require('../db');

// Modelo para ventas
const getVentas = async () => {
  return await pool.query('SELECT * FROM ventas');
};

const getVentaById = async (id) => {
  return await pool.query('SELECT * FROM ventas WHERE id_venta = $1', [id]);
};

const createVenta = async (fecha_venta, id_cliente, monto_total) => {
  return await pool.query(
    'INSERT INTO ventas (fecha_venta, id_cliente, monto_total) VALUES ($1, $2, $3) RETURNING *',
    [fecha_venta, id_cliente, monto_total]
  );
};

const updateVenta = async (id, fecha_venta, id_cliente, monto_total) => {
  return await pool.query(
    'UPDATE ventas SET fecha_venta = $1, id_cliente = $2, monto_total = $3 WHERE id_venta = $4 RETURNING *',
    [fecha_venta, id_cliente, monto_total, id]
  );
};

const deleteVenta = async (id) => {
  return await pool.query('DELETE FROM ventas WHERE id_venta = $1', [id]);
};

module.exports = {
  getVentas,
  getVentaById,
  createVenta,
  updateVenta,
  deleteVenta,
};
