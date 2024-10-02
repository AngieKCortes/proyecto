// backend/models/prediccionModel.js
const pool = require('../db');

// Obtener todas las predicciones
const getPredicciones = async () => {
  try {
    const result = await pool.query('SELECT * FROM predicciones');
    return result.rows;
  } catch (err) {
    throw err;
  }
};

// Crear una nueva predicción
const createPrediccion = async (fecha_prediccion, id_producto, cantidad_predicha) => {
  try {
    const result = await pool.query(
      'INSERT INTO predicciones (fecha_prediccion, id_producto, cantidad_predicha) VALUES ($1, $2, $3) RETURNING *',
      [fecha_prediccion, id_producto, cantidad_predicha]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

// Obtener predicción por ID
const getPrediccionById = async (id_prediccion) => {
  try {
    const result = await pool.query('SELECT * FROM predicciones WHERE id_prediccion = $1', [id_prediccion]);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

// Actualizar una predicción
const updatePrediccion = async (id_prediccion, cantidad_predicha) => {
  try {
    const result = await pool.query(
      'UPDATE predicciones SET cantidad_predicha = $1 WHERE id_prediccion = $2 RETURNING *',
      [cantidad_predicha, id_prediccion]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

// Eliminar una predicción
const deletePrediccion = async (id_prediccion) => {
  try {
    await pool.query('DELETE FROM predicciones WHERE id_prediccion = $1', [id_prediccion]);
    return { message: 'Predicción eliminada' };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getPredicciones,
  createPrediccion,
  getPrediccionById,
  updatePrediccion,
  deletePrediccion,
};
