export const SignLanguageRecognitionConfig = {
  "2": [
    {
      type: "Instruction",
    },
    {
      type: "SingLangRecog",
      data: {
        videoUrl: ["FSL_A.mp4", "FSL_B.mp4", "FSL_C.mp4", "FSL_E.mp4", "FSL_G.mp4", "FSL_H.mp4","FSL_I.mp4", "FSL_J.mp4", "FSL_L.mp4", "FSL_M.mp4"],
        title: "Sign the Filipino Language: ",
        questions: [
          ["Letter A", "Letrang A"],
          ["Letter B", "Letrang B"],
          ["Letter C", "Letrang C"],
          ["Letter E", "Letrang E"],
          ["Letter G", "Letrang G"],
          ["Letter H", "Letrang H"],
          ["Letter I", "Letrang I"],
          ["Letter J", "Letrang J"],
          ["Letter L", "Letrang L"],
          ["Letter M", "Letrang M"],
        ],
        correctAnswers: ["A", "B","C","E", "G","H","I", "J","L","M"],
      },
    },
  
    {
        type: "Evaluation"
    },
   
  ],
} as const;
