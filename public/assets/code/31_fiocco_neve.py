# Capitolo 14 - Fiocco di neve
# Sei rami uguali partendo dal centro.

from turtle import *

title("31 - Fiocco di neve")
bgcolor("midnightblue")
shape("turtle")
color("white")
pensize(2)
speed(0)

def ramo():
    forward(80)
    for i in range(3):
        backward(20)
        right(45)
        forward(20)
        backward(20)
        left(90)
        forward(20)
        backward(20)
        right(45)
    backward(80)

for r in range(6):
    ramo()
    right(60)

hideturtle()
done()
