// Cargar proyecto desde query parameter
async function loadProject() {
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('id');

    console.log('🔍 projectId from URL:', projectId);

    if (!projectId) {
        console.warn('❌ No projectId in URL');
        window.location.href = 'index.html';
        return;
    }

    try {
        const response = await fetch('data/projects.json');
        const data = await response.json();
        console.log('📦 Projects loaded:', data.projects.map(p => p.id));
        
        const project = data.projects.find(p => p.id === projectId);
        console.log('🔎 Looking for:', projectId);
        console.log('✅ Project found:', project ? 'Yes' : 'No');

        if (!project) {
            console.warn('❌ Project not found in JSON');
            window.location.href = 'index.html';
            return;
        }

        renderProject(project);
    } catch (error) {
        console.error('❌ Error loading project:', error);
        window.location.href = 'index.html';
    }
}

function renderProject(project) {
    // Cargar tipografía personalizada si existe
    if (project.font) {
        const fontName = `ProjectFont-${project.id}`;
        const fontFace = `
            @font-face {
                font-family: '${fontName}';
                src: url('${project.font}') format('truetype');
                font-display: swap;
            }
        `;
        const style = document.createElement('style');
        style.textContent = fontFace;
        document.head.appendChild(style);

        // Aplicar tipografía al título
        const titleElement = document.getElementById('project-title');
        titleElement.style.fontFamily = `'${fontName}', serif`;
    }

    // Establecer título
    document.getElementById('project-title').textContent = project.title;
    document.title = `${project.title} - Colorista`;

    // Establecer año
    document.getElementById('project-year').textContent = project.year;

    // Establecer roles
    const rolesContainer = document.getElementById('project-roles');
    rolesContainer.innerHTML = project.roles
        .map(role => `<span class="project__role">${role}</span>`)
        .join('');

    // Renderizar galería de imágenes
    renderGallery(project);

    // Renderizar slider before/after si hay imágenes
    if (project.beforeImages && project.beforeImages.length > 0) {
        renderSlider(project);
    }
}

function renderGallery(project) {
    const galleryContainer = document.getElementById('gallery-container');
    
    if (!project.images || project.images.length === 0) {
        galleryContainer.innerHTML = '<p>No hay imágenes disponibles</p>';
        return;
    }

    const cacheBuster = `?v=${Date.now()}`;
    
    galleryContainer.innerHTML = project.images
        .map((img, idx) => {
            // Buscar posición personalizada sin cache buster
            const imgWithoutCache = img.split('?')[0];
            const position = project.imagePositions?.[imgWithoutCache] || 'center center';
            
            return `
                <div class="gallery__item">
                    <img 
                        src="${img}${cacheBuster}" 
                        alt="Galería ${idx + 1}"
                        style="object-position: ${position};"
                    >
                </div>
            `;
        })
        .join('');
}

function renderSlider(project) {
    const sliderContainer = document.getElementById('slider-container');
    
    if (!project.beforeImages || project.beforeImages.length === 0) {
        sliderContainer.style.display = 'none';
        return;
    }

    // Usar la primera imagen before y after para el slider
    const beforeImg = project.beforeImages[0];
    const afterImg = project.images[0];
    
    if (!beforeImg || !afterImg) {
        sliderContainer.style.display = 'none';
        return;
    }

    const cacheBuster = `?v=${Date.now()}`;

    sliderContainer.innerHTML = `
        <div class="comparison-slider__wrapper">
            <img 
                src="${beforeImg}${cacheBuster}" 
                alt="Before" 
                class="comparison-slider__img"
            >
            <div class="comparison-slider__overlay">
                <img 
                    src="${afterImg}${cacheBuster}" 
                    alt="After" 
                    class="comparison-slider__img--after"
                >
            </div>
            <div class="comparison-slider__divider"></div>
        </div>
    `;

    // Inicializar interacción del slider
    initSlider(sliderContainer.querySelector('.comparison-slider__wrapper'));
}

function initSlider(wrapper) {
    if (!wrapper) return;
    
    const overlay = wrapper.querySelector('.comparison-slider__overlay');
    const divider = wrapper.querySelector('.comparison-slider__divider');

    if (!overlay || !divider) return;

    function updateSlider(clientX) {
        const rect = wrapper.getBoundingClientRect();
        let x = clientX - rect.left;

        // Limitar entre 0 y el ancho del contenedor
        x = Math.max(0, Math.min(x, rect.width));
        const percentage = (x / rect.width) * 100;

        overlay.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
        divider.style.left = `${percentage}%`;
    }

    wrapper.addEventListener('mousemove', (e) => updateSlider(e.clientX));
    wrapper.addEventListener('touchmove', (e) => updateSlider(e.touches[0].clientX));

    // Inicializar en 50%
    updateSlider(wrapper.offsetLeft + wrapper.offsetWidth / 2);
}

// Cargar proyecto al abrir la página
document.addEventListener('DOMContentLoaded', loadProject);
