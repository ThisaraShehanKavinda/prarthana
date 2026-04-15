import type { LucideIcon } from "lucide-react";
import { Dna, Flame, Pill, Syringe, Target } from "lucide-react";

export type MedicineClassRich = {
  icon: LucideIcon;
  title: string;
  mechanism: string;
  examplesNote: string;
  bullets: string[];
  cautions: string[];
};

export const medicineClassesRich: MedicineClassRich[] = [
  {
    icon: Syringe,
    title: "Cytotoxic chemotherapy",
    mechanism:
      "Alkylators cross-link DNA; antimetabolites mimic building blocks; topoisomerase inhibitors trap DNA during unwinding; taxanes freeze microtubules—each class exploits replication stress.",
    examplesNote:
      "Brand names differ by country; regimens are protocol-driven (FOLFOX, AC-T, R-CHOP, etc.).",
    bullets: [
      "Cell-cycle specificity matters: some drugs work best in S phase, others are non-specific.",
      "Rescue strategies (e.g., folinic acid after high-dose methotrexate) are protocolized, not optional add-ons.",
      "Extravasation protocols exist for vesicant agents—nurses monitor infusion sites closely.",
    ],
    cautions: [
      "Never borrow someone else’s cycle or tablet dose; toxicity scales nonlinearly with exposure.",
    ],
  },
  {
    icon: Target,
    title: "Targeted antibodies & small molecules",
    mechanism:
      "Monoclonal antibodies bind cell-surface targets for immune-mediated killing or blockade; small molecules enter cells to inhibit kinases or epigenetic regulators.",
    examplesNote:
      "HER2 antibodies, anti-VEGF agents, CD20 antibodies, and oral TKIs each carry distinct monitoring (echo, BP, infection risk).",
    bullets: [
      "Antibody–drug conjugates deliver chemotherapy payloads to cells expressing a surface antigen.",
      "Bispecific antibodies engage two epitopes simultaneously—novel but resource-intensive to administer.",
    ],
    cautions: [
      "QT prolongation, liver enzymes, or interstitial lung disease may appear on labs before symptoms—keep scheduled blood draws.",
    ],
  },
  {
    icon: Pill,
    title: "Endocrine therapies",
    mechanism:
      "Estrogen or androgen receptor–positive tumors may depend on hormone signaling; SERMs, aromatase inhibitors, and anti-androgens blockade different nodes in those pathways.",
    examplesNote:
      "Ovarian suppression plus AI is used in some premenopausal breast cancer algorithms.",
    bullets: [
      "Bone density monitoring matters because estrogen deprivation accelerates trabecular loss.",
      "Hot flashes and joint aches are common—supportive care quality affects adherence.",
    ],
    cautions: [
      "Pregnancy is contraindicated on teratogenic endocrine drugs even if periods resume.",
    ],
  },
  {
    icon: Flame,
    title: "Immune checkpoint inhibitors",
    mechanism:
      "PD-1, PD-L1, or CTLA-4 blockade reactivates exhausted T cells against tumors expressing neoantigens—most effective when immune infiltrate or MSI-high mutational burden is present.",
    examplesNote:
      "Dual checkpoint combinations increase efficacy and toxicity—hospitalization rates for colitis or hepatitis are higher.",
    bullets: [
      "Steroids are first-line for many immune-related adverse events; infliximab may be used for steroid-refractory colitis under specialist care.",
      "Endocrine irAEs (hypophysitis, thyroiditis) may require lifelong hormone replacement after recovery.",
    ],
    cautions: [
      "Live vaccines are generally avoided during active immunotherapy—ask your team before travel vaccines.",
    ],
  },
  {
    icon: Dna,
    title: "Antibody–drug conjugates & radiopharmaceuticals",
    mechanism:
      "ADCs tether a cytotoxic payload to a tumor-selective antibody; radiopharmaceuticals (e.g., some prostate therapies) deliver beta particles to bone-metastatic sites expressing surface markers.",
    examplesNote:
      "Both classes require nuclear medicine or specialized pharmacy workflows.",
    bullets: [
      "Myelosuppression and mucosal toxicity depend on payload potency and antigen expression in marrow.",
    ],
    cautions: [
      "Radiation safety instructions after systemic radionuclides include brief contact precautions for caregivers.",
    ],
  },
];

export const medicineConcepts: {
  id: string;
  title: string;
  body: string[];
}[] = [
  {
    id: "adme",
    title: "Absorption, metabolism, excretion—why “same drug” feels different",
    body: [
      "Kidney and liver function, food effects, and drug–drug interactions (CYP enzymes, transporters) change exposure.",
      "Pharmacogenomics (e.g., DPYD for some fluoropyrimidines) is entering routine care in some centers to avoid catastrophic toxicity.",
    ],
  },
  {
    id: "biosimilars",
    title: "Biosimilars vs generics",
    body: [
      "Small-molecule generics are identical in active ingredient; biologics are large proteins manufactured in living cells, so “highly similar” biosimilars require extrapolated indications with switching studies.",
    ],
  },
  {
    id: "trials",
    title: "Expanded access vs clinical trial",
    body: [
      "Compassionate use pathways exist when no trial fits but regulators and sponsors agree; they are not shortcuts around safety monitoring.",
    ],
  },
];
