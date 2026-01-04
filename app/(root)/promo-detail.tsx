import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import * as Clipboard from "expo-clipboard";

import { fetchAPI } from "@/lib/fetch";
import CustomButton from "@/components/Common/CustomButton";

export default function PromoDetailScreen() {
  const { t, i18n } = useTranslation();
  const { id } = useLocalSearchParams();
  const [promo, setPromo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPromoDetail();
  }, [id]);

  const loadPromoDetail = async () => {
    try {
      const response = await fetchAPI("/(api)/promo/active", {
        method: "GET",
      });

      if (response.success) {
        const promoData = response.data.find(
          (p: any) => p.id === parseInt(id as string)
        );
        setPromo(promoData);
      }
    } catch (error) {
      console.error("Error loading promo:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (promo?.code) {
      await Clipboard.setStringAsync(promo.code);
      Alert.alert(t("common.success"), t("promo.codeCopied"));
    }
  };

  const formatDiscount = () => {
    if (!promo) return "";
    if (promo.discount_type === "percentage") {
      return `${promo.discount_value}%`;
    } else if (promo.discount_type === "fixed_amount") {
      return `${promo.discount_value.toLocaleString()}₫`;
    } else {
      return t("promo.freeRide");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language === "vi" ? "vi-VN" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-500 font-JakartaMedium">
          {t("common.loading")}
        </Text>
      </SafeAreaView>
    );
  }

  if (!promo) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-500 font-JakartaMedium">
          {t("promo.notFound")}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-4 py-4 bg-white">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center bg-neutral-100 rounded-full mb-4"
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-2xl font-JakartaBold">
            {t("promo.promoDetail")}
          </Text>
        </View>

        {/* Promo Card */}
        <View className="mx-4 mt-4">
          <LinearGradient
            colors={["#10B981", "#059669"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-3xl p-6 shadow-lg shadow-black/20"
          >
            <View className="flex-row items-center justify-between mb-4">
              <View className="w-16 h-16 bg-white/20 rounded-full items-center justify-center">
                <Ionicons name="pricetag" size={32} color="white" />
              </View>
              <Text className="text-5xl font-JakartaBold text-neutral-200">
                {formatDiscount()}
              </Text>
            </View>

            <View className="bg-white/20 px-4 py-2 rounded-full self-start mb-3">
              <Text className="text-neutral-200 font-JakartaBold text-lg tracking-wider">
                {promo.code}
              </Text>
            </View>

            <Text className="text-neutral-200 font-JakartaMedium text-base">
              {promo.description}
            </Text>
          </LinearGradient>
        </View>

        {/* Details */}
        <View className="mx-4 mt-4 bg-white rounded-3xl shadow-sm shadow-neutral-300 p-6">
          <Text className="text-lg font-JakartaBold mb-4">
            {t("promo.details")}
          </Text>

          {/* Discount Type */}
          <View className="flex-row items-center py-3 border-b border-gray-100">
            <View className="w-10 h-10 items-center justify-center bg-green-50 rounded-full">
              <Ionicons name="gift-outline" size={20} color="#10B981" />
            </View>
            <View className="flex-1 ml-3">
              <Text className="text-sm text-gray-500 font-JakartaMedium">
                {t("promo.discountType")}
              </Text>
              <Text className="text-base font-JakartaBold text-gray-900">
                {promo.discount_type === "percentage"
                  ? t("promo.percentage")
                  : promo.discount_type === "fixed_amount"
                    ? t("promo.fixedAmount")
                    : t("promo.freeRide")}
              </Text>
            </View>
          </View>

          {/* Min Order Amount */}
          {promo.min_order_amount && (
            <View className="flex-row items-center py-3 border-b border-gray-100">
              <View className="w-10 h-10 items-center justify-center bg-green-50 rounded-full">
                <Ionicons name="cash-outline" size={20} color="#10B981" />
              </View>
              <View className="flex-1 ml-3">
                <Text className="text-sm text-gray-500 font-JakartaMedium">
                  {t("promo.minOrderAmount")}
                </Text>
                <Text className="text-base font-JakartaBold text-gray-900">
                  {promo.min_order_amount.toLocaleString()}₫
                </Text>
              </View>
            </View>
          )}

          {/* Max Discount */}
          {promo.max_discount_amount && (
            <View className="flex-row items-center py-3 border-b border-gray-100">
              <View className="w-10 h-10 items-center justify-center bg-green-50 rounded-full">
                <Ionicons
                  name="trending-down-outline"
                  size={20}
                  color="#10B981"
                />
              </View>
              <View className="flex-1 ml-3">
                <Text className="text-sm text-gray-500 font-JakartaMedium">
                  {t("promo.maxDiscount")}
                </Text>
                <Text className="text-base font-JakartaBold text-gray-900">
                  {promo.max_discount_amount.toLocaleString()}₫
                </Text>
              </View>
            </View>
          )}

          {/* Valid Period */}
          <View className="flex-row items-center py-3 border-b border-gray-100">
            <View className="w-10 h-10 items-center justify-center bg-green-50 rounded-full">
              <Ionicons name="calendar-outline" size={20} color="#10B981" />
            </View>
            <View className="flex-1 ml-3">
              <Text className="text-sm text-gray-500 font-JakartaMedium">
                {t("promo.validPeriod")}
              </Text>
              <Text className="text-base font-JakartaBold text-gray-900">
                {formatDate(promo.start_date)}
                {promo.end_date && ` - ${formatDate(promo.end_date)}`}
              </Text>
            </View>
          </View>

          {/* Usage */}
          {promo.usage_limit && (
            <View className="flex-row items-center py-3">
              <View className="w-10 h-10 items-center justify-center bg-green-50 rounded-full">
                <Ionicons name="people-outline" size={20} color="#10B981" />
              </View>
              <View className="flex-1 ml-3">
                <Text className="text-sm text-gray-500 font-JakartaMedium">
                  {t("promo.usage")}
                </Text>
                <Text className="text-base font-JakartaBold text-gray-900">
                  {promo.used_count} / {promo.usage_limit}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Copy Button */}
        <View className="mx-4 mt-4 mb-6">
          <CustomButton
            title={t("promo.copyCode")}
            onPress={copyToClipboard}
            IconLeft={() => (
              <Ionicons name="copy-outline" size={20} color="white" />
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
