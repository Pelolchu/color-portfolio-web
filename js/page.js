// Project Detail Page - Load and render project data
async function loadProjectPage() {
    console.log('🚀 Starting loadProjectPage');
    
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('id');
    
    console.log('📌 Project ID:', projectId);

    if (!projectId) {
        console.error('No project ID found');
        window.location.href = 'index.html';
        return;
    }

    try {
        const response = await fetch('data/projects.json');
        const data = await response.json();
        
        const project = data.projects.find(p => p.id === projectId);
        
        if (!project) {
            console.error('Project not found:', projectId);
            window.location.href = 'index.html';
            return;
        }

        setupPage(project);
    } catch (error) {
        console.error('Error:', error);
        window.location.href = 'index.html';
    }
}

function setupPage(project) {
    console.log('⚙️ Setting up page for:', project.title);
    
    // Load custom font if exists
    if (project.font) {
        const fontName = `ProjectFont-${project.id}`;
        const style = document.createElement('style');
        style.textContent = `
            @font-face {
                font-family: '${fontName}';
                src: url('${project.font}') format('truetype');
                font-display: swap;
            }
        `;
        document.head.appendChild(style);
        document.getElementById('project-title').style.fontFamily = `'${fontName}', serif`;
    }

    // Set title and meta
    document.getElementById('project-title').textContent = project.title;
    document.title = `${project.title} - Colorista`;
    document.getElementById('project-year').textContent = project.year;
    
    const rolesContainer = document.getElementById('project-roles');
    rolesContainer.innerHTML = project.roles
        .map(role => `<span class="project__role">${role}</span>`)
        .join('');

    // Render gallery
    renderGallery(project);

    // Render slider if has before images
    if (project.beforeImages && project.beforeImages.length > 0) {
        renderSlider(project);
    }
}

// Store slider position globally
let currentSliderPosition = 50;
let currentImageIndex = 0;

function renderGallery(project) {
    console.log('🖼️ Rendering gallery');
    
    const container = document.getElementById('gallery-container');
    const cacheBuster = `?v=${Date.now()}`;
    
    container.innerHTML = project.images
        .map((img, idx) => {
            const baseImg = img.split('?')[0];
            const position = project.imagePositions?.[baseImg] || 'center center';
            const activeClass = idx === 0 ? 'active' : '';
            return `<div class="gallery__item ${activeClass}" data-index="${idx}"><img src="${img}${cacheBuster}" alt="Gallery ${idx + 1}" style="object-position: ${position};"></div>`;
        })
        .join('');

    // Add click listeners to gallery items
    container.querySelectorAll('.gallery__item').forEach(item => {
        item.addEventListener('click', () => {
            const index = parseInt(item.dataset.index);
            setActiveImage(container, index);
            updateSlider(project, index);
        });
    });
}

function setActiveImage(container, index) {
    container.querySelectorAll('.gallery__item').forEach((item, idx) => {
        item.classList.remove('active');
        if (idx === index) {
            item.classList.add('active');
        }
    });
    currentImageIndex = index;
}

