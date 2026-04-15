/** Extra interactive sections for `/learn/types/[slug]` keyed by cancer type slug. */

export type TypeExtra = {
  introHook: string;
  accordion: { id: string; title: string; body: string[] }[];
};

export const learnTypeExtras: Record<string, TypeExtra> = {
  carcinoma: {
    introHook:
      "Carcinomas dominate cancer registries because epithelial tissues renew constantly and face carcinogens directly—skin, aerodigestive mucosa, breast ducts, prostate glands, and colonic crypts are all high-turnover interfaces.",
    accordion: [
      {
        id: "precursor",
        title: "Precursor lesions and the adenoma–carcinoma sequence",
        body: [
          "Many colorectal cancers pass through polyp stages detectable by endoscopy—why screening removes precancers, not only early invasive cancers.",
          "Dysplasia grading in Barrett esophagus or cervical cytology communicates how close cells are to invasion.",
        ],
      },
      {
        id: "spread",
        title: "Lymphatic vs hematogenous spread",
        body: [
          "Carcinomas often drain predictably to regional nodes first, which guides surgical templates and radiation fields.",
          "Some subtypes (triple-negative breast, pancreatic ductal) show early micrometastatic biology even when imaging looks localized.",
        ],
      },
    ],
  },
  sarcoma: {
    introHook:
      "Sarcomas are rare enough that symptoms (a painless growing mass) are easy to dismiss—yet biopsy technique and referral to a sarcoma-experienced center materially affect limb salvage and survival.",
    accordion: [
      {
        id: "biopsy",
        title: "Why incisional biopsy plans matter",
        body: [
          "Violating the wrong tissue planes can seed compartments and compromise later limb-sparing surgery—core needle diagnosis is preferred when feasible.",
          "Molecular translocations (e.g., EWSR1 fusions) refine subtype classification beyond light microscopy alone.",
        ],
      },
      {
        id: "radiation",
        title: "Radiation timing with surgery",
        body: [
          "Preoperative radiation may shrink high-grade extremity sarcomas but increases wound complications; teams weigh logistics and margin status.",
        ],
      },
    ],
  },
  leukemia: {
    introHook:
      "Leukemias blur the line between ‘solid’ and ‘liquid’ disease because marrow is an organ you cannot see—symptoms reflect cytopenias and blast burden until flow cytometry classifies lineage.",
    accordion: [
      {
        id: "acute-chronic",
        title: "Acute vs chronic: speed and cell maturity",
        body: [
          "Acute leukemias stack immature blasts quickly—often a medical emergency if counts are extreme.",
          "Chronic leukemias may be monitored for years before therapy starts, guided by molecular response milestones.",
        ],
      },
      {
        id: "mrd",
        title: "Measurable residual disease (MRD)",
        body: [
          "Flow or sequencing-based MRD negativity predicts relapse risk after induction—trials intensify or de-escalate therapy based on these thresholds.",
        ],
      },
    ],
  },
  lymphoma: {
    introHook:
      "Lymphomas split broadly into Hodgkin and non-Hodgkin families, then subdivide by cell of origin (B vs T), genetics, and nodal vs extranodal presentation—PET-adapted therapy is common in curative regimens.",
    accordion: [
      {
        id: "pet",
        title: "Deauville scores and PET-adapted trials",
        body: [
          "Interim PET negativity can allow abbreviated chemotherapy in some Hodgkin trials; positivity triggers escalation pathways.",
          "False positives occur with infection or inflammation—clinical correlation matters.",
        ],
      },
      {
        id: "rituximab",
        title: "CD20-targeted therapy revolutionized B-cell lymphomas",
        body: [
          "R-CHOP and variants embed monoclonal antibodies into curative-intent regimens; resistance mechanisms include losing CD20 expression.",
        ],
      },
    ],
  },
  cns: {
    introHook:
      "Primary CNS tumors challenge the classic TNM template because ‘metastasis’ inside the neuraxis is still local progression—integrated histomolecular diagnoses (WHO CNS5) now drive prognosis as much as grade alone.",
    accordion: [
      {
        id: "bbb",
        title: "Blood–brain barrier and drug delivery",
        body: [
          "Many small molecules do not penetrate adequately; neuro-oncology trials test pulsed low-intensity ultrasound, convection-enhanced delivery, or intrathecal routes.",
        ],
      },
      {
        id: "rt",
        title: "Radiation sensitizers and cognition-sparing plans",
        body: [
          "Proton therapy may spare cochlea or hypothalamus in pediatric medulloblastoma paths; hippocampal avoidance whole-brain RT is explored in select metastatic settings.",
        ],
      },
    ],
  },
  childhood: {
    introHook:
      "Childhood cancer biology often involves developmental pathways gone awry; survivors may spend more years living with late effects than with active disease—making survivorship clinics part of the cure.",
    accordion: [
      {
        id: "late-effects",
        title: "Cardiac, endocrine, and second malignancy surveillance",
        body: [
          "Anthracyclines and chest RT elevate late cardiomyopathy risk; TSH and growth monitoring follow cranial RT.",
          "Second cancers are rare but real—sun protection and smoking avoidance still matter after pediatric cure.",
        ],
      },
      {
        id: "fertility",
        title: "Fertility and psychosocial anchors",
        body: [
          "Ovarian tissue cryopreservation or sperm banking may be offered before gonadotoxic therapy when clinically appropriate.",
          "School reintegration and peer support reduce dropout and isolation during maintenance phases.",
        ],
      },
    ],
  },
};

export function getTypeExtra(slug: string): TypeExtra | undefined {
  return learnTypeExtras[slug];
}
