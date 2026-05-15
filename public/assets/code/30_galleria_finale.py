# Capitolo 42 - Galleria finale: una pagina con tutto cio che Pina sa fare.
# Quadrato + stella + cerchio + fiore + scritta.

from turtle import *

title("30 - Galleria di Pina")
bgcolor("lightyellow")
shape("turtle")
speed(0)
pensize(3)

# Quadrato
penup(); goto(-280, 50); pendown()
color("red")
for i in range(4):
    forward(80); right(90)

# Stella
penup(); goto(-130, 100); pendown()
color("gold")
begin_fill()
for i in range(5):
    forward(80); right(144)
end_fill()

# Cerchio
penup(); goto(50, 0); pendown()
color("blue")
circle(50)

# Fiore di petali
penup(); goto(220, 30); pendown()
color("magenta")
for petalo in range(8):
    circle(30, 60); left(120); circle(30, 60); left(60)

# Scritta
penup(); goto(0, -180); pendown()
color("darkgreen")
write("Brava! Sei una programmatrice!", align="center", font=("Arial", 22, "bold"))

hideturtle()
done()
