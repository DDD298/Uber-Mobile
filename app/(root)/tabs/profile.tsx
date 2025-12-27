import { useUser } from "@clerk/clerk-expo";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

import { LanguageSwitcher } from "@/components/Common/LanguageSwitcher";
import CustomButton from "@/components/Common/CustomButton";

export default function ProfileScreen() {
  const { user } = useUser();
  const { t } = useTranslation();
  return (
    <SafeAreaView className="flex-1">
      <ScrollView
        className="px-4"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <Text className="my-4 text-2xl font-JakartaBold">
          {t("profile.profile")}
        </Text>

        {/* Profile Image Section */}
        <View className="flex justify-center items-center my-4">
          <Image
            source={{
              uri: user?.externalAccounts[0]?.imageUrl ?? user?.imageUrl,
            }}
            style={{ width: 110, height: 110, borderRadius: 110 / 2 }}
            className=" rounded-full h-[110px] w-[110px] border-[3px] border-white shadow-sm shadow-neutral-300"
          />
        </View>
        {/* Profile Info Section */}
        <Text className="mb-4 text-xl font-JakartaBold">
          {t("profile.profileInfo")}
        </Text>
        <View className="flex flex-col bg-white rounded-[24px] shadow-sm shadow-neutral-300 mb-6 p-2">
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
