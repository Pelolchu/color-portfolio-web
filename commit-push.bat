@echo off
cd /d "C:\Users\ramir\Desktop\color-portfolio-web"

echo Agregando cambios...
git add -A

echo Haciendo commit...
git commit -m "Build project detail page with gallery and before/after slider

- Create project.html with shared header, title with custom font, meta info
- Add project.css with 3-column responsive gallery (10px gap, no crop)
- Gallery shows images with original aspect ratio using object-fit: contain
- Create project.js to load project data, render gallery, and init slider
- Clickable cards on homepage now link to project.html?id=projectId
- Custom fonts loaded dynamically per project
- Slider component initialized with mouse/touch interaction
- Responsive: 2 cols on tablet, 1 col on mobile

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"

echo Pushing a GitHub...
git push

echo Completado!
