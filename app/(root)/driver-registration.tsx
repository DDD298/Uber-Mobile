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

import PageHeader from "@/components/Common/PageHeader";
import CustomButton from "@/components/Common/CustomButton";
import InputField from "@/components/Common/InputField";
import CustomAlert from "@/components/Common/CustomAlert";
import { icons } from "@/constants";
import { fetchAPI } from "@/lib/fetch";

export default function DriverRegistrationScreen() {
  const { t } = useTranslation();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [alertConfig, setAlertConfig] = useState({
    isVisible: false,
    title: "",
    description: "",
    type: "info" as "success" | "error" | "info" | "warning",
    onConfirm: () => {},
  });

  const showAlert = (
    title: string,
    description: string,
    type: "success" | "error" | "info" | "warning" = "info",
    onConfirm?: () => void
  ) => {
    setAlertConfig({
      isVisible: true,
      title,
      description,
      type,
      onConfirm:
        onConfirm ||
        (() => setAlertConfig((prev) => ({ ...prev, isVisible: false }))),
    });
  };

  const [form, setForm] = useState({
    phone: "",
    license_number: "",
    vehicle_type: "car",
    car_seats: "4",
    license_photo_uri: null as string | null,
    vehicle_photo_uri: null as string | null,
    profile_photo_uri: null as string | null,
    license_image_url: null as string | null,
    car_image_url: null as string | null,
    profile_image_url: null as string | null,
  });

  const [uploadingImage, setUploadingImage] = useState<{
    license: boolean;
    vehicle: boolean;
    profile: boolean;
  }>({
    license: false,
    vehicle: false,
    profile: false,
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
      const uri = result.assets[0].uri;
      const photoKey = `${type}_photo_uri`;

      // Update local URI first to show preview
      setForm({ ...form, [photoKey]: uri });

      // Upload to Cloudinary immediately
      await uploadImageToCloudinary(type, uri);
    }
  };

  const uploadImageToCloudinary = async (
    type: "license" | "vehicle" | "profile",
    uri: string
  ) => {
    try {
      setUploadingImage((prev) => ({ ...prev, [type]: true }));

      console.log(`📤 [Upload] Starting upload for ${type}...`);

      // Convert URI to base64
      const response = await fetch(uri);
      const blob = await response.blob();
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });

      // Upload to Cloudinary via API
      const uploadResponse = await fetchAPI("/(api)/upload-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base64,
          folder: `uber-clone/driver-documents/${type}`,
          publicId: `driver_${user?.id}_${type}_${Date.now()}`,
        }),
      });

      if (!uploadResponse.success) {
        throw new Error(uploadResponse.error || "Upload failed");
      }

      const cloudinaryUrl = uploadResponse.data.url;

      // Map type to URL field name
      const urlFieldMap = {
        license: "license_image_url",
        vehicle: "car_image_url",
        profile: "profile_image_url",
      };

      // Store the Cloudinary URL
      const urlKey = urlFieldMap[type];
      setForm((prev) => {
        const updated = { ...prev, [urlKey]: cloudinaryUrl };
        console.log(`📝 [Upload] Updated form.${urlKey}:`, cloudinaryUrl);
        return updated;
      });

      console.log(
        `✅ [Upload] ${type} uploaded successfully to:`,
        cloudinaryUrl
      );
    } catch (error: any) {
      console.error(`❌ [Upload] Failed to upload ${type} image:`, error);
      showAlert(
        t("common.error"),
        `Lỗi khi tải ảnh ${type} lên: ${error.message}`,
        "error"
      );

      // Clear the local URI on error
      const photoKey = `${type}_photo_uri`;
      setForm((prev) => ({ ...prev, [photoKey]: null }));
    } finally {
      setUploadingImage((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleSubmit = async () => {
    // Debug: Log current form state
    console.log("🔍 [Submit] Current form state:");
    console.log("  - phone:", form.phone);
    console.log("  - license_number:", form.license_number);
    console.log(
      "  - license_image_url:",
      form.license_image_url ? "✅ Present" : "❌ Missing"
    );
    console.log(
      "  - car_image_url:",
      form.car_image_url ? "✅ Present" : "❌ Missing"
    );
    console.log(
      "  - profile_image_url:",
      form.profile_image_url ? "✅ Present" : "❌ Missing"
    );
    console.log("  - Full URLs:");
    console.log("    License:", form.license_image_url);
    console.log("    Car:", form.car_image_url);
    console.log("    Profile:", form.profile_image_url);

    // Validate required fields with specific error messages
    const missingFields: string[] = [];

    if (!form.phone) {
      missingFields.push(t("profile.phone"));
    }
    if (!form.license_number) {
      missingFields.push(t("driver.licenseNumber"));
    }

    if (missingFields.length > 0) {
      showAlert(
        t("common.error"),
        `${t("driver.missingFields")}:\n• ${missingFields.join("\n• ")}`,
        "warning"
      );
      return;
    }

    const missingPhotos: string[] = [];

    if (!form.license_image_url) {
      missingPhotos.push(t("driver.licensePhoto"));
    }
    if (!form.car_image_url) {
      missingPhotos.push(t("driver.vehiclePhoto"));
    }
    if (!form.profile_image_url) {
      missingPhotos.push(t("driver.profilePhoto"));
    }

    if (missingPhotos.length > 0) {
      console.error("❌ [Validation] Missing photos:", missingPhotos);
      showAlert(
        t("common.error"),
        `${t("driver.missingPhotos")}:\n• ${missingPhotos.join("\n• ")}`,
        "warning"
      );
      return;
    }

    setLoading(true);

    const submitData = {
      clerk_id: user?.id,
      email: user?.primaryEmailAddress?.emailAddress,
      first_name: user?.firstName || "",
      last_name: user?.lastName || "",
      phone: form.phone,
      license_number: form.license_number,
      vehicle_type: form.vehicle_type,
      car_seats: parseInt(form.car_seats),
      license_image_url: form.license_image_url,
      car_image_url: form.car_image_url,
      profile_image_url: form.profile_image_url,
    };

    console.log(
      "🚀 [Registration] Submitting driver registration data:",
      JSON.stringify(submitData, null, 2)
    );

    try {
      // Register driver with all data including image URLs
      setUploadStatus("Đang đăng ký tài xế...");
      const registerResponse = await fetchAPI("/(api)/driver/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      if (!registerResponse.success) {
        throw new Error(
          registerResponse.error || t("driver.registrationFailed")
        );
      }

      const driverId = registerResponse.data.driver_id;

      // Log if using existing driver
      if (registerResponse.data.already_exists) {
        console.log("ℹ️ [Registration] Using existing driver ID:", driverId);
      }

      console.log(
        "🎉 [Registration] Driver registered successfully with ID:",
        driverId
      );
      console.log("📸 Images uploaded:");
      console.log("  - License:", form.license_image_url ? "✅" : "❌");
      console.log("  - Vehicle:", form.car_image_url ? "✅" : "❌");
      console.log("  - Profile:", form.profile_image_url ? "✅" : "❌");

      showAlert(
        t("common.success"),
        t("driver.registrationSuccess"),
        "success",
        () => {
          setAlertConfig((prev) => ({ ...prev, isVisible: false }));
          router.replace("/(root)/tabs/profile");
        }
      );
    } catch (error: any) {
      console.error("Driver registration error:", error);
      showAlert(
        t("common.error"),
        error.message || t("driver.registrationFailed"),
        "error"
      );
    } finally {
      setLoading(false);
      setUploadStatus("");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <PageHeader title={t("driver.becomeDriver")} />
      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
      >
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
        <Text className="text-lg font-JakartaBold">
          {t("driver.personalInfo")}
        </Text>

        <InputField
          label={t("profile.phone")}
          placeholder="+84 123 456 789"
          icon={icons.chat}
          iconStyle="#22c55e"
          value={form.phone}
          onChangeText={(value) => setForm({ ...form, phone: value })}
          keyboardType="phone-pad"
        />

        <InputField
          label={t("driver.licenseNumber")}
          placeholder="123456789"
          icon={icons.list}
          iconStyle="#22c55e"
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
          disabled={uploadingImage.license}
        >
          {form.license_photo_uri ? (
            <View>
              <Image
                source={{ uri: form.license_photo_uri }}
                className="w-full h-40 rounded-xl mb-2"
                resizeMode="cover"
              />
              {uploadingImage.license ? (
                <Text className="text-center text-blue-600 font-JakartaBold">
                  ⏳ Đang tải lên...
                </Text>
              ) : (
                <Text className="text-center text-green-600 font-JakartaBold">
                  ✓ {t("driver.licensePhoto")}
                </Text>
              )}
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
          disabled={uploadingImage.vehicle}
        >
          {form.vehicle_photo_uri ? (
            <View>
              <Image
                source={{ uri: form.vehicle_photo_uri }}
                className="w-full h-40 rounded-xl mb-2"
                resizeMode="cover"
              />
              {uploadingImage.vehicle ? (
                <Text className="text-center text-blue-600 font-JakartaBold">
                  ⏳ Đang tải lên...
                </Text>
              ) : (
                <Text className="text-center text-green-600 font-JakartaBold">
                  ✓ {t("driver.vehiclePhoto")}
                </Text>
              )}
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
          disabled={uploadingImage.profile}
        >
          {form.profile_photo_uri ? (
            <View>
              <Image
                source={{ uri: form.profile_photo_uri }}
                className="w-32 h-32 rounded-full self-center mb-2"
                resizeMode="cover"
              />
              {uploadingImage.profile ? (
                <Text className="text-center text-blue-600 font-JakartaBold">
                  ⏳ Đang tải lên...
                </Text>
              ) : (
                <Text className="text-center text-green-600 font-JakartaBold">
                  ✓ {t("driver.profilePhoto")}
                </Text>
              )}
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
          title={
            loading && uploadStatus
              ? uploadStatus
              : t("driver.submitApplication")
          }
          onPress={handleSubmit}
          disabled={loading}
          className="mb-8"
        />
      </ScrollView>

      <CustomAlert
        isVisible={alertConfig.isVisible}
        title={alertConfig.title}
        description={alertConfig.description}
        type={alertConfig.type}
        onConfirm={alertConfig.onConfirm}
      />
    </SafeAreaView>
  );
}
