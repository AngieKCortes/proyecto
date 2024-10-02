# Documentación de Arquitectura del Sistema

## 1. Visión general
El sistema se basa en una arquitectura cliente-servidor con una base de datos PostgreSQL, un backend en Node.js y un frontend en JavaScript. Los modelos de predicción de demanda están implementados en Python.

## 2. Componentes del sistema
### 2.1 Backend
- Implementado en Node.js
- Conexión a PostgreSQL usando `pg`
- Lógica de negocios implementada en las rutas y controladores

### 2.2 Frontend
- Utiliza HTML, CSS y JavaScript
- Se comunica con el backend mediante solicitudes HTTP (fetch API)

### 2.3 IA
- Los modelos de predicción se implementan usando ARIMA y Prophet en Python.
- La visualización de datos se realiza con Matplotlib y Plotly.

## 3. Diagrama de arquitectura

(Insertar un diagrama de arquitectura aquí)

