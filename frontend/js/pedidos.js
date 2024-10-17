document.addEventListener('DOMContentLoaded', function() {
    cargarPedidos();
});

async function cargarPedidos() {
    try {
        const response = await fetch('/api/pedidos');
        const data = await response.json();
        const tableBody = document.querySelector('#pedidosTable tbody');
        tableBody.innerHTML = '';

        data.forEach(pedido => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${pedido.id_pedido}</td>
                <td>${pedido.fecha_pedido}</td>
                <td>${pedido.id_proveedor}</td>
                <td>${pedido.proveedor}</td>
                <td>${pedido.monto_total}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error al cargar los pedidos:', error);
    }
}

// Función para abrir un modal
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

// Función para cerrar un modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Evento para agregar pedido
document.getElementById('addPedido').addEventListener('click', function() {
    openModal('addModal');
});

// Evento para editar pedido
document.getElementById('editPedido').addEventListener('click', function() {
    openModal('editModal');
});

// Evento para eliminar pedido
document.getElementById('deletePedido').addEventListener('click', function() {
    openModal('deleteModal');
});

// Manejo del formulario de agregar pedido
document.getElementById('addPedidoForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const fecha_pedido = document.getElementById('fecha_pedido').value;
    const id_proveedor = document.getElementById('id_proveedor').value;
    const monto_total = document.getElementById('monto_total').value;

    try {
        const response = await fetch('/api/pedidos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fecha_pedido, id_proveedor, monto_total })
        });

        if (!response.ok) throw new Error('Error al agregar pedido');
        closeModal('addModal');
        cargarPedidos(); // Recargar la tabla de pedidos
    } catch (error) {
        console.error('Error al agregar pedido:', error);
    }
});

// Manejo del formulario de editar pedido
document.getElementById('editPedidoForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const id_pedido = document.getElementById('id_pedido_edit').value;
    const fecha_pedido = document.getElementById('fecha_pedido_edit').value;
    const id_proveedor = document.getElementById('id_proveedor_edit').value;
    const monto_total = document.getElementById('monto_total_edit').value;

    try {
        const response = await fetch(`/api/pedidos/${id_pedido}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fecha_pedido, id_proveedor, monto_total })
        });

        if (!response.ok) throw new Error('Error al editar pedido');
        closeModal('editModal');
        cargarPedidos(); // Recargar la tabla de pedidos
    } catch (error) {
        console.error('Error al editar pedido:', error);
    }
});

// Manejo del formulario de eliminar pedido
document.getElementById('deletePedidoForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const id_pedido = document.getElementById('id_pedido_delete').value;

    try {
        const response = await fetch(`/api/pedidos/${id_pedido}`, {
            method: 'DELETE',
        });

        if (!response.ok) throw new Error('Error al eliminar pedido');
        closeModal('deleteModal');
        cargarPedidos(); // Recargar la tabla de pedidos
    } catch (error) {
        console.error('Error al eliminar pedido:', error);
    }
});
