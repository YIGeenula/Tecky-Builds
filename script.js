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
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' }
                },
                zoomIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' }
                }
            },
            animation: {
                fadeIn: 'fadeIn 0.3s ease-out',
                zoomIn: 'zoomIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
            }
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

// Service Modal functionality
const serviceDetails = {
    'data-recovery': {
        title: 'Data Recovery Service',
        icon: 'fas fa-database',
        iconClass: 'bg-gradient-to-br from-emerald-500 to-teal-600',
        content: `
            <div class="space-y-4">
                <p>Our professional data recovery service helps you retrieve lost or corrupted data from various storage devices:</p>
                
                <ul class="list-disc pl-6 space-y-2">
                    <li>Hard Drive Recovery (HDD & SSD)</li>
                    <li>Memory Card & USB Drive Recovery</li>
                    <li>RAID System Data Recovery</li>
                    <li>Accidental Deletion Recovery</li>
                    <li>Corrupted File Recovery</li>
                </ul>

                <div class="bg-gray-800/50 rounded-lg p-4 mt-4">
                    <h4 class="font-bold text-lg mb-2">Our Process:</h4>
                    <ol class="list-decimal pl-6 space-y-2">
                        <li>Free initial diagnosis</li>
                        <li>Professional assessment report</li>
                        <li>Secure data recovery procedure</li>
                        <li>Data verification and validation</li>
                        <li>Secure transfer of recovered data</li>
                    </ol>
                </div>

                <p class="text-cyan-400 mt-4">Contact us now for a free consultation and quote.</p>
            </div>
        `
    },
    'pc-repair': {
        title: 'PC Repair & Upgrade',
        icon: 'fas fa-tools',
        iconClass: 'bg-gradient-to-br from-purple-500 to-pink-600',
        content: `
            <div class="space-y-4">
                <p>Expert PC repair and upgrade services to keep your system running at its best:</p>
                
                <ul class="list-disc pl-6 space-y-2">
                    <li>Hardware Diagnostics & Repair</li>
                    <li>System Performance Optimization</li>
                    <li>Component Upgrades</li>
                    <li>Virus & Malware Removal</li>
                    <li>Operating System Issues</li>
                </ul>

                <div class="bg-gray-800/50 rounded-lg p-4 mt-4">
                    <h4 class="font-bold text-lg mb-2">Services Include:</h4>
                    <ul class="list-disc pl-6 space-y-2">
                        <li>Free diagnostic assessment</li>
                        <li>Quick turnaround time</li>
                        <li>Quality replacement parts</li>
                        <li>Post-repair testing</li>
                        <li>90-day repair warranty</li>
                    </ul>
                </div>

                <p class="text-cyan-400 mt-4">Schedule your repair service today!</p>
            </div>
        `
    },
    'pc-maintenance': {
        title: 'PC Maintenance',
        icon: 'fas fa-shield-virus',
        iconClass: 'bg-gradient-to-br from-orange-500 to-red-600',
        content: `
            <div class="space-y-4">
                <p>Regular maintenance services to ensure optimal performance and longevity of your system:</p>
                
                <ul class="list-disc pl-6 space-y-2">
                    <li>Regular System Cleaning</li>
                    <li>Performance Optimization</li>
                    <li>Software Updates</li>
                    <li>Security Checks</li>
                    <li>Backup Solutions</li>
                </ul>

                <div class="bg-gray-800/50 rounded-lg p-4 mt-4">
                    <h4 class="font-bold text-lg mb-2">Maintenance Plans:</h4>
                    <ul class="list-disc pl-6 space-y-2">
                        <li>Monthly maintenance packages</li>
                        <li>Quarterly system checkups</li>
                        <li>Emergency support</li>
                        <li>Remote assistance</li>
                        <li>Performance monitoring</li>
                    </ul>
                </div>

                <p class="text-cyan-400 mt-4">Start your maintenance plan today!</p>
            </div>
        `
    }
};

