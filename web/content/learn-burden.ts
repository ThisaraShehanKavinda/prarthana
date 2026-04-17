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
      "Incidence means how many new cases are found. Mortality means how many people die. These are not the same thing.",
      "Some cancers are common but often treatable when found early. Some are less common but more deadly if found late. Survival numbers describe groups, not one person.",
    ],
  },
  {
    id: "one-number",
    title: "Why “cancer burden” is never one headline number",
    body: [
      "Cancer is not one disease. Different cancer types have different causes, age patterns, and prevention options.",
      "Raw case counts can mislead. Age-standardized rates help compare countries more fairly when their populations are different ages.",
    ],
  },
  {
    id: "prevention",
    title: "What actually moves the curve at population scale",
    body: [
      "Strong public health actions include HPV and hepatitis B vaccines, tobacco control, safer workplaces, cleaner air, and lower harmful alcohol use.",
      "Screening helps most when many people attend, follow-up is done quickly, and programs are run well.",
    ],
  },
  {
    id: "literacy",
    title: "Reading charts without panic or false reassurance",
    body: [
      "Charts on this page are for learning. Use national registry data for formal reports and research.",
      "If a number has no year, country, age group, or clear definition, it is incomplete.",
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
