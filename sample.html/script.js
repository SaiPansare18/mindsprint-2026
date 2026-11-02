// =========================================================================
// MINDSPRINT 2026 // Standalone Static Script
// Fully static vanilla JavaScript — Zero dependencies required!
// =========================================================================

const CONFIG = {
  // ISO-8601 target with explicit timezone (+05:30 for IST)
  countdownTarget: "2026-11-21T12:00:00+05:30",
  // External registration form URL (Leave empty or invalid for "Form Coming Soon" state)
  externalFormUrl: "",
};

// --- 1. Centralized External Form URL Handler ---
function setupExternalLinks() {
  const formButtons = document.querySelectorAll('[data-form-cta]');

  const isValidUrl = (url) => {
    if (!url || typeof url !== 'string' || url.trim() === '') return false;
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const isConfigured = isValidUrl(CONFIG.externalFormUrl);

  formButtons.forEach((btn) => {
    if (isConfigured) {
      btn.href = CONFIG.externalFormUrl;
      btn.target = "_blank";
      btn.rel = "noopener noreferrer";
      btn.classList.remove('btn-disabled');
    } else {
      btn.removeAttribute('href');
      btn.classList.add('btn-disabled');
      btn.setAttribute('aria-disabled', 'true');
      btn.textContent = "Form Coming Soon";
      btn.style.pointerEvents = "none";
    }
  });
}

// --- 2. Robust Timezone-Aware Countdown Timer ---
function setupCountdown() {
  const daysEl = document.getElementById('countDays');
  const hoursEl = document.getElementById('countHours');
  const minutesEl = document.getElementById('countMinutes');
  const secondsEl = document.getElementById('countSeconds');
  const statusEl = document.getElementById('countdownStatusText');
  const gridEl = document.getElementById('countdownGrid');

  if (!CONFIG.countdownTarget || CONFIG.countdownTarget.trim() === '' || CONFIG.countdownTarget.trim() === 'TBA') {
    if (statusEl) statusEl.textContent = "TBA";
    if (gridEl) gridEl.style.display = 'none';
    return;
  }

  const targetTime = Date.parse(CONFIG.countdownTarget);

  if (Number.isNaN(targetTime)) {
    if (statusEl) statusEl.textContent = "Countdown unavailable";
    if (gridEl) gridEl.style.display = 'none';
    return;
  }

  function update() {
    const now = Date.now();
    const diff = targetTime - now;

    if (diff <= 0) {
      if (statusEl) statusEl.textContent = "Event has begun";
      if (gridEl) gridEl.style.display = 'none';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

// --- 3. Scroll Progress & Sticky Navbar ---
function setupScrollEffects() {
  const navbar = document.getElementById('navbar');
  const progressBar = document.getElementById('scrollProgress');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    if (navbar) {
      if (scrollTop > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  }, { passive: true });
}

// --- 4. Accessible FAQ Accordion ---
function setupFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const btn = item.querySelector('.faq-btn');
    const content = item.querySelector('.faq-content');

    if (!btn || !content) return;

    btn.addEventListener('click', () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';

      // Close all other items
      faqItems.forEach((other) => {
        const otherBtn = other.querySelector('.faq-btn');
        if (otherBtn && other !== item) {
          otherBtn.setAttribute('aria-expanded', 'false');
          other.classList.remove('active');
        }
      });

      // Toggle current
      btn.setAttribute('aria-expanded', String(!isExpanded));
      if (!isExpanded) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  });
}

// --- 5. Mobile Menu Toggle ---
function setupMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  if (!toggleBtn || !mobileMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('open');
    if (isOpen) {
      mobileMenu.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    } else {
      mobileMenu.classList.add('open');
      toggleBtn.setAttribute('aria-expanded', 'true');
    }
  });

  const links = mobileMenu.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

// --- 6. Core Members Marquee (clones the track for a seamless loop) ---
function setupTeamMarquee() {
  document.querySelectorAll('[data-marquee]').forEach((marquee) => {
    const track = marquee.querySelector('.marquee-track');
    if (!track) return;

    const clone = track.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.querySelectorAll('img').forEach((img) => (img.alt = ''));
    marquee.appendChild(clone);
  });
}


// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  setupExternalLinks();
  setupCountdown();
  setupScrollEffects();
  setupFAQ();
  setupMobileMenu();
  setupTeamMarquee();   // <-- add this

});