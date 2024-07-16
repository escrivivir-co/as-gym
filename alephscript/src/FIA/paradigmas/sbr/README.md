# Sistemas Basados en Reglas (SBR)

Activa modo copiar markdown. Crea dos secciones una para una breve disertación docente y otra un ejemplo concreto de programación lógica.

En 500 palabras máximo, sobre los Sistemas Basados en Reglas. En especial, programación lógica con Prolog. Crea una pequeña base de conocimiento que tenga una variable _Elefantes_cantando. La base de conocimiento permitirá iniciar la siguiente conversación con el asistente Prolog:

- Hola, soy Prolog y sé cantar lo de los "elefantes". ¿Te lo canto?
- Cantar(x_Elefantes)
- x_Elefantes se balanceaban (...) como veían que no se rompía fueron a llamar. (x_Elefantes + 1). ¿Sigo cantando?
- Cantar(x_Elefantes)
- etc...

**NOTA: A CONTINUACIÓN SE IMPRIME EN SU VERSIÓN 0.0.1 TUTORIAL DE PROLOG CON CHATGPT4. EL CÓDIGO NO HA SIDO REVISADO POR UN HUMANO A FEBRERO DE 2024 (at your own, experimental purpose only)**

Para la **PEC2 de FIA participamos en un concurso**, las 3 mejores prácticas llevarán premio de un mini-robot ("muy mini", especifica el enunciado ya liberado en el Curso Virtual). Cada año esta práctica cerebra un certamen que, digamos, para capear con la IA, invoca lo humano demasiado humano que podamos codificar en Prologo. Al menos unos pocos **hechos**, al menos **unas pocas reglas**, al menos **unas pocas variables**, etc. Al final, se trata de usar el  conversacional de Prolog para poesía o algo creativo. Humor o divulganción. Ya digo, los 3 mejores artefactos se llevan *reward*.

