import Payment from "@/components/Ride/Payment";
import RideLayout from "@/components/Ride/RideLayout";
import { icons } from "@/constants";
import { formatTime } from "@/lib/utils";
import { useDriverStore, useLocationStore } from "@/store";
import { useUser } from "@clerk/clerk-expo";
import { StripeProvider } from "@stripe/stripe-react-native";
import { Image, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

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

  return (
    <StripeProvider
      publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
      merchantIdentifier="merchant.com.uber"
      urlScheme="myapp"
    >
      <RideLayout title={t("booking.bookRide")}>
        <>
          <Text className="mb-4 text-xl font-JakartaSemiBold">
            {t("ride.rideDetails")}
          </Text>

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
              <Text className="text-lg font-JakartaRegular text-green-600">
                {Number(driverDetails?.price).toLocaleString("vi-VN")} VNĐ
              </Text>
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
              <Text className="text-lg font-JakartaRegular">
                {t("booking.seats")}
              </Text>
              <Text className="text-lg font-JakartaRegular">
                {driverDetails?.car_seats}
              </Text>
            </View>
          </View>

          <View className="flex flex-col justify-center items-start mt-4 w-full">
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
            amount={driverDetails?.price!}
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
