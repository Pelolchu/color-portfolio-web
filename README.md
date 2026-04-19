# Color Portfolio - Before/After Slider

Un componente interactivo antes/después para un portafolio de colorista.

## Estructura

```
color-portfolio-web/
├── index.html
├── styles.css
├── script.js
└── images/
    ├── before.jpg    (Tu imagen original)
    └── after.jpg     (Tu imagen con color)
```

## Características

✅ **Interactivo**: Arrastra el mouse horizontalmente para revelar el resultado
✅ **Responsive**: Funciona perfectamente en desktop, tablet y móvil
✅ **Smooth**: Animaciones suaves y natural
✅ **Sin dependencias**: HTML, CSS y JavaScript puro
✅ **Preparado para videos**: Fácil de adaptar a loops de video

## Cómo usar

1. Coloca tus imágenes en la carpeta `images/`:
   - `before.jpg` → La imagen original (sin color)
   - `after.jpg` → La imagen procesada (con color)

2. Abre `index.html` en tu navegador

3. Arrastra el mouse sobre la imagen para ver el efecto

## Personalización

### Cambiar colores
Edita `styles.css` y busca `#00d4ff` para cambiar el color del divisor y handle.

### Cambiar tamaño máximo
En `styles.css`, modifica `max-width: 800px` en `.comparison-slider__wrapper`.

### Cambiar textos
En `index.html`, edita:
- `<h1>Mi Trabajo de Color</h1>`
- `<p class="subtitle">Arrastra el mouse...</p>`
- `<span class="comparison-slider__label...">Antes</span>`
- `<span class="comparison-slider__label...">Después</span>`

## Próximas mejoras

- [ ] Soporte para videos en lugar de imágenes estáticas
- [ ] Multiple sliders en una página
- [ ] Efecto parallax opcional
- [ ] Teclado arrow keys para control preciso

## Compatibilidad

✅ Chrome, Firefox, Safari, Edge (versiones modernas)
✅ Móviles iOS y Android
