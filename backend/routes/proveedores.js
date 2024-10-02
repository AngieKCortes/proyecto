// backend/routes/proveedores.js

const express = require('express');
const router = express.Router();
const pool = require('../db');

// Obtener todos los proveedores
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM proveedores');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Agregar un nuevo proveedor
router.post('/', async (req, res) => {
  try {
    const { nombre, telefono, email, direccion } = req.body;
    const newProvider = await pool.query(
      `INSERT INTO proveedores (nombre, telefono, email, direccion) 
       VALUES($1, $2, $3, $4) RETURNING *`,
      [nombre, telefono, email, direccion]
    );
    res.json(newProvider.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// Actualizar un proveedor
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, telefono, email, direccion } = req.body;
    const updatedProvider = await pool.query(
      `UPDATE proveedores SET nombre = $1, telefono = $2, email = $3, direccion = $4 
       WHERE id_proveedor = $5 RETURNING *`,
      [nombre, telefono, email, direccion, id]
    );
    res.json(updatedProvider.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// Eliminar un proveedor
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM proveedores WHERE id_proveedor = $1', [id]);
    res.json({ message: 'Proveedor eliminado correctamente' });
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;
