// routes/auth.js

const express = require('express');
const router = express.Router();
const pool = require('../db'); // Asegúrate de tener la conexión a la base de datos aquí

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Verificar usuario y contraseña
        const result = await pool.query('SELECT * FROM usuarios WHERE username = $1 AND password = $2', [username, password]);

        if (result.rows.length > 0) {
            // Usuario encontrado
            res.json({ message: 'Inicio de sesión exitoso' });
        } else {
            // Usuario no encontrado
            res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

module.exports = router;
