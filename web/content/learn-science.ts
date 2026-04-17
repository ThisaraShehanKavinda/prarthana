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
      "Cancer cells collect many DNA changes when repair systems do not work well.",
    bullets: [
      "Some genes become overactive (oncogenes), while others lose their protective role (tumor suppressors).",
      "MSI-high tumors have many mutations and can respond differently to some treatments.",
    ],
  },
  {
    id: "hallmarks",
    title: "Hallmarks of cancer (conceptual scaffold)",
    lead:
      "The hallmarks model groups common cancer abilities, such as fast growth, spread, and immune escape.",
    bullets: [
      "The model keeps evolving as science finds new patterns.",
      "One treatment may block one pathway while others stay active, so combinations are often tested.",
    ],
  },
  {
    id: "staging",
    title: "Staging, grading, and biomarkers",
    lead:
      "Stage shows spread, grade shows cell appearance, and biomarkers help match treatments.",
    bullets: [
      "Liquid biopsy can detect tumor DNA in blood in some situations.",
      "Staging systems are updated over time, so edition and date matter.",
    ],
  },
  {
    id: "therapy-maps",
    title: "How therapies map onto cell biology",
    lead:
      "Treatments work by targeting weak points in cancer biology, such as DNA repair, growth signals, or immune checkpoints.",
    bullets: [
      "Therapeutic antibodies can do more than block one receptor.",
      "PARP inhibitors in BRCA-related cancers are a clear example of genetics guiding therapy.",
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
      "Cancer is made of mixed cell groups. Treatment may kill some groups but leave resistant ones.",
      "That is why repeat biomarker testing is often needed when advanced cancer progresses.",
    ],
  },
  {
    id: "micro",
    title: "Tumor microenvironment: not just filler tissue",
    body: [
      "Cells and structures around the tumor can affect drug delivery and immune response.",
      "Some drugs briefly improve blood-vessel function and may help other treatments work better.",
    ],
  },
  {
    id: "model",
    title: "From dish to mouse to human: limits of models",
    body: [
      "Lab models are useful but never perfect copies of real patients.",
      "Even negative trials are valuable because they show what does not work.",
    ],
  },
];
