# Capitolo 30 - Mini-gioco 2: il labirinto
# Pina deve raggiungere il formaggio senza toccare i muri.
# Frecce per muoversi.
# Demo: --demo disegna solo lo scenario.

import sys
from turtle import Screen, Turtle, done

screen = Screen()
screen.title("27 - Labirinto")
screen.setup(640, 520)
screen.bgcolor("white")
screen.tracer(0)

# Disegnamo i muri come segmenti
muri = [
    ((-280, -200), (280, -200)),
    ((-280, 200), (280, 200)),
    ((-280, -200), (-280, 200)),
    ((280, -200), (280, 200)),
    ((-200, -100), (-200, 200)),
    ((-100, -200), (-100, 100)),
    ((0, -100), (0, 200)),
    ((100, -200), (100, 100)),
    ((200, -100), (200, 200)),
]

disegnatore = Turtle()
disegnatore.hideturtle()
disegnatore.color("black")
disegnatore.pensize(4)
for inizio, fine in muri:
    disegnatore.penup()
    disegnatore.goto(inizio)
    disegnatore.pendown()
    disegnatore.goto(fine)

# Formaggio
formaggio = Turtle()
formaggio.shape("circle")
formaggio.color("gold")
formaggio.penup()
formaggio.goto(240, 160)

# Pina
pina = Turtle()
pina.shape("turtle")
pina.color("green")
pina.penup()
pina.goto(-240, -160)
pina.setheading(0)

def avanti():
    pina.forward(20)

def indietro():
    pina.backward(20)

def sx():
    pina.left(15)

def dx():
    pina.right(15)

screen.listen()
screen.onkey(avanti, "Up")
screen.onkey(indietro, "Down")
screen.onkey(sx, "Left")
screen.onkey(dx, "Right")

if "--demo" in sys.argv:
    # Disegna solo lo scenario per lo screenshot
    pass

screen.update()
done()
