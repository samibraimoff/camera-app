import {
  useCameraPermissions,
  CameraView,
  CameraType,
  CameraCapturedPicture,
} from "expo-camera";
import { Link, router } from "expo-router";
import { useEffect, useState, useRef } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");
  const [picture, setPicture] = useState<CameraCapturedPicture>();
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission]);

  const toggleCameraFacing = () => {
    setFacing((curr) => (curr === "back" ? "front" : "back"));
  };

  const takePicture = async () => {
    const res = await cameraRef.current?.takePictureAsync();
    setPicture(res);
    console.log(res);
  };

  if (!permission?.granted) {
    return <ActivityIndicator />;
  }

  if (picture) {
    return (
      <View>
        <Image
          source={{ uri: picture.uri }}
          style={{ width: "100%", height: "100%" }}
        />
        <MaterialIcons
          name="close"
          color="white"
          style={{ position: "absolute", top: 50, left: 20 }}
          size={30}
          onPress={() => setPicture(undefined)}
        />
      </View>
    );
  }
  return (
    <View>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
        <View style={styles.footer}>
          <View />
          <Pressable style={styles.recordButton} onPress={takePicture} />
          <MaterialIcons
            name="flip-camera-ios"
            size={24}
            color="white"
            onPress={toggleCameraFacing}
          />
        </View>
      </CameraView>
      <Link href="/" asChild>
        <MaterialIcons
          name="close"
          color="white"
          style={styles.closeButton}
          size={30}
          onPress={() => router.back()}
        />
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  camera: { width: "100%", height: "100%" },
  closeButton: {
    position: "absolute",
    top: 50,
    left: 50,
  },
  footer: {
    marginTop: "auto",
    padding: 20,
    paddingBottom: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#00000099",
  },
  recordButton: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: "white",
  },
});
