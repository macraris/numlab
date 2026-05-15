# Capitolo 10 - Il quadrato con il loop for
# Stessa figura del file 02, ma con 4 righe in meno.
# Magia del "ripeti 4 volte".

from turtle import *

title("03 - Quadrato con for")
shape("turtle")
color("purple")
pensize(3)

for lato in range(4):
    forward(120)
    right(90)

done()
