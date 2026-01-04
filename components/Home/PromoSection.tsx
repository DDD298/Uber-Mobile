import { useEffect, useState, useRef } from "react";
import { View, Text, FlatList, Dimensions } from "react-native";
import { useTranslation } from "react-i18next";

import PromoCard from "@/components/Promo/PromoCard";
import { fetchAPI } from "@/lib/fetch";

const { width } = Dimensions.get("window");

export default function PromoSection() {
  const { t } = useTranslation();
  const [promoCodes, setPromoCodes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadPromoCodes();
  }, []);

  useEffect(() => {
    // Auto scroll every 4 seconds
    if (promoCodes.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % promoCodes.length;
          flatListRef.current?.scrollToIndex({
            index: nextIndex,
            animated: true,
          });
          return nextIndex;
        });
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [promoCodes]);

  const loadPromoCodes = async () => {
    try {
      const response = await fetchAPI("/(api)/promo/active", {
        method: "GET",
      });

      if (response.success) {
        setPromoCodes(response.data);
      }
    } catch (error) {
      console.error("Error loading promo codes:", error);
    }
  };

  if (promoCodes.length === 0) {
    return null;
  }

  return (
    <View className="mb-6">
      <Text className="mb-3 text-lg font-JakartaBold text-white">
        {t("promo.availablePromoCodes")}
      </Text>

      <FlatList
        ref={flatListRef}
        data={promoCodes}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled={false}
        snapToInterval={width - 80}
        decelerationRate="fast"
        contentContainerStyle={{ paddingRight: 16 }}
        renderItem={({ item }) => <PromoCard promo={item} />}
        keyExtractor={(item: any) => item.id.toString()}
        onScrollToIndexFailed={(info) => {
          const wait = new Promise((resolve) => setTimeout(resolve, 500));
          wait.then(() => {
            flatListRef.current?.scrollToIndex({
              index: info.index,
              animated: true,
            });
          });
        }}
      />

      {/* Pagination Dots */}
      {promoCodes.length > 1 && (
        <View className="flex-row justify-center mt-3">
          {promoCodes.map((_, index) => (
            <View
              key={index}
              className={`w-2 h-2 rounded-full mx-1 ${
                index === currentIndex ? "bg-white" : "bg-white/30"
              }`}
            />
          ))}
        </View>
      )}
    </View>
  );
}
