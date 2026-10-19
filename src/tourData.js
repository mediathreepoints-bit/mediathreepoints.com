import { googleMapsSearchUrl } from "./lib/googleMaps.js";

export const staticTours = [
  {
    id: "kenitra-kasbah-mehdia",
    slug: "kasbah-de-mehdia",
    title: ["Kasbah de Mehdia", "قصبة المهدية"],
    category: ["Patrimoine & histoire", "التراث والتاريخ"],
    description: [
      "Fiche de découverte de la Kasbah de Mehdia, à Kénitra. L’emplacement Google Maps est accessible ; la disponibilité Street View n’a pas encore été vérifiée et aucun panorama Threepoints n’est fourni.",
      "بطاقة لاكتشاف قصبة المهدية في القنيطرة. يمكن فتح موقعها على خرائط Google؛ لم يتم بعد التحقق من توفر Street View ولا توجد بانوراما خاصة بـ Threepoints.",
    ],
    isKenitra: true,
    googleMapsLat: 34.26417,
    googleMapsLng: -6.6575,
    googleMapsLink: googleMapsSearchUrl("34.26417,-6.65750"),
    streetViewStatus: "not-checked",
    streetViewPanoId: "",
    visualNote: [
      "Illustration conceptuelle — ne représente pas une photographie du site",
      "صورة مفاهيمية — لا تمثل صورة فوتوغرافية للموقع",
    ],
    cover: "/images/kenitra/kasbah-mehdia-concept.jpg",
    gallery: [
      {
        src: "/images/kenitra/kasbah-mehdia-concept.jpg",
        alt: [
          "Illustration conceptuelle d’une kasbah côtière, pas une photo de la Kasbah de Mehdia",
          "تصور فني لقصبة ساحلية، وليس صورة لقصبة المهدية",
        ],
      },
    ],
    scenes: [],
  },
  {
    id: "kenitra-plage-mehdia",
    slug: "plage-de-mehdia",
    title: ["Plage de Mehdia", "شاطئ المهدية"],
    category: ["Littoral & loisirs", "الساحل والأنشطة"],
    description: [
      "Fiche de découverte de la plage de Mehdia, près de Kénitra. Le lien Google Maps ouvre le repère proposé ; la couverture Street View reste à vérifier avant d’annoncer une expérience panoramique.",
      "بطاقة لاكتشاف شاطئ المهدية قرب القنيطرة. يفتح رابط خرائط Google الموقع المقترح؛ ويجب التحقق من توفر Street View قبل الإعلان عن تجربة بانورامية.",
    ],
    isKenitra: true,
    googleMapsLat: 34.25471,
    googleMapsLng: -6.68006,
    googleMapsLink: googleMapsSearchUrl("34.25471,-6.68006"),
    streetViewStatus: "not-checked",
    streetViewPanoId: "",
    visualNote: [
      "Illustration conceptuelle — ne représente pas une photographie du site",
      "صورة مفاهيمية — لا تمثل صورة فوتوغرافية للموقع",
    ],
    cover: "/images/kenitra/mehdia-beach-concept.jpg",
    gallery: [
      {
        src: "/images/kenitra/mehdia-beach-concept.jpg",
        alt: [
          "Illustration conceptuelle d’une plage atlantique, pas une photographie de la plage de Mehdia",
          "تصور فني لشاطئ أطلسي، وليس صورة لشاطئ المهدية",
        ],
      },
    ],
    scenes: [],
  },
  {
    id: "kenitra-lac-sidi-boughaba",
    slug: "lac-sidi-boughaba",
    title: ["Lac Sidi Boughaba", "بحيرة سيدي بوغابة"],
    category: ["Nature & biodiversité", "الطبيعة والتنوع البيولوجي"],
    description: [
      "Fiche de découverte du lac Sidi Boughaba et de son environnement naturel. La carte Google est disponible ; un panorama Street View ne sera affiché qu’après vérification effective de sa disponibilité.",
      "بطاقة لاكتشاف بحيرة سيدي بوغابة ومحيطها الطبيعي. خريطة Google متاحة؛ ولن يُعرض بانوراما Street View إلا بعد التحقق الفعلي من توفره.",
    ],
    isKenitra: true,
    googleMapsLat: 34.2409,
    googleMapsLng: -6.6739,
    googleMapsLink: googleMapsSearchUrl("34.24090,-6.67390"),
    streetViewStatus: "not-checked",
    streetViewPanoId: "",
    visualNote: [
      "Illustration conceptuelle — ne représente pas une photographie du site",
      "صورة مفاهيمية — لا تمثل صورة فوتوغرافية للموقع",
    ],
    cover: "/images/kenitra/sidi-boughaba-concept.jpg",
    gallery: [
      {
        src: "/images/kenitra/sidi-boughaba-concept.jpg",
        alt: [
          "Illustration conceptuelle d’un lac et d’une zone humide, pas une photographie de Sidi Boughaba",
          "تصور فني لبحيرة ومنطقة رطبة، وليس صورة لسيدي بوغابة",
        ],
      },
    ],
    scenes: [],
  },
  {
    id: "kenitra-corniche-sebou",
    slug: "corniche-du-sebou",
    title: ["Corniche du Sebou", "كورنيش سبو"],
    category: ["Promenade urbaine", "نزهة حضرية"],
    description: [
      "Fiche de découverte des berges et de la corniche du Sebou à Kénitra. Le lieu s’ouvre sur Google Maps ; la présence d’un panorama Street View reste à vérifier.",
      "بطاقة لاكتشاف ضفاف وكورنيش سبو في القنيطرة. يمكن فتح الموقع على خرائط Google؛ ولا يزال توفر بانوراما Street View بحاجة إلى التحقق.",
    ],
    isKenitra: true,
    googleMapsLat: 34.267605,
    googleMapsLng: -6.590722,
    googleMapsLink: googleMapsSearchUrl("34.267605,-6.590722"),
    streetViewStatus: "not-checked",
    streetViewPanoId: "",
    visualNote: [
      "Illustration conceptuelle — ne représente pas une photographie du site",
      "صورة مفاهيمية — لا تمثل صورة فوتوغرافية للموقع",
    ],
    cover: "/images/kenitra/corniche-sebou-concept.jpg",
    gallery: [
      {
        src: "/images/kenitra/corniche-sebou-concept.jpg",
        alt: [
          "Illustration conceptuelle d’une promenade fluviale, pas une photographie de la corniche du Sebou",
          "تصور فني لممشى نهري، وليس صورة لكورنيش سبو",
        ],
      },
    ],
    scenes: [],
  },
];
