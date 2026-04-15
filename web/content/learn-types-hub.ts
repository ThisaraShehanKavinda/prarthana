/** Rich hub copy for `/learn/types` — taxonomy before the topic cards. */

export const typesTaxonomy: {
  id: string;
  title: string;
  body: string[];
}[] = [
  {
    id: "lineage",
    title: "Lineage: where the cell of origin lived",
    body: [
      "Carcinomas start in epithelial layers; sarcomas in connective tissues; leukemias and lymphomas in blood-forming or lymphoid systems. That lineage predicts spread patterns and drug classes that might work.",
      "Metastasis means the tumor’s new site still carries the original lineage—colon cancer in the liver is still adenocarcinoma of colorectal origin, not “liver cancer” in the primary sense.",
    ],
  },
  {
    id: "grade-stage",
    title: "Grade vs stage: speed vs spread",
    body: [
      "Grade (or differentiation in some systems) reflects how abnormal cells look—often linked to aggressiveness within a type.",
      "Stage summarizes tumor size, nodal involvement, and metastasis (TNM and extensions). Two patients can share a stage yet differ in biomarkers and fitness.",
    ],
  },
  {
    id: "pathology",
    title: "Why the microscope still matters in a molecular era",
    body: [
      "Immunohistochemistry and gene panels refine diagnosis when morphology alone is ambiguous—especially in lymphomas and soft tissue tumors.",
      "Biopsy type (core vs excision) and tissue handling affect what downstream tests can be ordered; this is why teams plan the first procedure carefully.",
    ],
  },
];
