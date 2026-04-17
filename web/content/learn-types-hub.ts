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
      "Carcinomas start in lining cells, sarcomas in connective tissue, and leukemias/lymphomas in blood or lymph systems.",
      "When cancer spreads, it keeps its original type. Colon cancer that spreads to the liver is still colon cancer.",
    ],
  },
  {
    id: "grade-stage",
    title: "Grade vs stage: speed vs spread",
    body: [
      "Grade tells how abnormal the cancer cells look under a microscope.",
      "Stage tells how far the cancer has spread in the body. Two people can have the same stage but still need different treatment.",
    ],
  },
  {
    id: "pathology",
    title: "Why the microscope still matters in a molecular era",
    body: [
      "Lab tests like immunohistochemistry and gene testing help confirm the exact cancer type.",
      "How a biopsy is taken and handled affects which tests can be done later, so first-step planning is important.",
    ],
  },
];
