import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";

// Components
import Evaluation from "./Eval/Evaluation";
import OutOfHearts from "./Eval/OutOfHearts";
import BossFillTheGap from "./BossMode/BossFITG";
import BossMC from "./BossMode/BossMC";
import BossTrueOrFalse from "./BossMode/BossTF";
import BossVMC from "./BossMode/BossVMC";
import Instruction from "./BossMode";

interface BossFightProps {
  levelData: any;
  flowContent: Map<string, any>;
}

const BossFight: React.FC<BossFightProps> = ({ levelData, flowContent }) => {
  const router = useRouter();

  const [steps, setSteps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [score, setScore] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true); // ✅ Controls first screen


  // ✅ Load questions from flowContent
  useEffect(() => {
    if (!levelData || !flowContent) return;

    const fetchSteps = () => {
      setLoading(true);
      try {
        const questionKeys = levelData?.questionPool || [];
       
        const fetchedQuestions = questionKeys
          .map((key: string) => flowContent.get(key))
          .filter(Boolean);
     
        setSteps(fetchedQuestions);
      } catch (err) {
        console.error("Error fetching boss fight steps:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSteps();
  }, [levelData, flowContent]);

  // ✅ Handlers
  const handleNextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) setScore((prev) => prev + 1);
    else setHearts((prev) => Math.max(prev - 1, 0));
  };

  const restartLevel = () => {
    setHearts(5);
    setScore(0);
    setCurrentStep(0);
    setShowInstructions(true); // ✅ Back to instructions when restarting
  };

  // ✅ Render question types
  const renderStep = () => {
    if (hearts === 0) {
      return (
        <OutOfHearts
          onContinue={() => router.push("/(main_interface)")}
          onRetake={restartLevel}
        />
      );
    }

    if (!showInstructions && currentStep >= steps.length && steps.length > 0) {
      const totalQuestions = steps.length;
      const percent = (score / totalQuestions) * 100;
      return (
        <Evaluation
          percent={percent}
          onContinue={() => router.push("/(main_interface)")}
          onRetake={restartLevel}
        />
      );
    }

    if (loading) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (steps.length === 0) {
      return (
        <View style={styles.center}>
          <Text>No questions found for this boss fight.</Text>
        </View>
      );
    }

    // ✅ FIX: Access props directly from the 'step' object
    const step = steps[currentStep];
    if (!step) return <Text>No content for this step.</Text>;

    switch (step.type) {
      case "multiple_choice":
        return (
          <BossMC
            key={step.id}
            enPrompt={step.enPrompt}
            filPrompt={step.filPrompt}
            videoUrl={step.videoUrl} // Use 'videoUrl' to match Firestore
            options={step.options}
            onAnswer={handleAnswer}
            onPress={handleNextStep}
            hearts={hearts}
          />
        );
      case "fill_in_the_gap":
        return (
          <BossFillTheGap
            key={step.id}
            enPrompt={step.enPrompt}
            filPrompt={step.filPrompt}
            message="Alright!"
            videoURL={step.videoUrl} // Use 'videoUrl'
            options={step.options}
            onAnswer={handleAnswer}
            onPress={handleNextStep}
            hearts={hearts}
          />
        );
      case "true_or_false":
        return (
          <BossTrueOrFalse
            key={step.id}
            enQuestion={step.enPrompt}
            filQuestion={step.filPrompt}
            options={step.options}
            videoURL={step.videoUrl} // Use 'videoUrl'
            onAnswer={handleAnswer}
            onPress={handleNextStep}
            hearts={hearts}
          />
        );
      case "multiple_choice_video":
        return (
          <BossVMC
            key={step.id}
            enPrompt={step.enPrompt}
            filPrompt={step.filPrompt}
            options={step.options}
            onAnswer={handleAnswer}
            onPress={handleNextStep}
            hearts={hearts}
          />
        );
      default:
        return (
          <View style={styles.center}>
            <Text>Unknown question type: {step.type}</Text>
          </View>
        );
    }
  };

  // ✅ Main content renderer
  const renderContent = () => {
    // ✅ Step 1: Instruction first
    if (showInstructions) {
      return (
        <Instruction
          data={levelData.introduction}
          onPress={() => {
            // Only show game if steps exist
            if (steps.length > 0) setShowInstructions(false);
            else alert("No questions available for this boss fight.");
          }}
        />
      );
    }

    // ✅ Step 2: Game or Eval
    return renderStep();
  };

  return (
    <View style={styles.container}>
    
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", justifyContent: "center" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  heartsContainer: {
    flexDirection: "row",
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
  },
  heart: { fontSize: 24, color: "red", marginRight: 4 },
});

export default BossFight;
