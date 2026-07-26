# Michel — CEO REVIEW goût (2026-07-26)

Contexte : opérateur Telegram note **1/10**, Refero-only, motion graphique V1 obligatoire. Doctrine déjà à jour (`refero-styles.md`).

Preuves regardées :
- Live Séléné : https://xternal69100.github.io/studio-brontes-demos/demo-pavillon-selene/
- Code local : `/opt/data/workspace/demo-pavillon-selene/` (index + `js/motion.js` + DESIGN.md + images)
- Live bistrot (premier écran) + index GH demos
- Doctrine : `refero-styles.md` (fade universel = FAIL)

---

## 1. Notes /10 (honnêtes)

### Pavillon Séléné (live) — **2,5 / 10 goût** (structure ~4 / 10)

| Axe | Note | Verdict cash |
|---|---|---|
| Attraction / désir | 1,5 | On ne reste pas. Brochure institutionnelle froide, zéro spectacle. |
| Photographie / matière | 2 | Hero ~41 Ko qui **lit comme un mur gris vide** ; 2/4 œuvres quasi-blanches (Chambre d’écho, Inventaire) = trous dans la grille. Portrait OK. Voile 4 / Seuil OK mais seuls. |
| Typo / composition | 5 | Instrument Serif + filets + split hero : correct, catalogue musée basique. Pas moche structurellement. |
| Motion graphique | **1** | Exactement le pattern **interdit** par la doctrine post-note : `opacity + translateY` 250–350 ms + scale hover 1.03 + underline nav. C’est du *micro-polish a11y*, **pas** de la motion Refero. |
| Ambition galerie / Awwwards-lite | 2 | Aucune signature. Aucun clip/mask/wipe/stagger de titre. Aucune chorégraphie d’image. Silence mal choisi = pauvreté, pas luxe. |

**Écart vs opérateur 1/10 :** je suis à **2,5**, pas à 1. L’opérateur a raison sur le fond (pas attractif, zéro motion graphique). J’ajoute 1–1,5 point pour la discipline éditoriale (typo, fiction banner, dual nav, perf/a11y) qui n’est **pas** du goût. **Sur le goût pur, 1–2/10 : d’accord.**

### Autres démos (une ligne chacune)

| Démo | Note goût | Ligne |
|---|---|---|
| **Bistrot Sauge** | **3,5 / 10** | Hero photo chaude réelle → meilleur premier punch que Séléné ; ensuite page **trop aérée / vide** (grands blancs morts), motion = même famille fade/reveal. Moins raté que Séléné, toujours pas “travaillé V1”. |
| **Atelier Nord** | **3 / 10** | Éditorial nordique propre, Refero×3 documenté, motion toujours reveal+stagger générique. Cabinet “correct LinkedIn”, pas studio qui claque. |
| **Fournil v3** | **3 / 10** | Mieux photographié (catalogue pain), doctrine métier OK. Toujours site vitrine honnête, pas galerie motion. |
| **Fournil v1/v2** | 1–2 | Historique utile en archive ; hors barre. |

**Moyenne studio actuelle ~2,5–3/10 goût.** QA gate 0/0 peut passer pendant que le goût est à 1 : **le gate ne mesure pas l’ambition visuelle**. C’est le trou systémique.

---

## 2. Accord avec 1/10 opérateur ?

**Oui sur l’essentiel.** Écart : +1 à +1,5 si on note “exécution technique / propreté”, **0 écart** si on note “est-ce que je montrerais ça à un client / un pair DA comme vitrine Studio”.  
Cause racine unique : **on a optimisé conformité (a11y, perf, fiction, tokens) et on a livré le minimum motion pour cocher une case.** Refero cité dans DESIGN.md ≠ site qui **bouge** comme Refero. Doctrine le dit déjà : *listing sans effet = mensonge de livrable*.

---

## 3. Ce qui manque pour goût galerie / Awwwards-lite dès V1

Pas une liste de souhaits. Les manques qui tuent le 1er scroll :

1. **Hero signature (5 s)** — aujourd’hui : titre qui fade de 14 px. Il faut un moment : wipe/mask image, stagger lignes du display, clip-path ou reveal directionnel, éventuellement monogram/number qui s’écrit. Sans ça = template.
2. **Images qui portent** — hero et œuvres **lisible contraste** ; aucune case grise “presque vide”. Budget image Séléné total ~400 Ko : on a compressé la matière jusqu’à l’effacement. Mauvais trade-off.
3. **Chorégraphie scroll non-uniforme** — chaque section un geste distinct (pas le même `rise` partout). Grille œuvres : cascade + overlay méta + scale, pas 4 fades identiques.
4. **Hover système multi-propriétés** — image + légende + filet + cursor/state, pas scale 1.03 seul.
5. **1 signature Refero en plus** — marquee cartels, compteur salles, grain léger, split type, progress nav — **un** geste mémorable copié d’un style figé, pas inventé dans le vide.
6. **Densité émotionnelle** — moins de “air pour l’air” (bistrot full-page cream dead), plus de rythme : full-bleed réel, rupture scale, une section qui casse la grille.
7. **Refero-only exécuté** — `refero_get` → inventory motion **codé ligne à ligne** ; QA refuse si non visible.

Cible chiffrée V1 goût : **≥ 7/10** ressenti opérateur (pas 10 Awwwards Site of the Day — **Awwwards-lite / galerie crédible**). En dessous de 6 = no-ship goût.

---

## 4. Amendements non négociables (builder) — prochain build

### Non-négociables (FAIL = pas de ship)

