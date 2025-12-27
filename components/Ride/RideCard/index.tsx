import { icons } from "@/constants";
import { canCancelRide } from "@/lib/ride-booking";
import { formatDateVN, formatTimeVN } from "@/lib/utils";
import { Ride } from "@/types/type";
import { Ionicons } from "@expo/vector-icons";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";

interface RideCardProps {
  ride: Ride;
  onCancel?: () => void;
}

const RideCard = ({ ride, onCancel }: RideCardProps) => {
  const { t } = useTranslation();
  const {
    destination_longitude,
    destination_latitude,
    destination_address,
    origin_address,
    created_at,
    ride_time,
    driver,
    payment_status,
    ride_status,
    fare_price,
    cancelled_at,
    cancel_reason,
  } = ride;

  const handleCancel = () => {
    Alert.alert(
      t("ride.cancelRide"),
      t("ride.confirmCancel") || "Bạn có chắc chắn muốn hủy chuyến này?",
      [
        {
          text: t("common.cancel"),
          style: "cancel",
        },
        {
          text: t("common.confirm"),
          style: "destructive",
          onPress: onCancel,
        },
      ]
    );
  };

  const getRideStatusInfo = (status: string | undefined) => {
    if (!status) {
      return {
        text: t("ride.statusUnknown") || "CHƯA XÁC ĐỊNH",
        color: "#6B7280",
        bgColor: "#F3F4F6",
        icon: "help-circle" as const,
      };
    }

    switch (status) {
      case "confirmed":
        return {
          text: t("ride.statusConfirmed") || "ĐÃ XÁC NHẬN",
          color: "#3B82F6",
          bgColor: "#DBEAFE",
          icon: "checkmark-circle" as const,
        };
      case "driver_arrived":
        return {
          text: t("ride.statusDriverArrived") || "TÀI XẾ ĐÃ ĐẾN",
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
          text: t("ride.statusNoShow") || "KHÔNG XUẤT HIỆN",
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
            className="text-xs font-JakartaBold"
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
                  className="text-xs text-gray-500 font-JakartaMedium"
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
                  className="text-xs text-gray-500 font-JakartaMedium"
                  numberOfLines={1}
                >
                  {destination_address.split(",").slice(1).join(",")}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Driver Info and Price */}
        <View className="flex-row justify-between items-center py-3 border-t border-gray-100">
          <View className="flex-row items-center flex-1">
            <Image
              source={{
                uri:
                  driver.profile_image_url || "https://via.placeholder.com/40",
              }}
              className="w-10 h-10 rounded-full mr-4"
            />
            <View className="flex-1">
              <Text className="text-sm font-JakartaBold text-gray-900">
                {driver.first_name} {driver.last_name}
              </Text>
              <View className="flex-row items-center">
                <Text className="text-xs text-gray-500 font-JakartaMedium mr-2">
                  {driver.car_seats} {t("booking.seats")} •{" "}
                  {driver.vehicle_type || "Car"}
                </Text>
                <View className="flex-row items-center">
                  <Ionicons name="star" size={12} color="#FBBF24" />
                  <Text className="text-xs text-gray-600 font-JakartaMedium ml-1">
                    {driver.rating || "5.0"}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View className="items-end">
            <Text className="text-xl font-JakartaBold text-green-600">
              ${Number(fare_price).toFixed(2)}
            </Text>
            {payment_status === "paid" && (
              <View className="flex-row items-center mt-0.5">
                <Text className="text-xs text-green-600 font-JakartaMedium mr-1">
                  {t("payment.paymentSuccessful")}
                </Text>
                <Ionicons name="checkmark-circle" size={12} color="#10B981" />
              </View>
            )}
            {payment_status === "pending" && (
              <Text className="text-xs text-yellow-600 font-JakartaMedium mt-0.5">
                {t("payment.pending") || "Chờ thanh toán"}
              </Text>
            )}
            {payment_status === "refunded" && (
              <Text className="text-xs text-blue-600 font-JakartaMedium mt-0.5">
                {t("payment.refunded") || "Đã hoàn tiền"}
              </Text>
            )}
          </View>
        </View>

        {/* Additional Info for Cancelled Rides */}
        {(ride_status === "cancelled" || ride_status === "no_show") && (
          <View className="mt-4 p-3 bg-red-50 rounded-xl">
            {cancelled_at && (
              <Text className="text-xs text-gray-600 font-JakartaMedium mb-1">
                {t("ride.cancelledAt") || "Hủy lúc"}:{" "}
                {formatDateVN(cancelled_at)}
              </Text>
            )}
            {cancel_reason && (
              <Text className="text-xs text-red-600 font-JakartaMedium">
                {t("ride.cancelReason") || "Lý do"}: {cancel_reason}
              </Text>
            )}
          </View>
        )}

        {/* Action Buttons */}
        {ride_status === "in_progress" && (
          <View className="mt-4 p-3 bg-purple-50 rounded-xl border border-purple-200">
            <View className="flex-row items-center justify-center">
              <Ionicons name="time-outline" size={16} color="#8B5CF6" />
              <Text className="text-sm text-purple-700 font-JakartaMedium ml-2">
                {t("ride.inProgress")} -{" "}
                {t("ride.arriving") || "Arriving in 5 min"}
              </Text>
            </View>
          </View>
        )}

        {checkCanCancelRide().canCancel && onCancel && (
          <TouchableOpacity
            onPress={handleCancel}
            className="flex-row justify-center items-center py-3 mt-4 bg-red-50 rounded-xl border border-red-200"
          >
            <Ionicons name="close-circle-outline" size={18} color="#EF4444" />
            <Text className="text-sm text-red-600 font-JakartaBold ml-2">
              {t("ride.cancelRide")}
            </Text>
          </TouchableOpacity>
        )}

        {ride_status === "completed" && (
          <View className="mt-4 p-3 bg-green-50 rounded-xl border border-green-300">
            <Text className="text-base text-green-600 font-JakartaMedium text-center">
              {t("ride.rideCompleted") || "Chuyến đã hoàn thành"}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default RideCard;
