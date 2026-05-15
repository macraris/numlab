# Capitolo 17 - Numeri casuali
# Quadrati di dimensione e colore casuali.
# Ogni esecuzione e diversa.

import random
from turtle import *

title("14 - Quadrati casuali")
shape("turtle")
speed(0)

colori = ["red", "blue", "green", "orange", "purple", "magenta", "teal"]

for q in range(15):
    penup()
    x = random.randint(-250, 200)
    y = random.randint(-200, 200)
    goto(x, y)
    pendown()
    color(random.choice(colori))
    lato = random.randint(20, 80)
    for i in range(4):
        forward(lato)
        right(90)

done()
