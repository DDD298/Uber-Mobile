import { icons } from "@/constants";
import { canCancelRide } from "@/lib/ride-booking";
import { formatDateVN, formatTimeVN } from "@/lib/utils";
import { formatCurrencyByLanguage } from "@/lib/currency";
import { Ride } from "@/types/type";
import { Ionicons } from "@expo/vector-icons";
import { Alert, Image, Text, View, ActivityIndicator } from "react-native";
import { useTranslation } from "react-i18next";
import { RatingModal } from "@/components/Ride/RatingModal";
import { useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { fetchAPI } from "@/lib/fetch";
import CustomButton from "@/components/Common/CustomButton";

interface RideCardProps {
  ride: Ride;
  onCancel?: () => void;
  onRatingSubmitted?: () => void;
  onStatusUpdated?: () => void;
}

const RideCard = ({
  ride,
  onCancel,
  onRatingSubmitted,
  onStatusUpdated,
}: RideCardProps) => {
  const { t, i18n } = useTranslation();
  const { userId } = useAuth();
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const {
    ride_id,
    destination_longitude,
    destination_latitude,
    destination_address,
    origin_address,
    created_at,
    ride_time,
    driver,
    passenger,
    payment_status,
    ride_status,
    fare_price,
    cancelled_at,
    cancel_reason,
  } = ride;

  const isDriverView =
    ride.driver?.driver_id !== undefined && ride.passenger_id !== userId;

  const handleCancel = () => {
    Alert.alert(
      t("ride.cancelRide"),
      t("ride.confirmCancel") || "Bạn có chắc chắn muốn hủy chuyến này?",
      [
        {
          text: t("common.cancel") || "Hủy",
          style: "cancel",
        },
        {
          text: t("common.confirm") || "Xác nhận",
          onPress: onCancel,
          style: "destructive",
        },
      ]
    );
  };

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      setUpdatingStatus(true);
      const response = await fetchAPI("/(api)/ride/update-status", {
        method: "POST",
        body: JSON.stringify({
          ride_id,
          new_status: newStatus,
          changed_by: isDriverView ? "driver" : "passenger",
          changed_by_id: userId,
        }),
      });

      if (response.success) {
        onStatusUpdated?.();
      } else {
        Alert.alert(
          t("common.error"),
          response.error || "Không thể cập nhật trạng thái"
        );
      }
    } catch (error: any) {
      Alert.alert(t("common.error"), error.message || "Lỗi hệ thống");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getRideStatusInfo = (status: string | undefined) => {
    if (!status) {
      return {
        text: t("ride.statusUnknown").toUpperCase() || "CHƯA XÁC ĐỊNH",
        color: "#6B7280",
        bgColor: "#F3F4F6",
        icon: "help-circle" as const,
      };
    }

    switch (status) {
      case "pending":
        return {
          text: "CHỜ XÁC NHẬN",
          color: "#F59E0B",
          bgColor: "#FEF3C7",
          icon: "time" as const,
        };
      case "confirmed":
        return {
          text: t("ride.statusConfirmed").toUpperCase() || "ĐÃ XÁC NHẬN",
          color: "#3B82F6",
          bgColor: "#DBEAFE",
          icon: "checkmark-circle" as const,
        };
      case "driver_arrived":
        return {
          text: t("ride.statusDriverArrived").toUpperCase() || "TÀI XẾ ĐÃ ĐẾN",
          color: "#F97316",
          bgColor: "#FFEDD5",
          icon: "car" as const,
        };
      case "in_progress":
        return {
          text: t("ride.inProgress").toUpperCase(),
          color: "#8B5CF6",
          bgColor: "#EDE9FE",
          icon: "play-circle" as const,
        };
      case "completed":
        return {
          text: t("ride.completed").toUpperCase(),
          color: "#10B981",
          bgColor: "#D1FAE5",
          icon: "checkmark-done-circle" as const,
        };
      case "cancelled":
        return {
          text: t("ride.cancelled").toUpperCase(),
          color: "#EF4444",
          bgColor: "#FEE2E2",
          icon: "close-circle" as const,
        };
      case "no_show":
        return {
          text: t("ride.statusNoShow").toUpperCase() || "KHÔNG XUẤT HIỆN",
          color: "#6B7280",
          bgColor: "#F3F4F6",
          icon: "person-remove" as const,
        };
      default:
        return {
          text: status.toUpperCase(),
          color: "#6B7280",
          bgColor: "#F3F4F6",
          icon: "help-circle" as const,
        };
    }
  };

  const statusInfo = getRideStatusInfo(ride_status);
  const checkCanCancelRide = () => {
    return canCancelRide(ride);
  };

  return (
    <View className="mb-4 bg-white rounded-[24px] border border-gray-200 shadow-neutral-300 overflow-hidden">
      {/* Header with Status Badge and Time */}
      <View className="flex-row justify-between items-center px-4 pt-4 pb-3">
        <View
          className="flex-row items-center px-3 py-1.5 rounded-full"
          style={{ backgroundColor: statusInfo.bgColor }}
        >
          <Ionicons
            name={statusInfo.icon}
            size={14}
            color={statusInfo.color}
            style={{ marginRight: 4 }}
          />
          <Text
            className="text-sm font-JakartaBold"
            style={{ color: statusInfo.color }}
          >
            {statusInfo.text}
          </Text>
        </View>
        <Text className="text-sm text-gray-500 font-JakartaMedium">
          {formatDateVN(created_at)}, {formatTimeVN(ride_time)}
        </Text>
      </View>

      {/* Main Content */}
      <View className="px-4 pb-4">
        {/* Map and Locations */}
        <View className="flex-row mb-4">
          <Image
            source={{
              uri: `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=200&height=200&center=lonlat:${destination_longitude},${destination_latitude}&zoom=14&apiKey=${process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY}`,
            }}
            className="w-28 h-28 rounded-xl"
          />

          <View className="flex-1 ml-4 justify-center">
            {/* Origin */}
            <View className="flex-row items-start mb-2">
              <Image source={icons.to} className="w-5 h-5 mr-2" />
              <View className="flex-1">
                <Text
                  className="text-base font-JakartaBold text-gray-900"
                  numberOfLines={1}
                >
                  {origin_address.split(",")[0]}
                </Text>
                <Text
                  className="text-sm text-gray-500 font-JakartaMedium"
                  numberOfLines={1}
                >
                  {origin_address.split(",").slice(1).join(",")}
                </Text>
              </View>
            </View>

            {/* Destination */}
            <View className="flex-row items-start">
              <Image source={icons.point} className="w-6 h-6 mr-2 -ml-1" />
              <View className="flex-1">
                <Text
                  className="text-base font-JakartaBold text-gray-900"
                  numberOfLines={1}
                >
                  {destination_address.split(",")[0]}
                </Text>
                <Text
                  className="text-sm text-gray-500 font-JakartaMedium"
                  numberOfLines={1}
                >
                  {destination_address.split(",").slice(1).join(",")}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* User Info (Driver or Passenger) and Price */}
        <View className="flex-row justify-between items-center py-3 border-t border-gray-100">
          <View className="flex-row items-center flex-1">
            {isDriverView ? (
              <Image
                source={{
                  uri: `https://api.dicebear.com/7.x/avataaars/png?seed=${passenger?.name || "passenger"}`,
                }}
                className="w-10 h-10 rounded-full mr-3 border border-gray-200"
              />
            ) : (
              <Image
                source={{
                  uri:
                    driver.profile_image_url ||
                    "https://via.placeholder.com/40",
                }}
                className="w-10 h-10 rounded-full mr-3 border border-gray-200"
              />
            )}
            <View className="flex-1">
              <Text className="text-sm font-JakartaBold text-gray-900">
                {isDriverView
                  ? "Khách: " + passenger?.name || t("ride.passenger")
                  : "Tài xế: " + `${driver.first_name} ${driver.last_name}`}
              </Text>
              {!isDriverView ? (
                <View className="flex-col items-start">
                  <Text className="text-sm text-gray-500 font-JakartaMedium mr-2">
                    {driver.car_seats} {t("booking.seats")}
                  </Text>
                  <Text className="text-sm text-gray-500 font-JakartaMedium mr-2">
                    Loại xe: {driver.vehicle_type || "Car"}
                  </Text>
                </View>
              ) : (
                ""
              )}
            </View>
          </View>

          <View className="items-end">
            <Text className="text-2xl font-JakartaBold text-green-600">
              {formatCurrencyByLanguage(fare_price, i18n.language)}
            </Text>
            {payment_status === "paid" && (
              <View className="flex-row items-center mt-0.5">
                <Text className="text-sm text-green-600 font-JakartaMedium mr-1">
                  {t("payment.paymentSuccessful")}
                </Text>
                <Ionicons name="checkmark-circle" size={12} color="#10B981" />
              </View>
            )}
            {payment_status === "pending" && (
              <Text className="text-sm text-yellow-600 font-JakartaMedium mt-0.5">
                {t("payment.pending") || "Chờ thanh toán"}
              </Text>
            )}
            {payment_status === "refunded" && (
              <Text className="text-sm text-blue-600 font-JakartaMedium mt-0.5">
                {t("payment.refunded") || "Đã hoàn tiền"}
              </Text>
            )}
          </View>
        </View>

        {/* Additional Info for Cancelled Rides */}
        {(ride_status === "cancelled" || ride_status === "no_show") && (
          <View className="mt-4 p-4 bg-red-50 rounded-xl">
            {cancelled_at && (
              <Text className="text-sm text-gray-600 font-JakartaMedium mb-1">
                {t("ride.cancelledAt") || "Hủy lúc"}:{" "}
                {formatDateVN(cancelled_at)}
              </Text>
            )}
            {cancel_reason && (
              <Text className="text-sm text-red-600 font-JakartaMedium">
                {t("ride.cancelReason") || "Lý do"}: {cancel_reason}
              </Text>
            )}
          </View>
        )}

        {/* Driver Action Buttons */}
        {isDriverView && !updatingStatus && (
          <View className="mt-4 gap-y-2">
            {/* Giai đoạn 0: pending - Chờ xác nhận */}
            {ride_status === "pending" && (
              <>
                <CustomButton
                  title="Xác nhận chuyến"
                  onPress={() => handleUpdateStatus("confirmed")}
                  bgVariant="success"
                  IconLeft={() => (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color="white"
                      style={{ marginRight: 8 }}
                    />
                  )}
                />
                <CustomButton
                  title="Không nhận chuyến này"
                  onPress={() => {
                    Alert.alert(
                      "Không nhận chuyến",
                      "Bạn có chắc chắn không nhận chuyến này?",
                      [
                        { text: t("common.cancel"), style: "cancel" },
                        {
                          text: t("common.confirm"),
                          onPress: () => handleUpdateStatus("cancelled"),
                        },
                      ]
                    );
                  }}
                  bgVariant="red"
                  textVariant="red"
                  IconLeft={() => (
                    <Ionicons
                      name="close-circle"
                      size={20}
                      color="#DC2626"
                      style={{ marginRight: 8 }}
                    />
                  )}
                />
              </>
            )}

            {/* Giai đoạn 1: confirmed - Đã xác nhận */}
            {ride_status === "confirmed" && (
              <>
                <CustomButton
                  title={t("ride.driverArrived") || "Đã đến điểm đón"}
                  onPress={() => handleUpdateStatus("driver_arrived")}
                  bgVariant="success"
                  IconLeft={() => (
                    <Ionicons
                      name="location"
                      size={20}
                      color="white"
                      style={{ marginRight: 8 }}
                    />
                  )}
                />
                <CustomButton
                  title="Khách không xuất hiện"
                  onPress={() => handleUpdateStatus("no_show")}
                  bgVariant="outline"
                  textVariant="primary"
                  IconLeft={() => (
                    <Ionicons
                      name="person-remove"
                      size={20}
                      color="#22c55e"
                      style={{ marginRight: 8 }}
                    />
                  )}
                />
              </>
            )}

            {/* Giai đoạn 2: driver_arrived - Tài xế đã đến */}
            {ride_status === "driver_arrived" && (
              <CustomButton
                title={t("ride.startRide") || "Bắt đầu chuyến đi"}
                onPress={() => handleUpdateStatus("in_progress")}
                bgVariant="success"
                IconLeft={() => (
                  <Ionicons
                    name="play-circle"
                    size={20}
                    color="white"
                    style={{ marginRight: 8 }}
                  />
                )}
              />
            )}

            {/* Giai đoạn 3: in_progress - Đang trong chuyến */}
            {ride_status === "in_progress" && (
              <CustomButton
                title={t("ride.completeRide") || "Hoàn thành chuyến đi"}
                onPress={() => handleUpdateStatus("completed")}
                bgVariant="success"
                IconLeft={() => (
                  <Ionicons
                    name="checkmark-done-circle"
                    size={20}
                    color="white"
                    style={{ marginRight: 8 }}
                  />
                )}
              />
            )}
          </View>
        )}

        {updatingStatus && (
          <View className="mt-4 py-4 items-center">
            <ActivityIndicator color="#06b6d4" />
          </View>
        )}

        {!isDriverView && (
          <>
            {onCancel &&
            (ride_status === "pending" || checkCanCancelRide().canCancel) ? (
              <CustomButton
                title={t("ride.cancelRide")}
                onPress={handleCancel}
                bgVariant="red"
                textVariant="red"
                IconLeft={() => (
                  <Ionicons
                    name="close-circle-outline"
                    size={20}
                    color="#DC2626"
                    style={{ marginRight: 8 }}
                  />
                )}
                className="mt-4"
              />
            ) : (
              ""
            )}

            {/* Giai đoạn 3: in_progress - Hiển thị thông báo đang di chuyển */}
            {ride_status === "in_progress" && (
              <View className="mt-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
                <View className="flex-row items-center justify-center">
                  <Ionicons name="time-outline" size={16} color="#8B5CF6" />
                  <Text className="text-sm text-purple-700 font-JakartaMedium ml-2">
                    {t("ride.inProgress")} -{" "}
                    {t("ride.arrivingAtDestination") ||
                      "Đang di chuyển đến điểm đến"}
                  </Text>
                </View>
              </View>
            )}
          </>
        )}

        {/* Rating Section (Only for Passenger) */}
        {!isDriverView && ride_status === "completed" && (
          <>
            {ride.rating ? (
              // Show submitted rating
              <View className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-base font-JakartaBold text-gray-800">
                    {t("rating.yourRating")}
                  </Text>
                  <View className="flex-row items-center">
                    {[...Array(5)].map((_, index) => (
                      <Ionicons
                        key={index}
                        name={
                          index < ride.rating!.stars ? "star" : "star-outline"
                        }
                        size={20}
                        color={
                          index < ride.rating!.stars ? "#F59E0B" : "#D1D5DB"
                        }
                      />
                    ))}
                    <Text className="ml-2 text-sm font-JakartaBold text-gray-700">
                      ({ride.rating.stars}/5)
                    </Text>
                  </View>
                </View>
                {ride.rating.comment && (
                  <Text className="text-sm font-JakartaMedium text-gray-600 italic mt-2">
                    "{ride.rating.comment}"
                  </Text>
                )}
                <Text className="text-sm font-Jakarta text-gray-400 mt-2">
                  {formatDateVN(ride.rating.created_at)} •{" "}
                  {formatTimeVN(new Date(ride.rating.created_at).getTime())}
                </Text>
              </View>
            ) : (
              // Show rating button
              <CustomButton
                title={t("ride.rateDriver") || "Đánh giá tài xế"}
                onPress={() => setShowRatingModal(true)}
                bgVariant="amber"
                textVariant="amber"
                IconLeft={() => (
                  <Ionicons
                    name="star"
                    size={20}
                    color="#D97706"
                    style={{ marginRight: 8 }}
                  />
                )}
                className="mt-4"
              />
            )}
          </>
        )}
      </View>

      {/* Rating Modal - Always render for completed rides for passenger */}
      {!isDriverView && ride_status === "completed" && (
        <RatingModal
          visible={showRatingModal}
          onClose={() => {
            setShowRatingModal(false);
          }}
          ride={{
            ride_id: Number(ride.ride_id) || 0,
            driver_id: Number(driver.driver_id || ride.driver_id) || 0,
            fare_price: fare_price,
            driver: {
              first_name: driver.first_name,
              last_name: driver.last_name,
              profile_image_url: driver.profile_image_url,
            },
          }}
          onRatingSubmitted={() => {
            setShowRatingModal(false);
            onRatingSubmitted?.();
          }}
        />
      )}
    </View>
  );
};

export default RideCard;
