// Calcular altura dinámicamente basada en la pantalla
function calculateCardHeight() {
    const header = document.querySelector('.header');
    const headerHeight = header ? header.offsetHeight : 60;
    const availableHeight = window.innerHeight - headerHeight;
    const cardHeight = availableHeight / 3;
    
    // Setear la variable CSS
    document.documentElement.style.setProperty('--card-height', `${cardHeight}px`);
}

// Ejecutar al cargar y cuando cambia el tamaño de la pantalla
window.addEventListener('load', calculateCardHeight);
window.addEventListener('resize', calculateCardHeight);

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Cache buster para forzar descarga de imágenes actualizadas
function addCacheBuster(url) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}v=${Date.now()}`;
}

async function loadProjects() {
    try {
        const response = await fetch('data/projects.json');
        const data = await response.json();
        
        // Ordenar por año descendente (más reciente primero)
        const sortedProjects = data.projects.sort((a, b) => b.year - a.year);
        
        // Aleatorizar imágenes en cada proyecto
        sortedProjects.forEach(project => {
            // NO shufflear: mantener orden original para que imagePositions coincida
            // if (project.images && project.images.length > 0) {
            //     project.images = shuffleArray(project.images).map(img => addCacheBuster(img));
            // }
            
            // Solo agregar cache buster sin shufflear
            if (project.images && project.images.length > 0) {
                project.images = project.images.map(img => addCacheBuster(img));
            }
            // Cargar tipografías personalizadas
            if (project.font) {
                loadCustomFont(project.id, project.font);
            }
        });
        
        renderProjects(sortedProjects);
    } catch (error) {
        console.error('Error cargando proyectos:', error);
    }
}

function loadCustomFont(projectId, fontPath) {
    const ext = fontPath.split('.').pop().toLowerCase();
    const fontFormat = {
        'ttf': 'truetype',
        'otf': 'opentype',
        'woff': 'woff',
        'woff2': 'woff2'
    }[ext] || 'truetype';

    // Crear elemento style para la fuente
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        @font-face {
            font-family: 'ProjectFont-${projectId}';
            src: url('${fontPath}') format('${fontFormat}');
        }
    `;
    document.head.appendChild(styleEl);
}

function renderProjects(projects) {
    const grid = document.getElementById('projects-grid');
    grid.innerHTML = '';

    projects.forEach(project => {
        const card = createProjectCard(project);
        grid.appendChild(card);
    });
}

function createProjectCard(project) {
    const card = document.createElement('a');
    card.href = `project.html?id=${project.id}`;
    card.className = 'project-card';
    
    // Reemplazar guiones bajos con espacios en el nombre
    const projectTitle = project.title.replace(/_/g, ' ');

    // Crear array de imágenes incluyendo cover.jpg al inicio
    const allGalleryImages = [project.preview, ...(project.images || [])];
    
    // Crear estructura para slideshow
    const imageContainers = allGalleryImages.map((img, idx) => {
        let position = 'center center';
        
        // Primera imagen (portada): usar coverPosition
        if (idx === 0) {
            position = project.coverPosition || 'center center';
        } else {
            // Resto de imágenes: buscar sin cache buster
            const imgWithoutCacheBuster = img.split('?')[0];
            position = project.imagePositions?.[imgWithoutCacheBuster] || 'center center';
        }
        
        return `<img src="${img}" alt="Galería ${idx}" class="project-card__gallery-img" style="opacity: ${idx === 0 ? 1 : 0}; object-position: ${position};">`;
    }).join('');

    // Aplicar tipografía personalizada si existe
    const fontStyle = project.font ? `font-family: 'ProjectFont-${project.id}';` : '';

    card.innerHTML = `
        <div class="project-card__image-wrapper">
            <div class="project-card__gallery-container">
                ${imageContainers}
            </div>
        </div>
        <div class="project-card__content">
            <h3 class="project-card__title" style="${fontStyle}">${projectTitle}</h3>
        </div>
    `;

    // Agregar listeners para slideshow
    if (allGalleryImages.length > 1) {
        addSlideshowListeners(card, allGalleryImages);
    }

    return card;
}

function addSlideshowListeners(card, images) {
    let slideshowInterval = null;
    let currentImageIndex = 0;
    const galleryContainer = card.querySelector('.project-card__gallery-container');
    const contentDiv = card.querySelector('.project-card__content');

    card.addEventListener('mouseenter', () => {
        if (!galleryContainer) return;
        
        // Mostrar contenido (nombre del proyecto)
        if (contentDiv) {
            contentDiv.classList.add('active');
        }

        // Iniciar slideshow (empezar con imagen 1, no la portada)
        let nextIndex = 2; // Empezar en 2 para ciclar correctamente
        const allImages = galleryContainer.querySelectorAll('.project-card__gallery-img');
        
        // Cambiar inmediatamente a imagen 1 (primera de la galería)
        if (images.length > 1) {
            allImages[currentImageIndex].style.opacity = '0';
            currentImageIndex = 1;
            allImages[currentImageIndex].style.opacity = '1';
        }

        slideshowInterval = setInterval(() => {
            allImages[currentImageIndex].style.opacity = '0';
            currentImageIndex = nextIndex % images.length;
            allImages[currentImageIndex].style.opacity = '1';
            nextIndex++;
        }, 1500);
    });

    card.addEventListener('mouseleave', () => {
        // Ocultar contenido
        if (contentDiv) {
            contentDiv.classList.remove('active');
        }

        // Detener slideshow
        if (slideshowInterval) {
            clearInterval(slideshowInterval);
            slideshowInterval = null;
        }
        
        // Volver a imagen de portada
        const allImages = galleryContainer.querySelectorAll('.project-card__gallery-img');
        allImages.forEach((img, idx) => {
            img.style.opacity = idx === 0 ? '1' : '0';
        });
        currentImageIndex = 0;
    });
}

document.addEventListener('DOMContentLoaded', loadProjects);
