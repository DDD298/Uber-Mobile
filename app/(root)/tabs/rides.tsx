import RideCard from "@/components/Ride/RideCard";
import { images } from "@/constants";
import { fetchAPI } from "@/lib/fetch";
import { Ride } from "@/types/type";
import { useAuth } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

export default function RidesScreen() {
  const { t } = useTranslation();
  const { userId } = useAuth();
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRides = async () => {
    const testUserId = userId || "user_33V7GizlzLeZyR9fHj10LxbFR9z";
    if (!testUserId) {
      return;
    }

    try {
      setError(null);
      const timestamp = Date.now();
      const url = `/(api)/ride/list?user_id=${testUserId}&status=all&limit=50&offset=0&_t=${timestamp}`;
      const response = await fetchAPI(url);
      setRides(response.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.networkError"));
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRides();
    setRefreshing(false);
  };

  const handleCancelRide = async (rideId: number) => {
    try {
      await fetchAPI(`/(api)/ride/cancel`, {
        method: "PUT",
        body: JSON.stringify({
          ride_id: rideId,
          user_id: userId,
          reason: t("ride.cancelled"),
        }),
      });

      await fetchRides();
    } catch (err) {}
  };

  useEffect(() => {
    fetchRides();
  }, [userId]);
  return (
    <SafeAreaView className="flex-1 bg-general-500">
      <FlatList
        data={rides}
        renderItem={({ item }) => (
          <RideCard
            ride={item}
            onCancel={
              (item.ride_status === "confirmed" ||
                item.ride_status === "driver_arrived") &&
              item.ride_id
                ? () => handleCancelRide(Number(item.ride_id))
                : undefined
            }
          />
        )}
        keyExtractor={(item) => item.ride_id?.toString() || "0"}
        className="px-4"
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        ListEmptyComponent={() => (
          <View className="flex flex-col justify-center items-center mt-20">
            {loading ? (
              <ActivityIndicator size="large" color="#000" />
            ) : error ? (
              <>
                <Image
                  source={images.noResult}
                  className="w-40 h-40"
                  alt={t("errors.somethingWentWrong")}
                  resizeMode="contain"
                />
                <Text className="mt-4 text-sm text-red-500">{error}</Text>
              </>
            ) : (
              <>
                <Image
                  source={images.noResult}
                  className="w-40 h-40"
                  alt={t("ride.noRidesFound")}
                  resizeMode="contain"
                />
                <Text className="mt-4 text-sm">{t("ride.noRidesFound")}</Text>
              </>
            )}
          </View>
        )}
        ListHeaderComponent={
          <>
            <Text className="my-4 text-2xl font-JakartaBold">
              {t("ride.myRides")}
            </Text>
            {rides.length > 0 && (
              <Text className="mb-2 text-base font-bold text-green-600">
                {rides.length} {t("ride.myRides")}
              </Text>
            )}
          </>
        }
      />
    </SafeAreaView>
  );
}
