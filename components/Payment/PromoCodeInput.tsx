import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { fetchAPI } from "@/lib/fetch";
import { usePromoStore } from "@/store/promoStore";

interface PromoCodeInputProps {
  rideAmount: number;
  userId: string;
  onPromoApplied: (promoData: PromoCodeData) => void;
  onPromoRemoved: () => void;
}

const PromoCodeInput = ({
  rideAmount,
  userId,
  onPromoApplied,
  onPromoRemoved,
}: PromoCodeInputProps) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const {
    appliedPromo,
    setAppliedPromo,
    clearPromo,
    isValidating,
    setIsValidating,
  } = usePromoStore();

  const validatePromo = async () => {
    if (!code.trim()) {
      setError("Vui lòng nhập mã giảm giá");
      return;
    }

    setIsValidating(true);
    setError("");

    try {
      const response = await fetchAPI("/(api)/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code.toUpperCase(),
          user_id: userId,
          ride_amount: rideAmount,
        }),
      });

      if (response.success) {
        setAppliedPromo(response.data);
        onPromoApplied(response.data);
        setCode("");
      } else {
        setError(getErrorMessage(response.reason));
      }
    } catch (error) {
      setError("Không thể xác thực mã giảm giá");
      console.error("Promo validation error:", error);
    } finally {
      setIsValidating(false);
    }
  };

  const removePromo = () => {
    clearPromo();
    setCode("");
    setError("");
    onPromoRemoved();
  };

  const getErrorMessage = (reason: string) => {
    const messages: Record<string, string> = {
      expired: "Mã giảm giá đã hết hạn",
      max_uses_reached: "Mã giảm giá đã hết lượt sử dụng",
      user_limit_reached: "Bạn đã sử dụng hết lượt cho mã này",
      min_amount_not_met: "Giá trị chuyến đi chưa đủ điều kiện",
      not_found: "Mã giảm giá không tồn tại",
      inactive: "Mã giảm giá không còn hiệu lực",
      not_new_user: "Mã này chỉ dành cho người dùng mới",
    };
    return messages[reason] || "Mã giảm giá không hợp lệ";
  };

  const formatDiscount = (promo: PromoCodeData) => {
    if (promo.discount_type === "percentage") {
      return `${promo.discount_value}%`;
    } else if (promo.discount_type === "fixed_amount") {
      return `${promo.discount_amount.toLocaleString("vi-VN")} VNĐ`;
    } else {
      return "Miễn phí";
    }
  };

  return (
    <View className="mb-4">
      {!appliedPromo ? (
        <>
          <Text className="mb-2 text-base font-JakartaSemiBold text-gray-800">
            Mã giảm giá
          </Text>
          <View className="flex-row items-center">
            <TextInput
              className="flex-1 bg-neutral-100 rounded-lg px-4 py-3 mr-2 font-JakartaMedium"
              placeholder="Nhập mã giảm giá"
              value={code}
              onChangeText={(text) => {
                setCode(text.toUpperCase());
                setError("");
              }}
              autoCapitalize="characters"
              editable={!isValidating}
            />
            <TouchableOpacity
              className={`rounded-lg px-6 py-3 ${
                isValidating ? "bg-primary-300" : "bg-primary-500"
              }`}
              onPress={validatePromo}
              disabled={isValidating}
            >
              {isValidating ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text className="text-neutral-200 font-JakartaSemiBold">
                  Áp dụng
                </Text>
              )}
            </TouchableOpacity>
          </View>
          {error && (
            <Text className="mt-2 text-red-500 text-sm font-JakartaMedium">
              {error}
            </Text>
          )}
        </>
      ) : (
        <View className="bg-green-50 rounded-lg p-4 border border-green-200">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-green-700 font-JakartaSemiBold text-base">
                Mã: {appliedPromo.code}
              </Text>
              <Text className="text-green-600 text-sm mt-1 font-JakartaMedium">
                Giảm {formatDiscount(appliedPromo)} • Tiết kiệm{" "}
                {appliedPromo.discount_amount.toLocaleString("vi-VN")} VNĐ
              </Text>
            </View>
            <TouchableOpacity onPress={removePromo}>
              <Text className="text-red-500 font-JakartaSemiBold">Xóa</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default PromoCodeInput;
