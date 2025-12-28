import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import CustomAlert from "@/components/Common/CustomAlert";
import { useCustomAlert } from "@/hooks/useCustomAlert";
import { useTranslation } from "react-i18next";

interface ChatHeaderProps {
  onBackPress: () => void;
  onClearHistory: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  onBackPress,
  onClearHistory,
}) => {
  const { t } = useTranslation();
  const {
    alertConfig,
    visible: alertVisible,
    hideAlert,
    showConfirm,
  } = useCustomAlert();

  const handleClearHistory = () => {
    showConfirm(t("chat.clearHistory"), t("chat.confirmClear"), onClearHistory);
  };

  return (
    <LinearGradient
      colors={["#38A169", "#2F855A", "#38A169"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      locations={[0, 0.5, 1]}
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        padding: 16,
        gap: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#38A169",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        minHeight: 120,
      }}
    >
      <TouchableOpacity
        onPress={onBackPress}
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: "rgba(255, 255, 255, 0.2)",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ionicons name="chevron-back" size={20} color="white" />
      </TouchableOpacity>

      <View
        style={{
          flex: 1,
          height: 40,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: "rgba(255, 255, 255, 0.2)",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontFamily: "JakartaBold",
            color: "white",
            fontWeight: "600",
          }}
        >
          {t("chat.title")}
        </Text>
      </View>

      <TouchableOpacity
        onPress={handleClearHistory}
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: "rgba(255, 255, 255, 0.2)",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ionicons name="trash-outline" size={20} color="white" />
      </TouchableOpacity>

      {/* Custom Alert */}
      {alertConfig && (
        <CustomAlert
          visible={alertVisible}
          type={alertConfig.type}
          title={alertConfig.title}
          message={alertConfig.message}
          buttons={alertConfig.buttons}
          onClose={hideAlert}
        />
      )}
    </LinearGradient>
  );
};

export default ChatHeader;
