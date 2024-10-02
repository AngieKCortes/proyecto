document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/predicciones')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#prediccionesTable tbody');
            data.forEach(prediccion => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${prediccion.fecha_prediccion}</td>
                    <td>${prediccion.producto}</td>
                    <td>${prediccion.cantidad_predicha}</td>
                    <td><button class="view">Ver Detalles</button></td>
                `;
                tableBody.appendChild(row);
            });
        });
});

document.getElementById('generatePrediction').addEventListener('click', function() {
    // Aquí podrías hacer una petición para generar una predicción con IA
    alert('Generar predicción en progreso...');
});
