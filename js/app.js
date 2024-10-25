const navLinks = document.querySelectorAll('.nav_Links');
const windowPathname = window.location.pathname;

navLinks.forEach(navLinkes => {
    const navLinkPathname = new URL(navLinkes.href).pathname;

    if (windowPathname === navLinkPathname || windowPathname === '/index.html' && navLinkPathname === '/') {
        navLinkes.classList.add('active');
    }
})


///////////////////////////offconves//////////////////////////////////

document.addEventListener('DOMContentLoaded', function () {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const offCanvasNav = document.getElementById('off-canvas-nav');
    const closeBtn = document.getElementById('close-btn');
    const navLinks = document.querySelectorAll('.off-canvas-nav a');

    // Open off-canvas menu
    hamburgerBtn.addEventListener('click', function () {
        offCanvasNav.classList.add('show');
        document.body.classList.add('no-scroll');
    });

    // Close off-canvas menu
    closeBtn.addEventListener('click', function () {
        offCanvasNav.classList.remove('show');
        document.body.classList.remove('no-scroll');
    });

    // Smooth scroll to section and close menu
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            offCanvasNav.classList.remove('show');
            document.body.classList.remove('no-scroll');
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});


////////////////////////Slider/////////////////////////////////


let currentSlide = 0;

function showSlide(index) {
    const slides = document.querySelector('.carousel-images');
    const totalSlides = document.querySelectorAll('.carousel-slide').length;

    if (index >= totalSlides) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = totalSlides - 1;
    } else {
        currentSlide = index;
    }

    slides.style.transform = `translateX(-${currentSlide * 100}%)`;
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}


// Function to update the cart badge based on localStorage
function updateCartBadge() {
    // Retrieve the cart data from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Calculate the total number of items in the cart
    let totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    // Update the badge with the total number of items
    document.querySelector('.shop .badge').textContent = totalItems;
}

// Call the function to update the badge on page load
updateCartBadge();
