export interface CancerTypeInfo {
  slug: string;
  title: string;
  short: string;
  howItAffects: string;
  reasons: string[];
  screening?: string;
}

export const cancerTypes: CancerTypeInfo[] = [
  {
    slug: "carcinoma",
    title: "Carcinomas",
    short: "Cancers that begin in epithelial tissue lining organs and skin.",
    howItAffects:
      "Epithelial cells line surfaces inside and outside the body. When DNA damage accumulates, cells can grow abnormally, invade nearby tissue, and sometimes spread through lymph or blood.",
    reasons: [
      "Tobacco and alcohol exposure",
      "UV radiation (skin)",
      "Chronic inflammation",
      "Some infections (e.g., HPV-related cancers)",
      "Inherited susceptibility in a minority of families",
    ],
    screening:
      "Screening exists for select carcinomas (e.g., breast, colorectal, cervical) depending on age and risk—follow local guidelines.",
  },
  {
    slug: "sarcoma",
    title: "Sarcomas",
    short: "Cancers arising from bone, cartilage, fat, muscle, or connective tissue.",
    howItAffects:
      "Sarcomas often present as a growing mass in soft tissue or bone. They can compress structures locally and metastasize, commonly to the lungs.",
    reasons: [
      "Most cases are sporadic with no clear cause",
      "Prior radiation exposure (a known risk for some sarcomas)",
      "Certain genetic syndromes (e.g., Li-Fraumeni, NF1)",
    ],
  },
  {
    slug: "leukemia",
    title: "Leukemias",
    short: "Blood cancers involving bone marrow and abnormal white blood cells.",
    howItAffects:
      "Marrow crowding reduces healthy blood cell production, leading to anemia, infection risk, and bleeding tendencies. Circulating abnormal cells can infiltrate organs.",
    reasons: [
      "Ionizing radiation (dose-dependent risk)",
      "Some chemotherapy agents used for other cancers",
      "Certain inherited conditions",
      "Smoking linked to some adult leukemias",
    ],
  },
  {
    slug: "lymphoma",
    title: "Lymphomas",
    short: "Cancers of lymphocytes in lymph nodes and lymphatic tissue.",
    howItAffects:
      "Enlarged lymph nodes, B symptoms (fever, night sweats, weight loss), and organ involvement depending on subtype and stage.",
    reasons: [
      "Immune suppression / HIV increases risk for some lymphomas",
      "Epstein–Barr virus and other infections in specific subtypes",
      "Family history contributes modestly in a subset",
    ],
  },
  {
    slug: "cns",
    title: "Brain & spinal cord tumors",
    short: "Primary tumors of the central nervous system (not metastases from elsewhere).",
    howItAffects:
      "Symptoms arise from focal brain or cord dysfunction: seizures, headaches, weakness, speech or vision changes—depending on tumor location and growth rate.",
    reasons: [
      "Most primary CNS tumors are sporadic",
      "Prior therapeutic radiation",
      "Rare inherited tumor syndromes (e.g., neurofibromatosis)",
    ],
  },
  {
    slug: "childhood",
    title: "Childhood cancers",
    short: "A diverse group—leukemias, brain tumors, lymphomas, and solid tumors predominate.",
    howItAffects:
      "Children are not ‘small adults’: biology, tolerability of therapy, and survivorship needs differ. Multidisciplinary pediatric oncology centers guide care.",
    reasons: [
      "Most childhood cancers lack a modifiable lifestyle cause",
      "A minority relate to congenital or genetic predisposition",
      "Environmental causes are difficult to prove for many cases",
    ],
  },
];
