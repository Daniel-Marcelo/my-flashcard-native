import { useState } from "react";
import { StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import Animated, {
  useAnimatedStyle,
  withSpring,
  interpolate,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

// TODO: Replace with actual data from your backend
const MOCK_FLASHCARDS = [
  { id: "1", front: "Hello", back: "Hola" },
  { id: "2", front: "Goodbye", back: "Adiós" },
  { id: "3", front: "Thank you", back: "Gracias" },
  { id: "4", front: "Please", back: "Por favor" },
  { id: "5", front: "Yes", back: "Sí" },
  { id: "6", front: "No", back: "No" },
  { id: "7", front: "Good morning", back: "Buenos días" },
  { id: "8", front: "Good night", back: "Buenas noches" },
];

type Flashcard = {
  id: string;
  front: string;
  back: string;
};

type ReviewResult = {
  flashcard: Flashcard;
  remembered: boolean;
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CARD_WIDTH = Math.min(SCREEN_WIDTH - 40, 400);
const CARD_HEIGHT = Math.min(SCREEN_HEIGHT * 0.4, 300);

const AnimatedFlashcard = ({
  flashcard,
  resetFlip,
}: {
  flashcard: Flashcard;
  resetFlip: boolean;
}) => {
  const flipProgress = useSharedValue(0);

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipProgress.value, [0, 1], [0, 180]);
    return {
      transform: [{ perspective: 1000 }, { rotateY: `${rotateY}deg` }],
      backfaceVisibility: "hidden",
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipProgress.value, [0, 1], [180, 360]);
    return {
      transform: [{ perspective: 1000 }, { rotateY: `${rotateY}deg` }],
      backfaceVisibility: "hidden",
    };
  });

  const handlePress = () => {
    flipProgress.value = withSpring(flipProgress.value === 0 ? 1 : 0, {
      damping: 15,
      stiffness: 100,
    });
  };

  // Reset the card when resetFlip changes
  if (resetFlip) {
    flipProgress.value = withTiming(0, { duration: 300 });
  }

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={1}>
      <ThemedView style={styles.cardContainer}>
        <Animated.View style={[styles.card, frontAnimatedStyle]}>
          <ThemedText style={styles.cardText}>{flashcard.front}</ThemedText>
        </Animated.View>
        <Animated.View
          style={[styles.card, styles.cardBack, backAnimatedStyle]}
        >
          <ThemedText style={styles.cardText}>{flashcard.back}</ThemedText>
        </Animated.View>
      </ThemedView>
    </TouchableOpacity>
  );
};

const ReviewSummary = ({ results }: { results: ReviewResult[] }) => {
  const correctCount = results.filter((r) => r.remembered).length;
  const totalCount = results.length;
  const percentage = Math.round((correctCount / totalCount) * 100);

  return (
    <ThemedView style={styles.summaryContainer}>
      <ThemedText type="title" style={styles.summaryTitle}>
        Review Complete!
      </ThemedText>

      <ThemedView style={styles.statsContainer}>
        <ThemedText style={styles.statsText}>
          You got {correctCount} out of {totalCount} correct ({percentage}%)
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.resultsContainer}>
        <ThemedText type="subtitle" style={styles.resultsTitle}>
          Results:
        </ThemedText>
        {results.map((result, index) => (
          <ThemedView key={result.flashcard.id} style={styles.resultItem}>
            <ThemedText style={styles.resultText}>
              {result.flashcard.front} → {result.flashcard.back}
            </ThemedText>
            <ThemedText
              style={[
                styles.resultStatus,
                result.remembered ? styles.correctText : styles.incorrectText,
              ]}
            >
              {result.remembered ? "✓" : "✕"}
            </ThemedText>
          </ThemedView>
        ))}
      </ThemedView>

      <TouchableOpacity style={styles.button} onPress={() => router.back()}>
        <ThemedText style={styles.buttonText}>Back to Deck</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
};

const ReviewScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [resetFlip, setResetFlip] = useState(false);
  const [showCard, setShowCard] = useState(true);
  const [reviewResults, setReviewResults] = useState<ReviewResult[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  // TODO: Fetch actual deck data using the id
  const currentCard = MOCK_FLASHCARDS[currentCardIndex];

  const handleMark = (remembered: boolean) => {
    // Save the result
    setReviewResults((prev) => [
      ...prev,
      { flashcard: currentCard, remembered },
    ]);

    // Move to next card
    if (currentCardIndex < MOCK_FLASHCARDS.length - 1) {
      setShowCard(false);
      setTimeout(() => {
        setCurrentCardIndex(currentCardIndex + 1);
        setShowCard(true);
      }, 50);
    } else {
      setIsComplete(true);
    }
  };

  if (isComplete) {
    return <ReviewSummary results={reviewResults} />;
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.progressContainer}>
        <ThemedText style={styles.progressText}>
          Card {currentCardIndex + 1} of {MOCK_FLASHCARDS.length}
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.cardWrapper}>
        {showCard && (
          <AnimatedFlashcard
            key={currentCard.id}
            flashcard={currentCard}
            resetFlip={resetFlip}
          />
        )}
      </ThemedView>

      <ThemedView style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.wrongButton]}
          onPress={() => handleMark(false)}
        >
          <ThemedText style={styles.buttonText}>✕</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.correctButton]}
          onPress={() => handleMark(true)}
        >
          <ThemedText style={styles.buttonText}>✓</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  progressContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  progressText: {
    fontSize: 16,
    color: "#666",
  },
  cardWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  card: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  cardBack: {
    backgroundColor: "#f8f8f8",
  },
  cardText: {
    fontSize: 24,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginTop: 30,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  wrongButton: {
    backgroundColor: "#ff4444",
  },
  correctButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  summaryContainer: {
    flex: 1,
    padding: 20,
  },
  summaryTitle: {
    textAlign: "center",
    marginBottom: 20,
  },
  statsContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  statsText: {
    fontSize: 18,
    color: "#666",
  },
  resultsContainer: {
    flex: 1,
    gap: 10,
  },
  resultsTitle: {
    marginBottom: 10,
  },
  resultItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  resultText: {
    fontSize: 16,
  },
  resultStatus: {
    fontSize: 20,
    fontWeight: "bold",
  },
  correctText: {
    color: "#4CAF50",
  },
  incorrectText: {
    color: "#ff4444",
  },
});

export default ReviewScreen;
