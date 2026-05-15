# Capitolo 28 - Cos'e un game loop
# Pina rimbalza dentro al riquadro. Ridisegna 60 volte al secondo.

from turtle import *

title("25 - Il loop del gioco")
screen = Screen()
screen.setup(600, 500)
screen.tracer(0)  # disegno controllato a mano

pina = Turtle()
pina.shape("turtle")
pina.color("green")
pina.penup()
dx = 4
dy = 3

passi = 0
while passi < 500:
    x = pina.xcor()
    y = pina.ycor()
    if x > 280 or x < -280:
        dx = -dx
    if y > 220 or y < -220:
        dy = -dy
    pina.goto(x + dx, y + dy)
    screen.update()
    passi += 1

done()
