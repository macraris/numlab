# Capitolo 18 - Pina si teletrasporta
# goto, penup, pendown, setheading.

from turtle import *

title("15 - Teletrasporto")
shape("turtle")
pensize(3)

# Punto 1
penup(); goto(-200, 100); pendown()
color("red")
circle(30)

# Punto 2
penup(); goto(0, -50); pendown()
color("blue")
circle(30)

# Punto 3
penup(); goto(180, 80); pendown()
color("green")
circle(30)

# Tornata al centro guardando in alto
penup(); goto(0, 0); setheading(90); pendown()
color("black")
forward(50)

done()
