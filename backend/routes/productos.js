// backend/routes/productos.js

const express = require('express');
const router = express.Router();
const pool = require('../db');

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.id_producto, p.nombre, p.descripcion, p.precio, p.cantidad_stock, 
             c.nombre AS categoria
      FROM productos p
      JOIN categorias c ON p.id_categoria = c.id_categoria
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Agregar un nuevo producto
router.post('/', async (req, res) => {
  try {
    const { nombre, descripcion, precio, cantidad_stock, id_categoria, id_proveedor } = req.body;
    const newProduct = await pool.query(
      `INSERT INTO productos (nombre, descripcion, precio, cantidad_stock, id_categoria, id_proveedor) 
       VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
      [nombre, descripcion, precio, cantidad_stock, id_categoria, id_proveedor]
    );
    res.json(newProduct.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// Actualizar un producto
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, cantidad_stock, id_categoria, id_proveedor } = req.body;
    const updatedProduct = await pool.query(
      `UPDATE productos SET nombre = $1, descripcion = $2, precio = $3, cantidad_stock = $4, id_categoria = $5, id_proveedor = $6
       WHERE id_producto = $7 RETURNING *`,
      [nombre, descripcion, precio, cantidad_stock, id_categoria, id_proveedor, id]
    );
    res.json(updatedProduct.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// Eliminar un producto
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM productos WHERE id_producto = $1', [id]);
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;
