import json
import pandas as pd
from sqlalchemy import create_engine
from statsmodels.tsa.arima.model import ARIMA
from prophet import Prophet
from flask import Flask, render_template

# Configuración de la conexión a la base de datos
engine = create_engine('postgresql://postgres:123@localhost:5432/sistema_gestion_inventario')

# Inicializar la aplicación Flask
app = Flask(__name__)

# Obtener datos de ventas
def obtener_datos_ventas():
    query = 'SELECT fecha_venta, monto_total FROM ventas ORDER BY fecha_venta'
    df = pd.read_sql(query, engine)
    df['fecha_venta'] = pd.to_datetime(df['fecha_venta'])
    df.set_index('fecha_venta', inplace=True)
    return df

# Predicción con ARIMA
def prediccion_arima(periodos=30):
    df = obtener_datos_ventas()
    model = ARIMA(df['monto_total'], order=(5, 1, 0))  # Ajusta los parámetros según sea necesario
    model_fit = model.fit()
    forecast = model_fit.forecast(steps=periodos)
    
    forecast_index = pd.date_range(start=df.index[-1] + pd.Timedelta(days=1), periods=periodos, freq='D')
    result = pd.DataFrame(forecast, index=forecast_index, columns=['Predicción'])
    
    return result.to_json(orient='records')

# Predicción con Prophet
def prediccion_prophet(periodos=30):
    df = obtener_datos_ventas().reset_index()
    df.rename(columns={'fecha_venta': 'ds', 'monto_total': 'y'}, inplace=True)
    model = Prophet()
    model.fit(df)
    
    future = model.make_future_dataframe(periods=periodos)
    forecast = model.predict(future)
    
    return forecast[['ds', 'yhat']].to_json(orient='records')

# Función principal para obtener predicciones
def obtener_predicciones(modelo='prophet', periodos=30):
    if modelo == 'arima':
        predicciones = prediccion_arima(periodos)
        print("Predicciones usando ARIMA:")
        print(predicciones)  # Imprimir las predicciones de ARIMA
        return predicciones
    elif modelo == 'prophet':
        predicciones = prediccion_prophet(periodos)
        print("Predicciones usando Prophet:")
        print(predicciones)  # Imprimir las predicciones de Prophet
        return predicciones
    else:
        raise ValueError("Modelo no soportado. Usa 'arima' o 'prophet'.")



# Ruta para la página de predicciones
@app.route('/')
def index():
    modelo = 'prophet'  # Cambia esto a 'arima' si deseas usar ARIMA
    predicciones = obtener_predicciones(modelo=modelo, periodos=30)
    predicciones_df = pd.read_json(predicciones)
    return render_template('predicciones.html', predicciones=predicciones_df.to_dict(orient='records'))

if __name__ == "__main__":
    app.run(debug=True)

# Generar gráficos de las predicciones
import matplotlib.pyplot as plt

def generar_grafico(predicciones, modelo):
    # Convertir la predicción a DataFrame
    predicciones_df = pd.read_json(predicciones)
    
    # Convertir las fechas 'ds' a formato datetime
    if 'ds' in predicciones_df.columns:
        predicciones_df['ds'] = pd.to_datetime(predicciones_df['ds'])
    else:
        print("La columna 'ds' no está presente en las predicciones.")
    
    # Graficar
    plt.figure(figsize=(10, 6))
    plt.plot(predicciones_df['ds'], predicciones_df['yhat'], label='Predicción de demanda', marker='o')
    plt.xlabel('Fecha')
    plt.ylabel('Cantidad Predicha')
    plt.title(f'Predicción de demanda usando {modelo}')
    plt.legend()
    plt.grid(True)
    plt.show()
