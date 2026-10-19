import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  FileImage,
  Film,
  ImagePlus,
  LogOut,
  MapPin,
  Plus,
  Save,
  ShieldCheck,
  Upload,
  X,
} from "lucide-react";
import {
  createAssetUrl,
  supabase,
  supabaseConfigured,
} from "../lib/supabase.js";
import {
  getGoogleMapsApiKey,
  normalizeGoogleMapsEmbedUrl,
  parseGoogleMapsCoordinates,
  normalizeGoogleMapsSearchUrl,
  verifyStreetViewAt,
} from "../lib/googleMaps.js";
import "./tour-admin.css";

const blankTour = () => ({
  slug: "",
  title_fr: "",
  title_ar: "",
  category_fr: "",
  category_ar: "",
  description_fr: "",
  description_ar: "",
  cover_path: "",
  plan_path: "",
  google_maps_url: "",
  google_maps_lat: "",
  google_maps_lng: "",
  street_view_pano_id: "",
  street_view_status: "not-checked",
  street_view_verified_at: "",
  gallery_paths: [],
  is_published: false,
  sort_order: 0,
});
const cleanSlug = (value) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
const safeFileName = (name) =>
  name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-");

export default function TourAdminPage() {
  const [session, setSession] = useState(null);
  const [authState, setAuthState] = useState("checking");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [tours, setTours] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [draft, setDraft] = useState(blankTour());
  const [selectedSceneId, setSelectedSceneId] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [planUrl, setPlanUrl] = useState("");
  const [planPoint, setPlanPoint] = useState(null);
  const [hotspotForm, setHotspotForm] = useState(null);
  const [hotspotPosition, setHotspotPosition] = useState(null);
  const [embedText, setEmbedText] = useState("");
  const [confirmPanoramas, setConfirmPanoramas] = useState(false);

  const activeTour = tours.find((tour) => tour.id === selectedId) || null;
  const scenes = activeTour?.scenes || [];
  const activeScene =
    scenes.find((scene) => scene.id === selectedSceneId) || scenes[0] || null;
  const hotspots = activeScene?.hotspots || [];
  const isPublishable =
    scenes.length > 0 &&
    scenes.every((scene) => scene.panorama_path && scene.panorama_confirmed);
  const hasGoogleMapsEmbed = Boolean(
    normalizeGoogleMapsEmbedUrl(activeTour?.google_maps_url || "") ||
      normalizeGoogleMapsSearchUrl(activeTour?.google_maps_url || ""),
  );
  const hasVerifiedStreetView =
    activeTour?.street_view_status === "available" &&
    Boolean(activeTour.street_view_pano_id) &&
    Boolean(activeTour.street_view_verified_at);
  const canPublish = scenes.length
    ? isPublishable
    : hasGoogleMapsEmbed || hasVerifiedStreetView;

  useEffect(() => setConfirmPanoramas(false), [selectedId]);

  const setField = (field, value) =>
    setDraft((current) => ({ ...current, [field]: value }));
  const setGoogleCoordinate = (field, value) =>
    setDraft((current) => ({
      ...current,
      [field]: value,
      street_view_pano_id: "",
      street_view_status: "not-checked",
      street_view_verified_at: "",
    }));
  const setGoogleMapsUrl = (value) => {
    const coordinates = parseGoogleMapsCoordinates(value);
    setDraft((current) => ({
      ...current,
      google_maps_url: value,
      google_maps_lat:
        coordinates?.latitude ??
        (value === current.google_maps_url ? current.google_maps_lat : ""),
      google_maps_lng:
        coordinates?.longitude ??
        (value === current.google_maps_url ? current.google_maps_lng : ""),
      street_view_pano_id: "",
      street_view_status: "not-checked",
      street_view_verified_at: "",
    }));
  };
  const setHotspotField = (field, value) =>
    setHotspotForm((current) => ({ ...current, [field]: value }));

  const refreshTours = useCallback(
    async (keepId = selectedId) => {
      if (!supabase) return;
      const { data, error } = await supabase
        .from("tours")
        .select(
          "*, scenes:tour_scenes(id, name_fr, name_ar, panorama_path, panorama_confirmed, thumbnail_path, sort_order, plan_x, plan_y, hotspots:tour_hotspots(*))",
        )
        .order("sort_order", { ascending: true });
      if (error) {
        setNotice(error.message);
        return;
      }
      const nextTours = data || [];
      setTours(nextTours);
      const nextId = nextTours.some((tour) => tour.id === keepId)
        ? keepId
        : nextTours[0]?.id || "";
      setSelectedId(nextId);
      const nextTour = nextTours.find((tour) => tour.id === nextId);
      setDraft(nextTour ? { ...blankTour(), ...nextTour } : blankTour());
      setSelectedSceneId((previous) =>
        nextTour?.scenes?.some((scene) => scene.id === previous)
          ? previous
          : nextTour?.scenes?.[0]?.id || "",
      );
    },
    [selectedId],
  );

  const checkAdmin = useCallback(
    async (currentSession) => {
      if (!supabase || !currentSession) {
        setAuthState("logged-out");
        return;
      }
      setSession(currentSession);
      setAuthState("checking-role");
      const { data, error } = await supabase.rpc("is_tour_admin");
      if (error || data !== true) {
        setAuthState("denied");
        return;
      }
      setAuthState("admin");
      await refreshTours("");
    },
    [refreshTours],
  );

  useEffect(() => {
    if (!supabaseConfigured || !supabase) {
      setAuthState("unconfigured");
      return;
    }
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) checkAdmin(data.session);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      if (nextSession) checkAdmin(nextSession);
      else {
        setSession(null);
        setAuthState("logged-out");
      }
    });
    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, [checkAdmin]);

  useEffect(() => {
    if (!activeScene?.panorama_path) {
      setPreviewUrl("");
      return;
    }
    let mounted = true;
    createAssetUrl(activeScene.panorama_path).then((url) => {
      if (mounted) setPreviewUrl(url);
    });
    return () => {
      mounted = false;
    };
  }, [activeScene?.panorama_path]);

  useEffect(() => {
    if (!draft.plan_path) {
      setPlanUrl("");
      return;
    }
    let mounted = true;
    createAssetUrl(draft.plan_path).then((url) => {
      if (mounted) setPlanUrl(url);
    });
    return () => {
      mounted = false;
    };
  }, [draft.plan_path]);

  const signIn = async (event) => {
    event.preventDefault();
    setBusy(true);
    setAuthError("");
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setBusy(false);
    if (error) setAuthError(error.message);
    else if (data.session) await checkAdmin(data.session);
  };

  const signOut = async () => {
    await supabase?.auth.signOut();
    setSession(null);
    setAuthState("logged-out");
    setTours([]);
    setSelectedId("");
    setDraft(blankTour());
  };

  const addTour = async () => {
    if (!supabase) return;
    setBusy(true);
    const { data, error } = await supabase
      .from("tours")
      .insert({
        ...blankTour(),
        title_fr: "Nouvelle visite",
        slug: `nouvelle-visite-${Date.now()}`,
      })
      .select("id")
      .single();
    setBusy(false);
    if (error) return setNotice(error.message);
    setNotice("Visite créée. Complète son titre, sa catégorie et son contenu.");
    await refreshTours(data.id);
  };

  const saveTour = async (event) => {
    event.preventDefault();
    if (!activeTour || !supabase) return;
    const googleMapsUrl =
      normalizeGoogleMapsEmbedUrl(draft.google_maps_url) ||
      normalizeGoogleMapsSearchUrl(draft.google_maps_url);
    if (draft.google_maps_url?.trim() && !googleMapsUrl) {
      setNotice(
        "Lien Google Maps invalide. Colle une URL officielle de lieu/recherche ou une URL /maps/embed.",
      );
      return;
    }
    const hasLatitude = String(draft.google_maps_lat ?? "").trim() !== "";
    const hasLongitude = String(draft.google_maps_lng ?? "").trim() !== "";
    const latitude = hasLatitude ? Number(draft.google_maps_lat) : null;
    const longitude = hasLongitude ? Number(draft.google_maps_lng) : null;
    if (
      hasLatitude !== hasLongitude ||
      (hasLatitude &&
        (!Number.isFinite(latitude) ||
          latitude < -90 ||
          latitude > 90 ||
          !Number.isFinite(longitude) ||
          longitude < -180 ||
          longitude > 180))
    ) {
      setNotice(
        "Renseigne une latitude (-90 à 90) et une longitude (-180 à 180) valides.",
      );
      return;
    }
    if (
      draft.street_view_status === "available" &&
      (!draft.street_view_pano_id ||
        !draft.street_view_verified_at ||
        !hasLatitude)
    ) {
      setNotice(
        "Le statut Street View vérifié nécessite une vérification API liée à des coordonnées.",
      );
      return;
    }
    const remainsPublishable =
      Boolean(googleMapsUrl) ||
      (draft.street_view_status === "available" &&
        draft.street_view_pano_id &&
        draft.street_view_verified_at) ||
      activeTour.scenes?.some((scene) => scene.panorama_confirmed);
    if (activeTour.is_published && !remainsPublishable) {
      setNotice(
        "Cette fiche publiée n’a ni carte Google enregistrée ni panorama vérifié. Masque-la avant de modifier ses coordonnées ou sa vérification.",
      );
      return;
    }
    setBusy(true);
    const payload = {
      slug: cleanSlug(draft.slug),
      title_fr: draft.title_fr.trim(),
      title_ar: draft.title_ar.trim(),
      category_fr: draft.category_fr.trim(),
      category_ar: draft.category_ar.trim(),
      description_fr: draft.description_fr.trim(),
      description_ar: draft.description_ar.trim(),
      cover_path: draft.cover_path || null,
      plan_path: draft.plan_path || null,
      google_maps_url: googleMapsUrl || null,
      google_maps_lat: latitude,
      google_maps_lng: longitude,
      street_view_pano_id: draft.street_view_pano_id || null,
      street_view_status: draft.street_view_status || "not-checked",
      street_view_verified_at: draft.street_view_verified_at || null,
      gallery_paths: draft.gallery_paths || [],
      sort_order: Number(draft.sort_order || 0),
    };
    const { error } = await supabase
      .from("tours")
      .update(payload)
      .eq("id", activeTour.id);
    setBusy(false);
    if (error) return setNotice(error.message);
    setNotice("Modifications enregistrées.");
    await refreshTours(activeTour.id);
  };

  const setPublished = async () => {
    if (!activeTour || !supabase) return;
    if (!activeTour.is_published && !canPublish) {
      setNotice(
        "Ajoute un panorama 2:1 confirmé, vérifie Street View avec la clé Maps, ou enregistre une URL Google Maps officielle.",
      );
      return;
    }
    setBusy(true);
    const { error } = await supabase
      .from("tours")
      .update({ is_published: !activeTour.is_published })
      .eq("id", activeTour.id);
    setBusy(false);
    if (error) return setNotice(error.message);
    setNotice(
      activeTour.is_published
        ? "Visite masquée du site public."
        : isPublishable
          ? "Visite 360° publiée."
          : hasVerifiedStreetView
            ? "Street View vérifié et fiche publiée."
            : "Fiche Google Maps publiée ; aucune visite 360° n’est annoncée sans panorama vérifié.",
    );
    await refreshTours(activeTour.id);
  };

  const verifyGoogleStreetView = async () => {
    if (!activeTour || !supabase) return;
    if (!getGoogleMapsApiKey()) {
      setNotice(
        "Configure une clé Google Maps publique et limitée aux domaines autorisés dans public/google-maps-config.js.",
      );
      return;
    }
    const latitude = Number(draft.google_maps_lat);
    const longitude = Number(draft.google_maps_lng);
    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      setNotice("Renseigne d’abord une latitude et une longitude valides.");
      return;
    }
    setBusy(true);
    try {
      const result = await verifyStreetViewAt(latitude, longitude, 100);
      const updates = {
        google_maps_lat: latitude,
        google_maps_lng: longitude,
        street_view_pano_id: result.available ? result.panoId : null,
        street_view_status: result.available ? "available" : "unavailable",
        street_view_verified_at: new Date().toISOString(),
      };
      const { error } = await supabase
        .from("tours")
        .update(updates)
        .eq("id", activeTour.id);
      if (error) throw error;
      await refreshTours(activeTour.id);
      setNotice(
        result.available
          ? "Street View trouvé à moins de 100 m du repère et vérifié. Enregistre le projet, puis publie si souhaité."
          : "Aucun panorama Street View trouvé à moins de 100 m de ce repère. La carte Google reste disponible.",
      );
    } catch (error) {
      setNotice(error.message || "La vérification Street View a échoué.");
    } finally {
      setBusy(false);
    }
  };

  const uploadAsset = async (file) => {
    if (!supabase || !activeTour || !file)
      throw new Error("Sélectionne une visite et un fichier.");
    const path = `${activeTour.id}/${crypto.randomUUID()}-${safeFileName(file.name)}`;
    const { error } = await supabase.storage
      .from("tour-assets")
      .upload(path, file, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });
    if (error) throw error;
    return path;
  };

  const uploadPanoramas = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!activeTour || !files.length) return;
    if (!confirmPanoramas) {
      setNotice(
        "Confirme d’abord les droits d’utilisation et l’authenticité équirectangulaire 360° des fichiers.",
      );
      return;
    }
    setBusy(true);
    try {
      let order = scenes.length;
      for (const file of files) {
        if (!/^image\/(jpeg|png|webp)$/.test(file.type))
          throw new Error(`${file.name} : format image non pris en charge.`);
        const bitmap = await createImageBitmap(file);
        const ratio = bitmap.width / bitmap.height;
        const valid = bitmap.width >= 1024 && Math.abs(ratio - 2) < 0.005;
        bitmap.close?.();
        if (!valid)
          throw new Error(
            `${file.name} : panorama refusé. Il faut une image équirectangulaire 2:1 (minimum 1024 × 512 px).`,
          );
        const path = await uploadAsset(file);
        const base = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
        const { error } = await supabase.from("tour_scenes").insert({
          tour_id: activeTour.id,
          name_fr: base,
          name_ar: base,
          panorama_path: path,
          panorama_confirmed: true,
          sort_order: order++,
        });
        if (error) throw error;
      }
      setNotice(`${files.length} panorama(s) importé(s).`);
      await refreshTours(activeTour.id);
    } catch (error) {
      setNotice(error.message || "Impossible d’importer les panoramas.");
    }
    setBusy(false);
  };

  const uploadCover = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setBusy(true);
    try {
      const path = await uploadAsset(file);
      const { error } = await supabase
        .from("tours")
        .update({ cover_path: path })
        .eq("id", activeTour.id);
      if (error) throw error;
      setDraft((current) => ({ ...current, cover_path: path }));
      setNotice("Image de couverture enregistrée.");
      await refreshTours(activeTour.id);
    } catch (error) {
      setNotice(error.message);
    }
    setBusy(false);
  };

  const uploadPlan = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setBusy(true);
    try {
      const path = await uploadAsset(file);
      const { error } = await supabase
        .from("tours")
        .update({ plan_path: path })
        .eq("id", activeTour.id);
      if (error) throw error;
      setDraft((current) => ({ ...current, plan_path: path }));
      setNotice(
        "Plan enregistré. Clique sur le plan pour placer la scène sélectionnée.",
      );
      await refreshTours(activeTour.id);
    } catch (error) {
      setNotice(error.message);
    }
    setBusy(false);
  };

  const uploadGallery = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length) return;
    setBusy(true);
    try {
      const paths = [];
      for (const file of files) paths.push(await uploadAsset(file));
      const next = [...(draft.gallery_paths || []), ...paths];
      const { error } = await supabase
        .from("tours")
        .update({ gallery_paths: next })
        .eq("id", activeTour.id);
      if (error) throw error;
      setDraft((current) => ({ ...current, gallery_paths: next }));
      setNotice("Images de galerie ajoutées.");
      await refreshTours(activeTour.id);
    } catch (error) {
      setNotice(error.message);
    }
    setBusy(false);
  };

  const saveSceneName = async (sceneId, field, value) => {
    const { error } = await supabase
      .from("tour_scenes")
      .update({ [field]: value })
      .eq("id", sceneId);
    if (error) setNotice(error.message);
    else refreshTours(activeTour.id);
  };

  const setSceneOnPlan = async (event, useCenter = false) => {
    if (!activeScene || !planUrl) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const clientX = useCenter ? rect.left + rect.width / 2 : event.clientX;
    const clientY = useCenter ? rect.top + rect.height / 2 : event.clientY;
    const x = Number((((clientX - rect.left) / rect.width) * 100).toFixed(2));
    const y = Number((((clientY - rect.top) / rect.height) * 100).toFixed(2));
    setPlanPoint({ x, y });
    const { error } = await supabase
      .from("tour_scenes")
      .update({ plan_x: x, plan_y: y })
      .eq("id", activeScene.id);
    if (error) setNotice(error.message);
    else refreshTours(activeTour.id);
  };

  const beginHotspot = (event, useCenter = false) => {
    if (!activeScene || !previewUrl) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const clientX = useCenter ? rect.left + rect.width / 2 : event.clientX;
    const clientY = useCenter ? rect.top + rect.height / 2 : event.clientY;
    const x = Number((((clientX - rect.left) / rect.width) * 100).toFixed(2));
    const y = Number((((clientY - rect.top) / rect.height) * 100).toFixed(2));
    setHotspotPosition({
      x,
      y,
      yaw: Number((x * 3.6 - 180).toFixed(2)),
      pitch: Number((90 - y * 1.8).toFixed(2)),
    });
    setHotspotForm({
      id: "",
      kind: "info",
      title_fr: "",
      title_ar: "",
      text_fr: "",
      text_ar: "",
      target_scene_id: "",
      image_path: "",
      video_path: "",
      link_url: "",
    });
  };

  const editHotspot = (hotspot) => {
    setHotspotPosition({ pitch: hotspot.pitch, yaw: hotspot.yaw });
    setHotspotForm({ ...hotspot });
  };

  const saveHotspot = async (event) => {
    event.preventDefault();
    if (!hotspotForm || !activeScene) return;
    const payload = {
      scene_id: activeScene.id,
      kind: hotspotForm.kind,
      pitch: Number(hotspotPosition?.pitch ?? hotspotForm.pitch ?? 0),
      yaw: Number(hotspotPosition?.yaw ?? hotspotForm.yaw ?? 0),
      title_fr: hotspotForm.title_fr,
      title_ar: hotspotForm.title_ar || "",
      text_fr: hotspotForm.text_fr || "",
      text_ar: hotspotForm.text_ar || "",
      target_scene_id:
        hotspotForm.kind === "scene"
          ? hotspotForm.target_scene_id || null
          : null,
      image_path: hotspotForm.image_path || null,
      video_path: hotspotForm.video_path || null,
      link_url: hotspotForm.link_url || null,
      sort_order: hotspots.length,
    };
    if (payload.kind === "scene" && !payload.target_scene_id)
      return setNotice("Choisis la scène de destination.");
    setBusy(true);
    const query = hotspotForm.id
      ? supabase.from("tour_hotspots").update(payload).eq("id", hotspotForm.id)
      : supabase.from("tour_hotspots").insert(payload);
    const { error } = await query;
    setBusy(false);
    if (error) return setNotice(error.message);
    setHotspotForm(null);
    setHotspotPosition(null);
    setNotice("Point interactif enregistré.");
    await refreshTours(activeTour.id);
  };

  const deleteHotspot = async (hotspotId) => {
    const { error } = await supabase
      .from("tour_hotspots")
      .delete()
      .eq("id", hotspotId);
    if (error) setNotice(error.message);
    else {
      setNotice("Point interactif supprimé.");
      refreshTours(activeTour.id);
    }
  };

  const uploadHotspotMedia = async (field, file) => {
    if (!file || !hotspotForm) return;
    setBusy(true);
    try {
      const path = await uploadAsset(file);
      setHotspotField(field, path);
      setNotice(
        "Fichier ajouté au point interactif. Enregistre le point pour confirmer.",
      );
    } catch (error) {
      setNotice(error.message);
    }
    setBusy(false);
  };

  const copyText = async (value, label) => {
    try {
      await navigator.clipboard.writeText(value);
      setNotice(`${label} copié.`);
    } catch {
      setNotice("Copie impossible dans ce navigateur.");
    }
  };

  const publicUrl = useMemo(
    () =>
      typeof window !== "undefined" && draft.slug
        ? `${window.location.origin}/visites/${draft.slug}`
        : "",
    [draft.slug],
  );
  const iframeSnippet = publicUrl
    ? `<iframe src="${publicUrl}?embed=1" title="${draft.title_fr || "Visite virtuelle"}" loading="lazy" allow="fullscreen; gyroscope; accelerometer" allowfullscreen></iframe>`
    : "";

  if (!supabaseConfigured) return <SetupNotice />;
  if (!supabase) return <SetupNotice />;
  if (authState === "checking" || authState === "checking-role") {
    return (
      <div className="tpa-loading">
        <span className="tpa-spinner" /> Vérification de la session…
      </div>
    );
  }
  if (authState === "denied") {
    return (
      <main className="tpa-shell">
        <header className="tpa-top">
          <a href="/" className="tpa-brand">
            THREEPOINTS <b>MEDIA</b>
          </a>
          <button onClick={signOut}>
            <LogOut size={16} /> Se déconnecter
          </button>
        </header>
        <section className="tpa-auth-card">
          <ShieldCheck size={32} />
          <h1>Accès non autorisé</h1>
          <p>
            Ce compte est authentifié mais n’est pas administrateur de la
            plateforme de visites.
          </p>
          <button className="tpa-primary" onClick={signOut}>
            Déconnexion
          </button>
        </section>
      </main>
    );
  }
  if (authState !== "admin") {
    return (
      <main className="tpa-shell">
        <header className="tpa-top">
          <a href="/" className="tpa-brand">
            THREEPOINTS <b>MEDIA</b>
          </a>
          <a href="/visites" className="tpa-back">
            <ArrowLeft size={16} /> Site public
          </a>
        </header>
        <form className="tpa-auth-card" onSubmit={signIn}>
          <ShieldCheck size={32} />
          <span className="tpa-kicker">ESPACE ADMINISTRATEUR</span>
          <h1>Gestion des visites</h1>
          <p>
            Connecte-toi avec un compte autorisé dans Supabase. La création de
            compte public est désactivée.
          </p>
          <label>
            Adresse e-mail
            <input
              autoComplete="username"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            Mot de passe
            <input
              autoComplete="current-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {authError && (
            <p className="tpa-error" role="alert">
              {authError}
            </p>
          )}
          <button className="tpa-primary" disabled={busy}>
            {busy ? "Connexion…" : "Se connecter"}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="tpa-shell">
      <header className="tpa-top">
        <a href="/" className="tpa-brand">
          THREEPOINTS <b>MEDIA</b>
        </a>
        <div className="tpa-top-actions">
          <span>{session?.user?.email}</span>
          <a href="/visites" className="tpa-back">
            <Eye size={15} /> Aperçu public
          </a>
          <button onClick={signOut}>
            <LogOut size={16} /> Sortir
          </button>
        </div>
      </header>
      <div className="tpa-layout">
        <aside className="tpa-sidebar">
          <div className="tpa-sidebar-title">
            <div>
              <span className="tpa-kicker">PLATEFORME 360°</span>
              <h1>Visites</h1>
            </div>
            <button
              className="tpa-icon-button"
              onClick={addTour}
              disabled={busy}
              aria-label="Créer une visite"
            >
              <Plus size={19} />
            </button>
          </div>
          <p className="tpa-sidebar-copy">
            Gère les projets, les scènes, les hotspots et la publication.
          </p>
          <div className="tpa-tour-list">
            {tours.map((tour) => (
              <button
                key={tour.id}
                className={selectedId === tour.id ? "selected" : ""}
                onClick={() => {
                  setSelectedId(tour.id);
                  setDraft({ ...blankTour(), ...tour });
                  setSelectedSceneId(tour.scenes?.[0]?.id || "");
                  setHotspotForm(null);
                }}
              >
                <span
                  className={`tpa-status ${tour.is_published ? "published" : ""}`}
                />
                <span>
                  <b>{tour.title_fr || "Visite sans titre"}</b>
                  <small>
                    {tour.scenes?.length || 0} scène(s) ·{" "}
                    {tour.is_published ? "Publiée" : "Brouillon"}
                  </small>
                </span>
              </button>
            ))}
            {!tours.length && (
              <p className="tpa-empty-list">
                Aucune visite. Crée un projet ou exécute le SQL de
                configuration.
              </p>
            )}
          </div>
        </aside>
        <section className="tpa-editor">
          {!activeTour ? (
            <div className="tpa-empty-editor">
              <FileImage size={32} />
              <h2>Commence par créer une visite</h2>
              <p>
                Tu pourras ensuite importer les panoramas équirectangulaires
                2:1.
              </p>
              <button className="tpa-primary" onClick={addTour}>
                <Plus size={16} /> Nouvelle visite
              </button>
            </div>
          ) : (
            <>
              <div className="tpa-editor-heading">
                <div>
                  <span className="tpa-kicker">
                    PROJET · {activeTour.is_published ? "PUBLIÉ" : "BROUILLON"}
                  </span>
                  <h2>{draft.title_fr || "Nouvelle visite"}</h2>
                </div>
                <div className="tpa-heading-actions">
                  <button
                    className="tpa-secondary"
                    onClick={() => copyText(publicUrl, "Lien public")}
                    disabled={!draft.slug}
                  >
                    <Copy size={15} /> Lien
                  </button>
                  <button
                    className={
                      activeTour.is_published ? "tpa-secondary" : "tpa-primary"
                    }
                    onClick={setPublished}
                    disabled={busy || (!activeTour.is_published && !canPublish)}
                  >
                    {activeTour.is_published ? (
                      <>
                        <EyeOff size={15} /> Masquer
                      </>
                    ) : (
                      <>
                        <Eye size={15} /> Publier
                      </>
                    )}
                  </button>
                </div>
              </div>
              {notice && (
                <div className="tpa-notice" role="status">
                  <span>{notice}</span>
                  <button onClick={() => setNotice("")} aria-label="Fermer">
                    <X size={15} />
                  </button>
                </div>
              )}
              <form className="tpa-panel" onSubmit={saveTour}>
                <div className="tpa-panel-title">
                  <span>01</span>
                  <div>
                    <h3>Informations du projet</h3>
                    <p>
                      Titre, rubrique et présentation en français et en arabe.
                    </p>
                  </div>
                </div>
                <div className="tpa-form-grid">
                  <label>
                    Titre français
                    <input
                      required
                      value={draft.title_fr || ""}
                      onChange={(e) => setField("title_fr", e.target.value)}
                    />
                  </label>
                  <label>
                    Titre arabe
                    <input
                      dir="rtl"
                      value={draft.title_ar || ""}
                      onChange={(e) => setField("title_ar", e.target.value)}
                    />
                  </label>
                  <label>
                    Slug public
                    <input
                      required
                      value={draft.slug || ""}
                      onChange={(e) =>
                        setField("slug", cleanSlug(e.target.value))
                      }
                    />
                  </label>
                  <label>
                    Catégorie française
                    <input
                      value={draft.category_fr || ""}
                      onChange={(e) => setField("category_fr", e.target.value)}
                      placeholder="Immobilier, Hôtellerie…"
                    />
                  </label>
                  <label>
                    Catégorie arabe
                    <input
                      dir="rtl"
                      value={draft.category_ar || ""}
                      onChange={(e) => setField("category_ar", e.target.value)}
                    />
                  </label>
                  <label className="tpa-wide">
                    Description française
                    <textarea
                      rows="3"
                      value={draft.description_fr || ""}
                      onChange={(e) =>
                        setField("description_fr", e.target.value)
                      }
                    />
                  </label>
                  <label className="tpa-wide">
                    Description arabe
                    <textarea
                      dir="rtl"
                      rows="3"
                      value={draft.description_ar || ""}
                      onChange={(e) =>
                        setField("description_ar", e.target.value)
                      }
                    />
                  </label>
                  <label className="tpa-wide">
                    URL Google Maps du lieu ou code iframe (facultatif)
                    <textarea
                      rows="2"
                      value={draft.google_maps_url || ""}
                      onChange={(e) => setGoogleMapsUrl(e.target.value)}
                      placeholder="Lien Google Maps du lieu ou URL/code iframe officiel"
                    />
                    <small>
                      Colle le lien Google Maps du lieu, ou le code iframe
                      officiel. Un lien de lieu ouvre Maps ; une URL Embed API
                      charge la carte dans la page après un clic. Google garde
                      l’hébergement de son imagerie ; rien n’est importé dans
                      Pannellum. Active Maps JavaScript + Maps Embed API pour
                      vérifier et afficher Street View.
                    </small>
                  </label>
                  <label>
                    Latitude
                    <input
                      type="number"
                      min="-90"
                      max="90"
                      step="0.000001"
                      value={draft.google_maps_lat ?? ""}
                      onChange={(e) =>
                        setGoogleCoordinate("google_maps_lat", e.target.value)
                      }
                    />
                  </label>
                  <label>
                    Longitude
                    <input
                      type="number"
                      min="-180"
                      max="180"
                      step="0.000001"
                      value={draft.google_maps_lng ?? ""}
                      onChange={(e) =>
                        setGoogleCoordinate("google_maps_lng", e.target.value)
                      }
                    />
                  </label>
                  <div className="tpa-wide tpa-streetview-check">
                    <button
                      type="button"
                      className="tpa-secondary"
                      onClick={verifyGoogleStreetView}
                      disabled={
                        busy ||
                        String(draft.google_maps_lat ?? "").trim() === "" ||
                        String(draft.google_maps_lng ?? "").trim() === ""
                      }
                    >
                      <MapPin size={16} /> Vérifier Street View près de ce point
                    </button>
                    <small>
                      Vérification via Google StreetViewService dans un rayon de
                      100 m. Une vue n’est indiquée comme disponible qu’après
                      réponse positive de l’API.
                    </small>
                    {!getGoogleMapsApiKey() && (
                      <small className="tpa-map-key-warning">
                        Vérification désactivée : ajoute une clé publique
                        restreinte dans public/google-maps-config.js.
                      </small>
                    )}
                    {draft.street_view_status === "available" &&
                      draft.street_view_pano_id && (
                        <p className="tpa-map-status available" role="status">
                          Street View vérifié · panorama enregistré
                        </p>
                      )}
                    {draft.street_view_status === "unavailable" && (
                      <p className="tpa-map-status unavailable" role="status">
                        Aucun panorama trouvé dans le rayon contrôlé. La carte
                        du lieu peut rester publiée.
                      </p>
                    )}
                  </div>
                </div>
                <div className="tpa-upload-row">
                  <label className="tpa-upload-button">
                    <ImagePlus size={17} /> Image de couverture
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={uploadCover}
                    />
                  </label>
                  <label className="tpa-upload-button">
                    <MapPin size={17} /> Plan interactif
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={uploadPlan}
                    />
                  </label>
                  <label className="tpa-upload-button">
                    <ImagePlus size={17} /> Ajouter des photos
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp"
                      onChange={uploadGallery}
                    />
                  </label>
                </div>
                <button
                  className="tpa-primary"
                  type="submit"
                  disabled={busy || !draft.title_fr || !draft.slug}
                >
                  <Save size={16} /> Enregistrer le projet
                </button>
              </form>

              <section className="tpa-panel">
                <div className="tpa-panel-title">
                  <span>02</span>
                  <div>
                    <h3>Scènes et panoramas</h3>
                    <p>
                      Le contrôle vérifie le format 2:1 et les dimensions, pas
                      la projection réelle. Importez uniquement des panoramas
                      équirectangulaires 360° originaux dont vous détenez les
                      droits.
                    </p>
                  </div>
                </div>
                <label className="tpa-attestation">
                  <input
                    type="checkbox"
                    checked={confirmPanoramas}
                    onChange={(event) =>
                      setConfirmPanoramas(event.target.checked)
                    }
                    disabled={busy}
                  />
                  <span>
                    Je confirme l’authenticité 360° équirectangulaire de chaque
                    fichier et l’autorisation de l’utiliser.
                  </span>
                </label>
                <label className="tpa-upload-button tpa-panorama-upload">
                  <Upload size={17} /> Importer plusieurs panoramas 2:1
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    onChange={uploadPanoramas}
                    disabled={busy || !confirmPanoramas}
                  />
                </label>
                {scenes.length ? (
                  <div className="tpa-scenes-list">
                    {scenes.map((scene, index) => (
                      <div
                        className={`tpa-scene-row ${scene.id === activeScene?.id ? "selected" : ""}`}
                        key={scene.id}
                      >
                        <button
                          className="tpa-scene-select"
                          onClick={() => {
                            setSelectedSceneId(scene.id);
                            setHotspotForm(null);
                          }}
                        >
                          <span>{String(index + 1).padStart(2, "0")}</span>
                          <b>{scene.name_fr}</b>
                          <small>
                            {scene.hotspots?.length || 0} hotspot(s)
                          </small>
                        </button>
                        <label>
                          Nom FR
                          <input
                            defaultValue={scene.name_fr}
                            onBlur={(e) =>
                              e.target.value !== scene.name_fr &&
                              saveSceneName(scene.id, "name_fr", e.target.value)
                            }
                          />
                        </label>
                        <label>
                          Nom AR
                          <input
                            dir="rtl"
                            defaultValue={scene.name_ar || ""}
                            onBlur={(e) =>
                              e.target.value !== (scene.name_ar || "") &&
                              saveSceneName(scene.id, "name_ar", e.target.value)
                            }
                          />
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="tpa-empty-state">
                    Aucun panorama importé. La visite reste en brouillon et son
                    lecteur public affichera un emplacement explicite.
                  </div>
                )}
              </section>

              {activeScene && (
                <section className="tpa-panel">
                  <div className="tpa-panel-title">
                    <span>03</span>
                    <div>
                      <h3>Placer des hotspots</h3>
                      <p>
                        Clique sur l’image équirectangulaire pour choisir sa
                        position, puis relie une autre scène ou ajoute des
                        informations.
                      </p>
                    </div>
                  </div>
                  {previewUrl && (
                    <div
                      className="tpa-panorama-edit"
                      onClick={beginHotspot}
                      role="button"
                      tabIndex={0}
                      aria-label="Cliquer pour placer un point interactif"
                      onKeyDown={(e) => {
                        if (
                          (e.key === "Enter" || e.key === " ") &&
                          previewUrl
                        ) {
                          e.preventDefault();
                          beginHotspot(e, true);
                        }
                      }}
                    >
                      <img
                        src={previewUrl}
                        alt={`Panorama équirectangulaire : ${activeScene.name_fr}`}
                      />
                      {hotspots.map((hotspot) => (
                        <span
                          key={hotspot.id}
                          className="tpa-marker"
                          style={{
                            left: `${(Number(hotspot.yaw) + 180) / 3.6}%`,
                            top: `${(90 - Number(hotspot.pitch)) / 1.8}%`,
                          }}
                          title={hotspot.title_fr}
                        >
                          {hotspot.kind === "scene" ? "↗" : "i"}
                        </span>
                      ))}
                      {hotspotPosition && (
                        <span
                          className="tpa-marker draft"
                          style={{
                            left: `${hotspotPosition.x ?? (hotspotPosition.yaw + 180) / 3.6}%`,
                            top: `${hotspotPosition.y ?? (90 - hotspotPosition.pitch) / 1.8}%`,
                          }}
                        >
                          +
                        </span>
                      )}
                    </div>
                  )}
                  {!previewUrl && (
                    <div className="tpa-empty-state">
                      Le panorama sélectionné n’est pas accessible pour le
                      moment.
                    </div>
                  )}
                  <div className="tpa-hotspot-list">
                    {hotspots.map((hotspot) => (
                      <div key={hotspot.id}>
                        <span className="tpa-hotspot-kind">
                          {hotspot.kind === "scene" ? "SCÈNE" : "INFO"}
                        </span>
                        <b>{hotspot.title_fr}</b>
                        <button onClick={() => editHotspot(hotspot)}>
                          Modifier
                        </button>
                        <button
                          onClick={() => deleteHotspot(hotspot.id)}
                          aria-label="Supprimer"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                  {hotspotForm && (
                    <form className="tpa-hotspot-form" onSubmit={saveHotspot}>
                      <div className="tpa-hotspot-form-heading">
                        <b>
                          {hotspotForm.id
                            ? "Modifier le point"
                            : "Nouveau point interactif"}
                        </b>
                        <button
                          type="button"
                          onClick={() => {
                            setHotspotForm(null);
                            setHotspotPosition(null);
                          }}
                          aria-label="Annuler"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <div className="tpa-form-grid">
                        <label>
                          Type
                          <select
                            value={hotspotForm.kind}
                            onChange={(e) =>
                              setHotspotField("kind", e.target.value)
                            }
                          >
                            <option value="info">Information</option>
                            <option value="scene">Relier une scène</option>
                          </select>
                        </label>
                        {hotspotForm.kind === "scene" && (
                          <label>
                            Scène de destination
                            <select
                              value={hotspotForm.target_scene_id || ""}
                              onChange={(e) =>
                                setHotspotField(
                                  "target_scene_id",
                                  e.target.value,
                                )
                              }
                            >
                              <option value="">Choisir une scène</option>
                              {scenes
                                .filter((scene) => scene.id !== activeScene.id)
                                .map((scene) => (
                                  <option value={scene.id} key={scene.id}>
                                    {scene.name_fr}
                                  </option>
                                ))}
                            </select>
                          </label>
                        )}
                        <label>
                          Titre français
                          <input
                            required
                            value={hotspotForm.title_fr}
                            onChange={(e) =>
                              setHotspotField("title_fr", e.target.value)
                            }
                          />
                        </label>
                        <label>
                          Titre arabe
                          <input
                            dir="rtl"
                            value={hotspotForm.title_ar}
                            onChange={(e) =>
                              setHotspotField("title_ar", e.target.value)
                            }
                          />
                        </label>
                        <label className="tpa-wide">
                          Texte français
                          <textarea
                            rows="2"
                            value={hotspotForm.text_fr}
                            onChange={(e) =>
                              setHotspotField("text_fr", e.target.value)
                            }
                          />
                        </label>
                        <label className="tpa-wide">
                          Texte arabe
                          <textarea
                            dir="rtl"
                            rows="2"
                            value={hotspotForm.text_ar}
                            onChange={(e) =>
                              setHotspotField("text_ar", e.target.value)
                            }
                          />
                        </label>
                        <label>
                          Lien HTTPS (facultatif)
                          <input
                            type="url"
                            value={hotspotForm.link_url || ""}
                            onChange={(e) =>
                              setHotspotField("link_url", e.target.value)
                            }
                            placeholder="https://…"
                          />
                        </label>
                        <label>
                          Photo du point
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={(e) =>
                              uploadHotspotMedia(
                                "image_path",
                                e.target.files?.[0],
                              )
                            }
                          />
                        </label>
                        <label>
                          Vidéo du point
                          <input
                            type="file"
                            accept="video/mp4,video/webm"
                            onChange={(e) =>
                              uploadHotspotMedia(
                                "video_path",
                                e.target.files?.[0],
                              )
                            }
                          />
                        </label>
                      </div>
                      {hotspotPosition && (
                        <small>
                          Position calculée : yaw {hotspotPosition.yaw}°, pitch{" "}
                          {hotspotPosition.pitch}°.
                        </small>
                      )}
                      <button className="tpa-primary" disabled={busy}>
                        <Save size={15} /> Enregistrer le hotspot
                      </button>
                    </form>
                  )}
                </section>
              )}

              {planUrl && (
                <section className="tpa-panel">
                  <div className="tpa-panel-title">
                    <span>04</span>
                    <div>
                      <h3>Plan interactif</h3>
                      <p>
                        Sélectionne une scène, puis clique sur le plan pour
                        placer son repère.
                      </p>
                    </div>
                  </div>
                  <div
                    className="tpa-plan-edit"
                    onClick={setSceneOnPlan}
                    role="button"
                    tabIndex={0}
                    aria-label="Cliquer pour placer la scène sur le plan"
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSceneOnPlan(event, true);
                      }
                    }}
                  >
                    <img src={planUrl} alt="Plan interactif" />
                    {scenes.map(
                      (scene) =>
                        scene.plan_x != null && (
                          <span
                            key={scene.id}
                            className={`tpa-plan-marker ${activeScene?.id === scene.id ? "active" : ""}`}
                            style={{
                              left: `${scene.plan_x}%`,
                              top: `${scene.plan_y}%`,
                            }}
                            title={scene.name_fr}
                          >
                            {scene.sort_order + 1}
                          </span>
                        ),
                    )}
                    {planPoint && (
                      <span
                        className="tpa-plan-marker draft"
                        style={{
                          left: `${planPoint.x}%`,
                          top: `${planPoint.y}%`,
                        }}
                      >
                        +
                      </span>
                    )}
                  </div>
                </section>
              )}

              <section className="tpa-panel tpa-publish-panel">
                <div className="tpa-panel-title">
                  <span>05</span>
                  <div>
                    <h3>Partager et intégrer</h3>
                    <p>
                      Un lien public et un code iframe sont générés pour chaque
                      visite publiée.
                    </p>
                  </div>
                </div>
                <div className="tpa-share-actions">
                  <button
                    className="tpa-secondary"
                    onClick={() => copyText(publicUrl, "Lien public")}
                    disabled={!publicUrl}
                  >
                    <Copy size={15} /> Copier le lien
                  </button>
                  <a
                    className="tpa-secondary"
                    href={publicUrl || "/visites"}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ExternalLink size={15} /> Ouvrir la page
                  </a>
                </div>
                <label>
                  Code iframe
                  <textarea readOnly rows="3" value={iframeSnippet} />
                </label>
                <button
                  className="tpa-secondary"
                  onClick={() => copyText(iframeSnippet, "Code iframe")}
                  disabled={!iframeSnippet}
                >
                  <Copy size={15} /> Copier le code iframe
                </button>
              </section>
            </>
          )}
          {notice && (
            <div className="tpa-toast" role="status">
              <Check size={16} />
              {notice}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function SetupNotice() {
  return (
    <main className="tpa-shell">
      <header className="tpa-top">
        <a href="/" className="tpa-brand">
          THREEPOINTS <b>MEDIA</b>
        </a>
        <a href="/visites" className="tpa-back">
          <ArrowLeft size={16} /> Visites publiques
        </a>
      </header>
      <section className="tpa-auth-card tpa-setup-card">
        <ShieldCheck size={32} />
        <span className="tpa-kicker">CONFIGURATION SUPABASE</span>
        <h1>Préparer l’espace administrateur</h1>
        <p>
          L’authentification réelle, la base de données et le stockage
          s’activent après configuration de votre projet Supabase.
        </p>
        <ol>
          <li>
            Exécute le script <code>supabase/schema.sql</code> dans le SQL
            Editor.
          </li>
          <li>
            Renseigne l’URL du projet et la clé publique anon dans{" "}
            <code>public/supabase-config.js</code>.
          </li>
          <li>
            Crée un utilisateur dans Supabase Auth puis ajoute son UUID à{" "}
            <code>public.tour_admins</code>.
          </li>
        </ol>
        <p className="tpa-security-note">
          Ne place jamais la clé <code>service_role</code> dans le navigateur.
        </p>
      </section>
    </main>
  );
}
