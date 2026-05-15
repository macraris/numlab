# Capitolo 19 - Il giardino di Pina
# Combina cicli, random, colori.

import random
from turtle import *

title("16 - Il giardino di Pina")
bgcolor("lightyellow")
shape("turtle")
speed(0)

def fiore(x, y, colore):
    penup()
    goto(x, y)
    setheading(0)
    pendown()
    color(colore)
    for petalo in range(8):
        circle(20)
        right(45)

colori = ["red", "magenta", "orange", "purple", "pink", "blue"]

for f in range(12):
    x = random.randint(-300, 250)
    y = random.randint(-200, 150)
    fiore(x, y, random.choice(colori))

# Sole
penup()
goto(-280, 220)
pendown()
color("orange", "yellow")
begin_fill()
circle(35)
end_fill()

done()
