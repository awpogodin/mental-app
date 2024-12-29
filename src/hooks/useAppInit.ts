import { getUser } from "@/lib/auth";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_900Black,
  useFonts,
} from "@expo-google-fonts/inter";
import { useEffect, useState } from "react";

export const useAppInit = () => {
  const [isLoaded, setLoaded] = useState(false);
  const [areFontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_900Black,
  });

  useEffect(() => {
    const checkAuth = async () => {
      await getUser();
      setLoaded(true);
    };
    checkAuth();
  }, []);

  return isLoaded && areFontsLoaded;
};
