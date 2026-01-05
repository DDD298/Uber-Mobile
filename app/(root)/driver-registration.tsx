import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import * as ImagePicker from "expo-image-picker";

import CustomButton from "@/components/Common/CustomButton";
import InputField from "@/components/Common/InputField";
import { icons } from "@/constants";
import { fetchAPI } from "@/lib/fetch";

export default function DriverRegistrationScreen() {
  const { t } = useTranslation();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    phone: "",
    license_number: "",
    vehicle_type: "car",
    car_seats: "4",
    license_photo: null as string | null,
    vehicle_photo: null as string | null,
    profile_photo: null as string | null,
  });

  const vehicleTypes = [
    { value: "car", label: t("driver.car"), icon: "car-outline", seats: 4 },
    { value: "suv", label: "SUV", icon: "car-sport-outline", seats: 6 },
    {
      value: "bike",
      label: t("driver.bike"),
      icon: "bicycle-outline",
      seats: 1,
    },
  ];

  const pickImage = async (type: "license" | "vehicle" | "profile") => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: type === "profile" ? [1, 1] : [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const key = `${type}_photo`;
      setForm({ ...form, [key]: result.assets[0].uri });
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!form.phone || !form.license_number) {
      Alert.alert(t("common.error"), t("driver.fillAllFields"));
      return;
    }

    if (!form.license_photo || !form.vehicle_photo || !form.profile_photo) {
      Alert.alert(t("common.error"), t("driver.uploadAllPhotos"));
      return;
    }

    setLoading(true);

    try {
      // Step 1: Register driver
      const registerResponse = await fetchAPI("/(api)/driver/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerk_id: user?.id,
          email: user?.primaryEmailAddress?.emailAddress,
          first_name: user?.firstName || "",
          last_name: user?.lastName || "",
          phone: form.phone,
          license_number: form.license_number,
          vehicle_type: form.vehicle_type,
          car_seats: parseInt(form.car_seats),
        }),
      });

      if (!registerResponse.success) {
        throw new Error(
          registerResponse.error || t("driver.registrationFailed")
        );
      }

      const driverId = registerResponse.data.driver_id;

      // Step 2: Upload documents
      const documentTypes = [
        { type: "license", uri: form.license_photo },
        { type: "vehicle_photo", uri: form.vehicle_photo },
        { type: "profile_photo", uri: form.profile_photo },
      ];

      for (const doc of documentTypes) {
        const formData = new FormData();
        formData.append("driver_id", driverId.toString());
        formData.append("document_type", doc.type);

        // Create file object from URI
        const filename = doc.uri!.split("/").pop() || "photo.jpg";
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image/jpeg";

        formData.append("file", {
          uri: doc.uri,
          name: filename,
          type,
        } as any);

        await fetchAPI("/(api)/driver/upload-document", {
          method: "POST",
          body: formData,
        });
      }

      Alert.alert(t("common.success"), t("driver.registrationSuccess"), [
        {
          text: "OK",
          onPress: () => router.replace("/(root)/tabs/profile"),
        },
      ]);
    } catch (error: any) {
      console.error("Driver registration error:", error);
      Alert.alert(
        t("common.error"),
        error.message || t("driver.registrationFailed")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between py-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center bg-neutral-100 rounded-full"
          >
            <Ionicons name="arrow-back" size={20} color="#000" />
          </TouchableOpacity>
          <Text className="text-xl font-JakartaBold">
            {t("driver.becomeDriver")}
          </Text>
          <View className="w-10" />
        </View>

        {/* Info Card */}
        <View className="bg-green-50 p-4 rounded-2xl mb-4 border border-green-200">
          <View className="flex-row items-center mb-2">
            <Ionicons name="information-circle" size={20} color="#10B981" />
            <Text className="ml-2 text-lg font-JakartaBold text-green-800">
              {t("driver.requirements")}
            </Text>
          </View>
          <Text className="text-sm font-JakartaMedium text-green-700">
            • {t("driver.validLicense")}
            {"\n"}• {t("driver.vehicleRegistration")}
            {"\n"}• {t("driver.cleanRecord")}
            {"\n"}• {t("driver.approvalTime")}
          </Text>
        </View>

        {/* Personal Info */}
        <Text className="text-lg font-JakartaBold mb-4">
          {t("driver.personalInfo")}
        </Text>

        <InputField
          label={t("profile.phone")}
          placeholder="+84 123 456 789"
          icon={icons.chat}
          value={form.phone}
          onChangeText={(value) => setForm({ ...form, phone: value })}
          keyboardType="phone-pad"
        />

        <InputField
          label={t("driver.licenseNumber")}
          placeholder="123456789"
          icon={icons.list}
          value={form.license_number}
          onChangeText={(value) => setForm({ ...form, license_number: value })}
        />

        {/* Vehicle Type Selection */}
        <Text className="text-lg font-JakartaBold mb-4 mt-2">
          {t("driver.vehicleType")}
        </Text>
        <View className="flex-row justify-between mb-4">
          {vehicleTypes.map((type) => (
            <TouchableOpacity
              key={type.value}
              onPress={() =>
                setForm({
                  ...form,
                  vehicle_type: type.value,
                  car_seats: type.seats.toString(),
                })
              }
              className={`flex-1 mx-1 p-4 rounded-2xl border-2 ${
                form.vehicle_type === type.value
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <Ionicons
                name={type.icon as any}
                size={32}
                color={form.vehicle_type === type.value ? "#10B981" : "#6B7280"}
                style={{ alignSelf: "center", marginBottom: 8 }}
              />
              <Text
                className={`text-center font-JakartaBold ${
                  form.vehicle_type === type.value
                    ? "text-green-700"
                    : "text-gray-700"
                }`}
              >
                {type.label}
              </Text>
              <Text
                className={`text-center text-sm font-JakartaMedium ${
                  form.vehicle_type === type.value
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                {type.seats} {t("booking.seats")}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Document Upload */}
        <Text className="text-lg font-JakartaBold mb-4">
          {t("driver.documents")}
        </Text>

        {/* License Photo */}
        <TouchableOpacity
          onPress={() => pickImage("license")}
          className="mb-4 p-4 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50"
        >
          {form.license_photo ? (
            <View>
              <Image
                source={{ uri: form.license_photo }}
                className="w-full h-40 rounded-xl mb-2"
                resizeMode="cover"
              />
              <Text className="text-center text-green-600 font-JakartaBold">
                ✓ {t("driver.licensePhoto")}
              </Text>
            </View>
          ) : (
            <View className="items-center py-4">
              <Ionicons name="card-outline" size={48} color="#9CA3AF" />
              <Text className="mt-2 text-gray-600 font-JakartaBold">
                {t("driver.uploadLicense")}
              </Text>
              <Text className="text-sm text-gray-500 font-JakartaMedium">
                {t("driver.tapToUpload")}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Vehicle Photo */}
        <TouchableOpacity
          onPress={() => pickImage("vehicle")}
          className="mb-4 p-4 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50"
        >
          {form.vehicle_photo ? (
            <View>
              <Image
                source={{ uri: form.vehicle_photo }}
                className="w-full h-40 rounded-xl mb-2"
                resizeMode="cover"
              />
              <Text className="text-center text-green-600 font-JakartaBold">
                ✓ {t("driver.vehiclePhoto")}
              </Text>
            </View>
          ) : (
            <View className="items-center py-4">
              <Ionicons name="car-outline" size={48} color="#9CA3AF" />
              <Text className="mt-2 text-gray-600 font-JakartaBold">
                {t("driver.uploadVehicle")}
              </Text>
              <Text className="text-sm text-gray-500 font-JakartaMedium">
                {t("driver.tapToUpload")}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Profile Photo */}
        <TouchableOpacity
          onPress={() => pickImage("profile")}
          className="mb-4 p-4 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50"
        >
          {form.profile_photo ? (
            <View>
              <Image
                source={{ uri: form.profile_photo }}
                className="w-32 h-32 rounded-full self-center mb-2"
                resizeMode="cover"
              />
              <Text className="text-center text-green-600 font-JakartaBold">
                ✓ {t("driver.profilePhoto")}
              </Text>
            </View>
          ) : (
            <View className="items-center py-4">
              <Ionicons
                name="person-circle-outline"
                size={48}
                color="#9CA3AF"
              />
              <Text className="mt-2 text-gray-600 font-JakartaBold">
                {t("driver.uploadProfile")}
              </Text>
              <Text className="text-sm text-gray-500 font-JakartaMedium">
                {t("driver.tapToUpload")}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Submit Button */}
        <CustomButton
          title={t("driver.submitApplication")}
          onPress={handleSubmit}
          disabled={loading}
          className="mb-8"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
