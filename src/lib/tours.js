import { createAssetUrl, supabase } from "./supabase.js";

const TOUR_SELECT = `
  id, slug, title_fr, title_ar, category_fr, category_ar,
  description_fr, description_ar, cover_path, plan_path, gallery_paths,
  google_maps_url, google_maps_lat, google_maps_lng,
  street_view_pano_id, street_view_status, street_view_verified_at,
  is_published, sort_order,
  scenes:tour_scenes(
    id, name_fr, name_ar, panorama_path, thumbnail_path, sort_order, plan_x, plan_y,
    hotspots:tour_hotspots(
      id, kind, pitch, yaw, title_fr, title_ar, text_fr, text_ar,
      target_scene_id, image_path, video_path, link_url, sort_order
    )
  )
`;

async function toPublicTour(row) {
  const [cover, plan, ...gallery] = await Promise.all([
    createAssetUrl(row.cover_path),
    createAssetUrl(row.plan_path),
    ...(row.gallery_paths || []).map(createAssetUrl),
  ]);
  const scenes = await Promise.all(
    [...(row.scenes || [])]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(async (scene) => {
        const [image, thumbnail, ...hotspotAssets] = await Promise.all([
          createAssetUrl(scene.panorama_path),
          createAssetUrl(scene.thumbnail_path),
          ...(scene.hotspots || []).flatMap((hotspot) => [
            createAssetUrl(hotspot.image_path),
            createAssetUrl(hotspot.video_path),
          ]),
        ]);
        const hotspots = [...(scene.hotspots || [])]
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((hotspot, index) => ({
            id: hotspot.id,
            type: hotspot.kind,
            pitch: Number(hotspot.pitch),
            yaw: Number(hotspot.yaw),
            title: [hotspot.title_fr || "", hotspot.title_ar || ""],
            text: [hotspot.text_fr || "", hotspot.text_ar || ""],
            targetSceneId: hotspot.target_scene_id,
            image: hotspotAssets[index * 2] || "",
            video: hotspotAssets[index * 2 + 1] || "",
            link: hotspot.link_url || "",
          }));
        return {
          id: scene.id,
          title: [scene.name_fr, scene.name_ar],
          image,
          thumbnail,
          planX: scene.plan_x,
          planY: scene.plan_y,
          hotspots,
        };
      }),
  );
  return {
    id: row.id,
    slug: row.slug,
    title: [row.title_fr, row.title_ar],
    category: [row.category_fr, row.category_ar],
    description: [row.description_fr || "", row.description_ar || ""],
    cover,
    plan,
    googleMapsUrl: row.google_maps_url || "",
    googleMapsLat: row.google_maps_lat,
    googleMapsLng: row.google_maps_lng,
    streetViewPanoId: row.street_view_pano_id || "",
    streetViewStatus: row.street_view_status || "not-checked",
    streetViewVerifiedAt: row.street_view_verified_at || "",
    gallery: gallery
      .filter(Boolean)
      .map((src) => ({ src, alt: [row.title_fr, row.title_ar] })),
    scenes,
    isDemo: false,
    isPublished: row.is_published,
  };
}

export async function fetchPublishedTours() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("tours")
    .select(TOUR_SELECT)
    .eq("is_published", true)
    .order("sort_order", { ascending: true });
  if (error || !data) return [];
  return Promise.all(data.map(toPublicTour));
}

export async function fetchPublishedTour(slug) {
  if (!supabase || !slug) return null;
  const { data, error } = await supabase
    .from("tours")
    .select(TOUR_SELECT)
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (error || !data) return null;
  return toPublicTour(data);
}
