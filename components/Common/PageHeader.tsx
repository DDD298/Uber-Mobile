import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

interface PageHeaderProps {
  title: string;
  onBackPress?: () => void;
}

const PageHeader = ({ title, onBackPress }: PageHeaderProps) => {
  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View className="relative flex-row items-center justify-center p-4 bg-white border-b border-gray-200">
      <TouchableOpacity
        onPress={handleBack}
        className="absolute left-4 w-10 h-10 items-center justify-center rounded-full bg-white border border-gray-200 z-10"
      >
        <Ionicons name="chevron-back" size={20} color="#000" />
      </TouchableOpacity>
      <Text className="text-xl font-JakartaBold text-center">{title}</Text>
    </View>
  );
};

export default PageHeader;
