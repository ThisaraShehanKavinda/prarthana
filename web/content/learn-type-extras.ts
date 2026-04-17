/** Extra interactive sections for `/learn/types/[slug]` keyed by cancer type slug. */

export type TypeExtra = {
  introHook: string;
  accordion: { id: string; title: string; body: string[] }[];
};

export const learnTypeExtras: Record<string, TypeExtra> = {
  carcinoma: {
    introHook:
      "Carcinomas are common because they start in lining tissues that renew often and are exposed to smoke, diet, infections, and other risks.",
    accordion: [
      {
        id: "precursor",
        title: "Precursor lesions and the adenoma–carcinoma sequence",
        body: [
          "Many bowel cancers start as polyps. Screening can find and remove these before they turn into cancer.",
          "Pathology terms such as dysplasia help doctors estimate how close abnormal cells are to becoming invasive cancer.",
        ],
      },
      {
        id: "spread",
        title: "Lymphatic vs hematogenous spread",
        body: [
          "Carcinomas often spread to nearby lymph nodes first. This helps guide surgery and radiation plans.",
          "Some subtypes can spread very early, even when scans still look limited.",
        ],
      },
    ],
  },
  sarcoma: {
    introHook:
      "Sarcomas are rare, so a painless growing lump can be ignored for too long. Early specialist review improves outcomes.",
    accordion: [
      {
        id: "biopsy",
        title: "Why incisional biopsy plans matter",
        body: [
          "Biopsy path and technique matter because they can affect later surgery options.",
          "Gene tests can help identify the exact sarcoma subtype, not just the basic microscope pattern.",
        ],
      },
      {
        id: "radiation",
        title: "Radiation timing with surgery",
        body: [
          "Radiation before surgery may shrink some sarcomas but can raise wound-healing problems. Teams balance both risks and benefits.",
        ],
      },
    ],
  },
  leukemia: {
    introHook:
      "Leukemia starts in blood-forming cells inside bone marrow, so symptoms often come from blood count changes rather than a visible lump.",
    accordion: [
      {
        id: "acute-chronic",
        title: "Acute vs chronic: speed and cell maturity",
        body: [
          "Acute leukemia grows fast and may need urgent treatment.",
          "Chronic leukemia can grow slowly, and some people are monitored before starting therapy.",
        ],
      },
      {
        id: "mrd",
        title: "Measurable residual disease (MRD)",
        body: [
          "MRD tests check for tiny amounts of disease after treatment. Results help estimate relapse risk and guide next steps.",
        ],
      },
    ],
  },
  lymphoma: {
    introHook:
      "Lymphoma includes Hodgkin and non-Hodgkin groups, then many subtypes based on cell type and genetics.",
    accordion: [
      {
        id: "pet",
        title: "Deauville scores and PET-adapted trials",
        body: [
          "In some protocols, PET scan response during treatment helps decide whether to continue, reduce, or intensify therapy.",
          "PET can also light up from infection or inflammation, so doctors read it with clinical context.",
        ],
      },
      {
        id: "rituximab",
        title: "CD20-targeted therapy revolutionized B-cell lymphomas",
        body: [
          "Anti-CD20 drugs (such as in R-CHOP) improved outcomes in many B-cell lymphomas, though resistance can still occur.",
        ],
      },
    ],
  },
  cns: {
    introHook:
      "Primary brain and spinal cord tumors follow different staging logic from many other cancers, and modern diagnosis combines microscope and molecular findings.",
    accordion: [
      {
        id: "bbb",
        title: "Blood–brain barrier and drug delivery",
        body: [
          "The blood-brain barrier blocks many drugs, so delivery to the tumor can be difficult.",
        ],
      },
      {
        id: "rt",
        title: "Radiation sensitizers and cognition-sparing plans",
        body: [
          "Teams try to protect memory and other key brain functions when planning radiation, especially in children.",
        ],
      },
    ],
  },
  childhood: {
    introHook:
      "In childhood cancer, long-term follow-up is part of treatment because survivors may live many years after cure.",
    accordion: [
      {
        id: "late-effects",
        title: "Cardiac, endocrine, and second malignancy surveillance",
        body: [
          "Some treatments can affect heart, hormone, or growth health later, so regular checks are important.",
          "Second cancers are uncommon but possible, so healthy habits and follow-up still matter after cure.",
        ],
      },
      {
        id: "fertility",
        title: "Fertility and psychosocial anchors",
        body: [
          "Fertility-preservation options may be discussed before treatment when appropriate.",
          "School return plans and peer support help children and teens stay connected during recovery.",
        ],
      },
    ],
  },
};

export function getTypeExtra(slug: string): TypeExtra | undefined {
  return learnTypeExtras[slug];
}
