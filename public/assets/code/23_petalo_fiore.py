# Capitolo 26 - Funzioni che si chiamano a vicenda
# petalo() e fiore() insieme.

from turtle import *

title("23 - Fiore di funzioni")
shape("turtle")
speed(0)
pensize(2)

def petalo(colore):
    color(colore)
    for i in range(2):
        circle(80, 60)
        left(120)

def fiore():
    petali = ["red", "orange", "gold", "green", "blue", "purple"]
    for c in petali:
        petalo(c)
        left(60)

fiore()

done()
