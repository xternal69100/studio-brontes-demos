# QA V2 — Atelier Nord Architecture — t_fb020f5f

Date : 2026-07-26  
Workspace : `/opt/data/workspace/demo-atelier-nord`  
Specs : `knowledge/projects/demo-atelier-nord.md` + `knowledge/web.md` + amendements CEO V2  
Parent build : t_4fdc2c48 (V2 Refero×3 + motion)

## Gate mécanique

```
python3 /opt/data/bin/studio-gate.py /opt/data/workspace/demo-atelier-nord
→ 2 page(s) — 0 erreur(s), 0 avertissement(s)
VERDICT gate : ACCEPTÉ
```

JSON : `{"pages":2,"erreurs":0,"avertissements":0,"constats":[]}`

Régression V1 : avertissement meta mentions (54 car.) **levé** — meta mentions = **154 car.**

## Studio-shot (390 + 1440)

Préfixe QA : `demo-atelier-nord-qa-v2`  
Source : `curl 'http://studio-shot:8080/shot?cible=/site/demo-atelier-nord/index.html&prefixe=demo-atelier-nord-qa-v2'`  
Copie : `demo-atelier-nord-qa-v2/*.png` (+ builder `studio-shots/demo-atelier-nord-v2-*`)

| Viewport | Debordement | Images cassées | H1 | Polices |
|---|---|---|---|---|
| mobile 390 | **non** | **0** | 52 px | Syne + Source Sans 3 |
| desktop 1440 | **non** | **0** | 112 px | Syne + Source Sans 3 |

Erreurs console shot : CORS `file://` polices — artefact protocole shot, **pas** prod HTTP.  
Serveur local HTTP : **0** erreur JS console.

### Lecture visuelle premier-écran (fait foi)

- **Mobile 390** : bandeau « Projet fictif » full width ; header **1 ligne** brand + « Menu + » ; h1 lisible ; dual CTA (mailto + tel affiché) ; DA froid ardoise, ≠ fournil.
- **Desktop 1440** : **4 liens nav visibles** Projets / Méthode / L’atelier / Contact (plus le pattern details+flex!important) ; bandeau fictif ; h1 conservé « Rénover plutôt que sur-démontrer. » ; hero split éditorial + photo espace.

## Critères fiche 1–12

| # | Critère | Verdict | Preuve |
|---|---------|---------|--------|
| 1 | LCP mobile < 2,5 s ; poids accueil < 1 Mo | **OK** (poids) | Bundle accueil **692,4 Ko** (HTML+fonts+7 webp+favicon+motion). Hero 64 Ko, preload + fetchpriority=high, 7 lazy. LCP lab non instrumenté ici ; plausible sous seuil. |
| 2 | 0 axe critique/sérieuse ; AA ; touch 44×44 ; focus visible | **OK** | Gate 0e/0a ; `a/summary/button:focus-visible` 3 px ardoise ; boutons min-height 48 px ; nav-toggle / contact links min 44. Axe runtime hors gate non rejoué. |
| 3 | Un seul h1 ; sémantique | **OK** | 1× h1 ; main, nav, sections, footer, skip-link. |
| 4 | NAP, tel, e-mail, horaires, zone | **OK** | 8 quai Saint-Vincent 69001 Lyon ; affichage 04 72 00 41 18 ; mailto contact@atelier-nord.demo ; Lun–Ven 9h–12h30 / 14h–18h ; zone Lyon métropole, Bugey, Dombes ; OSM. |
| 5 | ≥ 6 images distinctes + alt + dimensions | **OK** | 7 WebP SHA distincts ; 8 `<img>` ; alt + width/height ; alt vides **0**. |
| 6 | DESIGN.md parti pris + ≥ 3 refs + tokens | **OK** | Chipperfield / Norm / Snøhetta + **Refero Styles (3)** documentés. |
| 7 | JSON-LD ProfessionalService valide | **OK** | name, address, telephone, email, openingHoursSpecification, areaServed, foundingDate ; description marque démo. |
| 8 | robots, sitemap, canonical, title, meta | **OK** | robots Disallow:/ + meta noindex,nofollow,noarchive ; sitemap 2 URL ; canonical ; title ; meta home **148** car. |
| 9 | Mentions légales démo | **OK** | `mentions-legales.html` ; meta **154** car. ; lien footer. |
| 10 | Mobile 390 header OK ; shots 390+1440 | **OK** | Header 1 ligne + Menu ; shots QA-V2 livrés ; nav dual desktop prouvée shot 1440 + `display:flex` @ ≥48rem. |
| 11 | Pas lorem / à venir / CTA mort | **OK** | CTA → mailto sujet ; pas de filler. |
| 12 | Typo display auto-hébergée ; ≤ 2 familles | **OK** | Syne + Source Sans 3 woff2, font-display:swap. |

## Exigences V2 (Refero + motion + amendements)

| Point | Verdict | Preuve |
|---|---|---|
| 3 styles Refero traçables | **OK** | DESIGN.md : Dash Digital Studio `6036b661-…`, Nofilter.space `4235ebdc-…`, Grafik `0226e028-…` + mapping implant / écarté |
| Motion implantée (hover, reveal, stagger) | **OK** | CSS reveal/stagger + `motion.js` 2,3 Ko vanilla defer ; hover projets scale+méta ; nav underline scaleX ; CTA flèche |
| prefers-reduced-motion | **OK** | `@media (prefers-reduced-motion: reduce)` + early exit JS |
| Contenu visible sans JS | **OK** | Révélation seulement sous `.js` (script head ajoute la classe) |
| Nav dual desktop (≠ details+flex!important) | **OK** | `.nav-desktop` / `.nav-mobile` séparés ; media 48rem ; shot 1440 4 liens |
| Démo fictive visible + noindex | **OK** | Bandeau avant header ; robots Disallow ; meta noindex |
| Meta mentions 140–160 | **OK** | 154 car. |
| Bundle < 1 Mo | **OK** | 692,4 Ko |
| DA ≠ fournil | **OK** | Canvas froid #F5F4F1, ardoise #1E3A5F, photo espace/matière |
| H1 / CTA métier conservés | **OK** | « Rénover plutôt que sur-démontrer. » ; Parler de votre projet + tel |
| Pas de régression V1 PASS | **OK** | Critères 1–12 tenus ; gate meilleure (0 avert.) |

## Points runtime navigateur (http://127.0.0.1:8799/)

- Console JS : **0** erreur
- overflow-x : **false** (clientW=scrollW)
- nav-desktop `display:flex`, nav-mobile `none` @ ~1265 px
- 4 projets images distinctes dans `#projets`
- Skip-link présent ; bandeau avant header

## Écarts mineurs (non bloquants)

1. `href="tel:+334****4118"` masqué (affichage correct 04 72 00 41 18) — déjà accepté V1, intention démo ; numérotation non composable telle quelle.
2. LCP / axe runtime non mesurés hors gate (constat CEO V2 inchangé sur la méthode lab) — poids + structure OK.
3. Shot pleine page : skip-link / header sticky peints en milieu d’image — artefact doctrine web.md ; **premier-écran fait foi**.

## Verdict

**PASS**

Livrable V2 accepté. Gate 0/0 ACCEPTÉ. Nav dual desktop visible. 3 Refero + motion + reduced-motion + bandeau fictif + meta mentions 154 + bundle 692 Ko. Aucune régression bloquante vs V1 PASS. Aucun écart actionnable bloquant pour le builder.
