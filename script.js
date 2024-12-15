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
let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;

function showSlide(slideIndex) {
    const slider = document.querySelector('.product-slider');
    const dots = document.querySelectorAll('.product-dots button');
    
    // Update slider position
    currentSlide = slideIndex;
    currentTranslate = -currentSlide * 100;
    prevTranslate = currentTranslate;
    slider.style.transform = `translateX(${currentTranslate}%)`;
    
    // Update dots
    dots.forEach((dot, index) => {
        if (index === currentSlide) {
            dot.classList.remove('bg-white/50');
            dot.classList.add('bg-white');
        } else {
            dot.classList.add('bg-white/50');
            dot.classList.remove('bg-white');
        }
    });
}

// Touch events
function touchStart(event) {
    // Only proceed if it's a touch event or left mouse button (button 0)
    if (event.type.includes('mouse') && event.button !== 0) return;
    
    isDragging = true;
    startPos = event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    const slider = document.querySelector('.product-slider');
    slider.style.transition = 'none';
}

function touchMove(event) {
    if (!isDragging || (event.type.includes('mouse') && event.buttons !== 1)) {
        // If mouse button is released during drag
        if (isDragging && event.type.includes('mouse')) {
            touchEnd();
        }
        return;
    }
    
    const currentPosition = event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    const diff = (currentPosition - startPos) * 0.1; // Adjust sensitivity
    currentTranslate = prevTranslate + diff;
    
    // Limit the drag
    currentTranslate = Math.max(Math.min(currentTranslate, 0), -100 * (totalSlides - 1));
    
    const slider = document.querySelector('.product-slider');
    slider.style.transform = `translateX(${currentTranslate}%)`;
}

function touchEnd() {
    isDragging = false;
    const slider = document.querySelector('.product-slider');
    slider.style.transition = 'transform 0.5s ease-in-out';
    
    // Snap to nearest slide
    const slideIndex = Math.round(Math.abs(currentTranslate) / 100);
    showSlide(slideIndex);
}

// Image drag functionality
function handleImageDrag(event) {
    // Prevent default drag behavior
    event.preventDefault();
    // Stop event propagation to prevent slider drag while dragging image
    event.stopPropagation();
    return false;
}

// Add event listeners
document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.product-slider');
    const productImages = document.querySelectorAll('.product-slide img');
    
    // Touch events
    slider.addEventListener('touchstart', touchStart);
    slider.addEventListener('touchmove', touchMove);
    slider.addEventListener('touchend', touchEnd);
    
    // Mouse events
    slider.addEventListener('mousedown', touchStart);
    slider.addEventListener('mousemove', touchMove);
    slider.addEventListener('mouseup', touchEnd);
    slider.addEventListener('mouseleave', touchEnd);
    
    // Prevent context menu on right click
    slider.addEventListener('contextmenu', e => e.preventDefault());

    // Add drag prevention to all product images
    productImages.forEach(img => {
        img.addEventListener('dragstart', handleImageDrag);
        img.addEventListener('mousedown', handleImageDrag);
    });

    // Initialize first slide
    showSlide(0);
});
 