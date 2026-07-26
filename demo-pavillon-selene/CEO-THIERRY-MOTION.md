# CEO Contrôle — Séléné : goût, motion Refero et dette

Date : 2026-07-26  
Tâche : `t_094d1607`

## Verdict

**NO-GO pour présenter ou republier Séléné comme une V1 « motion Refero réelle ».**  
**GO pour un spike motion borné avant toute reconstruction.**

Le site n’est pas cassé : la structure éditoriale, la fiction explicite, la navigation duale, le poids, le fonctionnement sans JS et le mode réduit constituent un socle sérieux. Mais ce socle a été confondu avec une réussite de direction artistique. La motion livrée est précisément le niveau refusé : `opacity + translateY`, hover image `scale(1.03)`, changement de couleur CTA et underline de nav. C’est du micro-polish propre, pas une identité motion issue de Refero.

Une gate mécanique verte ne doit plus pouvoir transformer ce constat en PASS goût.

## 1. Note Séléné

| Axe | Note | Contrôle |
|---|---:|---|
| Goût / désir / singularité | **2,5/10** | Split hero et typographie corrects, mais brochure galerie froide, photo hero peu narrative, longues plages blanches et peu de tension. |
| Richesse motion Refero | **1/10** | Hero `hero-in` 350 ms = fade + `translateY`; sections `rise` 250 ms; grille = même `rise` avec délais; hover = scale 1.03. Aucun mask/wipe, geste de section, système de hover riche ni signature Refero. |
| Solidité motion / a11y | **7/10** | Bon : contenu visible par défaut, JS vanilla 2 225 octets, un IO, no-JS utilisable, reduced-motion neutralisé, axe 0. Retrait : preuve motion insuffisante, CLS au-dessus du seuil sur 2 runs et état live non testé dans les shots locaux. |
| **Note de revue globale** | **3/10** | La robustesse empêche le 1/10 technique. Elle ne rachète pas l’échec goût/motion, qui est le cœur de la demande opérateur. |

Je rejoins donc la note opérateur sur le fond. Le différentiel de deux points vient de la discipline structurelle, pas de l’attractivité.

## 2. Preuves vérifiées

- Rendus réellement regardés : 390 et 1440, premier écran et pleine page, local + URL publiée.
- Code : `index.html`, `js/motion.js`, `DESIGN.md`.
- QA : `REPORT.md`, re-QA, `BUILD-QA.md`, Lighthouse et axe déclarés.
- Empreinte livrable hors preuves QA : **546 016 octets**, dont **419 152 octets d’images**, **74 524 octets de polices**, **2 225 octets de JS** et **10 675 octets de CSS inline**. Il existe donc de la marge : une bibliothèque lourde n’est pas justifiable.
- Runtime live : la seule animation encore exposée après chargement est `hero-in`, durée 350 ms, terminée. Le code confirme des variantes du même `rise` pour le reste.
- Les 7 blocs motion contrôlés ont `opacity:1` avant scroll : le correctif anti-contenu-caché est réel.
- QA annonce LCP ~1,17–1,58 s et axe 0, mais CLS **0,102 sur 2 des 3 runs** alors que la doctrine exige strictement `<0,1`. « Borderline non bloquant » n’est pas un PASS conforme.
- La publication injecte un bandeau hôte de 45 px (« enseigne fictive », « ce commerce ») au-dessus du bandeau projet de 42 px. Le message est dupliqué et le mot « commerce » est faux pour une exposition. Les shots locaux ne représentent donc pas exactement la page publiée.
- `DESIGN.md` conserve une section « Refs secteur (hors Refero) » alors que le lock actuel est Refero-only. Le document ne prouve pas non plus un inventaire exhaustif `refero_get` : il rattache surtout des effets génériques aux trois noms.

## 3. Risques d’une poussée motion agressive

### Bloquants

1. **Reproduire le même échec avec plus d’effets**  
   Risque : empiler fades, parallax et librairie sans construire une grammaire identifiable. On paie de la dette sans gagner de goût.  
   Mitigation : spike sur trois gestes seulement, chacun rattaché à un `style id` Refero et validé en vidéo avant intégration.

