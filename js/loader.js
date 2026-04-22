async function loadProjects() {
    try {
        const response = await fetch('data/projects.json');
        const data = await response.json();
        
        // Ordenar por año descendente (más reciente primero)
        const sortedProjects = data.projects.sort((a, b) => b.year - a.year);
        
        renderProjects(sortedProjects);
    } catch (error) {
        console.error('Error cargando proyectos:', error);
    }
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
    
    const rolesHTML = project.roles
        .map(role => `<span class="project-card__role">${role}</span>`)
        .join('');

    card.innerHTML = `
        <img src="${project.preview}" alt="${project.title}" class="project-card__image">
        <div class="project-card__content">
            <div class="project-card__header">
                <h3 class="project-card__title">${project.title}</h3>
                <span class="project-card__year">${project.year}</span>
            </div>
            <div class="project-card__roles">
                ${rolesHTML}
            </div>
        </div>
    `;

    return card;
}

document.addEventListener('DOMContentLoaded', loadProjects);
