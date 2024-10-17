import json
import pandas as pd
from sqlalchemy import create_engine
from prophet import Prophet
from flask import Flask, render_template
import plotly.graph_objects as go

# Configuración de la conexión a la base de datos
engine = create_engine('postgresql://postgres:123@localhost:5432/sistema_gestion_inventario')

# Inicializar la aplicación Flask
app = Flask(__name__)

# Función para graficar las predicciones
def graficar_predicciones_interactivas(predicciones):
    predicciones_df = pd.read_json(predicciones)
    fechas = predicciones_df['ds']
    valores = predicciones_df['yhat']

    fig = go.Figure()
    fig.add_trace(go.Scatter(x=fechas, y=valores, mode='lines+markers', name='Predicción', line=dict(color='orange')))
    
    fig.update_layout(title='Predicción de Demanda',
                      xaxis_title='Fecha',
                      yaxis_title='Cantidad Predicha',
                      plot_bgcolor='rgba(0,0,0,0)',
                      paper_bgcolor='rgba(0,0,0,0)',
                      font=dict(color='black'))
    
    fig.show()

# Obtener datos de ventas
def obtener_datos_ventas():
    query = 'SELECT fecha_venta, monto_total FROM ventas ORDER BY fecha_venta ASC'  # Cambiar a ASC
    df = pd.read_sql(query, engine)
    df['fecha_venta'] = pd.to_datetime(df['fecha_venta'])
    
    # Agrupar por fecha y sumar solo la columna 'monto_total'
    df_grouped = df.groupby(df['fecha_venta'].dt.date)['monto_total'].sum()  # Agrupar por día y sumar los montos
    df_grouped.index = pd.to_datetime(df_grouped.index)  # Convertir el índice a formato datetime
    return df_grouped



# Predicción con Prophet
def prediccion_prophet(periodos=365):
    df = obtener_datos_ventas().reset_index()
    df.rename(columns={'fecha_venta': 'ds', 'monto_total': 'y'}, inplace=True)
    model = Prophet()
    model.fit(df)
    
    future = model.make_future_dataframe(periods=365)
    forecast = model.predict(future)
    
    # Formatear fecha y redondear predicción
    forecast['ds'] = forecast['ds'].dt.strftime('%Y-%m-%d')  # Formatear fecha
    forecast['yhat'] = forecast['yhat'].round(0)  # Redondear predicción a 2 decimales
    
    return forecast[['ds', 'yhat']].to_json(orient='records')

# Función principal para obtener predicciones
def obtener_predicciones(modelo='prophet', periodos=30):
    predicciones = prediccion_prophet(periodos)
    graficar_predicciones_interactivas(predicciones)  # Graficar después de obtener las predicciones
    return predicciones

# Ruta para la página de predicciones
@app.route('/')
def index():
    modelo = 'prophet'  # Cambia esto si quieres otro modelo en el futuro
    predicciones = obtener_predicciones(modelo=modelo, periodos=365)
    predicciones_df = pd.read_json(predicciones)

    return render_template('predicciones.html', predicciones=predicciones_df.to_dict(orient='records'))

if __name__ == "__main__":
    app.run(debug=True)
