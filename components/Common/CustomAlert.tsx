import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";

interface CustomAlertProps {
  isVisible: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmText?: string;
  type?: "success" | "error" | "info" | "warning";
}

const CustomAlert = ({
  isVisible,
  title,
  description,
  onConfirm,
  confirmText = "OK",
  type = "info",
}: CustomAlertProps) => {
  const getIcon = () => {
    switch (type) {
      case "success":
        return { name: "checkmark-circle", color: "#22c55e" };
      case "error":
        return { name: "close-circle", color: "#ef4444" };
      case "warning":
        return { name: "warning", color: "#f59e0b" };
      default:
        return { name: "information-circle", color: "#3b82f6" };
    }
  };

  const iconSpec = getIcon();

  return (
    <Modal
      isVisible={isVisible}
      animationIn="zoomIn"
      animationOut="zoomOut"
      backdropOpacity={0.5}
      useNativeDriver
      hideModalContentWhileAnimating
    >
      <View className="bg-white rounded-[24px] p-6 items-center shadow-xl">
        <View
          className="w-16 h-16 rounded-full items-center justify-center mb-4"
          style={{ backgroundColor: `${iconSpec.color}15` }}
        >
          <Ionicons
            name={iconSpec.name as any}
            size={40}
            color={iconSpec.color}
          />
        </View>

        <Text className="text-xl font-JakartaBold text-gray-900 mb-2 text-center">
          {title}
        </Text>

        <Text className="text-base font-JakartaMedium text-gray-500 mb-6 text-center leading-6">
          {description}
        </Text>

        <TouchableOpacity
          onPress={onConfirm}
          activeOpacity={0.8}
          className="w-full h-14 rounded-2xl items-center justify-center"
          style={{ backgroundColor: iconSpec.color }}
        >
          <Text className="text-white text-lg font-JakartaBold">
            {confirmText}
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default CustomAlert;
