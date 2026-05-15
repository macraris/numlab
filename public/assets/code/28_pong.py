# Capitolo 31 - Mini-gioco 3: Pong semplificato
# Una racchetta in basso, una palla che rimbalza.
# Frecce sx/dx per muovere la racchetta.
# Demo: --demo esegue solo 300 cicli e termina.

import sys
from turtle import Screen, Turtle, done

screen = Screen()
screen.title("28 - Pong di Pina")
screen.setup(600, 500)
screen.bgcolor("black")
screen.tracer(0)

# Racchetta
racchetta = Turtle()
racchetta.shape("square")
racchetta.shapesize(stretch_wid=1, stretch_len=5)
racchetta.color("white")
racchetta.penup()
racchetta.goto(0, -220)

# Palla
palla = Turtle()
palla.shape("circle")
palla.color("yellow")
palla.penup()
palla.goto(0, 0)
dx = 4
dy = -4

# Punteggio
testo = Turtle()
testo.hideturtle()
testo.color("white")
testo.penup()
testo.goto(-280, 220)
punti = 0

def aggiorna():
    testo.clear()
    testo.write(f"Punti: {punti}", font=("Arial", 16, "bold"))

aggiorna()

def sx():
    x = racchetta.xcor()
    if x > -240:
        racchetta.setx(x - 30)

def dx_tasto():
    x = racchetta.xcor()
    if x < 240:
        racchetta.setx(x + 30)

screen.listen()
screen.onkey(sx, "Left")
screen.onkey(dx_tasto, "Right")

cicli = 0
demo = "--demo" in sys.argv

while True:
    x = palla.xcor()
    y = palla.ycor()
    # Pareti laterali
    if x > 290 or x < -290:
        dx = -dx
    # Soffitto
    if y > 240:
        dy = -dy
    # Pavimento
    if y < -260:
        palla.goto(0, 0)
        dy = -dy
        punti = max(punti - 1, 0)
        aggiorna()
    # Collisione racchetta
    if (-220 < y < -200) and abs(x - racchetta.xcor()) < 60:
        dy = -dy
        punti += 1
        aggiorna()
    palla.goto(x + dx, y + dy)
    screen.update()
    cicli += 1
    if demo and cicli > 300:
        break

done()
