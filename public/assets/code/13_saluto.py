# Capitolo 16 - Primo programma con input (versione interattiva)
# La tartaruga ti saluta per nome.
#
# Per generare lo screenshot automaticamente, esegui:
#     python 13_saluto.py --demo
# In modalita normale chiede il nome alla bambina.

import sys
from turtle import *

title("13 - Saluto personalizzato")
shape("turtle")
hideturtle()
penup()
goto(0, 0)

if "--demo" in sys.argv:
    nome = "Sofia"
else:
    nome = input("Come ti chiami? ")

color("purple")
write("Ciao " + nome + "!", align="center", font=("Arial", 32, "bold"))

penup()
goto(0, -60)
color("teal")
write("Sono Pina la Tartaruga.", align="center", font=("Arial", 18, "italic"))

done()
