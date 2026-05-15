# Capitolo 11 - Il triangolo
# 360 / 3 = 120 gradi per ogni rotazione.

from turtle import *

title("04 - Triangolo")
shape("turtle")
color("red")
pensize(3)

for lato in range(3):
    forward(150)
    right(120)

done()
