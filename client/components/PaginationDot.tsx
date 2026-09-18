import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  SharedValue,
  interpolateColor,
  withTiming,
  Easing
} from "react-native-reanimated";

type Props = {
  // Onboarding (Scroll-driven) ke liye props
  index?: number; 
  scrollX?: SharedValue<number>;
  windowWidth?: number;
  
  // Home Screen Banners (State-driven) ke liye prop
  active?: boolean; 
};

const PaginationDot = ({ index, scrollX, windowWidth, active }: Props) => {
  const animatedStyle = useAnimatedStyle(() => {
    // SCENARIO 1: Agar scrollX aur windowWidth available hain (Onboarding)
    if (scrollX && windowWidth !== undefined && index !== undefined) {
      const inputRange = [
        (index - 1) * windowWidth,
        index * windowWidth,
        (index + 1) * windowWidth,
      ];

      const dotWidth = interpolate(
        scrollX.value,
        inputRange,
        [8, 24, 8],
        Extrapolation.CLAMP
      );

      const backgroundColor = interpolateColor(
        scrollX.value,
        inputRange,
        ["#D1D5DB", "#000000", "#D1D5DB"]
      );

      return {
        width: dotWidth,
        backgroundColor,
      };
    } 
    
    // SCENARIO 2: Agar sirf 'active' prop pass kiya gaya hai (Banners)
    else {
      // Yahan hum undefined check kar rahe hain taaki agar active false ho toh error na aaye
      const isActive = active === true;
      
      return {
        width: withTiming(isActive ? 24 : 8, { 
          duration: 300, 
          easing: Easing.bezier(0.25, 0.1, 0.25, 1) 
        }),
        // withTiming ke andar string colors direct animate kiye ja sakte hain Reanimated 3 me
        backgroundColor: withTiming(isActive ? "#000000" : "#D1D5DB", { 
          duration: 300 
        })
      };
    }
  });

  return (
    <Animated.View
      style={[
        { height: 8, borderRadius: 4, marginHorizontal: 4 }, // Base styles
        animatedStyle,
      ]}
    />
  );
};

export default PaginationDot;