import { useState } from "react";
import { StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { useLocalSearchParams } from "expo-router";
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

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH - 40;

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

const ReviewScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [resetFlip, setResetFlip] = useState(false);
  const [showCard, setShowCard] = useState(true);

  // TODO: Fetch actual deck data using the id
  const currentCard = MOCK_FLASHCARDS[currentCardIndex];

  const handleMark = (remembered: boolean) => {
    // TODO: Save the user's response to the backend
    console.log(
      `Card ${currentCard.id} marked as ${
        remembered ? "remembered" : "not remembered"
      }`
    );

    // Move to next card
    if (currentCardIndex < MOCK_FLASHCARDS.length - 1) {
      setShowCard(false);
      setTimeout(() => {
        setCurrentCardIndex(currentCardIndex + 1);
        setShowCard(true);
      }, 50);
    } else {
      // TODO: Handle end of review session
      console.log("Review session completed");
    }
  };

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
    height: CARD_WIDTH * 0.6,
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
});

export default ReviewScreen;
