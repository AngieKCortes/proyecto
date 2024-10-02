import plotly.graph_objects as go
import pandas as pd
from demand_prediction import obtener_predicciones

# Función para graficar predicciones interactivas
def graficar_predicciones_interactivas(modelo='prophet', periodos=30):
    predicciones = obtener_predicciones(modelo, periodos)

    fig = go.Figure()

    if modelo == 'prophet':
        # Para Prophet
        fig.add_trace(go.Scatter(x=predicciones['ds'], y=predicciones['yhat'], mode='lines', name='Predicción'))
        fig.add_trace(go.Scatter(x=predicciones['ds'], y=predicciones['yhat_lower'], mode='lines', fill='tonexty', name='Límite inferior', line=dict(color='lightgrey')))
        fig.add_trace(go.Scatter(x=predicciones['ds'], y=predicciones['yhat_upper'], mode='lines', fill='tonexty', name='Límite superior', line=dict(color='lightgrey')))

    elif modelo == 'arima':
        # Para ARIMA
        fig.add_trace(go.Scatter(x=predicciones.index, y=predicciones, mode='lines', name='Predicción'))

    fig.update_layout(title=f'Predicción de demanda usando {modelo.capitalize()}',
                      xaxis_title='Fecha',
                      yaxis_title='Cantidad predicha')
    fig.show()

if __name__ == "__main__":
    graficar_predicciones_interactivas(modelo='prophet', periodos=30)
