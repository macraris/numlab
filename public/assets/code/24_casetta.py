# Capitolo 27 - Progetto casetta: muro, tetto, finestra, albero.
# Usa 4 funzioni che lavorano insieme.

from turtle import *

title("24 - Casetta con giardino")
bgcolor("lightblue")
shape("turtle")
speed(0)
pensize(2)

def vai(x, y, direzione=0):
    penup()
    goto(x, y)
    setheading(direzione)
    pendown()

def muro():
    color("saddlebrown", "burlywood")
    begin_fill()
    for i in range(4):
        forward(150)
        left(90)
    end_fill()

def tetto():
    color("darkred", "red")
    begin_fill()
    for i in range(3):
        forward(150)
        left(120)
    end_fill()

def finestra():
    color("navy", "skyblue")
    begin_fill()
    for i in range(4):
        forward(40)
        left(90)
    end_fill()

def albero():
    color("saddlebrown")
    begin_fill()
    for i in range(2):
        forward(15); left(90); forward(60); left(90)
    end_fill()
    penup(); forward(15); left(90); forward(60); pendown()
    color("darkgreen", "green")
    begin_fill()
    circle(40)
    end_fill()

# Disegno
vai(-75, -75); muro()
vai(-75, 75); tetto()
vai(-50, 0); finestra()
vai(20, 0); finestra()
vai(150, -75); albero()

done()
