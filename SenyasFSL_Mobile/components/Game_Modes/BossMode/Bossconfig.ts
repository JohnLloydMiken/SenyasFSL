export const Bossconfig = {
  "5": [
    {
      type: "Instruction",
    },
    {
      type: "MultipleChoice",
      data: {
        videoUrl: "FSL_A.mp4",
        title: "Choose the Corect Sign!",
        choices: [
          ["Letter A", "Letrang A"],
          ["Letter B", "Letrang B"],
          ["Letter C", "Letrang C"],
          ["Letter D", "Letrang D"],
        ],
        correctAnswer: "Letter A",
      },
    },
    {
      type: "VideoMultipleChoice",
      data: {
        title: "Choose the Corect Sign!",
        choices: [
          ["Letter E", "Letrang E"],
          ["Letter G", "Letrang G"],
          ["Letter F", "Letrang F"],
        ],
        correctAnswer: "Letter E",
        videoSources: ["FSL_A.mp4", "FSL_B.mp4", "FSL_G.mp4"],
      },
    },
    {
      type: "MultipleChoice",
      data: {
        videoUrl: "FSL_Y.mp4",
        title: "Choose the Corect Sign!",
        choices: [
          ["Letter A", "Letrang A"],
          ["Letter B", "Letrang B"],
          ["Letter C", "Letrang C"],
          ["Letter D", "Letrang D"],
        ],
        correctAnswer: "Letter D",
      },
    },
    {
        type: "Evaluation"
    },
    {
        type: "RunOutOfHearts"
    },
  ],
} as const;
