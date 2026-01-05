import CustomButton from "@/components/Common/CustomButton";
import InputField from "@/components/Common/InputField";
import OAuth from "@/components/Common/OAuth";
import { icons, images } from "@/constants";
import { useSignIn } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

const SignIn = () => {
  const { t } = useTranslation();
  const { signIn, setActive, isLoaded } = useSignIn();

  console.log("📍 [SignIn] Rendering component. isLoaded:", isLoaded);

  // Test alert that triggers on render
  // Alert.alert("DEBUG", "SignIn Component Rendered");

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const onSignInPress = useCallback(async () => {
    console.log("🖱️ [SignIn] Button clicked!");
    if (!isLoaded) return;

    setLoading(true);
    console.log("🚀 [SignIn] Starting sign-in process...");
    console.log("📧 [SignIn] Identifier:", form.email);

    try {
      const signInAttempt = await signIn.create({
        identifier: form.email,
        password: form.password,
      });

      console.log("📥 [SignIn] Clerk Response Status:", signInAttempt.status);

      if (signInAttempt.status === "complete") {
        console.log(
          "✅ [SignIn] Successful! Session ID:",
          signInAttempt.createdSessionId
        );
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/(root)/tabs/home");
      } else {
        console.warn("⚠️ [SignIn] Incomplete status:", signInAttempt.status);
        console.log(
          "🔍 [SignIn] Full attempt object:",
          JSON.stringify(signInAttempt, null, 2)
        );
        Alert.alert(t("common.error"), t("errors.tryAgain"));
      }
    } catch (err: any) {
      console.error("❌ [SignIn] Error occurred during sign-in:");
      console.error(JSON.stringify(err, null, 2));

      const errorMessage =
        err.errors?.[0]?.longMessage || "An unknown error occurred";
      const errorCode = err.errors?.[0]?.code || "unknown_error";

      console.error(
        `🔴 [SignIn] Error Code: ${errorCode}, Message: ${errorMessage}`
      );

      Alert.alert(t("common.error"), `${errorMessage}\n\n(Code: ${errorCode})`);
    } finally {
      setLoading(false);
    }
  }, [isLoaded, form.email, form.password]);

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[300px]">
          <Image
            source={images.signUpCar}
            className="z-0 w-full h-[250px]"
            resizeMode="contain"
          />
          <Text className="absolute bottom-5 left-5 text-2xl text black font-JakartaSemiBold">
            {t("auth.signIn")} 🚘
          </Text>
        </View>
        <View className="p-4">
          <InputField
            label={t("auth.email")}
            placeholder={t("auth.email")}
            icon={icons.email}
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />

          <InputField
            label={t("auth.password")}
            placeholder={t("auth.password")}
            icon={icons.lock}
            secureTextEntry={true}
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />

          <CustomButton
            title={t("auth.signIn")}
            onPress={onSignInPress}
            className="mt-4"
          />

          <OAuth />
          <Link
            href="/sign-up"
            className="mt-4 text-lg text-center text-general-200"
          >
            {t("auth.dontHaveAccount")}{" "}
            <Text className="text-primary-600">{t("auth.signUp")}</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignIn;
