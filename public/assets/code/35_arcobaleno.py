# Capitolo 14 - Arcobaleno (cerchi concentrici)
# Sette colori, raggi crescenti.

from turtle import *

title("35 - Arcobaleno")
bgcolor("lightcyan")
shape("turtle")
speed(0)
pensize(20)

colori = ["red", "orange", "gold", "green", "blue", "indigo", "violet"]

penup()
goto(0, -200)
setheading(0)
pendown()

raggio = 100
for c in colori:
    color(c)
    circle(raggio, 180)
    penup()
    forward(1)
    right(90)
    forward(20)
    left(90)
    pendown()
    raggio += 20

hideturtle()
done()
