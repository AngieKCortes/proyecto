document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/ventas')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#ventasTable tbody');
            data.forEach(venta => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${venta.fecha_venta}</td>
                    <td>${venta.cliente}</td>
                    <td>${venta.monto_total}</td>
                    <td><button class="edit">Editar</button> <button class="delete">Eliminar</button></td>
                `;
                tableBody.appendChild(row);
            });
        });
});

document.getElementById('addSale').addEventListener('click', function() {
    window.location.href = 'add_sale.html';
});
