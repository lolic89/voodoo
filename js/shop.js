(function () {
  const EMAIL = 'popajvudu@gmail.com';
  const STORAGE_KEY = 'vudu-korpa';

  const fab = document.querySelector('.cart-fab');
  const panel = document.getElementById('cart');
  const backdrop = document.querySelector('.cart-backdrop');
  const list = panel.querySelector('.cart-items');
  const empty = panel.querySelector('.cart-empty');
  const form = panel.querySelector('.cart-form');
  const errorEl = panel.querySelector('.form-error');
  const hint = panel.querySelector('.cart-hint');

  const rsd = (n) => n.toLocaleString('sr-RS') + ' rsd';

  const discountRate = (qty) => (qty >= 5 ? 0.15 : qty === 4 ? 0.10 : 0);

  const catalog = new Map();
  document.querySelectorAll('.product').forEach((card) => {
    catalog.set(card.dataset.code, {
      name: card.dataset.name,
      price: Number(card.dataset.price),
      optionLabel: card.dataset.optionLabel || '',
      options: card.dataset.options ? card.dataset.options.split(',').map((o) => o.trim()) : [],
    });
  });

  function sanitize(raw) {
    if (!Array.isArray(raw)) return [];
    const out = [];
    raw.forEach((i) => {
      const p = i && catalog.get(String(i.code));
      if (!p) return;
      const option = p.options.length ? String(i.option || '') : '';
      if (p.options.length && !p.options.includes(option)) return;
      const qty = Math.min(99, Math.max(1, Math.floor(Number(i.qty)) || 1));
      out.push({ code: String(i.code), name: p.name, price: p.price, option, optionLabel: p.optionLabel, qty });
    });
    return out;
  }

  let cart = [];
  try { cart = sanitize(JSON.parse(localStorage.getItem(STORAGE_KEY))); } catch (e) { cart = []; }
  const save = () => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch (e) {} };

  document.querySelectorAll('.product').forEach((card) => {
    const body = card.querySelector('.product-body');
    const actions = document.createElement('div');
    actions.className = 'product-actions';

    let select = null;
    if (card.dataset.options) {
      select = document.createElement('select');
      select.setAttribute('aria-label', `${card.dataset.optionLabel || 'Opcija'}: ${card.querySelector('h3').textContent}`);
      const ph = document.createElement('option');
      ph.value = '';
      ph.textContent = card.dataset.optionLabel || 'Izaberi';
      select.appendChild(ph);
      card.dataset.options.split(',').forEach((o) => {
        const opt = document.createElement('option');
        opt.value = o.trim();
        opt.textContent = o.trim();
        select.appendChild(opt);
      });
      actions.appendChild(select);
    }

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-red btn-sm';
    btn.textContent = 'Dodaj';
    btn.addEventListener('click', () => {
      if (select && !select.value) {
        select.classList.add('needs-choice');
        select.focus();
        return;
      }
      add({
        code: card.dataset.code,
        name: card.dataset.name,
        price: Number(card.dataset.price),
        option: select ? select.value : '',
        optionLabel: card.dataset.optionLabel || '',
      });
      btn.textContent = 'Dodato ✓';
      btn.classList.add('added');
      setTimeout(() => { btn.textContent = 'Dodaj'; btn.classList.remove('added'); }, 1200);
    });
    if (select) select.addEventListener('change', () => select.classList.remove('needs-choice'));
    actions.appendChild(btn);
    body.appendChild(actions);
  });

  function add(item) {
    const found = cart.find((i) => i.code === item.code && i.option === item.option);
    if (found) found.qty = Math.min(99, found.qty + 1);
    else cart.push({ ...item, qty: 1 });
    save();
    render();
    fab.classList.remove('bump');
    void fab.offsetWidth;
    fab.classList.add('bump');
  }

  function totals() {
    const qty = cart.reduce((s, i) => s + i.qty, 0);
    const subtotal = cart.reduce((s, i) => s + i.qty * i.price, 0);
    const rate = discountRate(qty);
    const discount = Math.round(subtotal * rate);
    return { qty, subtotal, rate, discount, total: subtotal - discount };
  }

  function render() {
    const t = totals();
    fab.hidden = t.qty === 0 && panel.hidden;
    fab.querySelector('.cart-count').textContent = t.qty;

    list.replaceChildren(...cart.map((item, idx) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <div class="ci-info">
          <span class="ci-name"></span>
          <span class="ci-meta"></span>
        </div>
        <div class="ci-qty">
          <button type="button" data-act="dec" aria-label="Manje">−</button>
          <span>${item.qty}</span>
          <button type="button" data-act="inc" aria-label="Više">+</button>
        </div>
        <span class="ci-price">${rsd(item.qty * item.price)}</span>
        <button type="button" class="ci-remove" data-act="rm" aria-label="Ukloni">&times;</button>`;
      li.querySelector('.ci-name').textContent = item.name;
      li.querySelector('.ci-meta').textContent =
        `${item.code}${item.option ? ' · ' + item.optionLabel + ': ' + item.option : ''}`;
      li.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => {
        if (b.dataset.act === 'inc') item.qty = Math.min(99, item.qty + 1);
        if (b.dataset.act === 'dec') item.qty -= 1;
        if (b.dataset.act === 'rm' || item.qty < 1) cart.splice(idx, 1);
        save();
        render();
      }));
      return li;
    }));

    empty.hidden = cart.length > 0;
    form.hidden = cart.length === 0;
    panel.querySelector('.cart-sum').hidden = cart.length === 0;
    panel.querySelector('.sum-subtotal').textContent = rsd(t.subtotal);
    panel.querySelectorAll('.sum-discount-row').forEach((el) => { el.hidden = t.rate === 0; });
    panel.querySelector('.sum-discount').textContent = `−${rsd(t.discount)} (${Math.round(t.rate * 100)}%)`;
    panel.querySelector('.sum-total').textContent = rsd(t.total);

    if (t.qty > 0 && t.qty < 4) hint.textContent = `Dodaj još ${4 - t.qty} ${4 - t.qty === 1 ? 'proizvod' : 'proizvoda'} za 10% popusta.`;
    else if (t.qty === 4) hint.textContent = 'Još jedan proizvod i popust je 15%.';
    else hint.textContent = '';
    hint.hidden = !hint.textContent;
  }

  function openCart() {
    panel.hidden = false;
    backdrop.hidden = false;
    fab.setAttribute('aria-expanded', 'true');
    document.body.classList.add('cart-open');
    panel.querySelector('.cart-close').focus();
  }
  function closeCart() {
    panel.hidden = true;
    backdrop.hidden = true;
    fab.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('cart-open');
    render();
    if (!fab.hidden) fab.focus();
  }
  fab.addEventListener('click', openCart);
  panel.querySelector('.cart-close').addEventListener('click', closeCart);
  backdrop.addEventListener('click', closeCart);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !panel.hidden) closeCart(); });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    if (!data.ime.trim() || !data.adresa.trim()) {
      errorEl.hidden = false;
      (data.ime.trim() ? form.adresa : form.ime).focus();
      return;
    }
    errorEl.hidden = true;

    const t = totals();
    const lines = cart.map((i) =>
      `- ${i.code} | ${i.name}${i.option ? ' | ' + i.optionLabel + ': ' + i.option : ''} | ${i.qty} kom × ${rsd(i.price)} = ${rsd(i.qty * i.price)}`);

    const body = [
      'Porudžbina sa sajta',
      '',
      ...lines,
      '',
      `Ukupno: ${rsd(t.subtotal)}`,
      t.rate ? `Popust ${Math.round(t.rate * 100)}%: −${rsd(t.discount)}` : null,
      `Za plaćanje: ${rsd(t.total)} + poštarina`,
      '',
      `Ime i prezime: ${data.ime.trim()}`,
      `Adresa: ${data.adresa.trim()}`,
      `Telefon: ${data.telefon.trim() || '—'}`,
      `Posveta: ${data.posveta.trim() || '—'}`,
      `Napomena: ${data.napomena.trim() || '—'}`,
    ].filter((l) => l !== null).join('\n');

    const subject = `Porudžbina — ${data.ime.trim()} (${t.qty} kom)`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });

  render();
})();
