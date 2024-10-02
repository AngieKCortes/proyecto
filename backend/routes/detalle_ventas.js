// backend/routes/detalle_ventas.js

const express = require('express');
const router = express.Router();
const pool = require('../db');

// Obtener todos los detalles de ventas
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT dv.id_detalle, v.fecha_venta, p.nombre AS producto, dv.cantidad, dv.precio_unitario
      FROM detalle_ventas dv
      JOIN ventas v ON dv.id_venta = v.id_venta
      JOIN productos p ON dv.id_producto = p.id_producto
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Agregar un detalle de venta
router.post('/', async (req, res) => {
  try {
    const { id_venta, id_producto, cantidad, precio_unitario } = req.body;
    const newDetail = await pool.query(
      `INSERT INTO detalle_ventas (id_venta, id_producto, cantidad, precio_unitario) 
       VALUES($1, $2, $3, $4) RETURNING *`,
      [id_venta, id_producto, cantidad, precio_unitario]
    );
    res.json(newDetail.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// Actualizar un detalle de venta
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { id_venta, id_producto, cantidad, precio_unitario } = req.body;
    const updatedDetail = await pool.query(
      `UPDATE detalle_ventas SET id_venta = $1, id_producto = $2, cantidad = $3, precio_unitario = $4 
       WHERE id_detalle = $5 RETURNING *`,
      [id_venta, id_producto, cantidad, precio_unitario, id]
    );
    res.json(updatedDetail.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// Eliminar un detalle de venta
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM detalle_ventas WHERE id_detalle = $1', [id]);
    res.json({ message: 'Detalle de venta eliminado correctamente' });
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;
