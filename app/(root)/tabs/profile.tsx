import { useUser } from "@clerk/clerk-expo";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import InputField from "@/components/Common/InputField";
import { LanguageSwitcher } from "@/components/Common/LanguageSwitcher";

export default function ProfileScreen() {
  const { user } = useUser();
  const { t } = useTranslation();

  return (
    <SafeAreaView className="flex-1">
      <ScrollView
        className="px-4"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <Text className="my-5 text-2xl font-JakartaBold">{t('profile.profile')}</Text>

        <View className="flex justify-center items-center my-5">
          <Image
            source={{
              uri: user?.externalAccounts[0]?.imageUrl ?? user?.imageUrl,
            }}
            style={{ width: 110, height: 110, borderRadius: 110 / 2 }}
            className=" rounded-full h-[110px] w-[110px] border-[3px] border-white shadow-sm shadow-neutral-300"
          />
        </View>

        <View className="flex flex-col justify-center items-start p-4 bg-white rounded-lg shadow-sm shadow-neutral-300 mb-4">
          <View className="flex flex-col justify-start items-start w-full">
            <InputField
              label={t('profile.name')}
              placeholder={user?.firstName || t('errors.somethingWentWrong')}
              containerStyle="w-full"
              inputStyle="p-3.5"
              editable={false}
            />

            <InputField
              label={t('profile.email')}
              placeholder={
                user?.primaryEmailAddress?.emailAddress || t('errors.somethingWentWrong')
              }
              containerStyle="w-full"
              inputStyle="p-3.5"
              editable={false}
            />

            <InputField
              label={t('profile.phone')}
              placeholder={user?.primaryPhoneNumber?.phoneNumber || t('errors.somethingWentWrong')}
              containerStyle="w-full"
              inputStyle="p-3.5"
              editable={false}
            />
          </View>
        </View>

        {/* Language Settings Section */}
        <View className="flex flex-col p-4 bg-white rounded-lg shadow-sm shadow-neutral-300">
          <Text className="mb-4 text-lg font-JakartaBold">{t('profile.settings')}</Text>
          <LanguageSwitcher />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
