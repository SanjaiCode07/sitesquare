// Tailwind CSS configuration
window.tailwind = window.tailwind || {};
window.tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          black: '#080808',
          gray: '#1a1a1a',
          light: '#f8fafc',
          blue: '#2563eb',
        }
      }
    }
  }
};

function setPricingMode(mode) {
  const btnMaintenance = document.getElementById('btn-maintenance');
  const btnProject = document.getElementById('btn-project');
  const gridMaintenance = document.getElementById('pricing-maintenance');
  const gridProject = document.getElementById('pricing-project');

  const activeTab = 'relative pb-5 text-sm font-bold uppercase tracking-widest transition-all duration-300 text-brand-light border-b-2 border-brand-blue -mb-px';
  const inactiveTab = 'relative pb-5 text-sm font-bold uppercase tracking-widest transition-all duration-300 text-brand-light/40 hover:text-brand-light/70 border-b-2 border-transparent -mb-px';

  if (mode === 'maintenance') {
    btnMaintenance.className = activeTab + ' px-10';
    btnProject.className = inactiveTab + ' pr-10';
    gridMaintenance.classList.remove('hidden');
    gridProject.classList.add('hidden');
    // Trigger scroll event on maintenance container to update dots
    const maintenanceScroll = document.getElementById('maintenance-scroll-container');
    if (maintenanceScroll) maintenanceScroll.dispatchEvent(new Event('scroll'));
  } else {
    btnProject.className = activeTab + ' pr-10';
    btnMaintenance.className = inactiveTab + ' px-10';
    gridMaintenance.classList.add('hidden');
    gridProject.classList.remove('hidden');
    // Trigger scroll event on project container to update dots
    const projectScroll = document.getElementById('project-scroll-container');
    if (projectScroll) projectScroll.dispatchEvent(new Event('scroll'));
  }
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const btn = document.getElementById('menu-btn');
  
  if (menu.classList.contains('active')) {
    menu.classList.remove('active');
    btn.classList.remove('active');
  } else {
    menu.classList.add('active');
    btn.classList.add('active');
  }
}

function scrollToCard(containerId, index) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const cards = container.children;
  if (cards && cards[index]) {
    const cardWidth = cards[index].offsetWidth;
    const gap = 24; // gap-6 is 24px (1.5rem)
    container.scrollTo({
      left: index * (cardWidth + gap),
      behavior: 'smooth'
    });
  }
}

function setupScrollIndicator(containerId, dotsContainerId) {
  const container = document.getElementById(containerId);
  const dotsContainer = document.getElementById(dotsContainerId);
  if (!container || !dotsContainer) return;
  
  const dots = dotsContainer.children;
  
  const updateDots = () => {
    const cards = container.children;
    if (!cards || cards.length === 0) return;
    
    const containerCenter = container.scrollLeft + (container.clientWidth / 2);
    let activeIndex = 0;
    let minDistance = Infinity;
    
    for (let i = 0; i < dots.length; i++) {
      const card = cards[i];
      if (!card) continue;
      const cardCenter = card.offsetLeft + (card.offsetWidth / 2);
      const distance = Math.abs(containerCenter - cardCenter);
      if (distance < minDistance) {
        minDistance = distance;
        activeIndex = i;
      }
    }
    
    for (let i = 0; i < dots.length; i++) {
      if (i === activeIndex) {
        dots[i].className = 'h-2 w-6 rounded-full bg-brand-blue transition-all duration-300';
      } else {
        dots[i].className = 'h-2 w-2 rounded-full bg-brand-light/20 transition-all duration-300';
      }
    }
  };

  container.addEventListener('scroll', updateDots);
  // Run once initially
  updateDots();
  // Handle window resizing
  window.addEventListener('resize', updateDots);
}

// Initialize scroll indicator dots & contact form handler on DOM load
document.addEventListener('DOMContentLoaded', () => {
  setupScrollIndicator('project-scroll-container', 'project-dots');
  setupScrollIndicator('maintenance-scroll-container', 'maintenance-dots');

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('contact-name').value;
      const email = document.getElementById('contact-email').value;
      const service = document.getElementById('contact-service').value;
      const details = document.getElementById('contact-details').value;
      
      const formattedText = `*SiteSquare Project Inquiry*\n` +
                            `━━━━━━━━━━━━━━━━━━━━━\n` +
                            `*Name:* ${name}\n` +
                            `*Email:* ${email}\n` +
                            `*Service:* ${service}\n` +
                            `*Details:* ${details}\n` +
                            `━━━━━━━━━━━━━━━━━━━━━`;
                            
      const whatsappUrl = `https://wa.me/919443770906?text=${encodeURIComponent(formattedText)}`;
      
      window.open(whatsappUrl, '_blank');
    });
  }
});
