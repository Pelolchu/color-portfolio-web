async function loadProjects() {
    try {
        const response = await fetch('data/projects.json');
        const data = await response.json();
        renderProjects(data.projects);
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
            <h3 class="project-card__title">${project.title}</h3>
            <span class="project-card__year">${project.year}</span>
            <div class="project-card__roles">
                ${rolesHTML}
            </div>
        </div>
    `;

    return card;
}

document.addEventListener('DOMContentLoaded', loadProjects);
