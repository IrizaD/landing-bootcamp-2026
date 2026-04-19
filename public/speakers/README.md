# Fotos de speakers

Sube aquí las fotos de cada speaker con el nombre exacto del handle de Instagram.

## Formato recomendado

- **Nombre del archivo:** `<handle-ig>.jpg` (minúsculas, sin @)
- **Dimensiones:** mínimo 400×400 px, cuadradas (1:1)
- **Formato:** JPG optimizado (< 200 KB por archivo). También acepta `.webp`.
- **Encuadre:** rostro centrado, busto hacia arriba, buena iluminación.

## Lista de archivos esperados

Cada archivo debe coincidir con el campo `photo` en `src/app/content.ts`:

```
jorgeserratos.jpg
manueldeleonmjr.jpg
dmarcos.jpg
fernandoanzures.jpg
claudializaldi.jpg
alejandrokasuga.jpg
alejandrosaracho.jpg
coralmujaes.jpg
spencerhoffmann.jpg
efrenmartinezcoach.jpg
salvadoralba.jpg
pavogomez.jpg
karlabarajasoficial.jpg
mikemunzvil.jpg
doctor.roch.jpg
tatiarias.jpg
luisfallas.jpg
valentinaortiz.jpg
javirodriguez.jpg
tittoluzardo.jpg
brandoangulo.jpg
alejandrocardona.jpg
```

## Cómo funciona

- Si la foto existe → se renderiza como avatar circular con borde verde.
- Si no existe (o el `onError` se dispara) → fallback automático al avatar con iniciales + gradient.

No hay que tocar código para agregar/reemplazar fotos — solo poner el archivo aquí con el nombre correcto.

## Handles a verificar

Algunos handles son la mejor aproximación pública. Antes del lanzamiento, valida cada uno directamente en Instagram (que el perfil esté verificado o sea el de mayor autoridad) y actualiza `ig:` en `src/app/content.ts` si es necesario. El campo `photo` también debe renombrarse acorde.
