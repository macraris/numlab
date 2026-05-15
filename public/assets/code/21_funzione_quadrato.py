# Capitolo 25 - Definire una funzione
# def quadrato() - un superpotere nuovo per Pina.

from turtle import *

title("21 - La funzione quadrato")
shape("turtle")
pensize(3)

def quadrato():
    for i in range(4):
        forward(60)
        right(90)

# Tre quadrati in punti diversi
color("red")
quadrato()

penup(); goto(100, 0); pendown()
color("blue")
quadrato()

penup(); goto(-150, 0); pendown()
color("green")
quadrato()

done()
