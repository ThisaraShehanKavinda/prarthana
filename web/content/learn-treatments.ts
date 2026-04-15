import type { LucideIcon } from "lucide-react";
import { Scissors, Shield, Syringe, Target, Zap } from "lucide-react";

export type TreatmentModality = {
  icon: LucideIcon;
  name: string;
  summary: string;
  bullets: string[];
  patientNotes: string[];
};

export const treatmentModalitiesRich: TreatmentModality[] = [
  {
    icon: Scissors,
    name: "Surgery",
    summary:
      "The oldest curative modality: remove the tumor with clear margins when anatomy allows, or reduce tumor load to relieve obstruction or bleeding.",
    bullets: [
      "Curative intent when disease is localized and resectable with adequate organ function.",
      "Staging procedures (e.g., sentinel node biopsy) inform whether chemotherapy or radiation is added.",
      "Minimally invasive approaches can shorten recovery when tumor biology and location fit.",
    ],
    patientNotes: [
      "Prehabilitation (nutrition, breathing exercises) may be offered before major resections.",
      "Ask how scars, stomas, or reconstructed anatomy will affect daily life and follow-up imaging schedules.",
    ],
  },
  {
    icon: Zap,
    name: "Radiation therapy",
    summary:
      "Ionizing radiation creates DNA breaks; dividing cells repair poorly, which is why tumors and some normal tissues (mucosa, marrow) are simultaneously sensitive.",
    bullets: [
      "External beam photons remain common; electrons treat superficial sites; protons spare depth dose in select pediatric and skull-base cases.",
      "IMRT/VMAT sculpt dose around organs at risk; SBRT delivers ablative doses in few fractions for small, well-defined tumors.",
      "Brachytherapy places sources inside or against tumors (cervix, prostate) for steep dose gradients.",
    ],
    patientNotes: [
      "Skin care, swallowing strategies, and fatigue management are recurring themes—teams give visit-specific instructions.",
      "Radiation recall can flare chemotherapy skin toxicity months later; report unusual rashes promptly.",
    ],
  },
  {
    icon: Syringe,
    name: "Systemic chemotherapy",
    summary:
      "Classic cytotoxics disrupt DNA synthesis, microtubules, or alkylation; they affect any rapidly dividing compartment (marrow, gut epithelium, hair follicles).",
    bullets: [
      "Combination regimens exploit non-overlapping toxicities and complementary mechanisms.",
      "Dose intensity may be modified for kidney/liver function, age, or prior therapy—not ‘weak’ care, but pharmacology-aware care.",
      "Supportive drugs (anti-emetics, growth factors, antidiarrheals) are part of standard protocols.",
    ],
    patientNotes: [
      "Neuropathy or ‘chemo brain’ can linger; occupational therapy and pacing strategies help some patients.",
      "Fertility preservation should be discussed before many gonadotoxic regimens when future pregnancy is possible.",
    ],
  },
  {
    icon: Target,
    name: "Targeted therapy",
    summary:
      "Small molecules or antibodies hit defined drivers (kinases, receptors, antibody-drug conjugate payloads) with narrower off-target toxicity than many cytotoxics—when the target is present.",
    bullets: [
      "Companion diagnostics (IHC, FISH, NGS) gate access to drugs like HER2, EGFR, ALK, or TRK inhibitors.",
      "Resistance mutations emerge; repeat biopsies or blood-based assays may be used in advanced disease.",
      "Skin, liver, blood pressure, or wound-healing effects vary by agent—education is drug-specific.",
    ],
    patientNotes: [
      "Oral targeted drugs still require adherence, interaction checks, and monitoring labs even without infusion visits.",
    ],
  },
  {
    icon: Shield,
    name: "Immunotherapy",
    summary:
      "Checkpoint inhibitors remove brakes on T cells; cellular therapies engineer immune cells for select hematologic malignancies.",
    bullets: [
      "PD-1/PD-L1 blockade helps subsets of melanoma, lung, bladder, MSI-high tumors, and others—biomarkers guide expectations.",
      "Immune-related adverse events can mimic infection, endocrine crisis, or colitis—early steroids when indicated improve outcomes.",
      "CAR-T requires specialized centers for cytokine release and neurotoxicity monitoring.",
    ],
    patientNotes: [
      "Hypothyroidism or hyperglycemia months after therapy can be immune-related—routine symptom reporting matters even after finishing doses.",
    ],
  },
];

export const treatmentCrossCutting: {
  id: string;
  title: string;
  body: string[];
}[] = [
  {
    id: "mdt",
    title: "Multidisciplinary teams: who is in the room?",
    body: [
      "Medical, surgical, and radiation oncologists often review imaging and pathology together with radiologists, pathologists, nurses, and allied health.",
      "Tumor boards standardize evidence discussion; they do not replace shared decision-making with the individual patient.",
    ],
  },
  {
    id: "intent",
    title: "Curative, adjuvant, neoadjuvant, or palliative—intent shapes toxicity tolerance",
    body: [
      "Neoadjuvant therapy shrinks tumors before surgery; adjuvant therapy mops up micrometastatic risk afterward.",
      "Palliative radiation or systemic therapy can still be intense when symptoms demand relief—the goal is comfort and function, not eradication.",
    ],
  },
  {
    id: "trials",
    title: "Clinical trials sit alongside standard options",
    body: [
      "Trials can be Phase I (safety), II (signal), or III (comparison to standard). Eligibility hinges on organ function, prior lines, and measurable disease.",
      "Ask whether a trial offers extra monitoring or crossover to standard therapy on progression.",
    ],
  },
];
