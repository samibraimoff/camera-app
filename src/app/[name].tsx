import { Link, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { Stack } from "expo-router";

export default function DetailsScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  return (
    <View>
      <Stack.Screen options={{ title: `Details of: ${name}` }} />
      <Text>Details screen: {name}</Text>
      <Link href="/">Home</Link>
    </View>
  );
}
