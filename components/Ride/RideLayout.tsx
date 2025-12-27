import Map from '@/components/Common/Map';
import { icons } from '@/constants';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import { useRef } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const RideLayout = ({ title, children, snapPoints }: {
  title: string;
  children: React.ReactNode
  snapPoints?: string[]
}) => {

  const bottomSheetRef = useRef<BottomSheet>(null);

  return (
    <GestureHandlerRootView>
      <View className="flex-1 bg-white">
        <View className="flex flex-col h-screen bg-green-500">
          <View className="flex absolute top-16 z-10 flex-row justify-start items-center px-4">
            <TouchableOpacity onPress={() => router.back()}>
              <View className='justify-center items-center w-10 h-10 bg-white rounded-full'>
                <Image
                  source={icons.backArrow}
                  resizeMode='contain'
                  className='w-6 h-6'
                />
              </View>
            </TouchableOpacity>
            <Text className='ml-5 text-xl font-JakartaSemiBold'>{title || "Quay lại"}</Text>
          </View>
          <Map />
        </View>

        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints || ["40%", "85%"]}
          index={0}
        >
          <BottomSheetView style={{ flex: 1, padding: 20 }}>
            {children}
          </BottomSheetView>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  )
}

export default RideLayout;