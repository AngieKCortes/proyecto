document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Evitar que el formulario se envíe de forma tradicional

    // Obtener los valores de usuario y contraseña
    const username = document.getElementById('username').value.trim(); // Eliminar espacios en blanco
    const password = document.getElementById('password').value.trim(); // Eliminar espacios en blanco

    // Verificar que los campos no estén vacíos
    if (!username || !password) {
        alert('Por favor, completa todos los campos.');
        return; // Salir de la función si hay campos vacíos
    }

    // Hacer la solicitud de inicio de sesión
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password }) // Enviar datos en formato JSON
    });

    // Verificar la respuesta del servidor
    if (response.ok) {
        const data = await response.json(); // Asumiendo que la respuesta es un JSON
        // Guardar el token o información de sesión, si es necesario
        localStorage.setItem('token', data.token); // Ajusta según tu respuesta real
        window.location.href = '/dashboard.html'; // Redirigir a dashboard
    } else {
        const errorData = await response.json(); // Obtener detalles del error, si es proporcionado
        alert(`Error: ${errorData.message || 'Hubo un problema al iniciar sesión'}`); // Mostrar mensaje de error
    }
});
