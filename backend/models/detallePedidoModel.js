// backend/models/detallePedidoModel.js
const pool = require('../db');

// Obtener todos los detalles de pedidos
const getDetallesPedido = async () => {
  try {
    const result = await pool.query('SELECT * FROM detalle_pedidos');
    return result.rows;
  } catch (err) {
    throw err;
  }
};

// Crear un nuevo detalle de pedido
const createDetallePedido = async (id_pedido, id_producto, cantidad, precio_unitario) => {
  try {
    const result = await pool.query(
      'INSERT INTO detalle_pedidos (id_pedido, id_producto, cantidad, precio_unitario) VALUES ($1, $2, $3, $4) RETURNING *',
      [id_pedido, id_producto, cantidad, precio_unitario]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

// Obtener detalle de pedido por ID
const getDetallePedidoById = async (id_detalle_pedido) => {
  try {
    const result = await pool.query('SELECT * FROM detalle_pedidos WHERE id_detalle_pedido = $1', [id_detalle_pedido]);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

// Actualizar un detalle de pedido
const updateDetallePedido = async (id_detalle_pedido, cantidad, precio_unitario) => {
  try {
    const result = await pool.query(
      'UPDATE detalle_pedidos SET cantidad = $1, precio_unitario = $2 WHERE id_detalle_pedido = $3 RETURNING *',
      [cantidad, precio_unitario, id_detalle_pedido]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

// Eliminar un detalle de pedido
const deleteDetallePedido = async (id_detalle_pedido) => {
  try {
    await pool.query('DELETE FROM detalle_pedidos WHERE id_detalle_pedido = $1', [id_detalle_pedido]);
    return { message: 'Detalle de pedido eliminado' };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getDetallesPedido,
  createDetallePedido,
  getDetallePedidoById,
  updateDetallePedido,
  deleteDetallePedido,
};
