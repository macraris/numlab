# Capitolo 13 - Colori e spessore della penna
# Una serie di linee in colori diversi.

from turtle import *

title("08 - Colori della penna")
shape("turtle")
speed(3)

colori = ["red", "orange", "gold", "green", "blue", "purple"]

for c in colori:
    color(c)
    pensize(6)
    forward(120)
    backward(120)
    right(60)

done()
