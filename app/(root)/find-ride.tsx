import CustomButton from "@/components/Common/CustomButton";
import GoogleTextInput from "@/components/Common/GoogleTextInput";
import PageHeader from "@/components/Common/PageHeader";
import RideLayout from "@/components/Ride/RideLayout";
import { icons } from "@/constants";
import { useLocationStore } from "@/store";
import { router } from "expo-router";
import { Text, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

const FindRide = () => {
  const { t } = useTranslation();
  const {
    userAddress,
    destinationAddress,
    setDestinationLocation,
    setUserLocation,
  } = useLocationStore();

  const snapPoints = useMemo(() => ["85%"], []);

  return (
    <SafeAreaView className="flex-1 bg-general-500" edges={["top"]}>
      <PageHeader title={t("booking.findRide")} />
      <RideLayout snapPoints={snapPoints} scrollable={false}>
        {/* Origin Location */}
        <View className="my-3">
          <Text className="mb-4 text-lg font-JakartaSemiBold">
            {t("ride.from")}:
          </Text>
          {userAddress ? (
            <View className="flex-row items-center bg-neutral-100 rounded-2xl border border-gray-100 p-4">
              <Image source={icons.target} className="w-6 h-6 mr-4" />
              <View className="flex-1">
                <Text
                  className="text-base font-JakartaBold text-gray-900"
                  numberOfLines={1}
                >
                  {userAddress.split(",")[0]}
                </Text>
                <Text
                  className="text-sm text-gray-500 font-JakartaMedium"
                  numberOfLines={1}
                >
                  {userAddress.split(",").slice(1).join(",")}
                </Text>
              </View>
            </View>
          ) : (
            <GoogleTextInput
              icon={icons.target}
              initialLocation={userAddress!}
              containerStyle="bg-neutral-100"
              textInputBackgroundColor="transparent"
              handlePress={(location) => setUserLocation(location)}
            />
          )}
        </View>

        {/* Destination Location */}
        <View className="my-3">
          <Text className="mb-4 text-lg font-JakartaSemiBold">
            {t("ride.to")}:
          </Text>
          {destinationAddress ? (
            <View className="flex-row items-center bg-neutral-100 rounded-2xl border border-gray-100 p-4">
              <Image source={icons.map} className="w-6 h-6 mr-4" />
              <View className="flex-1">
                <Text
                  className="text-base font-JakartaBold text-gray-900"
                  numberOfLines={1}
                >
                  {destinationAddress.split(",")[0]}
                </Text>
                <Text
                  className="text-sm text-gray-500 font-JakartaMedium"
                  numberOfLines={1}
                >
                  {destinationAddress.split(",").slice(1).join(",")}
                </Text>
              </View>
            </View>
          ) : (
            <GoogleTextInput
              icon={icons.map}
              initialLocation={destinationAddress!}
              containerStyle="bg-neutral-100"
              textInputBackgroundColor="transparent"
              handlePress={(location) => setDestinationLocation(location)}
            />
          )}
        </View>

        <CustomButton
          title={t("booking.bookNow")}
          onPress={() => router.push("/(root)/confirm-ride")}
          className="mt-4"
        />
      </RideLayout>
    </SafeAreaView>
  );
};

export default FindRide;
