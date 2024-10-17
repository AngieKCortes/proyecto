document.addEventListener('DOMContentLoaded', function() {
    cargarVentas(); // Cargar las ventas al iniciar la página
});

// Cargar la lista de ventas
async function cargarVentas() {
    try {
        const response = await fetch('/api/ventas'); // Asegúrate de que esta ruta exista en tu backend
        const data = await response.json();
        const tableBody = document.querySelector('#ventasTable tbody');
        tableBody.innerHTML = ''; // Limpiar el contenido actual

        data.forEach(venta => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${venta.id_factura}</td>
                <td>${venta.id_cliente}</td>
                <td>${venta.fecha_venta}</td>
                <td>${venta.cliente}</td>
                <td>${venta.monto_total}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error al cargar las ventas:', error);
    }
}

// Abrir modal para agregar venta
document.getElementById('addSale').addEventListener('click', function() {
    openModal('addModal'); // Abre el modal de agregar venta
});

// Evento para agregar venta
document.getElementById('addSaleForm').addEventListener('submit', async function(e) {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    const fecha_venta = document.getElementById('fecha_venta').value;
    const id_cliente = document.getElementById('id_cliente').value;
    const monto_total = document.getElementById('monto_total').value;

    try {
        const response = await fetch('/api/ventas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fecha_venta, id_cliente, monto_total })
        });

        if (!response.ok) throw new Error('Error al agregar venta');

        alert('Venta agregada con éxito');
        closeModal('addModal');
        cargarVentas(); // Recargar la lista de ventas
    } catch (error) {
        console.error('Error al agregar venta:', error);
    }
});

// Abrir modal para editar venta
document.getElementById('editSale').addEventListener('click', function() {
    openModal('editModal'); // Abre el modal de editar venta
});

// Evento para editar venta
document.getElementById('editSaleForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const id_venta = document.getElementById('id_venta_edit').value;
    const fecha_venta = document.getElementById('fecha_venta_edit').value;
    const id_cliente = document.getElementById('id_cliente_edit').value;
    const monto_total = document.getElementById('monto_total_edit').value;

    try {
        const response = await fetch(`/api/ventas/${id_venta}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fecha_venta, id_cliente, monto_total })
        });

        if (!response.ok) throw new Error('Error al editar venta');

        alert('Venta actualizada con éxito');
        closeModal('editModal');
        cargarVentas(); // Recargar la lista de ventas
    } catch (error) {
        console.error('Error al editar venta:', error);
    }
});

// Abrir modal para eliminar venta
document.getElementById('deleteSale').addEventListener('click', function() {
    openModal('deleteModal'); // Abre el modal de eliminar venta
});

// Evento para eliminar venta
document.getElementById('deleteSaleForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const id_venta = document.getElementById('id_venta_delete').value;

    try {
        const response = await fetch(`/api/ventas/${id_venta}`, {
            method: 'DELETE',
        });

        if (!response.ok) throw new Error('Error al eliminar venta');

        alert('Venta eliminada con éxito');
        closeModal('deleteModal');
        cargarVentas(); // Recargar la lista de ventas
    } catch (error) {
        console.error('Error al eliminar venta:', error);
    }
});

// Abrir modal para generar factura
document.getElementById('generateInvoice').addEventListener('click', function() {
    openModal('generateInvoiceModal'); // Abre el modal de generar factura
});

// Evento para generar factura
document.getElementById('generateInvoiceForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const id_venta = document.getElementById('id_venta').value;

    try {
        const response = await fetch(`/api/ventas/factura/${id_venta}`, {
            method: 'GET',
        });

        if (!response.ok) throw new Error('Error al generar factura');

        // Si el PDF se genera correctamente, puedes abrirlo en una nueva pestaña
        const blob = await response.blob(); // Obtiene el PDF como Blob
        const url = window.URL.createObjectURL(blob); // Crea un objeto URL
        window.open(url); // Abre el PDF en una nueva pestaña

        alert('Factura generada con éxito');
        closeModal('generateInvoiceModal');
    } catch (error) {
        console.error('Error al generar factura:', error);
    }
});

// Funciones para abrir y cerrar modales
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'flex';  // Mostrar modal
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';  // Ocultar modal
}
