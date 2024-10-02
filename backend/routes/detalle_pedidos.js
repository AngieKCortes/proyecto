// backend/routes/detalle_pedidos.js

const express = require('express');
const router = express.Router();
const pool = require('../db');

// Obtener todos los detalles de pedidos
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT dp.id_detalle_pedido, p.nombre AS producto, dp.cantidad, dp.precio_unitario
      FROM detalle_pedidos dp
      JOIN productos p ON dp.id_producto = p.id_producto
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Agregar un detalle de pedido
router.post('/', async (req, res) => {
  try {
    const { id_pedido, id_producto, cantidad, precio_unitario } = req.body;
    const newDetail = await pool.query(
      `INSERT INTO detalle_pedidos (id_pedido, id_producto, cantidad, precio_unitario) 
       VALUES($1, $2, $3, $4) RETURNING *`,
      [id_pedido, id_producto, cantidad, precio_unitario]
    );
    res.json(newDetail.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// Actualizar un detalle de pedido
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { id_pedido, id_producto, cantidad, precio_unitario } = req.body;
    const updatedDetail = await pool.query(
      `UPDATE detalle_pedidos SET id_pedido = $1, id_producto = $2, cantidad = $3, precio_unitario = $4 
       WHERE id_detalle_pedido = $5 RETURNING *`,
      [id_pedido, id_producto, cantidad, precio_unitario, id]
    );
    res.json(updatedDetail.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// Eliminar un detalle de pedido
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM detalle_pedidos WHERE id_detalle_pedido = $1', [id]);
    res.json({ message: 'Detalle de pedido eliminado correctamente' });
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;
