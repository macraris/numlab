# Capitolo 23 - La lavagna magica
# Clicca con il mouse: Pina ci va e lascia una stella.
# Per demo: --demo disegna alcune stelle in punti fissi.

import sys
from turtle import *

title("20 - Lavagna magica")
screen = Screen()
bgcolor("black")
shape("turtle")
color("gold")
speed(0)

def stella_in(x, y):
    penup()
    goto(x, y)
    setheading(0)
    pendown()
    begin_fill()
    for p in range(5):
        forward(40)
        right(144)
    end_fill()

if "--demo" in sys.argv:
    punti = [(-200, 100), (-50, -100), (100, 150), (200, -50), (0, 0)]
    for x, y in punti:
        stella_in(x, y)
else:
    def on_click(x, y):
        stella_in(x, y)
    screen.onclick(on_click)

done()
