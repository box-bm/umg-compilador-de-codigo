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

## **📌 Operadores Aritmeticos**

```plaintext
let a = 10
let b = 5
let suma = a + b
let resta = a - b
let multiplicacion = a * b
let division = a / b
```

## **📌 Operadores Lógicos (`&&`, `||`, `!`)**

```plaintext
let x = 10
let y = 5
let flag = false

if x > 5 && y < 10 :
    print "Ambas condiciones son verdaderas"

if x > 5 || y > 10 :
    print "Al menos una condición es verdadera"


if !flag :
    print "La condición se invirtió"
```

## **📌 Operadores de comparación**

```plaintext
let a = 10
let b = 5
let igual = a == b      
let diferente = a != b  
let mayor = a > b       
let menor = a < b       
let mayor_igual = a >= b
let menor_igual = a <= b
```

## **📌 Estructuras de control (`if`, `else`)**

```plaintext
let x = 10

if x > 5 :
    print "x es mayor que 5"
else if x < 5 && x > 0 :
    print "x es mayor a 0 y menor a 5"
else:
    print "x es menor o igual a 5"
```

## **📌 Ciclo `while` y `do while`**

```plaintext
// Ciclo while
let x = 3

while x > 0 :
    print x
    x = x - 1
```

## **📌 Ciclo `for`**

```plaintext
# Iteración básica
for i = 1 to 5 :
    print i

# Con paso personalizado
for i = 0 to 10 step 2 :
    print i
```

## **📌 Manejo de indentación en bloques**

```plaintext
let x = 0

if x > 3 :
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
