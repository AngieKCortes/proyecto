// backend/routes/productos.js
const PDF = require("pdfkit");
const ListaCircular = require('../utils/ListaCircular');
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.id_producto, p.nombre, p.descripcion, p.precio, p.cantidad_stock, 
             c.nombre AS categoria
      FROM productos p
      JOIN categorias c ON p.id_categoria = c.id_categoria
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
  } 
});

// Agregar un nuevo producto
router.post('/', async (req, res) => {
  try {
    const { nombre, descripcion, precio, cantidad_stock, id_categoria} = req.body;
    const newProduct = await pool.query(
      `INSERT INTO productos (nombre, descripcion, precio, cantidad_stock, id_categoria) 
       VALUES($1, $2, $3, $4, $5) RETURNING *`,
      [nombre, descripcion, precio, cantidad_stock, id_categoria]
    );
    res.json(newProduct.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// Actualizar un producto
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, cantidad_stock, id_categoria } = req.body;
    const updatedProduct = await pool.query(
      `UPDATE productos SET nombre = $1, descripcion = $2, precio = $3, cantidad_stock = $4, id_categoria = $5
       WHERE id_producto = $6 RETURNING *`,
      [nombre, descripcion, precio, cantidad_stock, id_categoria, id]
    );
    res.json(updatedProduct.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// Eliminar un producto
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM productos WHERE id_producto = $1', [id]);
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (err) {
    console.error(err.message);
  }
});
//PDF
router.get("/pdf", async (req, res) => {
  try {
    const PDFDocument = require('pdfkit');
    const documento = new PDFDocument({
      margins: { top: 50, bottom: 50, left: 50, right: 50 } // Establecer márgenes en cada página
    });

    // Encabezado y título
    documento
      .font('Helvetica-Bold')
      .fontSize(20)
      .fillColor("#4A90E2")
      .text("Lista de Inventario", { align: "center" })
      .moveDown(2); // Espacio después del título

    // Obtener productos desde la base de datos
    const result = await pool.query(`
      SELECT p.nombre, p.precio, p.descripcion, p.cantidad_stock 
      FROM productos p
    `);

    const listaCircular = new ListaCircular();
    listaCircular.cargarArreglo(result.rows); // Cargar productos desde la BD

    listaCircular.recorrer(producto => {
      // Verificar si se debe saltar de página si el espacio es insuficiente
      if (documento.y > 700) {
        documento.addPage(); // Agregar nueva página
      }

      // Título de cada producto en azul
      documento
        .font('Helvetica-Bold')
        .fontSize(14)
        .fillColor("#4A90E2")
        .text(`Nombre:`, { continued: true }) // Subtítulo en negrita
        .font('Helvetica')
        .fillColor("black")
        .text(` ${producto.nombre}`, { align: 'left' }); // Valor en texto regular

      // Detalles del producto
      documento
        .moveDown(0.5)
        .font('Helvetica-Bold')
        .fillColor("#4A90E2")
        .text('Descripción:', { continued: true }) // Subtítulo en negrita
        .font('Helvetica')
        .fillColor("black")
        .text(` ${producto.descripcion}`); // Valor

      documento
        .moveDown(0.5)
        .font('Helvetica-Bold')
        .fillColor("#4A90E2")
        .text('Precio:', { continued: true }) // Subtítulo en negrita
        .font('Helvetica')
        .fillColor("black")
        .text(` $${producto.precio}`);

      documento
        .moveDown(0.5)
        .font('Helvetica-Bold')
        .fillColor("#4A90E2")
        .text('Cantidad en Stock:', { continued: true }) // Subtítulo en negrita
        .font('Helvetica')
        .fillColor("black")
        .text(` ${producto.cantidad_stock} unidades`);

      documento.moveDown(1); // Espacio entre productos

      // Línea divisoria entre productos
      documento
        .moveTo(50, documento.y)
        .lineTo(550, documento.y)
        .stroke()
        .moveDown(1);
    });

    // Finalizar el documento y enviarlo
    documento.end();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=productos.pdf");
    documento.pipe(res);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error al crear PDF' });
  }
});



module.exports = router;
