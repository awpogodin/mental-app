import * as ImagePicker from "expo-image-picker";

export type ImageAsset = {
  uri: string;
  name: string;
  type: "image/jpeg" | "image/png" | "image/gif";
};

export const getImageAsset = (uri: string): ImageAsset | null => {
  if (!uri) {
    return null;
  }
  const extension = uri.split(".").pop()?.toLowerCase();
  const name = uri.split("/").pop()?.split(".").shift() ?? "image";

  const result = {
    uri,
    name,
  };
  if (extension === "jpg" || extension === "jpeg") {
    return {
      ...result,
      type: "image/jpeg",
    };
  }
  if (extension === "png") {
    return {
      ...result,
      type: "image/png",
    };
  }
  if (extension === "gif") {
    return {
      ...result,
      type: "image/gif",
    };
  }
  return null;
};

export const isExtractableFile = (asset: unknown): asset is ImageAsset =>
  (asset as ImageAsset)?.uri !== undefined;

export const useImagePicker = () => {
  const pick = async (options?: ImagePicker.ImagePickerOptions) => {
    const result = await ImagePicker.launchImageLibraryAsync(options);
    if (result.canceled) {
      return;
    }
    return result.assets;
  };

  return { pick };
};
