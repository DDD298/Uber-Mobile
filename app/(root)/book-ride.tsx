import Payment from "@/components/Ride/Payment";
import RideLayout from "@/components/Ride/RideLayout";
import PageHeader from "@/components/Common/PageHeader";
import { icons } from "@/constants";
import { formatTime } from "@/lib/utils";
import { useDriverStore, useLocationStore, usePromoStore } from "@/store";
import { useUser } from "@clerk/clerk-expo";
import { StripeProvider } from "@stripe/stripe-react-native";
import { Image, Text, View, Alert, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
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
  const { selectedPromo, clearSelectedPromo } = usePromoStore();

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

  // Auto-apply promo when selectedPromo changes
  useEffect(() => {
    if (selectedPromo) {
      validateAndApplyPromo(selectedPromo.code);
    }
  }, [selectedPromo]);

  const validateAndApplyPromo = async (code: string) => {
    try {
      setIsValidating(true);

      const requestPayload = {
        code: code,
        user_id: user?.id,
        ride_amount: parseFloat(driverDetails?.price || "0"),
      };

      const response = await fetchAPI("/(api)/promo/validate", {
        method: "POST",
        body: JSON.stringify(requestPayload),
      });

      if (response.success) {
        setDiscountInfo({
          amount: response.data.discount_amount,
          finalPrice: response.data.final_amount,
          code: code,
          id: response.data.promo_code_id,
        });
        setPromoCode(code);
      } else {
        setDiscountInfo(null);
        Alert.alert(t("common.error"), response.error || t("promo.notFound"));
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
          <PageHeader title={t("ride.rideDetails")} />

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

          {/* Promo Code Section */}
          {discountInfo ? (
            <View className="mt-2 p-4 bg-green-50 rounded-2xl border border-green-200">
              <View className="flex-row items-center justify-between">
                {/* Left: Icon + Code */}
                <View className="flex-row items-center flex-shrink">
                  <Ionicons name="pricetag" size={18} color="#16A34A" />
                  <Text className="ml-2 text-base font-JakartaBold text-green-600">
                    {discountInfo.code}
                  </Text>
                </View>

                {/* Center: Savings */}
                <Text className="text-sm font-JakartaMedium text-green-600 flex-1 text-center">
                  -{discountInfo.amount.toLocaleString("vi-VN")}₫
                </Text>

                {/* Right: Cancel Button */}
                <TouchableOpacity
                  onPress={() => {
                    setDiscountInfo(null);
                    setPromoCode("");
                    clearSelectedPromo();
                  }}
                  className="bg-red-500 py-2 px-3 rounded-lg"
                >
                  <Text className="text-white font-JakartaBold text-sm">
                    Hủy
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View className="mt-2 flex flex-row justify-between items-center">
              <Text className="text-lg font-JakartaSemiBold">
                Chọn mã giảm giá
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/(root)/promos")}
                className="flex flex-row items-center"
              >
                <Text className="text-primary-600 text-lg font-JakartaBold">
                  Xem mã khả dụng
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="#16A34A"
                  className="mt-1"
                />
              </TouchableOpacity>
            </View>
          )}

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
