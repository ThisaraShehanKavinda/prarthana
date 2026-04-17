/** Copy and link lists for `/learn/nutrition` — educational only, not individualized medical advice. */

export type NutritionAccordionItem = {
  id: string;
  title: string;
  body: string[];
};

export const nutritionWhenEatingIsHard: NutritionAccordionItem[] = [
  {
    id: "nausea",
    title: "Nausea or vomiting",
    body: [
      "Small meals often feel easier than large meals. Cool food may smell less strong than hot food.",
      "Ginger or crackers can help some people. If your doctor gave anti-nausea medicine, take it as instructed.",
      "Get urgent care if vomiting is severe or you cannot keep fluids down.",
    ],
  },
  {
    id: "diarrhea",
    title: "Diarrhea",
    body: [
      "Replacing fluid and salts is the first priority. ORS often works better than plain water in heavy diarrhea.",
      "Simple foods like oats, banana, and soft rice may help. Very oily, spicy, or high-lactose foods may worsen symptoms for some people.",
      "Tell your team if diarrhea continues, if there is blood, or if fever/dehydration appears.",
    ],
  },
  {
    id: "constipation",
    title: "Constipation",
    body: [
      "Pain medicines, some anti-nausea drugs, and low fluid intake can cause constipation.",
      "When safe, more fluids, gradual fiber, and short walks can help bowel movement.",
      "Call your team for severe pain, vomiting, or several days without stool.",
    ],
  },
  {
    id: "taste",
    title: "Taste changes or metallic mouth",
    body: [
      "Treatment can change taste and smell. Food may taste metallic or bland.",
      "Marinades, herbs, lemon/lime, or plastic utensils help some people.",
      "If taste changes suddenly get worse, ask for mouth and dental review.",
    ],
  },
  {
    id: "mucositis",
    title: "Mouth sores (mucositis)",
    body: [
      "Soft and moist foods are usually easier than dry, hard, or acidic foods.",
      "Avoid very hot drinks and harsh mouthwashes when your mouth is sore.",
      "Ask early for pain and diet support so you can keep enough calories and protein.",
    ],
  },
  {
    id: "appetite",
    title: "Early fullness or vanishing appetite",
    body: [
      "Appetite can drop during treatment, so eating on a schedule may help.",
      "Add extra energy/protein to regular foods (for example egg, lentils, cheese, or nut powders when safe).",
      "Unplanned weight loss is a medical warning sign and should be discussed quickly.",
    ],
  },
];

export const nutritionPillars: {
  title: string;
  summary: string;
  bullets: string[];
}[] = [
  {
    title: "Protein & lean mass",
    summary:
      "Muscle strength helps people tolerate treatment and recover.",
    bullets: [
      "Try to spread protein through the day (eggs, fish, pulses, dairy, or fortified alternatives).",
      "If your team agrees, light strength exercise plus protein helps preserve function.",
    ],
  },
  {
    title: "Hydration & electrolytes",
    summary:
      "Vomiting, diarrhea, fever, or low intake can quickly upset fluid and salt balance.",
    bullets: [
      "Plain water may not be enough when salts are lost. ORS has a useful balance for this.",
      "Follow your daily fluid target if your nurse or doctor gives one.",
    ],
  },
  {
    title: "Food safety",
    summary:
      "Some treatments lower immunity, so food safety rules may need to be stricter.",
    bullets: [
      "Avoid unsafe foods like unpasteurized dairy and undercooked eggs/meat/seafood.",
      "Ask your team if neutropenic food precautions apply to you.",
    ],
  },
];

export const nutritionTrustedLinks: { label: string; href: string; note: string }[] = [
  {
    label: "National Cancer Institute — Eating hints",
    href: "https://www.cancer.gov/about-cancer/treatment/side-effects/eating-hints",
    note: "Practical tips during treatment side effects.",
  },
  {
    label: "National Cancer Institute — Nutrition in cancer care",
    href: "https://www.cancer.gov/about-cancer/treatment/side-effects/nutrition",
    note: "How treatment affects nutrition and why follow‑up matters.",
  },
  {
    label: "American Cancer Society — Nutrition & activity",
    href: "https://www.cancer.org/cancer/survivorship/coping/nutrition.html",
    note: "Broader lifestyle context during and after cancer.",
  },
  {
    label: "WHO — Food safety",
    href: "https://www.who.int/news-room/fact-sheets/detail/food-safety",
    note: "Five keys and global context for safer food handling.",
  },
];
