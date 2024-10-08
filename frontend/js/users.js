const tableBody = document.querySelector('#usersTable tbody');
let selectedUserId = null;  // Para almacenar el ID del usuario a cambiar la contraseña

// Cargar los usuarios al inicio
document.addEventListener("DOMContentLoaded", () => {
    cargarUsuarios();
});

// Función para cargar los usuarios en la tabla
async function cargarUsuarios() {
    try {
        const response = await fetch('/api/users', {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Error en la respuesta de la red');

        const usuarios = await response.json();

        tableBody.innerHTML = '';  // Limpiar la tabla antes de cargar nuevos datos

        usuarios.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id_usuario}</td>
                <td>${user.username}</td>
                <td>${user.rol || 'Usuario'}</td>
                <td>
                    <button class="btn-password" data-id="${user.id_usuario}">Olvidar Contraseña</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Añadir eventos a los botones de cambiar contraseña
        document.querySelectorAll('.btn-password').forEach(button => {
            button.addEventListener('click', (e) => {
                selectedUserId = e.target.getAttribute('data-id');
                openPasswordModal();  // Abrir el modal de cambiar contraseña
            });
        });
    } catch (error) {
        console.error('Error al cargar los usuarios:', error);
    }
}

// Función para abrir el modal de cambiar contraseña
function openPasswordModal() {
    document.getElementById('passwordModal').style.display = 'block';
}

// Función para cerrar el modal de cambiar contraseña
function closePasswordModal() {
    document.getElementById('passwordModal').style.display = 'none';
}

// Función para abrir el modal de agregar usuario
document.getElementById('addUser').addEventListener('click', () => {
    openUserModal();
});

// Función para abrir el modal de agregar/editar usuario
function openUserModal() {
    document.getElementById('userModal').style.display = 'block';
}

// Función para cerrar el modal de agregar/editar usuario
function closeUserModal() {
    document.getElementById('userModal').style.display = 'none';
}

// Cambiar visibilidad de la contraseña
function togglePasswordVisibility() {
    const passwordField = document.getElementById('newPassword');
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);
}

// Cambiar contraseña
document.getElementById('passwordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const newPassword = document.getElementById('newPassword').value;

    if (newPassword && selectedUserId) {
        try {
            const response = await fetch(`/api/users/${selectedUserId}/password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password: newPassword })
            });

            if (!response.ok) throw new Error('Error al cambiar la contraseña');
            alert('Contraseña cambiada exitosamente');
            closePasswordModal();
        } catch (error) {
            console.error('Error al cambiar la contraseña:', error);
        }
    }
});

// Agregar nuevo usuario
document.getElementById('userForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id_usuario = document.getElementById('id_usuario').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const rol = document.getElementById('rol').value;

    if (username && password && rol) {
        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id_usuario, username, password, rol })
            });

            if (!response.ok) throw new Error('Error al agregar el usuario');
            alert('Usuario agregado con éxito');
            closeUserModal();
            cargarUsuarios(); // Recargar la tabla de usuarios
        } catch (error) {
            console.error('Error al agregar usuario:', error);
        }
    }
});

// Confirmar eliminación de usuario
document.getElementById('deleteUser').addEventListener('click', () => {
    openDeleteModal(); // Abre el modal de eliminación
});

// Modal para confirmar eliminación
function openDeleteModal() {
    document.getElementById('deleteModal').style.display = 'block';
}

// Cerrar modal de eliminación
function closeDeleteModal() {
    document.getElementById('deleteModal').style.display = 'none';
}

// Eliminar usuario
document.getElementById('deleteForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const deleteId = document.getElementById('deleteId').value;
    const deleteUsername = document.getElementById('deleteUsername').value;
    const deleteRole = document.getElementById('deleteRole').value;
    const deletePassword = document.getElementById('deletePassword').value;

    if (deleteId && deleteUsername && deleteRole && deletePassword) {
        try {
            const response = await fetch(`/api/users/${deleteId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: deleteUsername, rol: deleteRole, password: deletePassword })
            });

            if (!response.ok) throw new Error('Error al eliminar el usuario');
            alert('Usuario eliminado con éxito');
            closeDeleteModal();
            cargarUsuarios(); // Recargar la tabla de usuarios
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
        }
    }
});
