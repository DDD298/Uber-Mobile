import React from "react";
import { Animated, Modal, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

import CustomButton from "@/components/Common/CustomButton";

interface QRPaymentModalProps {
  visible: boolean;
  onClose: () => void;
  amount: string;
  qrStep: number;
  qrCodeVisible: boolean;
  fadeAnim: Animated.Value;
  scaleAnim: Animated.Value;
  qrScanAnim: Animated.Value;
  onQRPayment: () => void;
  onBackToStep1: () => void;
}

const QRPaymentModal: React.FC<QRPaymentModalProps> = ({
  visible,
  onClose,
  amount,
  qrStep,
  qrCodeVisible,
  fadeAnim,
  scaleAnim,
  qrScanAnim,
  onQRPayment,
  onBackToStep1,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <Animated.View
        className="flex-1 justify-center items-center"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          opacity: fadeAnim,
        }}
      >
        <Animated.View
          className="flex flex-col justify-center items-center p-6 mx-4 w-11/12 bg-white rounded-2xl"
          style={{
            transform: [{ scale: scaleAnim }],
          }}
        >
          {qrStep === 1 && (
            <>
              <View className="flex justify-center items-center mb-4 w-16 h-16 bg-green-100 rounded-full">
                <Text className="text-3xl">📱</Text>
              </View>
              <Text className="mb-2 text-xl text-center font-JakartaBold">
                Thanh toán QR Code
              </Text>
              <Text className="mb-4 text-center text-gray-600 font-JakartaRegular">
                Quét mã QR để thanh toán nhanh chóng và an toàn
              </Text>
              <View className="p-4 mb-4 w-full bg-gray-50 rounded-lg">
                <Text className="text-lg text-center font-JakartaSemiBold">
                  Số tiền: {Number(amount).toLocaleString("vi-VN")} VNĐ
                </Text>
              </View>
              <View className="flex flex-row gap-x-4 w-full">
                <CustomButton
                  title="Hủy"
                  className="flex-1 bg-gray-200"
                  onPress={onClose}
                />
                <CustomButton
                  title="Tạo mã QR"
                  className="flex-1"
                  onPress={onQRPayment}
                />
              </View>
            </>
          )}

          {qrStep === 2 && (
            <>
              <View className="flex justify-center items-center mb-4 w-16 h-16 bg-green-100 rounded-full">
                <Text className="text-3xl">📱</Text>
              </View>
              <Text className="mb-2 text-xl text-center font-JakartaBold">
                Quét mã QR để thanh toán
              </Text>
              <Text className="mb-4 text-center text-gray-600 font-JakartaRegular">
                Sử dụng ứng dụng ngân hàng để quét mã QR
              </Text>

              <View className="relative justify-center items-center mb-4 w-64 h-64 bg-white rounded-lg border-2 border-gray-300">
                {qrCodeVisible && (
                  <>
                    {/* Real QR Code */}
                    <View className="justify-center items-center p-4 w-48 h-48 bg-white rounded-lg">
                      <QRCode
                        value={`https://payment.my-app.com/qr?amount=${amount}&transaction=QR${Date.now().toString().slice(-6)}&timestamp=${Date.now()}`}
                        size={160}
                        color="black"
                        backgroundColor="white"
                        logoSize={30}
                        logoMargin={2}
                        logoBorderRadius={15}
                        quietZone={10}
                      />
                    </View>

                    {/* Scanning animation */}
                    <Animated.View
                      className="absolute w-full h-1 bg-green-500"
                      style={{
                        opacity: qrScanAnim,
                        transform: [
                          {
                            translateY: qrScanAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0, 240],
                            }),
                          },
                        ],
                      }}
                    />
                  </>
                )}
              </View>

              <View className="p-4 mb-4 w-full bg-green-50 rounded-lg border border-green-200">
                <Text className="text-center text-green-700 font-JakartaSemiBold">
                  💡 Mẹo: Mở ứng dụng ngân hàng và chọn &quot;Quét QR&quot;
                </Text>
              </View>

              <View className="p-4 mb-4 w-full bg-gray-50 rounded-lg border border-gray-200">
                <View className="flex flex-row justify-between items-center mb-2">
                  <Text className="text-sm text-gray-700 font-JakartaSemiBold">
                    Mã giao dịch:
                  </Text>
                  <Text className="text-sm text-gray-600 font-JakartaRegular">
                    QR{Date.now().toString().slice(-6)}
                  </Text>
                </View>
                <View className="flex flex-row justify-between items-center mb-2">
                  <Text className="text-sm text-gray-700 font-JakartaSemiBold">
                    Số tiền:
                  </Text>
                  <Text className="text-sm text-green-600 font-JakartaSemiBold">
                    {Number(amount).toLocaleString("vi-VN")} VNĐ
                  </Text>
                </View>
                <View className="flex flex-row justify-between items-center">
                  <Text className="text-sm text-gray-700 font-JakartaSemiBold">
                    Thời gian:
                  </Text>
                  <Text className="text-sm text-gray-600 font-JakartaRegular">
                    {new Date().toLocaleTimeString("vi-VN")}
                  </Text>
                </View>
              </View>

              <View className="flex flex-row gap-x-4 w-full">
                <CustomButton
                  title="Quay lại"
                  className="flex-1 bg-gray-200"
                  onPress={onBackToStep1}
                />
                <CustomButton
                  title="Đã quét xong"
                  className="flex-1"
                  onPress={onQRPayment}
                />
              </View>
            </>
          )}

          {qrStep === 3 && (
            <>
              <View className="flex justify-center items-center mb-4 w-16 h-16 bg-green-100 rounded-full">
                <Text className="text-3xl">✅</Text>
              </View>
              <Text className="mb-2 text-xl text-center font-JakartaBold">
                Đang xác nhận thanh toán...
              </Text>
              <Text className="mb-4 text-center text-gray-600 font-JakartaRegular">
                Đang kiểm tra giao dịch từ ngân hàng
              </Text>
              <View className="overflow-hidden w-full h-2 bg-gray-200 rounded-full">
                <Animated.View
                  className="h-full bg-green-500 rounded-full"
                  style={{
                    width: qrScanAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0%", "100%"],
                    }),
                  }}
                />
              </View>
              <Text className="mt-2 text-sm text-gray-500 font-JakartaRegular">
                Vui lòng không tắt ứng dụng...
              </Text>
            </>
          )}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default QRPaymentModal;