2. **Masquer ou retarder du contenu essentiel**  
   Risque : retour de `.js … {opacity:0}`, IO non déclenché, script 404, onglet restauré au milieu de page, h1/CTA/LCP invisibles. L’incident Séléné F1 a déjà prouvé ce piège.  
   Mitigation : état CSS final visible; classe d’enrichissement ajoutée seulement par un script sain; aucun contenu essentiel dépendant d’un observer; scénario JS 404 obligatoire.

3. **Reduced-motion cosmétique**  
   Risque : couper une transition tout en laissant scroll lissé, pin, parallax, masque ou boucle; provoquer nausée ou perte de repère.  
   Mitigation : mode `reduce` sans animation d’entrée, smooth scroll, pin, parallax, autoplay, compteur ou retard; même ordre et même contenu, immédiatement visibles.

4. **PASS QA mensonger**  
   Risque : valider parce que des sélecteurs et des captures existent, sans avoir vu l’animation. C’est exactement le trou actuel.  
   Mitigation : screen recordings, tests d’états et rubric goût obligatoires; une capture statique ne prouve jamais une motion.

### Majeurs

1. **Performance / batterie**  
   Risque : GSAP/Framer/Lottie/WebGL gratuits, filtres et blur animés, nombreux observers/listeners, paint et raster continus.  
   Mitigation : CSS first, JS vanilla local, zéro dépendance motion par défaut, un contrôleur, transform/opacity/clip court, aucune boucle continue.

2. **CLS et LCP**  
   Risque : wrapper ajouté autour du hero, polices animées, image wipe mal dimensionné, sticky/pin et contenu injecté. Le CLS est déjà hors seuil sur deux runs.  
   Mitigation : dimensions réservées, média LCP non lazy, pas d’injection de hauteur, 3 runs froids propres avant et après motion; aucun dépassement du seuil n’est requalifié « non bloquant ».

3. **Navigation et clavier**  
   Risque : overlay/cursor custom intercepte les clics, focus visuel différent du hover, menu inaccessible pendant l’animation, ancre masquée sous sticky.  
   Mitigation : `pointer-events:none` sur décor, états focus équivalents, nav utilisable avant/pendant/après animation, clavier et tactile testés.

4. **Dette d’architecture**  
   Risque : timelines et nombres magiques dispersés dans le HTML, un observer par effet, classes sans contrat, impossibilité de modifier la page.  
   Mitigation : un inventaire motion versionné, tokens de durée/easing/distance, un contrôleur, sélecteurs `data-motion`, destruction propre et aucun listener global par carte.

5. **Copie Refero / propriété intellectuelle**  
   Risque : copier pixel-perfect composition, assets, branding ou code d’un style. « Refero-only » autorise l’inspiration, pas l’appropriation.  
   Mitigation : reprendre des principes d’interaction, adapter tokens/contenu/rythme, ne réutiliser aucun asset/code/marque, documenter adaptation et écart.

6. **Divergence local / publié**  
   Risque : valider une version sans le bandeau injecté par l’hôte, puis découvrir duplication, mauvais vocabulaire et premier écran comprimé.  
   Mitigation : dernière gate sur l’URL publique, à 390 et 1440, et contrat d’injection hôte adapté au type de démo.

### Mineurs

- `backdrop-filter: blur(10px)` du sticky header est acceptable seul, mais ne doit pas être combiné à des couches animées continues.
- Les œuvres très pâles se lisent parfois comme des placeholders; enrichir le contraste/cadrage est plus utile qu’ajouter un effet gratuit.
- La pleine page mobile est longue et linéaire; la densité de contenu existe, mais pas la variété de composition.

## 4. Garde-fous opposables

### Source et ambition

- [ ] Exactement 3 Refero Styles, chacun avec `id`, `siteName`, `url`, `northStar`.
- [ ] Pour chacun : inventaire `refero_get` des interactions observées, pas seulement une ambiance.
- [ ] Chaque effet codé porte : source, adaptation, déclencheur, cible, durée, easing, fallback reduce et raison d’écarter le reste.
- [ ] Aucun driver DA hors Refero tant que le lock opérateur reste actif; retirer la section « hors Refero ».
- [ ] Aucun asset, code, logo ou composition pixel-perfect repris.

