document.addEventListener('DOMContentLoaded', (event) => {
    const servicesSection = document.getElementById('servicesSection');
    const preferencesSection = document.getElementById('preferencesSection');
    const contactSection = document.getElementById('contactSection');

    window.addEventListener('scroll', () => {
        revealSectionOnScroll(servicesSection);
        revealSectionOnScroll(preferencesSection);
        revealSectionOnScroll(contactSection);
    });
});

function revealSectionOnScroll(section) {
    const sectionTop = section.getBoundingClientRect().top;
    const triggerPoint = window.innerHeight / 1.3;

    if (sectionTop < triggerPoint) {
        section.classList.add('visible-section');
    }
}
