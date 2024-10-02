// models/productoModel.js
const pool = require('../db');

// Modelo para productos
const getProductos = async () => {
  return await pool.query('SELECT * FROM productos');
};

const getProductoById = async (id) => {
  return await pool.query('SELECT * FROM productos WHERE id_producto = $1', [id]);
};

const createProducto = async (nombre, descripcion, precio, cantidad_stock, id_categoria, id_proveedor) => {
  return await pool.query(
    'INSERT INTO productos (nombre, descripcion, precio, cantidad_stock, id_categoria, id_proveedor) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [nombre, descripcion, precio, cantidad_stock, id_categoria, id_proveedor]
  );
};

const updateProducto = async (id, nombre, descripcion, precio, cantidad_stock, id_categoria, id_proveedor) => {
  return await pool.query(
    'UPDATE productos SET nombre = $1, descripcion = $2, precio = $3, cantidad_stock = $4, id_categoria = $5, id_proveedor = $6 WHERE id_producto = $7 RETURNING *',
    [nombre, descripcion, precio, cantidad_stock, id_categoria, id_proveedor, id]
  );
};

const deleteProducto = async (id) => {
  return await pool.query('DELETE FROM productos WHERE id_producto = $1', [id]);
};

module.exports = {
  getProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
};
