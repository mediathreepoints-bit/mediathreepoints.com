# Threepoints Media — site d’agence

Première version responsive de l’agence digitale marocaine, en français et en arabe (RTL). Les pages sont pré-rendues en HTML statique pour être indexables ; React hydrate ensuite les interactions.

## Démarrer

```bash
npm install
npm run dev
```

Pour vérifier la version de production en local :

```bash
npm run build
npm run preview
```

Le build produit les routes françaises et arabes sous `dist/` (arabe sous `/ar/...`), dont `/visites`, les quatre fiches de destination Kénitra, les pages du portfolio et `/admin`. Pour Hostinger, exécuter le build puis téléverser **le contenu de `dist/`** dans `public_html/` : `index.html`, `assets/`, `images/`, `services/`, `solutions/`, `visites/`, `admin/`, `ar/`, `robots.txt`, `.htaccess`, `supabase-config.js` et `google-maps-config.js` doivent se retrouver à la racine du site. Le `.htaccess` inclus permet aussi à un slug de visite nouvellement publié (absent du pré-rendu) de retomber sur l’application React. Le serveur statique doit servir l’`index.html` présent dans chaque dossier de route. Une variable `SITE_URL` permet aussi de générer `dist/sitemap.xml` :

```bash
SITE_URL=https://votre-domaine.ma npm run build
```

Utiliser le domaine réel uniquement après validation. `robots.txt` est fourni ; le sitemap n’est généré que si `SITE_URL` est renseignée.

## Modifier les contenus et la marque

- `src/content.js` : expertises, textes français/arabe, secteurs, offres, projets de portfolio et articles.
- `src/siteConfig.js` : nom provisoire, coordonnées (vides tant qu’elles ne sont pas vérifiées), réseaux, lecteur 360°, domaine(s) de visite autorisés, URL du formulaire et configuration analytique.
- `scripts/prerender.mjs` : routes, titres/meta descriptions et génération du HTML initial, hreflang et sitemap.
- `src/main.jsx`, `src/style.css`, `src/tour.css`, `src/home.css` : pages, interactions, animation GSAP, styles et lecteur.
- `public/images/service-cards/` : les six cartes WebP fournies avec la maquette. Chaque image contient déjà le numéro, le titre et l’illustration ; elles sont utilisées au format 2:1 sur la version française. La version arabe garde des cartes HTML traduites. Les écrans et chiffres intégrés aux visuels sont indiqués comme illustratifs.
- `public/images/portfolio/` : 23 visuels optimisés repris des fichiers graphiques fournis à la racine du dépôt GitHub et présentés dans une galerie de portfolio.
- `public/images/` : autres images d’illustration pour le hero, l’ambiance immersive et les concepts. Elles ne sont pas présentées comme des panoramas.
- `public/documents/` : deux PDF d’origine, téléchargeables depuis les pages Réalisations et Agence.
- Le hero ajoute un petit rendu Three.js décoratif sur ordinateur ; il est désactivé sur mobile et lorsque la réduction des animations est demandée.

Les offres sont « Sur devis ». La page Réalisations ne présente que les éléments disponibles dans le portfolio transmis ; aucun client, résultat ou contexte supplémentaire n’est inventé. Les PDF source contiennent des coordonnées imprimées : les vérifier avant diffusion publique. Le nom Threepoints Media est provisoire et doit être confirmé.

## Plateforme de visites virtuelles 360°

Le catalogue public (`/visites`) présente quatre fiches bilingues de Kénitra : Kasbah de Mehdia, Plage de Mehdia, Lac Sidi Boughaba et Corniche du Sebou. Les concepts d’entreprise fictifs ont été retirés du catalogue public. Chaque lieu a sa page détail et une recherche Google Maps utilisable sans Supabase ni clé. Les couvertures sont des illustrations conceptuelles, pas des photos documentaires. Aucun panorama Street View n’est annoncé avant vérification via l’API Google ; aucun panorama original n’est fourni. Une fiche sans panorama conserve une carte/lien Google Maps avec un état explicite. Aucune photo ordinaire n’est transformée en fausse visite 360°.

Le lecteur **Pannellum 2.5.7** (MIT) prend en charge les panoramas équirectangulaires 2:1, la navigation entre scènes, hotspots d’information et de scène, zoom, glissement tactile/souris, miniatures, plein écran, lien de partage et plan interactif. Le code d’intégration s’adapte au lecteur public. Aucune visite d’entreprise fictive n’est proposée dans le catalogue ; un administrateur peut créer une vraie fiche et importer des panoramas originaux 2:1 autorisés.

