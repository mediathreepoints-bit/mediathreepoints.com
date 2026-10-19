import React, { useState, useEffect, useRef, useId } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowDown,
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  Menu as MenuIcon,
  X,
  Globe,
  Play,
  MoveUpRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Send,
  Compass,
  Camera,
  Monitor,
  Target,
  MapPin,
  Clock3,
  Plus,
  Minus,
  RefreshCw,
  Image as ImageIcon,
  ExternalLink,
  Share2,
  Copy,
  Download,
  FileText,
  Building2,
  Hotel,
  Utensils,
  GraduationCap,
  Store,
  House,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { services, sectors, offers, projects, articles } from "./content";
import { siteConfig } from "./siteConfig";
import { staticTours } from "./tourData";
import {
  googleMapsPanoUrl,
  googleMapsPlaceEmbedUrl,
  googleMapsSearchUrl,
  googleStreetViewEmbedUrl,
  normalizeGoogleMapsEmbedUrl,
  normalizeGoogleMapsSearchUrl,
} from "./lib/googleMaps.js";
import "./style.css";
import "./tour.css";
import "./home.css";
import "./visual-refresh.css";
import "./google-maps.css";
import "./agency-design.css";
import "./premium-surfaces.css";
import "pannellum/build/pannellum.css";
const LazyTourAdminPage = React.lazy(() => import("./admin/TourAdminPage.jsx"));
const WITHDRAWN_DEMO_TOUR_SLUGS = new Set([
  "villa-de-luxe",
  "hotel-resort",
  "restaurant-panoramique",
  "musee-patrimoine",
]);
const SECTOR_ICONS = [Hotel, Utensils, Building2, GraduationCap, Store, House];
const T = {
  fr: {
    nav: ["Expertises", "Solutions", "Réalisations", "Agence", "Conseils"],
    cta: "Parler de mon projet",
    home: "Accueil",
    eyebrow: "AGENCE COMMUNICATION & DESIGN · MAROC",
    hero: "Stratégie, communication et design pour votre marque.",
    sub: "Nous accompagnons les entreprises au Maroc en stratégie de marque, identité visuelle, création de contenus et expériences digitales.",
    explore: "Découvrir les lieux",
    quote: "Demander un devis",
    scroll: "DÉFILER POUR EXPLORER",
    intro: "Une présence qui fait avancer",
    introText:
      "Trois expertises, pensées ensemble. Pour que chaque point de contact donne envie d’aller plus loin.",
    pillars: ["Immersion", "Présence", "Acquisition"],
    pillarText: [
      "Faites visiter vos espaces, même à distance.",
      "Donnez à votre activité un site à sa hauteur.",
      "Touchez les bonnes personnes, avec méthode.",
    ],
    services: "Découvrir les expertises",
    signature: "La visite virtuelle, au service du réel.",
    signatureText:
      "Un lieu se comprend mieux quand on peut s’y projeter. Une visite bien conçue ne montre pas seulement des pièces : elle guide vers la prochaine étape.",
    stepNames: [
      "Découvrir un lieu",
      "Comprendre l’offre",
      "Être rassuré",
      "Passer à l’action",
    ],
    sectors: "Des solutions qui partent de votre métier",
    sectorsText:
      "Chaque secteur a ses propres enjeux. Nous commençons par les vôtres.",
    work: "Des projets à imaginer ensemble",
    demo: "PROJET DE DÉMONSTRATION",
    portfolioItem: "PORTFOLIO FOURNI",
    workText:
      "Une sélection issue du portfolio transmis. Aucun résultat ou contexte client n’est ajouté sans vérification.",
    galleryTitle: "Extraits du portfolio graphique",
    portfolioPdf: "Portfolio graphique complet",
    agencyPdf: "Présentation de l’agence",
    downloadPdf: "Télécharger le PDF",
    galleryInfo:
      "Les images sont présentées telles qu’elles figurent dans les fichiers transmis.",

    offers: "Un premier cadre, pas une formule figée",
    offersText:
      "Chaque proposition s’adapte aux objectifs, aux ressources et au contexte de votre entreprise.",
    from: "À partir d’un échange",
    price: "Sur devis",
    more: "Voir les offres",
    faq: "Les questions que l’on nous pose",
    final: "Quel projet souhaitez-vous développer ?",
    finalText:
      "Parlons de vos objectifs, de votre lieu ou de votre présence digitale. Le premier échange sert à clarifier les besoins.",
    contact: "Parler de mon projet",
    about: "Une agence de communication et de design.",
    aboutText:
      "Nous faisons dialoguer stratégie, identité visuelle, contenus et expériences digitales pour donner une expression claire à votre marque.",
    read: "Lire l’article",
    all: "Tout explorer",
    allProjects: "Toutes les réalisations",
    allArticles: "Tous les conseils",
    footer: "Une communication plus juste, des expériences qui restent.",
    contactLabel: "Contact",
    discover: "Explorer",
    demoTour: "APERÇU DE LA VISITE",
    noTour: "Votre visite commence ici",
    noTourText:
      "Ajoutez un panorama équirectangulaire 2:1 ou configurez une visite intégrée autorisée pour activer le lecteur. Cette zone est un emplacement de démonstration — aucune photo ordinaire n’est présentée comme une visite 360°.",
    tourSetting: "Configuration dans src/siteConfig.js",
    servicesAll: "Nos expertises",
    sectorTitle: "Votre secteur, vos enjeux",
    blog: "Conseils & idées",
    project: "Réalisation",
    contactPage: "Parlons de votre projet",
    contactIntro:
      "Quelques informations suffisent pour commencer. Nous reviendrons vers vous après réception de votre demande.",
    legal: "Informations légales",
    privacy: "Confidentialité",
    faqA: "Nous cadrons les contenus et les accès ensemble au démarrage. Vous pouvez fournir vos éléments existants ; nous indiquons ce qui manque et les formats nécessaires.\n\nLes étapes sont la découverte, le cadrage, la conception, la production, la mise en ligne puis l’amélioration selon les besoins. Le calendrier est défini dans la proposition, sans délai standard annoncé.",
    faqQ: [
      "Quels contenus dois-je préparer ?",
      "Quelles sont les étapes du projet ?",
      "Qui héberge mon site ou ma visite ?",
      "Proposez-vous une maintenance ?",
      "Comment obtenir un devis ?",
    ],
    questions: [
      "Les contenus nécessaires dépendent du projet. Nous faisons le point sur vos textes, images, accès et éventuels éléments de marque au démarrage.",
      "Après un premier échange, nous clarifions le besoin, définissons le périmètre, puis concevons, produisons et mettons en ligne. Les étapes sont précisées dans la proposition.",
      "L’hébergement est choisi selon vos outils et le projet. Les éventuels frais récurrents sont précisés séparément.",
      "Oui, une maintenance peut être proposée selon les besoins. Elle est distincte de la réalisation ponctuelle.",
      "Décrivez votre besoin dans le formulaire. La demande est en mode démonstration tant qu’aucun service d’envoi n’est connecté.",
    ],
    quoteSteps: [
      "Votre activité",
      "Vos besoins",
      "Quelques détails",
      "Vos coordonnées",
    ],
    next: "Continuer",
    back: "Retour",
    send: "Envoyer ma demande",
    demoForm: "Mode démonstration",
    demoFormText:
      "Aucun service de réception n’est connecté. Vos informations ne sont ni envoyées ni enregistrées.",
    formError:
      "Une erreur est survenue. Vérifiez votre connexion et réessayez.",
    formSuccess: "Votre demande a bien été reçue. Merci !",
    sectorField: "Secteur d’activité",
    city: "Ville",
    servicesField: "Services recherchés",
    details: "Détails du projet",
    name: "Nom",
    email: "E-mail",
    phone: "Téléphone (facultatif)",
    company: "Entreprise (facultatif)",
    message: "Parlez-nous de votre projet",
    consent:
      "J’accepte que mes informations soient utilisées pour répondre à ma demande.",
    marketing: "Je souhaite recevoir des conseils et actualités (facultatif).",
    noneYet: "Je ne sais pas encore",
    siteType: "Type de site",
    languages: "Langues souhaitées",
    features: "Fonctionnalités importantes",
    existingSite: "Avez-vous déjà un site ?",
    placeType: "Type de lieu",
    area: "Surface approximative",
    spaces: "Nombre d’espaces",
    objective: "Objectif principal",
    channels: "Canaux envisagés",
    budget: "Budget média indicatif",
    catalogue: "Catalogue existant ?",
    products: "Nombre approximatif de produits",
    yes: "Oui",
    no: "Non",
    select: "Sélectionner",
    thankyou: "Merci !",
    required: "Veuillez remplir les champs obligatoires.",
    faqSub: "Des réponses directes pour avancer sereinement.",
    meta: "Prix sur devis",
    view: "Découvrir",
    updated: "Informations à compléter",
    articleRead: "Lecture",
    moreArticle: "Continuer la lecture",
    sectorCTA: "Développons une expérience adaptée à votre activité.",
    plan: "Recevoir une proposition",
    special: "Un projet différent ?",
    specialText:
      "Associons les trois piliers dans un accompagnement conçu autour de vos objectifs.",
    options: "Options possibles",
    recurring: "Coûts récurrents éventuels",
    allServices: "Voir tous les services",
  },
  ar: {
    nav: ["الخدمات", "حلول القطاعات", "الأعمال", "الوكالة", "المقالات"],
    cta: "تحدث عن مشروعك",
    home: "الرئيسية",
    eyebrow: "وكالة تواصل وتصميم · المغرب",
    hero: "استراتيجية وتواصل وتصميم لعلامتك التجارية.",
    sub: "نرافق الشركات في المغرب في استراتيجية العلامة والهوية البصرية وإنتاج المحتوى والتجارب الرقمية.",
    explore: "اكتشف المواقع",
    quote: "اطلب عرض سعر",
    scroll: "مرر لاكتشاف المزيد",
    intro: "حضور يدفع نشاطك إلى الأمام",
    introText: "ثلاث خبرات تعمل معاً، لتجعل كل نقطة تواصل بداية لخطوة جديدة.",
    pillars: ["الانغماس", "الحضور", "الاستقطاب"],
    pillarText: [
      "اكتشف مساحاتك حتى عن بُعد.",
      "امنح نشاطك موقعاً يليق به.",
      "تواصل مع الأشخاص المناسبين بمنهجية.",
    ],
    services: "اكتشف خدماتنا",
    signature: "الجولة الافتراضية في خدمة التجربة الواقعية.",
    signatureText:
      "يسهل فهم المكان حين نتمكن من تخيله. الجولة المصممة بعناية لا تعرض الغرف فحسب، بل ترشد إلى الخطوة التالية.",
    stepNames: ["اكتشاف المكان", "فهم العرض", "تعزيز الثقة", "اتخاذ الإجراء"],
    sectors: "حلول تنطلق من طبيعة نشاطك",
    sectorsText: "لكل قطاع تحدياته. نبدأ من احتياجاتك.",
    work: "مشاريع نبتكرها معاً",
    demo: "مشروع تجريبي",
    portfolioItem: "من ملف الأعمال",
    workText:
      "مختارات من ملف الأعمال المقدم. لا نضيف نتائج أو سياقاً للعملاء دون تحقق.",
    galleryTitle: "نماذج من ملف الأعمال",
    portfolioPdf: "ملف الأعمال الكامل",
    agencyPdf: "التعريف بالوكالة",
    downloadPdf: "تحميل ملف PDF",
    galleryInfo: "تُعرض الصور كما وردت في الملفات المقدمة.",

    offers: "إطار أولي مرن",
    offersText: "يتكيف كل عرض مع أهداف شركتك ومواردها وسياقها.",
    from: "بعد حوار أولي",
    price: "حسب الطلب",
    more: "اكتشف العروض",
    faq: "أسئلة شائعة",
    final: "ما المشروع الذي ترغب في تطويره؟",
    finalText:
      "لنتحدث عن أهدافك أو مساحتك أو حضورك الرقمي. الحوار الأول يوضح احتياجاتك.",
    contact: "تحدث عن مشروعك",
    about: "وكالة للتواصل والتصميم.",
    aboutText:
      "نجمع الاستراتيجية والهوية البصرية والمحتوى والتجارب الرقمية لنمنح علامتك تعبيراً واضحاً.",
    read: "اقرأ المقال",
    all: "اكتشف الكل",
    allProjects: "كل الأعمال",
    allArticles: "كل المقالات",
    footer: "تواصل أكثر وضوحاً وتجارب تبقى في الذاكرة.",
    contactLabel: "تواصل",
    discover: "اكتشف",
    demoTour: "معاينة الجولة",
    noTour: "رحلتك تبدأ من هنا",
    noTourText:
      "أضف صورة بانورامية 2:1 أو أعد إعداد جولة خارجية موثوقة لتفعيل المشغل. هذه مساحة تجريبية، وليست صورة عادية معروضة كجولة 360°.",
    tourSetting: "الإعداد في src/siteConfig.js",
    servicesAll: "خدماتنا",
    sectorTitle: "قطاعك واحتياجاتك",
    blog: "أفكار ونصائح",
    project: "مشروع",
    contactPage: "لنتحدث عن مشروعك",
    contactIntro: "بعض المعلومات تكفي للبدء. سنتواصل معك بعد استلام طلبك.",
    legal: "معلومات قانونية",
    privacy: "الخصوصية",
    faqA: "نحدد المحتوى والصلاحيات معاً في البداية. يمكنك تقديم المواد المتوفرة لديك، وسنوضح النواقص والصيغ اللازمة.\n\nنبدأ بفهم الاحتياج وتحديد النطاق ثم التصميم والإنتاج والإطلاق والتحسين حسب الحاجة. يحدد الجدول في العرض دون وعد بمدة ثابتة.",
    faqQ: [
      "ما المحتوى الذي ينبغي إعداده؟",
      "ما مراحل المشروع؟",
      "أين تتم استضافة الموقع أو الجولة؟",
      "هل تقدمون الصيانة؟",
      "كيف أطلب عرض سعر؟",
    ],
    questions: [
      "يعتمد المحتوى المطلوب على المشروع. نراجع النصوص والصور والصلاحيات وعناصر الهوية في البداية.",
      "بعد الحوار الأول نوضح الاحتياج ونحدد النطاق ثم نصمم وننتج ونطلق. توضح المراحل في العرض.",
      "تحدد الاستضافة وفق أدواتك والمشروع. نوضح الرسوم المتكررة بشكل منفصل.",
      "نعم، يمكن تقديم صيانة حسب الحاجة وهي منفصلة عن التنفيذ الأولي.",
      "اكتب احتياجك في النموذج. الطلب تجريبي ما لم يتم ربط خدمة إرسال.",
    ],
    quoteSteps: ["نشاطك", "احتياجاتك", "تفاصيل بسيطة", "بيانات التواصل"],
    next: "متابعة",
    back: "رجوع",
    send: "إرسال الطلب",
    demoForm: "وضع تجريبي",
    demoFormText: "لم يتم ربط خدمة استقبال. لن ترسل المعلومات أو تحفظ.",
    formError: "حدث خطأ. تحقق من الاتصال وحاول مجدداً.",
    formSuccess: "تم استلام طلبك بنجاح. شكراً لك!",
    sectorField: "مجال النشاط",
    city: "المدينة",
    servicesField: "الخدمات المطلوبة",
    details: "تفاصيل المشروع",
    name: "الاسم",
    email: "البريد الإلكتروني",
    phone: "الهاتف (اختياري)",
    company: "الشركة (اختياري)",
    message: "أخبرنا عن مشروعك",
    consent: "أوافق على استخدام بياناتي للرد على طلبي.",
    marketing: "أرغب في تلقي نصائح وأخبار (اختياري).",
    noneYet: "لا أعرف بعد",
    siteType: "نوع الموقع",
    languages: "اللغات المطلوبة",
    features: "الخصائص المهمة",
    existingSite: "هل لديك موقع حالياً؟",
    placeType: "نوع المكان",
    area: "المساحة التقريبية",
    spaces: "عدد المساحات",
    objective: "الهدف الرئيسي",
    channels: "القنوات المقترحة",
    budget: "ميزانية الإعلانات التقديرية",
    catalogue: "هل لديك كتالوج؟",
    products: "عدد المنتجات التقريبي",
    yes: "نعم",
    no: "لا",
    select: "اختر",
    thankyou: "شكراً!",
    required: "يرجى إكمال الحقول المطلوبة.",
    faqSub: "إجابات واضحة تساعدك على البدء بثقة.",
    meta: "السعر حسب الطلب",
    view: "اكتشف",
    updated: "معلومات قيد الإضافة",
    articleRead: "قراءة",
    moreArticle: "تابع القراءة",
    sectorCTA: "لنطور تجربة تناسب نشاطك.",
    plan: "اطلب عرضاً",
    special: "هل لديك مشروع مختلف؟",
    specialText: "نجمع الخبرات الثلاث ضمن مواكبة مصممة لأهدافك.",
    options: "خيارات إضافية",
    recurring: "تكاليف متكررة محتملة",
    allServices: "كل الخدمات",
  },
};
const tr = (lang, v) => (Array.isArray(v) ? v[lang === "ar" ? 1 : 0] : v);
const arText = {
  "Hôtels & riads": "الفنادق والرياض",
  "Restaurants & lieux": "المطاعم والفضاءات",
  Immobilier: "العقارات",
  Formation: "التعليم والتدريب",
  "Showrooms & services": "صالات العرض والخدمات",
  "Hôtels, riads et maisons d’hôtes": "فنادق ورياض وبيوت ضيافة",
  "Restaurants, cafés et lieux événementiels": "مطاعم ومقاهٍ وفضاءات للفعاليات",
  "Agences et promoteurs": "وكالات عقارية ومطورون",
  "Écoles, universités et centres de formation": "مدارس وجامعات ومراكز تدريب",
  "Commerces et entreprises de services": "متاجر وشركات خدمات",
  "Présentez les chambres, les espaces communs et l’atmosphère avant la réservation.":
    "اعرض الغرف والمساحات المشتركة والأجواء قبل الحجز.",
  "Faites découvrir vos espaces, votre carte et les occasions d’y venir.":
    "عرّف الزوار على المكان والقائمة والفعاليات.",
  "Aidez les acheteurs à explorer les biens et à organiser une visite.":
    "ساعد المشترين على استكشاف العقارات وتنظيم زيارة.",
  "Rendez les campus et les parcours d’apprentissage plus accessibles.":
    "اجعل الحرم التعليمي ومسارات التعلم أكثر وضوحاً.",
  "Mettez en scène vos produits, vos équipes et vos espaces d’accueil.":
    "أبرز منتجاتك وفريقك ومساحات استقبال العملاء.",
  Hôtellerie: "الضيافة",
  "Maison Patio — expérience d’accueil": "دار الباحة — تجربة ضيافة",
  "Projet de démonstration": "مشروع تجريبي",
  "Parcours de contact": "مسار التواصل",
  "Direction visuelle": "التوجه البصري",
  Présence: "الحضور",
  Immersion: "الانغماس",
  Acquisition: "الاستقطاب",
  "Un socle digital clair pour présenter votre activité et faciliter la prise de contact.":
    "أساس رقمي واضح لعرض نشاطك وتسهيل التواصل.",
  "Une visite engageante qui aide vos clients à se projeter dans votre lieu.":
    "جولة تفاعلية تساعد عملاءك على تخيل المكان.",
  "Des parcours et campagnes conçus pour créer des opportunités mesurables.":
    "مسارات وحملات مصممة لبناء فرص قابلة للقياس.",
  "Site vitrine adapté au mobile": "موقع تعريفي متوافق مع الهاتف",
  "Mise en valeur de votre activité": "إبراز نشاطك",
  "Formulaire de contact et bases SEO": "نموذج تواصل وأساسيات الظهور في البحث",
  "Production ou intégration 360°": "إنتاج أو دمج محتوى 360°",
  "Mise en ligne et points interactifs": "النشر ونقاط تفاعلية",
  "Lien de partage et QR code": "رابط مشاركة ورمز QR",
  "Landing page et suivi des contacts": "صفحة هبوط ومتابعة جهات التواصل",
  "Stratégie et gestion de campagnes": "استراتيجية وإدارة الحملات",
  "Optimisation selon les données": "تحسين بناءً على البيانات",
  "Maintenance et hébergement selon le projet":
    "الصيانة والاستضافة وفق المشروع",
  "Hébergement de visite éventuellement récurrent":
    "استضافة الجولة بتكلفة متكررة محتملة",
  "Gestion publicitaire et création de contenu selon le rythme retenu":
    "إدارة الإعلانات وإنشاء المحتوى وفق النطاق",
  "Identité visuelle, contenus, multilingue": "هوية بصرية ومحتوى وتعدد لغات",
  "Photographie, vidéo, scènes supplémentaires":
    "تصوير فوتوغرافي وفيديو ومشاهد إضافية",
  "Création de contenus, automatisations": "إنشاء محتوى وأتمتة",
  "La visite virtuelle au service de l’expérience hôtelière":
    "الجولة الافتراضية في خدمة تجربة الضيافة",
  "Comment une visite 360° peut aider un voyageur à se projeter et compléter les informations utiles à sa réservation.":
    "كيف تساعد جولة 360° الزائر على تصور المكان واستكمال المعلومات اللازمة للحجز.",
  "Un site web utile commence par les bonnes questions":
    "يبدأ الموقع المفيد بالأسئلة المناسبة",
  "Parcours, contenus, appels à l’action : les bases pour construire un site qui sert réellement votre activité.":
    "المسارات والمحتوى والدعوات إلى الإجراء: أسس إنشاء موقع يخدم نشاطك فعلاً.",
  "Que signifie vraiment un prospect qualifié ?":
    "ماذا يعني العميل المحتمل المؤهل؟",
  "Définir des critères partagés aide à mieux traiter les demandes et à améliorer le parcours commercial.":
    "يساعد تحديد معايير مشتركة على معالجة الطلبات وتحسين المسار التجاري.",
  Notoriété: "التعريف بالعلامة",
  "Demandes de devis": "طلبات عروض الأسعار",
  Réservations: "الحجوزات",
  Ventes: "المبيعات",
  "À définir": "يحدد لاحقاً",
  "Moins de 3 000 MAD / mois": "أقل من 3,000 درهم شهرياً",
  "3 000–10 000 MAD / mois": "3,000–10,000 درهم شهرياً",
  "Plus de 10 000 MAD / mois": "أكثر من 10,000 درهم شهرياً",
  "Hôtel / riad": "فندق / رياض",
  Restaurant: "مطعم",
  "Bien immobilier": "عقار",
  "Établissement de formation": "مؤسسة تعليمية",
  "Showroom / autre": "قاعة عرض / أخرى",
  "Moins de 100 m²": "أقل من 100 م²",
  "100–500 m²": "100–500 م²",
  "Plus de 500 m²": "أكثر من 500 م²",
  "1–3": "1–3",
  "4–8": "4–8",
  "9 ou plus": "9 أو أكثر",
  "Site vitrine": "موقع تعريفي",
  "Site institutionnel": "موقع مؤسساتي",
  "Landing page": "صفحة هبوط",
  Catalogue: "كتالوج",
  "E-commerce": "متجر إلكتروني",
  Français: "الفرنسية",
  Arabe: "العربية",
  "Français et arabe": "الفرنسية والعربية",
  Autre: "أخرى",
  Formulaire: "نموذج",
  Réservation: "حجز",
  "Paiement en ligne": "الدفع عبر الإنترنت",
  "Espace membre": "مساحة أعضاء",
  Meta: "ميتا",
  Google: "غوغل",
  LinkedIn: "لينكدإن",
  "21–100": "21–100",
  "101–500": "101–500",
  "Plus de 500": "أكثر من 500",
  Conseils: "نصائح",
  Décryptage: "شرح",
  "Guide pratique": "دليل عملي",
  Lecture: "قراءة",
  "Communication visuelle": "التواصل البصري",
  "Graphisme & identité": "التصميم الجرافيكي والهوية",
  "Design digital": "التصميم الرقمي",
  "UX/UI design": "تصميم تجربة المستخدم والواجهة",
  "Application mobile": "تطبيق للهاتف",
  "Maquettes d’interface": "نماذج الواجهات",
  "Portfolio transmis": "ملف الأعمال المقدم",
  "Identité visuelle": "الهوية البصرية",
  "Supports imprimés": "المطبوعات",
  "Créations digitales": "التصاميم الرقمية",
  "Hôtellerie & tourisme": "الضيافة والسياحة",
  "Restaurant & événementiel": "المطاعم والفعاليات",
  "Éducation & formation": "التعليم والتدريب",
  "Commerce & showroom": "التجارة وصالات العرض",
  "Services aux entreprises": "خدمات الشركات",
  Éducation: "التعليم",
  "Parcours de contact": "مسار التواصل",
  "Direction visuelle": "التوجه البصري",
  "Visite virtuelle (concept)": "جولة افتراضية (تصور)",
  "Photographie d’illustration": "تصوير توضيحي",
  "Contenus d’illustration": "محتوى توضيحي",
  "Parcours de découverte": "مسار استكشاف",
  "Contenus web": "محتوى الويب",
};
const tx = (lang, v) =>
  Array.isArray(v)
    ? v[lang === "ar" ? 1 : 0]
    : lang === "ar"
      ? arText[v] || v
      : v;
