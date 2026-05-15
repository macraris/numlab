# Capitolo 29 - Mini-gioco 1: prendi la mela
# Sposta il cestino con le frecce destra/sinistra.
# La mela cade dall'alto. Ogni cattura = +1 punto.
#
# Demo: --demo fa cadere automaticamente 3 mele.

import sys
import random
from turtle import Screen, Turtle, done

title_text = "26 - Prendi la mela"
screen = Screen()
screen.title(title_text)
screen.setup(600, 500)
screen.bgcolor("skyblue")
screen.tracer(0)

# Cestino
cestino = Turtle()
cestino.shape("square")
cestino.shapesize(stretch_wid=1, stretch_len=4)
cestino.color("saddlebrown")
cestino.penup()
cestino.goto(0, -200)

# Mela
mela = Turtle()
mela.shape("circle")
mela.color("red")
mela.penup()
mela.goto(random.randint(-250, 250), 220)

# Punteggio
testo = Turtle()
testo.hideturtle()
testo.penup()
testo.goto(-280, 210)
punti = 0

def aggiorna_testo():
    testo.clear()
    testo.write(f"Punti: {punti}", font=("Arial", 18, "bold"))

aggiorna_testo()

def vai_sx():
    x = cestino.xcor()
    if x > -260:
        cestino.setx(x - 30)

def vai_dx():
    x = cestino.xcor()
    if x < 260:
        cestino.setx(x + 30)

screen.listen()
screen.onkey(vai_sx, "Left")
screen.onkey(vai_dx, "Right")

modalita_demo = "--demo" in sys.argv
mele_demo = 3

cicli = 0
while True:
    mela.sety(mela.ycor() - 4)
    # Cattura
    if mela.ycor() < -190 and abs(mela.xcor() - cestino.xcor()) < 50:
        punti += 1
        aggiorna_testo()
        mela.goto(random.randint(-250, 250), 220)
        if modalita_demo:
            mele_demo -= 1
            if mele_demo <= 0:
                break
    # Mela persa
    elif mela.ycor() < -240:
        mela.goto(random.randint(-250, 250), 220)
        if modalita_demo:
            mele_demo -= 1
            if mele_demo <= 0:
                break
    screen.update()
    cicli += 1
    if modalita_demo and cicli > 800:
        break

done()
