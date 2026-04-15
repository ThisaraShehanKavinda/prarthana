/** Rich modules and deep dives for `/learn/science`. */

export const scienceModulesRich: {
  id: string;
  title: string;
  lead: string;
  bullets: string[];
}[] = [
  {
    id: "dna",
    title: "DNA damage, repair, and genome instability",
    lead:
      "Cancer genomes are messy: point mutations, indels, copy-number changes, and chromothripsis accumulate when repair pathways (TP53, BRCA-related HR, mismatch repair) fail or are overwhelmed.",
    bullets: [
      "Oncogenes gain function (e.g., constitutive kinase signaling); tumor suppressors lose brakes (two-hit hypothesis still teaches the logic).",
      "Microsatellite instability (MSI) from mismatch repair deficiency creates hypermutated tumors that neoantigen-load the immune system—biologically and therapeutically important.",
    ],
  },
  {
    id: "hallmarks",
    title: "Hallmarks of cancer (conceptual scaffold)",
    lead:
      "Hanahan & Weinberg’s framework groups capabilities—sustaining proliferation, resisting cell death, angiogenesis, invasion/metastasis, metabolic reprogramming, immune evasion—so textbooks can explain why tumors are ecosystems, not clones in isolation.",
    bullets: [
      "Emerging hallmarks include unlocking phenotypic plasticity and senescent cells influencing the microenvironment.",
      "Therapies often attack one hallmark while selecting for compensatory pathways—combination trials try to close escape routes.",
    ],
  },
  {
    id: "staging",
    title: "Staging, grading, and biomarkers",
    lead:
      "TNM staging summarizes anatomic extent; grade reflects differentiation; biomarkers (ER/PR, HER2, PD-L1, EGFR mutations) refine prognosis and drug matching.",
    bullets: [
      "Liquid biopsy detects circulating tumor DNA—useful when tissue is scarce or to track resistance dynamics, with false-negative caveats at very low burden.",
      "AJCC editions update staging rules as data mature; always cite the edition used in a chart.",
    ],
  },
  {
    id: "therapy-maps",
    title: "How therapies map onto cell biology",
    lead:
      "DNA-damaging agents and radiation exploit repair defects; targeted drugs choke addicted pathways; immunotherapy removes brakes so T cells recognize neoantigens presented on MHC.",
    bullets: [
      "Antibody-dependent cellular phagocytosis (ADCP) and complement contribute to therapeutic antibody effects beyond simple receptor blockade.",
      "Synthetic lethality (PARP inhibitors in BRCA-deficient cells) is a proof that genetics guides drug design.",
    ],
  },
];

export const scienceDeepDive: {
  id: string;
  title: string;
  body: string[];
}[] = [
  {
    id: "clonal",
    title: "Clonal evolution: why cancers change mid-treatment",
    body: [
      "Tumors are polyclonal; therapy removes sensitive clones and leaves resistant ones room to expand—serial sampling sometimes shows branching evolution trees.",
      "This is why ‘repeat biomarker testing’ is standard in advanced lung cancer or colorectal cancer after progression.",
    ],
  },
  {
    id: "micro",
    title: "Tumor microenvironment: not just filler tissue",
    body: [
      "Cancer-associated fibroblasts, myeloid cells, extracellular matrix stiffness, and hypoxia all influence drug penetration and immune infiltration.",
      "Anti-angiogenic drugs normalize chaotic vessels briefly, which can paradoxically improve chemotherapy delivery in some windows.",
    ],
  },
  {
    id: "model",
    title: "From dish to mouse to human: limits of models",
    body: [
      "Cell lines drift genetically; patient-derived xenografts are expensive; organoids bridge some gaps but lack full immune context unless humanized.",
      "Negative trial results still advance science by ruling out hypotheses—media often underreports those lessons.",
    ],
  },
];
