interface MCProps{
    choices: string
}
export const LevelConfig = {
  "1": [
    {
      type: "LearnASign",
      data: {
        videoUrl: "FSL_A.mp4",
        title: "Learn A New Sign!",
        EnglishText: "Letter A",
        FilipinoText: "Letrang A",
      },
    },
    {
        type: "MultipleChoice",
        data:{
        videoUrl: "FSL_A.mp4",
        title: "Choose the Corect Sign!",
        choices: [["Letter A", "Letrang A"] , ["Letter B", "Letrang B"]] ,
        correctAnswer: "Letter A"
        }
    } 
  ],
} as const
