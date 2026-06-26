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

let appData = null;

// Initialize scroll indicator dots & contact form handler on DOM load
document.addEventListener('DOMContentLoaded', () => {
  loadDynamicData();

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
                            
      const whatsappNum = (appData && appData.contact && appData.contact.whatsapp) || '919443770906';
      const whatsappUrl = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(formattedText)}`;
      
      window.open(whatsappUrl, '_blank');
    });
  }
});

function loadDynamicData() {
  const GITHUB_URL = `https://raw.githubusercontent.com/SanjaiCode07/sitesquare/main/data.json?t=${Date.now()}`;
  const LOCAL_URL = `data.json?t=${Date.now()}`;

  fetch(GITHUB_URL)
    .then(res => {
      if (!res.ok) throw new Error('Failed to load from GitHub raw URL');
      return res.json();
    })
    .catch(err => {
      console.warn('GitHub fetch failed, falling back to local data.json:', err);
      return fetch(LOCAL_URL).then(res => res.json());
    })
    .then(data => {
      appData = data;
      renderContent(data);
    })
    .catch(err => {
      console.error('Data loading completely failed:', err);
    });
}

function renderContent(data) {
  // 0. Render hero description
  const heroDesc = document.getElementById('hero-description');
  if (heroDesc && data.hero && data.hero.description) {
    heroDesc.textContent = data.hero.description;
  }

  // 1. Render projects
  const projectsGrid = document.getElementById('projects-grid');
  if (projectsGrid && data.projects) {
    projectsGrid.innerHTML = data.projects.map((proj, idx) => {
      const mtClass = idx === 1 ? 'md:mt-12' : idx === 2 ? 'md:mt-24' : '';
      return `
        <a href="${proj.link}" target="_blank" class="relative group overflow-hidden block ${mtClass}">
          <div class="w-full aspect-[20/21] bg-brand-gray overflow-hidden">
            <img src="${proj.image}" alt="${proj.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
          <div class="absolute inset-0 bg-gradient-to-t from-brand-black to-transparent opacity-70 pointer-events-none"></div>
          <div class="absolute bottom-8 left-8">
            <div class="text-xs font-bold text-brand-blue mb-2 tracking-widest">${proj.category} / ${proj.year}</div>
            <div class="text-2xl font-display font-semibold">${proj.title}</div>
          </div>
        </a>
      `;
    }).join('');
  }

  // 2. Render capabilities
  const capabilitiesList = document.getElementById('capabilities-list');
  if (capabilitiesList && data.capabilities) {
    capabilitiesList.innerHTML = data.capabilities.map(cap => `
      <div class="py-10 md:py-12 flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-12 group cursor-pointer">
        <div class="text-sm font-bold text-brand-blue md:w-12">${cap.id}</div>
        <div class="text-4xl md:text-6xl font-display font-semibold flex-1 group-hover:translate-x-4 transition-transform duration-500">${cap.title}</div>
        <div class="max-w-xs text-sm text-brand-black/60 leading-relaxed">${cap.description}</div>
      </div>
    `).join('');
  }

  // 3. Render pricing (project & maintenance)
  const projectContainer = document.getElementById('project-scroll-container');
  if (projectContainer && data.pricing && data.pricing.project) {
    projectContainer.innerHTML = data.pricing.project.map(tier => {
      const isFeatured = tier.featured;
      const cardBg = isFeatured ? 'bg-brand-blue text-white' : 'bg-brand-gray/30 text-brand-light border border-brand-light/10 hover:border-brand-light/25';
      const labelColor = isFeatured ? 'text-white/60' : 'text-brand-blue';
      const arrowBg = isFeatured ? 'bg-white/10 border-white/30 group-hover:bg-white' : 'border-brand-light/15 group-hover:border-brand-blue group-hover:bg-brand-blue';
      const arrowColor = isFeatured ? 'text-sm leading-none text-white group-hover:text-brand-blue transition-colors duration-300' : 'text-sm leading-none group-hover:text-white transition-colors duration-300';
      const descColor = isFeatured ? 'text-white/65 border-white/15' : 'text-brand-light/55 border-brand-light/8';
      const listColor = isFeatured ? 'text-white/85' : 'text-brand-light/75';
      const dotBg = isFeatured ? 'bg-white' : 'bg-brand-blue';
      const btnBorder = isFeatured ? 'border-white/20 text-white hover:text-white/70' : 'border-brand-light/10 hover:text-brand-blue';
      
      const featuresHtml = tier.features.map(f => `
        <li class="flex items-center gap-4 text-sm ${listColor}">
          <span class="w-1.5 h-1.5 rounded-full ${dotBg} shrink-0"></span>
          ${f}
        </li>
      `).join('');

      return `
        <div class="group relative flex flex-col p-8 md:p-12 transition-all duration-500 w-[85vw] sm:w-[380px] lg:w-auto shrink-0 snap-center ${cardBg}">
          ${isFeatured ? `
            <div class="absolute -top-24 -right-24 w-56 h-56 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
            <div class="absolute -bottom-16 -left-16 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
          ` : ''}
          <div class="flex items-start justify-between mb-12 relative z-10">
            <div>
              <div class="text-[10px] font-bold tracking-[0.3em] uppercase mb-3 ${labelColor}">${tier.tier} ${isFeatured ? '&nbsp;&middot;&nbsp; Most Chosen' : ''}</div>
              <div class="text-3xl font-display font-bold tracking-tight">${tier.name}</div>
            </div>
            <div class="w-9 h-9 border flex items-center justify-center shrink-0 transition-all duration-400 ${arrowBg}">
              <span class="text-sm leading-none transition-colors duration-300 ${arrowColor}">&#8599;</span>
            </div>
          </div>

          <div class="mb-10 relative z-10">
            <div class="text-5xl md:text-7xl font-display font-extrabold tracking-tighter leading-none mb-3">${tier.price}</div>
            <div class="text-xs font-medium tracking-[0.2em] uppercase text-brand-light/35">${tier.duration}</div>
          </div>

          <p class="text-sm leading-relaxed mb-10 pb-10 border-b relative z-10 ${descColor}">
            ${tier.description}
          </p>

          <ul class="space-y-5 mb-14 flex-1 relative z-10">
            ${featuresHtml}
          </ul>

          <a href="#contact" class="group/btn relative z-10 inline-flex items-center justify-between text-xs font-bold tracking-widest uppercase pt-6 border-t transition-colors duration-300 ${btnBorder}">
            <span>Get Started</span>
            <span class="transition-transform group-hover/btn:translate-x-2 duration-300">&rarr;</span>
          </a>
        </div>
      `;
    }).join('');
  }

  const maintenanceContainer = document.getElementById('maintenance-scroll-container');
  if (maintenanceContainer && data.pricing && data.pricing.maintenance) {
    maintenanceContainer.innerHTML = data.pricing.maintenance.map(tier => {
      const isFeatured = tier.featured;
      const cardBg = isFeatured ? 'bg-brand-blue text-white' : 'bg-brand-gray/30 text-brand-light border border-brand-light/10 hover:border-brand-light/25';
      const labelColor = isFeatured ? 'text-white/60' : 'text-brand-blue';
      const arrowBg = isFeatured ? 'bg-white/10 border-white/30 group-hover:bg-white' : 'border-brand-light/15 group-hover:border-brand-blue group-hover:bg-brand-blue';
      const arrowColor = isFeatured ? 'text-sm leading-none text-white group-hover:text-brand-blue transition-colors duration-300' : 'text-sm leading-none group-hover:text-white transition-colors duration-300';
      const descColor = isFeatured ? 'text-white/65 border-white/15' : 'text-brand-light/55 border-brand-light/8';
      const listColor = isFeatured ? 'text-white/85' : 'text-brand-light/75';
      const dotBg = isFeatured ? 'bg-white' : 'bg-brand-blue';
      const btnBorder = isFeatured ? 'border-white/20 text-white hover:text-white/70' : 'border-brand-light/10 hover:text-brand-blue';
      
      const featuresHtml = tier.features.map(f => `
        <li class="flex items-center gap-4 text-sm ${listColor}">
          <span class="w-1.5 h-1.5 rounded-full ${dotBg} shrink-0"></span>
          ${f}
        </li>
      `).join('');

      return `
        <div class="group relative flex flex-col p-8 md:p-12 transition-all duration-500 w-[85vw] sm:w-[380px] lg:w-auto shrink-0 snap-center ${cardBg}">
          ${isFeatured ? `
            <div class="absolute -top-24 -right-24 w-56 h-56 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
            <div class="absolute -bottom-16 -left-16 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
          ` : ''}
          <div class="flex items-start justify-between mb-12 relative z-10">
            <div>
              <div class="text-[10px] font-bold tracking-[0.3em] uppercase mb-3 ${labelColor}">${tier.tier} ${isFeatured ? '&nbsp;&middot;&nbsp; Most Chosen' : ''}</div>
              <div class="text-3xl font-display font-bold tracking-tight">${tier.name}</div>
            </div>
            <div class="w-9 h-9 border flex items-center justify-center shrink-0 transition-all duration-400 ${arrowBg}">
              <span class="text-sm leading-none transition-colors duration-300 ${arrowColor}">&#8599;</span>
            </div>
          </div>

          <div class="mb-10 relative z-10">
            <div class="text-5xl md:text-7xl font-display font-extrabold tracking-tighter leading-none mb-3">${tier.price}</div>
            <div class="text-xs font-medium tracking-[0.2em] uppercase text-brand-light/35">${tier.duration}</div>
          </div>

          <p class="text-sm leading-relaxed mb-10 pb-10 border-b relative z-10 ${descColor}">
            ${tier.description}
          </p>

          <ul class="space-y-5 mb-14 flex-1 relative z-10">
            ${featuresHtml}
          </ul>

          <a href="#contact" class="group/btn relative z-10 inline-flex items-center justify-between text-xs font-bold tracking-widest uppercase pt-6 border-t transition-colors duration-300 ${btnBorder}">
            <span>Start Plan</span>
            <span class="transition-transform group-hover/btn:translate-x-2 duration-300">&rarr;</span>
          </a>
        </div>
      `;
    }).join('');
  }

  // 4. Render contact info
  const contactInfo = document.getElementById('contact-info');
  if (contactInfo && data.contact) {
    const phonesHtml = data.contact.phones.map(phone => `
      <a href="tel:${phone.replace(/\s+/g, '')}" class="block text-xl font-display font-semibold hover:text-brand-blue transition-colors duration-300">
        ${phone}
      </a>
    `).join('');

    contactInfo.innerHTML = `
      <div class="space-y-1">
        <span class="text-[10px] font-bold tracking-widest text-brand-light/30 uppercase block">Email Address</span>
        <a href="mailto:${data.contact.email}" class="block text-2xl font-display font-semibold hover:text-brand-blue transition-colors duration-300">
          ${data.contact.email}
        </a>
      </div>
      <div class="space-y-2">
        <span class="text-[10px] font-bold tracking-widest text-brand-light/30 uppercase block">Phone Numbers</span>
        ${phonesHtml}
      </div>
      <div class="text-sm text-brand-light/50 leading-relaxed pt-4 border-t border-brand-light/5">
        We take on a limited number of engagements each quarter. Send us a brief &mdash;
        we'll respond within two business days.
      </div>
    `;

    // Update floating WhatsApp widget link dynamically
    const floatingWhatsapp = document.querySelector('a[aria-label="Chat on WhatsApp"]');
    if (floatingWhatsapp && data.contact.whatsapp) {
      floatingWhatsapp.href = `https://wa.me/${data.contact.whatsapp}`;
    }
  }

  // Re-run setup scroll dots indicators since elements were added dynamically
  setupScrollIndicator('project-scroll-container', 'project-dots');
  setupScrollIndicator('maintenance-scroll-container', 'maintenance-dots');
}
