// backend/routes/ventas.js

const express = require('express');
const router = express.Router();
const pool = require('../db');

// Obtener todas las ventas
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT v.id_venta, v.fecha_venta, c.nombre AS cliente, v.monto_total
      FROM ventas v
      JOIN clientes c ON v.id_cliente = c.id_cliente
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Agregar una nueva venta
router.post('/', async (req, res) => {
  try {
    const { fecha_venta, id_cliente, monto_total } = req.body;
    const newSale = await pool.query(
      `INSERT INTO ventas (fecha_venta, id_cliente, monto_total) 
       VALUES($1, $2, $3) RETURNING *`,
      [fecha_venta, id_cliente, monto_total]
    );
    res.json(newSale.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// Actualizar una venta
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha_venta, id_cliente, monto_total } = req.body;
    const updatedSale = await pool.query(
      `UPDATE ventas SET fecha_venta = $1, id_cliente = $2, monto_total = $3 
       WHERE id_venta = $4 RETURNING *`,
      [fecha_venta, id_cliente, monto_total, id]
    );
    res.json(updatedSale.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// Eliminar una venta
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM ventas WHERE id_venta = $1', [id]);
    res.json({ message: 'Venta eliminada correctamente' });
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;
