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
                    <td><button class="edit">Editar</button> <button class="delete">Eliminar</button></td>
                `;
                tableBody.appendChild(row);
            });
        });
});

document.getElementById('addPedido').addEventListener('click', function() {
    window.location.href = 'add_pedido.html';
});
