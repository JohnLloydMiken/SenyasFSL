import { View, Text } from "react-native";
import React, { useState } from "react";
import BossViewMCProps from "./BossMode/BossVMC";
import { Bossconfig } from "./BossMode/Bossconfig";
import Instruction from "./BossMode";
import BossMultipleChoiceProps from "./BossMode/BossMC";
import Evaluation from "./Eval/Evaluation";
import OutOfHearts from "./Eval/OutOfHearts";
interface BossFightProp {
  level: string | string[];
}

const BossFight: React.FC<BossFightProp> = ({ level }) => {
  const steps = Bossconfig[level as keyof typeof Bossconfig] || [];
  const [currentStep, setCurrentStep] = useState(0);
  const [hearts, setHearts] = useState(3); // ❤️ start with 3 hearts
  const step = steps[currentStep];

 const handleAnswer = (isCorrect: boolean) => {
  if (!isCorrect) {
    setHearts((prev) => Math.max(prev - 1, 0)); // never below 0
  }
};

  const renderStep = () => {
    // ✅ check hearts first
    if (hearts === 0) {
      return <OutOfHearts />;
    }

    // ✅ if user reached the end, show Evaluation
    if (currentStep >= steps.length) {
      return (
        <Evaluation
          percent={10} // TODO: replace with actual score calculation
          onContinue={() => console.log("Continue")}
          onRetake={() => {
            setHearts(3);
            setCurrentStep(1); // restart after Instruction
          }}
        />
      );
    }
  switch (step.type) {
    case "Instruction":
      return (
        <Instruction onPress={() => setCurrentStep((prev) => prev + 1)} />
      );

    case "MultipleChoice":
      return (
        <BossMultipleChoiceProps
          {...step.data}
          hearts={hearts} // ✅ pass hearts
          onAnswer={handleAnswer} // ✅ pass callback
          onPress={() => setCurrentStep((prev) => prev + 1)}
        />
      );

    case "VideoMultipleChoice":
      return (
        <BossViewMCProps
          {...step.data}
          hearts={hearts} // ✅ pass hearts
          onAnswer={handleAnswer} // ✅ pass callback
          onPress={() => setCurrentStep((prev) => prev + 1)}
        />
      );
  
  }
};


  return (
   

      renderStep()
   
  );
};

export default BossFight;
