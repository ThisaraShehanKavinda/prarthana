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
      "Every cell uses glucose for energy. Tumors are metabolically greedy, but the body still needs fuel during therapy. Randomized trials have not shown that extreme sugar elimination selectively harms cancer while preserving the patient. Dietitians prioritize adequate protein and calories when appetite is fragile.",
    link: "https://www.cancer.gov/about-cancer/causes-prevention/patient-prevention/myths",
  },
  {
    icon: Leaf,
    myth: "“A superfood, detox tea, or herbal tonic can replace chemotherapy.”",
    fact:
      "Some botanicals contain bioactive compounds, but purity, dosing, and interactions are uncontrolled outside trials. Delaying effective therapy for unproven products can shrink the window for curative surgery or radiation.",
    link: "https://www.fda.gov/consumers/consumer-updates/fraudulent-coronavirus-cancer-treatments-be-aware-scammers",
  },
  {
    icon: Activity,
    myth: "“Cancer always hurts—no pain means I’m safe.”",
    fact:
      "Many early cancers are painless. Screening programs exist precisely because disease can be asymptomatic. New lumps, bleeding, unexplained weight loss, or persistent cough still warrant evaluation even if pain is absent.",
    link: "https://www.cancer.gov/about-cancer/diagnosis-staging/symptoms",
  },
  {
    icon: ScanLine,
    myth: "“Biopsies spread cancer.”",
    fact:
      "Needle tract seeding is exceedingly rare with modern technique compared with the harm of treating the wrong disease blind. When core tissue is needed for receptor or mutation testing, biopsy enables targeted therapy.",
    link: "https://www.cancer.gov/types/common-myths",
  },
  {
    icon: Phone,
    myth: "“5G or carrying a phone in a pocket causes cancer.”",
    fact:
      "Non-ionizing radiofrequency fields from phones are studied extensively; major health agencies have not established a causal link at typical exposure levels. Ionizing radiation (X-rays, gamma) is a different category with known dose-risk relationships.",
    link: "https://www.cancer.gov/about-cancer/causes-prevention/risk/radiation",
  },
  {
    icon: Magnet,
    myth: "“MRI magnets pull tumors out of the body.”",
    fact:
      "MRI uses strong magnetic fields and radio waves to image anatomy—it does not extract tissue. Some contrast agents help characterize tumors; they are not chemotherapy.",
    link: "https://www.cancer.gov/about-cancer/diagnosis-staging/imaging/mri",
  },
  {
    icon: Cpu,
    myth: "“If genetic testing is negative, cancer isn’t inherited.”",
    fact:
      "Known high-penetrance genes explain only a slice of familial clustering. Many families have moderate risks from gene combinations not on standard panels, shared environments, or chance. Genetic counselors interpret negative results in context.",
    link: "https://www.cancer.gov/about-cancer/causes-prevention/genetics",
  },
  {
    icon: Baby,
    myth: "“Antiperspirants or bras cause breast cancer.”",
    fact:
      "Large epidemiologic studies have not found credible links. Confusion often comes from mixing correlation (product use in a population) with causation.",
    link: "https://www.cancer.gov/types/breast/patient/breast-prevention-pdq",
  },
  {
    icon: Sparkles,
    myth: "“Positive thinking alone can cure cancer.”",
    fact:
      "Psychosocial support improves quality of life and may help people adhere to treatment, but mindset is not a cytotoxic therapy. Blaming attitude stigmatizes patients unfairly.",
    link: "https://www.cancer.gov/about-cancer/coping/feelings",
  },
];