const safeTourUrl = (value) => {
  if (typeof value !== "string") return "";
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try {
    const u = new URL(value);
    const runtimeUrl =
      typeof window !== "undefined"
        ? window.__THREEPOINTS_SUPABASE__?.url || ""
        : import.meta.env?.VITE_SUPABASE_URL || "";
    let storageHost = "";
    try {
      storageHost = new URL(runtimeUrl).hostname;
    } catch {}
    return u.protocol === "https:" &&
      (siteConfig.allowedTourHosts.includes(u.hostname) ||
        u.hostname === storageHost)
      ? u.href
      : "";
  } catch {
    return "";
  }
};
const safeHotspotLink = (value) => {
  if (typeof value !== "string") return "";
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try {
    const u = new URL(value);
    return u.protocol === "https:" ? u.href : "";
  } catch {
    return "";
  }
};
let activeLang = "fr";
const cleanPath = (p) => p.replace(/^\/ar(?=\/|$)/, "") || "/";
const localizedPath = (to, language = activeLang) => {
  const [path, query = ""] = to.split("?");
  const base = cleanPath(path);
  const route = language === "ar" ? `/ar${base === "/" ? "/" : base}` : base;
  return route + (query ? "?" + query : "");
};
const emitEvent = (name) => {
  if (typeof window !== "undefined")
    window.dispatchEvent(new CustomEvent("tp:event", { detail: { name } }));
};
const navigate = (to) => {
  const target = localizedPath(to);
  history.pushState({}, "", target);
  window.dispatchEvent(new Event("popstate"));
  window.scrollTo({ top: 0, behavior: "smooth" });
};
function Link({ to, children, className = "", onClick, ...rest }) {
  return (
    <a
      href={localizedPath(to)}
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey) return;
        e.preventDefault();
        if (to.startsWith("/contact")) emitEvent("contact_click");
        onClick?.(e);
        navigate(to);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
export function App({ initialPath, initialLang }) {
  const initial =
    initialPath ||
    (typeof window !== "undefined" ? cleanPath(window.location.pathname) : "/");
  const detected =
    initialLang ||
    (typeof window !== "undefined"
      ? window.location.pathname.startsWith("/ar/") ||
        window.location.pathname === "/ar"
        ? "ar"
        : "fr"
      : "fr");
  activeLang = detected;
  const [lang, setLang] = useState(detected),
    [path, setPath] = useState(cleanPath(initial)),
    [menu, setMenu] = useState(false),
    [drop, setDrop] = useState("");
  const t = T[lang];
  useEffect(() => {
    const f = () => {
      setPath(cleanPath(location.pathname));
      const l =
        location.pathname.startsWith("/ar/") || location.pathname === "/ar"
          ? "ar"
          : "fr";
      activeLang = l;
      setLang(l);
      setMenu(false);
      setDrop("");
    };
    addEventListener("popstate", f);
    return () => removeEventListener("popstate", f);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    const service = services.find((x) => x.slug === path.split("/").pop()),
      sector = sectors.find((x) => x[3] === path),
      article = articles.find((x) => x.slug === path.split("/").pop()),
      project = projects.find((x) => x.slug === path.split("/").pop()),
      tour = staticTours.find((x) => x.slug === path.split("/").pop()),
      headline =
        path === "/"
          ? t.hero
          : path === "/visites"
            ? lang === "fr"
              ? "Visites virtuelles 360°"
              : "جولات افتراضية 360°"
            : tour
              ? tx(lang, tour.title)
              : path === "/services"
                ? t.servicesAll
                : service
                  ? tr(lang, service.title)
                  : sector
                    ? tx(lang, sector[0])
                    : article
                      ? tx(lang, article.title)
                      : path === "/offres"
                        ? t.more
                        : path === "/agence"
                          ? t.about
                          : path === "/realisations"
                            ? t.allProjects
                            : path.startsWith("/realisations/")
                              ? tx(lang, project?.title || projects[0].title)
                              : path === "/conseils"
                                ? t.blog
                                : path === "/contact"
                                  ? t.contactPage
                                  : path === "/confidentialite"
                                    ? t.privacy
                                    : path === "/mentions-legales"
                                      ? t.legal
                                      : t.home;
    document.title = `${siteConfig.agencyName} — ${headline}`;
    const description =
      path === "/"
        ? t.sub
        : tour
          ? tx(lang, tour.description)
          : path === "/visites"
            ? lang === "fr"
              ? "Découvrez quatre destinations de Kénitra. La disponibilité de Street View est annoncée uniquement après vérification."
              : "اكتشف أربع وجهات في القنيطرة. لا يُعلن عن توفر Street View إلا بعد التحقق."
            : service
              ? tr(lang, service.intro)
              : sector
                ? tx(lang, sector[2])
                : article
                  ? tx(lang, article.desc)
                  : path === "/offres"
                    ? t.offersText
                    : path === "/agence"
                      ? t.aboutText
                      : t.introText;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", description);
    document
      .querySelector('meta[property="og:title"]')
      ?.setAttribute("content", document.title);
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute("content", description);
  }, [lang, path]);
  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced || !("IntersectionObserver" in window)) return;
    let observer;
    let cancelled = false;
    import("gsap").then(({ gsap }) => {
      if (cancelled) return;
      const elements = gsap.utils.toArray(
        ".home-service-card, .sector-card, .method-step, .portfolio-card, .home-about-copy",
      );
      elements.forEach((element) => gsap.set(element, { autoAlpha: 0, y: 18 }));
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            observer.unobserve(entry.target);
            gsap.to(entry.target, {
              autoAlpha: 1,
              y: 0,
              duration: 0.5,
              ease: "power2.out",
            });
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -35px 0px" },
      );
      elements.forEach((element) => observer.observe(element));
    });
    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, [path]);
  const changeLang = () => {
    const n = lang === "fr" ? "ar" : "fr";
    activeLang = n;
    setLang(n);
    if (typeof window !== "undefined") {
      localStorage.setItem("tp-lang", n);
      history.replaceState(
        {},
        "",
        localizedPath(path, n) + (location.search || ""),
      );
    }
  };
  const serviceLinks = [
    ...services.map((s) => (
      <Link key={s.slug} to={"/services/" + s.slug}>
        {tr(lang, s.title)}
      </Link>
    )),
    <Link key="tour-catalog" to="/visites">
      {lang === "fr" ? "Visites 360°" : "جولات 360°"}
    </Link>,
  ];
  const navMenus = [
    [t.nav[0], serviceLinks],
    [
      t.nav[1],
      sectors.map((s) => (
        <Link key={s[3]} to={s[3]}>
          {s[0]}
        </Link>
      )),
    ],
    [t.nav[2], [<Link to="/realisations">{t.allProjects}</Link>]],
    [
      t.nav[3],
      [<Link to="/agence">{t.about}</Link>, <Link to="/offres">{t.more}</Link>],
    ],
    [t.nav[4], [<Link to="/conseils">{t.allArticles}</Link>]],
  ];
  if (path === "/admin")
    return (
      <React.Suspense
        fallback={
          <div className="tpa-loading">Chargement de l’espace admin…</div>
        }
      >
        <LazyTourAdminPage />
      </React.Suspense>
    );
  const embedMode =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("embed") === "1";
  if (embedMode && path.startsWith("/visites/"))
    return <TourPublicPage lang={lang} t={t} path={path} embed />;
  return (
    <>
      <a className="skip-link" href="#main-content">
        {lang === "fr" ? "Aller au contenu" : "انتقل إلى المحتوى"}
      </a>
      <div className="topline">
        <span>✳</span>{" "}
        {lang === "fr"
          ? "Pensé au Maroc. Conçu pour vous."
          : "صُمم في المغرب. من أجلك."}{" "}
        <span className="topline-right">
          {lang === "fr"
            ? "Digital · Image · Croissance"
            : "الرقمي · الصورة · النمو"}
        </span>
      </div>
      <header className="header">
        <Link
          to="/"
          className="brand"
          aria-label={`${siteConfig.agencyName} accueil`}
        >
          <span className="brand-mark">
            <i />
            <i />
            <i />
          </span>
          <span className="brand-text">
            <b>{siteConfig.agencyName.split(" ")[0].toLowerCase()}</b>
            <small>
              {siteConfig.agencyName
                .split(" ")
                .slice(1)
                .join(" ")
                .toUpperCase()}
            </small>
          </span>
        </Link>
        <nav className={"nav " + (menu ? "nav-open" : "")}>
          {navMenus.map(([name, items], i) => (
            <div
              key={name}
              className="nav-group"
              onMouseEnter={() => setDrop(name)}
              onMouseLeave={() => setDrop("")}
            >
              <button
                className="nav-trigger"
                aria-expanded={drop === name}
                onClick={() => setDrop(drop === name ? "" : name)}
              >
                {name}
                <ChevronDown size={14} />
              </button>
              {drop === name && <div className="dropdown">{items}</div>}
            </div>
          ))}
          <Link to="/contact" className="mobile-cta">
            {t.cta}
            <ArrowUpRight size={16} />
          </Link>
        </nav>
        <div className="header-actions">
          <button className="lang-btn" onClick={changeLang}>
            <Globe size={16} />
            {lang === "fr" ? "العربية" : "FR"}
          </button>
          <Link to="/contact" className="button button-dark header-cta">
            {t.cta}
            <ArrowUpRight size={16} />
          </Link>
          <button
            className="menu-toggle"
            aria-label={lang === "fr" ? "Menu" : "القائمة"}
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <MenuIcon />}
          </button>
        </div>
      </header>
      <main id="main-content" key={path}>
        {path === "/" ? (
          <Home lang={lang} t={t} />
        ) : path === "/visites" ? (
          <ToursIndexPage lang={lang} t={t} />
        ) : path.startsWith("/visites/") ? (
          <TourPublicPage lang={lang} t={t} path={path} />
        ) : path === "/services" ? (
          <ServicesPage lang={lang} t={t} />
        ) : path.startsWith("/services/") ? (
          <ServicePage
            lang={lang}
            t={t}
            service={services.find((s) => s.slug === path.split("/")[2])}
          />
        ) : path === "/visites-virtuelles-360" ||
          path === "/services/visites-virtuelles-360" ? (
          <ServicePage lang={lang} t={t} service={services[0]} />
        ) : path === "/realisations" ? (
          <ProjectsPage lang={lang} t={t} />
        ) : path.startsWith("/realisations/") ? (
          <ProjectPage lang={lang} t={t} path={path} />
        ) : path.startsWith("/solutions") ? (
          <SectorPage lang={lang} t={t} path={path} />
        ) : path === "/offres" ? (
          <OffersPage lang={lang} t={t} />
        ) : path === "/agence" ? (
          <AboutPage lang={lang} t={t} />
        ) : path === "/conseils" ? (
          <BlogPage lang={lang} t={t} />
        ) : path.startsWith("/conseils/") ? (
          <ArticlePage lang={lang} t={t} path={path} />
        ) : path === "/contact" ? (
          <ContactPage lang={lang} t={t} />
        ) : path === "/confidentialite" || path === "/mentions-legales" ? (
          <LegalPage
            lang={lang}
            t={t}
            privacy={path.includes("confidentialite")}
          />
        ) : (
          <NotFound t={t} />
        )}
      </main>
      <Footer lang={lang} t={t} />
    </>
  );
}
function ThreePointScene() {
  const canvasRef = useRef(null);
  useEffect(() => {
    let renderer;
    let observer;
    let frame = 0;
    let disposed = false;
    let active = true;
    let renderFrame = () => {};
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const desktop = window.matchMedia("(min-width: 761px)").matches;
    if (reduced || !desktop) return;
    import("three").then((THREE) => {
      if (disposed || !canvasRef.current) return;
      try {
        const canvas = canvasRef.current;
        renderer = new THREE.WebGLRenderer({
          canvas,
          alpha: true,
          antialias: true,
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 30);
        camera.position.z = 6.4;
        const group = new THREE.Group();
        scene.add(group);
        const sphere = new THREE.SphereGeometry(0.67, 36, 28);
        const mats = [
          new THREE.MeshStandardMaterial({
            color: 0xf7f5f5,
            roughness: 0.27,
            metalness: 0.18,
          }),
          new THREE.MeshStandardMaterial({
            color: 0xe30613,
            roughness: 0.24,
            metalness: 0.22,
          }),
          new THREE.MeshStandardMaterial({
            color: 0xb9b7b8,
            roughness: 0.3,
            metalness: 0.2,
          }),
        ];
        [-1.35, 0, 1.35].forEach((x, index) => {
          const dot = new THREE.Mesh(sphere, mats[index]);
          dot.position.set(
            x,
            index === 1 ? 0.16 : -0.04,
            index === 1 ? 0.08 : -0.12,
          );
          group.add(dot);
        });
        scene.add(new THREE.AmbientLight(0xffffff, 1.7));
        const keyLight = new THREE.DirectionalLight(0xffffff, 2.1);
        keyLight.position.set(-3, 4, 5);
        scene.add(keyLight);
        const resize = () => {
          if (!canvas.parentElement) return;
          const { width, height } = canvas.getBoundingClientRect();
          if (!width || !height) return;
          renderer.setSize(width, height, false);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          if (reduced) renderer.render(scene, camera);
        };
        const draw = () => {
          if (disposed) return;
          if (active && !reduced) {
            group.rotation.y += 0.0025;
            group.rotation.x = Math.sin(performance.now() * 0.00035) * 0.035;
            renderer.render(scene, camera);
          }
          frame = requestAnimationFrame(draw);
        };
        renderFrame = draw;
        resize();
        window.addEventListener("resize", resize);
        observer = new IntersectionObserver(([entry]) => {
          active = entry.isIntersecting;
          if (active && reduced) renderer.render(scene, camera);
        });
        observer.observe(canvas);
        if (reduced) renderer.render(scene, camera);
        else frame = requestAnimationFrame(draw);
        renderFrame = () => {
          cancelAnimationFrame(frame);
          window.removeEventListener("resize", resize);
          observer?.disconnect();
          renderer?.dispose();
          sphere.dispose();
          mats.forEach((mat) => mat.dispose());
        };
      } catch {
        renderer?.dispose();
      }
    });
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer?.disconnect();
      renderFrame();
      renderer?.dispose();
    };
  }, []);
  return (
    <canvas className="hero-three-canvas" ref={canvasRef} aria-hidden="true" />
  );
}
function GraphicPortfolioCarousel({ project, lang, t }) {
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isArabic = lang === "ar";
  const slides = project.gallery || [];

  const goToSlide = (index) => {
    const track = trackRef.current;
    if (!track || !slides.length) return;
    const nextIndex = (index + slides.length) % slides.length;
    const slide = track.querySelector(`[data-slide-index="${nextIndex}"]`);
    if (!slide) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    slide.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "nearest",
      inline: "start",
    });
    setActiveIndex(nextIndex);
  };

  const syncActiveSlide = (event) => {
    const track = event.currentTarget;
    const edge = isArabic
      ? track.getBoundingClientRect().right
      : track.getBoundingClientRect().left;
    let closestIndex = 0;
    let closestDistance = Infinity;
    Array.from(track.querySelectorAll("[data-slide-index]")).forEach(
      (slide, index) => {
        const rect = slide.getBoundingClientRect();
        const slideEdge = isArabic ? rect.right : rect.left;
        const distance = Math.abs(slideEdge - edge);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      },
    );
    setActiveIndex(closestIndex);
  };

  return (
    <section
      className="graphic-carousel"
      dir={isArabic ? "rtl" : "ltr"}
      aria-labelledby="graphic-carousel-title"
      aria-roledescription={isArabic ? "عارض شرائح" : "carrousel"}
    >
      <header className="graphic-carousel-heading">
        <div>
          <span className="graphic-carousel-kicker">{t.galleryTitle}</span>
          <h3 id="graphic-carousel-title">{tx(lang, project.title)}</h3>
        </div>
        <div className="graphic-carousel-controls">
          <span className="graphic-carousel-count" aria-live="polite">
            {String(activeIndex + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
          </span>
          <button
            type="button"
            onClick={() => goToSlide(activeIndex - 1)}
            aria-label={isArabic ? "الصورة السابقة" : "Visuel précédent"}
          >
            <ArrowLeft size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => goToSlide(activeIndex + 1)}
            aria-label={isArabic ? "الصورة التالية" : "Visuel suivant"}
          >
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      </header>
      <div
        className="graphic-carousel-track"
        ref={trackRef}
        onScroll={syncActiveSlide}
        role="group"
        aria-label={isArabic ? "أعمال التصميم" : "Travaux graphiques"}
      >
        {slides.map((slide, index) => (
          <figure
            className="graphic-carousel-slide"
            data-slide-index={index}
            key={slide.file}
            role="group"
            aria-roledescription={isArabic ? "شريحة" : "diapositive"}
            aria-label={`${index + 1} / ${slides.length}`}
          >
            <Link to={`/realisations/${project.slug}`}>
              <img
                src={`/images/portfolio/${slide.file}`}
                alt=""
                loading="lazy"
                decoding="async"
              />
              <figcaption>{tx(lang, slide.alt)}</figcaption>
            </Link>
          </figure>
        ))}
      </div>
      <div className="graphic-carousel-progress" aria-hidden="true">
        <span style={{ width: `${((activeIndex + 1) / slides.length) * 100}%` }} />
      </div>
      <div className="graphic-carousel-footer">
        <p>{t.galleryInfo}</p>
        <Link to={`/realisations/${project.slug}`} className="text-link">
          {isArabic ? "اكتشف أعمال التصميم" : "Voir la sélection graphique"}
          <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

function Home({ lang, t }) {
  const [opened, setOpened] = useState(false);
  const [portfolioFilter, setPortfolioFilter] = useState("Tout");
  const homeServiceSlugs = [
    "creation-sites-web",
    "visites-virtuelles-360",
    "production-audiovisuelle",
    "marketing-digital",
    "identite-visuelle-branding",
    "seo-redaction",
  ];
  const homeServices = homeServiceSlugs
    .map((slug) => services.find((service) => service.slug === slug))
    .filter(Boolean);
  const graphicPortfolio = projects.find(
    (project) => project.slug === "selection-portfolio-graphique",
  );
  const brandWords = siteConfig.agencyName.trim().split(/\s+/);
  const brandPrimary =
    brandWords.length > 2 ? brandWords.slice(0, -1).join("") : brandWords[0];
  const brandSecondary = brandWords.length > 1 ? brandWords.at(-1) : "";
  return (
    <>
      <section className="hero">
        <div className="hero-image" />
        <div className="hero-grain" />
        <ThreePointScene />
        <div className="hero-inner">
          <div className="hero-copy">
            <div className="eyebrow light">
              <span className="pulse" />
              {t.eyebrow}
            </div>
            <h1 className="hero-brand-title" dir="ltr">
              <span className="hero-brand-word">
                {brandPrimary.toUpperCase()}
              </span>
              {brandSecondary && (
                <span className="hero-brand-media">
                  {brandSecondary.toUpperCase()}
                </span>
              )}
            </h1>
            <p className="hero-tagline">
              {lang === "fr"
                ? "Stratégie. Communication. Design."
                : "استراتيجية. تواصل. تصميم."}
            </p>
            <p>{t.sub}</p>
            <div className="hero-actions">
              <Link to="/services" className="button button-mint">
                {lang === "fr" ? "Découvrir nos expertises" : "اكتشف خبراتنا"}
                <ArrowRight size={17} />
              </Link>
              <Link to="/contact" className="button button-glass">
                {t.quote}
                <ArrowUpRight size={17} />
              </Link>
            </div>
            <div className="hero-proof">
              <span className="mini-dots">
                <i />
                <i />
                <i />
              </span>
              {lang === "fr"
                ? "Immersion · Présence · Acquisition"
                : "الانغماس · الحضور · الاستقطاب"}
            </div>
          </div>
          <div className="hero-card">
            <div className="hero-card-tag">
              <span className="pulse" />{" "}
              {lang === "fr" ? "IMMERSION · 360°" : "تجربة غامرة · 360°"}
            </div>
            <p>
              {lang === "fr"
                ? "Entrez dans le lieu avant même d’y arriver."
                : "اكتشف المكان قبل الوصول إليه."}
            </p>
            <Link
              to="/services/visites-virtuelles-360"
              className="round-link"
              aria-label={t.explore}
            >
              <ArrowUpRight size={22} />
            </Link>
            <span className="hero-index">01 — 03</span>
          </div>
          <div className="hero-mini-strip">
            <span className="hero-mini-label">
              {lang === "fr" ? "PORTFOLIO" : "ملف الأعمال"}
            </span>
            <div className="hero-mini-list">
              {projects.slice(0, 4).map((project) => (
                <Link to={`/realisations/${project.slug}`} key={project.slug}>
                  <img src={project.cover} alt="" />
                  <span>{tx(lang, project.sector)}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="hero-360-mark" aria-hidden="true">
            360°<span>↻</span>
          </div>
          <div className="hero-vertical-rail" aria-hidden="true">
            <b>01</b>
            <span>02</span>
            <span>03</span>
            <i />
          </div>
        </div>
        <div className="hero-bottom">
          <span>{t.scroll}</span>
          <ArrowDown size={15} />
          <span className="hero-bottom-right">
            {lang === "fr"
              ? "PHOTO D’ILLUSTRATION · PAS DE VISITE 360° ACTIVE"
              : "صورة توضيحية · لا توجد جولة 360° فعّالة"}
          </span>
        </div>
      </section>
      <section className="service-showcase section">
        <div className="service-showcase-heading">
          <div>
            <div className="section-kicker">
              01 / {lang === "fr" ? "NOS SERVICES" : "خدماتنا"}
            </div>
            <h2>
              {lang === "fr"
                ? "Des idées de marque à leur présence digitale."
                : "من فكرة العلامة إلى حضورها الرقمي."}
            </h2>
          </div>
          <div className="service-showcase-summary">
            <p>
              {lang === "fr"
                ? "Stratégie, création et technologie au service de votre image de marque et de votre croissance."
                : "استراتيجية وإبداع وتقنية لخدمة علامتك التجارية ونمو أعمالك."}
              <span className="service-art-disclaimer">
                {lang === "fr"
                  ? "Visuels illustratifs — les écrans et chiffres montrés ne sont pas des résultats publiés."
                  : "صور توضيحية — الشاشات والأرقام المعروضة ليست نتائج منشورة."}
              </span>
            </p>
            <Link to="/services" className="text-link">
              {lang === "fr" ? "Tous nos services" : "كل خدماتنا"}
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
        <div className="home-service-grid">
          {homeServices.map((service, i) => {
            const serviceIcons = [
              Monitor,
              Compass,
              Camera,
              Target,
              ImageIcon,
              Globe,
            ];
            const Icon = serviceIcons[i];
            const serviceImages = [
              "/images/digital-studio.jpg",
              "/images/medina-interior.jpg",
              "/images/video-production.jpg",
              "/images/social-campaign.jpg",
              "/images/brand-kit.jpg",
              "/images/digital-studio.jpg",
            ];
            const image = serviceImages[i];
            return (
              <Link
                to={`/services/${service.slug}`}
                className={`home-service-card service-card-${i + 1} ${lang === "fr" ? "service-image-card" : ""}`}
                key={service.slug}
                aria-label={`${tr(lang, service.title)} — ${tr(lang, service.intro)}`}
              >
                {lang === "fr" ? (
                  <>
                    <img
                      className="service-card-cutout"
                      loading="lazy"
                      src={`/images/service-cards/${String(i + 1).padStart(2, "0")}-${["creation-sites-web", "visites-virtuelles-360", "production-audiovisuelle", "marketing-digital", "identite-visuelle-branding", "seo-strategie-digitale"][i]}.webp`}
                      alt=""
                    />
                    <div className="sr-only">
                      <h3>{tr(lang, service.title)}</h3>
                      <p>{tr(lang, service.intro)}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="home-service-top">
                      <span className="service-number">0{i + 1}</span>
                      <h3>{tr(lang, service.title)}</h3>
                    </div>
                    <div className="home-service-visual">
                      <img loading="lazy" src={image} alt="" />
                      <div className="service-visual-icon">
                        <Icon size={34} />
                      </div>
                      <span className="service-card-arrow" aria-hidden="true">
                        <ArrowRight size={17} />
                      </span>
                    </div>
                    <p>{tr(lang, service.intro)}</p>
                  </>
                )}
              </Link>
            );
          })}
        </div>
      </section>
      <section className="signature">
        <div className="signature-visual">
          <img
            loading="lazy"
            src="/images/medina-interior.jpg"
            alt={
              lang === "fr"
                ? "Intérieur d’hôtel marocain ouvert sur la mer, photographie d’illustration"
                : "داخل فندق مغربي يطل على البحر، صورة توضيحية"
            }
          />
          <div className="visual-label">
            <span className="live-dot" />
            {lang === "fr"
              ? "VISITE VIRTUELLE · APERÇU"
              : "جولة افتراضية · معاينة"}
          </div>
          <button
            className="visual-play"
            onClick={() => {
              if (!opened) emitEvent("tour_open");
              setOpened(!opened);
            }}
            aria-label={opened ? "Fermer l’aperçu" : t.explore}
          >
            {opened ? <X /> : <Play fill="currentColor" />}
          </button>
          <div className="visual-caption">
            {lang === "fr"
              ? "PHOTOGRAPHIE D’ILLUSTRATION · APERÇU IMMERSIF"
              : "صورة توضيحية · عرض غامر"}
          </div>
          {opened && (
            <div className="tour-toast">
              <TourReader lang={lang} t={t} />
            </div>
          )}
        </div>
        <div className="signature-content">
          <div className="eyebrow">02 / {t.pillars[0]}</div>
          <h2>{t.signature}</h2>
          <p>{t.signatureText}</p>
          <div className="journey">
            {t.stepNames.map((s, i) => (
              <div className="journey-step" key={s}>
                <span>0{i + 1}</span>
                <b>{s}</b>
                {i < 3 && <ArrowRight size={14} />}
              </div>
            ))}
          </div>
          <Link
            to="/services/visites-virtuelles-360"
            className="button button-dark"
          >
            {t.discover}
            <ArrowUpRight size={17} />
          </Link>
          <small className="note">
            {lang === "fr"
              ? "Photo d’illustration — pas une visite 360°."
              : "صورة توضيحية — ليست جولة 360°."}
          </small>
        </div>
      </section>
      <section className="section sector-section">
        <div className="section-kicker">03 / {t.nav[1]}</div>
        <div className="section-heading">
          <h2>{t.sectors}</h2>
          <p>{t.sectorsText}</p>
        </div>
        <div className="sector-grid">
          {sectors.map((s, i) => {
            const Icon = SECTOR_ICONS[i] || Building2;
            return (
              <Link to={s[3]} className="sector-card" key={s[0]}>
                <span className="sector-icon" aria-hidden="true">
                  <Icon size={23} strokeWidth={1.6} />
                </span>
                <span className="sector-count">0{i + 1}</span>
                <h3>{tx(lang, s[0])}</h3>
                <p>{tx(lang, s[2])}</p>
                <ArrowUpRight size={18} className="sector-arrow" />
              </Link>
            );
          })}
        </div>
      </section>
      <section className="work-section">
        <div className="work-heading">
          <div>
            <div className="eyebrow">04 / {t.nav[2]}</div>
            <h2>{lang === "fr" ? "Nos réalisations" : "أعمالنا"}</h2>
            <p>
              {lang === "fr"
                ? "Une sélection issue du portfolio transmis. Aucun résultat ni contexte client n’est ajouté sans vérification."
                : "مختارات من ملف الأعمال المقدم. لا نضيف نتائج أو سياقاً للعملاء دون تحقق."}
            </p>
          </div>
          <Link to="/realisations" className="text-link">
            {t.allProjects}
            <ArrowRight size={16} />
          </Link>
        </div>
        <div className="home-project-filters">
          {["Tout", ...new Set(projects.map((project) => project.sector))].map(
            (category) => (
              <button
                key={category}
                className={portfolioFilter === category ? "active" : ""}
                onClick={() => setPortfolioFilter(category)}
              >
                {category === "Tout"
                  ? lang === "fr"
                    ? "Tous"
                    : "الكل"
                  : tx(lang, category)}
              </button>
            ),
          )}
        </div>
        <div className="home-project-grid">
          {projects
            .filter(
              (project) =>
                portfolioFilter === "Tout" ||
                project.sector === portfolioFilter,
            )
            .map((project) => (
              <Link
                to={`/realisations/${project.slug}`}
                className="home-project-card"
                key={project.slug}
              >
                <div className="home-project-image">
                  <img loading="lazy" src={project.cover} alt="" />
                  <span
                    className={`demo-badge ${project.demo ? "" : "portfolio-badge"}`}
                  >
                    <span />
                    {project.demo ? t.demo : t.portfolioItem}
                  </span>
                  <span className="project-image-arrow">
                    <ArrowUpRight size={17} />
                  </span>
                </div>
                <div className="home-project-meta">
                  <span>
                    {tx(lang, project.sector)} ·{" "}
                    {project.demo
                      ? lang === "fr"
                        ? "Démo"
                        : "تجريبي"
                      : t.portfolioItem}
                  </span>
                  <h3>{tx(lang, project.title)}</h3>
                  <p>{tx(lang, project.services[0])}</p>
                </div>
              </Link>
            ))}
        </div>
        {graphicPortfolio?.gallery?.length > 0 && (
          <GraphicPortfolioCarousel
            project={graphicPortfolio}
            lang={lang}
            t={t}
          />
        )}
      </section>
      <section
        className="proof-strip"
        aria-label={lang === "fr" ? "Nos trois expertises" : "خبراتنا الثلاث"}
      >
        <div>
          <strong>360°</strong>
          <span>{lang === "fr" ? "Immersion" : "تجربة غامرة"}</span>
        </div>
        <div>
          <strong>WEB</strong>
          <span>{lang === "fr" ? "Présence digitale" : "حضور رقمي"}</span>
        </div>
        <div>
          <strong>ADS</strong>
          <span>{lang === "fr" ? "Acquisition" : "استقطاب"}</span>
        </div>
        <div>
          <strong>MA</strong>
          <span>
            {lang === "fr" ? "Entreprises au Maroc" : "شركات في المغرب"}
          </span>
        </div>
      </section>
      <section className="home-about">
        <div className="home-about-image">
          <img loading="lazy" src="/images/digital-studio.jpg" alt="" />
          <span>{siteConfig.agencyName}</span>
        </div>
        <div className="home-about-copy">
          <div className="eyebrow light">
            {lang === "fr" ? "À PROPOS DE NOUS" : "من نحن"}
          </div>
          <h2>
            {lang === "fr" ? (
              <>
                Trois points.
                <br />
                Une vision. Des idées sans limites.
              </>
            ) : (
              <>
                ثلاث نقاط.
                <br />
                رؤية وأفكار بلا حدود.
              </>
            )}
          </h2>
          <p>
            {lang === "fr"
              ? "Une agence de communication digitale qui relie créativité, technologie et impact pour donner vie à vos projets."
              : "وكالة تواصل رقمي تجمع الإبداع والتكنولوجيا والأثر لتمنح مشاريعك حضوراً حقيقياً."}
          </p>
          <Link to="/agence" className="button button-mint">
            {lang === "fr" ? "En savoir plus" : "اكتشف المزيد"}
            <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="home-about-values">
          <div>
            <b>01</b>
            <span>{lang === "fr" ? "Créativité" : "الإبداع"}</span>
          </div>
          <div>
            <b>02</b>
            <span>{lang === "fr" ? "Technologie" : "التكنولوجيا"}</span>
          </div>
          <div>
            <b>03</b>
            <span>{lang === "fr" ? "Impact" : "الأثر"}</span>
          </div>
        </div>
      </section>
      <section className="offer-strip">
        <div>
          <div className="eyebrow light">06 / {t.more}</div>
          <h2>{t.offers}</h2>
          <p>{t.offersText}</p>
        </div>
        <div className="offer-strip-right">
          <span>{t.price}</span>
          <Link to="/offres" className="button button-mint">
            {t.more}
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
      <section className="faq-section section">
        <div className="section-kicker">07 / FAQ</div>
        <div className="faq-layout">
          <div>
            <h2>{t.faq}</h2>
            <p>{t.faqSub}</p>
          </div>
          <Faq lang={lang} t={t} />
        </div>
      </section>
      <CTA t={t} />
    </>
  );
}
function TourShare({ lang }) {
  const [open, setOpen] = useState(false),
    [copied, setCopied] = useState(false),
    [url, setUrl] = useState(siteConfig.tour.shareUrl || "");
  useEffect(() => {
    if (!url && typeof window !== "undefined")
      setUrl(window.location.href.split("#")[0]);
  }, []);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };
  return (
    <div className="tour-share">
      <button onClick={() => setOpen(!open)} aria-expanded={open}>
        <Share2 size={15} />
        {lang === "fr" ? "Partager" : "مشاركة"}
      </button>
      {open && (
        <div className="share-popover">
          <b>{lang === "fr" ? "Partager cette visite" : "شارك هذه الجولة"}</b>
          {url && <QRCodeSVG value={url} size={128} level="M" />}
          <span>{lang === "fr" ? "Lien de visite" : "رابط الجولة"}</span>
          <input readOnly value={url} />
          <button className="share-copy" onClick={copy}>
            {copied ? <Check size={14} /> : <Copy size={14} />}{" "}
            {copied
              ? lang === "fr"
                ? "Copié"
                : "تم النسخ"
              : lang === "fr"
                ? "Copier le lien"
                : "نسخ الرابط"}
          </button>
        </div>
      )}
    </div>
  );
}
function TourReader({ lang, t, tourConfig: configuredTour, placeholderText }) {
  const config = configuredTour || siteConfig.tour || {};
  const isAllowed = () => {
    try {
      const u = new URL(config.iframeUrl);
      return (
        u.protocol === "https:" &&
        siteConfig.allowedTourHosts.includes(u.hostname)
      );
    } catch {
      return false;
    }
  };
  if (config.mode === "iframe" && isAllowed())
    return (
      <div className="tour-frame">
        <div className="tour-frame-share">
          <TourShare lang={lang} />
        </div>
        <iframe
          src={config.iframeUrl}
          title={
            lang === "fr" ? "Visite virtuelle intégrée" : "جولة افتراضية مدمجة"
          }
          loading="lazy"
          allow="fullscreen; gyroscope; accelerometer"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
        <Link to="/contact" className="tour-frame-cta button button-mint">
          {t.quote}
          <ArrowUpRight size={15} />
        </Link>
        <span>
          {lang === "fr"
            ? "Visite intégrée depuis un domaine autorisé"
            : "جولة مدمجة من نطاق موثوق"}
        </span>
      </div>
    );
  if (
    config.mode === "panorama" &&
    (config.scenes || []).some((scene) => safeTourUrl(scene.image))
  ) {
    return <PannellumReader config={config} lang={lang} t={t} />;
  }
  return (
    <div className="tour-placeholder">
      <Compass size={27} />
      <b>{t.noTour}</b>
      <p>{placeholderText || t.noTourText}</p>
      <small>
        {t.tourSetting} ·{" "}
        {lang === "fr"
          ? "Aucun panorama de démonstration fourni."
          : "لم تتم إضافة صورة بانورامية تجريبية."}
      </small>
      <Link to="/contact" className="text-link">
        {t.quote}
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}
function PannellumReader({ config, lang, t }) {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const reactId = useId().replaceAll(":", "");
  const [sceneIndex, setSceneIndex] = useState(0);
  const [hotspot, setHotspot] = useState(null);
  const [failed, setFailed] = useState(false);
  const scenes = (config.scenes || []).filter((scene) =>
    safeTourUrl(scene.image),
  );
  const sceneIds = scenes.map((_, index) => `scene-${reactId}-${index}`);

  useEffect(() => {
    let cancelled = false;
    let viewer;
    const initialize = async () => {
      try {
        await import("pannellum");
        if (cancelled || !containerRef.current || !window.libpannellum?.viewer)
          return;
        const configuredScenes = Object.fromEntries(
          scenes.map((scene, index) => [
            sceneIds[index],
            {
              title: tx(lang, scene.title) || `0${index + 1}`,
              type: "equirectangular",
              panorama: safeTourUrl(scene.image),
              autoLoad: true,
              hotSpots: (scene.hotspots || []).map((item, hotspotIndex) => {
                const targetIndex = scenes.findIndex(
                  (target) => target.id === item.targetSceneId,
                );
                const isSceneLink = item.type === "scene" && targetIndex >= 0;
                return {
                  id: `hotspot-${index}-${hotspotIndex}`,
                  pitch: Number.isFinite(Number(item.pitch))
                    ? Number(item.pitch)
                    : (50 - Number(item.y ?? 50)) * 1.8,
                  yaw: Number.isFinite(Number(item.yaw))
                    ? Number(item.yaw)
                    : (Number(item.x ?? 50) - 50) * 3.6,
                  type: isSceneLink ? "scene" : "info",
                  ...(isSceneLink ? { sceneId: sceneIds[targetIndex] } : {}),
                  text:
                    tx(lang, item.title) ||
                    (lang === "fr" ? "En savoir plus" : "اكتشف المزيد"),
                  ...(isSceneLink
                    ? {}
                    : {
                        clickHandlerFunc: (_element, args) =>
                          setHotspot(args.item),
                        clickHandlerArgs: { item },
                      }),
                };
              }),
            },
          ]),
        );
        viewer = window.libpannellum.viewer(containerRef.current.id, {
          default: {
            firstScene: sceneIds[0],
            sceneFadeDuration: 450,
            autoLoad: true,
            showFullscreenCtrl: true,
            showZoomCtrl: true,
          },
          scenes: configuredScenes,
        });
        viewerRef.current = viewer;
        viewer.on("scenechange", (id) => {
          const nextIndex = sceneIds.indexOf(id);
          if (nextIndex >= 0) setSceneIndex(nextIndex);
          setHotspot(null);
        });
        viewer.on("error", () => setFailed(true));
      } catch {
        if (!cancelled) setFailed(true);
      }
    };
    if (scenes.length) initialize();
    return () => {
      cancelled = true;
      viewer?.destroy?.();
      viewerRef.current = null;
    };
  }, [config, lang]);

  if (failed)
    return (
      <div className="tour-placeholder">
        <Compass size={27} />
        <b>{lang === "fr" ? "Lecteur indisponible" : "المشغل غير متاح"}</b>
        <p>{t.noTourText}</p>
      </div>
    );
  return (
    <div className="tour-player">
      <div className="tour-panorama-wrap">
        <div
          id={`pannellum-${reactId}`}
          ref={containerRef}
          className="pannellum-host"
          role="application"
          aria-label={
            lang === "fr"
              ? "Visite panoramique interactive"
              : "جولة بانورامية تفاعلية"
          }
        />
        <div className="tour-reader-top">
          <span>
            {lang === "fr"
              ? "VISITE 360° · PROJET CONFIGURÉ"
              : "جولة 360° · مشروع مُعد"}
          </span>
          <TourShare lang={lang} />
        </div>
        {hotspot && (
          <div className="hotspot-card">
            <button
              className="hotspot-close"
              onClick={() => setHotspot(null)}
              aria-label={lang === "fr" ? "Fermer" : "إغلاق"}
            >
              <X size={15} />
            </button>
            <b>{tx(lang, hotspot.title)}</b>
            {hotspot.text && <p>{tx(lang, hotspot.text)}</p>}
            {safeTourUrl(hotspot.image) && (
              <img loading="lazy" src={safeTourUrl(hotspot.image)} alt="" />
            )}
            {safeTourUrl(hotspot.video) && (
              <video controls src={safeTourUrl(hotspot.video)} />
            )}
            {safeHotspotLink(hotspot.link) &&
              (safeHotspotLink(hotspot.link).startsWith("/") ? (
                <Link
                  to={safeHotspotLink(hotspot.link)}
                  className="hotspot-action"
                >
                  {lang === "fr" ? "Découvrir ou réserver" : "اكتشف أو احجز"}
                  <ArrowRight size={13} />
                </Link>
              ) : (
                <a
                  href={safeHotspotLink(hotspot.link)}
                  target="_blank"
                  rel="noreferrer"
                >
                  {lang === "fr" ? "En savoir plus" : "اكتشف المزيد"}
                  <ExternalLink size={13} />
                </a>
              ))}
          </div>
        )}
      </div>
      <div className="tour-scenes">
        {scenes.map((scene, index) => (
          <button
            key={sceneIds[index]}
            className={index === sceneIndex ? "selected" : ""}
            onClick={() => {
              viewerRef.current?.loadScene(sceneIds[index]);
              setSceneIndex(index);
              setHotspot(null);
            }}
          >
            <img
              loading="lazy"
              src={safeTourUrl(scene.thumbnail) || safeTourUrl(scene.image)}
              alt=""
            />
            <span>{tx(lang, scene.title) || `0${index + 1}`}</span>
          </button>
        ))}
      </div>
      {safeTourUrl(config.planUrl) && (
        <div className="tour-plan-navigation">
          <div className="tour-plan-navigation-title">
            <span className="section-kicker">
              {lang === "fr" ? "PLAN INTERACTIF" : "مخطط تفاعلي"}
            </span>
            <b>{lang === "fr" ? "Choisir une pièce" : "اختر غرفة"}</b>
          </div>
          <div className="tour-plan-navigation-image">
            <img
              src={safeTourUrl(config.planUrl)}
              alt={lang === "fr" ? "Plan du lieu" : "مخطط المكان"}
            />
            {scenes.map(
              (scene, index) =>
                scene.planX != null && (
                  <button
                    type="button"
                    key={sceneIds[index]}
                    style={{ left: `${scene.planX}%`, top: `${scene.planY}%` }}
                    className={index === sceneIndex ? "active" : ""}
                    onClick={() => {
                      viewerRef.current?.loadScene(sceneIds[index]);
                      setSceneIndex(index);
                      setHotspot(null);
                    }}
                    aria-label={`${lang === "fr" ? "Afficher" : "اعرض"} ${tx(lang, scene.title)}`}
                  >
                    {index + 1}
                  </button>
                ),
            )}
          </div>
        </div>
      )}
      <div className="tour-bottom">
        <span>
          {lang === "fr"
            ? "Faites glisser pour explorer · Zoom et plein écran disponibles"
            : "اسحب لاستكشاف المكان · التكبير وملء الشاشة متاحان"}
        </span>
        <Link to="/contact" className="text-link">
          {t.quote}
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

function PageHero({ kicker, title, desc, t, actions = true, className = "" }) {
  return (
    <section className={`page-hero ${className}`}>
      <div className="page-hero-text">
        <div className="eyebrow">
          <span className="pulse" />
          {kicker}
        </div>
        <h1>{title}</h1>
        {desc && <p>{desc}</p>}
        {actions && (
          <Link to="/contact" className="button button-dark">
            {t.cta}
            <ArrowUpRight size={17} />
          </Link>
        )}
      </div>
      <div
        className={`page-hero-art ${className === "page-hero-360" ? "page-hero-art-360" : "page-hero-art-brand"}`}
        aria-hidden="true"
      >
        {className === "page-hero-360" ? (
          <>
            <div className="art-orbit orbit-a" />
            <div className="art-orbit orbit-b" />
            <span className="art-dots">
              <i />
              <i />
              <i />
            </span>
            <span className="art-number">360°</span>
          </>
        ) : (
          <div className="agency-page-art">
            <span className="agency-page-art-index">03</span>
            <i className="agency-page-art-block" />
            <i className="agency-page-art-line" />
            <i className="agency-page-art-outline" />
          </div>
        )}
        <span className="art-caption">{t.eyebrow}</span>
      </div>
    </section>
  );
}
function ServicesPage({ lang, t }) {
  return (
    <>
      <PageHero
        kicker={t.servicesAll}
        title={
          lang === "fr"
            ? "Des expertises qui se répondent."
            : "خبرات متكاملة تعمل معاً."
        }
        desc={t.introText}
        t={t}
      />
      <section className="section service-directory">
        <div className="section-kicker">01 / {t.servicesAll}</div>
        {["Immersion", "Présence", "Acquisition"].map((group, i) => (
          <div className="service-group" key={group}>
            <div className="service-group-title">
              <span>0{i + 1}</span>
              <h2>
                {lang === "fr" ? group : ["الانغماس", "الحضور", "الاستقطاب"][i]}
              </h2>
            </div>
            <div className="service-list">
              {services
                .filter((s) => s.group === group)
                .map((s) => (
                  <ServiceRow key={s.slug} s={s} lang={lang} t={t} />
                ))}
            </div>
          </div>
        ))}
      </section>
      <CTA t={t} />
    </>
  );
}
function ServiceRow({ s, lang, t }) {
  return (
    <Link to={"/services/" + s.slug} className="service-row">
      <span className="service-row-icon">{s.icon}</span>
      <div>
        <h3>{tr(lang, s.title)}</h3>
        <p>{tr(lang, s.intro)}</p>
      </div>
      <ArrowUpRight />
    </Link>
  );
}
function ServicePage({ lang, t, service }) {
  if (!service) return <NotFound t={t} />;
  const idx = services.indexOf(service);
  return (
    <>
      <PageHero
        kicker={`${tr(lang, service.title)} · ${String(idx + 1).padStart(2, "0")}`}
        title={tr(lang, service.intro)}
        desc={tr(lang, service.detail)}
        t={t}
        className={
          service.slug === "visites-virtuelles-360" ? "page-hero-360" : ""
        }
      />
      <section className="section service-detail">
        <div className="section-kicker">01 / {t.discover}</div>
        <div className="service-detail-grid">
          <div>
            <h2>
              {lang === "fr"
                ? "Ce que comprend cette expertise"
                : "ماذا تشمل هذه الخدمة"}
            </h2>
            <p>{tr(lang, service.detail)}</p>
            <p>
              {lang === "fr"
                ? "Une proposition claire précise les livrables, les responsabilités, les options et les éventuels coûts récurrents."
                : "يوضح العرض المخرجات والمسؤوليات والخيارات والتكاليف المتكررة المحتملة."}
            </p>
          </div>
          <div className="deliverables">
            {service.tasks.map((x, i) => (
              <div key={i}>
                <span>0{i + 1}</span>
                <b>{tr(lang, x)}</b>
                <Check size={17} />
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="faq-section section">
        <div className="section-kicker">02 / FAQ</div>
        <div className="faq-layout">
          <div>
            <h2>{t.faq}</h2>
            <p>{t.faqSub}</p>
          </div>
          <ServiceFaq s={service} lang={lang} />
        </div>
      </section>
      <CTA t={t} service={tr(lang, service.title)} />
    </>
  );
}
function ServiceFaq({ s, lang }) {
  const items = [];
  for (let i = 0; i < s.faq.length; i += 2)
    items.push([s.faq[i], s.faq[i + 1]]);
  return (
    <div className="faq-list">
      {items.map(([q, a], i) => (
        <details key={i} className="faq-item">
          <summary>
            <span>0{i + 1}</span>
            {tr(lang, q)}
            <Plus size={17} />
          </summary>
          <p>{tr(lang, a)}</p>
        </details>
      ))}
    </div>
  );
}
function Faq({ t }) {
  return (
    <div className="faq-list">
      {t.faqQ.map((q, i) => (
        <details key={q} className="faq-item">
          <summary>
            <span>0{i + 1}</span>
            {q}
            <Plus size={17} />
          </summary>
          <p>{t.questions[i]}</p>
        </details>
      ))}
    </div>
  );
}
function mergeTourData(remote, fallback) {
  return {
    ...(fallback || {}),
    ...remote,
    cover: remote.cover || "",
    googleMapsUrl: remote.googleMapsUrl || "",
    gallery: remote.gallery?.length > 0 ? remote.gallery : [],
    scenes: remote.scenes || [],
    isDemo: false,
  };
}
function ToursIndexPage({ lang, t }) {
  const [tours, setTours] = useState(staticTours);
  const [filter, setFilter] = useState("Tout");
  useEffect(() => setFilter("Tout"), [lang]);
  useEffect(() => {
    let active = true;
    import("./lib/tours.js")
      .then(({ fetchPublishedTours }) => fetchPublishedTours())
      .then((published) => {
        if (!active || !published?.length) return;
        const mapped = new Map(staticTours.map((tour) => [tour.slug, tour]));
        for (const tour of published) {
          if (WITHDRAWN_DEMO_TOUR_SLUGS.has(tour.slug)) continue;
          mapped.set(
            tour.slug,
            mergeTourData(
              tour,
              staticTours.find((item) => item.slug === tour.slug),
            ),
          );
        }
        setTours([...mapped.values()]);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);
  const categories = [
    "Tout",
    ...new Set(tours.map((tour) => tx(lang, tour.category))),
  ];
  const filtered = tours.filter(
    (tour) => filter === "Tout" || tx(lang, tour.category) === filter,
  );
  const kenitraTours = filtered.filter((tour) => tour.isKenitra);
  const otherTours = filtered.filter((tour) => !tour.isKenitra);
  const renderCard = (tour) => {
    const hasStreetView =
      tour.streetViewStatus === "available" && Boolean(tour.streetViewPanoId);
    const streetViewUnavailable = tour.streetViewStatus === "unavailable";
    const hasCoordinates =
      String(tour.googleMapsLat ?? "").trim() !== "" &&
      String(tour.googleMapsLng ?? "").trim() !== "" &&
      Number.isFinite(Number(tour.googleMapsLat)) &&
      Number.isFinite(Number(tour.googleMapsLng));
    const placeUrl =
      normalizeGoogleMapsSearchUrl(tour.googleMapsLink || "") ||
      normalizeGoogleMapsSearchUrl(tour.googleMapsUrl || "") ||
      (hasCoordinates
        ? googleMapsSearchUrl(`${tour.googleMapsLat},${tour.googleMapsLng}`)
        : "");
    const hasGoogleMap = Boolean(
      placeUrl || normalizeGoogleMapsEmbedUrl(tour.googleMapsUrl || ""),
    );
    const isMapOnlyPublished =
      !tour.isDemo &&
      Boolean(tour.isPublished) &&
      !tour.scenes?.length &&
      (hasGoogleMap || hasStreetView);
    return (
      <article key={tour.slug} className="tour-catalog-card">
        <Link to={`/visites/${tour.slug}`} className="tour-catalog-card-main">
          <div className="tour-catalog-cover">
            {tour.cover && <img loading="lazy" src={tour.cover} alt="" />}
            <span
              className={`tour-project-status ${hasStreetView || isMapOnlyPublished || (!tour.isDemo && !tour.isKenitra) ? "published" : "demo"}`}
            >
              {hasStreetView
                ? lang === "fr"
                  ? "STREET VIEW VÉRIFIÉ"
                  : "تم التحقق من Street View"
                : isMapOnlyPublished
                  ? streetViewUnavailable
                    ? lang === "fr"
                      ? "CARTE PUBLIÉE · AUCUN PANORAMA TROUVÉ"
                      : "خريطة منشورة · لم يتم العثور على بانوراما"
                    : lang === "fr"
                      ? "CARTE PUBLIÉE · STREET VIEW NON VÉRIFIÉ"
                      : "خريطة منشورة · Street View غير متحقق"
                  : tour.isKenitra
                    ? lang === "fr"
                      ? "CARTE GOOGLE · STREET VIEW À VÉRIFIER"
                      : "خرائط Google · يلزم التحقق من Street View"
                    : tour.isDemo
                      ? lang === "fr"
                        ? "DÉMO · PANORAMA À FOURNIR"
                        : "عرض · أضف الصورة البانورامية"
                      : !tour.scenes?.length && hasGoogleMap
                        ? lang === "fr"
                          ? "FICHE · GOOGLE MAPS"
                          : "صفحة · خرائط Google"
                        : lang === "fr"
                          ? "VISITE 360° PUBLIÉE"
                          : "جولة 360° منشورة"}
            </span>
            {(tour.isDemo || tour.visualNote) && (
              <span className="tour-illustration-tag">
                {tour.visualNote
                  ? tx(lang, tour.visualNote)
                  : lang === "fr"
                    ? "Illustration — pas un panorama"
                    : "صورة توضيحية وليست بانوراما"}
              </span>
            )}
            <span className="tour-catalog-arrow">
              <ArrowUpRight size={18} />
            </span>
          </div>
          <div className="tour-catalog-meta">
            <span>{tx(lang, tour.category)}</span>
            <h2>{tx(lang, tour.title)}</h2>
            <p>{tx(lang, tour.description)}</p>
          </div>
        </Link>
        <div className="tour-catalog-card-actions">
          <Link to={`/visites/${tour.slug}`} className="tour-catalog-cta">
            {hasStreetView
              ? lang === "fr"
                ? "Explorer en 360°"
                : "استكشف بزاوية 360°"
              : lang === "fr"
                ? "Voir la fiche"
                : "عرض التفاصيل"}
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
          {placeUrl && (
            <a
              className="tour-catalog-cta secondary"
              href={placeUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {lang === "fr" ? "Ouvrir dans Google Maps" : "فتح في Google Maps"}
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          )}
        </div>
      </article>
    );
  };
  return (
    <>
      <PageHero
        kicker={
          lang === "fr" ? "KÉNITRA · MAROC · 360°" : "القنيطرة · المغرب · 360°"
        }
        title={
          lang === "fr"
            ? "Découvrez Kénitra en 360°"
            : "اكتشف القنيطرة بزاوية 360°"
        }
        desc={
          lang === "fr"
            ? "Explorez quatre lieux de Kénitra. Chaque fiche ouvre son repère Google Maps ; une vue Street View n’est annoncée qu’après vérification."
            : "اكتشف أربعة مواقع في القنيطرة. تتضمن كل بطاقة موقعاً على خرائط Google؛ ولا يُعلن عن Street View إلا بعد التحقق."
        }
        t={t}
        actions={false}
      />
      <section className="section tour-catalog">
        <div
          className="filters"
          aria-label={lang === "fr" ? "Filtrer les visites" : "تصفية الجولات"}
        >
          {categories.map((category) => (
            <button
              key={category}
              className={`filter ${filter === category ? "active" : ""}`}
              onClick={() => setFilter(category)}
            >
              {category === "Tout"
                ? lang === "fr"
                  ? "Tout"
                  : "الكل"
                : category}
            </button>
          ))}
        </div>
        {kenitraTours.length > 0 && (
          <section className="tour-subsection">
            <div className="tour-section-heading">
              <span className="section-kicker">
                {lang === "fr" ? "RABAT-SALÉ-KÉNITRA" : "الرباط سلا القنيطرة"}
              </span>
              <h2>
                {lang === "fr"
                  ? "Quatre lieux à explorer"
                  : "أربعة أماكن للاستكشاف"}
              </h2>
              <p>
                {lang === "fr"
                  ? "Les vues panoramiques Google sont indiquées comme disponibles uniquement après contrôle Street View par l’administration. Les illustrations sont conceptuelles, pas des photographies de ces lieux."
                  : "لا تُعرض مناظر Google البانورامية على أنها متاحة إلا بعد تحقق الإدارة من Street View. الصور توضيحية وليست صوراً فوتوغرافية لهذه المواقع."}
              </p>
            </div>
            <div className="tour-catalog-grid">
              {kenitraTours.map(renderCard)}
            </div>
          </section>
        )}
        {otherTours.length > 0 && (
          <section className="tour-subsection tour-other-demos">
            <div className="tour-section-heading">
              <span className="section-kicker">
                {lang === "fr" ? "CONCEPTS MÉTIERS" : "تصورات حسب القطاعات"}
              </span>
              <h2>{lang === "fr" ? "Autres visites" : "جولات أخرى"}</h2>
            </div>
            <div className="tour-catalog-grid">
              {otherTours.map(renderCard)}
            </div>
          </section>
        )}
        <div className="tour-catalog-note">
          <Compass size={18} />
          <p>
            {lang === "fr"
              ? "Les liens de recherche Google Maps ne nécessitent pas Supabase. Ils ouvrent Google Maps au clic. Aucune image Google n’est téléchargée ou réhébergée ; seuls des panoramas 2:1 autorisés ou des vues Street View vérifiées peuvent activer l’expérience 360°."
              : "روابط البحث على خرائط Google لا تحتاج إلى Supabase وتفتح الخرائط عند النقر. لا يتم تنزيل صور Google أو إعادة استضافتها؛ ولا تُفعّل تجربة 360° إلا باستخدام صور 2:1 مصرح بها أو مشاهد Street View تم التحقق منها."}
          </p>
        </div>
      </section>
      <CTA t={t} />
    </>
  );
}
function TourPublicPage({ lang, t, path, embed = false }) {
  const slug = path.split("/").pop();
  const fallback = staticTours.find((item) => item.slug === slug) || null;
  const [tour, setTour] = useState(fallback);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (WITHDRAWN_DEMO_TOUR_SLUGS.has(slug)) {
      setLoading(false);
      return undefined;
    }
    let active = true;
    import("./lib/tours.js")
      .then(({ fetchPublishedTour }) => fetchPublishedTour(slug))
      .then((published) => {
        if (!active) return;
        if (published) setTour(mergeTourData(published, fallback));
        setLoading(false);
      })
      .catch(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug]);
  if (WITHDRAWN_DEMO_TOUR_SLUGS.has(slug)) return <NotFound t={t} />;
  if (!tour && loading)
    return (
      <div className="tour-page-loading">
        {lang === "fr" ? "Chargement de la visite…" : "جارٍ تحميل الجولة…"}
      </div>
    );
  if (!tour) return <NotFound t={t} />;
  const isIllustrative = Boolean(tour.isDemo || tour.visualNote);
  const hasGoogleMap = Boolean(
    normalizeGoogleMapsEmbedUrl(tour.googleMapsUrl || "") ||
      normalizeGoogleMapsSearchUrl(tour.googleMapsUrl || "") ||
      normalizeGoogleMapsSearchUrl(tour.googleMapsLink || ""),
  );
  const googleMapsPlaceUrl =
    normalizeGoogleMapsSearchUrl(tour.googleMapsLink || "") ||
    normalizeGoogleMapsSearchUrl(tour.googleMapsUrl || "");
  const hasStreetView =
    tour.streetViewStatus === "available" && Boolean(tour.streetViewPanoId);
  const streetViewUnavailable = tour.streetViewStatus === "unavailable";
  const isMapOnlyPublished =
    !tour.isDemo &&
    Boolean(tour.isPublished) &&
    !tour.scenes?.length &&
    (hasGoogleMap || hasStreetView);
  const tourConfig = {
    mode: "panorama",
    scenes: tour.scenes || [],
    planUrl: tour.plan || "",
  };
  return (
    <div
      className={`tour-project-page ${embed ? "tour-embed-mode" : ""} ${embed && isMapOnlyPublished ? "tour-embed-map-only" : ""}`}
    >
      {!embed && (
        <PageHero
          kicker={`${tx(lang, tour.category)} · ${hasStreetView ? (lang === "fr" ? "GOOGLE STREET VIEW VÉRIFIÉ" : "تم التحقق من Google Street View") : isMapOnlyPublished ? (lang === "fr" ? "CARTE GOOGLE PUBLIÉE" : "خريطة Google منشورة") : isIllustrative ? (tour.isKenitra ? (lang === "fr" ? "FICHE DE DESTINATION" : "بطاقة وجهة") : lang === "fr" ? "DÉMONSTRATION ILLUSTRÉE" : "عرض توضيحي مصور") : lang === "fr" ? "VISITE 360° PUBLIÉE" : "جولة 360° منشورة"}`}
          title={tx(lang, tour.title)}
          desc={tx(lang, tour.description)}
          t={t}
          actions={false}
        />
      )}
      <section className="section tour-project-content">
        <div className="tour-project-toolbar">
          <Link to="/visites" className="text-link">
            <ArrowLeft size={15} />{" "}
            {lang === "fr" ? "Toutes les visites" : "كل الجولات"}
          </Link>
          {!embed && <TourShare lang={lang} />}
        </div>
        <div className="tour-project-layout">
          <div className="tour-project-main">
            <div className="tour-viewer-heading">
              <div>
                <span className="section-kicker">
                  360° · {tx(lang, tour.category)}
                </span>
                <h2>
                  {lang === "fr" ? "Explorez la visite" : "استكشف الجولة"}
                </h2>
              </div>
              {hasStreetView ? (
                <span className="tour-project-status published">
                  {lang === "fr"
                    ? "GOOGLE STREET VIEW VÉRIFIÉ"
                    : "تم التحقق من Google Street View"}
                </span>
              ) : isMapOnlyPublished ? (
                <span className="tour-project-status published">
                  {streetViewUnavailable
                    ? lang === "fr"
                      ? "CARTE PUBLIÉE · AUCUN PANORAMA TROUVÉ"
                      : "خريطة منشورة · لم يتم العثور على بانوراما"
                    : lang === "fr"
                      ? "CARTE GOOGLE PUBLIÉE · STREET VIEW NON VÉRIFIÉ"
                      : "خريطة Google منشورة · Street View غير متحقق"}
                </span>
              ) : isIllustrative ? (
                <span className="tour-project-status demo">
                  {lang === "fr"
                    ? "STREET VIEW À VÉRIFIER · PANORAMA 2:1 ABSENT"
                    : "Street View غير متحقق · بانوراما 2:1 غير متوفرة"}
                </span>
              ) : null}
            </div>
            {tour.scenes?.length ? (
              <TourReader lang={lang} t={t} tourConfig={tourConfig} />
            ) : hasStreetView ? (
              <GoogleStreetViewViewer
                panoId={tour.streetViewPanoId}
                lang={lang}
              />
            ) : (
              <div className="tour-placeholder tour-no-source">
                <Compass size={28} />
                <b>
                  {lang === "fr"
                    ? "Lecteur 360° prêt à configurer"
                    : "مشغل 360° جاهز للإعداد"}
                </b>
                <p>
                  {isMapOnlyPublished
                    ? lang === "fr"
                      ? "Cette fiche publiée intègre une carte Google ci-dessous. Elle ne contient pas de panorama Threepoints : l’affichage Google reste hébergé par Google et ne devient pas une scène Pannellum."
                      : "تتضمن هذه الصفحة المنشورة خريطة Google أدناه. لا تحتوي على بانوراما Threepoints؛ ويظل محتوى Google مستضافاً لدى Google ولا يتحول إلى مشهد Pannellum."
                    : lang === "fr"
                      ? "Cette fiche ne contient pas encore de panorama équirectangulaire original. Un administrateur peut importer les scènes 2:1 depuis /admin ; aucune photo ordinaire n’est transformée en visite."
                      : "لا تحتوي هذه الصفحة بعد على صورة بانورامية أصلية. يمكن للمسؤول استيراد مشاهد 2:1 من /admin؛ ولا تُحوّل الصور العادية إلى جولات."}
                </p>
                <Link to="/admin" className="text-link">
                  {lang === "fr" ? "Accès administrateur" : "مساحة الإدارة"}{" "}
                  <ArrowUpRight size={15} />
                </Link>
              </div>
            )}
            {tour.gallery?.length > 0 && (
              <div className="tour-project-gallery">
                <div className="tour-gallery-heading">
                  <div>
                    <span className="section-kicker">
                      {lang === "fr" ? "GALERIE DU PROJET" : "معرض المشروع"}
                    </span>
                    <h3>
                      {lang === "fr" ? "Images de présentation" : "صور العرض"}
                    </h3>
                  </div>
                  {isIllustrative && (
                    <small>
                      {tour.visualNote
                        ? tx(lang, tour.visualNote)
                        : lang === "fr"
                          ? "Illustrations — pas des panoramas 360°"
                          : "صور توضيحية وليست بانوراما 360°"}
                    </small>
                  )}
                </div>
                <div className="tour-gallery-grid">
                  {tour.gallery.map((image, index) => (
                    <figure key={`${image.src}-${index}`}>
                      <img
                        loading="lazy"
                        src={image.src || image}
                        alt={tx(lang, image.alt || tour.title)}
                      />
                      <figcaption>
                        {tx(lang, image.alt || tour.title)}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            )}
          </div>
          <aside className="tour-project-aside">
            <div className="tour-info-card">
              <span className="section-kicker">
                {lang === "fr" ? "NAVIGATION DE LA VISITE" : "التنقل داخل الجولة"}
              </span>
              <h3>
                {lang === "fr" ? "Scènes & navigation" : "المشاهد والتنقل"}
              </h3>
              {tour.scenes?.length ? (
                <ol>
                  {tour.scenes.map((scene, index) => (
                    <li key={scene.id || index}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      {tx(lang, scene.title)}
                    </li>
                  ))}
                </ol>
              ) : (
                <p>
                  {lang === "fr"
                    ? "Les noms de pièces et les liaisons apparaîtront après l’import des panoramas."
                    : "ستظهر أسماء الغرف وروابط التنقل بعد استيراد الصور البانورامية."}
                </p>
              )}
            </div>
            {tour.plan && (
              <div className="tour-info-card tour-mini-plan">
                <span className="section-kicker">
                  {lang === "fr" ? "PLAN INTERACTIF" : "مخطط تفاعلي"}
                </span>
                <div className="tour-plan-image">
                  <img
                    src={tour.plan}
                    alt={
                      lang === "fr"
                        ? "Plan interactif du lieu"
                        : "مخطط تفاعلي للمكان"
                    }
                  />
                  {tour.scenes.map(
                    (scene, index) =>
                      scene.planX != null && (
                        <span
                          key={scene.id}
                          style={{
                            left: `${scene.planX}%`,
                            top: `${scene.planY}%`,
                          }}
                        >
                          {index + 1}
                        </span>
                      ),
                  )}
                </div>
              </div>
            )}
            <div className="tour-info-card">
              <span className="section-kicker">
                {lang === "fr" ? "PARTAGER" : "مشاركة"}
              </span>
              <p>
                {lang === "fr"
                  ? "Partagez cette page ou intégrez la visite sur un autre site lorsqu’elle est publiée."
                  : "شارك هذه الصفحة أو أدرج الجولة في موقع آخر بعد نشرها."}
              </p>
              <TourShare lang={lang} />
            </div>
            {tour.googleMapsUrl && (
              <GoogleMapsEmbed url={tour.googleMapsUrl} lang={lang} />
            )}
            {googleMapsPlaceUrl && (
              <GoogleMapsLocationCard
                url={googleMapsPlaceUrl}
                lang={lang}
                streetViewStatus={tour.streetViewStatus}
                panoId={tour.streetViewPanoId}
              />
            )}
          </aside>
        </div>
      </section>
      {!embed && <CTA t={t} />}
    </div>
  );
}
function GoogleMapsEmbed({ url, lang }) {
  const [enabled, setEnabled] = useState(false);
  const safeUrl = normalizeGoogleMapsEmbedUrl(url);
  if (!safeUrl) return null;
  return (
    <section
      className="tour-google-map"
      aria-label={lang === "fr" ? "Carte Google Maps" : "خريطة Google Maps"}
    >
      <div className="tour-google-map-heading">
        <span className="section-kicker">GOOGLE MAPS · STREET VIEW</span>
        <h3>{lang === "fr" ? "Repérer le lieu" : "تحديد موقع المكان"}</h3>
      </div>
      {enabled ? (
        <iframe
          src={safeUrl}
          title={
            lang === "fr"
              ? "Carte Google Maps du lieu"
              : "خريطة Google Maps للمكان"
          }
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <div className="tour-google-map-consent">
          <p>
            {lang === "fr"
              ? "La carte est hébergée par Google. Elle ne se charge qu’après votre action ; Google peut alors recevoir des données de connexion."
              : "تستضيف Google الخريطة. لن يتم تحميلها إلا بعد اختيارك؛ وقد تتلقى Google عندها بيانات الاتصال."}
          </p>
          <button type="button" onClick={() => setEnabled(true)}>
            {lang === "fr" ? "Charger la carte Google" : "تحميل خريطة Google"}
          </button>
          <a href={safeUrl} target="_blank" rel="noopener noreferrer">
            {lang === "fr" ? "Ouvrir dans Google Maps" : "فتح في Google Maps"}
          </a>
        </div>
      )}
    </section>
  );
}

function GoogleStreetViewViewer({ panoId, lang }) {
  const [enabled, setEnabled] = useState(false);
  const embedUrl = googleStreetViewEmbedUrl(panoId);
  const directUrl = googleMapsPanoUrl(panoId);
  return (
    <section className="tour-google-streetview">
      <div className="tour-google-map-heading">
        <span className="section-kicker">GOOGLE STREET VIEW · 360°</span>
        <h3>
          {lang === "fr" ? "Panorama vérifié" : "بانوراما تم التحقق منها"}
        </h3>
      </div>
      {embedUrl && enabled ? (
        <iframe
          src={embedUrl}
          title={
            lang === "fr"
              ? "Panorama Google Street View"
              : "بانوراما Google Street View"
          }
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="fullscreen"
          allowFullScreen
        />
      ) : (
        <div className="tour-google-map-consent">
          <p>
            {embedUrl
              ? lang === "fr"
                ? "Cette vue Street View a été trouvée par vérification. Le panorama Google se charge uniquement après votre clic."
                : "تم العثور على مشهد Street View بعد التحقق. لن تُحمّل بانوراما Google إلا بعد النقر."
              : lang === "fr"
                ? "Panorama vérifié. Pour l’afficher dans cette page, configure la clé Google Maps Embed API ; tu peux aussi l’ouvrir directement dans Google Maps."
                : "تم التحقق من البانوراما. لعرضها في هذه الصفحة، أضف مفتاح Google Maps Embed API؛ ويمكنك فتحها مباشرة في خرائط Google."}
          </p>
          {embedUrl && (
            <button type="button" onClick={() => setEnabled(true)}>
              {lang === "fr" ? "Explorer en 360°" : "استكشف بزاوية 360°"}
            </button>
          )}
          <a href={directUrl} target="_blank" rel="noopener noreferrer">
            {lang === "fr" ? "Ouvrir dans Google Maps" : "فتح في Google Maps"}
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </div>
      )}
    </section>
  );
}

function GoogleMapsLocationCard({ url, lang, streetViewStatus, panoId }) {
  const [mapEnabled, setMapEnabled] = useState(false);
  const safeUrl = normalizeGoogleMapsSearchUrl(url);
  if (!safeUrl) return null;
  const query = new URL(safeUrl).searchParams.get("query") || "";
  const embedUrl = googleMapsPlaceEmbedUrl(query);
  const available = streetViewStatus === "available" && Boolean(panoId);
  const unavailable = streetViewStatus === "unavailable";
  return (
    <section className="tour-google-map tour-google-map-link-card">
      <div className="tour-google-map-heading">
        <span className="section-kicker">GOOGLE MAPS</span>
        <h3>
          {lang === "fr" ? "Repérer la destination" : "تحديد موقع الوجهة"}
        </h3>
      </div>
      <p>
        {available
          ? lang === "fr"
            ? "Street View a été vérifié par l’administration pour ce point."
            : "تحققت الإدارة من توفر Street View لهذا الموقع."
          : unavailable
            ? lang === "fr"
              ? "Aucun panorama Street View n’a été trouvé dans le rayon contrôlé. La carte du lieu reste disponible."
              : "لم يتم العثور على بانوراما Street View ضمن نطاق التحقق. تظل خريطة الموقع متاحة."
            : lang === "fr"
              ? "Street View n’a pas encore été vérifié. Ouvre la carte pour consulter le lieu et les vues qui y sont proposées."
              : "لم يتم التحقق بعد من Street View. افتح الخريطة للاطلاع على الموقع والمشاهد المتاحة فيه."}
      </p>
      {embedUrl && !mapEnabled && (
        <small className="tour-google-map-privacy">
          {lang === "fr"
            ? "La carte intégrée est hébergée par Google et ne se charge qu’après votre clic."
            : "تستضيف Google الخريطة المضمنة ولن تُحمّل إلا بعد النقر."}
        </small>
      )}
      {mapEnabled && embedUrl ? (
        <iframe
          src={embedUrl}
          title={
            lang === "fr"
              ? "Carte Google Maps du lieu"
              : "خريطة Google Maps للمكان"
          }
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <div className="tour-google-map-actions">
          {embedUrl && (
            <button type="button" onClick={() => setMapEnabled(true)}>
              {lang === "fr" ? "Afficher la carte Google" : "عرض خريطة Google"}
            </button>
          )}
          <a href={safeUrl} target="_blank" rel="noopener noreferrer">
            {lang === "fr" ? "Ouvrir dans Google Maps" : "فتح في Google Maps"}
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
          {available && (
            <a
              className="tour-google-map-secondary"
              href={googleMapsPanoUrl(panoId)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {lang === "fr" ? "Explorer en 360°" : "استكشف بزاوية 360°"}
            </a>
          )}
        </div>
      )}
    </section>
  );
}

function PdfDownloadCard({ href, title, detail, lang }) {
  return (
    <a
      className="pdf-download-card"
      href={href}
      download
      type="application/pdf"
    >
      <FileText size={22} aria-hidden="true" />
      <span>
        <b>{title}</b>
        <small>{detail}</small>
      </span>
      <Download size={18} aria-hidden="true" />
    </a>
  );
}
function ProjectsPage({ lang, t }) {
  const [filter, setFilter] = useState("Tout");
  let cats = ["Tout", ...new Set(projects.map((p) => p.sector))];
  return (
    <>
      <PageHero
        kicker={t.nav[2]}
        title={lang === "fr" ? "Nos réalisations" : "أعمالنا"}
        desc={
          lang === "fr"
            ? "Sélection de travaux issue du portfolio fourni."
            : "مختارات من الأعمال الواردة في ملف الأعمال المقدم."
        }
        t={t}
        actions={false}
      />
      <section className="section portfolio">
        <div className="filters">
          {cats.map((c) => (
            <button
              className={filter === c ? "filter active" : "filter"}
              key={c}
              onClick={() => setFilter(c)}
            >
              {c === "Tout" ? (lang === "fr" ? "Tout" : "الكل") : tx(lang, c)}
            </button>
          ))}
        </div>
        <div className="portfolio-grid">
          {projects
            .filter((p) => filter === "Tout" || p.sector === filter)
            .map((p) => (
              <Link
                to={"/realisations/" + p.slug}
                className="portfolio-card"
                key={p.slug}
              >
                <div className="portfolio-cover">
                  <img loading="lazy" src={p.cover} alt="" />
                  <span
                    className={`demo-badge ${p.demo ? "" : "portfolio-badge"}`}
                  >
                    <span /> {p.demo ? t.demo : t.portfolioItem}
                  </span>
                  <span className="portfolio-arrow">
                    <ArrowUpRight />
                  </span>
                </div>
                <div className="portfolio-card-meta">
                  <span>
                    {tx(lang, p.sector)} · {tx(lang, p.city)}
                  </span>
                  <h3>{tx(lang, p.title)}</h3>
                  <p>{tx(lang, p.desc)}</p>
                </div>
              </Link>
            ))}
        </div>
        <div className="disclaimer-card">
          <ImageIcon size={19} />
          <p>
            {lang === "fr"
              ? "Les visuels et créations présentés proviennent des fichiers de portfolio transmis. Aucun résultat ni contexte client supplémentaire n’est inventé."
              : "التصاميم المعروضة مأخوذة من ملفات الأعمال المقدمة. لا نختلق نتائج أو سياقاً إضافياً للعملاء."}
          </p>
        </div>
      </section>
      <section className="section pdf-documents">
        <div className="section-kicker">
          PDF · {lang === "fr" ? "DOCUMENTS TRANSMIS" : "مستندات مقدمة"}
        </div>
        <h2>
          {lang === "fr" ? "Les portfolios complets" : "ملفات الأعمال الكاملة"}
        </h2>
        <div className="pdf-download-grid">
          <PdfDownloadCard
            href="/documents/portfolio-soufiane-talil.pdf"
            title={t.portfolioPdf}
            detail={lang === "fr" ? "PDF · 41 pages" : "PDF · 41 صفحة"}
            lang={lang}
          />
          <PdfDownloadCard
            href="/documents/presentation-threepoints-media.pdf"
            title={t.agencyPdf}
            detail={lang === "fr" ? "PDF · 13 pages" : "PDF · 13 صفحة"}
            lang={lang}
          />
        </div>
      </section>
      <CTA t={t} />
    </>
  );
}
function ProjectPage({ lang, t, path }) {
  const p = projects.find((x) => x.slug === path.split("/").pop());
  if (!p) return <NotFound t={t} />;
  return (
    <>
      <section className="project-detail-hero">
        <div className="project-detail-top">
          <div className="eyebrow">
            <span className="pulse" />
            {p.demo ? t.demo : t.portfolioItem} · {tx(lang, p.sector)}
          </div>
          <h1>{tx(lang, p.title)}</h1>
          <p>{tx(lang, p.desc)}</p>
          <span className="project-location">
            <MapPin size={15} />
            {tx(lang, p.city)}
          </span>
        </div>
        <div className="project-detail-image">
          <img loading="lazy" src={p.cover} alt="" />
          <span>
            {p.demo
              ? lang === "fr"
                ? "Visuel d’illustration — aucune visite 360° active"
                : "صورة توضيحية — لا توجد جولة 360° فعّالة"
              : t.galleryInfo}
          </span>
        </div>
      </section>
      <section className="section project-detail-copy">
        <div>
          <div className="eyebrow">
            {p.demo
              ? lang === "fr"
                ? "LE CONCEPT"
                : "المفهوم"
              : t.galleryTitle}
          </div>
          <h2>
            {p.demo
              ? lang === "fr"
                ? "Une expérience qui raconte le lieu."
                : "تجربة تحكي قصة المكان."
              : tx(lang, p.title)}
          </h2>
        </div>
        <div>
          <p>
            {tx(lang, p.desc)}{" "}
            {p.demo
              ? lang === "fr"
                ? "Ce projet de démonstration illustre une manière de relier la découverte du lieu aux informations pratiques, puis à une prise de contact."
                : "يوضح هذا المشروع التجريبي طريقة ربط اكتشاف المكان بالمعلومات العملية ثم التواصل."
              : t.galleryInfo}
          </p>
          <div className="project-services">
            {p.services.map((x) => (
              <span key={x}>
                <Check size={14} />
                {tx(lang, x)}
              </span>
            ))}
          </div>
          {p.demo && (
            <div className="tour-empty small-empty">
              <Compass size={25} />
              <strong>{t.noTour}</strong>
              <p>{t.noTourText}</p>
            </div>
          )}
        </div>
      </section>
      {p.gallery && (
        <section className="section project-gallery">
          <div className="section-kicker">{t.galleryTitle}</div>
          <p className="project-gallery-intro">{t.galleryInfo}</p>
          <div className="project-gallery-grid">
            {p.gallery.map((item) => (
              <figure key={item.file}>
                <img
                  loading="lazy"
                  src={`/images/portfolio/${item.file}`}
                  alt={tx(lang, item.alt)}
                />
                <figcaption>{tx(lang, item.alt)}</figcaption>
              </figure>
            ))}
          </div>
          <div className="project-gallery-download">
            <PdfDownloadCard
              href="/documents/portfolio-soufiane-talil.pdf"
              title={t.portfolioPdf}
              detail={lang === "fr" ? "PDF · 41 pages" : "PDF · 41 صفحة"}
              lang={lang}
            />
          </div>
        </section>
      )}
      <CTA t={t} />
    </>
  );
}
function SectorPage({ lang, t, path }) {
  let s = sectors.find((x) => x[3] === path) || sectors[0];
  return (
    <>
      <PageHero
        kicker={t.nav[1]}
        title={tx(lang, s[0])}
        desc={tx(lang, s[2])}
        t={t}
      />
      <section className="section sector-detail">
        <div className="section-kicker">01 / {t.sectorTitle}</div>
        <div className="service-detail-grid">
          <div>
            <h2>
              {lang === "fr"
                ? "Une expérience adaptée à votre quotidien."
                : "تجربة تناسب واقع عملك."}
            </h2>
            <p>
              {tx(lang, s[2])}{" "}
              {lang === "fr"
                ? "Nous associons les bons outils à vos priorités : expérience sur place, présence digitale ou développement de votre acquisition."
                : "نجمع الأدوات المناسبة لأولوياتك: التجربة داخل المكان أو الحضور الرقمي أو تطوير الاستقطاب."}
            </p>
          </div>
          <div className="deliverables">
            {services.slice(0, 4).map((x, i) => (
              <Link key={x.slug} to={"/services/" + x.slug}>
                <span>0{i + 1}</span>
                <b>{tr(lang, x.title)}</b>
                <ArrowUpRight size={17} />
              </Link>
            ))}
          </div>
        </div>
      </section>
      <CTA t={t} />
    </>
  );
}
function OffersPage({ lang, t }) {
  return (
    <>
      <PageHero kicker={t.more} title={t.offers} desc={t.offersText} t={t} />
      <section className="section offers-page">
        <div className="section-kicker">01 / {t.more}</div>
        <div className="offers-grid">
          {offers.map((o, i) => (
            <div className="offer-card" key={o[0]}>
              <span className="offer-number">0{i + 1}</span>
              <h2>
                {lang === "fr" ? o[0] : ["الحضور", "الانغماس", "الاستقطاب"][i]}
              </h2>
              <p>{tx(lang, o[1])}</p>
              <ul>
                {o[2].map((x) => (
                  <li key={x}>
                    <Check size={15} />
                    {tx(lang, x)}
                  </li>
                ))}
              </ul>
              <div className="offer-notes">
                <b>{t.options}</b>
                <span>
                  {tx(
                    lang,
                    i === 0
                      ? "Identité visuelle, contenus, multilingue"
                      : i === 1
                        ? "Photographie, vidéo, scènes supplémentaires"
                        : "Création de contenus, automatisations",
                  )}
                </span>
                <b>{t.recurring}</b>
                <span>{tx(lang, o[3])}</span>
              </div>
              <div className="offer-price">
                <span>{t.price}</span>
                <Link
                  to={"/contact?service=" + encodeURIComponent(o[0])}
                  className="button button-dark"
                >
                  {t.plan}
                  <ArrowUpRight size={15} />
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="custom-offer">
          <span className="eyebrow light">
            ✳ {lang === "fr" ? "SUR MESURE" : "حل مخصص"}
          </span>
          <h2>{t.special}</h2>
          <p>{t.specialText}</p>
          <Link to="/contact" className="button button-mint">
            {t.cta}
            <ArrowUpRight size={16} />
          </Link>
        </div>
        <p className="pricing-note">
          {lang === "fr"
            ? "Toutes les offres sont établies sur devis. Les prestations ponctuelles et les abonnements éventuels sont présentés séparément."
            : "جميع الخدمات حسب عرض سعر. تعرض الخدمات لمرة واحدة والاشتراكات المحتملة بشكل منفصل."}
        </p>
      </section>
      <CTA t={t} />
    </>
  );
}
function AboutPage({ lang, t }) {
  return (
    <>
      <PageHero kicker={t.nav[3]} title={t.about} desc={t.aboutText} t={t} />
      <section className="section about-content">
        <div className="section-kicker">
          01 / {lang === "fr" ? "NOTRE APPROCHE" : "نهجنا"}
        </div>
        <div className="about-grid">
          <h2>
            {lang === "fr"
              ? "Une idée simple,\ntrois façons de la faire vivre."
              : "فكرة بسيطة،\nثلاث طرق لتفعيلها."}
          </h2>
          <div>
            <p>
              {lang === "fr"
                ? `${siteConfig.agencyName} est une agence de communication digitale pensée pour accompagner les entreprises au Maroc. Nous relions l’expérience des lieux, la qualité des outils web et la pertinence des campagnes.`
                : `${siteConfig.agencyName} وكالة تواصل رقمي لمواكبة الشركات في المغرب. نربط تجربة الأماكن بجودة الأدوات الرقمية وفعالية الحملات.`}
            </p>
            <p>
              {lang === "fr"
                ? "Nous privilégions les échanges directs, les objectifs compréhensibles et les recommandations honnêtes. Chaque accompagnement commence par l’écoute et se construit selon votre réalité."
                : "نفضل الحوار المباشر والأهداف الواضحة والتوصيات الصادقة. تبدأ كل مواكبة بالإنصات وتُبنى وفق واقعك."}
            </p>
            <div className="about-principles">
              {[t.pillars[0], t.pillars[1], t.pillars[2]].map((x, i) => (
                <span key={x}>
                  <b>0{i + 1}</b>
                  {x}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="section pdf-documents about-documents">
        <div className="section-kicker">
          PDF · {lang === "fr" ? "PRÉSENTATION" : "التعريف"}
        </div>
        <h2>
          {lang === "fr"
            ? "Découvrir la présentation de l’agence."
            : "اكتشف ملف التعريف بالوكالة."}
        </h2>
        <div className="pdf-download-grid">
          <PdfDownloadCard
            href="/documents/presentation-threepoints-media.pdf"
            title={t.agencyPdf}
            detail={lang === "fr" ? "PDF · 13 pages" : "PDF · 13 صفحة"}
            lang={lang}
          />
        </div>
      </section>
      <CTA t={t} />
    </>
  );
}
function BlogPage({ lang, t }) {
  return (
    <>
      <PageHero
        kicker={t.nav[4]}
        title={t.blog}
        desc={
          lang === "fr"
            ? "Des idées concrètes pour mieux présenter votre activité, choisir vos outils et développer votre présence."
            : "أفكار عملية لعرض نشاطك واختيار أدواتك وتطوير حضورك."
        }
        t={t}
        actions={false}
      />
      <section className="section blog-grid">
        {articles.map((a, i) => (
          <Link
            to={"/conseils/" + a.slug}
            className="article-card"
            key={a.slug}
          >
            <div className={"article-art art-" + i}>
              <span>0{i + 1}</span>
              <ArrowUpRight />
            </div>
            <div className="article-meta">
              <span>{tx(lang, a.category)}</span>
              <span>{tx(lang, a.date)}</span>
            </div>
            <h2>{tx(lang, a.title)}</h2>
            <p>{tx(lang, a.desc)}</p>
            <span className="text-link">
              {t.read}
              <ArrowRight size={15} />
            </span>
          </Link>
        ))}
      </section>
      <CTA t={t} />
    </>
  );
}
function ArticlePage({ lang, t, path }) {
  let a = articles.find((x) => x.slug === path.split("/").pop()) || articles[0];
  return (
    <>
      <section className="article-hero">
        <div className="eyebrow">
          {tx(lang, a.category)} · {tx(lang, a.date)}
        </div>
        <h1>{tx(lang, a.title)}</h1>
        <p>{tx(lang, a.desc)}</p>
        <div className="article-hero-art">
          <span>THREEPOINTS / NOTES</span>
          <Compass size={70} />
          <span>01 — 03</span>
        </div>
      </section>
      <article className="article-body">
        <p className="article-lead">{tx(lang, a.desc)}</p>
        <h2>
          {lang === "fr"
            ? "Partir de l’expérience de vos clients"
            : "ابدأ من تجربة عملائك"}
        </h2>
        <p>
          {lang === "fr"
            ? "Un outil digital n’a de valeur que s’il répond à une question réelle. Avant de choisir une technologie, observez ce que vos visiteurs cherchent à comprendre, les hésitations qu’ils rencontrent et la prochaine étape que vous souhaitez leur proposer."
            : "تكتسب الأداة الرقمية قيمتها حين تجيب عن حاجة فعلية. قبل اختيار التقنية، افهم ما يريد الزوار معرفته والتردد الذي يواجهونه والخطوة التالية التي ترغب في اقتراحها."}
        </p>
        <h2>
          {lang === "fr"
            ? "Clarifier le parcours avant de produire"
            : "وضوح المسار قبل الإنتاج"}
        </h2>
        <p>
          {lang === "fr"
            ? "Une structure simple relie découverte, informations utiles et contact. Choisissez des contenus qui aident à décider, évitez les promesses que vous ne pouvez pas vérifier et prévoyez une mesure respectueuse de la vie privée."
            : "يربط المسار الواضح بين الاكتشاف والمعلومات المفيدة والتواصل. اختر محتوى يساعد على اتخاذ القرار وتجنب الوعود غير المؤكدة واحرص على قياس يحترم الخصوصية."}
        </p>
        <div className="article-cta">
          <b>{t.sectorCTA}</b>
          <Link to="/contact" className="button button-dark">
            {t.cta}
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </article>
    </>
  );
}
function ContactPage({ lang, t }) {
  return (
    <>
      <PageHero
        kicker={t.contactPage}
        title={t.final}
        desc={t.contactIntro}
        t={t}
        actions={false}
      />
      <section className="section quote-layout">
        <div className="quote-aside">
          <span className="eyebrow">
            ✳ {lang === "fr" ? "PREMIER ÉCHANGE" : "الحوار الأول"}
          </span>
          <h2>
            {lang === "fr"
              ? "Un projet commence par une bonne conversation."
              : "يبدأ المشروع بحوار واضح."}
          </h2>
          <p>
            {lang === "fr"
              ? "Quelques repères nous aideront à comprendre votre besoin et à préparer un échange utile."
              : "تساعدنا بعض المعلومات على فهم احتياجك والاستعداد لحوار مفيد."}
          </p>
          <div className="contact-note">
            <Clock3 size={17} />
            <span>
              {lang === "fr"
                ? "Le calendrier est défini selon le périmètre de chaque projet."
                : "يحدد الجدول وفق نطاق كل مشروع."}
            </span>
          </div>
          <div className="contact-note">
            <MapPin size={17} />
            <span>
              {lang === "fr"
                ? "Accompagnement des entreprises au Maroc."
                : "مواكبة الشركات في المغرب."}
            </span>
          </div>
        </div>
        <QuoteForm lang={lang} t={t} />
      </section>
    </>
  );
}
function QuoteForm({ lang, t }) {
  const [step, setStep] = useState(0),
    [fields, setFields] = useState({
      services: [],
      sector: "",
      city: "",
      consent: false,
      marketing: false,
    }),
    [status, setStatus] = useState(""),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const q = new URLSearchParams(window.location.search).get("service");
    if (!q) return;
    const map = {
      Présence: "creation-sites-web",
      Immersion: "visites-virtuelles-360",
      Acquisition: "media-buying",
    };
    const slug = map[q] || services.find((x) => tr(lang, x.title) === q)?.slug;
    const found = services.find((x) => x.slug === slug);
    if (found) setFields((f) => ({ ...f, services: [tr(lang, found.title)] }));
  }, []);
  const set = (k, v) => setFields((f) => ({ ...f, [k]: v }));
  const serviceOptions = services.map((s) => tr(lang, s.title));
  const toggle = (x) =>
    set(
      "services",
      fields.services.includes(x)
        ? fields.services.filter((y) => y !== x)
        : [...fields.services, x],
    );
  const selectedSlugs = services
    .filter((s) => fields.services.includes(tr(lang, s.title)))
    .map((s) => s.slug);
  const has = (x) => selectedSlugs.some((slug) => slug.includes(x));
  const next = () => {
    if (step === 0 && (!fields.sector || !fields.city)) {
      setStatus("required");
      return;
    }
    if (step === 1 && !fields.services.length) {
      setStatus("required");
      return;
    }
    setStatus("");
    if (step === 0) emitEvent("quote_start");
    setStep(Math.min(step + 1, 3));
  };
  const back = () => {
    setStatus("");
    setStep(Math.max(step - 1, 0));
  };
  async function submit(e) {
    e.preventDefault();
    if (fields.website) {
      setStatus("error");
      return;
    }
    if (!fields.name || !fields.email || !fields.consent) {
      setStatus("required");
      return;
    }
    if (!siteConfig.formEndpoint) {
      setStatus("demo");
      return;
    }
    let apiAllowed = false;
    if (
      siteConfig.formEndpoint.startsWith("/") &&
      !siteConfig.formEndpoint.startsWith("//")
    )
      apiAllowed = true;
    else {
      try {
        const endpoint = new URL(siteConfig.formEndpoint);
        apiAllowed =
          endpoint.protocol === "https:" &&
          (endpoint.origin === window.location.origin ||
            siteConfig.allowedApiHosts.includes(endpoint.hostname));
      } catch {
        apiAllowed = false;
      }
    }
    if (!apiAllowed) {
      setStatus("error");
      return;
    }
    setBusy(true);
    setStatus("");
    try {
      let res = await fetch(siteConfig.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, language: lang }),
      });
      if (!res.ok) throw new Error("send");
      setStatus("success");
      emitEvent("quote_received");
    } catch {
      setStatus("error");
    } finally {
      setBusy(false);
    }
  }
  const label = (key) => <span className="field-label">{t[key]}</span>;
  const select = (key, options) => (
    <label className="form-field">
      {label(key)}
      <select
        value={fields[key] || ""}
        onChange={(e) => set(key, e.target.value)}
      >
        <option value="">{t.select}</option>
        {options.map((x) => (
          <option key={x}>{x}</option>
        ))}
        <option>{t.noneYet}</option>
      </select>
    </label>
  );
  const input = (key, type = "text", required = false) => (
    <label className="form-field">
      {label(key)}
      <input
        type={type}
        required={required}
        value={fields[key] || ""}
        onChange={(e) => set(key, e.target.value)}
        placeholder={
          key === "city" ? (lang === "fr" ? "Ex. Tanger" : "مثال: طنجة") : ""
        }
      />
    </label>
  );
  const servicesDetail = (
    <div className="conditional-fields">
      {has("360") && (
        <>
          <div className="conditional-title">
            {lang === "fr" ? "Visite virtuelle" : "جولة افتراضية"}
          </div>
          {select(
            "placeType",
            [
              "Hôtel / riad",
              "Restaurant",
              "Bien immobilier",
              "Établissement de formation",
              "Showroom / autre",
            ].map((x) => tx(lang, x)),
          )}
          {select(
            "area",
            ["Moins de 100 m²", "100–500 m²", "Plus de 500 m²"].map((x) =>
              tx(lang, x),
            ),
          )}
          {select(
            "spaces",
            ["1–3", "4–8", "9 ou plus"].map((x) => tx(lang, x)),
          )}
        </>
      )}
      {has("site") && (
        <>
          <div className="conditional-title">
            {lang === "fr" ? "Site web" : "الموقع الإلكتروني"}
          </div>
          {select(
            "siteType",
            [
              "Site vitrine",
              "Site institutionnel",
              "Landing page",
              "Catalogue",
              "E-commerce",
            ].map((x) => tx(lang, x)),
          )}
          {select(
            "languages",
            ["Français", "Arabe", "Français et arabe", "Autre"].map((x) =>
              tx(lang, x),
            ),
          )}
          {select(
            "features",
            [
              "Formulaire",
              "Réservation",
              "Paiement en ligne",
              "Espace membre",
            ].map((x) => tx(lang, x)),
          )}
          {select("existingSite", [t.yes, t.no])}
        </>
      )}
      {(has("media-buying") ||
        has("acquisition") ||
        has("marketing-digital")) && (
        <>
          <div className="conditional-title">
            {lang === "fr" ? "Publicité digitale" : "الإعلانات الرقمية"}
          </div>
          {select(
            "objective",
            [
              "Notoriété",
              "Demandes de devis",
              "Réservations",
              "Ventes",
              "Autre",
            ].map((x) => tx(lang, x)),
          )}
          {select(
            "channels",
            ["Meta", "Google", "LinkedIn", "À définir"].map((x) => tx(lang, x)),
          )}
          {select(
            "budget",
            [
              "À définir",
              "Moins de 3 000 MAD / mois",
              "3 000–10 000 MAD / mois",
              "Plus de 10 000 MAD / mois",
            ].map((x) => tx(lang, x)),
          )}
        </>
      )}
      {has("ecommerce-cro") && (
        <>
          <div className="conditional-title">E-commerce</div>
          {select("catalogue", [t.yes, t.no])}
          {select(
            "products",
            ["1–20", "21–100", "101–500", "Plus de 500"].map((x) =>
              tx(lang, x),
            ),
          )}
        </>
      )}
      {has("visites-virtuelles-360") ||
      has("creation-sites-web") ||
      has("media-buying") ||
      has("ecommerce-cro") ? null : (
        <div className="conditional-title">
          {lang === "fr" ? "Quelques précisions" : "تفاصيل إضافية"}
        </div>
      )}
    </div>
  );
  return (
    <form className="quote-form" onSubmit={submit}>
      <label className="honeypot" aria-hidden="true">
        Website
        <input
          tabIndex={-1}
          autoComplete="off"
          value={fields.website || ""}
          onChange={(e) => set("website", e.target.value)}
        />
      </label>
      <div className="form-progress">
        <div className="form-progress-head">
          <span>{t.quoteSteps[step]}</span>
          <span>0{step + 1} / 04</span>
        </div>
        <div className="progress-track">
          <i style={{ width: `${(step + 1) * 25}%` }} />
        </div>
        <div className="step-dots">
          {t.quoteSteps.map((x, i) => (
            <span key={x} className={i <= step ? "current" : ""}>
              {x}
            </span>
          ))}
        </div>
      </div>
      {step === 0 && (
        <div className="form-step">
          <h2>
            {lang === "fr" ? "Pour mieux vous situer…" : "لنتعرف على نشاطك…"}
          </h2>
          <p>
            {lang === "fr"
              ? "Dans quel contexte souhaitez-vous avancer ?"
              : "ما المجال الذي ترغب في تطويره؟"}
          </p>
          {select(
            "sector",
            [
              "Hôtellerie & tourisme",
              "Restaurant & événementiel",
              "Immobilier",
              "Éducation & formation",
              "Commerce & showroom",
              "Services aux entreprises",
              "Autre",
            ].map((x) => tx(lang, x)),
          )}
          {input("city", "text", true)}
          <p className="form-hint">{t.required}</p>
        </div>
      )}
      {step === 1 && (
        <div className="form-step">
          <h2>
            {lang === "fr"
              ? "Qu’aimeriez-vous développer ?"
              : "ما الذي ترغب في تطويره؟"}
          </h2>
          <p>
            {lang === "fr"
              ? "Sélectionnez un ou plusieurs sujets."
              : "اختر خدمة واحدة أو أكثر."}
          </p>
          <div className="check-grid">
            {serviceOptions.map((x) => (
              <label
                className={
                  "check-option " +
                  (fields.services.includes(x) ? "checked" : "")
                }
                key={x}
              >
                <input
                  type="checkbox"
                  checked={fields.services.includes(x)}
                  onChange={() => toggle(x)}
                />
                <span>
                  <Check size={14} />
                </span>
                {x}
              </label>
            ))}
          </div>
          <label className="form-field">
            {t.message}
            <textarea
              rows="3"
              value={fields.message || ""}
              onChange={(e) => set("message", e.target.value)}
            />
          </label>
        </div>
      )}
      {step === 2 && (
        <div className="form-step">
          <h2>{t.details}</h2>
          <p>
            {lang === "fr"
              ? "Quelques repères pour préparer une première proposition. Vous pouvez répondre « Je ne sais pas encore »."
              : "بعض التفاصيل لإعداد تصور أولي. يمكنك اختيار «لا أعرف بعد»."}
          </p>
          {servicesDetail}
          <label className="form-field">
            {lang === "fr" ? "Autres informations" : "معلومات أخرى"}
            <textarea
              rows="3"
              value={fields.other || ""}
              onChange={(e) => set("other", e.target.value)}
            />
          </label>
        </div>
      )}
      {step === 3 && (
        <div className="form-step">
          <h2>
            {lang === "fr" ? "Comment vous joindre ?" : "كيف نتواصل معك؟"}
          </h2>
          <p>
            {lang === "fr"
              ? "Vos coordonnées servent uniquement à répondre à votre demande."
              : "تستخدم بياناتك للرد على طلبك فقط."}
          </p>
          <div className="form-two">
            {input("name", "text", true)}
            {input("email", "email", true)}
          </div>
          <div className="form-two">
            {input("phone", "tel")}
            {input("company")}
          </div>
          <label className="consent">
            <input
              type="checkbox"
              checked={fields.consent}
              onChange={(e) => set("consent", e.target.checked)}
            />
            <span>{t.consent}</span>
          </label>
          <label className="consent">
            <input
              type="checkbox"
              checked={fields.marketing}
              onChange={(e) => set("marketing", e.target.checked)}
            />
            <span>{t.marketing}</span>
          </label>
          <div className="summary-card">
            <b>{lang === "fr" ? "Récapitulatif" : "الملخص"}</b>
            <span>
              {fields.sector} · {fields.city}
            </span>
            <span>{fields.services.join(" · ")}</span>
          </div>
        </div>
      )}
      {status === "required" && (
        <div className="form-alert error">
          <X size={16} />
          {t.required}
        </div>
      )}
      {status === "demo" && (
        <div className="form-alert demo-alert">
          <span className="demo-alert-title">{t.demoForm}</span>
          {t.demoFormText}
        </div>
      )}
      {status === "error" && (
        <div className="form-alert error">
          <X size={16} />
          {t.formError}
        </div>
      )}
      {status === "success" && (
        <div className="form-alert success">
          <Check size={17} />
          {t.formSuccess}
        </div>
      )}
      <div className="form-actions">
        {step > 0 && (
          <button
            type="button"
            className="button button-outline"
            onClick={back}
          >
            <ChevronLeft size={16} />
            {t.back}
          </button>
        )}
        {step < 3 ? (
          <button type="button" className="button button-dark" onClick={next}>
            {t.next}
            <ChevronRight size={16} />
          </button>
        ) : (
          <button type="submit" className="button button-dark" disabled={busy}>
            {busy ? (
              <RefreshCw size={16} className="spin" />
            ) : (
              <Send size={16} />
            )}{" "}
            {busy ? (lang === "fr" ? "Envoi…" : "جارٍ الإرسال…") : t.send}
          </button>
        )}
      </div>
      <div className="privacy-hint">
        <Globe size={14} />
        {lang === "fr"
          ? "N’envoyez pas de données sensibles via ce formulaire."
          : "لا ترسل معلومات حساسة عبر هذا النموذج."}
      </div>
    </form>
  );
}
function CTA({ t, service }) {
  return (
    <section className="final-cta">
      <div className="final-cta-bg">
        <i />
        <i />
        <i />
      </div>
      <div className="eyebrow light">✳ {t.contactLabel}</div>
      <h2>{t.final}</h2>
      <p>
        {service ? `${service} — ` : ""}
        {t.finalText}
      </p>
      <Link
        to={
          service
            ? "/contact?service=" + encodeURIComponent(service)
            : "/contact"
        }
        className="button button-mint"
      >
        {t.cta}
        <ArrowUpRight size={17} />
      </Link>
      <span className="cta-coordinates">{t.eyebrow}</span>
    </section>
  );
}
function LegalPage({ lang, t, privacy }) {
  return (
    <>
      <PageHero
        kicker={privacy ? t.privacy : t.legal}
        title={privacy ? t.privacy : t.legal}
        desc={
          lang === "fr"
            ? "Informations à compléter avant la mise en production."
            : "معلومات يجب استكمالها قبل النشر."
        }
        t={t}
        actions={false}
      />
      <section className="section legal-copy">
        <h2>{lang === "fr" ? "Éditeur du site" : "ناشر الموقع"}</h2>
        <p>
          {lang === "fr"
            ? `Nom : ${siteConfig.agencyName} (nom provisoire, à confirmer). Adresse, forme juridique, identifiant légal et coordonnées : à compléter avant publication.`
            : `الاسم: ${siteConfig.agencyName} (اسم مؤقت قيد التأكيد). يجب استكمال العنوان والشكل القانوني والمعرفات وبيانات التواصل قبل النشر.`}
        </p>
        <h2>
          {lang === "fr" ? "Hébergement & contact" : "الاستضافة والتواصل"}
        </h2>
        <p>
          {lang === "fr"
            ? "Hébergeur et coordonnées : à renseigner dans la configuration de mise en production."
            : "يجب إدخال بيانات الاستضافة والتواصل في إعدادات النشر."}
        </p>
        <h2>
          {privacy
            ? "Données et confidentialité"
            : "Responsabilité & propriété intellectuelle"}
        </h2>
        <p>
          {privacy
            ? lang === "fr"
              ? "Le formulaire de ce prototype ne transmet ni ne conserve les demandes. Lorsqu’un service d’envoi sera connecté, la politique devra préciser le responsable, les finalités, la base juridique, les destinataires, la durée de conservation et les droits des personnes. Les traceurs facultatifs ne seront activés qu’après configuration et consentement applicable."
              : "لا يرسل هذا النموذج التجريبي الطلبات ولا يحفظها. عند ربط خدمة إرسال يجب توضيح المسؤول والأغراض والأساس القانوني والمستلمين ومدة الحفظ والحقوق. لن تفعّل أدوات التتبع الاختيارية إلا وفق الموافقة المطلوبة."
            : lang === "fr"
              ? "Les contenus de ce site sont des exemples originaux de démonstration. Les photographies, polices, services tiers et droits d’utilisation devront être vérifiés avant mise en production."
              : "محتوى هذا الموقع أمثلة أصلية تجريبية. يجب التحقق من الصور والخطوط وخدمات الأطراف الثالثة وحقوق الاستخدام قبل النشر."}
        </p>
        <div className="disclaimer-card">
          <ImageIcon size={19} />
          <p>
            {lang === "fr"
              ? "Ce site est une première version de démonstration. Les mentions entre crochets et informations légales doivent être validées par l’agence avant publication."
              : "هذا الموقع نسخة تجريبية أولية. يجب مراجعة البيانات القانونية وإكمالها من الوكالة قبل النشر."}
          </p>
        </div>
      </section>
    </>
  );
}
function NotFound({ t }) {
  return (
    <section className="not-found">
      <span>404 / 0</span>
      <h1>{t.discover}</h1>
      <p>{t.faqSub}</p>
      <Link to="/" className="button button-dark">
        {t.home}
        <ArrowRight size={17} />
      </Link>
    </section>
  );
}
function Footer({ lang, t }) {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Link to="/" className="brand">
            <span className="brand-mark">
              <i />
              <i />
              <i />
            </span>
            <span className="brand-text">
              <b>{siteConfig.agencyName.split(" ")[0].toLowerCase()}</b>
              <small>
                {siteConfig.agencyName
                  .split(" ")
                  .slice(1)
                  .join(" ")
                  .toUpperCase()}
              </small>
            </span>
          </Link>
          <p>{t.footer}</p>
          <span className="footer-place">
            <MapPin size={14} />
            {lang === "fr"
              ? "Maroc · Accompagnement digital"
              : "المغرب · مواكبة رقمية"}
          </span>
        </div>
        <div className="footer-col">
          <b>{t.nav[0]}</b>
          {services.slice(0, 4).map((s) => (
            <Link to={"/services/" + s.slug} key={s.slug}>
              {tr(lang, s.title)}
            </Link>
          ))}
        </div>
        <div className="footer-col">
          <b>{t.nav[1]}</b>
          {sectors.slice(0, 4).map((s) => (
            <Link to={s[3]} key={s[3]}>
              {tx(lang, s[0])}
            </Link>
          ))}
        </div>
        <div className="footer-col">
          <b>{t.nav[3]}</b>
          <Link to="/agence">{t.about}</Link>
          <Link to="/offres">{t.more}</Link>
          <Link to="/realisations">{t.allProjects}</Link>
          <Link to="/conseils">{t.blog}</Link>
          <Link to="/contact">{t.contact}</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} {siteConfig.agencyName} ·{" "}
          {lang === "fr" ? "Nom provisoire" : "اسم مؤقت"}
        </span>
        <div>
          <Link to="/confidentialite">{t.privacy}</Link>
          <Link to="/mentions-legales">{t.legal}</Link>
        </div>
        <span>{lang === "fr" ? "Maroc · Digital" : "المغرب · رقمي"}</span>
      </div>
    </footer>
  );
}

if (typeof document !== "undefined") {
  const root = document.getElementById("root");
  if (root.hasChildNodes()) hydrateRoot(root, <App />);
  else createRoot(root).render(<App />);
}
