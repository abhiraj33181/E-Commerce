import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { router } from "expo-router";

const CATEGORY_DATA = [
  {
    id: "1",
    name: "Men",
    image:
      "https://res.cloudinary.com/dfwswtrxt/image/upload/v1789568023/men_pmsyya.png",
  },
  {
    id: "2",
    name: "Women",
    image:
      "https://res.cloudinary.com/dfwswtrxt/image/upload/v1789568025/women_tdxphq.png",
  },
  {
    id: "3",
    name: "Kids",
    image:
      "https://res.cloudinary.com/dfwswtrxt/image/upload/v1789568025/kids_rcxmk6.png",
  },
  {
    id: "4",
    name: "Shoes",
    image:
      "https://res.cloudinary.com/dfwswtrxt/image/upload/v1789568024/shoes_vo5liq.png",
  },
  {
    id: "5",
    name: "Bags",
    image:
      "https://res.cloudinary.com/dfwswtrxt/image/upload/v1789568027/ChatGPT_Image_Sep_16_2026_07_38_38_PM_xiwcxc.png",
  },
  {
    id: "6",
    name: "Other",
    image:
      "https://res.cloudinary.com/dfwswtrxt/image/upload/v1789568026/others_bnvpfe.png",
  },
];

export default function Categories() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header */}
      <Header title="Categories" showBack showSearch />

      {/* Grid List */}
      <FlatList
        data={CATEGORY_DATA}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: 16,
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              router.push({
                pathname: "/shop",
                params: { category: item.name },
              })
            }
            className="w-[48%] bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm shadow-gray-100 pb-4"
          >
            {/* Image Container with light gray background */}
            <View className="w-full h-40 bg-[#F3F4F6] items-center justify-center">
              <Image
                source={{ uri: item.image }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>

            {/* Text Content */}
            <View className="items-center mt-3 px-2">
              <Text className="text-[17px] font-extrabold text-[#111827] mb-1">
                {item.name}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
