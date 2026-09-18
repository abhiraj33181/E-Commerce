import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  interpolate,
  useAnimatedStyle,
  SharedValue,
  Extrapolation,
} from "react-native-reanimated";
import PaginationDot from "./PaginationDot";

type OnboardingItem = {
  id: string;
  welcome?: string;
  brand?: string;
  title?: string;
  subtitle: string;
  image: any;
  isBrandScreen?: boolean;
};

type Props = {
  data: OnboardingItem;
  width: number;
  handleNext: () => void;
  handleSkip: () => void;
  currentIndex: number;
  totalScreens: number;
  index: number;
  scrollX: SharedValue<number>;
};

export default function OnboardingScreen({
  data,
  width,
  handleNext,
  handleSkip,
  currentIndex,
  totalScreens,
  index,
  scrollX,
}: Props) {
  const imageAnimatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.5, 1, 0.5],
      Extrapolation.CLAMP,
    );
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0, 1, 0],
      Extrapolation.CLAMP,
    );

    return {
      opacity,
      transform: [{ scale }],
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const translateY = interpolate(
      scrollX.value,
      inputRange,
      [50, 0, -50],
      Extrapolation.CLAMP,
    );
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0, 1, 0],
      Extrapolation.CLAMP,
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  return (
    <View style={{ width }} className="flex-1 px-6 pt-4 pb-8">
      <View className="h-10 items-end justify-center">
        {data.id !== "4" && (
          <TouchableOpacity
            onPress={handleSkip}
            className="px-2 py-1 active:opacity-60"
          >
            <Text className="text-neutral-500 text-[16px] font-semibold tracking-wide">
              Skip
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View className="flex-1 items-center justify-center -mt-8">
        <Animated.View
          style={imageAnimatedStyle}
          className="w-full aspect-square max-w-[340px] items-center justify-center mb-10"
        >
          <Image
            source={data.image}
            resizeMode="contain"
            className="w-full h-full"
          />
        </Animated.View>

        <Animated.View style={textAnimatedStyle} className="items-center">
          {data.isBrandScreen ? (
            <View className="items-center">
              <Text className="text-[28px] font-manrope-bold text-neutral-800 tracking-tight">
                {data.welcome}
              </Text>
              <Text className="text-[52px] font-manrope-extrabold text-[#16A34A] leading-[60px]">
                {data.brand}
              </Text>
              <Text className="w-[280px] mt-3 text-center text-[16px] text-neutral-500 leading-6 font-medium">
                {data.subtitle}
              </Text>
            </View>
          ) : (
            <View className="items-center">
              <Text className="text-[32px] text-center font-manrope-bold text-neutral-900 tracking-tight mb-3">
                {data.title}
              </Text>
              <Text className="w-[280px] text-[16px] text-center text-neutral-500 leading-6 font-medium">
                {data.subtitle}
              </Text>
            </View>
          )}
        </Animated.View>
      </View>

      <View className="flex-col items-center mt-auto">
        <View className="flex-row items-center space-x-3 mb-8">
          {Array.from({ length: totalScreens }).map((_, i) => (
            <PaginationDot
              key={i}
              index={i}
              scrollX={scrollX}
              windowWidth={width}
            />
          ))}
        </View>

        <TouchableOpacity
          onPress={handleNext}
          className="w-full h-[60px] rounded-2xl bg-black items-center justify-center active:opacity-80 shadow-md shadow-black/20"
        >
          <View className="flex-row items-center justify-center space-x-2">
            <Text className="text-white text-[18px] font-bold tracking-wide">
              {currentIndex === totalScreens - 1 ? "Get Started" : "Next"}
            </Text>
            {currentIndex !== totalScreens - 1 && (
              <Ionicons
                name="arrow-forward"
                size={20}
                color="white"
                style={{ marginLeft: 8 }}
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
