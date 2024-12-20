import { router, useLocalSearchParams } from "expo-router";
import { Image, View } from "react-native";
import { Stack } from "expo-router";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { MaterialIcons } from "@expo/vector-icons";
import { getMediaType } from "../utils/media";
import { ResizeMode, Video } from "expo-av";

export default function DetailsScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const [permissionResponse, requestPermissions] =
    MediaLibrary.usePermissions();

  const fullUri = (FileSystem.documentDirectory || "") + (name || "");
  const type = getMediaType(fullUri);

  const onDelete = async () => {
    await FileSystem.deleteAsync(fullUri);
    router.back();
  };

  const onSave = async () => {
    if (permissionResponse?.status !== "granted") {
      await requestPermissions();
    }
    const asset = await MediaLibrary.createAssetAsync(fullUri);
  };

  return (
    <View>
      <Stack.Screen
        options={{
          title: "Media",
          headerRight: () => (
            <View style={{ gap: 10, flexDirection: "row" }}>
              <MaterialIcons
                onPress={onDelete}
                name="delete"
                size={26}
                color="crimson"
              />
              <MaterialIcons
                onPress={onSave}
                name="save"
                size={26}
                color="dimgray"
              />
            </View>
          ),
        }}
      />
      {type === "image" && (
        <Image
          source={{ uri: fullUri }}
          style={{ width: "100%", height: "100%" }}
        />
      )}
      {type === "video" && (
        <Video
          source={{ uri: fullUri }}
          style={{ width: "100%", height: "100%" }}
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isLooping
          useNativeControls
        />
      )}
    </View>
  );
}
