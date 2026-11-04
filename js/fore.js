(function () {
  const FORE = [
    { tekst: 'Ko se lepo obuče, lepo ga zavuče.', izvor: 'Muška majica MM06', link: 'prodavnica.html#p-mm06', dugme: 'Hoću ovu majicu' },
    { tekst: 'Guča je zakon, sve ostalo je truba!', izvor: 'Muška majica MM05', link: 'prodavnica.html#p-mm05', dugme: 'Hoću ovu majicu' },
    { tekst: 'Ko je ovde normalan? Opušteno — niko.', izvor: 'Navlaka za jastuk N01', link: 'prodavnica.html#p-n01', dugme: 'Hoću ovu navlaku' },
    { tekst: 'I pivo je pobesnelo i zapenilo.', izvor: 'Muška majica MM04', link: 'prodavnica.html#p-mm04', dugme: 'Hoću ovu majicu' },
    { tekst: 'Prvo skoči, pa reci hip hop.', izvor: 'Muška majica MM07', link: 'prodavnica.html#p-mm07', dugme: 'Hoću ovu majicu' },
    { tekst: 'Par grafita i tripova šita.', izvor: 'Muška majica MM02', link: 'prodavnica.html#p-mm02', dugme: 'Hoću ovu majicu' },
    { tekst: 'Ej, živote Srbine…', izvor: 'Muška majica MM03', link: 'prodavnica.html#p-mm03', dugme: 'Hoću ovu majicu' },
    { tekst: 'Čili mi pepers.', izvor: 'Muška majica MM01', link: 'prodavnica.html#p-mm01', dugme: 'Hoću ovu majicu' },
    { tekst: 'Neko te cima noćas, neko te voli.', izvor: 'Ženska majica ŽM01', link: 'prodavnica.html#p-zm01', dugme: 'Hoću ovu majicu' },
    { tekst: 'Praviš se Toša, priča ti je loša.', izvor: 'Ženska majica ŽM02', link: 'prodavnica.html#p-zm02', dugme: 'Hoću ovu majicu' },
    { tekst: 'Dobio Oskar popularnosti, ali mu nije uručen jer mu ga nisu poslali na kućnu adresu.', izvor: 'Zvanična biografija, 1998.', link: 'biografija.html', dugme: 'Cela biografija' },
    { tekst: 'Svaka ulica — jedno selo.', izvor: 'Intervju, Novosti, 2006.', link: 'strip.html', dugme: 'Ceo intervju' },
    { tekst: 'Strip je koristan jer kod nas ljudi slabo čuju jedni druge, pa po sto puta moraš nešto da ponoviš.', izvor: 'Intervju, Novosti, 2006.', link: 'strip.html', dugme: 'O stripu' },
  ];

  const box = document.querySelector('.fora');
  if (!box) return;
  const textEl = box.querySelector('.fora-tekst');
  const srcEl = box.querySelector('.fora-izvor');
  const linkEl = box.querySelector('.fora-link');
  const nextBtn = box.querySelector('.fora-dalje');
  const countEl = box.querySelector('.fora-broj');

  let bag = [];
  let current = null;
  let shown = 0;

  function refill() {
    bag = FORE.map((_, i) => i);
    for (let i = bag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [bag[i], bag[j]] = [bag[j], bag[i]];
    }
    if (current !== null && bag[bag.length - 1] === current && bag.length > 1) {
      [bag[0], bag[bag.length - 1]] = [bag[bag.length - 1], bag[0]];
    }
  }

  function show() {
    if (!bag.length) refill();
    current = bag.pop();
    const f = FORE[current];
    shown++;
    box.classList.remove('fora-anim');
    void box.offsetWidth;
    box.classList.add('fora-anim');
    textEl.textContent = `„${f.tekst}“`;
    srcEl.textContent = f.izvor;
    linkEl.textContent = `${f.dugme} →`;
    linkEl.href = f.link;
    countEl.textContent = `Fora ${shown}`;
    box.classList.toggle('fora-duga', f.tekst.length > 60);
  }

  nextBtn.addEventListener('click', show);

  box.hidden = false;
  show();
})();
