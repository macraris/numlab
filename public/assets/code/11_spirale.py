# Capitolo 14 - Spirale magica (loop annidato concettuale)
# Una spirale quadrata: angolo 91 (non 90!) per far ruotare.

from turtle import *

title("11 - Spirale magica")
shape("turtle")
speed(0)
pensize(2)
bgcolor("black")
color("cyan")

for passo in range(120):
    forward(passo * 2)
    right(91)

done()