### Activer Supabase et l’espace admin

Le rendu public statique fonctionne sans backend. Pour l’authentification, les imports et la publication réelle :

1. Créer un projet Supabase et exécuter `supabase/schema.sql` dans le SQL Editor. Le script crée les tables, politiques RLS, bucket privé `tour-assets` et quatre fiches Kénitra non publiées. Les pages Kénitra restent consultables sans Supabase.
2. Créer les comptes administrateurs dans Supabase Auth (sans inscription publique), puis inscrire leur UUID dans `public.tour_admins`, par exemple :

   ```sql
   insert into public.tour_admins (user_id)
   select id from auth.users where email = 'admin@votre-domaine.ma';
   ```

3. Renseigner l’URL du projet et la clé publique **anon/publishable** dans `public/supabase-config.js`, puis reconstruire et téléverser `dist/`. La même configuration peut être définie au build avec `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`.
4. Ouvrir `/admin`, se connecter, choisir une fiche, importer plusieurs panoramas, nommer les scènes, placer les hotspots sur le panorama, relier les pièces, ajouter un plan et des médias, puis publier.

Le tableau de bord vérifie les dimensions des fichiers panoramiques (ratio 2:1, largeur minimale 1024 px) et exige une confirmation explicite de l’administrateur quant à l’authenticité de la projection équirectangulaire et aux droits d’utilisation — le ratio seul ne prouve pas qu’une image est un vrai panorama. Une contrainte SQL empêche la publication d’une visite Pannellum sans scènes confirmées. Une fiche peut aussi être publiée avec une intégration Google Maps seule ; elle est alors identifiée comme une carte, jamais comme une visite 360° Threepoints. Le tableau de bord gère les brouillons/publications, propose un lien public et un extrait iframe. Les assets restent dans un bucket privé ; le site public demande des liens signés seulement pour les fichiers associés aux visites publiées. Les politiques RLS protègent les visites non publiées et les opérations d’administration.

La clé anon est publique par conception et ne donne que les accès permis par RLS. **Ne jamais ajouter une clé `service_role` au navigateur ou au dépôt Git.** La migration SQL et la configuration du projet Supabase doivent être exécutées par l’administrateur du projet avant de tester l’espace admin. Aucun panorama réel n’est fourni actuellement.

### Google Maps et Street View à Kénitra

