import { Link } from "expo-router";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <Link href="/camera" asChild>
        <Pressable style={styles.button}>
          <MaterialIcons name="photo-camera" size={32} color="white" />
        </Pressable>
      </Link>
      <Link href="/image-1">Image 1</Link>
      <Link href="/image-2">Image 2</Link>
      <Link href="/image-3">Image 3</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "royalblue",
    padding: 12,
    borderRadius: 50,
    position: "absolute",
    bottom: 14,
    right: 14,
  },
});
