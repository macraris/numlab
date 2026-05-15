# Capitolo 21 - Quiz di matematica interattivo
# Demo non-interattivo: --demo

import sys
from turtle import *

title("32 - Quiz di matematica")
hideturtle()
shape("turtle")
penup()
goto(0, 100)

if "--demo" in sys.argv:
    write("Quanto fa 7 + 5?", align="center", font=("Arial", 24, "bold"))
    goto(0, 50)
    write("Risposta: 12", align="center", font=("Arial", 20, ""))
    goto(0, -20)
    color("green")
    write("Bravissima!", align="center", font=("Arial", 28, "bold"))
else:
    a = 7
    b = 5
    write(f"Quanto fa {a} + {b}?", align="center", font=("Arial", 24, "bold"))
    risposta = input("La tua risposta: ")
    goto(0, -20)
    if risposta.strip() == str(a + b):
        color("green")
        write("Bravissima!", align="center", font=("Arial", 28, "bold"))
    else:
        color("red")
        write(f"Era {a+b}!", align="center", font=("Arial", 24, "bold"))

done()
