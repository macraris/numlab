# Il trucco del 9 con le dita — multimedia interattivo

Animazione interattiva del classico **trucco giapponese delle dita** per insegnare la
tabellina del 9 a una bambina di 8 anni. Tutto in italiano. Funziona offline.

## Come si usa

**Doppio click su `index.html`** → si apre nel browser. Comandi:

| Pulsante | Cosa fa |
|---|---|
| **▶ / ⏸** | Play / Pausa dell'animazione |
| **◀ ▶** | Step indietro / avanti |
| **⏮ ⏭** | Rewind (1) / Fine (10) |
| Select **Step** | Salta direttamente al passo 1-10 |
| Slider **Velocità** | Da 1.5 s a 6 s per step |

**Scorciatoie tastiera**: `Spazio` play/pausa · `← →` precedente/successivo · `Home/End` primo/ultimo.

## File prodotti

### Interattivi (web)
| File | Cosa è |
|---|---|
| **`index.html`** | Pagina interattiva principale |
| `style.css` | Stili (mani SVG, controlli, layout) |
| `trucco9.js` | Logica animazione + controlli + tastiera |

### Statici (vettoriali — qualità infinita)
| File | Cosa è |
|---|---|
| **`trucco9.svg`** | Esempio classico **9×3 = 27**, A4 portrait, SVG puro |
| **`trucco9_gallery.svg`** | **Galleria 2×5** con tutti i 10 casi (9×1 → 9×10) |
| `trucco9_step01.svg` … `trucco9_step10.svg` | 10 SVG individuali, uno per ciascun caso |

### Statici (raster + PDF)
| File | Cosa è |
|---|---|
| **`trucco9.gif`** | GIF animata 10 frame (~2.5 s ognuno), 960×… px, 1 MB |
| `trucco9_gallery.png` | Stessa galleria in PNG 200 dpi |
| `trucco9_gallery.pdf` | Galleria in PDF stampabile |

### Sorgenti rigenerabili
| File | Cosa è |
|---|---|
| `genera_svg.py` | Rigenera tutti gli SVG (statici) |
| `genera_assets.py` | Rigenera GIF + galleria PNG/PDF (cattura screenshot HTML) |

## Il trucco in 5 righe

1. Apri le **due mani**: hai **10 dita**, numerate da 1 (mignolo sinistro) a 10 (mignolo destro).
2. Per **9 × n**, piega il dito numero n.
3. Le dita a **sinistra** del dito piegato sono le **decine**.
4. Le dita a **destra** sono le **unità**.
5. Esempio: **9 × 3** → piego il 3° dito → 2 dita a sx (= 20) + 7 dita a dx (= 7) → **27**.

**Verifica magica**: la somma delle cifre del risultato è SEMPRE 9.
(2+7=9, 5+4=9, 8+1=9 …)

## Caso speciale 9×10

Il trucco classico copre 9×1 → 9×9. La pagina include anche **9×10**, mostrato come
"tutte le 10 dita rappresentano 9 decine = 90" con una bracket unica sopra entrambe le mani.

## Tecnica usata

- **SVG inline anatomico** disegnato a mano con gradient skin, ombreggiature, unghie, pieghe del palmo
- 10 dita indipendentemente animabili tramite CSS `transform`
- Quando un dito è "piegato": shrunk verticalmente del 78% + grigio + label rossa
- Brackets dinamiche disegnate da JavaScript in base al passo corrente
- Caratteristiche kid-friendly: numeri grandi, colori vivaci, dialoghi educativi nell'explanation

## Modifica e rigenera

Vuoi rifare le mani in modo diverso? Modifica l'SVG inline in `index.html` e poi:
```
python genera_svg.py       # rigenera SVG statici
python genera_assets.py    # rigenera GIF e galleria PNG/PDF
```

## Confronto con la versione foto-realistica

Esiste una versione gemella in `..\trucco_9_realistico\` che prova un approccio
fotorealistico (mani generate con Pillow). Quella punta al "vero", questa punta
alla **chiarezza didattica** e alla **scalabilità vettoriale infinita**.

Entrambe leggono lo stesso trucco; usale insieme per offrire prospettive complementari.
