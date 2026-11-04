// Mobilni meni
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('main-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
}

// Video (YouTube ili Facebook): učitaj iframe tek na klik (brže učitavanje strane)
document.querySelectorAll('.yt').forEach((el) => {
  el.addEventListener('click', () => {
    const iframe = document.createElement('iframe');
    if (el.dataset.fb) {
      const href = encodeURIComponent(`https://www.facebook.com/video.php?v=${el.dataset.fb}`);
      iframe.src = `https://www.facebook.com/plugins/video.php?href=${href}&show_text=false&autoplay=true`;
    } else {
      iframe.src = `https://www.youtube-nocookie.com/embed/${el.dataset.id}?autoplay=1&rel=0`;
    }
    iframe.title = el.dataset.title || 'YouTube video';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    el.replaceChildren(iframe);
  }, { once: true });
});

// Biografija: prekidač SR / EN
const langButtons = document.querySelectorAll('.lang-switch button');
if (langButtons.length) {
  const titles = { sr: 'Hronologija', en: 'Timeline' };
  const tlTitle = document.getElementById('tl-title');
  langButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      langButtons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      document.querySelectorAll('[data-lang-block]').forEach((el) => {
        el.hidden = el.dataset.langBlock !== lang;
      });
      if (tlTitle) tlTitle.textContent = titles[lang];
    });
  });
}

// Formular koji sastavlja mejl (zakazivanje / kontakt) — bez servera
document.querySelectorAll('form[data-mailto]').forEach((form) => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const err = form.querySelector('.form-error');
    const missing = [...form.querySelectorAll('[required]')].find((f) => !f.value.trim());
    if (missing) {
      if (err) err.hidden = false;
      missing.focus();
      return;
    }
    if (err) err.hidden = true;

    const fd = new FormData(form);
    const lines = [];
    for (const key of new Set(fd.keys())) {
      const val = fd.getAll(key).map((v) => String(v).trim()).filter(Boolean).join(', ');
      if (key !== 'Poruka') lines.push(`${key}: ${val || '—'}`);
    }
    lines.push('', fd.get('Poruka').trim());

    const subject = `${fd.get('Povod') || 'Upit'} — ${fd.get('Ime').trim()}`;
    window.location.href = `mailto:${form.dataset.mailto}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
  });
});

// Godina u footeru
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();