- **Refero only** — 0 inspiration Awwwards/web/enseignee hors Refero tant que doctrine lockée.
- **3 styles figés** id + url + northStar **avant** code ; `refero_get` → **motion inventory** par style (pas seulement couleurs/typo).
- **Hero signature ≠ fade** : au moins un de {clip-path, mask wipe, line-stagger display, image directional reveal}. Durée totale hero 400–900 ms, ease distinctif. Fade seul hero = **FAIL**.
- **Interdit** comme seule motion site :
  ```css
  .reveal { opacity:0; transform:translateY(Npx); } /* puis is-in */
  ```
  Ce pattern peut exister en **complément**, jamais comme identité motion.
- **Hover système** cartes/œuvres : ≥2 propriétés animées (ex. scale image + translate méta + draw filet). Opacity seule = FAIL.
- **Scroll presence** : stagger grille **distinctif** + **≥1** effet de section non-fade (pin léger interdit si LCP/jank ; préférer clip, horizontal nudge, number count-up, rule draw).
- **Nav** underline/indicator animé (déjà souvent OK — garder).
- **+1 signature Refero** visible (marquee / grain / split / index number / cursor discret) documentée “source style X”.
- **Images** : aucune zone média >30 % viewport qui lit “vide/gris uni” au premier écran 1440 et 390. Hero LCP doit avoir **sujet lisible** (contraste local). Régénérer assets si besoin — **ne pas shipper mush pale**.
- **PE** : contenu visible sans JS ; reduced-motion coupe anims, pas le contenu.
- **Preuve QA goût** : shot ou clip avant/après hover + scroll mid-page montrant anim **identifiable** ; citation DESIGN sans effet = FAIL.
- **V1 = barre finale goût** — “motion en V2” interdit (doctrine).

### Nice-to-have (ne bloquent pas si le reste est solide)

- Cursor custom, WebGL, Lottie, GSAP CDN, scrolljack lourd — **hors budget** sauf arbitrage explicite Michel+Thierry.
- Parallax continu, multi-page case study.
- Sound, page transitions SPA.

### Fourchettes coût

| Item | Effort |
|---|---|
| Spike hero motion (1 page jetable ou branche Séléné hero-only) | **0,5 j** max (4 h) |
| Rebuild Séléné complet sous barre | **1–1,5 j** builder + 0,25 j QA |
| Retrofit bistrot / atelier / fournil sous même barre | **0,75–1 j / site** après canon Séléné |
| Régén images Séléné (hero + 2 œuvres mortes + matière) | **2–4 h** inclus rebuild |

---

## 5. Rebuild Séléné maintenant vs spike hero d’abord ?

**Spike hero d’abord (hard cap 4 h), puis rebuild Séléné immédiat.**  
Pas rebuild full à l’aveugle : le studio **ne sait pas encore** coder une motion Refero sous contraintes PE (on livre le fade interdit en boucle).  
Pas spike sans rebuild derrière : l’indécision et le “on verra” coûtent plus cher que 1,5 j.

Séquence :
1. **Spike** (builder) : un hero galerie (Séléné ou `/spike-motion-hero/`) qui passe la checklist non-négociable #hero + hover. Thierry challenge perf/a11y. Michel go/no-go 15 min sur shot+live.
2. **Si go spike** → rebuild Séléné full = **canon V1 Refero-motion** du Studio.
3. **Autres démos** : tag “pre-doctrine goût” sur l’index GH ; retrofit **après** canon, pas en parallèle (évite 4× le même raté).

---

## 6. VERDICT

**`go avec amendements` — option retenue : SPIKE HERO (≤4 h) → REBUILD SÉLÉNÉ (canon) → retrofit autres**

| Option | Décision |
|---|---|
| Rebuild immédiat Séléné sans spike | **Écartée** — risque de re-livrer fade+typo propre sous nouveau packaging |
| Spike puis rebuild | **Retenue** |
| Spike seul / R&D ouverte | **Écartée** — pas de fin |
| Rebuild les 4 sites en parallèle | **Écartée** — 3–4 j brûlés, 0 canon |
| Garder Séléné live tel quel | **No-go** — ne pas présenter comme vitrine goût |

### Chiffres

- Note Michel Séléné : **2,5/10** (goût pur ~1,5–2)
- Accord opérateur 1/10 : **oui** (écart structure +1,5 max)
- Barre ship V1 goût : **≥7/10** ressenti
- Délai déblocage : spike **≤4 h** + rebuild **1–1,5 j** = **~2 j calendaires** pour un canon

### Prochain pas clair

1. David crée carte **spike-motion-hero-selene** (assignee builder, parents = cette revue si besoin), brief = non-négociables §4, mots-clés Refero ci-dessous.
2. Thierry gate spike (perf LCP, reduced-motion, no hidden content).
3. Michel 15 min go/no-go spike sur live/shot.
4. Si go → carte **rebuild-selene-v1-refero-motion** ; sinon itération spike **une seule** (max +2 h) puis rebuild quand même avec pattern le moins pire validé — **pas de troisième spike**.

### Mots-clés vibe `refero_search` (spike + rebuild Séléné)

`museum gallery exhibition editorial monochrome motion photography serif hairline wipe stagger`

(Variante secondaire si pool faible : `art gallery portfolio white space image reveal hover elegant`)

### Non-négociables vs nice-to-have

Voir §4. Résumé une ligne : **Refero-only + hero signature anti-fade + hover multi + scroll distinctif + images lisibles + preuve QA visible**. Le reste est optionnel.

---

*Michel — Vision/Attaque · Studio Brontès · 2026-07-26*
