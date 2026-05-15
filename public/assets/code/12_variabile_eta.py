# Capitolo 15 - Variabili come scatole con etichetta
# Disegna un quadrato usando una variabile "lato".

from turtle import *

title("12 - Variabili")
shape("turtle")
color("crimson")
pensize(4)

lato = 80   # la nostra scatola contiene 80

for i in range(4):
    forward(lato)
    right(90)

# Adesso cambiamo cio che c'e dentro la scatola
penup()
goto(-200, 0)
pendown()
color("teal")
lato = 150

for i in range(4):
    forward(lato)
    right(90)

done()
