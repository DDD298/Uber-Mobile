import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import PromoCard from "@/components/Promo/PromoCard";
import { fetchAPI } from "@/lib/fetch"; // Adjust import path if needed

export default function PromoList() {
  const { t } = useTranslation();
  const [promoCodes, setPromoCodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPromoCodes();
  }, []);

  const loadPromoCodes = async () => {
    try {
      setLoading(true);
      const response = await fetchAPI("/(api)/promo/active", {
        method: "GET",
      });

      if (response.success) {
        setPromoCodes(response.data);
      }
    } catch (error) {
      console.error("Error loading promo codes:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-row items-center p-4 border-b !border-b-gray-200">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full bg-white border border-gray-200 mr-4"
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-JakartaBold">Mã giảm giá</Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      ) : (
        <FlatList
          data={promoCodes}
          keyExtractor={(item: any) => item.id.toString()}
          renderItem={({ item }) => (
            <View className="mb-4 px-4 rounded-xl overflow-hidden">
              <PromoCard promo={item} />
            </View>
          )}
          contentContainerStyle={{ paddingVertical: 16 }}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center mt-10">
              <Text className="text-neutral-200 text-lg font-JakartaMedium">
                Không có mã giảm giá nào
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
