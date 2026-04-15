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
      "Small, frequent meals often tolerate better than large plates. Cool or room‑temperature foods may smell less intense than hot steam.",
      "Ginger teas or dry crackers help some people, but evidence is mixed—if anti‑nausea medicines are prescribed, use them on schedule rather than “waiting until it is unbearable.”",
      "Severe vomiting with signs of dehydration (very dark urine, dizziness, unable to keep fluids down for many hours) needs urgent clinical care.",
    ],
  },
  {
    id: "diarrhea",
    title: "Diarrhea",
    body: [
      "Fluid replacement matters more than “eating perfectly.” Oral rehydration solutions (ORS) or clinician‑approved electrolyte drinks replace salt and potassium better than water alone when losses are high.",
      "Soluble fiber (oats, banana, well‑cooked rice) can sometimes firm stools; greasy, very spicy, or high‑lactose foods may worsen symptoms for some individuals.",
      "Persistent diarrhea, blood in stool, fever, or dehydration symptoms should be reported—treatment or supportive medicines may need adjustment.",
    ],
  },
  {
    id: "constipation",
    title: "Constipation",
    body: [
      "Opioid pain medicines, some anti‑emetics, and low fluid intake commonly slow the gut. Gradual fiber increases plus fluids help when your team says it is safe.",
      "Gentle movement (short walks) and predictable meal times can support bowel rhythm.",
      "Sudden severe abdominal pain, vomiting, or no bowel movement for several days despite usual care requires medical review.",
    ],
  },
  {
    id: "taste",
    title: "Taste changes or metallic mouth",
    body: [
      "Chemotherapy and radiation can alter taste and smell in ways that feel “not like my food at all.” Marinating proteins, using citrus or tamarind in moderation, or switching utensils to plastic can reduce metallic notes for some people.",
      "If everything tastes bland, a small amount of salt, herbs, or acid (lemon, lime) may help—unless you are on a sodium‑restricted plan.",
      "Dental review helps rule out oral infection when taste suddenly worsens.",
    ],
  },
  {
    id: "mucositis",
    title: "Mouth sores (mucositis)",
    body: [
      "Soft, moist textures (yogurt, thinned porridge, stewed fruit) are often easier than crusty or acidic foods when the lining is fragile.",
      "Very hot drinks, rough chips, and alcohol‑based mouthwashes can sting; your team may recommend specific rinses or topical treatments.",
      "Poor oral intake because of pain can spiral quickly—early dietitian input preserves calories and protein.",
    ],
  },
  {
    id: "appetite",
    title: "Early fullness or vanishing appetite",
    body: [
      "Tumor‑related inflammation and therapies can flip appetite hormones; “eating on a clock” with nutrient‑dense snacks sometimes outperforms waiting for hunger.",
      "Fortifying familiar foods—extra egg, lentils, grated cheese, ground nuts where safe—raises calories without doubling portion size.",
      "Unintentional weight loss, clothes fitting looser, or weaker grip strength are signals to screen for malnutrition, not personal failure.",
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
      "Muscle is a reservoir during stress. Randomized trials in oncology increasingly care about sarcopenia because it tracks with tolerance of therapy and recovery.",
    bullets: [
      "Aim for protein across the day (eggs, fish, pulses, dairy or fortified alternatives) rather than one giant steak.",
      "Resistance training, when cleared by your team, pairs with protein to preserve strength—not “gym culture,” but practical function (stairs, carrying groceries).",
    ],
  },
  {
    title: "Hydration & electrolytes",
    summary:
      "Vomiting, diarrhea, fever, or poor intake shift water and salts quickly; kidneys and the heart care about balance as much as volume.",
    bullets: [
      "Plain water is not always enough when electrolytes are lost—ORS or prescribed electrolyte solutions follow set recipes for a reason.",
      "Caffeine and alcohol can worsen dehydration; chart fluid goals if your nurse gives a daily target.",
    ],
  },
  {
    title: "Food safety",
    summary:
      "Certain treatments (and some blood cancers) suppress immune cells that usually police bacteria in food. Guidance is stricter than for healthy relatives.",
    bullets: [
      "Avoid unpasteurized dairy, raw or undercooked eggs, meat, or seafood; wash produce under running water; reheat leftovers until steaming hot.",
      "When in doubt, ask whether neutropenic precautions apply to you—rules differ by regimen and blood counts.",
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
