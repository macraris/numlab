# Capitolo 13 - Bandiera d'Italia
# Tre rettangoli verticali con riempimento.

from turtle import *

title("34 - Bandiera d'Italia")
shape("turtle")
speed(3)
pensize(2)

def rettangolo(x, y, w, h, colore):
    penup()
    goto(x, y)
    setheading(0)
    pendown()
    color("black", colore)
    begin_fill()
    for i in range(2):
        forward(w); left(90); forward(h); left(90)
    end_fill()

rettangolo(-150, -100, 100, 200, "green")
rettangolo(-50, -100, 100, 200, "white")
rettangolo(50, -100, 100, 200, "red")

hideturtle()
done()
