# Vudu Popaj — sajt

Čist HTML, CSS i JavaScript. Nema build alata — svaki `.html` fajl se otvara direktno u browseru.

## Gde je šta

| Putanja | Šta je |
|---|---|
| `*.html` | Strane sajta (početna, muzika, biografija, knjige, strip, film, vesti, prodavnica, nastupi, 404) |
| `_delovi/header.html` | Meni — **menja se samo ovde** |
| `_delovi/footer.html` | Footer — **menja se samo ovde** |
| `css/style.css` | Svi stilovi |
| `js/main.js` | Meni na mobilnom, video na klik, formular za upit |
| `js/shop.js` | Korpa u prodavnici |
| `assets/img/` | Slike |
| `assets/og-image.jpg` | Slika koja se vidi kad se link podeli na mrežama |
| `content/` | Tekst izvučen sa starog Wix sajta (arhiva) |

## Izmena menija ili footera

1. Izmeni `_delovi/header.html` ili `_delovi/footer.html`.
2. Dupli klik na **`osvezi.bat`** — meni i footer se ubace u sve strane, aktivna stavka se označi sama.

Ne menjaj meni direktno u stranama: sve između oznaka `<!-- HEADER:START -->` i `<!-- HEADER:END -->` se pregazi pri sledećem osvežavanju.

**Nova strana:** kopiraj postojeću, a ako dodaješ stavku u meni — dodaj je u `_delovi/header.html` i pokreni `osvezi.bat`.

## Česte izmene

- **Nova vest** (`vesti.html`): kopiraj jedan `<article class="post">` blok. Uputstvo je u komentaru iznad liste.
- **Novi proizvod** (`prodavnica.html`): kopiraj jedan `<article class="product">` blok i promeni `data-code`, `data-name`, `data-price`. Za veličine dodaj `data-options="S,M,L,XL"` i `data-option-label="Veličina"`. Korpa ga sama prepozna.
- **Promena cene:** i u `data-price` (to računa korpa) i u vidljivom tekstu `<p class="price">`.

## Pre objave

- Sajt je na **https://lolic89.github.io/voodoo/** (GitHub Pages). Svaka strana ima `og:url`, `og:image` i `canonical` sa tom adresom. Kad se poveže domen, zameni `https://lolic89.github.io/voodoo/` novom adresom u svim `.html` fajlovima.
- Objavljivanje: `git add -A`, `git commit -m "..."`, `git push` — sajt se osveži za minut-dva.
- `404.html` hosting (Netlify, Cloudflare Pages, GitHub Pages) prepoznaje sam i prikazuje je za svaku nepostojeću adresu. Radi i lokalno i na serveru — mali skript u `<head>` podešava putanje samo kad je sajt na serveru.
- Formulari (korpa i upit za nastup) otvaraju mejl program kupca sa gotovom porukom za popajvudu@gmail.com.
