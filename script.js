/* ============================================================
   PORTFOLIO BTS SIO SISR – [Zoha]
   script.js – Interactions & comportements dynamiques
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────────
     1. THEME TOGGLE (clair / sombre)
     Mémorise le choix de l'utilisateur via localStorage
  ────────────────────────────────────────────── */
  const html     = document.documentElement;
  const themeBtn = document.getElementById('theme-btn');

  // Applique le thème sauvegardé (ou "light" par défaut)
  const savedTheme = localStorage.getItem('theme') || 'light';
  html.setAttribute('data-theme', savedTheme);

  themeBtn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });


  /* ──────────────────────────────────────────────
     2. MENU HAMBURGER (mobile)
     Ouvre / ferme le menu mobile au clic
  ────────────────────────────────────────────── */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  // Ferme le menu mobile au clic sur un lien
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });


  /* ──────────────────────────────────────────────
     3. BARRE DE PROGRESSION DE LECTURE
     Indique l'avancement du scroll dans la page
  ────────────────────────────────────────────── */
  const progressBar = document.getElementById('progress-bar');

  window.addEventListener('scroll', () => {
    const scrollTop  = window.scrollY;
    const docHeight  = document.body.scrollHeight - window.innerHeight;
    const progress   = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  }, { passive: true });


  /* ──────────────────────────────────────────────
     4. LIEN ACTIF DANS LA NAVIGATION
     Surligne automatiquement la section visible
  ────────────────────────────────────────────── */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(
          `.nav-links a[href="#${entry.target.id}"]`
        );
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(section => sectionObserver.observe(section));


  /* ──────────────────────────────────────────────
     5. ANIMATIONS FADE-IN AU DÉFILEMENT
     Chaque élément .fade-in apparaît à l'entrée dans le viewport
  ────────────────────────────────────────────── */
  const fadeEls = document.querySelectorAll('.fade-in');

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // On arrête d'observer après la première apparition
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  fadeEls.forEach(el => fadeObserver.observe(el));


  /* ──────────────────────────────────────────────
     6. BANDEAU COOKIE RGPD
     Affiche le bandeau sauf si déjà répondu
  ────────────────────────────────────────────── */
  const cookieBanner = document.getElementById('cookie-banner');

  // Si l'utilisateur a déjà fait un choix, on cache le bandeau
  if (localStorage.getItem('cookies')) {
    cookieBanner.classList.add('hidden');
  }

  window.acceptCookies = () => {
    localStorage.setItem('cookies', 'accepted');
    cookieBanner.classList.add('hidden');
  };

  window.declineCookies = () => {
    localStorage.setItem('cookies', 'declined');
    cookieBanner.classList.add('hidden');
  };


  /* ──────────────────────────────────────────────
     7. FORMULAIRE DE CONTACT
     Validation côté client + fallback mailto
     (aucun backend requis pour GitHub Pages)
  ────────────────────────────────────────────── */
  window.submitForm = () => {
    const nom     = document.getElementById('nom').value.trim();
    const email   = document.getElementById('email').value.trim();
    const sujet   = document.getElementById('sujet').value;
    const message = document.getElementById('message').value.trim();

    // Validation basique
    if (!nom || !email || !message) {
      showFormError('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    if (!isValidEmail(email)) {
      showFormError('Veuillez saisir une adresse e-mail valide.');
      return;
    }

    // Affiche le message de succès
    const successEl = document.getElementById('form-success');
    const formEl    = document.getElementById('contact-form');
    successEl.style.display = 'block';
    formEl.style.opacity        = '0.4';
    formEl.style.pointerEvents  = 'none';

    // Ouvre le client mail avec les données pré-remplies
    const subject   = sujet || 'Message – Portfolio BTS SIO SISR';
    const body      = `Nom : ${nom}\n\n${message}`;
    window.location.href =
      `mailto:votre.email@example.com` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;
  };

  /* Vérifie le format d'un e-mail */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* Affiche un message d'erreur temporaire sous le bouton */
  function showFormError(msg) {
    let errEl = document.getElementById('form-error');
    if (!errEl) {
      errEl = document.createElement('p');
      errEl.id = 'form-error';
      errEl.style.cssText =
        'color:#e53e3e;font-size:0.8rem;margin-top:0.5rem;';
      document.getElementById('contact-form').appendChild(errEl);
    }
    errEl.textContent = '⚠️ ' + msg;
    setTimeout(() => { if (errEl) errEl.textContent = ''; }, 4000);
  }

}); // end DOMContentLoaded
