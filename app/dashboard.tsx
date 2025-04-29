import { StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { router } from "expo-router";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

// TODO: Replace with actual data from your backend
const MOCK_DECKS = [
  { id: "1", name: "Spanish Basics", cardCount: 50 },
  { id: "2", name: "French Vocabulary", cardCount: 75 },
  { id: "3", name: "Japanese Kanji", cardCount: 100 },
  { id: "4", name: "German Grammar", cardCount: 30 },
];

type Deck = {
  id: string;
  name: string;
  cardCount: number;
};

const DeckItem = ({ deck }: { deck: Deck }) => (
  <TouchableOpacity
    style={styles.deckItem}
    // onPress={() => router.push(`/deck/${deck.id}`)}
    onPress={console.log}
  >
    <ThemedView style={styles.deckContent}>
      <ThemedText type="defaultSemiBold">{deck.name}</ThemedText>
      <ThemedText style={styles.cardCount}>
        {deck.cardCount} {deck.cardCount === 1 ? "card" : "cards"}
      </ThemedText>
    </ThemedView>
  </TouchableOpacity>
);

const DashboardScreen = () => {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">My Decks</ThemedText>
        <TouchableOpacity
          style={styles.addButton}
          //   onPress={() => router.push("/deck/new")}
          onPress={console.log}
        >
          <ThemedText style={styles.addButtonText}>+ New Deck</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <FlatList
        data={MOCK_DECKS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <DeckItem deck={item} />}
        contentContainerStyle={styles.list}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: "#0a7ea4",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  list: {
    gap: 10,
  },
  deckItem: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  deckContent: {
    gap: 5,
  },
  cardCount: {
    fontSize: 14,
    color: "#666",
  },
});

export default DashboardScreen;
