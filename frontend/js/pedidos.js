document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/pedidos')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#pedidosTable tbody');
            data.forEach(pedido => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${pedido.fecha_pedido}</td>
                    <td>${pedido.proveedor}</td>
                    <td>${pedido.monto_total}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error al cargar los pedidos:', error));
});

// Manejo de eventos para los botones
document.getElementById('addPedido').addEventListener('click', function() {
    window.location.href = 'agregarPedido.html'; // Redirigir a la página de agregar pedido
});

document.getElementById('editPedido').addEventListener('click', function() {
    window.location.href = 'editarPedido.html'; // Redirigir a la página de editar pedido
});

document.getElementById('deletePedido').addEventListener('click', function() {
    window.location.href = 'eliminarPedido.html'; // Redirigir a la página de eliminar pedido
});

document.getElementById('updateTable').addEventListener('click', function() {
    // Lógica para actualizar la tabla de pedidos
    alert("Tabla actualizada");
    // Aquí puedes agregar la lógica para volver a cargar los pedidos después de una actualización
});
