const express = require('express');
const router = express.Router();
const pool = require('../db');

// Obtener todos los clientes
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clientes ORDER BY id_cliente ASC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error al obtener los clientes' });
  }
});

// Agregar un nuevo cliente
router.post('/', async (req, res) => {
  try {
    const { nombre, email, telefono, direccion } = req.body;
    const newClient = await pool.query(
      `INSERT INTO clientes (nombre, email, telefono, direccion) 
       VALUES($1, $2, $3, $4) RETURNING *`,
      [nombre, email, telefono, direccion]
    );
    res.status(201).json(newClient.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error al agregar el cliente' });
  }
});

// Actualizar un cliente
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, telefono, direccion } = req.body;
    const updatedClient = await pool.query(
      `UPDATE clientes SET nombre = $1, email = $2, telefono = $3, direccion = $4 
       WHERE id_cliente = $5 RETURNING *`,
      [nombre, email, telefono, direccion, id]
    );
    res.status(200).json(updatedClient.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error al actualizar el cliente' });
  }
});

// Eliminar un cliente
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM clientes WHERE id_cliente = $1', [id]);
    res.status(200).json({ message: 'Cliente eliminado correctamente' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error al eliminar el cliente' });
  }
});

module.exports = router;
