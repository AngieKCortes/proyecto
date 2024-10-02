// users.js - Backend

const express = require('express');
const router = express.Router();
const pool = require('../db');
const verifyToken = require('../authMiddleware');
const verifyAdmin = require('../adminMiddleware');

// Obtener todos los usuarios (solo accesible para administradores)
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const result = await pool.query('SELECT id_user, username, role FROM users');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Error al obtener los usuarios');
    }
});

module.exports = router;
