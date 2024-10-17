// backend/routes/ventas.js

const express = require('express');
const router = express.Router();
const pool = require('../db');
const PDFDocument = require('pdfkit');

// Obtener todas las ventas
router.get('/', async (req, res) => {
  try {
      const result = await pool.query(`
          SELECT v.id_venta AS id_factura, v.fecha_venta, c.id_cliente, c.nombre AS cliente, v.monto_total
          FROM ventas v
          JOIN clientes c ON v.id_cliente = c.id_cliente
          ORDER BY v.id_venta ASC
      `);
        
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error al obtener ventas');
    }
});

// Agregar una nueva venta
router.post('/', async (req, res) => {
    try {
        const { fecha_venta, id_cliente, monto_total } = req.body;
        const newSale = await pool.query(
            `INSERT INTO ventas (fecha_venta, id_cliente, monto_total) 
            VALUES($1, $2, $3) RETURNING *`,
            [fecha_venta, id_cliente, monto_total]
        );
        res.json(newSale.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error al agregar venta');
    }
});

// Actualizar una venta
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { fecha_venta, id_cliente, monto_total } = req.body;
        const updatedSale = await pool.query(
            `UPDATE ventas SET fecha_venta = $1, id_cliente = $2, monto_total = $3 
            WHERE id_venta = $4 RETURNING *`,
            [fecha_venta, id_cliente, monto_total, id]
        );
        res.json(updatedSale.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error al actualizar venta');
    }
});

// Eliminar una venta
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM ventas WHERE id_venta = $1', [id]);
        res.json({ message: 'Venta eliminada correctamente' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error al eliminar venta');
    }
});

// Generar PDF de factura
router.get('/factura/:id', async (req, res) => {
  try {
      const { id } = req.params;

      // Obtener los detalles de la venta usando el ID de venta
      const saleResult = await pool.query(
          `SELECT v.id_venta, v.fecha_venta, c.nombre AS cliente, v.monto_total
          FROM ventas v
          JOIN clientes c ON v.id_cliente = c.id_cliente
          WHERE v.id_venta = $1`, [id]
      );

      if (saleResult.rows.length === 0) {
          return res.status(404).send('Venta no encontrada');
      }

      const venta = saleResult.rows[0];

      // Asegúrate de que monto_total es un número
      const montoTotal = parseFloat(venta.monto_total);
      if (isNaN(montoTotal)) {
          return res.status(400).send('Monto total inválido');
      }

      // Crear un nuevo documento PDF
      const doc = new PDFDocument();
      const filePath = `factura_${venta.id_venta}.pdf`;

      // Establecer el encabezado para la descarga
      res.setHeader('Content-disposition', `attachment; filename="${filePath}"`);
      res.setHeader('Content-type', 'application/pdf');

      // Generar contenido del PDF
      doc.pipe(res); // Envía el PDF directamente como respuesta

      // Agregar un título
      doc.fontSize(20).text('Factura', { align: 'center' });
      doc.moveDown();

      // Información de la venta
      doc.fontSize(12)
          .text(`ID Venta: ${venta.id_venta}`)
          .text(`Fecha: ${venta.fecha_venta.toISOString().split('T')[0]}`) // Convertir la fecha a formato ISO
          .text(`Cliente: ${venta.cliente}`)
          .text(`Monto Total: $${montoTotal.toFixed(2)}`) // Asegúrate de usar .toFixed aquí
          .moveDown();

      // Agregar una línea separadora
      doc.moveTo(50, doc.y)
          .lineTo(550, doc.y)
          .stroke();

      // Agregar algunos detalles adicionales
      doc.moveDown()
          .text('Gracias por su compra!', { align: 'center' })
          .moveDown()
          .text('Para cualquier consulta, por favor contáctenos.', { align: 'center' });

      // Finalizar el PDF
      doc.end();
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Error al generar la factura');
  }
});



module.exports = router;
