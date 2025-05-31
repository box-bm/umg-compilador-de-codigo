# 🛠️ Compilador - Proyecto Final de Compiladores

Este proyecto es un compilador para un lenguaje de programación diseñado específicamente para el curso de Compiladores en la Universidad Mariano Gálvez. El objetivo es implementar un compilador que pueda analizar, interpretar y optimizar código escrito en este lenguaje.

## Lenguaje de Programación: Octane

Octane es un lenguaje de programación diseñado para ser simple y fácil de entender, ideal para estudiantes que están aprendiendo sobre compiladores. Su sintaxis se inspira en Python, pero con características simplificadas para facilitar el análisis y la interpretación.

## Guia del lenguaje

Hemos diseñado un lenguaje de programacion basico, basado en python y simplificado. Para tener una guia puedes ver [Documentacion del lenguaje](./Lenguaje.md) para saber como se debe de programar con dicho lenguaje.

## 🧠 Objetivo del Proyecto

- Comprender e implementar todas las fases fundamentales de un compilador.
- Diseñar la gramática y sintaxis de un lenguaje propio.
- Aplicar conocimientos sobre teoría de lenguajes formales y autómatas.
- Fortalecer habilidades prácticas con estructuras de datos, manejo de errores y transformaciones de código.

## 📦 Estructura del Proyecto

Cada archivo esta seguido de su archivo de test con jest.

```bash
├── src/
│   ├── main                        # Punto de inicio del programa
│   ├── web                         # directorio para la interfaz web
│   └── core/                       # Almacena todo el core del sistema
│     ├── AnalizadorLexico
│     ├── AnalizadorSemantico
│     └── AnalizadorSemantico
└── README.md                       # Este archivo
```

# 📌 Fases del Compilador

1.  Análisis léxico
    Se identifican los tokens del lenguaje usando expresiones regulares.
2.  Análisis sintáctico
    Se construye el árbol de sintaxis basado en la gramática definida.
3.  Análisis semántico
    Se validan reglas semánticas como tipos, declaraciones, usos de variables, etc.
4.  Generador de codigo intermedio 
    Se genera un código intermedio que representa la lógica del programa.

🧪 Tecnologías Usadas
• TypeScript
• Node.js
• Jest (para pruebas unitarias)
• Herramientas personalizadas para análisis léxico/sintáctico

📋 Tabla de Integrantes

| Nombre              | Carné         | Rol         | Colaboracion                                      |
| ------------------- | ------------- | ----------- | ------------------------------------------------- |
| Brandon Manzo       | 0900-18-502   | Coordinador | Test Unitarios, Analizador Semantico              |
| Josue ApénBal       | 0900-17-2948  | Dev         | Creacion de Analizador Sintactico / Documentacion |
| Josue Camey         | 0900-19-4828  | Dev         | Ide web / Documentacion                           |
| Alan Estrada        | 0900-22-18429 | Dev         | Creacion de Analizador Lexico / Documentacion     |
| Alejandro Hernandez | 0900-18-1082  | Dev         | Optimizador de codigo / Documentacion             |

## 🚀 Cómo Ejecutar el Proyecto

```md
# Instalar dependencias

npm install

# Ejecutar compilador

npm run dev

# Correr pruebas

npm run test
```

🧾 Licencia

Este proyecto es parte de la materia de Compiladores del Universidad Mariano Galvez y es de uso educativo.
