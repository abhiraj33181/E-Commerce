import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useCart } from "@/context/CartContext";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import CartItem from "@/components/CartItem";
import { Feather } from "@expo/vector-icons";

export default function Cart() {
  const { cartItems, cartTotal, removeFromCart, clearCart } = useCart();
  const router = useRouter();

  const shipping = 2.0;
  const total = cartTotal + shipping;

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <Header title="My Cart" showBack />

      {cartItems.length > 0 ? (
        <>
          <ScrollView
            className="flex-1 px-4 mt-1"
            showsVerticalScrollIndicator={false}
          >
            {cartItems.map((item, index) => (
              <CartItem
                item={item}
                key={index}
                onRemove={() => removeFromCart(item.id, item.size)}
              />
            ))}
          </ScrollView>

          <View className="p-4 bg-white rounded-t-3xl shadow-sm">
            {/* SubTotal */}
            <View className="flex-row justify-between mb-2">
              <Text className="text-secondary">Sub Total</Text>
              <Text className="text-primary font-bold">
                ${cartTotal.toFixed(2)}
              </Text>
            </View>

            {/* Shipping Details */}
            <View className="flex-row justify-between mb-2">
              <Text className="text-secondary">Shipping</Text>
              <Text className="text-primary font-bold">
                ${shipping.toFixed(2)}
              </Text>
            </View>

            {/* border */}
            <View className="h-[1px] bg-border mb-4" />

            {/* Total */}
            <View className="flex-row justify-between mb-6">
              <Text className="text-primary font-bold text-lg">Total</Text>
              <Text className="text-primary font-bold text-lg">
                ${total.toFixed(2)}
              </Text>
            </View>

            {/* Checkout */}
            <TouchableOpacity
              className="bg-primary py-4 rounded-full items-center"
              onPress={() => router.push("/checkout")}
            >
              <Text className="text-white font-bold text-base">Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View className="flex-1 items-center justify-center px-6">
          <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-6">
            <Feather name="shopping-bag" size={40} color="#9CA3AF" />
          </View>
          <Text className="text-[#111827] text-[24px] font-bold mb-2">
            Your cart is empty
          </Text>
          <Text className="text-[#6B7280] text-[15px] text-center mb-8">
            Looks like you haven't added anything to your cart yet.
          </Text>

          <TouchableOpacity
            onPress={() => router.push("/")}
            className="w-full h-[56px] bg-[#111827] rounded-full items-center justify-center active:opacity-80"
          >
            <Text className="text-white font-bold text-[16px] tracking-wide">
              Start Shopping
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
