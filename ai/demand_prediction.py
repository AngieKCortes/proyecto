import pandas as pd
import numpy as np
from statsmodels.tsa.arima.model import ARIMA
from prophet import Prophet
from sqlalchemy import create_engine

# Conexión a la base de datos PostgreSQL
engine = create_engine('postgresql://usuario:contraseña@localhost:5432/sistema_gestion_inventario')

# Función para obtener los datos de ventas de la base de datos
def obtener_datos_ventas():
    query = """
    SELECT fecha_venta, SUM(cantidad) AS cantidad_total
    FROM ventas v
    JOIN detalle_ventas dv ON v.id_venta = dv.id_venta
    GROUP BY fecha_venta
    ORDER BY fecha_venta
    """
    df = pd.read_sql(query, engine)
    df['fecha_venta'] = pd.to_datetime(df['fecha_venta'])
    df.set_index('fecha_venta', inplace=True)
    return df

# Función para predicción usando ARIMA
def prediccion_arima(df, periodos_prediccion=30):
    modelo = ARIMA(df['cantidad_total'], order=(5, 1, 0))
    modelo_entrenado = modelo.fit()
    predicciones = modelo_entrenado.forecast(steps=periodos_prediccion)
    return predicciones

# Función para predicción usando Prophet
def prediccion_prophet(df, periodos_prediccion=30):
    df_prophet = df.reset_index().rename(columns={'fecha_venta': 'ds', 'cantidad_total': 'y'})
    modelo = Prophet()
    modelo.fit(df_prophet)
    futuro = modelo.make_future_dataframe(periods=periodos_prediccion)
    forecast = modelo.predict(futuro)
    return forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']]

# Función principal para obtener predicciones
def obtener_predicciones(modelo='prophet', periodos=30):
    df = obtener_datos_ventas()
    
    if modelo == 'arima':
        predicciones = prediccion_arima(df, periodos)
    elif modelo == 'prophet':
        predicciones = prediccion_prophet(df, periodos)
    else:
        raise ValueError("Modelo no soportado. Usa 'arima' o 'prophet'.")
    
    return predicciones

if __name__ == "__main__":
    # Ejemplo: Obtener predicciones usando Prophet para los próximos 30 días
    predicciones_prophet = obtener_predicciones(modelo='prophet', periodos=30)
    print(predicciones_prophet)
