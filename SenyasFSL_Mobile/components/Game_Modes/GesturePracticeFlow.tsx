// Game_Modes/SignPracticeFlow.tsx

import React, { useState } from 'react';
import Instruction from '@/components/Game_Modes/SingLangugeRecognition/index';
import SingLangRecog from './SingLangugeRecognition/SingLangRecog';

// This component receives the database props from [levelId].tsx
interface SignPracticeFlowProps {
  levelData: any;
  flowContent: Map<string, any>;
  onPress: () => void; // This is the 'onComplete' function
}

const SignPracticeFlow: React.FC<SignPracticeFlowProps> = ({
  levelData,
  flowContent,
  onPress,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const renderStep = () => {
    switch (currentStep) {
      // Step 0: Show the instructions (from index.tsx)
      case 0:
        return <Instruction onPress={() => setCurrentStep(1)} />;

      // Step 1: Show the game, passing the database props
      case 1:
        return (
          <SingLangRecog
            levelData={levelData}
            flowContent={flowContent}
            onPress={onPress} // Pass the final navigation function
          />
        );
      
      // Default to the game just in case
      default:
        return (
          <SingLangRecog
            levelData={levelData}
            flowContent={flowContent}
            onPress={onPress}
          />
        );
    }
  };

  return renderStep();
};

export default SignPracticeFlow;