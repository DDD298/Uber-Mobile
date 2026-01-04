import Payment from "@/components/Ride/Payment";
import RideLayout from "@/components/Ride/RideLayout";
import { icons } from "@/constants";
import { formatTime } from "@/lib/utils";
import { useDriverStore, useLocationStore } from "@/store";
import { useUser } from "@clerk/clerk-expo";
import { StripeProvider } from "@stripe/stripe-react-native";
import {
  Image,
  Text,
  View,
  TextInput,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { fetchAPI } from "@/lib/fetch";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const BookRide = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const {
    userAddress,
    destinationAddress,
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
  } = useLocationStore();
  const { drivers, selectedDriver } = useDriverStore();

  const driverDetails = drivers?.filter(
    (driver) => +driver.id === selectedDriver
  )[0];

  const [promoCode, setPromoCode] = useState("");
  const [discountInfo, setDiscountInfo] = useState<{
    amount: number;
    finalPrice: number;
    code: string;
    id: number;
  } | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      Alert.alert(t("common.error"), t("promo.enterPromoCode"));
      return;
    }

    try {
      setIsValidating(true);
      const response = await fetchAPI("/(api)/promo/validate", {
        method: "POST",
        body: JSON.stringify({
          code: promoCode,
          ride_amount: parseFloat(driverDetails?.price || "0"),
        }),
      });

      if (response.success && response.data.valid) {
        setDiscountInfo({
          amount: response.data.discount_amount,
          finalPrice: response.data.final_amount,
          code: promoCode,
          id: response.data.promo_id,
        });
        Alert.alert(t("common.success"), t("promo.promoApplied"));
      } else {
        setDiscountInfo(null);
        Alert.alert(
          t("common.error"),
          response.data.message || t("promo.notFound")
        );
      }
    } catch (error) {
      console.error("Promo validation error:", error);
      Alert.alert(t("common.error"), t("errors.somethingWentWrong"));
      setDiscountInfo(null);
    } finally {
      setIsValidating(false);
    }
  };

  const currentPrice = discountInfo
    ? discountInfo.finalPrice
    : parseFloat(driverDetails?.price || "0");

  return (
    <StripeProvider
      publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
      merchantIdentifier="merchant.com.uber"
      urlScheme="myapp"
    >
      <RideLayout>
        <>
          {/* Custom Header with Back Button */}
          <View className="flex-row items-center justify-between w-full -mt-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 items-center justify-center rounded-full bg-white border border-gray-200 mr-4"
            >
              <Ionicons name="chevron-back" size={20} color="#000" />
            </TouchableOpacity>
            <Text className="text-xl font-JakartaBold">
              {t("ride.rideDetails")}
            </Text>
          </View>

          <View className="flex flex-col justify-center items-center w-full">
            <Image
              source={{ uri: driverDetails?.profile_image_url }}
              className="w-28 h-28 rounded-full"
            />

            <View className="flex flex-row justify-center items-center mt-4 space-x-2">
              <Text className="text-lg font-JakartaSemiBold">
                {driverDetails?.title}
              </Text>

              <View className="flex flex-row items-center space-x-0.5">
                <Image
                  source={icons.star}
                  className="w-5 h-5"
                  resizeMode="contain"
                />
                <Text className="text-lg font-JakartaRegular">
                  {driverDetails?.rating}
                </Text>
              </View>
            </View>
          </View>

          <View className="flex flex-col justify-center items-start p-4 mt-4 w-full rounded-[24px] bg-green-50">
            {/* Promo Code Input */}
            <View className="flex-row items-center justify-between w-full mb-4 gap-2">
              <TextInput
                placeholder={t("promo.enterPromoCode")}
                className="flex-1 bg-white p-3 rounded-xl border border-gray-200 font-JakartaMedium"
                value={promoCode}
                onChangeText={setPromoCode}
                autoCapitalize="characters"
                editable={!discountInfo} // Disable if applied
              />
              {discountInfo ? (
                <TouchableOpacity
                  onPress={() => {
                    setDiscountInfo(null);
                    setPromoCode("");
                  }}
                  className="bg-red-500 py-3 px-4 rounded-xl"
                >
                  <Text className="text-white font-JakartaBold">
                    {t("common.cancel")}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={handleApplyPromo}
                  disabled={isValidating}
                  className={`bg-green-500 py-3 px-4 rounded-xl ${
                    isValidating ? "opacity-50" : ""
                  }`}
                >
                  <Text className="text-white font-JakartaBold">
                    {isValidating ? "..." : t("promo.applyPromo")}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <View className="flex flex-row justify-between items-center py-4 pt-0 w-full border-b-[1px] border-green-200">
              <Text className="text-lg font-JakartaRegular">
                {t("ride.fare")}
              </Text>
              <View className="items-end">
                {discountInfo && (
                  <Text className="text-sm font-JakartaMedium text-gray-500 line-through">
                    {Number(driverDetails?.price).toLocaleString("vi-VN")} VNĐ
                  </Text>
                )}
                <Text className="text-lg font-JakartaRegular text-green-600">
                  {currentPrice.toLocaleString("vi-VN")} VNĐ
                </Text>
              </View>
            </View>

            <View className="flex flex-row justify-between items-center py-4 w-full border-b border-white">
              <Text className="text-lg font-JakartaRegular">
                {t("booking.estimatedTime")}
              </Text>
              <Text className="text-lg font-JakartaRegular">
                {formatTime(driverDetails?.time!)}
              </Text>
            </View>

            <View className="flex flex-row justify-between items-center py-4 pb-0 w-full">
              <Text className="text-lg font-JakartaRegular capitalize">
                {t("booking.seats")}
              </Text>
              <Text className="text-lg font-JakartaRegular">
                {driverDetails?.car_seats}
              </Text>
            </View>
          </View>

          <View className="flex flex-col justify-center items-start w-full">
            <View className="flex flex-row justify-start items-center py-4 mt-4 w-full border-t border-b border-general-700">
              <Image source={icons.to} className="w-6 h-6" />
              <Text className="ml-2 text-lg font-JakartaRegular">
                {userAddress}
              </Text>
            </View>

            <View className="flex flex-row justify-start items-center py-4 w-full border-b border-general-700">
              <Image source={icons.point} className="w-6 h-6" />
              <Text className="ml-2 text-lg font-JakartaRegular">
                {destinationAddress}
              </Text>
            </View>
          </View>

          <Payment
            fullName={user?.fullName!}
            email={user?.emailAddresses[0].emailAddress!}
            amount={currentPrice.toString()}
            driverId={driverDetails?.id}
            rideTime={driverDetails?.time!}
            originAddress={userAddress!}
            destinationAddress={destinationAddress!}
            originLatitude={userLatitude!}
            originLongitude={userLongitude!}
            destinationLatitude={destinationLatitude!}
            destinationLongitude={destinationLongitude!}
          />
        </>
      </RideLayout>
    </StripeProvider>
  );
};

export default BookRide;
