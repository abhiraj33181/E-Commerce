import { View, Text, ActivityIndicator } from 'react-native';

type LoadingProps = {
  message?: string;
  fullScreen?: boolean;
  size?: 'small' | 'large';
  color?: string;
};

export default function Loading({ 
  message = "Loading...", 
  fullScreen = true,
  size = 'large',
  color = '#111827'
}: LoadingProps) {
  
  if (fullScreen) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size={size} color={color} />
        {message ? (
          <Text className="mt-4 text-[15px] text-[#6B7280] font-medium tracking-wide">
            {message}
          </Text>
        ) : null}
      </View>
    );
  }

  return (
    <View className="py-4 items-center justify-center">
      <ActivityIndicator size={size} color={color} />
      {message ? (
        <Text className="mt-2 text-[13px] text-[#6B7280]">
          {message}
        </Text>
      ) : null}
    </View>
  );
}