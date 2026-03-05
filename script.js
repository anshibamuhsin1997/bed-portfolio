
const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

menuBtn.onclick = function () {

    if (navMenu.style.display === "flex") {
        navMenu.style.display = "none";
    }
    else {
        navMenu.style.display = "flex";
    }

};

document.querySelectorAll('#navMenu a').forEach(link => {

    link.addEventListener('click', () => {

        if (window.innerWidth <= 768) {
            navMenu.style.display = "none";
        }

    });

});


const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const themeText = document.getElementById("themeText");

themeToggle.onclick = () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        themeIcon.innerHTML = "☀️";
        themeText.innerHTML = "Light";

    } else {

        themeIcon.innerHTML = "🌙";
        themeText.innerHTML = "Dark";

    }

};


ScrollReveal().reveal('.hero-content', {
    delay: 200,
    distance: '50px',
    origin: 'bottom'
});

ScrollReveal().reveal('.card', {
    interval: 200,
    distance: '40px',
    origin: 'bottom'
});

ScrollReveal().reveal('.timeline-item', {
    delay: 200,
    origin: 'left'
});

ScrollReveal().reveal('.gallery img', {
    interval: 200,
    scale: 0.9
});
