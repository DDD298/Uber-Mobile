import CustomButton from "@/components/Common/CustomButton";
import DriverCard from "@/components/Common/DriverCard";
import RideLayout from "@/components/Ride/RideLayout";
import { useDriverStore } from "@/store";
import { router } from "expo-router";
import { FlatList, View, Text, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

const ITEMS_PER_PAGE = 6;

const ConfirmRide = () => {
  const { t } = useTranslation();
  const { drivers, selectedDriver, setSelectedDriver } = useDriverStore();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(drivers.length / ITEMS_PER_PAGE);

  const currentDrivers = drivers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

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
          {t("booking.selectDriver")}
        </Text>
      </View>
      <FlatList
        data={currentDrivers}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={({ item, index }) => (
          <DriverCard
            item={item}
            selected={selectedDriver!}
            setSelected={() => setSelectedDriver(item.id!)}
          />
        )}
        ListFooterComponent={() => (
          <View className="mx-4 mt-4 mb-20">
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <View className="flex-row justify-between items-center mb-4 px-2">
                <TouchableOpacity
                  onPress={handlePrevPage}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-full ${currentPage === 1 ? "opacity-30" : "bg-neutral-100"}`}
                >
                  <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>

                <Text className="font-JakartaMedium text-neutral-600">
                  {t("common.page")} {currentPage} / {totalPages}
                </Text>

                <TouchableOpacity
                  onPress={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-full ${currentPage === totalPages ? "opacity-30" : "bg-neutral-100"}`}
                >
                  <Ionicons name="chevron-forward" size={24} color="black" />
                </TouchableOpacity>
              </View>
            )}

            <CustomButton
              title={t("booking.bookRide")}
              onPress={() => router.push("/(root)/book-ride")}
            />
          </View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </RideLayout>
  );
};

export default ConfirmRide;
