# Capitolo 21 - Confronti tra numeri
# Disegna barre alte in base a un punteggio.

from turtle import *

title("18 - Confronti")
shape("turtle")
hideturtle()
pensize(2)

punteggi = [3, 7, 5, 9, 2, 8]
x = -250

for p in punteggi:
    penup()
    goto(x, -150)
    setheading(90)
    pendown()
    if p >= 7:
        color("green", "lightgreen")
    elif p >= 4:
        color("orange", "khaki")
    else:
        color("red", "salmon")
    begin_fill()
    for i in range(2):
        forward(p * 20)
        right(90)
        forward(40)
        right(90)
    end_fill()
    x += 70

done()
