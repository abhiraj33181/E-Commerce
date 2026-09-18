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
import { router } from "expo-router";
import { useAuth } from "@/context/authContext";
import { Feather } from "@expo/vector-icons";
import {SafeAreaView} from "react-native-safe-area-context";

export default function RegisterScreen() {
  const { loading, signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }
    try {
      await signUp(name, email, password);
    } catch (error: any) {
      Alert.alert(
        "Register Failed",
        error.response?.data?.message || "Something went wrong."
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
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingVertical: 20 }}
          showsVerticalScrollIndicator={false}
          className="px-6"
        >
          {/* Header Section */}
          <View className="mb-8">
            <TouchableOpacity 
              onPress={() => router.back()} 
              className="mb-8 w-10 h-10 justify-center"
            >
              <Feather name="arrow-left" size={26} color="#111827" />
            </TouchableOpacity>
    
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
              Create Account
            </Text>
            <Text className="text-[16px] text-[#6B7280]">
              Join us and start your fashion journey
            </Text>
          </View>

          {/* Form Section */}
          <View className="w-full">
            <View className="flex-row items-center w-full h-[56px] border border-[#E5E7EB] rounded-full px-5 mb-4 bg-white">
              <Feather name="user" size={20} color="#9CA3AF" />
              <TextInput
                placeholder="Full Name"
                className="flex-1 ml-3 text-[16px] text-[#111827] h-full"
                placeholderTextColor="#9CA3AF"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View className="flex-row items-center w-full h-[56px] border border-[#E5E7EB] rounded-full px-5 mb-4 bg-white">
              <Feather name="mail" size={20} color="#9CA3AF" />
              <TextInput
                placeholder="Email"
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
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="pl-3 py-2">
                <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              className="w-full h-[56px] bg-[#111827] rounded-full items-center justify-center active:opacity-80"
              onPress={handleRegister}
              disabled={loading}
            >
              <Text className="text-white font-bold text-[18px] tracking-wide">
                {loading ? "Creating..." : "Sign Up"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="flex-row justify-center items-center mt-10">
            <Text className="text-[#6B7280] text-[15px]">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/sign-in")}>
              <Text className="text-[#111827] text-[15px] font-bold ml-1">Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}