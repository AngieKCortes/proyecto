require('dotenv').config();
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

// Importar rutas
const usersRoutes = require('./routes/users'); // Rutas de usuarios
const productosRoutes = require('./routes/productos'); // Rutas de productos
const ventasRoutes = require('./routes/ventas'); // Rutas de ventas
const proveedoresRoutes = require('./routes/proveedores'); // Rutas de proveedores
const clientesRoutes = require('./routes/clientes'); // Rutas de clientes
const detalleVentasRoutes = require('./routes/detalle_ventas'); // Rutas de detalle de ventas
const pedidosRoutes = require('./routes/pedidos'); // Rutas de pedidos
const detallePedidosRoutes = require('./routes/detalle_pedidos'); // Rutas de detalle de pedidos
const prediccionesRoutes = require('./routes/predicciones'); // Rutas de predicciones
const authRoutes = require('./routes/auth'); // Rutas de autenticación

// Conectar las rutas a sus respectivos endpoints
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/ventas', ventasRoutes);
app.use('/api/proveedores', proveedoresRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/detalle_ventas', detalleVentasRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/detalle_pedidos', detallePedidosRoutes);
app.use('/api/predicciones', prediccionesRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.send('Bienvenido al sistema de gestión de inventario');  // Mensaje de bienvenida
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
