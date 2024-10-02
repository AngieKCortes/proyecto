// backend/models/pedidoModel.js
const pool = require('../db');

// Obtener todos los pedidos
const getPedidos = async () => {
  try {
    const result = await pool.query('SELECT * FROM pedidos');
    return result.rows;
  } catch (err) {
    throw err;
  }
};

// Crear un nuevo pedido
const createPedido = async (fecha_pedido, id_proveedor, monto_total) => {
  try {
    const result = await pool.query(
      'INSERT INTO pedidos (fecha_pedido, id_proveedor, monto_total) VALUES ($1, $2, $3) RETURNING *',
      [fecha_pedido, id_proveedor, monto_total]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

// Obtener pedido por ID
const getPedidoById = async (id_pedido) => {
  try {
    const result = await pool.query('SELECT * FROM pedidos WHERE id_pedido = $1', [id_pedido]);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

// Actualizar un pedido
const updatePedido = async (id_pedido, monto_total) => {
  try {
    const result = await pool.query(
      'UPDATE pedidos SET monto_total = $1 WHERE id_pedido = $2 RETURNING *',
      [monto_total, id_pedido]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

// Eliminar un pedido
const deletePedido = async (id_pedido) => {
  try {
    await pool.query('DELETE FROM pedidos WHERE id_pedido = $1', [id_pedido]);
    return { message: 'Pedido eliminado' };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getPedidos,
  createPedido,
  getPedidoById,
  updatePedido,
  deletePedido,
};
