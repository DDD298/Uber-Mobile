import CustomButton from "@/components/Common/CustomButton";
import { images } from "@/constants";
import React from "react";
import { Animated, Image, Modal, Text } from "react-native";
interface SuccessModalProps {
  visible: boolean;
  onClose: () => void;
  onGoHome: () => void;
  fadeAnim: Animated.Value;
  scaleAnim: Animated.Value;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  visible,
  onClose,
  onGoHome,
  fadeAnim,
  scaleAnim,
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
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          opacity: fadeAnim,
        }}
      >
        <Animated.View
          className="flex flex-col justify-center items-center p-7 mx-5 w-11/12 bg-white rounded-2xl"
          style={{
            transform: [{ scale: scaleAnim }],
          }}
        >
          <Image source={images.check} className="mt-4 w-28 h-28" />

          <Text className="mt-4 text-2xl text-center font-JakartaBold">
            Đặt chuyến thành công
          </Text>

          <Text className="mt-3 text-center text-md text-general-200 font-JakartaRegular">
            Cảm ơn bạn đã đặt chuyến. Đặt chỗ của bạn đã được xác nhận thành công.
            Vui lòng tiến hành chuyến của bạn.
          </Text>

          <CustomButton
            title="Xem chuyến đã đặt"
            onPress={onGoHome}
            className="mt-4"
          />
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default SuccessModal;
