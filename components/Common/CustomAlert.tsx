import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import ReactNativeModal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";

export type AlertType = "success" | "error" | "warning" | "info";

interface CustomAlertProps {
  visible: boolean;
  type?: AlertType;
  title: string;
  message: string;
  buttons?: Array<{
    text: string;
    onPress?: () => void;
    style?: "default" | "cancel" | "destructive";
  }>;
  onClose?: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  type = "info",
  title,
  message,
  buttons = [{ text: "OK", style: "default" }],
  onClose,
}) => {
  // Debug: Track component renders and visibility changes
  useEffect(() => {
    console.log("🎨 [CustomAlert] Component rendered");
    console.log("👁️  [CustomAlert] Visible:", visible);
    console.log("📝 [CustomAlert] Type:", type);
    console.log("📌 [CustomAlert] Title:", title);
  }, [visible, type, title]);

  useEffect(() => {
    if (visible) {
      console.log("✨ [CustomAlert] Modal is now VISIBLE");
      console.log("⏰ [CustomAlert] Timestamp:", new Date().toISOString());
    } else {
      console.log("🚫 [CustomAlert] Modal is now HIDDEN");
    }
  }, [visible]);

  const getTypeConfig = () => {
    switch (type) {
      case "success":
        return {
          icon: "checkmark-circle" as const,
          iconColor: "#10B981",
          bgColor: "#D1FAE5",
          borderColor: "#10B981",
        };
      case "error":
        return {
          icon: "close-circle" as const,
          iconColor: "#EF4444",
          bgColor: "#FEE2E2",
          borderColor: "#EF4444",
        };
      case "warning":
        return {
          icon: "warning" as const,
          iconColor: "#F59E0B",
          bgColor: "#FEF3C7",
          borderColor: "#F59E0B",
        };
      case "info":
      default:
        return {
          icon: "information-circle" as const,
          iconColor: "#3B82F6",
          bgColor: "#DBEAFE",
          borderColor: "#3B82F6",
        };
    }
  };

  const config = getTypeConfig();

  const handleButtonPress = (button: (typeof buttons)[0]) => {
    console.log("🔘 [CustomAlert] Button pressed:", button.text);
    console.log(
      "⏰ [CustomAlert] Button press timestamp:",
      new Date().toISOString()
    );

    if (button.onPress) {
      console.log("🎯 [CustomAlert] Executing button onPress callback");
      button.onPress();
    }
    if (onClose) {
      console.log("🚪 [CustomAlert] Calling onClose");
      onClose();
    }
  };

  return (
    <ReactNativeModal
      isVisible={visible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      animationIn="fadeIn"
      animationOut="fadeOut"
      animationInTiming={200}
      animationOutTiming={150}
      backdropTransitionInTiming={200}
      backdropTransitionOutTiming={150}
      backdropOpacity={0.5}
      useNativeDriver
      hideModalContentWhileAnimating
      style={{ margin: 0, justifyContent: "center", alignItems: "center" }}
    >
      <View
        className="bg-white rounded-3xl p-6 mx-4 w-[90%] max-w-md"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        {/* Icon */}
        <View className="items-center mb-4">
          <View
            className="w-20 h-20 rounded-full items-center justify-center"
            style={{ backgroundColor: config.bgColor }}
          >
            <Ionicons name={config.icon} size={48} color={config.iconColor} />
          </View>
        </View>

        {/* Title */}
        <Text className="text-2xl font-JakartaBold text-center text-gray-900 mb-3">
          {title}
        </Text>

        {/* Message */}
        <Text className="text-base font-JakartaMedium text-center text-gray-600 mb-6">
          {message}
        </Text>

        {/* Buttons */}
        <View className="flex-col gap-3">
          {buttons.map((button, index) => {
            const isCancel = button.style === "cancel";
            const isDestructive = button.style === "destructive";

            return (
              <TouchableOpacity
                key={index}
                onPress={() => handleButtonPress(button)}
                className={`py-4 rounded-xl ${
                  isCancel
                    ? "bg-gray-100"
                    : isDestructive
                      ? "bg-red-500"
                      : "bg-green-500"
                }`}
                activeOpacity={0.7}
              >
                <Text
                  className={`text-center text-base font-JakartaBold ${
                    isCancel ? "text-gray-700" : "text-white"
                  }`}
                >
                  {button.text}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </ReactNativeModal>
  );
};

export default CustomAlert;
