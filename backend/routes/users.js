const express = require('express');
const router = express.Router();
const pool = require('../db'); // Importar la conexión a PostgreSQL

// Obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM usuarios');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error al obtener los usuarios');
    }
});

// Agregar un nuevo usuario
router.post('/', async (req, res) => {
    const { username, password, rol } = req.body; // Ajusta los campos según tu tabla
    try {
        const newUser = await pool.query(
            'INSERT INTO usuarios (username, password, rol) VALUES ($1, $2, $3) RETURNING *',
            [username, password, rol]
        );
        res.json(newUser.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error al agregar el usuario');
    }
});

// Actualizar un usuario
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { username, rol } = req.body;
    try {
        const updatedUser = await pool.query(
            'UPDATE usuarios SET username = $1, rol = $2 WHERE id_usuario = $3 RETURNING *',
            [username, rol, id]
        );
        res.json(updatedUser.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error al actualizar el usuario');
    }
});

// Cambiar la contraseña de un usuario
router.put('/:id/password', async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;  // Aquí recibes la nueva contraseña

    try {
        // Actualiza la contraseña en la base de datos
        const updatedUser = await pool.query(
            'UPDATE usuarios SET password = $1 WHERE id_usuario = $2 RETURNING *',
            [password, id]  // Recuerda que debes encriptar la contraseña en producción
        );
        
        if (updatedUser.rows.length === 0) {
            return res.status(404).send('Usuario no encontrado');
        }

        res.json(updatedUser.rows[0]);  // Devuelve el usuario actualizado
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error al cambiar la contraseña');
    }
});

// Eliminar un usuario
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM usuarios WHERE id_usuario = $1', [id]);
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error al eliminar el usuario');
    }
});

module.exports = router;
