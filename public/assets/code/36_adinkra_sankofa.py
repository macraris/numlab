# Capitolo 14 - Simbolo Sankofa stilizzato (Ghana)
# Una funzione "sankofa" che combina cerchio + cuore.

from turtle import *

title("36 - Sankofa")
bgcolor("ivory")
shape("turtle")
color("darkred")
pensize(4)
speed(3)

def cuore_piccolo():
    begin_fill()
    left(45)
    forward(60)
    circle(20, 180)
    right(90)
    circle(20, 180)
    forward(60)
    right(135)
    end_fill()

def sankofa():
    # Cerchio esterno
    circle(80)
    # Cuoricino centrale
    penup()
    goto(0, -10)
    setheading(0)
    pendown()
    color("darkred", "crimson")
    cuore_piccolo()

penup()
goto(0, -80)
setheading(0)
pendown()
sankofa()

hideturtle()
done()
