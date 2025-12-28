import CustomButton from "@/components/Common/CustomButton";
import InputField from "@/components/Common/InputField";
import OAuth from "@/components/Common/OAuth";
import CustomAlert from "@/components/Common/CustomAlert";
import { useCustomAlert } from "@/hooks/useCustomAlert";
import { icons, images } from "@/constants";
import { useSignIn } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import { useCallback, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

const SignIn = () => {
  const { t } = useTranslation();
  const { signIn, setActive, isLoaded } = useSignIn();
  const {
    alertConfig,
    visible: alertVisible,
    hideAlert,
    showError,
  } = useCustomAlert();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const onSignInPress = useCallback(async () => {
    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.create({
        identifier: form.email,
        password: form.password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/(root)/tabs/home");
      } else {
        showError(t("common.error"), t("errors.tryAgain"));
      }
    } catch (err: any) {
      showError(t("common.error"), err.errors[0].longMessage);
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
            className="mt-6"
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

        {/* Custom Alert */}
        {alertConfig && (
          <CustomAlert
            visible={alertVisible}
            type={alertConfig.type}
            title={alertConfig.title}
            message={alertConfig.message}
            buttons={alertConfig.buttons}
            onClose={hideAlert}
          />
        )}
      </View>
    </ScrollView>
  );
};

export default SignIn;
