import CustomButton from "@/components/Common/CustomButton";
import GoogleTextInput from "@/components/Common/GoogleTextInput";
import RideLayout from "@/components/Ride/RideLayout";
import { icons } from "@/constants";
import { useLocationStore } from "@/store";
import { router } from "expo-router";
import { Text, View } from "react-native";

const FindRide = () => {
  const {
    userAddress,
    destinationAddress,
    setDestinationLocation,
    setUserLocation,
  } = useLocationStore();

  return (
    <RideLayout title="Tìm chuyến xe"
      snapPoints={["85%"]}>
      <View className="my-3">
        <Text className="mb-3 text-lg font-JakartaSemiBold">Từ:</Text>
        <GoogleTextInput
          icon={icons.target}
          initialLocation={userAddress!}
          containerStyle="bg-neutral-100"
          textInputBackgroundColor="transparent"
          handlePress={(location) => setUserLocation(location)}
        />
      </View>

      <View className="my-3">
        <Text className="mb-3 text-lg font-JakartaSemiBold">Đến:</Text>
        <GoogleTextInput
          icon={icons.map}
          initialLocation={destinationAddress!}
          containerStyle="bg-neutral-100"
          textInputBackgroundColor="transparent"
          handlePress={(location) => setDestinationLocation(location)}
        />
      </View>

      <CustomButton title="Đặt ngay"
        onPress={() => router.push('/(root)/confirm-ride')}
        className="mt-4"
      />
    </RideLayout>
  );
}

export default FindRide;