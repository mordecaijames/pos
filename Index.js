/* Index.js - Complete Version
   Lightweight interactions:
   - mobile menu open/close
   - smooth scroll with offset
   - active nav on scroll (intersection observer)
   - reveal on scroll + animate progress bars
   - scroll progress bar
   - particle background (lightweight)
   - cookie banner functionality
*/

document.addEventListener('DOMContentLoaded', () => {
  console.log('Script.js loaded');

  // Year
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Mobile Drawer ---------- */
  const mobileBtn = document.getElementById('mobileBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');
  let mobileOpen = false;

  function openMobile() {
    if (!mobileMenu) return;
    mobileMenu.style.display = 'flex';
    mobileMenu.classList.add('open');
    mobileOpen = true;
    if (mobileBtn) mobileBtn.setAttribute('aria-expanded', 'true');
    // Prevent body scroll when menu is open
    document.body.style.overflow = 'hidden';
  }

  function closeMobile() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('open');
    mobileMenu.style.display = 'none';
    mobileOpen = false;
    if (mobileBtn) mobileBtn.setAttribute('aria-expanded', 'false');
    // Restore body scroll
    document.body.style.overflow = '';
  }

  if (mobileBtn) {
    mobileBtn.addEventListener('click', () => mobileOpen ? closeMobile() : openMobile());
  }
  if (mobileClose) {
    mobileClose.addEventListener('click', closeMobile);
  }

  // Close mobile menu when clicking on mobile links
  document.querySelectorAll('[data-link-mobile]').forEach(a => {
    a.addEventListener('click', closeMobile);
  });

  // Set initial mobile menu style state hidden
  if (mobileMenu) {
    mobileMenu.style.display = 'none';
  }

  /* ---------- Smooth scroll anchors (account for fixed nav) ---------- */
  const NAV_HEIGHT = 80;
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#' || href.startsWith('mailto:')) return;
      
      const target = document.querySelector(href);
      if (!target) return;
      
      e.preventDefault();
      const rect = target.getBoundingClientRect();
      const top = window.scrollY + rect.top - NAV_HEIGHT + 8;
      window.scrollTo({ top, behavior: 'smooth' });
      
      // Close mobile menu if open
      if (mobileOpen) closeMobile();
    });
  });

  /* ---------- Active nav on scroll ---------- */
  const sections = [...document.querySelectorAll('section[id]')];
  const navLinks = [...document.querySelectorAll('.nav-link')];

  function setActive(id) {
    navLinks.forEach(a => {
      const href = a.getAttribute('href');
      if (!href) return;
      const sectionId = href.replace('#', '');
      if (sectionId === id) {
        a.classList.add('nav-link-active');
      } else {
        a.classList.remove('nav-link-active');
      }
    });
  }

  if (sections.length) {
    const so = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    }, { threshold: 0.45, rootMargin: '-80px 0px -50% 0px' });
    
    sections.forEach(s => so.observe(s));
  }

      /* ---------- Hero stats counter animation ---------- */
  const statNumbers = document.querySelectorAll('.stat-number');

  const animateStat = (el) => {
    const raw = el.textContent;
    const target = parseInt(raw.replace(/\D/g, ''), 10);
    const suffix = raw.replace(/[0-9]/g, '');
    let current = 0;

    const speed = 200;
    const increment = Math.max(1, Math.floor(target / speed));

    const update = () => {
      current += increment;
      if (current >= target) {
        el.textContent = target + suffix;
      } else {
        el.textContent = current + suffix;
        requestAnimationFrame(update);
      }
    };

    update();
  };

  if (statNumbers.length) {
    const statsObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateStat(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    statNumbers.forEach(stat => statsObserver.observe(stat));
  }


  /* ---------- Reveal on scroll + skill bars ---------- */
  const reveals = [...document.querySelectorAll('.reveal')];
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        
        // Animate progress bars within
        entry.target.querySelectorAll('[data-progress]').forEach(bar => {
          const pct = parseInt(bar.getAttribute('data-progress'), 10) || 0;
          
          // Set ARIA attributes for accessibility
          if (!bar.hasAttribute('role')) bar.setAttribute('role', 'progressbar');
          if (!bar.hasAttribute('aria-valuemin')) bar.setAttribute('aria-valuemin', '0');
          if (!bar.hasAttribute('aria-valuemax')) bar.setAttribute('aria-valuemax', '100');
          bar.setAttribute('aria-valuenow', '0');
          
          // Animate the bar
          setTimeout(() => {
            bar.style.width = pct + '%';
            bar.setAttribute('aria-valuenow', String(pct));
          }, 120);
        });
        
        // Unobserve after revealing (performance optimization)
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  
  reveals.forEach(r => revealObs.observe(r));

  /* ---------- Scroll progress ---------- */
  const progress = document.getElementById('scrollProgress');
  
  function updateProgress() {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docH > 0 ? (window.scrollY / docH) * 100 : 0;
    if (progress) progress.style.width = pct + '%';
  }
  
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* ---------- Particle background (lightweight) ---------- */
  (function particles() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    const particles = [];
    const count = Math.max(18, Math.floor((w * h) / 110000));
    
    function rand(min, max) {
      return Math.random() * (max - min) + min;
    }
    
    // Initialize particles
    for (let i = 0; i < count; i++) {
      particles.push({
        x: rand(0, w),
        y: rand(0, h),
        r: rand(0.6, 2.2),
        vx: rand(-0.12, 0.12),
        vy: rand(-0.02, 0.02)
      });
    }
    
    // Handle resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
      }, 150);
    });
    
    function draw() {
      ctx.clearRect(0, 0, w, h);
      
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        
        // Wrap particles around edges
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;
        
        // Draw particle
        ctx.beginPath();
        ctx.fillStyle = `rgba(0, 201, 255, ${0.06 + (p.r / 6)})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      
      requestAnimationFrame(draw);
    }
    
    requestAnimationFrame(draw);
  })();

  /* ---------- Accessibility: escape closes mobile ---------- */
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileOpen) {
      closeMobile();
    }
  });

  /* ---------- Light polish: reduce motion respect ---------- */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    document.querySelectorAll('.progress-bar').forEach(b => {
      b.style.transition = 'none';
    });
    
    // Also disable reveal animations
    document.querySelectorAll('.reveal').forEach(r => {
      r.style.transition = 'none';
      r.classList.add('in-view');
    });
  }

  /* ---------- Contact form (mailto fallback) ---------- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const contactMsg = document.getElementById('contactMsg');
    
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      console.log('Contact form submitted');
      
      const form = contactForm;
      const btn = form.querySelector('button[type="submit"]');
      const nameInput = form.querySelector('input[name="name"]');
      const emailInput = form.querySelector('input[name="email"]');
      const messageInput = form.querySelector('textarea[name="message"]');
      
      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';
      
      // Helper to show messages
      function showMessage(msg, isError = false) {
        if (contactMsg) {
          contactMsg.hidden = false;
          contactMsg.textContent = msg;
          contactMsg.style.color = isError ? '#ff6b6b' : 'var(--muted)';
        }
      }
      
      // Validate
      if (!name || !email || !message) {
        showMessage('Please complete all fields.', true);
        return;
      }
      
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showMessage('Please enter a valid email address.', true);
        return;
      }
      
      // Disable button while processing
      if (btn) {
        btn.disabled = true;
        btn.dataset.originalText = btn.textContent;
        btn.textContent = 'Sending…';
      }
      
      // Optional backend endpoint: set data-endpoint on the form or window.CONTACT_ENDPOINT
      const endpoint = form.dataset.endpoint || window.CONTACT_ENDPOINT || null;
      
      if (endpoint) {
        // Try to POST to configured endpoint
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000);
          
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, message }),
            signal: controller.signal,
          });
          
          clearTimeout(timeoutId);
          
          if (res.ok) {
            showMessage('Message sent — thank you!');
            form.reset();
          } else {
            throw new Error('Server error');
          }
        } catch (err) {
          console.error('Contact form error:', err);
          showMessage('Could not send to server. Opening email client as fallback.', true);
          
          // Fallback to mailto
          const to = form.dataset.to || window.CONTACT_TO || 'mordecaijames78@gmail.com';
          const subject = `Portfolio inquiry from ${name}`;
          const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
          window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        }
      } else {
        // No endpoint configured — open user's email client
        const to = form.dataset.to || window.CONTACT_TO || 'mordecaijames78@gmail.com';
        const subject = `Portfolio inquiry from ${name}`;
        const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
        window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        showMessage('Opening your email client…');
        form.reset();
      }
      
      // Re-enable button
      if (btn) {
        btn.disabled = false;
        btn.textContent = btn.dataset.originalText || 'Send Message';
      }
    });
  }
  
  /* ---------- Debug info ---------- */
  console.log('✓ Script initialization complete');
  console.log('✓ Mobile menu:', mobileMenu ? 'found' : 'not found');
  console.log('✓ Contact form:', contactForm ? 'found' : 'not found');
  console.log('✓ Sections to observe:', sections.length);
  console.log('✓ Reveal elements:', reveals.length);
});

/* ---------- Cookie Banner ---------- */
(function initCookieBanner() {
  const banner = document.getElementById('cookieBanner');
  const acceptBtn = document.getElementById('cookieAccept');
  const declineBtn = document.getElementById('cookieDecline');
  const settingsBtn = document.getElementById('cookieSettings');
  
  const COOKIE_NAME = 'cookie_consent';
  const COOKIE_EXPIRY_DAYS = 365;
  
  function getCookieConsent() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === COOKIE_NAME) return value;
    }
    return null;
  }
  
  function setCookieConsent(value) {
    const date = new Date();
    date.setTime(date.getTime() + (COOKIE_EXPIRY_DAYS * 24 * 60 * 60 * 1000));
    document.cookie = `${COOKIE_NAME}=${value};expires=${date.toUTCString()};path=/;SameSite=Lax`;
  }
  
  function showBanner() {
    if (banner) setTimeout(() => banner.classList.add('show'), 1000);
  }
  
  function hideBanner() {
    if (banner) banner.classList.remove('show');
  }
  
  function handleAccept() {
    setCookieConsent('accepted');
    hideBanner();
    console.log('Cookies accepted');
    // Add analytics initialization here
    // Example: if (typeof gtag !== 'undefined') { gtag('consent', 'update', {'analytics_storage': 'granted'}); }
  }
  
  function handleDecline() {
    setCookieConsent('declined');
    hideBanner();
    console.log('Cookies declined');
    // Add analytics disabling here
    // Example: if (typeof gtag !== 'undefined') { gtag('consent', 'update', {'analytics_storage': 'denied'}); }
  }
  
  function handleSettings() {
    alert('Cookie settings: You can manage your preferences in our Privacy Policy. For now, please choose Accept All or Decline.');
    // Optional: window.location.href = 'privacy.html#cookie-policy';
  }
  
  if (acceptBtn) acceptBtn.addEventListener('click', handleAccept);
  if (declineBtn) declineBtn.addEventListener('click', handleDecline);
  if (settingsBtn) settingsBtn.addEventListener('click', handleSettings);
  
  const consent = getCookieConsent();
  if (consent) hideBanner();
  else showBanner();
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && banner?.classList.contains('show')) {
      handleDecline();
    }
  });
})();

// Optional: Function to reset cookie consent for testing
function resetCookieConsent() {
  document.cookie = 'cookie_consent=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
  location.reload();
}

// Make resetCookieConsent available globally for testing
window.resetCookieConsent = resetCookieConsent;