Les fiches Kasbah de Mehdia, Plage de Mehdia, Lac Sidi Boughaba et Corniche du Sebou sont définies dans `src/tourData.js`. Elles restent lisibles sans Supabase ; les liens Maps s’ouvrent sans clé API après le clic du visiteur. Les repères géographiques sont des coordonnées candidates à contrôler dans Google Maps avant publication éditoriale : [Kasbah (référence encyclopédique)](https://en.wikipedia.org/wiki/Kasbah_Mahdiyya), [plage de Mehdia](https://mapcarta.com/W454918962), [lac Sidi Boughaba](https://mapcarta.com/W290212858) et [repère secondaire pour la Corniche](https://www.tripadvisor.com/Attractions-g2578717-Activities-Kenitra_Rabat_Sale_Kenitra.html). Ces sources ne prouvent pas que le point exact est couvert par Street View. La couverture Street View des quatre points est **non vérifiée** pour l’instant. Le bouton « Explorer en 360° » n’apparaît que lorsqu’un administrateur a obtenu une réponse positive de Google, puis enregistré le statut et l’identifiant pano. Les coordonnées peuvent être saisies dans `/admin`, ou préremplies en collant un lien Google Maps qui contient un point explicite.

Pour activer la vérification et les cartes Street View/cartes intégrées :

1. Dans Google Cloud, créer un projet avec facturation configurée et activer **Maps JavaScript API** (vérification par `StreetViewService`) et **Maps Embed API** (iframe interactive).
2. Créer une clé navigateur et la restreindre par HTTP referrer aux domaines de production nécessaires, par exemple `https://votre-domaine.ma/*` et `https://www.votre-domaine.ma/*`. N’ajouter les domaines de prévisualisation que si l’équipe en a besoin. Une clé navigateur est publique : ne pas lui donner de droits serveur.
3. Renseigner `apiKey` dans `public/google-maps-config.js`, reconstruire le site et déployer ce fichier avec `dist/`. La configuration actuelle est vide : la vérification et les iframes ne s’activent donc pas tant qu’une clé valide n’est pas ajoutée. Les liens « Ouvrir dans Google Maps » restent fonctionnels.
4. Dans `/admin`, créer/éditer une fiche, saisir le lien Google Maps et les coordonnées, puis lancer « Vérifier Street View près de ce point ». La recherche est limitée à 100 m autour du repère ; il faut contrôler que le panorama trouvé correspond bien au lieu avant de publier. Une réponse négative laisse la carte disponible sans promettre de visite.

Les URLs Google Maps officielles peuvent ouvrir une recherche, un itinéraire ou une vue pano sans clé API ([Maps URLs](https://developers.google.com/maps/documentation/urls/get-started)). Les intégrations iframe et paramètres de clé suivent la [documentation Maps Embed API](https://developers.google.com/maps/documentation/embed/get-started) et ses [modes d’intégration](https://developers.google.com/maps/documentation/embed/embedding-map). Les cartes et panoramas intégrés sont chargés uniquement après action du visiteur.

Google héberge l’imagerie Maps/Street View ; le site ne la télécharge pas, ne la copie pas et ne la transforme pas en scènes Pannellum. Pour une visite Threepoints Media, importer séparément des panoramas équirectangulaires originaux 2:1 dont les droits sont confirmés.

### Configuration locale facultative

Pour le lecteur historique d’un panorama local, `src/siteConfig.js` accepte toujours `mode: 'panorama'` et un tableau `scenes`. Les URLs externes nécessitent HTTPS et un hôte autorisé dans `allowedTourHosts`. Une visite externe en iframe n’est intégrée que si le fournisseur l’autorise (CSP/X-Frame-Options) et si les droits d’utilisation sont confirmés.

## Formulaire et protection des demandes

Le formulaire est **en démonstration** tant que `formEndpoint` reste vide : il ne transmet ni ne conserve de données, et ne prétend jamais qu’une demande a été reçue. Quand un backend est prêt, renseigner une URL HTTPS et faire en sorte que l’API :

1. valide les champs et le consentement nécessaire ;
2. contrôle le champ honeypot, applique limitation de débit et protections antispam côté serveur ;
3. enregistre ou transmet la demande de façon sécurisée, puis renvoie un statut HTTP 2xx uniquement après réception réelle ;
4. protège l’accès, définit les durées de conservation et respecte les règles applicables au Maroc et aux destinataires concernés.

Les coordonnées de prospects ne sont jamais sauvegardées dans `localStorage`. La case de communications commerciales reste facultative et distincte. L’intégration de réception, la politique de confidentialité définitive, l’adresse, les identifiants légaux et l’hébergeur sont à compléter/valider avant production.

## Services externes à connecter (aucun n’est actif par défaut)

1. **Réception des demandes** : API/backend HTTPS, messagerie ou CRM choisi par l’agence ; aucune destination n’est préconfigurée.
2. **Lecteur/hébergement 360°** : fournir des panoramas autorisés ou un fournisseur HTTPS qui autorise l’iframe ; ajouter seulement ses hôtes vérifiés à `allowedTourHosts`.
3. **API de devis** : saisir un endpoint HTTPS ou un chemin relatif dans `formEndpoint` ; pour un service externe, ajouter seulement son hôte vérifié à `allowedApiHosts` et configurer CORS côté serveur.
4. **Mesure** : aucun script publicitaire ou analytique n’est installé. Les interactions émettent des événements DOM `tp:event` (`tour_open`, `contact_click`, `quote_start`, `quote_received`) sans nom, e-mail ni téléphone. Avant d’ajouter un outil de mesure, connecter un mécanisme de consentement et vérifier les règles applicables. `quote_received` est émis uniquement après une réponse positive du backend.
5. **Espace de visites** : l’interface d’administration réelle est disponible sur `/admin` après configuration Supabase. Sans URL/clé de projet et compte autorisé, elle affiche les étapes de mise en service et n’imite pas une connexion.
6. **Mise en production** : confirmer domaine, hébergeur, mentions légales, droits médias, coordonnées et redirections. Le sitemap dépend de `SITE_URL`.

## Références et intégrité

Les exemples de clients, témoignages, chiffres, partenaires et certifications ne sont pas inventés. La photo générée est une simple illustration. L’UIR, les sites d’inspiration cités dans le brief et leurs contenus ne sont pas présentés comme des clients, des sources de texte ou des ressources de ce site.
