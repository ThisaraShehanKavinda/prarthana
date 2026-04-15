/** Rich copy for `/learn/burden` — teaching context, not live registry data. */

export const burdenDeepDive: {
  id: string;
  title: string;
  body: string[];
}[] = [
  {
    id: "incidence-mortality",
    title: "Incidence, mortality, and survival are different stories",
    body: [
      "Incidence counts new diagnoses in a period. Mortality counts deaths. A cancer can be highly incident but less often fatal if screening catches it early (some thyroid cancers), or less common but disproportionately lethal if diagnosed late (many pancreatic cancers).",
      "Population survival statistics blend stage at diagnosis, treatment access, comorbidities, and reporting quality—never a personal forecast.",
    ],
  },
  {
    id: "one-number",
    title: "Why “cancer burden” is never one headline number",
    body: [
      "Tumor types differ in biology, age distribution, and preventability. Tobacco-related lung cancer and HPV-related cervical cancer respond to different public health levers than rare sarcomas.",
      "Age-standardized rates let regions with different population pyramids be compared fairly—raw counts alone can mislead policymakers.",
    ],
  },
  {
    id: "prevention",
    title: "What actually moves the curve at population scale",
    body: [
      "Vaccination (HPV, hepatitis B), tobacco control, alcohol moderation, occupational safety, and air quality improvements have strong epidemiologic track records for specific cancers.",
      "Screening reduces mortality only when uptake is high, follow-up is reliable, and overdiagnosis trade-offs are managed—otherwise benefits shrink.",
    ],
  },
  {
    id: "literacy",
    title: "Reading charts without panic or false reassurance",
    body: [
      "Illustrative charts teach concepts; they should not replace national cancer registry tables for research citations.",
      "If a statistic lacks a year, geography, age band, and numerator/denominator definition, treat it as incomplete.",
    ],
  },
];

export const burdenTrustedLinks: { label: string; href: string; hint: string }[] = [
  {
    label: "WHO — Cancer fact sheet",
    href: "https://www.who.int/news-room/fact-sheets/detail/cancer",
    hint: "Global burden summary and risk factors.",
  },
  {
    label: "IARC — Global Cancer Observatory",
    href: "https://gco.iarc.who.int/",
    hint: "Maps, rankings, and methodology notes.",
  },
  {
    label: "World Cancer Research Fund — Prevention evidence",
    href: "https://www.wcrf.org/diet-activity-and-cancer/",
    hint: "Diet, weight, and activity evidence reviews.",
  },
];
