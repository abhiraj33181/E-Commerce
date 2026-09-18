import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAuth } from "@/context/authContext";
import { Feather } from "@expo/vector-icons";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { loading, signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password.");
      return;
    }

    try {
      await signIn(email, password);
    } catch (error: any) {
      Alert.alert(
        "Login Failed",
        error.response?.data?.message || "Invalid credentials.",
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          showsVerticalScrollIndicator={false}
          className="px-6"
        >
          {/* Header Section */}
          <View className="mb-10">
            <Image
              source={require("@/assets/logo2.png")}
              style={{
                width: 230,
                height: 90,
                alignSelf: "center",
                marginBottom: 20,
              }}
              resizeMode="contain"
            />
            <Text className="text-[32px] font-extrabold text-[#111827] mb-2 tracking-tight">
              Welcome Back 👋
            </Text>
            <Text className="text-[16px] text-[#6B7280]">
              Sign in to continue
            </Text>
          </View>

          {/* Form Section */}
          <View className="w-full">
            <View className="flex-row items-center w-full h-[56px] border border-[#E5E7EB] rounded-full px-5 mb-4 bg-white">
              <Feather name="mail" size={20} color="#9CA3AF" />
              <TextInput
                placeholder="Email or Phone"
                className="flex-1 ml-3 text-[16px] text-[#111827] h-full"
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View className="flex-row items-center w-full h-[56px] border border-[#E5E7EB] rounded-full px-5 mb-8 bg-white">
              <Feather name="lock" size={20} color="#9CA3AF" />
              <TextInput
                placeholder="Password"
                className="flex-1 ml-3 text-[16px] text-[#111827] h-full"
                secureTextEntry={!showPassword}
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className="pl-3 py-2"
              >
                <Feather
                  name={showPassword ? "eye" : "eye-off"}
                  size={20}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              className="w-full h-[56px] bg-[#111827] rounded-full items-center justify-center active:opacity-80"
              onPress={handleLogin}
              disabled={loading}
            >
              <Text className="text-white font-bold text-[18px] tracking-wide">
                {loading ? "Signing In..." : "Sign In"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="flex-row justify-center items-center mt-10">
            <Text className="text-[#6B7280] text-[15px]">
              Don't have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/sign-up")}>
              <Text className="text-[#111827] text-[15px] font-bold ml-1">
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
