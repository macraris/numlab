# Capitolo 12 - La stella a 5 punte
# Il segreto e 144 gradi: 180 - 36.

from turtle import *

title("06 - Stella a 5 punte")
shape("turtle")
color("gold")
pensize(4)
begin_fill()

for punta in range(5):
    forward(180)
    right(144)

end_fill()
done()
