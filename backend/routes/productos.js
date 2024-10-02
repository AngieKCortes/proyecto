// backend/routes/productos.js
const productos = require("../assets/productos.json")
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
    const { nombre, descripcion, precio, cantidad_stock, id_categoria, id_proveedor } = req.body;
    const newProduct = await pool.query(
      `INSERT INTO productos (nombre, descripcion, precio, cantidad_stock, id_categoria, id_proveedor) 
       VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
      [nombre, descripcion, precio, cantidad_stock, id_categoria, id_proveedor]
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
    const { nombre, descripcion, precio, cantidad_stock, id_categoria, id_proveedor } = req.body;
    const updatedProduct = await pool.query(
      `UPDATE productos SET nombre = $1, descripcion = $2, precio = $3, cantidad_stock = $4, id_categoria = $5, id_proveedor = $6
       WHERE id_producto = $7 RETURNING *`,
      [nombre, descripcion, precio, cantidad_stock, id_categoria, id_proveedor, id]
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

router.get("/pdf",async (req, res) => {
  try {
      const documento = new PDF()
      documento
          .fontSize(20)
          .text("Lista de inventario", {
              align: "center",
          });
      documento.moveDown();
      const listaCircular = new ListaCircular()

      listaCircular.cargarArreglo(productos)

      listaCircular.recorrer(producto => {

          documento.fontSize(14).text(`Nombre: ${producto.nombre}`);
          documento.fontSize(12).text(`Precio: ${producto.precio}`);
          documento.fontSize(12).text(`Descripcion: ${producto.descripcion}`);
          documento.fontSize(12).text(`Cantidad: ${producto.stock}`);
          documento.moveDown();
      })
      // Finalizar el PDF
      documento.end();

      // Configurar la respuesta como un archivo PDF
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename = productos.pdf");

      // Enviar el PDF generado
      documento.pipe(res);

  } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Error al crear PDF' });
  }
})

module.exports = router;
