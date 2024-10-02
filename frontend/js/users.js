// js/users.js

const API_URL = 'http://localhost:5000/api';  // Cambia según tu configuración
const tableContainer = document.getElementById('table-container');
const token = localStorage.getItem('token');

// Función para cargar los usuarios
const cargarUsuarios = async () => {
    try {
        const response = await fetch(`${API_URL}/users`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            let tablaHTML = `<table><thead><tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Role</th>
                            </tr></thead><tbody>`;
            
            data.forEach(user => {
                tablaHTML += `<tr>
                                <td>${user.id_user}</td>
                                <td>${user.username}</td>
                                <td>${user.role}</td>
                            </tr>`;
            });
            
            tablaHTML += `</tbody></table>`;
            tableContainer.innerHTML = tablaHTML;
        } else {
            tableContainer.innerHTML = '<p>Error al cargar los usuarios.</p>';
        }
    } catch (error) {
        console.error('Error al cargar los usuarios:', error);
        tableContainer.innerHTML = '<p>Error al cargar los usuarios.</p>';
    }
};

// Verificar si el usuario es admin
const verificarAdmin = () => {
    const userRole = localStorage.getItem('role');  // Asegúrate de almacenar el rol al iniciar sesión
    if (userRole !== 'admin') {
        alert('No tienes acceso a esta página');
        window.location.href = 'index.html';  // Redirigir si no es admin
    } else {
        cargarUsuarios();  // Cargar usuarios si es admin
    }
};

document.addEventListener('DOMContentLoaded', verificarAdmin);
