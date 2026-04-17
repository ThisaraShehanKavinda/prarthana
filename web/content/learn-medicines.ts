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
      "These drugs damage cancer cells in different ways, such as harming DNA or blocking cell division.",
    examplesNote:
      "Brand names differ by country; regimens are protocol-driven (FOLFOX, AC-T, R-CHOP, etc.).",
    bullets: [
      "Some drugs work best at specific stages of cell growth.",
      "Support steps around treatment are planned parts of safe care.",
      "Nurses watch IV sites carefully to prevent tissue injury.",
    ],
    cautions: [
      "Never use someone else's medicine plan. Dosing is individual and safety-critical.",
    ],
  },
  {
    icon: Target,
    title: "Targeted antibodies & small molecules",
    mechanism:
      "These medicines target specific proteins or signals that cancer cells depend on.",
    examplesNote:
      "HER2 antibodies, anti-VEGF agents, CD20 antibodies, and oral TKIs each carry distinct monitoring (echo, BP, infection risk).",
    bullets: [
      "Some antibody drugs carry chemotherapy directly to target cells.",
      "Newer designs can bind more than one target at a time.",
    ],
    cautions: [
      "Lab tests are important because side effects may appear before symptoms.",
    ],
  },
  {
    icon: Pill,
    title: "Endocrine therapies",
    mechanism:
      "These drugs lower or block hormone signals that some cancers need to grow.",
    examplesNote:
      "Ovarian suppression plus AI is used in some premenopausal breast cancer algorithms.",
    bullets: [
      "Bone health checks are often needed during long treatment.",
      "Hot flashes and joint pain are common and should be managed early.",
    ],
    cautions: [
      "Some endocrine drugs are unsafe in pregnancy. Discuss contraception with your care team.",
    ],
  },
  {
    icon: Flame,
    title: "Immune checkpoint inhibitors",
    mechanism:
      "These drugs release immune brakes so T cells can attack cancer.",
    examplesNote:
      "Dual checkpoint combinations increase efficacy and toxicity—hospitalization rates for colitis or hepatitis are higher.",
    bullets: [
      "Doctors often use steroids to treat immune side effects.",
      "Some hormone-gland side effects can last long term.",
    ],
    cautions: [
      "Always ask before vaccines or new medicines during active treatment.",
    ],
  },
  {
    icon: Dna,
    title: "Antibody–drug conjugates & radiopharmaceuticals",
    mechanism:
      "These treatments deliver toxic payloads or radiation more directly to cancer targets.",
    examplesNote:
      "Both classes require nuclear medicine or specialized pharmacy workflows.",
    bullets: [
      "Blood count changes can happen and need monitoring.",
    ],
    cautions: [
      "Follow radiation-safety advice carefully after radiopharmaceutical treatment.",
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
      "Kidney/liver function, food, and drug interactions can change how strongly a medicine affects you.",
      "In some settings, gene tests are used to lower the risk of severe side effects.",
    ],
  },
  {
    id: "biosimilars",
    title: "Biosimilars vs generics",
    body: [
      "Generics are copies of small-molecule drugs. Biosimilars are very close versions of biologic drugs made in living cells.",
    ],
  },
  {
    id: "trials",
    title: "Expanded access vs clinical trial",
    body: [
      "Compassionate use may be possible when no trial fits, but safety checks are still required.",
    ],
  },
];
