app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;

    // Lógica para verificar el usuario
    const user = await pool.query('SELECT * FROM usuarios WHERE username = $1', [username]);

    if (user.rows.length > 0 && user.rows[0].password === password) { // No olvides usar hashing en producción
        // Autenticación exitosa
        res.status(200).send('Inicio de sesión exitoso');
    } else {
        res.status(401).send('Credenciales incorrectas');
    }
});
