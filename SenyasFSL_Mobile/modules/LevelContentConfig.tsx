import { LevelContent, Question_type } from "./Question";

export const LevelContentConfig: Record<number, LevelContent> = {
    1: {
        levelId: 1,
        section: 1,
        title: "Learn The Alphabets",
        description: "Halleluyah",
        questions: [
            {
                id: "1-1",
                type: Question_type.LEARN_A_SIGN,
                question: "Learn a new Sign",
                category: 'vowels',
                points: 10,
                video: [
                    {
                        id: "1",
                       url: "@/assests/video/Treasure.mp4" ,
                    },
                     {
                        id: "2",
                       url: "@/assests/video/Treasure.mp4" ,
                    }
                ],
                text: "qdwqdwqdw"
                
            }
            
        ]

    }
}