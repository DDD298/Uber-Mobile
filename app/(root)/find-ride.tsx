import CustomButton from "@/components/Common/CustomButton";
import GoogleTextInput from "@/components/Common/GoogleTextInput";
import RideLayout from "@/components/Ride/RideLayout";
import { icons } from "@/constants";
import { useLocationStore } from "@/store";
import { router } from "expo-router";
import { Text, View, TouchableOpacity, Image } from "react-native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

const FindRide = () => {
  const { t } = useTranslation();
  const {
    userAddress,
    destinationAddress,
    setDestinationLocation,
    setUserLocation,
  } = useLocationStore();

  return (
    <RideLayout snapPoints={["85%"]}>
      {/* Custom Header with Back Button */}
      <View className="flex-row items-center justify-between w-full -mt-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full bg-white border border-gray-200 mr-4"
        >
          <Ionicons name="chevron-back" size={20} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-JakartaBold">
          {t("booking.findRide")}
        </Text>
      </View>

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
            {/* <TouchableOpacity
              onPress={() => {
                // Open modal to change location
              }}
              className="ml-2"
            >
              <Ionicons name="create-outline" size={20} color="#10B981" />
            </TouchableOpacity> */}
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
  );
};

export default FindRide;
