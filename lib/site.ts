/** Keep canonical metadata, crawler hints, and shared previews on the same domain. */
export const site = {
  url: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://preetpatel44.vercel.app"),
  name: "Preet Patel",
  title: "Preet Patel | AI & Software Developer Portfolio",
  description:
    "Preet Patel is a Toronto-based AI Operations Developer at Docebo, building AI agents and full-stack applications. Explore his projects, skills, and experience.",
};
