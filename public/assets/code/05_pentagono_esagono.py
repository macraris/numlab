# Capitolo 11 - Pentagono ed esagono affiancati
# Stessa logica: 360 / numero_di_lati.

from turtle import *

title("05 - Pentagono ed esagono")
shape("turtle")
pensize(3)

# Pentagono a sinistra
penup()
goto(-200, 0)
pendown()
color("orange")
for lato in range(5):
    forward(90)
    right(72)   # 360 / 5

# Esagono a destra
penup()
goto(80, 0)
pendown()
color("teal")
for lato in range(6):
    forward(80)
    right(60)   # 360 / 6

done()
