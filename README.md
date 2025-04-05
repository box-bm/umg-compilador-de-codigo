# 🛠️ Compilador - Proyecto Final de Compiladores

Este proyecto consiste en el desarrollo de un compilador completo para un lenguaje de programación nuevo, diseñado desde cero por nuestro equipo. Implementado en **TypeScript**, el compilador incluye las siguientes fases: análisis léxico, sintáctico y semántico, junto con una posible generación de código intermedio o final.

## 🧠 Objetivo del Proyecto

- Comprender e implementar todas las fases fundamentales de un compilador.
- Diseñar la gramática y sintaxis de un lenguaje propio.
- Aplicar conocimientos sobre teoría de lenguajes formales y autómatas.
- Fortalecer habilidades prácticas con estructuras de datos, manejo de errores y transformaciones de código.

## 📦 Estructura del Proyecto

```bash
.
├── src/
│   ├── lexer/           # Analizador léxico (tokenizador)
│   ├── parser/          # Analizador sintáctico (parser)
│   ├── semantic/        # Analizador semántico
│   ├── ast/             # Árbol de sintaxis abstracta
│   ├── utils/           # Utilidades comunes
│   └── main.ts          # Punto de entrada del compilador
├── tests/               # Casos de prueba
├── docs/                # Documentación del lenguaje
└── README.md            # Este archivo
```

📌 Fases del Compilador

 1. Análisis léxico
Se identifican los tokens del lenguaje usando expresiones regulares.
 2. Análisis sintáctico
Se construye el árbol de sintaxis basado en la gramática definida.
 3. Análisis semántico
Se validan reglas semánticas como tipos, declaraciones, usos de variables, etc.
 4. (Opcional) Generación de código
Se traduce el árbol semántico a código intermedio o de máquina.

🧪 Tecnologías Usadas
 • TypeScript
 • Node.js
 • Jest (para pruebas unitarias)
 • Herramientas personalizadas para análisis léxico/sintáctico

📋 Tabla de Integrantes

| Nombre          | Carné         | Rol          |
|-----------------|---------------|--------------|
| Brandon Manzo   | 0900-18-502 | Coordinado |

## 🚀 Cómo Ejecutar el Proyecto

```md
# Instalar dependencias
npm install

# Ejecutar compilador
npm run start archivoFuente.txt

# Correr pruebas
npm run test
```

🧾 Licencia

Este proyecto es parte de la materia de Compiladores del Universidad Mariano Galvez y es de uso educativo.
