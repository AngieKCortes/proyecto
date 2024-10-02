document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/clientes')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#clientesTable tbody');
            data.forEach(cliente => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${cliente.nombre}</td>
                    <td>${cliente.email}</td>
                    <td>${cliente.telefono}</td>
                    <td>${cliente.direccion}</td>
                    <td><button class="edit">Editar</button> <button class="delete">Eliminar</button></td>
                `;
                tableBody.appendChild(row);
            });
        });
});

document.getElementById('addClient').addEventListener('click', function() {
    window.location.href = 'add_client.html';
});
