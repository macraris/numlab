# Capitolo 26 - Funzione con parametro
# La funzione quadrato cambia in base al lato.

from turtle import *

title("22 - Quadrato con parametro")
shape("turtle")
pensize(3)
speed(3)

def quadrato(lato):
    for i in range(4):
        forward(lato)
        right(90)

colori = ["red", "orange", "gold", "green", "blue", "purple"]

for n in range(6):
    color(colori[n])
    quadrato(30 + n * 25)

done()