Paradójicamente, y me flipo con esto, a febrero de 2024 **el equipo docente decide lo de "hazlo en papel" no uses IDE que la máquina es el demonio y te disocia de la tranquilidad sapiens!** O algo así. Terminantemente prohibido usar IA Generativa. Así que,... nada de lo que ponga aquí podrá ser usado en la práctica. Y, sin embargo, no pondré una venda en los ojos para no "tocar" al "maligno", :-D... dicho esto: ChatGPT-4, ¿Ready: LFG (let's ******* go)?

## Breve disertación docente sobre Sistemas Basados en Reglas y Programación Lógica con Prolog
Los sistemas basados en reglas son un pilar fundamental de la inteligencia artificial (IA), ofreciendo un marco para la representación del conocimiento y la inferencia en dominios específicos. Estos sistemas utilizan un conjunto de reglas, donde cada regla asocia condiciones con conclusiones o acciones. La programación lógica, y especialmente Prolog (Programming in Logic), es un paradigma de programación que encarna el concepto de sistemas basados en reglas a través de su enfoque en la lógica formal.

Prolog es distinguido por su capacidad para manejar relaciones y reglas de una manera que es tanto declarativa como expresiva. A diferencia de los lenguajes de programación imperativos, donde se describe cómo se debe realizar una tarea, en Prolog se describe qué es lo que se desea obtener o probar, dejando al sistema de Prolog la tarea de determinar cómo alcanzar ese objetivo. Esto se logra mediante el uso de hechos y reglas que constituyen la base de conocimiento del sistema.

En Prolog, los hechos representan afirmaciones sobre objetos o situaciones del mundo, mientras que las reglas definen relaciones entre esos hechos, permitiendo deducciones lógicas. Un programa Prolog intenta satisfacer consultas basándose en esta base de conocimiento, aplicando un mecanismo de inferencia conocido como unificación, que busca coincidencias entre la consulta y los hechos o reglas definidos, aplicando recursivamente las reglas para derivar nuevas conclusiones.

Esta capacidad hace de Prolog una herramienta poderosa para el desarrollo de sistemas expertos, análisis de lenguaje natural, y en general, cualquier aplicación que se beneficie de la representación del conocimiento y el razonamiento automático.

Ejemplo concreto de programación lógica: Cantando Elefantes en Prolog
Consideremos una pequeña base de conocimiento en Prolog que modela la conocida canción de los elefantes. La variable Elefantes_cantando representa el número de elefantes que están cantando en un momento dado. La base de conocimiento permitirá interactuar con el usuario para "cantar" la canción de los elefantes, aumentando el número de elefantes a medida que avanza la canción.

## Ejemplo concreto de programación lógica: Cantando Elefantes en Prolog
Consideremos **una pequeña base de conocimiento en Prolog que modela la conocida canción de los elefantes**. **La variable Elefantes_cantando representa el número de elefantes que están cantando** en un momento dado. La base de conocimiento permitirá interactuar con el usuario para "cantar" la canción de los elefantes, aumentando el número de elefantes a medida que avanza la canción.


```prolog
% Base de conocimiento inicial
cantar(0). % Caso base, cero elefantes no se balancean

% Regla para cantar la canción
cantar(Elefantes_cantando) :-
    Elefantes_cantando > 0, % Asegurar un número positivo de elefantes
    write(Elefantes_cantando), write(' elefante(s) se balanceaban...'), nl,
    write('Como veían que no se rompía, fueron a llamar a otro elefante.'), nl,
    NuevoNum is Elefantes_cantando + 1, % Incrementar el número de elefantes
    cantar(NuevoNum). % Recursividad para seguir cantando
```

Este sencillo ejemplo ilustra cómo Prolog puede utilizarse para crear una interacción basada en reglas, donde la lógica del programa se describe a través de relaciones y patrones de recursividad. **A través de la consulta cantar(x_Elefantes), el programa inicia la canción con x_Elefantes y continúa incrementando el número**, ilustrando el poder de la programación lógica para manejar tanto la interacción como la recursividad de una manera declarativa.

Ejemplo de llamada:
```
cantar(0).
```

## Breve disertación docente sobre Extensiones en Sistemas Basados en Reglas para la Programación Lógica con Prolog
La extensión de sistemas basados en reglas para manejar contextos o condiciones adicionales es una muestra del poder y flexibilidad de la programación lógica, particularmente con Prolog. Este enfoque permite adaptar y modificar el comportamiento del sistema de manera dinámica, en función de nuevas reglas o hechos que se introduzcan en la base de conocimiento. En el caso de Prolog, esto se traduce en la capacidad de ajustar la lógica del programa para manejar diferentes escenarios o condiciones sin cambiar su estructura fundamental.

La inclusión de condiciones como el tiempo (día o noche) en un programa Prolog ilustra cómo se pueden manejar situaciones diversas mediante reglas específicas. Esto no solo aumenta la complejidad de las interacciones posibles sino que también demuestra la capacidad de Prolog para representar y razonar con conocimiento contextual. La programación lógica brinda una manera elegante y eficiente de encapsular variaciones en el comportamiento del programa, basándose en el principio de que las conclusiones se derivan lógicamente de premisas definidas.

Esta adaptabilidad hace de Prolog una herramienta valiosa para desarrollar sistemas expertos y aplicaciones de IA que requieren la capacidad de ajustarse a nuevas informaciones o cambios en el entorno, manteniendo un núcleo lógico coherente y fácil de modificar.

## Ejemplo concreto de programación lógica: Adaptando la Canción de los Elefantes a Día y Noche en Prolog
Extendemos la base de conocimiento previa para incluir la noción de día y noche, modificando la canción de los elefantes en función de este contexto. La nueva regla determinará si se añade o se despide a un elefante basándose en si es de día o de noche.


```prolog
% Hechos para definir el estado actual (día o noche)
es_de_dia(true).
es_de_noche(false).

% Regla base para cantar con cero elefantes
cantar(0, _) :- write('No hay elefantes para balancearse.'). % Caso base modificado para ajustarse a la nueva estructura

% Reglas para cantar la canción de día
cantar(Elefantes_cantando, Dia) :-
    es_de_dia(Dia),
    Elefantes_cantando > 0, % Asegurar un número positivo de elefantes
    write(Elefantes_cantando), write(' elefante(s) se balanceaban...'), nl,
    write('Como veían que no se rompía, fueron a llamar a otro elefante.'), nl,
    NuevoNum is Elefantes_cantando + 1,
    cantar(NuevoNum, Dia).

% Reglas para cantar la canción de noche
cantar(Elefantes_cantando, Noche) :-
    es_de_noche(Noche),
    Elefantes_cantando > 1, % Asegurar que hay más de un elefante para poder despedir
    write(Elefantes_cantando), write(' elefante(s) se balanceaban...'), nl,
    write('Como veían que no se rompía, despidieron a un elefante.'), nl,
    NuevoNum is Elefantes_cantando - 1,
    cantar(NuevoNum, Noche).

cantar(1, Noche) :- % Caso especial para cuando queda un solo elefante de noche
    es_de_noche(Noche),
    write('1 elefante se balanceaba...'), nl,
    write('Como veía que no se rompía, pero ya no había más elefantes para despedir.').
```
Este código introduce **un nivel adicional de complejidad y flexibilidad, permitiendo que la canción se adapte según sea de día o de noche**, demostrando así la potencia de Prolog para manejar lógica condicional y contextos variables de forma elegante y efectiva. **La consulta ahora requiere especificar el segundo argumento para indicar si es de día o de noche**, ejemplificando cómo Prolog maneja situaciones dinámicas mediante la adición de reglas y hechos que refinen su comportamiento.

Ejemplo de llamada:
```
cantar(5, false).
```

## ¿Qué hora es? Si a.m., quita elefantes, si p.m., agrega

Para modificar la base de conocimiento de manera que la decisión de aumentar o disminuir el número de elefantes se base en la hora del día (A.M. o P.M.) en lugar de un simple booleano, necesitamos introducir una manera de interpretar las horas en términos de estos periodos. En Prolog, podemos lograr esto definiendo reglas adicionales que determinen si una hora dada cae en el rango A.M. (de 0 a 11 horas) o P.M. (de 12 a 23 horas).

Primero, ajustaremos la regla cantar para que acepte un segundo parámetro que represente la hora del día (en formato de 24 horas). Luego, utilizaremos este parámetro para decidir si se añade o se despide a un elefante basándonos en si la hora corresponde a A.M. o P.M.

Para modificar la base de conocimiento de manera que la decisión de aumentar o disminuir el número de elefantes se base en la hora del día (A.M. o P.M.) en lugar de un simple booleano, necesitamos introducir una manera de interpretar las horas en términos de estos periodos. En Prolog, podemos lograr esto definiendo reglas adicionales que determinen si una hora dada cae en el rango A.M. (de 0 a 11 horas) o P.M. (de 12 a 23 horas).

Primero, ajustaremos la regla cantar para que acepte un segundo parámetro que represente la hora del día (en formato de 24 horas). Luego, utilizaremos este parámetro para decidir si se añade o se despide a un elefante basándonos en si la hora corresponde a A.M. o P.M.

Aquí te muestro cómo podrías hacer estos ajustes:


```prolog
% Determina si es A.M. o P.M. basado en la hora
es_am(Hora) :- Hora >= 0, Hora < 12.
es_pm(Hora) :- Hora >= 12, Hora < 24.

% Regla base para cantar con cero elefantes
cantar(0, _) :- write('No hay elefantes para balancearse.').

% Reglas para cantar la canción en A.M. (incrementar elefantes)
cantar(Elefantes_cantando, Hora) :-
    es_am(Hora),
    Elefantes_cantando > 0,
    write(Elefantes_cantando), write(' elefante(s) se balanceaban...'), nl,
    write('Como veían que no se rompía, fueron a llamar a otro elefante.'), nl,
    NuevoNum is Elefantes_cantando + 1,
    cantar(NuevoNum, Hora).

% Reglas para cantar la canción en P.M. (disminuir elefantes)
cantar(Elefantes_cantando, Hora) :-
    es_pm(Hora),
    Elefantes_cantando > 1,
    write(Elefantes_cantando), write(' elefante(s) se balanceaban...'), nl,
    write('Como veían que no se rompía, despidieron a un elefante.'), nl,
    NuevoNum is Elefantes_cantando - 1,
    cantar(NuevoNum, Hora).

cantar(1, Hora) :-
    es_pm(Hora),
    write('1 elefante se balanceaba...'), nl,
    write('Como veía que no se rompía, pero ya no había más elefantes para despedir.').
```

Este ejemplo ilustra cómo la programación lógica con Prolog puede manejar condiciones basadas en el tiempo de manera eficaz, permitiendo ajustes dinámicos en la lógica del programa basados en la hora del día. Ahora, el 2ndo parámetro deberá ser una hora válida entre 0 y 23 horas.

````
cantar(3, 10)
```