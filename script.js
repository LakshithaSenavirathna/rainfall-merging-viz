// Simple script to handle navigation highlighting and interactions
document.addEventListener('DOMContentLoaded', () => {
    console.log("Rainfall Processing Pipeline Loaded.");

    // Select all sections to monitor scrolling
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');

    window.addEventListener('scroll', () => {
        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('text-indigo-600', 'font-bold');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('text-indigo-600', 'font-bold');
            }
        });
    });
});