# Capitolo 20 - Pina decide: if / else
# Disegna 20 cerchi: rossi se piccoli, blu se grandi.

import random
from turtle import *

title("17 - Pina decide")
shape("turtle")
speed(0)
pensize(2)

for c in range(20):
    penup()
    x = random.randint(-280, 250)
    y = random.randint(-200, 200)
    goto(x, y)
    pendown()
    raggio = random.randint(10, 50)
    if raggio < 30:
        color("red")
    else:
        color("blue")
    circle(raggio)

done()
