@echo off
cd /d "C:\Users\ramir\Desktop\color-portfolio-web"

echo Verificando estado...
git status

echo.
echo Agregando cambios...
git add -A

echo.
echo Estado después de agregar...
git status

echo.
echo Haciendo commit...
git commit -m "Clean up project structure and add media gitignore

- Remove obsolete files: styles.css, script.js, project.html, project.js, cleanup files, README.md
- Remove unused directories: /images/, /videos/, /assets/images/, /assets/videos/
- Add .gitignore to exclude media files from repository (images/videos in /assets/projects/)
- Keep only production files: loader.js, slider.js, CSS modules, generate-projects.js
- Repository structure now matches cleaned local folder

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"

echo.
echo Pushing a GitHub...
git push

echo.
echo Completado!
pause
