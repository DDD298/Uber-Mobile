import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { StarRating } from "../Common/StarRating";
import { useUser } from "@clerk/clerk-expo";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import CustomButton from "../Common/CustomButton";
import { useTranslation } from "react-i18next";
import { fetchAPI } from "@/lib/fetch";
import CustomAlert from "../Common/CustomAlert";
import { useCustomAlert } from "@/hooks/useCustomAlert";

interface RatingModalProps {
  visible: boolean;
  onClose: () => void;
  ride: {
    ride_id: number;
    driver_id: number;
    driver: {
      first_name: string;
      last_name: string;
      profile_image_url?: string;
    };
  };
  onRatingSubmitted?: () => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  visible,
  onClose,
  ride,
  onRatingSubmitted,
}) => {
  const { t } = useTranslation();
  const { user } = useUser();
  const {
    alertConfig,
    visible: alertVisible,
    hideAlert,
    showSuccess,
    showError,
  } = useCustomAlert();
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // Control BottomSheetModal based on visible prop
  useEffect(() => {
    if (visible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [visible]);

  // Backdrop component with black overlay
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        pressBehavior="close"
      />
    ),
    []
  );

  const handleSubmit = async () => {
    console.log("=== RATING SUBMISSION DEBUG START ===");
    console.log("1. User check:", { hasUser: !!user, userId: user?.id });

    if (!user) {
      console.log("ERROR: No user found");
      showError(t("common.error"), t("rating.pleaseLogin"));
      return;
    }

    const apiEndpoint = "/(api)/rating/create";
    const requestPayload = {
      ride_id: ride.ride_id,
      user_id: user.id,
      driver_id: ride.driver_id,
      stars,
      comment: comment.trim() || null,
    };

    console.log("2. API Endpoint:", apiEndpoint);
    console.log("3. Request payload:", JSON.stringify(requestPayload, null, 2));

    setLoading(true);
    try {
      console.log("4. Sending fetchAPI request...");
      const data = await fetchAPI(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
      });

      console.log("5. Response data:", JSON.stringify(data, null, 2));

      if (data.success) {
        console.log("6. SUCCESS: Rating submitted successfully");
        showSuccess(t("common.success"), t("rating.thankYou"), () => {
          onClose();
          onRatingSubmitted?.();
        });
      } else {
        console.log("7. ERROR: Response not successful", {
          success: data.success,
          error: data.error,
        });
        showError(t("common.error"), data.error || t("rating.cannotSubmit"));
      }
    } catch (error) {
      const err = error as Error;
      console.log("8. CATCH ERROR:", {
        errorType: err?.constructor?.name,
        errorMessage: err?.message,
        errorStack: err?.stack,
        fullError: JSON.stringify(err, Object.getOwnPropertyNames(err)),
      });
      console.error("Error submitting rating:", error);
      showError(
        t("common.error"),
        `${t("rating.submitError")}\n\nDebug: ${err?.message || "Unknown error"}`
      );
    } finally {
      setLoading(false);
      console.log("=== RATING SUBMISSION DEBUG END ===");
    }
  };

  const handleClose = () => {
    if (!loading) {
      setStars(5);
      setComment("");
      onClose();
    }
  };

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      snapPoints={["75%", "90%"]}
      enablePanDownToClose
      onDismiss={handleClose}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{
        backgroundColor: "#D1D5DB",
        width: 40,
        height: 4,
      }}
    >
      <BottomSheetView className="flex-1 px-4 pb-10">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-JakartaBold text-gray-800">
            {t("rating.rateYourRide")}
          </Text>
        </View>

        {/* Driver Info */}
        <View className="items-center mb-4">
          <Image
            source={{
              uri:
                ride.driver.profile_image_url ||
                "https://via.placeholder.com/80",
            }}
            className="w-20 h-20 rounded-full mb-3 bg-gray-200"
          />
          <Text className="text-xl font-JakartaBold text-gray-800 mb-1">
            {ride.driver.first_name} {ride.driver.last_name}
          </Text>
          <Text className="text-base font-JakartaMedium text-gray-500">
            {t("rating.howWasYourTrip")}
          </Text>
        </View>

        {/* Star Rating */}
        <View className="items-center mb-4 py-4">
          <StarRating
            rating={stars}
            onRatingChange={setStars}
            size={48}
            color="#FFD700"
          />
        </View>

        {/* Comment Input */}
        <View className="mb-4">
          <Text className="text-base font-JakartaBold text-gray-700 mb-2">
            {t("rating.leaveComment")}
          </Text>
          <TextInput
            className="border border-gray-300 rounded-xl p-4 text-base font-Jakarta text-gray-800 min-h-[100px]"
            placeholder={t("rating.shareExperience")}
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            value={comment}
            onChangeText={setComment}
            maxLength={500}
            editable={!loading}
            style={{ textAlignVertical: "top" }}
          />
          <Text className="text-xs font-JakartaMedium text-gray-400 text-right mt-1">
            {comment.length}/500 {t("rating.characterLimit")}
          </Text>
        </View>

        <CustomButton
          title={t("rating.submitRating")}
          onPress={handleSubmit}
          disabled={loading}
        />
      </BottomSheetView>

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
    </BottomSheetModal>
  );
};
