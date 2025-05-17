# Lenguaje soportado

Para el compilador, hemos creado un lenguaje sencillo y facil de entender para el compilador, el cual no es un lenguaje complejo pero si que puede llevar operaciones logicas.

## **📌 Declaración de variables (`let` y `const`)**

```plaintext
let x = 10
const y = "Hola"

print x
print y

x = 5   // ✅ Permitido (x es una variable mutable)
y = "Adiós"   // ❌ Error (y es constante)
```

## **📌 Estructuras de control (`if`, `else`)**

```plaintext
x = 10

if x > 5:
    print "x es mayor que 5"
else:
    print "x es menor o igual a 5"
```

## **📌 Ciclo `while` y `do while`**

```plaintext
// Ciclo while
let x = 3

while x > 0:
    print x
    x = x - 1

// Ciclo do while (ejecuta al menos una vez)
let y = 5

do:
    print y
    y = y - 1
while y > 0
```

## **📌 Ciclo `for`**

```plaintext
// Iteración básica
for i = 1 to 5:
    print i

// Con paso personalizado
for i = 0 to 10 step 2:
    print i
```

## **📌 Switch y Case**

```plaintext
let opcion = 2

switch opcion:
    case 1:
        print "Elegiste opción 1"
    case 2:
        print "Elegiste opción 2"
    case 3:
        print "Elegiste opción 3"
    default:
        print "Opción no válida"
```

## **📌 Operadores Lógicos (`&&`, `||`, `!`)**

```plaintext
let x = 10
let y = 5

if x > 5 && y < 10:
    print "Ambas condiciones son verdaderas"

if x > 5 || y > 10:
    print "Al menos una condición es verdadera"

let flag = false

if !flag:
    print "La condición se invirtió"
```

## **📌 Manejo de indentación en bloques**

```plaintext
if x > 3:
    print "x es mayor que 3"
    let y = x * 2
    print y
print "Fin del programa"
```

## Comentarios

```plaintext
# Este es un comentario de una sola línea
let x = 10  # Asignación de valor a x
print x  # Mostrar el valor de x
```
