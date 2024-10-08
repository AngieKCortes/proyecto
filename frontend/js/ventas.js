// ventas.js

document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/ventas')  // Asegúrate de que esta ruta exista en tu backend
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#ventasTable tbody');
            data.forEach(venta => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${venta.fecha}</td>
                    <td>${venta.cliente}</td>
                    <td>${venta.monto_total}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error al cargar las ventas:', error));
});

// Redirigir a la página de agregar venta
document.getElementById('addSale').addEventListener('click', function() {
    window.location.href = 'agregarVenta.html';  // Redirige a un formulario de agregar venta
});

// Redirigir a la página de editar venta
document.getElementById('editSale').addEventListener('click', function() {
    window.location.href = 'editarVenta.html';  // Redirige a un formulario para editar venta
});

// Redirigir a la página de actualizar venta
document.getElementById('updateSale').addEventListener('click', function() {
    window.location.href = 'actualizarVenta.html';  // Redirige a un formulario para actualizar venta
});

// Redirigir a la página de eliminar venta
document.getElementById('deleteSale').addEventListener('click', function() {
    window.location.href = 'eliminarVenta.html';  // Redirige a la página o función para eliminar venta
});
