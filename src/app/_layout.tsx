import { Slot, Stack, Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="[name]" options={{ title: "Details" }} />
      <Stack.Screen name="camera" options={{ title: "Camera" }} />
    </Stack>
  );
}
