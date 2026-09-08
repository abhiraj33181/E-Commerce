import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const PaginationDot = ({
  active,
}: {
  active: boolean;
}) => {
  const animatedStyle = useAnimatedStyle(() => ({
  width: withTiming(active ? 24 : 8),
  transform: [
    {
      scale: withTiming(active ? 1.2 : 1),
    },
  ],
}));

  return (
    <Animated.View
      style={animatedStyle}
      className={`h-2 rounded-full ${
        active ? "bg-primary" : "bg-gray-300"
      }`}
    />
  );
};

export default PaginationDot;