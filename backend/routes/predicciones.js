const express = require('express');
const router = express.Router();
const { exec } = require('child_process');

router.get('/', (req, res) => {
    console.log('Iniciando ejecución del script de predicciones');

    exec('python backend/ai/demand_prediction.py', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error ejecutando el script: ${error.message}`);
            return res.status(500).send('Error ejecutando el script');
        }
        if (stderr) {
            console.error(`Error en el script de Python: ${stderr}`);
            return res.status(500).send('Error en el script');
        }

        // Verificar si stdout tiene el formato correcto
        console.log('Salida del script:', stdout);

        try {
            const result = JSON.parse(stdout); // Parsear la salida de Python como JSON
            res.json(result); // Enviar el JSON al frontend
        } catch (err) {
            console.error('Error al parsear la salida JSON:', err);
            res.status(500).send('Error al procesar las predicciones');
        }
    });
});

module.exports = router;
