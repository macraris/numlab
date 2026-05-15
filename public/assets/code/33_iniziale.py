# Capitolo 7 - Disegna la tua iniziale
# Esempio: la lettera S (puoi cambiare per la tua iniziale)

from turtle import *

title("33 - Iniziale")
shape("turtle")
color("purple")
pensize(6)

# Una S stilizzata
penup(); goto(50, 100); pendown()
setheading(180)
forward(80)
right(90)
forward(40)
left(90)
forward(80)
right(90)
forward(40)
left(90)
forward(80)

hideturtle()
done()
