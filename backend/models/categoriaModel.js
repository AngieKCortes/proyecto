// models/categoriaModel.js
const pool = require('../db');

// Modelo para categorías
const getCategorias = async () => {
  return await pool.query('SELECT * FROM categorias');
};

const getCategoriaById = async (id) => {
  return await pool.query('SELECT * FROM categorias WHERE id_categoria = $1', [id]);
};

const createCategoria = async (nombre) => {
  return await pool.query('INSERT INTO categorias (nombre) VALUES ($1) RETURNING *', [nombre]);
};

const updateCategoria = async (id, nombre) => {
  return await pool.query('UPDATE categorias SET nombre = $1 WHERE id_categoria = $2 RETURNING *', [nombre, id]);
};

const deleteCategoria = async (id) => {
  return await pool.query('DELETE FROM categorias WHERE id_categoria = $1', [id]);
};

module.exports = {
  getCategorias,
  getCategoriaById,
  createCategoria,
  updateCategoria,
  deleteCategoria,
};
