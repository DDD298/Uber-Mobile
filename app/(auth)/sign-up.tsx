import CustomButton from '@/components/Common/CustomButton';
import InputField from '@/components/Common/InputField';
import OAuth from '@/components/Common/OAuth';
import { icons, images } from '@/constants';
import { fetchAPI } from '@/lib/fetch';
import { useSignUp } from '@clerk/clerk-expo';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, ScrollView, Text, View } from 'react-native';
import ReactNativeModal from 'react-native-modal';

const SignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerification({
        ...verification,
        state: "pending",
      });
    } catch (err: any) {
      Alert.alert("Lỗi", err.errors[0].longMessage);
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) return;
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });

      if (completeSignUp.status === "complete") {
        // Tạo user trong database
        await fetchAPI("/(api)/user", {
          method: "POST",
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            clerkId: completeSignUp.createdUserId,
          }),
        });
        await setActive({ session: completeSignUp.createdSessionId });
        setVerification({
          ...verification,
          state: "success",
        });
      } else {
        setVerification({
          ...verification,
          error: "Đăng nhập thất bại. Xin vui lòng thử lại.",
          state: "failed",
        });
      }
    } catch (err: any) {
      setVerification({
        ...verification,
        error: err.errors[0].longMessage,
        state: "failed",
      });
    }
  };

  return (
    <ScrollView className='flex-1 bg-white'>
      <View className='flex-1 bg-white'>
        <View className="relative w-full h-[280px]">
          <Image source={images.signUpCar} className="z-0 w-full h-[250px]" resizeMode='contain' />
          <Text className='absolute -bottom-2 w-full text-2xl text-center text black font-JakartaSemiBold'>Đăng kí tài khoản</Text>
        </View>
        <View className='p-4'>
          <InputField
            label="Tên đăng nhập"
            placeholder="Nhập tên đăng nhập"
            icon={icons.person}
            value={form.name}
            onChangeText={(value) => setForm({ ...form, name: value })} />

          <InputField
            label="Email"
            placeholder="Nhập email"
            icon={icons.email}
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })} />

          <InputField
            label="Mật khẩu"
            placeholder="Nhập mật khẩu"
            icon={icons.lock}
            secureTextEntry={true}
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })} />

          <CustomButton title='Đăng Kí' onPress={onSignUpPress} className='mt-4' />

          <OAuth />
          <Link
            href="/sign-in"
            className="mt-4 text-lg text-center text-general-200"
          >
            Đã có tài khoản?{" "}
            <Text className="text-primary-500">Đăng nhập ngay</Text>
          </Link>
        </View>

        <ReactNativeModal
          isVisible={verification.state === "pending"}
          onModalHide={() => {
            if (verification.state === "success") setShowSuccessModal(true);
          }}
        >
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Text className="mb-2 text-2xl text-black font-JakartaBold">Xác minh email</Text>
            <Text className="mb-5 font-Jakarta">Mã xác minh đã được gửi đến {form.email}</Text>
            <InputField
              label="Mã xác minh"
              placeholder="*****"
              icon={icons.lock}
              value={verification.code} keyboardType='numeric'
              onChangeText={(code) => setVerification({ ...verification, code })} />

            {verification.error && (
              <Text className="mt-1 text-sm text-red-500">{verification.error}</Text>
            )}

            <CustomButton
              title="Xác minh"
              onPress={onPressVerify}
              className="mt-4 bg-success-500"
            />
          </View>
        </ReactNativeModal>

        <ReactNativeModal isVisible={showSuccessModal} >
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Image source={images.check} className="w-[110px] h-[110px] mx-auto my-5" />
            <Text className="text-2xl text-center text-black font-JakartaBold">Đăng ký thành công!</Text>
            <Text className="mt-3 text-base text-center text-gray-400 font-Jakarta">Bạn đã đăng ký thành công tài khoản. Hãy bắt đầu khám phá ngay!</Text>
            <CustomButton
              title="Bắt đầu thôi"
              onPress={() => {
                setShowSuccessModal(false);
                router.push('/(root)/tabs/home')
              }}
              className="mt-4"
            />
          </View>
        </ReactNativeModal>
      </View>
    </ScrollView>
  );
};

export default SignUp;