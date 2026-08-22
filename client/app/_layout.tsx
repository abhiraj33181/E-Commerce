import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
} from "@expo-google-fonts/manrope";

import '@/global.css'
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Toast from "react-native-toast-message";

export default function RootLayout() {

  const [loaded] = useFonts({
    ManropeRegular: Manrope_400Regular,
    ManropeMedium: Manrope_500Medium,
    ManropeSemiBold: Manrope_600SemiBold,
    ManropeBold: Manrope_700Bold,
    ManropeExtraBold: Manrope_800ExtraBold,
  });

  if (!loaded) return null;

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <CartProvider>
          <WishlistProvider>
            <Stack screenOptions={{ headerShown: false }} />
            <Toast />
          </WishlistProvider>
        </CartProvider>
      </GestureHandlerRootView>
    </>
  );
}
