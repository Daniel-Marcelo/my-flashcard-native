import { useState } from "react";
import { StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { useLocalSearchParams, router } from "expo-router";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

const AddFlashcardScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");

  const handleSubmit = () => {
    // TODO: Implement saving the flashcard to your backend
    console.log("Saving flashcard:", { front, back, deckId: id });
    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Add New Flashcard
      </ThemedText>

      <ThemedView style={styles.form}>
        <ThemedView style={styles.inputContainer}>
          <ThemedText style={styles.label}>Front</ThemedText>
          <TextInput
            style={styles.input}
            value={front}
            onChangeText={setFront}
            placeholder="Enter the front of the card"
            multiline
            numberOfLines={3}
          />
        </ThemedView>

        <ThemedView style={styles.inputContainer}>
          <ThemedText style={styles.label}>Back</ThemedText>
          <TextInput
            style={styles.input}
            value={back}
            onChangeText={setBack}
            placeholder="Enter the back of the card"
            multiline
            numberOfLines={3}
          />
        </ThemedView>

        <ThemedView style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => router.back()}
          >
            <ThemedText style={styles.buttonText}>Cancel</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.submitButton]}
            onPress={handleSubmit}
          >
            <ThemedText style={styles.buttonText}>Save</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    textAlign: "center",
    marginBottom: 30,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    minHeight: 100,
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginTop: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 120,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#666",
  },
  submitButton: {
    backgroundColor: "#007AFF",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default AddFlashcardScreen;
