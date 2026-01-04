import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

interface PromoCardProps {
  promo: {
    id: number;
    code: string;
    description: string;
    discount_type: string;
    discount_value: number;
    max_discount_amount?: number;
    min_order_amount?: number;
    end_date?: string;
  };
}

export default function PromoCard({ promo }: PromoCardProps) {
  const { t, i18n } = useTranslation();

  const getGradientColors = (index: number): readonly [string, string] => {
    const gradients: readonly [string, string][] = [
      ["#10B981", "#059669"], // Green
      ["#3B82F6", "#2563EB"], // Blue
      ["#F59E0B", "#D97706"], // Orange
      ["#8B5CF6", "#7C3AED"], // Purple
      ["#EF4444", "#DC2626"], // Red
    ];
    return gradients[index % gradients.length];
  };

  const formatDiscount = () => {
    if (promo.discount_type === "percentage") {
      return `-${promo.discount_value}%`;
    } else if (promo.discount_type === "fixed_amount") {
      return `-${promo.discount_value.toLocaleString()}₫`;
    } else {
      return t("promo.freeRide");
    }
  };

  const formatEndDate = () => {
    if (!promo.end_date) return "";
    const date = new Date(promo.end_date);
    return date.toLocaleDateString(i18n.language === "vi" ? "vi-VN" : "en-US");
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => router.push(`/(root)/promo-detail?id=${promo.id}`)}
      className="mr-4"
    >
      <LinearGradient
        colors={
          getGradientColors(promo.id) as readonly [string, string, ...string[]]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="w-[280px] h-[140px] rounded-3xl p-5 shadow-lg shadow-black/20"
      >
        {/* Icon & Discount */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center">
              <Ionicons name="pricetag" size={24} color="white" />
            </View>
            <Text className="ml-3 text-3xl font-JakartaBold text-white">
              {formatDiscount()}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="white" />
        </View>

        {/* Code */}
        <View className="bg-white/20 px-3 py-1.5 rounded-full self-start mb-2">
          <Text className="text-white font-JakartaBold text-sm tracking-wider">
            {promo.code}
          </Text>
        </View>

        {/* Description */}
        <Text
          className="text-white/90 font-JakartaMedium text-sm"
          numberOfLines={1}
        >
          {promo.description}
        </Text>

        {/* Footer */}
        {promo.end_date && (
          <View className="absolute bottom-3 right-5 flex-row items-center">
            <Ionicons name="time-outline" size={12} color="white" />
            <Text className="ml-1 text-white/80 font-Jakarta text-xs">
              {t("promo.until")} {formatEndDate()}
            </Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}
