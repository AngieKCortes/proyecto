// models/proveedorModel.js
const pool = require('../db');

// Modelo para proveedores
const getProveedores = async () => {
  return await pool.query('SELECT * FROM proveedores');
};

const getProveedorById = async (id) => {
  return await pool.query('SELECT * FROM proveedores WHERE id_proveedor = $1', [id]);
};

const createProveedor = async (nombre, telefono, email, direccion) => {
  return await pool.query(
    'INSERT INTO proveedores (nombre, telefono, email, direccion) VALUES ($1, $2, $3, $4) RETURNING *',
    [nombre, telefono, email, direccion]
  );
};

const updateProveedor = async (id, nombre, telefono, email, direccion) => {
  return await pool.query(
    'UPDATE proveedores SET nombre = $1, telefono = $2, email = $3, direccion = $4 WHERE id_proveedor = $5 RETURNING *',
    [nombre, telefono, email, direccion, id]
  );
};

const deleteProveedor = async (id) => {
  return await pool.query('DELETE FROM proveedores WHERE id_proveedor = $1', [id]);
};

module.exports = {
  getProveedores,
  getProveedorById,
  createProveedor,
  updateProveedor,
  deleteProveedor,
};
