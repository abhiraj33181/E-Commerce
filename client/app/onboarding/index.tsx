import { Dimensions } from 'react-native';
import React, { useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import OnboardingScreen from '@/components/onboardingScreen'; // adjust path if needed
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export const onboardingData = [
  {
    id: "1",
    welcome: "Welcome to",
    brand: "Forever",
    subtitle: "Your Style, Our Priority",
    image: require("../../assets/images/onboarding1.png"),
    isBrandScreen: true,
  },
  {
    id: "2",
    title: "Trendy Collections",
    subtitle: "Discover the latest fashion for men, women, and kids.",
    image: require("../../assets/images/onboarding2.png"),
  },
  {
    id: "3",
    title: "Best Deals Everyday",
    subtitle: "Get exclusive offers and discounts on your favorite brands.",
    image: require("../../assets/images/onboarding3.png"),
  },
  {
    id: "4",
    title: "Your Style Anywhere",
    subtitle: "Shop from anywhere anytime.",
    image: require("../../assets/images/onboarding4.png"),
  },
];

export default function Index() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<Animated.FlatList<any>>(null);
  
  const scrollX = useSharedValue(0);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
      setCurrentIndex(currentIndex + 1);
    } else {
      router.push('/(auth)/sign-in');
    }
  };

  const handleSkip = () => {
    flatListRef.current?.scrollToIndex({ index: onboardingData.length - 1, animated: true });
    setCurrentIndex(onboardingData.length - 1);
  };

  const handleScrollEnd = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Animated.FlatList
        data={onboardingData}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        onScroll={onScroll}
        scrollEventThrottle={16}
        bounces={false}
        showsHorizontalScrollIndicator={false}
        ref={flatListRef as any}
        onMomentumScrollEnd={handleScrollEnd}
        renderItem={({ item, index }) => (
          <OnboardingScreen
            width={width}
            data={item}
            index={index}           
            scrollX={scrollX}       
            currentIndex={currentIndex}
            handleNext={handleNext}
            handleSkip={handleSkip}
            totalScreens={onboardingData.length}
          />
        )}
      />
    </SafeAreaView>
  );
}