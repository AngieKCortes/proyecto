// Cargar la lista de clientes al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    cargarClientes();
});

async function cargarClientes() {
    try {
        const response = await fetch('/api/clientes'); // Asegúrate de que esta ruta sea correcta
        const data = await response.json();
        const tableBody = document.querySelector('#clientesTable tbody');
        tableBody.innerHTML = '';

        data.forEach(cliente => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${cliente.id_cliente}</td>
                <td>${cliente.nombre}</td>
                <td>${cliente.email}</td>
                <td>${cliente.telefono}</td>
                <td>${cliente.direccion}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error al cargar los clientes:', error);
    }
}

// Función para abrir el modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'flex';  // Mostrar modal con display flex para centrarlo
}

// Función para cerrar el modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';  // Ocultar modal
}

// Abrir modal de agregar cliente
document.getElementById('addClient').addEventListener('click', function() {
    openModal('addModal'); // Abre el modal de agregar cliente
});

// Evento para agregar cliente
document.getElementById('addClientForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;
    const direccion = document.getElementById('direccion').value;

    try {
        const response = await fetch('/api/clientes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre, email, telefono, direccion })
        });

        if (!response.ok) throw new Error('Error al agregar cliente');

        alert('Cliente agregado con éxito');
        closeModal('addModal');
        cargarClientes(); // Recargar la lista de clientes
    } catch (error) {
        console.error('Error al agregar cliente:', error);
    }
});

// Editar Cliente
document.getElementById('editClient').addEventListener('click', function() {
    openModal('editModal'); // Abre el modal de editar cliente
});

// Evento para editar cliente
document.getElementById('editClientForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const id_cliente = document.getElementById('id_cliente_edit').value;
    const nombre = document.getElementById('nombre_edit').value;
    const email = document.getElementById('email_edit').value;
    const telefono = document.getElementById('telefono_edit').value;
    const direccion = document.getElementById('direccion_edit').value;

    try {
        const response = await fetch(`/api/clientes/${id_cliente}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre, email, telefono, direccion })
        });

        if (!response.ok) throw new Error('Error al editar cliente');

        alert('Cliente actualizado con éxito');
        closeModal('editModal');
        cargarClientes(); // Recargar la lista de clientes
    } catch (error) {
        console.error('Error al editar cliente:', error);
    }
});

// Eliminar Cliente
document.getElementById('deleteClient').addEventListener('click', function() {
    openModal('deleteModal'); // Abre el modal de eliminar cliente
});

// Evento para eliminar cliente
document.getElementById('deleteClientForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const id_cliente = document.getElementById('id_cliente_delete').value;

    try {
        const response = await fetch(`/api/clientes/${id_cliente}`, {
            method: 'DELETE',
        });

        if (!response.ok) throw new Error('Error al eliminar cliente');

        alert('Cliente eliminado con éxito');
        closeModal('deleteModal');
        cargarClientes(); // Recargar la lista de clientes
    } catch (error) {
        console.error('Error al eliminar cliente:', error);
    }
});
