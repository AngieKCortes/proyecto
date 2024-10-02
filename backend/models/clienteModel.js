// models/clienteModel.js
const pool = require('../db');

// Modelo para clientes
const getClientes = async () => {
  return await pool.query('SELECT * FROM clientes');
};

const getClienteById = async (id) => {
  return await pool.query('SELECT * FROM clientes WHERE id_cliente = $1', [id]);
};

const createCliente = async (nombre, email, telefono, direccion) => {
  return await pool.query(
    'INSERT INTO clientes (nombre, email, telefono, direccion) VALUES ($1, $2, $3, $4) RETURNING *',
    [nombre, email, telefono, direccion]
  );
};

const updateCliente = async (id, nombre, email, telefono, direccion) => {
  return await pool.query(
    'UPDATE clientes SET nombre = $1, email = $2, telefono = $3, direccion = $4 WHERE id_cliente = $5 RETURNING *',
    [nombre, email, telefono, direccion, id]
  );
};

const deleteCliente = async (id) => {
  return await pool.query('DELETE FROM clientes WHERE id_cliente = $1', [id]);
};

module.exports = {
  getClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente,
};
