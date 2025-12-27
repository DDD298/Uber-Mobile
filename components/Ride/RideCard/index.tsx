import { icons } from "@/constants";
import { canCancelRide } from "@/lib/ride-booking";
import { formatDateVN, formatTimeVN } from "@/lib/utils";
import { Ride } from "@/types/type";
import { Ionicons } from '@expo/vector-icons';
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";

interface RideCardProps {
   ride: Ride;
   onCancel?: () => void;
}

const RideCard = ({ ride, onCancel }: RideCardProps) => {
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
         "Hủy chuyến đi",
         "Bạn có chắc chắn muốn hủy chuyến này?",
         [
            {
               text: "Không",
               style: "cancel"
            },
            {
               text: "Có",
               style: "destructive",
               onPress: onCancel
            }
         ]
      );
   };

   const getRideStatusInfo = (status: string | undefined) => {
      if (!status) {
         return {
            text: 'Chưa xác định',
            color: 'text-gray-500',
            bgColor: 'bg-gray-50',
            icon: 'help-circle' as const,
            iconColor: '#6B7280'
         };
      }

      switch (status) {
         case 'confirmed':
            return {
               text: 'Tài xế đã nhận chuyến',
               color: 'text-blue-500',
               bgColor: 'bg-blue-50',
               icon: 'checkmark-circle' as const,
               iconColor: '#3B82F6'
            };
         case 'driver_arrived':
            return {
               text: 'Tài xế đã đến',
               color: 'text-orange-500',
               bgColor: 'bg-orange-50',
               icon: 'car' as const,
               iconColor: '#F97316'
            };
         case 'in_progress':
            return {
               text: 'Đang trong chuyến',
               color: 'text-purple-500',
               bgColor: 'bg-purple-50',
               icon: 'play-circle' as const,
               iconColor: '#8B5CF6'
            };
         case 'completed':
            return {
               text: 'Hoàn thành',
               color: 'text-green-500',
               bgColor: 'bg-green-50',
               icon: 'checkmark-done-circle' as const,
               iconColor: '#10B981'
            };
         case 'cancelled':
            return {
               text: 'Đã hủy',
               color: 'text-red-500',
               bgColor: 'bg-red-50',
               icon: 'close-circle' as const,
               iconColor: '#EF4444'
            };
         case 'no_show':
            return {
               text: 'Khách không xuất hiện',
               color: 'text-gray-500',
               bgColor: 'bg-gray-50',
               icon: 'person-remove' as const,
               iconColor: '#6B7280'
            };
         default:
            return {
               text: status,
               color: 'text-gray-500',
               bgColor: 'bg-gray-50',
               icon: 'help-circle' as const,
               iconColor: '#6B7280'
            };
      }
   };

   const getPaymentStatusInfo = (status: string) => {
      switch (status) {
         case 'paid':
            return { text: 'Đã thanh toán', color: 'text-green-500' };
         case 'refunded':
            return { text: 'Đã hoàn tiền', color: 'text-blue-500' };
         case 'pending':
            return { text: 'Chờ thanh toán', color: 'text-yellow-500' };
         default:
            return { text: status, color: 'text-gray-500' };
      }
   };

   const checkCanCancelRide = () => {
      return canCancelRide(ride);
   };

   return (
      <View className="flex flex-row justify-center items-center mb-3 bg-white rounded-lg shadow-sm shadow-neutral-300">
         <View className="flex flex-col justify-center items-center p-3">
            <View className="flex flex-row justify-center items-center">
               <Image
                  source={{
                     uri: `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=600&height=400&center=lonlat:${destination_longitude},${destination_latitude}&zoom=14&apiKey=${process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY}`,
                  }}
                  className="w-[80px] h-[90px] rounded-lg"
               />
               <View className="flex flex-col flex-1 gap-y-5 mx-5">
                  <View className="flex flex-row gap-x-2 item-center">
                     <Image source={icons.to} className="w-5 h-5" />
                     <Text className="text-md font-JakartaMedium" numberOfLines={1}>{origin_address}</Text>
                  </View>

                  <View className="flex flex-row gap-x-2 item-center">
                     <Image source={icons.point} className="w-5 h-5" />
                     <Text className="text-md font-JakartaMedium" numberOfLines={1}>{destination_address}</Text>
                  </View>
               </View>
            </View>

            <View className="flex flex-col justify-center items-start p-4 mt-4 w-full rounded-lg bg-general-500">
               <View className="flex flex-row justify-between items-center mb-5 w-full">
                  <Text className="text-gray-500 text-md font-JakartaMedium">
                     Thời gian:
                  </Text>
                  <Text className="text-gray-500 text-md font-JakartaMedium">
                     {formatDateVN(created_at)} - {formatTimeVN(ride_time)}
                  </Text>
               </View>

               <View className="flex flex-row justify-between items-center mb-5 w-full">
                  <Text className="text-gray-500 text-md font-JakartaMedium">
                     Tài xế:
                  </Text>
                  <Text className="text-gray-500 text-md font-JakartaMedium">
                     {driver.first_name} {driver.last_name}
                  </Text>
               </View>

               <View className="flex flex-row justify-between items-center mb-5 w-full">
                  <Text className="text-gray-500 text-md font-JakartaMedium">
                     Chỗ ngồi:
                  </Text>
                  <Text className="text-gray-500 text-md font-JakartaMedium">
                     {driver.car_seats} chỗ
                  </Text>
               </View>

               <View className="flex flex-row justify-between items-center mb-5 w-full">
                  <Text className="text-gray-500 text-md font-JakartaMedium">
                     Giá tiền:
                  </Text>
                  <Text className="text-green-600 text-md font-JakartaMedium">
                     {Number(fare_price).toLocaleString('vi-VN')} VNĐ
                  </Text>
               </View>

               {/* Trạng thái chuyến */}
               <View className="flex flex-row justify-between items-center mb-3 w-full">
                  <Text className="text-gray-500 text-md font-JakartaMedium">
                     Trạng thái chuyến:
                  </Text>
                  <View
                     className={`flex flex-row items-center px-4 py-1 rounded-full ${getRideStatusInfo(ride_status).bgColor} border`}
                     style={{ borderColor: getRideStatusInfo(ride_status).iconColor }}
                  >
                     <Ionicons
                        name={getRideStatusInfo(ride_status).icon}
                        size={16}
                        color={getRideStatusInfo(ride_status).iconColor}
                        style={{ marginRight: 4 }}
                     />
                     <Text className={`text-sm font-JakartaMedium ${getRideStatusInfo(ride_status).color}`}>
                        {getRideStatusInfo(ride_status).text}
                     </Text>
                  </View>
               </View>

               {/* Trạng thái thanh toán */}
               <View className="flex flex-row justify-between items-center mb-5 w-full">
                  <Text className="text-gray-500 text-md font-JakartaMedium">
                     Thanh toán:
                  </Text>
                  <Text className={`text-md font-JakartaMedium ${getPaymentStatusInfo(payment_status).color}`}>
                     {getPaymentStatusInfo(payment_status).text}
                  </Text>
               </View>

               {/* Hiển thị thông tin hủy chuyến */}
               {(ride_status === 'cancelled' || ride_status === 'no_show') && cancelled_at && (
                  <View className="flex flex-row justify-between items-center mb-3 w-full">
                     <Text className="text-gray-500 text-md font-JakartaMedium">
                        Hủy lúc:
                     </Text>
                     <Text className="text-gray-500 text-md font-JakartaMedium">
                        {formatDateVN(cancelled_at)}
                     </Text>
                  </View>
               )}

               {(ride_status === 'cancelled' || ride_status === 'no_show') && cancel_reason && (
                  <View className="flex flex-row justify-between items-center mb-5 w-full">
                     <Text className="text-gray-500 text-md font-JakartaMedium">
                        Lý do:
                     </Text>
                     <Text className="text-gray-500 text-md font-JakartaMedium">
                        {cancel_reason}
                     </Text>
                  </View>
               )}

               {/* Nút hủy chuyến - chỉ hiển thị khi có thể hủy */}
               {checkCanCancelRide().canCancel && onCancel && (
                  <TouchableOpacity
                     onPress={handleCancel}
                     className="flex-row justify-center items-center py-4 mt-2 w-full bg-red-500 rounded-lg"
                  >
                     <Ionicons
                        name="close-circle"
                        size={20}
                        color="white"
                        style={{ marginRight: 8 }}
                     />
                     <Text className="text-center text-white font-JakartaMedium">
                        Hủy chuyến
                     </Text>
                  </TouchableOpacity>
               )}

               {/* Hiển thị lý do không thể hủy */}
               {!checkCanCancelRide().canCancel && checkCanCancelRide().reason && (
                  <View className="py-4 mt-2 w-full bg-gray-100 rounded-lg">
                     <Text className="text-center text-gray-600 font-JakartaMedium">
                        {checkCanCancelRide().reason}
                     </Text>
                  </View>
               )}

               {ride_status === 'in_progress' && (
                  <View className="py-4 mt-2 w-full bg-gray-100 rounded-lg">
                     <Text className="text-center text-gray-600 font-JakartaMedium">
                        chuyến đang diễn ra - Không thể hủy
                     </Text>
                  </View>
               )}

               {ride_status === 'completed' && (
                  <View className="py-4 mt-2 w-full bg-green-100 rounded-lg">
                     <Text className="text-center text-green-600 font-JakartaMedium">
                        Chuyến đã hoàn thành
                     </Text>
                  </View>
               )}
            </View>
         </View>
      </View>
   );
};

export default RideCard;