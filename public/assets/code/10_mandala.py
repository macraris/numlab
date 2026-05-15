# Capitolo 14 - Il mandala
# Cerchi rotanti: 36 cerchi, 10 gradi ogni volta.
# Ispirazione indiana (CBSE) e maya (Mexico).

from turtle import *

title("10 - Mandala")
shape("turtle")
speed(0)
pensize(2)

colori = ["red", "blue", "green", "gold", "purple", "orange"]

for giro in range(36):
    color(colori[giro % 6])
    circle(90)
    right(10)

done()
