import Map from "@/components/Common/Map";
import PageHeader from "@/components/Common/PageHeader";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useRef, useMemo } from "react";
import { View } from "react-native";

const RideLayout = ({
  title,
  children,
  snapPoints,
  scrollable = true,
}: {
  title?: string;
  children: React.ReactNode;
  snapPoints?: string[];
  scrollable?: boolean;
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const defaultSnapPoints = useMemo(
    () => snapPoints || ["40%", "85%"],
    [snapPoints]
  );

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 bg-green-500">
        {title && <PageHeader title={title} />}
        <Map />
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={defaultSnapPoints}
        index={0}
        enablePanDownToClose={false}
        enableOverDrag={false}
        animateOnMount={true}
        keyboardBehavior="interactive"
      >
        {scrollable ? (
          <BottomSheetScrollView
            style={{ flex: 1, padding: 16 }}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </BottomSheetScrollView>
        ) : (
          <BottomSheetView style={{ flex: 1, padding: 16 }}>
            {children}
          </BottomSheetView>
        )}
      </BottomSheet>
    </View>
  );
};

export default RideLayout;
