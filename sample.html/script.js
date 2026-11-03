// =========================================================================
// MINDSPRINT 2026 // Standalone Static Script
// Fully static vanilla JavaScript — Zero dependencies required!
// =========================================================================

const CONFIG = {
  // ISO-8601 target with explicit timezone (+05:30 for IST)
  countdownTarget: "2026-11-21T12:00:00+05:30",
  // External registration form URL (Leave empty or invalid for "Form Coming Soon" state)
  externalFormUrl: "https://docs.google.com/forms/d/e/1FAIpQLSdN_MeGNvwIP1YalFU40NintyNulda4U_0-SYss5fFIz49gew/viewform",
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

// --- 5. Hamburger Menu (all screen sizes) ---
function setupMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!toggleBtn || !mobileMenu || toggleBtn.dataset.ready) return;
  toggleBtn.dataset.ready = 'true';

  const ICON_MENU =
    '<svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">' +
    '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>';
  const ICON_CLOSE =
    '<svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">' +
    '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 6l12 12M18 6L6 18"/></svg>';

  // Rebuild the menu from the nav links so it always lists every section
  const cta = mobileMenu.querySelector('[data-form-cta]');
  mobileMenu.querySelectorAll('a:not([data-form-cta])').forEach((a) => a.remove());
  document.querySelectorAll('.nav-links a').forEach((link) => {
    const a = document.createElement('a');
    a.href = link.getAttribute('href');
    a.textContent = link.textContent;
    mobileMenu.insertBefore(a, cta);
  });

  function setOpen(open) {
    mobileMenu.classList.toggle('open', open);
    toggleBtn.setAttribute('aria-expanded', String(open));
    toggleBtn.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    toggleBtn.innerHTML = open ? ICON_CLOSE : ICON_MENU;
  }

  toggleBtn.addEventListener('click', () => {
    setOpen(!mobileMenu.classList.contains('open'));
  });

  // Close when a menu link is clicked
  mobileMenu.addEventListener('click', (e) => {
    if (e.target.closest('a')) setOpen(false);
  });

  // Close when clicking outside the menu
  document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !toggleBtn.contains(e.target)) setOpen(false);
  });

  // Close with the Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
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

// --- 7. Overall Timeline Dropdown (ONE dropdown for the whole timeline) ---
function setupTimelineSection() {
  const timeline = document.querySelector('#schedule .timeline');
  // Skip if the timeline is missing or already wrapped (prevents duplicates)
  if (!timeline || timeline.closest('.timeline-section')) return;

  const wrap = document.createElement('div');
  wrap.className = 'timeline-section';

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'timeline-section-toggle';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', 'timelineSectionBody');
  toggle.innerHTML =
    '<span class="timeline-section-label">Timeline</span>' +
    '<span class="timeline-section-chevron" aria-hidden="true">' +
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>' +
    '</span>';

  const body = document.createElement('div');
  body.className = 'timeline-section-body';
  body.id = 'timelineSectionBody';

  const inner = document.createElement('div');
  inner.className = 'timeline-section-inner';

  // Put the existing timeline inside the collapsible body
  timeline.parentNode.insertBefore(wrap, timeline);
  inner.appendChild(timeline);
  body.appendChild(inner);
  wrap.append(toggle, body);

  toggle.addEventListener('click', () => {
    const isOpen = wrap.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
}

// Initialize on DOM Ready (only ONE init block in the whole file)
document.addEventListener('DOMContentLoaded', () => {
  setupExternalLinks();
  setupCountdown();
  setupScrollEffects();
  setupFAQ();
  setupMobileMenu();
  setupTeamMarquee();
  setupTimelineSection();
});