### Motion minimale qui compte

Les cinq familles ci-dessous doivent toutes être présentes et visibles en usage normal :

1. **Hero signature non-fade** : image wipe/mask/clip ou typographie en lignes, 400–900 ms, sans attente IO.
2. **Hover/focus système** : au moins deux transformations coordonnées sur œuvre/CTA — image + cartel/filet/méta — avec équivalent clavier.
3. **Présence scroll distinctive** : stagger de grille plus au moins un geste de section non-fade.
4. **Nav animée** : indicateur/underline conservé, focus compris.
5. **Une signature Refero supplémentaire** : index de salle, règle dessinée, split transition, grain non continu, marquee bornée, etc., uniquement si réellement présente dans un style retenu.

Le `rise` générique peut rester en complément; il ne compte pour aucune des cinq familles.

### Robustesse / a11y

- [ ] Contenu final visible par défaut; interdiction de `.js … {opacity:0}` comme précondition globale.
- [ ] JS absent, lent ou 404 : h1, CTA, nav, œuvres, infos et footer visibles et utilisables.
- [ ] Le h1 sémantique, le CTA et le média LCP ne dépendent jamais d’un IO. Une couche décorative `aria-hidden` peut porter le geste hero.
- [ ] `prefers-reduced-motion: reduce` : animations/transitions à 0, smooth scroll off, aucun pin/parallax/autoplay/boucle.
- [ ] Aucun scrolljacking, curseur custom bloquant, flash, boucle décorative permanente ou information disponible au hover seul.
- [ ] Les décors animés n’interceptent ni clic ni focus.
- [ ] Les cibles restent ≥44×44 et l’ordre de tabulation ne change pas.

### Poids / perf

- [ ] Zéro bibliothèque motion tierce sans spike chiffré et accord CEO explicite.
- [ ] JS motion local minifié **≤8 KiB**; un seul contrôleur/observer; aucun listener de scroll par élément.
- [ ] Accueil complet après scroll **<1 Mo**; pas de vidéo/WebGL/Lottie pour cette V1.
- [ ] LCP mobile médiane de 3 runs cache froid `<2,5 s`.
- [ ] CLS `<0,1` sur chacun des 3 runs; pas d’exception « borderline ».
- [ ] INP `<200 ms`; aucune long task >50 ms attribuable à la motion dans la trace d’interaction.
- [ ] Propriétés animées : transform/opacity et clip/mask court si la trace ne montre pas de jank; pas de width/height/top/left ni filtre/blur continu.

## 5. Ce que QA doit ajouter

### Rubrique goût auditée — 10 points

QA ne peut pas automatiser le goût, mais peut empêcher un PASS arbitraire. Deux reviewers notent séparément cinq axes de 0 à 2 :

1. impact du premier écran;
2. force et lisibilité des images/matières;
3. variété de rythme et de composition;
4. signature motion identifiable;
5. fidélité transformée aux trois Refero.

**PASS goût : ≥7/10, aucun axe à 0, et aucune objection opérateur ouverte.** La note et deux phrases de justification par axe sont conservées. La conformité technique ne compense pas une note goût insuffisante.

### Cas testables motion

| ID | Test | PASS opposable |
|---|---|---|
| MOT-01 | Trace Refero | 3 styles exacts + inventaire `refero_get` + mapping effet→style vérifiable. |
| MOT-02 | Vidéo normale 390/1440 | Capture 10–20 s montrant hero, hover/focus, scroll, nav et signature. Les cinq familles sont visibles; pas seulement annoncées. |
| MOT-03 | JS désactivé | Full page + navigation/ancres : aucun contenu manquant, transparent ou hors écran. |
| MOT-04 | JS 404/abandon après classe `js` | Même résultat visible; pas de page bloquée dans un état initial. |
| MOT-05 | Reduced motion | Vidéo et inspection runtime : aucune animation, transition, smooth scroll, pin ou retard; contenu identique. |
| MOT-06 | Clavier/tactile | Hover reproduit au focus; Tab/Shift+Tab/Entrée/Échap; aucun overlay n’intercepte les actions. |
| MOT-07 | Performance | 3 runs froids + trace interaction; LCP/CLS/INP/long tasks et poids respectent tous les seuils. |
| MOT-08 | Responsive | 390/767/768/1024/1440 : pas de crop non voulu, overflow, superposition, ancre masquée ou menu cassé pendant l’animation. |
| MOT-09 | URL publiée | Contrôle réel du rendu hôte, du bandeau injecté, des ressources lazy et de la parité avec les preuves locales. |
| MOT-10 | Régression contenu | Tous les textes, œuvres, infos, fiction, mentions, droits et nav restent présents; aucune motion ne porte seule le sens. |

