export function googleMapsSearchUrl(query) {
  const url = new URL("https://www.google.com/maps/search/");
  url.searchParams.set("api", "1");
  url.searchParams.set("query", query);
  return url.toString();
}

/** Validates a user-initiated Google Maps place/search URL (not an iframe source). */
export function parseGoogleMapsCoordinates(value) {
  if (!value || typeof value !== "string") return null;
  const iframeSource = value.match(/<iframe\b[^>]*\bsrc\s*=\s*([\"'])(.*?)\1/i);
  const source = (iframeSource?.[2] || value).replaceAll("&amp;", "&");
  const patterns = [
    /@(-?\d{1,3}(?:\.\d+)?),\s*(-?\d{1,3}(?:\.\d+)?)/,
    /!3d(-?\d{1,3}(?:\.\d+)?)!4d(-?\d{1,3}(?:\.\d+)?)/,
  ];
  for (const pattern of patterns) {
    const match = source.match(pattern);
    if (match) {
      const latitude = Number(match[1]);
      const longitude = Number(match[2]);
      if (
        latitude >= -90 &&
        latitude <= 90 &&
        longitude >= -180 &&
        longitude <= 180
      )
        return { latitude, longitude };
    }
  }
  try {
    const url = new URL(source);
    for (const key of ["query", "q", "ll", "center"]) {
      const match = url.searchParams
        .get(key)
        ?.match(/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/);
      if (!match) continue;
      const latitude = Number(match[1]);
      const longitude = Number(match[2]);
      if (
        latitude >= -90 &&
        latitude <= 90 &&
        longitude >= -180 &&
        longitude <= 180
      )
        return { latitude, longitude };
    }
  } catch {
    return null;
  }
  return null;
}

export function normalizeGoogleMapsSearchUrl(value) {
  if (!value || typeof value !== "string") return "";
  try {
    const url = new URL(value.trim());
    const host = url.hostname.toLowerCase();
    const isGoogleMapsHost =
      host === "www.google.com" ||
      host === "maps.google.com" ||
      host === "maps.app.goo.gl";
    if (
      url.protocol !== "https:" ||
      !isGoogleMapsHost ||
      url.username ||
      url.password
    )
      return "";
    if (host === "maps.app.goo.gl") return url.toString();
    if (!url.pathname.startsWith("/maps/")) return "";
    if (url.pathname === "/maps/search/" && url.searchParams.get("api") !== "1")
      return "";
    return url.toString();
  } catch {
    return "";
  }
}

const ALLOWED_EMBED_PATHS = new Set([
  "/maps/embed",
  "/maps/d/embed",
  "/maps/embed/v1/place",
  "/maps/embed/v1/view",
  "/maps/embed/v1/directions",
  "/maps/embed/v1/streetview",
  "/maps/embed/v1/search",
]);

/** Accept official Google Maps iframe URLs only; never ingest Google imagery. */
export function normalizeGoogleMapsEmbedUrl(value) {
  if (!value || typeof value !== "string") return "";
  const input = value.trim();
  const iframeSource = input.match(/<iframe\b[^>]*\bsrc\s*=\s*([\"'])(.*?)\1/i);
  const source = (iframeSource?.[2] || input).replaceAll("&amp;", "&");
  try {
    const url = new URL(source);
    if (
      url.protocol !== "https:" ||
      url.hostname.toLowerCase() !== "www.google.com" ||
      !ALLOWED_EMBED_PATHS.has(url.pathname) ||
      url.username ||
      url.password
    )
      return "";

    if (
      url.pathname.startsWith("/maps/embed/v1/") &&
      !url.searchParams.has("key")
    )
      return "";
    if (url.pathname === "/maps/d/embed" && !url.searchParams.has("mid"))
      return "";
    if (
      url.pathname === "/maps/embed" &&
      !url.searchParams.has("pb") &&
      !url.searchParams.has("q")
    )
      return "";

    return url.toString();
  } catch {
    return "";
  }
}

export function getGoogleMapsApiKey() {
  const config =
    typeof window !== "undefined"
      ? window.__THREEPOINTS_GOOGLE_MAPS__ || {}
      : {};
  return String(config.apiKey || "").trim();
}

export function googleMapsPlaceEmbedUrl(query) {
  const key = getGoogleMapsApiKey();
  if (!key || !query) return "";
  const url = new URL("https://www.google.com/maps/embed/v1/place");
  url.searchParams.set("key", key);
  url.searchParams.set("q", query);
  return url.toString();
}

export function googleMapsPanoUrl(panoId) {
  if (!panoId) return "";
  const url = new URL("https://www.google.com/maps/@");
  url.searchParams.set("api", "1");
  url.searchParams.set("map_action", "pano");
  url.searchParams.set("pano", panoId);
  return url.toString();
}

export function googleStreetViewEmbedUrl(panoId) {
  const key = getGoogleMapsApiKey();
  if (!key || !panoId) return "";
  const url = new URL("https://www.google.com/maps/embed/v1/streetview");
  url.searchParams.set("key", key);
  url.searchParams.set("pano", panoId);
  return url.toString();
}

export async function loadGoogleMapsJavascriptApi() {
  if (typeof window === "undefined" || typeof document === "undefined")
    throw new Error(
      "Google Maps est disponible uniquement dans le navigateur.",
    );
  const key = getGoogleMapsApiKey();
  if (!key)
    throw new Error(
      "Clé Google Maps absente. Ajoute une clé publique restreinte à public/google-maps-config.js.",
    );
  if (window.google?.maps?.StreetViewService) return window.google.maps;
  if (window.__THREEPOINTS_MAPS_PROMISE__)
    return window.__THREEPOINTS_MAPS_PROMISE__;

  window.__THREEPOINTS_MAPS_PROMISE__ = new Promise((resolve, reject) => {
    const callback = "__threepointsGoogleMapsReady";
    const timer = window.setTimeout(
      () =>
        reject(
          new Error(
            "Google Maps ne répond pas. Vérifie la clé, les restrictions et les API activées.",
          ),
        ),
      15000,
    );
    window[callback] = () => {
      window.clearTimeout(timer);
      resolve(window.google.maps);
    };
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&callback=${callback}&v=weekly`;
    script.async = true;
    script.onerror = () => {
      window.clearTimeout(timer);
      reject(new Error("Impossible de charger l’API JavaScript Google Maps."));
    };
    document.head.appendChild(script);
  }).catch((error) => {
    delete window.__THREEPOINTS_MAPS_PROMISE__;
    throw error;
  });
  return window.__THREEPOINTS_MAPS_PROMISE__;
}

export async function verifyStreetViewAt(latitude, longitude, radius = 100) {
  const lat = Number(latitude);
  const lng = Number(longitude);
  if (!Number.isFinite(lat) || lat < -90 || lat > 90)
    throw new Error("Latitude invalide (valeur entre -90 et 90).");
  if (!Number.isFinite(lng) || lng < -180 || lng > 180)
    throw new Error("Longitude invalide (valeur entre -180 et 180).");

  const maps = await loadGoogleMapsJavascriptApi();
  const service = new maps.StreetViewService();
  const request = { location: { lat, lng }, radius };
  if (maps.StreetViewSource?.DEFAULT)
    request.source = maps.StreetViewSource.DEFAULT;

  return new Promise((resolve) => {
    service.getPanorama(request, (data, status) => {
      const available =
        status === maps.StreetViewStatus?.OK && Boolean(data?.location?.pano);
      const position = data?.location?.latLng;
      resolve({
        available,
        panoId: available ? data.location.pano : "",
        latitude: position?.lat?.() ?? null,
        longitude: position?.lng?.() ?? null,
        status: String(status || "UNKNOWN"),
      });
    });
  });
}
