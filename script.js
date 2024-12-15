// Tailwind configuration
tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                poppins: ['Poppins', 'sans-serif'],
            },
            colors: {
                primary: '#ff4081',
                secondary: '#1a237e',
            },
        },
    },
}

// Function to change background gradient
function changeBackground(color) {
    const heroGradient = document.getElementById('hero-gradient');
    heroGradient.style.animation = 'none';
    heroGradient.offsetHeight; // Trigger reflow
    heroGradient.style.animation = null;
    
    switch(color) {
        case 'blue':
            heroGradient.className = 'bg-gradient-to-br from-black via-black to-cyan-500 gradient-transition';
            break;
        case 'purple':
            heroGradient.className = 'bg-gradient-to-br from-black via-black to-fuchsia-600 gradient-transition';
            break;
        case 'green':
            heroGradient.className = 'bg-gradient-to-br from-black via-black to-lime-500 gradient-transition';
            break;
        case 'orange':
            heroGradient.className = 'bg-gradient-to-br from-black via-black to-orange-500 gradient-transition';
            break;
        default:
            heroGradient.className = 'bg-gradient-to-br from-black via-black to-secondary gradient-transition';
    }
}

// Splash Screen Animation
document.addEventListener('DOMContentLoaded', function() {
    const loadingBar = document.getElementById('loading-bar');
    const mainContent = document.getElementById('main-content');

    // Animate loading bar
    setTimeout(() => {
        loadingBar.style.width = '100%';
    }, 100);

    // Optional: Prevent scrolling during splash screen
    document.body.style.overflow = 'hidden';
    
    // Remove scroll lock after splash screen
    setTimeout(() => {
        document.body.style.overflow = '';
    }, 3000);
});

// Product Slider
let currentSlide = 0;
const totalSlides = 2;
let slideInterval;
let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;

function showSlide(index) {
    currentSlide = index;
    currentTranslate = -index * 100;
    prevTranslate = currentTranslate;
    
    const slider = document.querySelector('.product-slider');
    
    // Add smooth transition
    slider.style.transition = 'transform 0.3s ease-out';
    slider.style.transform = `translateX(${currentTranslate}%)`;
    
    // Update dots
    const dots = document.querySelectorAll('.product-dots button');
    dots.forEach((dot, i) => {
        if (i === index) {
            dot.classList.remove('bg-white/50');
            dot.classList.add('bg-white');
        } else {
            dot.classList.remove('bg-white');
            dot.classList.add('bg-white/50');
        }
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}

function startSlideShow() {
    // Clear any existing interval
    if (slideInterval) {
        clearInterval(slideInterval);
    }
    // Set new interval
    slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
}

function pauseSlideShow() {
    if (slideInterval) {
        clearInterval(slideInterval);
    }
}

// Touch events
function touchStart(event) {
    // Pause slideshow when user starts dragging
    pauseSlideShow();
    
    // Only proceed if it's a touch event or left mouse button (button 0)
    if (event.type.includes('mouse') && event.button !== 0) return;
    
    isDragging = true;
    startPos = event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    const slider = document.querySelector('.product-slider');
    slider.style.transition = 'none';
}

function touchMove(event) {
    if (!isDragging || (event.type.includes('mouse') && event.buttons !== 1)) {
        if (isDragging && event.type.includes('mouse')) {
            touchEnd();
        }
        return;
    }
    
    const currentPosition = event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    const diff = currentPosition - startPos;
    
    // Adjust sensitivity based on device type and screen size
    const isMobile = window.innerWidth < 1024; // Check if we're in mobile/tablet view
    const sensitivity = event.type.includes('mouse') ? 0.1 : (isMobile ? 0.4 : 0.3);
    currentTranslate = prevTranslate + (diff * sensitivity);
    
    // Add some resistance at the edges
    if (currentTranslate > 0) {
        currentTranslate = currentTranslate * 0.5;
    } else if (currentTranslate < -100 * (totalSlides - 1)) {
        const overScroll = currentTranslate + (100 * (totalSlides - 1));
        currentTranslate = -100 * (totalSlides - 1) + (overScroll * 0.5);
    }
    
    const slider = document.querySelector('.product-slider');
    slider.style.transform = `translateX(${currentTranslate}%)`;
}

function touchEnd() {
    isDragging = false;
    const slider = document.querySelector('.product-slider');
    slider.style.transition = 'transform 0.3s ease-out'; // Slightly faster transition for better response
    
    // Add momentum-based scrolling
    const velocity = currentTranslate - prevTranslate;
    let targetSlide = Math.round(Math.abs(currentTranslate) / 100);
    
    // If the swipe was fast enough, move to the next/previous slide
    if (Math.abs(velocity) > 5) {
        targetSlide = velocity < 0 ? 
            Math.ceil(Math.abs(currentTranslate) / 100) : 
            Math.floor(Math.abs(currentTranslate) / 100);
    }
    
    // Ensure targetSlide is within bounds
    targetSlide = Math.max(0, Math.min(targetSlide, totalSlides - 1));
    
    showSlide(targetSlide);
    
    // Resume slideshow after a short delay
    setTimeout(startSlideShow, 300);
}

// Initialize slider when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    const productContainer = document.querySelector('.product-container');
    const slider = document.querySelector('.product-slider');
    
    // Start slideshow
    startSlideShow();
    
    // Pause on hover
    productContainer.addEventListener('mouseenter', pauseSlideShow);
    productContainer.addEventListener('mouseleave', startSlideShow);
    
    // Touch events with passive option for better performance
    slider.addEventListener('touchstart', touchStart, { passive: true });
    slider.addEventListener('touchmove', touchMove, { passive: false }); // Need to prevent default sometimes
    slider.addEventListener('touchend', touchEnd, { passive: true });
    
    // Mouse events
    slider.addEventListener('mousedown', touchStart);
    slider.addEventListener('mousemove', touchMove);
    slider.addEventListener('mouseup', touchEnd);
    slider.addEventListener('mouseleave', touchEnd);
    
    // Prevent context menu on right click
    slider.addEventListener('contextmenu', e => e.preventDefault());
    
    // Initialize first slide
    showSlide(0);
});

// Image drag prevention
function handleImageDrag(event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
}

// Add drag prevention to all product images
document.addEventListener('DOMContentLoaded', function() {
    const productImages = document.querySelectorAll('.product-slide img');
    productImages.forEach(img => {
        img.addEventListener('dragstart', handleImageDrag);
        img.addEventListener('mousedown', handleImageDrag);
    });
});

// Add resize handler to adjust layout when screen size changes
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Ensure current slide is properly positioned after resize
        showSlide(currentSlide);
    }, 250);
});

// Add some CSS to ensure smooth transitions
const style = document.createElement('style');
style.textContent = `
    .product-slider {
        transition: transform 0.3s ease-out;
    }
    .product-slide {
        scroll-snap-align: start;
    }
    @media (max-width: 1023px) {
        .product-slide img {
            height: 40vw;
            max-height: 200px;
        }
    }
`;
document.head.appendChild(style);
 