Une règle CSS, un nom d’animation ou une capture statique ne suffisent jamais à déclarer MOT-02 PASS.

## 6. Rebuild immédiat ou spike ?

**Désaccord avec un rebuild total immédiat.** Il détruirait un socle légal/a11y/perf correctement réparé et encouragerait l’empilement d’effets sous pression.

**Décision : spike d’une journée maximum**, sur une copie non publiée, avec seulement :

1. un hero signature issu d’un des 3 styles;
2. une carte œuvre avec hover + focus riche;
3. une transition de section non-fade + une signature Refero;
4. versions 390 et 1440, normal et reduced-motion;
5. vidéo courte + chiffres poids/LCP/CLS/long tasks.

Gate du spike : note goût ≥7/10, cinq familles motion crédibles à terme, aucun garde-fou cassé. Si le spike passe, intégrer dans le socle actuel et varier les sections. S’il échoue, alors seulement décider un rebuild contrôlé de la couche visuelle/motion, en préservant HTML sémantique, contenu, droits, fiction, nav et budgets.

## 7. Checklist builder — V1 « motion Refero réelle »

- [ ] Nettoyer DESIGN.md : Refero-only, 3 styles, inventaires complets, aucune référence hors lock.
- [ ] Définir tokens `duration/easing/distance` et un contrat `data-motion`.
- [ ] Produire le spike hero + œuvre + section avant de généraliser.
- [ ] Conserver contenu visible par défaut et le mode JS 404 sûr.
- [ ] Porter les cinq familles motion minimales; ne pas compter les fades génériques.
- [ ] Prévoir focus/touch/reduced-motion au moment du composant, pas en correctif final.
- [ ] Garder JS ≤8 KiB, sans lib, sans boucle, sans scroll handler par élément.
- [ ] Remesurer après chaque geste; ne pas attendre la fin pour découvrir le jank.
- [ ] Corriger le CLS font-swap avant PASS.
- [ ] Corriger/neutraliser le double bandeau live et le vocabulaire « commerce ».
- [ ] Fournir captures + vidéos + manifest motion à QA.

## 8. Checklist QA — avant PASS

- [ ] Lire les 3 sources et confronter chaque effet au mapping, pas seulement à DESIGN.md.
- [ ] Regarder les 4 vidéos : 390/1440 × normal/reduced.
- [ ] Exécuter JS off puis `motion.js` 404 avec `html.js` présent.
- [ ] Vérifier h1, CTA, LCP, menu, œuvres, infos et footer avant/après scroll.
- [ ] Tester hover, focus, tactile, Tab/Shift+Tab/Entrée/Échap.
- [ ] Rejouer 390/767/768/1024/1440 et zoom 200 %.
- [ ] Exécuter axe sur page initiale et menu ouvert; compléter par contrôle clavier/vestibulaire manuel.
- [ ] Produire 3 runs froids; refuser tout CLS ≥0,1.
- [ ] Tracer l’interaction motion et refuser long task >50 ms attribuable.
- [ ] Vérifier poids complet après scroll et JS minifié.
- [ ] Tester l’URL publique, y compris injection hôte et lazy images.
- [ ] Appliquer la rubrique goût; PASS interdit sous 7/10 ou avec un axe à 0.

## Décision finale de cette revue

- **Séléné actuelle : NO-GO « motion Refero réelle ».**
- **Socle technique : à préserver, pas à jeter.**
- **Prochaine étape autorisée : spike motion borné.**
- **Rebuild total : non autorisé sans échec documenté du spike et plan de préservation.**
