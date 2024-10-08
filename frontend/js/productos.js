document.addEventListener('DOMContentLoaded', async () => {
    // Cargar los productos al inicio
    await cargarProductos();
});
// Función para cargar los productos en la tabla
async function cargarProductos() {
    try {
        const response = await fetch('/api/productos');
        if (!response.ok) throw new Error('Error en la respuesta de la red');

        const productos = await response.json();
        const tableBody = document.querySelector('#productosTable tbody');
        tableBody.innerHTML = '';

        productos.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.id_producto}</td>  <!-- Mostrar el ID del producto -->
                <td>${product.nombre}</td>
                <td>${product.descripcion}</td>
                <td>${product.precio}</td>
                <td>${product.cantidad_stock}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}


// Función para abrir el modal
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

// Función para cerrar el modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Función para manejar el formulario de agregar producto
document.getElementById('addProductForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;
    const precio = document.getElementById('precio').value;
    const cantidad_stock = document.getElementById('cantidad_stock').value;
    const id_categoria = document.getElementById('id_categoria').value;

    if (nombre && descripcion && precio && cantidad_stock && id_categoria) {
        try {
            const response = await fetch('/api/productos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nombre, descripcion, precio, cantidad_stock, id_categoria })
            });

            if (!response.ok) throw new Error('Error al agregar el producto');
            alert('Producto agregado con éxito');
            cargarProductos(); // Recargar la tabla
            closeModal('addModal');
        } catch (error) {
            console.error('Error al agregar producto:', error);
        }
    }
});

// Función para manejar el formulario de editar producto
document.getElementById('editProductForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const id_producto = document.getElementById('id_producto').value;
    const nombre = document.getElementById('nombre_edit').value;
    const descripcion = document.getElementById('descripcion_edit').value;
    const precio = document.getElementById('precio_edit').value;
    const cantidad_stock = document.getElementById('cantidad_stock_edit').value;
    const id_categoria = document.getElementById('id_categoria_edit').value;

    if (id_producto && (nombre || descripcion || precio || cantidad_stock || id_categoria)) {
        try {
            const response = await fetch(`/api/productos/${id_producto}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nombre, descripcion, precio, cantidad_stock, id_categoria })
            });

            if (!response.ok) throw new Error('Error al editar el producto');
            alert('Producto actualizado con éxito');
            cargarProductos(); // Recargar la tabla
            closeModal('editModal');
        } catch (error) {
            console.error('Error al editar producto:', error);
        }
    }
});

// Función para manejar el formulario de eliminar producto
document.getElementById('deleteProductForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const id_producto = document.getElementById('id_producto_delete').value;

    if (id_producto) {
        try {
            const response = await fetch(`/api/productos/${id_producto}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) throw new Error('Error al eliminar el producto');
            alert('Producto eliminado con éxito');
            cargarProductos(); // Recargar la tabla
            closeModal('deleteModal');
        } catch (error) {
            console.error('Error al eliminar producto:', error);
        }
    }
});


// Abrir modales para agregar, editar y eliminar productos
document.getElementById('addProduct').addEventListener('click', function () {
    openModal('addModal');
});

document.getElementById('editProduct').addEventListener('click', function () {
    openModal('editModal');
});

document.getElementById('deleteProduct').addEventListener('click', function () {
    openModal('deleteModal');
});

// Actualizar tabla de productos
document.getElementById('updateProduct').addEventListener('click', async function () {
    await cargarProductos();
});
