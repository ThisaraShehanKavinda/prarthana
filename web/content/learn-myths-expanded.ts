import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Baby,
  Candy,
  Cpu,
  Leaf,
  Magnet,
  Phone,
  ScanLine,
  Sparkles,
} from "lucide-react";

export type MythEntry = {
  icon: LucideIcon;
  myth: string;
  fact: string;
  link: string;
};

export const learnMythsExpanded: MythEntry[] = [
  {
    icon: Candy,
    myth: "“Sugar feeds cancer—cut all sugar to starve tumors.”",
    fact:
      "All cells use glucose for energy, including healthy cells. Cutting all sugar does not 'starve' only cancer. During treatment, many people need enough calories and protein to avoid weight and muscle loss.",
    link: "https://www.cancer.gov/about-cancer/causes-prevention/risk/myths",
  },
  {
    icon: Leaf,
    myth: "“A superfood, detox tea, or herbal tonic can replace chemotherapy.”",
    fact:
      "Some plant products have active compounds, but real dose, safety, and drug interactions are often unknown. Delaying proven treatment for unproven products can reduce the chance of cure.",
    link: "https://www.fda.gov/consumers/consumer-updates/products-claiming-cure-cancer-are-cruel-deception",
  },
  {
    icon: Activity,
    myth: "“Cancer always hurts—no pain means I’m safe.”",
    fact:
      "Many early cancers do not cause pain. That is why screening exists. New lumps, bleeding, unexplained weight loss, or a long-lasting cough should still be checked.",
    link: "https://www.cancer.gov/about-cancer/diagnosis-staging/symptoms",
  },
  {
    icon: ScanLine,
    myth: "“Biopsies spread cancer.”",
    fact:
      "With modern methods, biopsy-related spread is very rare. Biopsy is important because treatment choices often depend on the exact pathology and biomarker results.",
    link: "https://www.cancer.gov/about-cancer/causes-prevention/risk/myths",
  },
  {
    icon: Phone,
    myth: "“5G or carrying a phone in a pocket causes cancer.”",
    fact:
      "Phone signals are non-ionizing radiation. Major health agencies have not confirmed a causal cancer link at normal exposure levels. This is different from ionizing radiation such as X-rays.",
    link: "https://www.cancer.gov/about-cancer/causes-prevention/risk/radiation/cell-phones-fact-sheet",
  },
  {
    icon: Magnet,
    myth: "“MRI magnets pull tumors out of the body.”",
    fact:
      "MRI is an imaging test. It does not remove tissue or treat cancer. Contrast in MRI helps imaging quality; it is not chemotherapy.",
    link: "https://www.cancer.gov/publications/dictionaries/cancer-terms/def/magnetic-resonance-imaging-mri",
  },
  {
    icon: Cpu,
    myth: "“If genetic testing is negative, cancer isn’t inherited.”",
    fact:
      "A negative test does not always mean no inherited risk. Current panels do not explain every family pattern. Genetic counselors interpret results using family history too.",
    link: "https://www.cancer.gov/about-cancer/causes-prevention/genetics",
  },
  {
    icon: Baby,
    myth: "“Antiperspirants or bras cause breast cancer.”",
    fact:
      "Large studies have not shown a reliable link between bras or antiperspirants and breast cancer.",
    link: "https://www.cancer.gov/about-cancer/causes-prevention/risk/myths/antiperspirants-fact-sheet",
  },
  {
    icon: Sparkles,
    myth: "“Positive thinking alone can cure cancer.”",
    fact:
      "Hope and emotional support help quality of life, but positive thinking alone does not kill cancer cells. No patient should be blamed for their disease.",
    link: "https://www.cancer.gov/about-cancer/coping/feelings/stress-fact-sheet",
  },
];
