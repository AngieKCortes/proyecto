// backend/server.js

const express = require('express');
const app = express();
const pool = require('./db');  // Importar conexión a PostgreSQL
const { exec } = require('child_process'); // Importar child_process

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());  // Para que Express pueda leer y parsear JSON
app.use(express.static('frontend')); // Servir archivos estáticos desde la carpeta 'frontend'

// Ruta para ejecutar el script de Python
app.get('/api/prediction', (req, res) => {
    exec('python backend/ai/demand_prediction.py', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error ejecutando el script: ${error.message}`);
            return res.status(500).send('Error ejecutando el script');
        }
        if (stderr) {
            console.error(`Error: ${stderr}`);
            return res.status(500).send('Error en el script');
        }
        res.json({ result: stdout });
    });
});

// Rutas
const usersRoutes = require('./routes/users'); // Importar las rutas de usuarios
const productosRoutes = require('./routes/productos');
const ventasRoutes = require('./routes/ventas');
const proveedoresRoutes = require('./routes/proveedores');
const clientesRoutes = require('./routes/clientes');
const detalleVentasRoutes = require('./routes/detalle_ventas');
const pedidosRoutes = require('./routes/pedidos');
const detallePedidosRoutes = require('./routes/detalle_pedidos');
const prediccionesRoutes = require('./routes/predicciones');
const authRoutes = require('./routes/auth');


// Conectar las rutas a sus respectivos endpoints
app.use('/api/auth', authRoutes);  // Rutas para autenticación
app.use('/api/users', usersRoutes);
app.use('/api/productos', productosRoutes);  // Rutas para productos
app.use('/api/ventas', ventasRoutes);        // Rutas para ventas
app.use('/api/proveedores', proveedoresRoutes);  // Rutas para proveedores
app.use('/api/clientes', clientesRoutes);    // Rutas para clientes
app.use('/api/detalle_ventas', detalleVentasRoutes);  // Rutas para detalle de ventas
app.use('/api/pedidos', pedidosRoutes);      // Rutas para pedidos
app.use('/api/detalle_pedidos', detallePedidosRoutes);  // Rutas para detalle de pedidos
app.use('/api/predicciones', prediccionesRoutes);  // Rutas para predicciones de demanda

// Ruta raíz
app.get('/', (req, res) => {
  res.send('Bienvenido al sistema de gestión de inventario');  // Mensaje de bienvenida
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
