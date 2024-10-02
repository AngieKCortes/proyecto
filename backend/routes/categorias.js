// backend/routes/categorias.js

const express = require('express');
const router = express.Router();
const pool = require('../db');  // Conexión a PostgreSQL

// Obtener todas las categorías
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categorias');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Agregar una nueva categoría
router.post('/', async (req, res) => {
  try {
    const { nombre } = req.body;
    const newCategory = await pool.query(
      'INSERT INTO categorias (nombre) VALUES ($1) RETURNING *',
      [nombre]
    );
    res.json(newCategory.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// Actualizar una categoría
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;
    const updatedCategory = await pool.query(
      'UPDATE categorias SET nombre = $1 WHERE id_categoria = $2 RETURNING *',
      [nombre, id]
    );
    res.json(updatedCategory.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// Eliminar una categoría
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM categorias WHERE id_categoria = $1', [id]);
    res.json({ message: 'Categoría eliminada correctamente' });
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;
