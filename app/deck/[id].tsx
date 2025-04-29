import { StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

// TODO: Replace with actual data from your backend
const MOCK_DECK = {
  id: "1",
  name: "Spanish Basics",
  cardCount: 50,
};

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

const FlashcardItem = ({ flashcard }: { flashcard: Flashcard }) => (
  <ThemedView style={styles.flashcardItem}>
    <ThemedText style={styles.flashcardText}>{flashcard.front}</ThemedText>
  </ThemedView>
);

const DeckDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  // TODO: Fetch actual deck data using the id
  const deck = MOCK_DECK;

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.deckName}>
          {deck.name}
        </ThemedText>
        <ThemedText style={styles.cardCount}>
          {deck.cardCount} {deck.cardCount === 1 ? "card" : "cards"}
        </ThemedText>
      </ThemedView>

      <FlatList
        data={MOCK_FLASHCARDS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <FlashcardItem flashcard={item} />}
        contentContainerStyle={styles.list}
      />

      <TouchableOpacity style={styles.addButton}>
        <ThemedText style={styles.addButtonText}>+ Add Flashcard</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  deckName: {
    marginBottom: 8,
  },
  cardCount: {
    fontSize: 16,
    color: "#666",
  },
  list: {
    gap: 12,
    paddingBottom: 20,
  },
  flashcardItem: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  flashcardText: {
    fontSize: 16,
    color: "#333",
  },
  addButton: {
    backgroundColor: "#0a7ea4",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DeckDetailScreen;
