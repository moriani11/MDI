const disabledProjects = document.querySelectorAll('.project.disabled');

disabledProjects.forEach(project => {
  project.addEventListener('click', () => {
    alert('Dit project is nog niet beschikbaar');
  });
});