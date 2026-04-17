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
      "Surgery removes the tumor when possible, or relieves problems like blockage or bleeding.",
    bullets: [
      "Often used to cure cancer when disease is still in one area.",
      "Extra steps, such as lymph-node checks, help plan whether other treatment is needed.",
      "Keyhole/minimally invasive surgery may reduce recovery time in suitable cases.",
    ],
    patientNotes: [
      "Good nutrition and breathing practice before major surgery can help recovery.",
      "Ask how surgery may affect scars, bowel function, and daily activities.",
    ],
  },
  {
    icon: Zap,
    name: "Radiation therapy",
    summary:
      "Radiation damages DNA in cancer cells so they cannot keep growing.",
    bullets: [
      "External beam radiation is most common; other types are used in special cases.",
      "Modern planning helps protect nearby healthy organs.",
      "Brachytherapy places radiation close to or inside some tumors.",
    ],
    patientNotes: [
      "Skin care, fatigue support, and swallowing advice are common during treatment.",
      "Report new rashes or unusual symptoms early.",
    ],
  },
  {
    icon: Syringe,
    name: "Systemic chemotherapy",
    summary:
      "Chemotherapy attacks fast-growing cells, including cancer cells and some healthy cells.",
    bullets: [
      "Doctors often combine drugs to improve results.",
      "Doses may be adjusted for safety based on age, organ function, and side effects.",
      "Support medicines are a normal part of care.",
    ],
    patientNotes: [
      "Numbness, tiredness, or concentration problems can happen and should be discussed.",
      "Ask about fertility options before treatment if future pregnancy matters to you.",
    ],
  },
  {
    icon: Target,
    name: "Targeted therapy",
    summary:
      "Targeted therapy blocks specific molecules that help cancer grow, but only if the target is present.",
    bullets: [
      "Lab tests decide who is likely to benefit from each drug.",
      "Cancer can change over time, so repeat testing may be needed later.",
      "Side effects depend on the drug and may include skin, liver, or blood pressure changes.",
    ],
    patientNotes: [
      "Many targeted drugs are tablets, but they still need strict schedules and regular blood tests.",
    ],
  },
  {
    icon: Shield,
    name: "Immunotherapy",
    summary:
      "Immunotherapy helps the immune system find and fight cancer.",
    bullets: [
      "It works very well in some cancers, but not in all people.",
      "Immune side effects can affect bowel, lungs, liver, skin, or hormone glands.",
      "CAR-T is a specialist treatment done in experienced centers.",
    ],
    patientNotes: [
      "New symptoms can appear even after treatment ends, so keep follow-up visits.",
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
      "Treatment plans are often discussed by a team: medical, surgical, and radiation doctors, plus radiology, pathology, nursing, and allied staff.",
      "Team meetings support decisions, but your final plan should still match your own goals and situation.",
    ],
  },
  {
    id: "intent",
    title: "Curative, adjuvant, neoadjuvant, or palliative—intent shapes toxicity tolerance",
    body: [
      "Neoadjuvant treatment is given before surgery. Adjuvant treatment is given after surgery.",
      "Palliative treatment focuses on symptom relief and quality of life, even when cure is not possible.",
    ],
  },
  {
    id: "trials",
    title: "Clinical trials sit alongside standard options",
    body: [
      "Clinical trials test new options and may be Phase I, II, or III.",
      "Ask who can join, what extra checks are needed, and what happens if the treatment does not work.",
    ],
  },
];
