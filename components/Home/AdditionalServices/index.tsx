import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';

export default function AdditionalServices() {
  return (
    <View className='mb-4'>
      <Text className='mb-4 text-xl text-white font-JakartaBold'>Dịch vụ khác</Text>
      <View className='flex-row justify-between'>
        <TouchableOpacity className='flex-1 p-4 mr-2 rounded-xl shadow-sm bg-white/20'>
          <View className='items-center'>
            <FontAwesome5 name="motorcycle" size={32} color="#00FF8890" />
            <Text className='text-sm font-bold text-center text-white font-JakartaMedium'>Xe máy</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity className='flex-1 p-4 mx-1 rounded-xl shadow-sm bg-white/20'>
          <View className='items-center'>
            <Ionicons name="car-sport" size={32} color="#00FF8890" />
            <Text className='text-sm font-bold text-center text-white font-JakartaMedium'>Xe cao cấp</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity className='flex-1 p-4 ml-2 rounded-xl shadow-sm bg-white/20'>
          <View className='items-center'>
            <MaterialIcons name="local-shipping" size={32} color="#00FF8890" />
            <Text className='text-sm font-bold text-center text-white font-JakartaMedium'>Giao hàng</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
