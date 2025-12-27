import CustomButton from "@/components/Common/CustomButton";
import DriverCard from "@/components/Common/DriverCard";
import RideLayout from "@/components/Ride/RideLayout";
import { useDriverStore } from "@/store";
import { router } from "expo-router";
import { FlatList, View } from "react-native";

const ConfirmRide = () => {
  const { drivers, selectedDriver, setSelectedDriver } = useDriverStore();
  return (
    <RideLayout title="Chọn chuyến xe" snapPoints={["65%", "85%"]}>
      <FlatList
        data={drivers}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <DriverCard
            item={item}
            selected={selectedDriver!}
            setSelected={() => setSelectedDriver(item.id!)}
          />
        )}
        ListFooterComponent={() => (
          <View className="mx-4 mt-10">
            <CustomButton
              title="Đặt xe"
              onPress={() => router.push("/(root)/book-ride")}
            />
          </View>
        )}
      />
    </RideLayout>
  );
};

export default ConfirmRide;
