async function loadProject() {
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('id');

    if (!projectId) {
        window.location.href = 'index.html';
        return;
    }

    try {
        const response = await fetch('data/projects.json');
        const data = await response.json();
        const project = data.projects.find(p => p.id === projectId);

        if (!project) {
            window.location.href = 'index.html';
            return;
        }

        renderProject(project);
    } catch (error) {
        console.error('Error cargando proyecto:', error);
    }
}

function renderProject(project) {
    document.getElementById('project-title').textContent = project.title;
    document.getElementById('project-year').textContent = project.year;

    const rolesContainer = document.getElementById('project-roles');
    rolesContainer.innerHTML = project.roles
        .map(role => `<span class="project-header__role">${role}</span>`)
        .join('');

    if (project.slider) {
        document.getElementById('video-before').src = project.slider.before;
        document.getElementById('video-after').src = project.slider.after;
    }

    const gallery = document.getElementById('gallery-grid');
    gallery.innerHTML = '';
    
    if (project.images && project.images.length > 0) {
        project.images.forEach(imagePath => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.innerHTML = `<img src="${imagePath}" alt="Galería">`;
            gallery.appendChild(item);
        });
    }

    document.title = `${project.title} - Colorista`;
}

document.addEventListener('DOMContentLoaded', loadProject);