function showServiceModal(service) {
    const modal = document.getElementById('serviceModal');
    const backdrop = modal.querySelector('.absolute');
    const modalContent = modal.querySelector('.transform');
    const details = serviceDetails[service];
    
    // Update modal content
    document.getElementById('modalIcon').className = `w-12 h-12 rounded-lg flex items-center justify-center ${details.iconClass}`;
    document.getElementById('modalIcon').innerHTML = `<i class="${details.icon} text-2xl text-white"></i>`;
    document.getElementById('modalTitle').textContent = details.title;
    document.getElementById('modalContent').innerHTML = details.content;
    
    // Show modal with animation
    modal.classList.remove('hidden');
    
    // Trigger animations after a small delay
    requestAnimationFrame(() => {
        backdrop.classList.add('opacity-100');
        modalContent.classList.remove('opacity-0', 'scale-95');
    });
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('serviceModal');
    const backdrop = modal.querySelector('.absolute');
    const modalContent = modal.querySelector('.transform');
    
    // Start closing animations
    backdrop.classList.remove('opacity-100');
    modalContent.classList.add('opacity-0', 'scale-95');
    
    // Hide modal after animation completes
    setTimeout(() => {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }, 300);
}

// Close modal when clicking outside
document.getElementById('serviceModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
        closeModal();
    }
});

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Schedule Modal Functions
function showScheduleModal() {
    const modal = document.getElementById('scheduleModal');
    const backdrop = modal.querySelector('.absolute');
    const modalContent = modal.querySelector('.transform');
    
    // Show modal with animation
    modal.classList.remove('hidden');
    
    // Trigger animations after a small delay
    requestAnimationFrame(() => {
        backdrop.classList.add('opacity-100');
        modalContent.classList.remove('opacity-0', 'scale-95');
    });
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Initialize form submission
    submitScheduleForm();
}

function closeScheduleModal() {
    const modal = document.getElementById('scheduleModal');
    const backdrop = modal.querySelector('.absolute');
    const modalContent = modal.querySelector('.transform');
    
    // Start closing animations
    backdrop.classList.remove('opacity-100');
    modalContent.classList.add('opacity-0', 'scale-95');
    
    // Hide modal after animation completes
    setTimeout(() => {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }, 300);
}

// Update the submitScheduleForm function
function submitScheduleForm() {
    const form = document.getElementById('scheduleForm');
    
    form.removeEventListener('submit', handleSubmit); // Remove any existing listeners
    form.addEventListener('submit', handleSubmit);
}

async function handleSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Show loading state
    const submitButton = document.querySelector('button[type="submit"][form="scheduleForm"]');
    const originalText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = `
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Submitting...
    `;

    try {
        // Collect form data
        const formData = new FormData(form);
        
        // Send data to Web3Forms
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            // Show success message
            showNotification('success', 'Thank you! Your service has been scheduled. We will contact you shortly to confirm.');
            
            // Close modal and reset form
            closeScheduleModal();
            form.reset();
        } else {
            throw new Error('Submission failed');
        }
    } catch (error) {
        // Show error message
        showNotification('error', 'Sorry, something went wrong. Please try again later.');
    } finally {
        // Reset button state
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
    }
}

// Helper function to show notifications
function showNotification(type, message) {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-500 translate-y-[-100%]`;
    notification.innerHTML = `
        <div class="flex items-center space-x-2">
            ${type === 'success' 
                ? '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>'
                : '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>'
            }
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateY(0)';
    }, 100);

    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateY(-100%)';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 5000);
}

// Update the click handler for the Schedule Service button
document.addEventListener('DOMContentLoaded', () => {
    const scheduleButton = document.querySelector('a[href="#"].inline-flex.items-center.justify-center');
    if (scheduleButton) {
        scheduleButton.addEventListener('click', (e) => {
            e.preventDefault();
            showScheduleModal();
        });
    }
});

// Close schedule modal when clicking outside
document.getElementById('scheduleModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
        closeScheduleModal();
    }
});
 