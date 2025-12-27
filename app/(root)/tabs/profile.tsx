import { useUser } from "@clerk/clerk-expo";
import { Image, ScrollView, Text, View, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { LanguageSwitcher } from "@/components/Common/LanguageSwitcher";
import CustomButton from "@/components/Common/CustomButton";

export default function ProfileScreen() {
  const { user } = useUser();
  const { t } = useTranslation();

  const userId = user?.id || "default";
  const imageId =
    parseInt(
      userId
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0)
        .toString()
        .slice(0, 4)
    ) % 1000;
  const backgroundImageUrl = `https://picsum.photos/seed/${userId}/800/400`;

  return (
    <SafeAreaView className="flex-1">
      <ScrollView
        className="px-4"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <Text className="my-4 text-xl font-JakartaBold">
          {t("profile.profile")}
        </Text>

        {/* Profile Image Section with Background */}
        <View className="relative overflow-hidden rounded-[24px] mb-4 shadow-lg shadow-neutral-400">
          <ImageBackground
            source={{ uri: backgroundImageUrl }}
            style={{ width: "100%", height: 200 }}
            imageStyle={{ borderRadius: 24 }}
          >
            <LinearGradient
              colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.6)"]}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                borderRadius: 24,
              }}
            />
            <View className="flex justify-center items-center h-full">
              <Image
                source={{
                  uri: user?.externalAccounts[0]?.imageUrl ?? user?.imageUrl,
                }}
                style={{ width: 110, height: 110, borderRadius: 55 }}
                className="border-4 border-white shadow-xl shadow-black/50"
              />
              <Text className="mt-3 text-xl font-JakartaBold text-white">
                {user?.firstName && user?.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user?.firstName ||
                    user?.lastName ||
                    t("common.notProvided")}
              </Text>
              <Text className="mt-1 text-sm font-JakartaMedium text-white/80">
                {user?.primaryEmailAddress?.emailAddress || ""}
              </Text>
            </View>
          </ImageBackground>
        </View>
        {/* Profile Info Section */}
        <Text className="mb-4 text-xl font-JakartaBold">
          {t("profile.profileInfo")}
        </Text>
        <View className="flex flex-col bg-white rounded-[24px] shadow-sm shadow-neutral-300 mb-4 p-2">
          {/* Name Item */}
          <View className="flex flex-row items-center px-4 py-3 border-b border-gray-100">
            <View className="w-10 h-10 items-center justify-center bg-neutral-50 rounded-full mr-4">
              <Ionicons name="person-outline" size={20} color="#10B981" />
            </View>
            <View className="flex flex-col flex-1">
              <Text className="text-base text-neutral-400 font-JakartaMedium">
                {t("profile.name")}
              </Text>
              <Text className="text-base font-JakartaBold text-neutral-800">
                {user?.firstName && user?.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user?.firstName ||
                    user?.lastName ||
                    t("common.notProvided")}
              </Text>
            </View>
          </View>

          {/* Email Item */}
          <View className="flex flex-row items-center px-4 py-3 border-b border-gray-100">
            <View className="w-10 h-10 items-center justify-center bg-neutral-50 rounded-full mr-4">
              <Ionicons name="mail-outline" size={20} color="#10B981" />
            </View>
            <View className="flex flex-col flex-1">
              <Text className="text-base text-neutral-400 font-JakartaMedium">
                {t("profile.email")}
              </Text>
              <Text className="text-base font-JakartaBold text-neutral-800">
                {user?.primaryEmailAddress?.emailAddress ||
                  t("common.notProvided")}
              </Text>
            </View>
          </View>

          {/* Phone Item */}
          <View className="flex flex-row items-center px-4 py-3">
            <View className="w-10 h-10 items-center justify-center bg-neutral-50 rounded-full mr-4">
              <Ionicons name="call-outline" size={20} color="#10B981" />
            </View>
            <View className="flex flex-col flex-1">
              <Text className="text-base text-neutral-400 font-JakartaMedium">
                {t("profile.phone")}
              </Text>
              <Text className="text-base font-JakartaBold text-neutral-800">
                {user?.primaryPhoneNumber?.phoneNumber ||
                  t("common.notProvided")}
              </Text>
            </View>
          </View>
        </View>

        {/* Language Settings Section */}
        <Text className="mb-4 text-xl font-JakartaBold">
          {t("profile.settings")}
        </Text>
        <View className="flex flex-col p-4 mb-4 bg-white rounded-[24px] shadow-sm shadow-neutral-300">
          <LanguageSwitcher />
        </View>
        <CustomButton
          title={t("profile.logout")}
          bgVariant="danger"
          onPress={() => {}}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
