# Capitolo 32 - Mini-gioco 4: Snake mini
# Il serpente cresce ogni volta che mangia una mela.
# Frecce per cambiare direzione.
# Demo: --demo esegue il gioco con direzioni automatiche.

import sys
import random
from turtle import Screen, Turtle, done

screen = Screen()
screen.title("29 - Snake")
screen.setup(560, 520)
screen.bgcolor("black")
screen.tracer(0)

# Testa del serpente
testa = Turtle()
testa.shape("square")
testa.color("lime")
testa.penup()
testa.goto(0, 0)
direzione = "stop"

# Mela
mela = Turtle()
mela.shape("circle")
mela.color("red")
mela.penup()
mela.goto(100, 100)

# Coda (segmenti)
segmenti = []

# Punteggio
testo = Turtle()
testo.hideturtle()
testo.color("white")
testo.penup()
testo.goto(-260, 230)
punti = 0

def aggiorna():
    testo.clear()
    testo.write(f"Punti: {punti}", font=("Arial", 16, "bold"))

aggiorna()

def vai_su():
    global direzione
    if direzione != "giu":
        direzione = "su"

def vai_giu():
    global direzione
    if direzione != "su":
        direzione = "giu"

def vai_sx():
    global direzione
    if direzione != "dx":
        direzione = "sx"

def vai_dx():
    global direzione
    if direzione != "sx":
        direzione = "dx"

screen.listen()
screen.onkey(vai_su, "Up")
screen.onkey(vai_giu, "Down")
screen.onkey(vai_sx, "Left")
screen.onkey(vai_dx, "Right")

def passo():
    x = testa.xcor()
    y = testa.ycor()
    if direzione == "su":
        testa.sety(y + 20)
    elif direzione == "giu":
        testa.sety(y - 20)
    elif direzione == "sx":
        testa.setx(x - 20)
    elif direzione == "dx":
        testa.setx(x + 20)

demo = "--demo" in sys.argv
cicli = 0
direzioni_demo = ["dx", "su", "sx", "giu"]

import time
while True:
    if demo and cicli % 30 == 0:
        direzione = direzioni_demo[(cicli // 30) % 4]
    # Pareti
    x = testa.xcor()
    y = testa.ycor()
    if x > 260 or x < -260 or y > 240 or y < -240:
        testa.goto(0, 0)
        direzione = "stop"
        for s in segmenti:
            s.goto(1000, 1000)
        segmenti.clear()
        punti = 0
        aggiorna()
    # Mangia mela
    if testa.distance(mela) < 20:
        mela.goto(random.randint(-12, 12) * 20, random.randint(-10, 10) * 20)
        nuovo = Turtle()
        nuovo.shape("square")
        nuovo.color("green")
        nuovo.penup()
        segmenti.append(nuovo)
        punti += 1
        aggiorna()
    # Muovi coda
    for i in range(len(segmenti) - 1, 0, -1):
        segmenti[i].goto(segmenti[i-1].xcor(), segmenti[i-1].ycor())
    if segmenti:
        segmenti[0].goto(testa.xcor(), testa.ycor())
    passo()
    screen.update()
    time.sleep(0.08)
    cicli += 1
    if demo and cicli > 200:
        break

done()
