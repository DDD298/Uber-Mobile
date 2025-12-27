import { Image, View } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useTranslation } from "react-i18next";

import { icons } from "@/constants";
import { GoogleInputProps } from "@/types/type";

const googlePlacesApiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY!;

const GoogleTextInput = ({
  icon,
  initialLocation,
  containerStyle,
  textInputBackgroundColor,
  handlePress,
}: GoogleInputProps) => {
  const { t } = useTranslation();

  return (
    <View
      className={`flex relative z-50 flex-row justify-center items-center rounded-xl border-0 bg-neutral-100 ${containerStyle}`}
    >
      <GooglePlacesAutocomplete
        fetchDetails={true}
        placeholder={t("home.whereTo")}
        enablePoweredByContainer={false}
        debounce={200}
        styles={{
          textInputContainer: {
            alignItems: "center",
            justifyContent: "center",
            marginHorizontal: 10,
            backgroundColor: "transparent",
            borderTopWidth: 0,
            borderBottomWidth: 0,
            borderLeftWidth: 0,
            borderRightWidth: 0,
          },
          textInput: {
            backgroundColor: textInputBackgroundColor
              ? textInputBackgroundColor
              : "transparent",
            fontSize: 16,
            fontWeight: "600",
            marginTop: 5,
            width: "100%",
            borderTopWidth: 0,
            borderBottomWidth: 0,
            borderLeftWidth: 0,
            borderRightWidth: 0,
          },
          listView: {
            backgroundColor: textInputBackgroundColor
              ? textInputBackgroundColor
              : "transparent",
            position: "relative",
            top: 0,
            width: "100%",
            shadowColor: "transparent",
            zIndex: 100,
          },
        }}
        onPress={(data, details = null) => {
          handlePress({
            latitude: details?.geometry.location.lat!,
            longitude: details?.geometry.location.lng!,
            address: data.description,
          });
        }}
        query={{
          key: googlePlacesApiKey,
          language: "vi",
          components: "country:vn",
        }}
        renderLeftButton={() => (
          <View className="justify-center items-center w-6 h-6">
            <Image
              source={icon ? icon : icons.search}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </View>
        )}
        textInputProps={{
          placeholderTextColor: "gray",
          placeholder: initialLocation ?? t("home.whereTo"),
          numberOfLines: 1,
        }}
      />
    </View>
  );
};

export default GoogleTextInput;
