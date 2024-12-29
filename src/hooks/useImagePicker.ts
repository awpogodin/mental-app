import * as ImagePicker from 'expo-image-picker';

export const useImagePicker = () => {
  const pick = async (options?: ImagePicker.ImagePickerOptions) => {
    const result = await ImagePicker.launchImageLibraryAsync(options);
    if (result.canceled) {
      return
    }
    return result.assets
  }

  return { pick }
}