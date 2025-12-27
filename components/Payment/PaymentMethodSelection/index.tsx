import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
}

interface PaymentMethodSelectionProps {
  selectedPaymentMethod: string;
  onPaymentMethodSelect: (methodId: string) => void;
}

const PaymentMethodSelection: React.FC<PaymentMethodSelectionProps> = ({
  selectedPaymentMethod,
  onPaymentMethodSelect,
}) => {
  const paymentMethods = React.useMemo(() => [
    { id: "card", name: "Thẻ tín dụng", icon: "💳" },
    { id: "cash", name: "Tiền mặt", icon: "💵" },
    { id: "qr", name: "Quét mã QR", icon: "📱" },
  ], []);

  return (
    <View className="my-5">
      <Text className="mb-3 text-lg font-JakartaSemiBold">
        Chọn phương thức thanh toán
      </Text>

      <View className="flex flex-row flex-wrap justify-between">
        {paymentMethods.map((method) => {
          const isSelected = selectedPaymentMethod === method.id;
          return (
            <TouchableOpacity
              key={method.id}
              onPress={() => onPaymentMethodSelect(method.id)}
              className={`flex flex-row items-center justify-center p-4 mb-3 rounded-lg border-2 w-[48%] ${
                isSelected
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 bg-white"
              }`}
              activeOpacity={0.7}
            >
              <Text className="mr-2 text-2xl">{method.icon}</Text>
              <Text className="flex-1 text-base text-center font-JakartaRegular">
                {method.name}
              </Text>

              <View
                className={`absolute top-2 right-2 justify-center items-center w-5 h-5 bg-green-500 !rounded-full ${
                  isSelected ? "opacity-100" : "opacity-0"
                }`}
              >
                {isSelected && (
                  <Text className="text-xs font-bold text-white">✓</Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default PaymentMethodSelection;
