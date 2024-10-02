document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/productos')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#productosTable tbody');
            data.forEach(producto => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${producto.nombre}</td>
                    <td>${producto.descripcion}</td>
                    <td>${producto.precio}</td>
                    <td>${producto.cantidad_stock}</td>
                    <td><button class="edit">Editar</button> <button class="delete">Eliminar</button></td>
                `;
                tableBody.appendChild(row);
            });
        });
});

document.getElementById('addProduct').addEventListener('click', function() {
    window.location.href = 'add_product.html';
});