function updateSlider(project, imageIndex) {
    console.log('🎚️ Updating slider to index:', imageIndex);
    
    const beforeImg = project.beforeImages[imageIndex];
    const afterImg = project.images[imageIndex];

    if (!beforeImg || !afterImg) {
        console.error('Images not found at index:', imageIndex);
        return;
    }

    const container = document.getElementById('slider-container');
    const wrapper = container.querySelector('.comparison-slider__wrapper');
    
    if (!wrapper) {
        updateSliderHTML(container, beforeImg, afterImg);
        return;
    }

    const cacheBuster = `?v=${Date.now()}`;
    const beforeLayer = wrapper.querySelector('.comparison-slider__before-layer');
    const oldBefore = beforeLayer?.querySelector('.comparison-slider__img');
    const oldAfter = wrapper.querySelector('.comparison-slider__overlay .comparison-slider__img--after');
    const overlay = wrapper.querySelector('.comparison-slider__overlay');

    if (!beforeLayer || !oldBefore || !oldAfter || !overlay) {
        updateSliderHTML(container, beforeImg, afterImg);
        return;
    }

    // Pre-load new images
    const preloadBefore = new Image();
    const preloadAfter = new Image();
    
    let loadedCount = 0;
    
    const onLoad = () => {
        loadedCount++;
        if (loadedCount === 2) {
            startCrossfade();
        }
    };
    
    preloadBefore.onload = onLoad;
    preloadAfter.onload = onLoad;
    
    preloadBefore.src = beforeImg + cacheBuster;
    preloadAfter.src = afterImg + cacheBuster;
    
    // Fallback in case images are already cached
    setTimeout(() => {
        if (loadedCount < 2) startCrossfade();
    }, 200);

function startCrossfade() {
        // Create new images for crossfade
        const tempBefore = document.createElement('img');
        const tempAfter = document.createElement('img');
        
        tempBefore.src = beforeImg + cacheBuster;
        tempAfter.src = afterImg + cacheBuster;
        tempBefore.className = 'comparison-slider__img';
        tempAfter.className = 'comparison-slider__img--after';
        
        tempBefore.style.opacity = '0';
        tempAfter.style.opacity = '0';
        tempBefore.style.transition = 'opacity 0.5s ease';
        tempAfter.style.transition = 'opacity 0.5s ease';
        
        // Ensure old images have transition
        oldBefore.style.transition = 'opacity 0.5s ease';
        oldAfter.style.transition = 'opacity 0.5s ease';
        
        beforeLayer.appendChild(tempBefore);
        overlay.appendChild(tempAfter);

        // Trigger reflow to ensure transition works
        void tempBefore.offsetHeight;

        // Keep each side masked to its own layer during transition
        applySliderMasks(wrapper, currentSliderPosition);

        // Simultaneous crossfade on both sides
        // Left side (before): old fades out, new fades in
        tempBefore.style.opacity = '1';
        oldBefore.style.opacity = '0';
        
        // Right side (after inside overlay): old fades out, new fades in
        tempAfter.style.opacity = '1';
        oldAfter.style.opacity = '0';

        // After transition, remove old and keep new
        setTimeout(() => {
            oldBefore.remove();
            oldAfter.remove();
            
            tempBefore.style.transition = 'none';
            tempAfter.style.transition = 'none';
        }, 500);
    }
}

function updateSliderHTML(container, beforeImg, afterImg) {
    const cacheBuster = `?v=${Date.now()}`;
    
    container.innerHTML = `
        <div class="comparison-slider__wrapper">
            <div class="comparison-slider__before-layer">
                <img src="${beforeImg}${cacheBuster}" alt="Before" class="comparison-slider__img" style="opacity: 1;">
            </div>
            <div class="comparison-slider__overlay">
                <img src="${afterImg}${cacheBuster}" alt="After" class="comparison-slider__img--after" style="opacity: 1;">
            </div>
            <div class="comparison-slider__divider"></div>
        </div>
    `;

    const wrapper = container.querySelector('.comparison-slider__wrapper');
    const divider = wrapper.querySelector('.comparison-slider__divider');
    
    initSliderInteraction(wrapper, divider);
}

function renderSlider(project) {
    console.log('🎚️ Rendering slider');
    
    // Show first image by default and mark as active
    setActiveImage(document.getElementById('gallery-container'), 0);
    updateSlider(project, 0);
}

function initSliderInteraction(wrapper, divider) {
    if (!wrapper) return;
    
    const overlay = wrapper.querySelector('.comparison-slider__overlay');
    const beforeLayer = wrapper.querySelector('.comparison-slider__before-layer');

    if (!overlay || !beforeLayer || !divider) {
        divider = wrapper.querySelector('.comparison-slider__divider');
        if (!divider) return;
    }

    wrapper.addEventListener('mousemove', (e) => {
        const rect = wrapper.getBoundingClientRect();
        const percent = Math.max(0, Math.min(e.clientX - rect.left, rect.width)) / rect.width * 100;
        currentSliderPosition = percent;
        applySliderMasks(wrapper, percent);
        divider.style.left = percent + '%';
    });

    // Restore position to last known state
    applySliderMasks(wrapper, currentSliderPosition);
    divider.style.left = currentSliderPosition + '%';
}

function applySliderMasks(wrapper, percent) {
    const beforeLayer = wrapper.querySelector('.comparison-slider__before-layer');
    const overlay = wrapper.querySelector('.comparison-slider__overlay');

    if (!beforeLayer || !overlay) return;

    // Before stays on the left, after stays on the right.
    beforeLayer.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
    overlay.style.clipPath = `inset(0 0 0 ${percent}%)`;
}

document.addEventListener('DOMContentLoaded', loadProjectPage);
