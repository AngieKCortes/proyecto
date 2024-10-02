// backend/models/detalleVentaModel.js
const pool = require('../db');

// Obtener todos los detalles de ventas
const getDetallesVenta = async () => {
  try {
    const result = await pool.query('SELECT * FROM detalle_ventas');
    return result.rows;
  } catch (err) {
    throw err;
  }
};

// Crear un nuevo detalle de venta
const createDetalleVenta = async (id_venta, id_producto, cantidad, precio_unitario) => {
  try {
    const result = await pool.query(
      'INSERT INTO detalle_ventas (id_venta, id_producto, cantidad, precio_unitario) VALUES ($1, $2, $3, $4) RETURNING *',
      [id_venta, id_producto, cantidad, precio_unitario]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

// Obtener detalle de venta por ID
const getDetalleVentaById = async (id_detalle) => {
  try {
    const result = await pool.query('SELECT * FROM detalle_ventas WHERE id_detalle = $1', [id_detalle]);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

// Actualizar un detalle de venta
const updateDetalleVenta = async (id_detalle, cantidad, precio_unitario) => {
  try {
    const result = await pool.query(
      'UPDATE detalle_ventas SET cantidad = $1, precio_unitario = $2 WHERE id_detalle = $3 RETURNING *',
      [cantidad, precio_unitario, id_detalle]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

// Eliminar un detalle de venta
const deleteDetalleVenta = async (id_detalle) => {
  try {
    await pool.query('DELETE FROM detalle_ventas WHERE id_detalle = $1', [id_detalle]);
    return { message: 'Detalle de venta eliminado' };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getDetallesVenta,
  createDetalleVenta,
  getDetalleVentaById,
  updateDetalleVenta,
  deleteDetalleVenta,
};
