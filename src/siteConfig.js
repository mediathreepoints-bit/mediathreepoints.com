// Central content/integration configuration. Keep contact fields empty until verified.
export const siteConfig = {
  agencyName: "Threepoints Media",
  contactEmail: "",
  phone: "",
  address: "",
  socialLinks: [],
  allowedTourHosts: [], // e.g. ['tour.example.com'] — only allow trusted providers
  allowedApiHosts: [], // e.g. ['forms.example.com'] — only allow the verified quote API
  tour: { mode: "placeholder", iframeUrl: "", panorama: "", scenes: [] },
  formEndpoint: "", // POST endpoint returning 2xx only after the request is received
  analytics: { enabled: false, consentRequired: true },
};
