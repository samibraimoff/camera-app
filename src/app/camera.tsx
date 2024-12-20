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
  Button,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import path from "path";
import * as FileSystem from "expo-file-system";
import { Video } from "expo-av";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");
  const [picture, setPicture] = useState<CameraCapturedPicture>();
  const [isRecording, setIsRecording] = useState(false);
  const [video, setVideo] = useState<string | undefined>();
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission]);

  const toggleCameraFacing = () => {
    setFacing((curr) => (curr === "back" ? "front" : "back"));
  };

  const onPress = () => {
    if (isRecording) {
      cameraRef.current?.stopRecording();
    } else {
      takePicture();
    }
  };

  const takePicture = async () => {
    const res = await cameraRef.current?.takePictureAsync();
    setPicture(res);
  };

  const startRecording = async () => {
    setIsRecording(true);
    const res = await cameraRef.current?.recordAsync({ maxDuration: 60 });
    if (res) setVideo(res?.uri);
    setIsRecording(false);
  };

  const saveFile = async (uri: string | undefined) => {
    //saving file
    if (uri) {
      const filename = path.parse(uri).base;
      await FileSystem.copyAsync({
        from: uri,
        to: FileSystem.documentDirectory + filename,
      });
      setPicture(undefined);
      setVideo(undefined);
      router.back();
    }
  };

  if (!permission?.granted) {
    return <ActivityIndicator />;
  }

  if (picture || video) {
    return (
      <View style={{ flex: 1 }}>
        {picture && (
          <Image
            source={{ uri: picture?.uri }}
            style={{ width: "100%", flex: 1 }}
          />
        )}

        {video && (
          <Video
            source={{ uri: video }}
            style={{ width: "100%", flex: 1 }}
            shouldPlay
            isLooping
          />
        )}
        <View style={{ padding: 10 }}>
          <SafeAreaView edges={["bottom"]}>
            <Button
              title="Save"
              onPress={() => {
                if (picture || video) {
                  saveFile(picture?.uri || video);
                }
              }}
            />
          </SafeAreaView>
        </View>
        <MaterialIcons
          name="close"
          color="white"
          style={{ position: "absolute", top: 50, left: 20 }}
          size={30}
          onPress={() => {
            setPicture(undefined);
            setVideo(undefined);
          }}
        />
      </View>
    );
  }
  return (
    <View>
      <CameraView
        mode="video"
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
      >
        <View style={styles.footer}>
          <View />
          <Pressable
            style={[
              styles.recordButton,
              { backgroundColor: isRecording ? "crimson" : "white" },
            ]}
            onPress={onPress}
            onLongPress={startRecording}
          />
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
