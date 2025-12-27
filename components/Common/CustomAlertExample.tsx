import React from "react";
import { View, Text } from "react-native";
import CustomButton from "@/components/Common/CustomButton";
import CustomAlert from "@/components/Common/CustomAlert";
import { useCustomAlert } from "@/hooks/useCustomAlert";
import { useTranslation } from "react-i18next";

/**
 * EXAMPLE: Cách sử dụng CustomAlert
 *
 * Thay thế Alert.alert() bằng CustomAlert đẹp hơn
 */

const ExampleUsage = () => {
  const { t } = useTranslation();
  const {
    alertConfig,
    visible,
    hideAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm,
  } = useCustomAlert();

  // Example 1: Success Alert
  const handleSuccess = () => {
    showSuccess(t("common.success"), "Đánh giá đã được gửi thành công!", () => {
      console.log("Success callback");
    });
  };

  // Example 2: Error Alert
  const handleError = () => {
    showError(
      t("common.error"),
      "Không thể gửi đánh giá. Vui lòng thử lại.",
      () => {
        console.log("Error callback");
      }
    );
  };

  // Example 3: Warning Alert
  const handleWarning = () => {
    showWarning("Cảnh báo", "Bạn có chắc chắn muốn tiếp tục?");
  };

  // Example 4: Info Alert
  const handleInfo = () => {
    showInfo("Thông tin", "Tính năng này sẽ được thêm vào sau");
  };

  // Example 5: Confirm Dialog
  const handleConfirm = () => {
    showConfirm(
      "Xác nhận hủy chuyến",
      "Bạn có chắc chắn muốn hủy chuyến này?",
      () => {
        console.log("Confirmed");
        // Xử lý hủy chuyến
      },
      () => {
        console.log("Cancelled");
      }
    );
  };

  return (
    <View className="flex-1 p-4 justify-center">
      <Text className="text-2xl font-JakartaBold mb-6 text-center">
        Custom Alert Examples
      </Text>

      <View className="gap-4">
        <CustomButton
          title="Success Alert"
          onPress={handleSuccess}
          bgVariant="success"
        />

        <CustomButton
          title="Error Alert"
          onPress={handleError}
          bgVariant="danger"
        />

        <CustomButton
          title="Warning Alert"
          onPress={handleWarning}
          bgVariant="secondary"
        />

        <CustomButton
          title="Info Alert"
          onPress={handleInfo}
          bgVariant="primary"
        />

        <CustomButton
          title="Confirm Dialog"
          onPress={handleConfirm}
          bgVariant="outline"
        />
      </View>

      {/* Render CustomAlert */}
      {alertConfig && (
        <CustomAlert
          visible={visible}
          type={alertConfig.type}
          title={alertConfig.title}
          message={alertConfig.message}
          buttons={alertConfig.buttons}
          onClose={hideAlert}
        />
      )}
    </View>
  );
};

export default ExampleUsage;
