# Fotos de speakers

Sube aquí las fotos de cada speaker con el nombre exacto del handle de Instagram.

## Formato recomendado

- **Nombre del archivo:** `<handle-ig>.jpg` (minúsculas, sin @)
- **Dimensiones:** mínimo 400×400 px, cuadradas (1:1)
- **Formato:** JPG optimizado (< 200 KB por archivo). También acepta `.webp`.
- **Encuadre:** rostro centrado, busto hacia arriba, buena iluminación.

## Lista de archivos esperados

Los handles se verificaron públicamente (abril 2026) — son la cuenta principal verificada o la de mayor número de seguidores. Cada archivo debe coincidir con el campo `photo` en `src/app/content.ts`:

```
jorgeserratos.jpg
manueldeleonmjr.jpg
daniel.marcos.escalar.jpg          # Daniel Marcos (115K)
fanzures.jpg                        # Fernando Anzures (155K)
claudializaldi.jpg                  # Claudia Lizaldi (939K)
soyalejandrokasuga.jpg              # Alejandro Kasuga (88K)
alejandrosaracholf_oficial.jpg      # Alejandro Saracho (71K)
coralmujaes.jpg                     # Coral Mujaes (4M)
spencer.hoffmann.jpg                # Spencer Hoffmann (3M)
efrenmartinezo.jpg                  # Efrén Martínez (1M)
s.dealba.jpg                        # Salvador Alba  (verificar — handle con menos confianza)
pavogomezorea.jpg                   # Pavo Gómez Orea
karla_barajas.jpg                   # Karla Barajas (670K)
mikemunzvil.jpg                     # Mike Munzvil (909K)
dr_roch_.jpg                        # Dr. Roch
tatiarias_.jpg                      # Tatiana Arias (2M)
luis_fallas.jpg                     # Luis Fallas (50K)
valentinaortizf.jpg                 # Valentina Ortiz (3M)
javireelbe.jpg                      # Javier Rodríguez (2M) — verificar con Manuel si es el correcto
tittogalvez.jpg                     # Titto Gálvez (nombre corregido, antes "Luzardo") (855K)
brandoangulomx.jpg                  # Brando Angulo
alejandrocardonascr.jpg             # Alejandro Cardona (517K)
```

## Cómo funciona

- Si la foto existe → se renderiza como avatar circular con borde verde.
- Si no existe (o el `onError` se dispara) → fallback automático al avatar con iniciales + gradient.

No hay que tocar código para agregar/reemplazar fotos — solo poner el archivo aquí con el nombre correcto.

## Notas sobre handles a confirmar con Manuel

- **Javier Rodríguez** → usé `@javireelbe` (2M, mentor & speaker). Si Manuel se refería a otro Javi Rodríguez específico (por ejemplo de medios pagados), pásamelo.
- **Salvador Alba** → `@s.dealba` es el más aproximado pero poca información pública. Manuel: confirma cuál es.
- **Titto** → detecté que el apellido correcto es **Gálvez**, no "Luzardo". El handle verificado es `@tittogalvez` (855K). Si el invitado es otra persona, avísame.
- **Dr. Roch** → el perfil `@dr_roch_` tiene pocos seguidores públicos; si hay otro "Dr. Roch" más conocido, ajusta.
