// backend/routes/pedidos.js

const express = require('express');
const router = express.Router();
const pool = require('../db');

// Obtener todos los pedidos
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.id_pedido, p.fecha_pedido, pr.nombre AS proveedor, p.monto_total
      FROM pedidos p
      JOIN proveedores pr ON p.id_proveedor = pr.id_proveedor
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Agregar un nuevo pedido
router.post('/', async (req, res) => {
  try {
    const { fecha_pedido, id_proveedor, monto_total } = req.body;
    const newOrder = await pool.query(
      `INSERT INTO pedidos (fecha_pedido, id_proveedor, monto_total) 
       VALUES($1, $2, $3) RETURNING *`,
      [fecha_pedido, id_proveedor, monto_total]
    );
    res.json(newOrder.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// Actualizar un pedido
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha_pedido, id_proveedor, monto_total } = req.body;
    const updatedOrder = await pool.query(
      `UPDATE pedidos SET fecha_pedido = $1, id_proveedor = $2, monto_total = $3 
       WHERE id_pedido = $4 RETURNING *`,
      [fecha_pedido, id_proveedor, monto_total, id]
    );
    res.json(updatedOrder.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// Eliminar un pedido
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM pedidos WHERE id_pedido = $1', [id]);
    res.json({ message: 'Pedido eliminado correctamente' });
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;
