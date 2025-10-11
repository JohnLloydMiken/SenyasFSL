import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { SignLanguageRecognitionConfig } from './SingLangugeRecognition/signLanguageRecognitionConfig';
import Index from '@/components/Game_Modes/SingLangugeRecognition/index';
import SingLangRecog from './SingLangugeRecognition/SingLangRecog';
import Evaluation from './Eval/Evaluation';
import { navigate } from "expo-router/build/global-state/routing";
interface SignLangRecogProps{
   level: string | string[];
}

const SignLangRecog: React.FC<SignLangRecogProps> = ({level}) => {
  const steps = SignLanguageRecognitionConfig[level as keyof typeof SignLanguageRecognitionConfig] || [];
    const [currentStep, setCurrentStep] = useState(0);
    const step = steps[currentStep];
    const renderStep = () => {

      switch(step.type){
        case "Instruction" : return <Index onPress={() => setCurrentStep((prev) => prev + 1)}/>
        case 'SingLangRecog': return <SingLangRecog {...step.data} onPress={()=> setCurrentStep((prev) => prev + 1)}/>
        case 'Evaluation': return <Evaluation percent={10}  onContinue={() => navigate("/(main_interface)")} onRetake={ () =>setCurrentStep(0)}/>
      }
  };
  return renderStep();
}

export default SignLangRecog;