# Capitolo 22 - Eventi: muovere Pina con i tasti freccia
# Interattivo. Per generare uno screenshot demo: --demo

import sys
from turtle import *

title("19 - Muovi Pina con le frecce")
screen = Screen()
shape("turtle")
pensize(3)
color("darkgreen")

def avanti():
    forward(20)

def indietro():
    backward(20)

def gira_sx():
    left(15)

def gira_dx():
    right(15)

if "--demo" in sys.argv:
    # Disegna una piccola pista dimostrativa
    for _ in range(8):
        forward(40)
        right(45)
else:
    screen.listen()
    screen.onkey(avanti, "Up")
    screen.onkey(indietro, "Down")
    screen.onkey(gira_sx, "Left")
    screen.onkey(gira_dx, "Right")

done()
