# Capitolo 16 - Versione demo non interattiva (screenshot)

from turtle import *

title("13 - Saluto (demo)")
shape("turtle")
hideturtle()
penup()
goto(0, 0)
color("purple")
write("Ciao Sofia!", align="center", font=("Arial", 32, "bold"))
penup()
goto(0, -60)
color("teal")
write("Sono Pina la Tartaruga.", align="center", font=("Arial", 18, "italic"))

done()
