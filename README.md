# Portafolio Web - Colorista

Mi sitio web personal como colorista. Portfolio interactivo con galerías de proyectos, vistas previas en slideshow y efectos before/after.

## 🎨 Características

✅ **Portfolio dinámico**: Galería de proyectos con imágenes en slideshow
✅ **Gestión basada en JSON**: Estructura simple para agregar/modificar proyectos
✅ **Responsive**: Altura de tarjetas adaptativa (3 proyectos por viewport)
✅ **Tipografías personalizadas**: Cada proyecto puede tener su propia fuente TTF
✅ **Slider before/after**: Futuro componente para mostrar antes/después de trabajos de color
✅ **Posicionamiento customizable**: Control individual de posición de imágenes en cada proyecto
✅ **Sin frameworks**: HTML, CSS y JavaScript puro

## 📁 Estructura

```
color-portfolio-web/
├── index.html                 (Página principal del portfolio)
├── css/
│   ├── styles.css            (Estilos globales)
│   ├── home.css              (Estilos del portfolio)
│   └── project.css           (Estilos para futuros proyectos)
├── js/
│   ├── loader.js             (Carga dinámica de proyectos)
│   └── slider.js             (Componente before/after - en desarrollo)
├── data/
│   └── projects.json         (Datos de proyectos)
├── generate-projects.js      (Script para generar projects.json)
└── assets/projects/
    ├── Proyecto_1/
    │   ├── cover.jpg         (Imagen de portada)
    │   ├── [fuente].ttf      (Tipografía personalizada opcional)
    │   ├── after/            (Imágenes del slideshow)
    │   └── before/           (Imágenes para slider before/after)
    └── Proyecto_2/
        └── ...
```

## 🚀 Instalación

1. Clonar el repositorio
2. Agregar carpetas de proyectos en `assets/projects/`
3. Ejecutar `npm run generate` para crear `projects.json`
4. Abrir `index.html` en navegador o desplegar en hosting

## ⚙️ Configuración de Proyectos

### Estructura de carpeta de proyecto

```
assets/projects/Mi_Proyecto/
├── cover.jpg                 (Portada del proyecto)
├── [fuente].ttf             (Opcional: tipografía personalizada)
├── after/                   (Imágenes del slideshow)
│   ├── 1A.jpg
│   ├── 2A.jpg
│   └── ...
└── before/                  (Imágenes para before/after slider)
    ├── 1B.jpg
    └── ...
```

### Personalización en `projects.json`

Editar manualmente propiedades como:
- `coverPosition`: Posición vertical de la portada (ej: "center center", "center 30%")
- `imagePositions`: Posición individual de cada imagen en el slideshow
- `year`: Año del proyecto
- `roles`: Roles/tags del proyecto

**Nota**: El script `generate-projects.js` preserva estas customizaciones.

## 🛠️ Scripts disponibles

```bash
npm run generate    # Regenera projects.json desde carpetas
```

## 📝 Próximas mejoras

- [ ] Implementar slider before/after interactivo
- [ ] Soporte para videos en slideshows
- [ ] Página de detalles del proyecto
- [ ] Sistema de filtros por año/rol
- [ ] Contacto y formulario

## 📦 Media

El repositorio ignora intencionalmente los archivos multimedia (`*.jpg`, `*.mp4`, etc.) en `/assets/projects/` para mantener el repositorio ligero. Ver `.gitignore` para más detalles.

## 💻 Compatibilidad

✅ Chrome, Firefox, Safari, Edge (versiones modernas)
✅ Responsive en desktop, tablet y móvil
