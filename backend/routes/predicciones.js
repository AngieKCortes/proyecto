// backend/routes/predicciones.js

const express = require('express');
const router = express.Router();
const pool = require('../db');

// Obtener todas las predicciones
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.id_prediccion, p.fecha_prediccion, pr.nombre AS producto, p.cantidad_predicha
      FROM predicciones p
      JOIN productos pr ON p.id_producto = pr.id_producto
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Agregar una nueva predicción
router.post('/', async (req, res) => {
  try {
    const { fecha_prediccion, id_producto, cantidad_predicha } = req.body;
    const newPrediction = await pool.query(
      `INSERT INTO predicciones (fecha_prediccion, id_producto, cantidad_predicha) 
       VALUES($1, $2, $3) RETURNING *`,
      [fecha_prediccion, id_producto, cantidad_predicha]
    );
    res.json(newPrediction.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// Actualizar una predicción
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha_prediccion, id_producto, cantidad_predicha } = req.body;
    const updatedPrediction = await pool.query(
      `UPDATE predicciones SET fecha_prediccion = $1, id_producto = $2, cantidad_predicha = $3 
       WHERE id_prediccion = $4 RETURNING *`,
      [fecha_prediccion, id_producto, cantidad_predicha, id]
    );
    res.json(updatedPrediction.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// Eliminar una predicción
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM predicciones WHERE id_prediccion = $1', [id]);
    res.json({ message: 'Predicción eliminada correctamente' });
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;
