# Capitolo 13 - Quadrato pieno e colorato
# Riempire una figura con begin_fill / end_fill.

from turtle import *

title("09 - Quadrato colorato")
shape("turtle")
pensize(4)
color("navy", "skyblue")  # bordo, riempimento

begin_fill()
for lato in range(4):
    forward(150)
    right(90)
end_fill()

done()
