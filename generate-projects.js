const fs = require('fs');
const path = require('path');

const projectsDir = path.join(__dirname, 'assets', 'projects');
const outputFile = path.join(__dirname, 'data', 'projects.json');

function generateProjectsJSON() {
    // Leer JSON existente para preservar customizaciones
    let existingProjects = {};
    if (fs.existsSync(outputFile)) {
        try {
            const existing = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
            existingProjects = Object.fromEntries(
                existing.projects.map(p => [p.id, p])
            );
        } catch (e) {
            console.warn('⚠️  No se pudo leer projects.json existente, iniciando desde cero');
        }
    }

    const folders = fs.readdirSync(projectsDir).filter(file => {
        return fs.statSync(path.join(projectsDir, file)).isDirectory();
    });

    const projects = folders.map(folder => {
        const folderPath = path.join(projectsDir, folder);
        const files = fs.readdirSync(folderPath);
        
        // Buscar cover.jpg
        const coverImage = files.find(f => f.toLowerCase() === 'cover.jpg');
        if (!coverImage) {
            console.warn(`⚠️  Carpeta "${folder}" no tiene cover.jpg, será saltada`);
            return null;
        }

        // Imágenes del slideshow (after)
        const afterPath = path.join(folderPath, 'after');
        const afterImages = fs.existsSync(afterPath) 
            ? fs.readdirSync(afterPath)
                .filter(f => {
                    const ext = path.extname(f).toLowerCase();
                    return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
                })
                .sort()
                .map(img => `assets/projects/${folder}/after/${img}`)
            : [];

        // Imágenes del before (antes)
        const beforePath = path.join(folderPath, 'before');
        const beforeImages = fs.existsSync(beforePath) 
            ? fs.readdirSync(beforePath)
                .filter(f => {
                    const ext = path.extname(f).toLowerCase();
                    return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
                })
                .sort()
                .map(img => `assets/projects/${folder}/before/${img}`)
            : [];

        // Buscar tipografía personalizada
        const fontFile = files.find(f => {
            const ext = path.extname(f).toLowerCase();
            return ['.ttf', '.otf', '.woff2', '.woff'].includes(ext);
        });

        // Buscar antes/después videos
        const beforeVideo = files.find(f => f.toLowerCase() === 'before.mp4');
        const afterVideo = files.find(f => f.toLowerCase() === 'after.mp4');

        // Preservar customizaciones existentes o usar defaults
        const existing = existingProjects[folder] || {};

        return {
            id: folder,
            title: folder
                .replace(/_/g, ' ')
                .replace(/\s+/g, ' ')
                .trim()
                .replace(/\b\w/g, c => c.toUpperCase()),
            year: existing.year !== undefined ? existing.year : new Date().getFullYear(),
            roles: existing.roles || ['Colorista'],
            preview: `assets/projects/${folder}/cover.jpg`,
            coverPosition: existing.coverPosition || 'center center',
            images: afterImages,
            imagePositions: existing.imagePositions || {},
            beforeImages: beforeImages,
            font: fontFile ? `assets/projects/${folder}/${fontFile}` : null,
            slider: {
                before: beforeVideo ? `assets/projects/${folder}/before.mp4` : null,
                after: afterVideo ? `assets/projects/${folder}/after.mp4` : null
            }
        };
    }).filter(p => p !== null);

    projects.sort((a, b) => b.year - a.year);

    fs.writeFileSync(outputFile, JSON.stringify({ projects }, null, 2));
    console.log(`✅ ${projects.length} proyectos detectados y guardados en data/projects.json`);
}

try {
    generateProjectsJSON();
} catch (error) {
    console.error('❌ Error:', error.message);
}
