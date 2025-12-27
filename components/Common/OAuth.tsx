import { icons } from "@/constants";
import { googleOAuth } from "@/lib/auth";
import { useOAuth } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { useCallback } from "react";
import { Image, Text, View } from "react-native";
import CustomButton from "./CustomButton";
const OAuth = () => {
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const handleGoogleSignIn = useCallback(async () => {
    try {
      const result = await googleOAuth(startOAuthFlow);
      if (result.code === "session_exists" || result.code === 'success') {
        router.push("/(root)/tabs/home");
      }
    } catch (err) {
    }
  }, []);

  return (
    <View>
      <View className="flex flex-row gap-x-4 justify-center items-center mt-4">
        <View className="h-[1px] bg-general-100 flex-1" />
        <Text className="text-lg">Hoặc</Text>
        <View className="h-[1px] bg-general-100 flex-1" />
      </View>

      <CustomButton title="Đăng nhập với Google"
        className="mt-5 w-full shadow-none"
        IconLeft={() => (
          <Image source={icons.google} resizeMode="contain" className="mx-2 w-5 h-5" />
        )}
        bgVariant="outline"
        textVariant="primary"
        onPress={handleGoogleSignIn}
      />
    </View>
  )
}

export default OAuth;