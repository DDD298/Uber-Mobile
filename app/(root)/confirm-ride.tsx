import CustomButton from "@/components/Common/CustomButton";
import DriverCard from "@/components/Common/DriverCard";
import RideLayout from "@/components/Ride/RideLayout";
import { useDriverStore } from "@/store";
import { router } from "expo-router";
import { FlatList, View } from "react-native";
import { useTranslation } from "react-i18next";

const ConfirmRide = () => {
  const { t } = useTranslation();
  const { drivers, selectedDriver, setSelectedDriver } = useDriverStore();
  return (
    <RideLayout title={t("booking.selectDriver")} snapPoints={["65%", "85%"]}>
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
              title={t("booking.bookRide")}
              onPress={() => router.push("/(root)/book-ride")}
            />
          </View>
        )}
      />
    </RideLayout>
  );
};

export default ConfirmRide;
