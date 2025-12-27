# DESIGNS - Tài liệu Thiết kế UI/UX Uber Clone

> Tài liệu này mô tả chi tiết về thiết kế giao diện của tất cả các màn hình trong ứng dụng Uber Clone, bao gồm components, layout, màu sắc và các thông tin cần thiết cho việc re-design.

---

## 📋 Mục lục

1. [Hệ thống màu sắc](#hệ-thống-màu-sắc)
2. [Typography](#typography)
3. [Common Components](#common-components)
4. [Auth Screens](#auth-screens)
5. [Main App Screens](#main-app-screens)
6. [Ride Management Screens](#ride-management-screens)
7. [Chat Screen](#chat-screen)
8. [Profile Screen](#profile-screen)

---

## 🎨 Hệ thống màu sắc

### Primary Colors (Green Theme)

```
primary-100: #dcfce7 (Lightest Green)
primary-200: #bbf7d0
primary-300: #86efac
primary-400: #4ade80
primary-500: #22c55e (Main Green)
primary-600: #16a34a (Active Green)
primary-700: #15803d
primary-800: #166534
primary-900: #14532d (Darkest Green)
```

### Secondary Colors (Gray Scale)

```
secondary-100: #F8F8F8 (Almost White)
secondary-200: #F1F1F1
secondary-300: #D9D9D9
secondary-400: #C2C2C2
secondary-500: #AAAAAA (Placeholder Gray)
secondary-600: #999999
secondary-700: #666666
secondary-800: #4D4D4D
secondary-900: #333333 (Dark Text)
```

### Success Colors

```
success-100: #F0FFF4
success-200: #C6F6D5
success-300: #9AE6B4
success-400: #68D391
success-500: #38A169 (Main Success - Button Default)
success-600: #2F855A
success-700: #276749
success-800: #22543D
success-900: #1C4532
```

### Danger Colors

```
danger-100: #FFF5F5
danger-200: #FED7D7
danger-300: #FEB2B2
danger-400: #FC8181
danger-500: #F56565
danger-600: #E53E3E
danger-700: #C53030
danger-800: #9B2C2C
danger-900: #742A2A
```

### Warning Colors

```
warning-100: #FFFBEB
warning-200: #FEF3C7
warning-300: #FDE68A
warning-400: #FACC15
warning-500: #EAB308
warning-600: #CA8A04
warning-700: #A16207
warning-800: #854D0E
warning-900: #713F12
```

### General Colors

```
general-100: #CED1DD
general-200: #858585
general-300: #EEEEEE
general-400: #0CC25F (Bright Green Accent)
general-500: #F6F8FA (Background Light)
general-600: #E6F3FF (Light Blue Background)
general-700: #EBEBEB
general-800: #ADADAD
```

---

## 📝 Typography

### Font Family

```
Jakarta (Regular)
Jakarta-Bold
Jakarta-ExtraBold
Jakarta-ExtraLight
Jakarta-Light
Jakarta-Medium
Jakarta-SemiBold
```

### Font Usage

- **Headers (H1)**: `text-2xl font-JakartaExtraBold` - Màu: `text-secondary-900`
- **Headers (H2)**: `text-xl font-JakartaBold`
- **Body Text**: `text-lg font-JakartaSemiBold`
- **Small Text**: `text-md font-JakartaMedium`
- **Caption**: `text-sm font-JakartaRegular`

---

## 🧩 Common Components

### 1. CustomButton

**File**: `components/Common/CustomButton.tsx`

#### Variants

- **Primary** (Default): `bg-[#38A169]` với `text-white`
- **Secondary**: `bg-gray-500` với `text-gray-100`
- **Danger**: `bg-red-500` với `text-red-100`
- **Success**: `bg-green-500` với `text-green-100`
- **Outline**: `bg-transparent border-neutral-300 border-[0.5px]`

#### Styling

```
- Padding: p-4
- Width: w-full
- Border Radius: rounded-full
- Shadow: shadow-md shadow-neutral-400/70
- Text: text-lg font-bold
```

#### Props

- `title`: string
- `onPress`: function
- `bgVariant`: 'primary' | 'secondary' | 'danger' | 'success' | 'outline'
- `textVariant`: 'default' | 'primary' | 'secondary' | 'danger' | 'success'
- `IconLeft`, `IconRight`: Optional icons

---

### 2. InputField

**File**: `components/Common/InputField.tsx`

#### Styling

```
- Container: bg-neutral-100 rounded-full border border-neutral-100
- Focus: focus:border-green-500
- Label: text-lg font-JakartaSemiBold text-green-600
- Input: p-4 font-JakartaSemiBold text-[15px]
- Icon: w-6 h-6 ml-4
- Placeholder Color: #AAAAAA
```

#### Props

- `label`: string
- `icon`: ImageSource (optional)
- `secureTextEntry`: boolean
- `containerStyle`, `inputStyle`, `iconStyle`: Custom styles

---

### 3. GoogleTextInput

**File**: `components/Common/GoogleTextInput.tsx`

#### Styling

```
- Container: bg-white shadow-md shadow-neutral-300
- Input Background: bg-neutral-100 (có thể custom)
- Border Radius: rounded-full
```

#### Features

- Tích hợp Google Places Autocomplete
- Icon tùy chỉnh
- Callback `handlePress` khi chọn địa điểm

---

### 4. DriverCard

**File**: `components/Common/DriverCard.tsx`

#### Layout

- Avatar tài xế (circular)
- Tên tài xế + Rating (star icon)
- Thông tin xe: Seats, Time
- Giá tiền (màu xanh)
- Border khi được chọn

#### Styling

```
- Background: bg-white
- Selected Border: border-2 border-green-500
- Shadow: shadow-sm shadow-neutral-300
- Padding: p-4
- Border Radius: rounded-lg
```

---

### 5. Map

**File**: `components/Common/Map.tsx`

#### Features

- Hiển thị bản đồ với react-native-maps
- Marker cho vị trí người dùng và điểm đến
- Directions API để vẽ route
- Custom marker icons

#### Styling

```
- Height: h-[300px]
- Border Radius: rounded-xl
- Overflow: overflow-hidden
```

---

### 6. OAuth

**File**: `components/Common/OAuth.tsx`

#### Layout

- Divider với text "Hoặc"
- Button đăng nhập Google (có icon)

#### Styling

```
- Divider: border-general-100
- Button: bg-white border border-gray-300
- Icon + Text layout
```

---

### 7. StarRating

**File**: `components/Common/StarRating.tsx`

#### Features

- 5 sao có thể tương tác
- Màu vàng cho sao được chọn
- Màu xám cho sao chưa chọn

---

## 🔐 Auth Screens

### 1. Welcome Screen (Onboarding)

**File**: `app/(auth)/welcome.tsx`

#### Layout Structure

```
SafeAreaView (bg-white, full height)
├── TouchableOpacity "Bỏ qua" (top-right)
├── SwiperFlatList (Carousel)
│   ├── Image (80% width, 300px height)
│   ├── Title (text-3xl font-bold)
│   └── Description (text-lg font-JakartaSemiBold text-[#858585])
├── Pagination Dots
│   ├── Active: bg-[#68D391] (32x4px)
│   └── Inactive: bg-[#E2E8F0]
└── CustomButton ("Bắt Đầu Thôi" / "Tiếp tục")
```

#### Colors

- Background: `bg-white`
- Skip Button Text: `text-black text-md font-JakartaBold`
- Title: `text-black text-3xl font-bold`
- Description: `text-[#858585] text-lg`
- Active Pagination: `#68D391`
- Inactive Pagination: `#E2E8F0`

#### Components Used

- `SwiperFlatList` (carousel)
- `CustomButton`
- `Image` (onboarding images)

---

### 2. Sign In Screen

**File**: `app/(auth)/sign-in.tsx`

#### Layout Structure

```
ScrollView (bg-white)
└── View
    ├── Header Image (signUpCar, 250px height)
    │   └── Title "Đăng Nhập 🚘" (absolute bottom-left)
    └── Form Container (p-4)
        ├── InputField (Email)
        ├── InputField (Password - secure)
        ├── CustomButton "Đăng Nhập"
        ├── OAuth Component
        └── Link to Sign Up
```

#### Colors

- Background: `bg-white`
- Title: `text-2xl text-black font-JakartaSemiBold`
- Link Text: `text-general-200`
- Link Highlight: `text-primary-600`

#### Components Used

- `InputField` (Email, Password)
- `CustomButton`
- `OAuth`
- `Link` (to sign-up)

---

### 3. Sign Up Screen

**File**: `app/(auth)/sign-up.tsx`

#### Layout Structure

```
ScrollView (bg-white)
└── View
    ├── Header Image (signUpCar, 250px height)
    │   └── Title "Đăng kí tài khoản" (absolute bottom)
    ├── Form Container (p-4)
    │   ├── InputField (Name)
    │   ├── InputField (Email)
    │   ├── InputField (Password - secure)
    │   ├── CustomButton "Đăng Kí"
    │   ├── OAuth Component
    │   └── Link to Sign In
    ├── Verification Modal
    │   ├── Title "Xác minh email"
    │   ├── Description
    │   ├── InputField (Verification Code)
    │   ├── Error Message (if any)
    │   └── CustomButton "Xác minh"
    └── Success Modal
        ├── Check Icon (110x110px)
        ├── Title "Đăng ký thành công!"
        ├── Description
        └── CustomButton "Bắt đầu thôi"
```

#### Colors

- Background: `bg-white`
- Modal Background: `bg-white px-7 py-9 rounded-2xl`
- Modal Min Height: `min-h-[300px]`
- Success Icon Background: `bg-white`
- Error Text: `text-red-500`
- Success Button: `bg-success-500`

#### Components Used

- `InputField` (Name, Email, Password, Verification Code)
- `CustomButton`
- `OAuth`
- `ReactNativeModal` (2 modals)
- `Link` (to sign-in)

---

## 🏠 Main App Screens

### 1. Home Screen (Tabs)

**File**: `app/(root)/tabs/home.tsx`

#### Layout Structure

```
GestureHandlerRootView
└── SafeAreaView (bg-general-500)
    ├── Header Section (px-4)
    │   ├── Greeting Text "Xin chào, {name} 👋"
    │   │   └── text-2xl font-JakartaExtraBold text-secondary-900
    │   └── Logout Button (circular, bg-white)
    ├── GoogleTextInput (Search)
    │   └── bg-white shadow-md shadow-neutral-300
    ├── Current Location Map Section
    │   ├── Title "Vị trí hiện tại của bạn"
    │   │   └── text-xl font-JakartaBold text-secondary-900
    │   └── Map Component (h-[300px], rounded-xl)
    └── BottomSheet (Green Background #16a34a)
        ├── Handle Indicator (white)
        ├── Background SVG (PolygonLuminary - opacity 0.5)
        ├── Decorative Bubbles (white/10, white/15, white/5)
        ├── Car Image (h-[100px])
        └── ScrollView Content
            ├── QuickActions Component
            ├── Features Component
            └── AdditionalServices Component
```

#### Colors

- Background: `bg-general-500` (#F6F8FA)
- Header Text: `text-secondary-900` (#333333)
- BottomSheet Background: `#16a34a` (Green)
- Handle Indicator: `white`
- Bubbles: `bg-white/10`, `bg-white/15`, `bg-white/5`

#### BottomSheet Configuration

- Snap Points: `["44%", "90%"]`
- Initial Index: `0`
- Background: `#16a34a`
- Handle Indicator: `white`

#### Components Used

- `GoogleTextInput`
- `Map`
- `QuickActions`
- `Features`
- `AdditionalServices`
- `PolygonLuminary` (SVG Background)
- `BottomSheet` from `@gorhom/bottom-sheet`

---

### 2. QuickActions Component

**File**: `components/Home/QuickActions/index.tsx`

#### Layout Structure

```
View (mb-4)
├── Title "Dịch vụ nhanh"
│   └── text-xl text-white font-JakartaBold
└── Flex Row (justify-between)
    ├── TouchableOpacity "Đặt chuyến"
    │   ├── bg-white/20 rounded-xl shadow-sm
    │   ├── Image (rent-car.png) - absolute positioned
    │   └── Text "Đặt chuyến" (absolute top-right)
    └── TouchableOpacity "Lịch sử"
        ├── bg-white/20 rounded-xl shadow-sm
        ├── Image (history.png) - absolute positioned
        └── Text "Lịch sử" (absolute top-right)
```

#### Styling

```
- Card: bg-white/20 rounded-xl shadow-sm p-4 min-h-[100px]
- Text: text-lg font-bold text-white font-JakartaMedium
- Image: h-[150px] w-[150px] positioned bottom
```

#### Colors

- Title: `text-white`
- Card Background: `bg-white/20` (20% opacity white)
- Card Text: `text-white`

---

### 3. Features Component

**File**: `components/Home/Features/index.tsx`

#### Layout Structure

```
View
├── Title "Tính năng"
│   └── text-xl text-white font-JakartaBold
└── FlatList (3 items)
    └── FeatureItem
        ├── Icon Container (circular, bg-white/20)
        │   └── Icon (AntDesign/FontAwesome5/Ionicons)
        ├── Text Container (border-left white/20)
        │   ├── Title (text-lg text-white font-JakartaBold)
        │   └── Description (text-sm text-white/80)
        └── Decorative Circle (bg-green-600, translateX: 36)
```

#### Features List

1. **Đánh giá tài xế**
   - Icon: star (AntDesign, 24px, white)
   - Description: "Chia sẻ trải nghiệm của bạn"

2. **Thanh toán linh hoạt**
   - Icon: credit-card (FontAwesome5, 20px, white)
   - Description: "Tiền mặt, thẻ, ví điện tử"

3. **Hỗ trợ 24/7**
   - Icon: headset (Ionicons, 24px, white)
   - Description: "Luôn sẵn sàng hỗ trợ bạn"

#### Styling

```
- Card: bg-white/20 rounded-xl p-4 mb-4
- Icon Container: w-12 h-12 rounded-full bg-white/20
- Divider: border-l border-l-white/20
- Decorative Circle: w-12 h-12 bg-green-600 rounded-full
```

#### Colors

- Title: `text-white`
- Card Background: `bg-white/20`
- Icon Container: `bg-white/20`
- Icon Color: `white`
- Text: `text-white`
- Description: `text-white/80`
- Decorative Circle: `bg-green-600`

---

## 🚗 Ride Management Screens

### 1. Find Ride Screen

**File**: `app/(root)/find-ride.tsx`

#### Layout Structure

```
RideLayout (title: "Tìm chuyến xe", snapPoints: ["85%"])
├── From Section
│   ├── Label "Từ:" (text-lg font-JakartaSemiBold)
│   └── GoogleTextInput
│       └── bg-neutral-100, transparent input
├── To Section
│   ├── Label "Đến:" (text-lg font-JakartaSemiBold)
│   └── GoogleTextInput
│       └── bg-neutral-100, transparent input
└── CustomButton "Đặt ngay"
```

#### Colors

- Background: Inherited from RideLayout
- Label: `text-lg font-JakartaSemiBold`
- Input Container: `bg-neutral-100`
- Input Background: `transparent`

#### Components Used

- `RideLayout`
- `GoogleTextInput` (2 instances)
- `CustomButton`

---

### 2. Confirm Ride Screen

**File**: `app/(root)/confirm-ride.tsx`

#### Layout Structure

```
RideLayout (title: "Chọn chuyến xe", snapPoints: ["65%", "85%"])
└── FlatList
    ├── DriverCard (multiple)
    │   ├── Selected state highlight
    │   └── onClick: setSelectedDriver
    └── Footer
        └── CustomButton "Đặt xe"
```

#### Colors

- Background: Inherited from RideLayout
- Selected Driver: Border highlight

#### Components Used

- `RideLayout`
- `DriverCard`
- `CustomButton`
- `FlatList`

---

### 3. Book Ride Screen

**File**: `app/(root)/book-ride.tsx`

#### Layout Structure

```
StripeProvider
└── RideLayout (title: "Đặt chuyến xe")
    ├── Title "Thông tin chuyến xe"
    │   └── text-xl font-JakartaSemiBold
    ├── Driver Info Section
    │   ├── Avatar (w-28 h-28 rounded-full)
    │   ├── Name (text-lg font-JakartaSemiBold)
    │   └── Rating (star icon + number)
    ├── Ride Details Card (bg-general-600 rounded-3xl)
    │   ├── Price Row
    │   │   ├── Label "Giá chuyến xe"
    │   │   └── Value (text-[#0CC25F])
    │   ├── Pickup Time Row
    │   │   ├── Label "Thời gian đón"
    │   │   └── Value
    │   └── Seats Row
    │       ├── Label "Số chỗ ngồi"
    │       └── Value
    ├── Location Details
    │   ├── From Row (icon: to)
    │   │   └── border-t border-b border-general-700
    │   └── To Row (icon: point)
    │       └── border-b border-general-700
    └── Payment Component
```

#### Colors

- Title: `text-xl font-JakartaSemiBold`
- Details Card Background: `bg-general-600` (#E6F3FF)
- Price Color: `text-[#0CC25F]` (Bright Green)
- Border: `border-general-700` (#EBEBEB)
- Label: `text-lg font-JakartaRegular`

#### Components Used

- `RideLayout`
- `Payment`
- `StripeProvider`
- `Image` (driver avatar, icons)

---

### 4. Rides Screen (History)

**File**: `app/(root)/tabs/rides.tsx`

#### Layout Structure

```
SafeAreaView (bg-general-500)
└── FlatList
    ├── Header
    │   ├── Title "Tất cả chuyến đi"
    │   │   └── text-2xl font-JakartaBold
    │   └── Count "{n} chuyến đi"
    │       └── text-sm text-gray-500
    ├── RideCard (multiple)
    │   └── onCancel callback (if applicable)
    └── Empty State
        ├── Loading: ActivityIndicator
        ├── Error: noResult image + error message
        └── No Data: noResult image + "Không tìm thấy chuyến gần đây"
```

#### Colors

- Background: `bg-general-500`
- Title: `text-2xl font-JakartaBold`
- Count: `text-sm text-gray-500`
- Error Text: `text-red-500`

#### Components Used

- `RideCard`
- `FlatList`
- `RefreshControl`
- `ActivityIndicator`
- `Image` (noResult)

---

### 5. RideCard Component

**File**: `components/Ride/RideCard/index.tsx`

#### Layout Structure

```
View (bg-white rounded-lg shadow)
└── Column Container (p-3)
    ├── Top Section (flex-row)
    │   ├── Map Thumbnail (w-[80px] h-[90px] rounded-lg)
    │   └── Location Info
    │       ├── From (icon: to)
    │       └── To (icon: point)
    └── Details Card (bg-general-500 rounded-lg p-4)
        ├── Time Row
        ├── Driver Row
        ├── Seats Row
        ├── Price Row (text-green-600)
        ├── Ride Status Badge
        │   ├── Icon (Ionicons)
        │   ├── Text
        │   └── Colored border + background
        ├── Payment Status Row
        ├── Cancel Info (if cancelled)
        │   ├── Cancelled At
        │   └── Cancel Reason
        └── Action Buttons
            ├── Cancel Button (bg-red-500) - if cancellable
            ├── Cannot Cancel Message (bg-gray-100)
            ├── In Progress Message (bg-gray-100)
            └── Completed Message (bg-green-100)
```

#### Ride Status Colors

- **Confirmed**: `bg-green-50 text-green-600 border-blue` + Icon: checkmark-circle (#3B82F6)
- **Driver Arrived**: `bg-orange-50 text-orange-500` + Icon: car (#F97316)
- **In Progress**: `bg-purple-50 text-purple-500` + Icon: play-circle (#8B5CF6)
- **Completed**: `bg-green-50 text-green-600` + Icon: checkmark-done-circle (#10B981)
- **Cancelled**: `bg-red-50 text-red-500` + Icon: close-circle (#EF4444)
- **No Show**: `bg-gray-50 text-gray-500` + Icon: person-remove (#6B7280)

#### Payment Status Colors

- **Paid**: `text-green-600`
- **Refunded**: `text-green-600`
- **Pending**: `text-yellow-500`

#### Styling

```
- Card: bg-white rounded-lg shadow-sm shadow-neutral-300
- Map Thumbnail: w-[80px] h-[90px] rounded-lg
- Details Card: bg-general-500 rounded-lg p-4
- Status Badge: px-4 py-1 rounded-full (colored)
- Cancel Button: bg-red-500 rounded-lg py-4
- Message Box: bg-gray-100/green-100 rounded-lg py-4
```

#### Components Used

- `Image` (map thumbnail, icons)
- `Ionicons` (status icons)
- `TouchableOpacity` (cancel button)

---

### 6. Payment Component

**File**: `components/Ride/Payment/index.tsx`

#### Features

- Stripe payment integration
- QR Code payment option
- Payment method selection
- Success/Error handling

#### QR Payment Modal

**File**: `components/Payment/QRPaymentModal/index.tsx`

##### Step 1: Introduction

```
Modal (transparent overlay)
└── Card (bg-white rounded-2xl p-6)
    ├── Icon 📱 (bg-green-100 rounded-full)
    ├── Title "Thanh toán QR Code"
    ├── Description
    ├── Amount Display (bg-gray-50 rounded-lg)
    └── Buttons
        ├── "Hủy" (bg-gray-200)
        └── "Tạo mã QR"
```

##### Step 2: QR Code Display

```
Modal
└── Card
    ├── Icon 📱
    ├── Title "Quét mã QR để thanh toán"
    ├── QR Code Container (w-64 h-64 border-2 border-gray-300)
    │   ├── QRCode Component (160x160)
    │   └── Scanning Animation (green line)
    ├── Tip Box (bg-green-50 border-green-200)
    ├── Transaction Details (bg-gray-50 border-gray-200)
    │   ├── Transaction ID
    │   ├── Amount (text-green-600)
    │   └── Time
    └── Buttons
        ├── "Quay lại" (bg-gray-200)
        └── "Đã quét xong"
```

##### Step 3: Verification

```
Modal
└── Card
    ├── Icon ✅
    ├── Title "Đang xác nhận thanh toán..."
    ├── Description
    ├── Progress Bar (bg-gray-200)
    │   └── Animated Fill (bg-green-500)
    └── Message "Vui lòng không tắt ứng dụng..."
```

#### Colors

- Modal Overlay: `rgba(0, 0, 0, 0.5)`
- Card: `bg-white rounded-2xl`
- Icon Container: `bg-green-100 rounded-full`
- Amount Box: `bg-gray-50 rounded-lg`
- Tip Box: `bg-green-50 border-green-200`
- Details Box: `bg-gray-50 border-gray-200`
- QR Border: `border-2 border-gray-300`
- Scan Line: `bg-green-500`
- Progress Bar: `bg-gray-200`
- Progress Fill: `bg-green-500`

---

## 💬 Chat Screen

**File**: `app/(root)/tabs/chat.tsx`

### Layout Structure

```
SafeAreaView (bg-white)
├── ChatHeader
│   ├── Back Button
│   └── Clear History Button
├── ChatInterface
│   ├── GiftedChat Component
│   ├── Message Bubbles
│   │   ├── AI Messages (left)
│   │   └── User Messages (right)
│   └── Input Bar
└── FlashMessage (top notifications)
```

### Chat Components

#### 1. ChatHeader

**File**: `components/Chat/ChatHeader/index.tsx`

##### Features

- Back button
- Title "AI Assistant"
- Clear history button

#### 2. ChatInterface

**File**: `components/Chat/ChatInterface/index.tsx`

##### Features

- GiftedChat integration
- AI message handling
- Quick replies
- Custom message bubbles

#### 3. ChatBubble

**File**: `components/Chat/ChatBubble/index.tsx`

##### Styling

- AI Bubble: Left-aligned, light background
- User Bubble: Right-aligned, green background
- Timestamp display
- Avatar display

#### 4. QuickReplies

**File**: `components/Chat/QuickReplies/index.tsx`

##### Features

- Predefined quick response buttons
- Horizontal scrollable
- Tap to send

### Colors

- Background: `bg-white`
- AI Bubble: Light gray/blue
- User Bubble: Green (primary color)
- Input Bar: White with border

### AI User Configuration

```javascript
{
  _id: 'ai-assistant',
  name: 'AI Assistant',
  avatar: icons.aichat
}
```

### User Configuration

```javascript
{
  _id: 'user',
  name: 'Bạn',
  avatar: icons.userchat
}
```

---

## 👤 Profile Screen

**File**: `app/(root)/tabs/profile.tsx`

### Layout Structure

```
SafeAreaView
└── ScrollView (px-4, paddingBottom: 120)
    ├── Title "Hồ sơ của tôi"
    │   └── text-2xl font-JakartaBold
    ├── Avatar Section (centered)
    │   └── Image (110x110 circular)
    │       └── border-[3px] border-white shadow
    └── Info Card (bg-white rounded-lg shadow)
        ├── InputField "Tên" (disabled)
        ├── InputField "Họ" (disabled)
        ├── InputField "Email" (disabled)
        └── InputField "Số điện thoại" (disabled)
```

### Colors

- Background: Default (white)
- Title: `text-2xl font-JakartaBold`
- Avatar Border: `border-white`
- Avatar Shadow: `shadow-neutral-300`
- Info Card: `bg-white rounded-lg shadow-sm shadow-neutral-300`

### Components Used

- `InputField` (read-only mode)
- `Image` (user avatar)
- `ScrollView`

### Styling

```
- Avatar: w-[110px] h-[110px] rounded-full border-[3px]
- Info Card: p-4 bg-white rounded-lg shadow-sm
- Input Fields: p-3.5 (disabled state)
```

---

## 🎨 Design Patterns & Guidelines

### 1. Spacing System

```
- Extra Small: p-1, m-1 (4px)
- Small: p-2, m-2 (8px)
- Medium: p-3, m-3 (12px)
- Default: p-4, m-4 (16px)
- Large: p-5, m-5 (20px)
- Extra Large: p-6, m-6 (24px)
```

### 2. Border Radius

```
- Small: rounded (4px)
- Medium: rounded-lg (8px)
- Large: rounded-xl (12px)
- Extra Large: rounded-2xl (16px)
- Full: rounded-full (9999px)
```

### 3. Shadow System

```
- Small: shadow-sm
- Medium: shadow-md
- Custom: shadow-neutral-300, shadow-neutral-400/70
```

### 4. Layout Patterns

#### Card Pattern

```
View
├── bg-white
├── rounded-lg / rounded-xl
├── shadow-sm shadow-neutral-300
├── p-4
└── Content
```

#### Section Header Pattern

```
Text
├── text-xl / text-2xl
├── font-JakartaBold
├── mb-3 / mb-4
└── text-secondary-900 / text-white
```

#### Input Container Pattern

```
View
├── bg-neutral-100
├── rounded-full
├── border border-neutral-100
├── focus:border-green-500
└── flex-row items-center
```

### 5. Icon Usage

- Size Small: 16px
- Size Medium: 20-24px
- Size Large: 28-32px
- Color: Matches theme or white on colored backgrounds

### 6. Button States

- **Default**: Full opacity, shadow
- **Pressed**: Reduced opacity (0.8)
- **Disabled**: Reduced opacity (0.5), no shadow

### 7. Modal Pattern

```
Modal (transparent: true)
└── Overlay (rgba(0,0,0,0.5))
    └── Card (bg-white rounded-2xl p-6)
        ├── Icon/Image
        ├── Title (text-xl font-JakartaBold)
        ├── Description (text-gray-600)
        ├── Content
        └── Actions (flex-row gap-x-4)
```

---

## 📱 Responsive Design Notes

### Screen Sizes Support

- Small phones: 320px width
- Medium phones: 375px width
- Large phones: 414px width
- Tablets: 768px+ width

### Adaptive Elements

- Images: Use `resizeMode='contain'` or `resizeMode='cover'`
- Text: Use `numberOfLines` for truncation
- Scrollable containers: Use `ScrollView` or `FlatList`
- Bottom sheets: Configurable snap points

### Safe Area Handling

- Use `SafeAreaView` for top-level screens
- Use `useSafeAreaInsets()` for custom padding
- Account for notches and home indicators

---

## 🎯 Animation Guidelines

### Transition Animations

- Modal entrance: Scale + Fade (0.3s)
- Screen transitions: Slide (0.25s)
- Button press: Scale (0.1s)

### Loading States

- Spinner: `ActivityIndicator` (green color)
- Progress bar: Animated width
- Skeleton screens: Light gray shimmer

### Micro-interactions

- Button press: Scale down slightly
- Input focus: Border color change
- List item press: Background color change

---

## 🔧 Technical Implementation Notes

### State Management

- Location: Zustand store (`useLocationStore`)
- Driver selection: Zustand store (`useDriverStore`)
- Authentication: Clerk hooks (`useAuth`, `useUser`)

### Navigation

- Stack navigation for auth flow
- Tab navigation for main app
- Modal presentation for overlays

### Data Fetching

- Custom `fetchAPI` utility
- Error handling with try-catch
- Loading states with useState

### Form Handling

- Controlled inputs with useState
- Validation before submission
- Error display below fields

---

## 📦 Assets Required

### Icons

- Navigation icons (home, rides, chat, profile)
- Action icons (search, location, star, etc.)
- Status icons (checkmark, close, warning, etc.)
- Social icons (Google)

### Images

- Onboarding illustrations (3 images)
- Car images (various types)
- Sign up/in header image
- Empty state illustrations
- User avatars (default)
- AI chat avatar

### Fonts

- Jakarta family (7 weights)
- Fallback: System sans-serif

---

## 🎨 Brand Identity

### Primary Brand Color

- Green (#16a34a, #38A169) - Trust, Growth, Eco-friendly

### Color Psychology

- Green: Safety, reliability, eco-conscious
- White: Clean, modern, simple
- Gray: Professional, neutral
- Red: Urgency, alerts, errors
- Orange: Warnings, in-progress states

### Design Philosophy

- **Clean**: Minimal clutter, ample white space
- **Modern**: Rounded corners, subtle shadows
- **Friendly**: Emojis, conversational text
- **Professional**: Consistent typography, proper hierarchy
- **Accessible**: High contrast, readable fonts

---

## 📝 Notes for Designers

### Re-design Considerations

1. **Maintain Brand Colors**: Keep the green theme as primary
2. **Improve Contrast**: Ensure WCAG AA compliance
3. **Enhance Iconography**: Consider custom icon set
4. **Refine Typography**: Optimize font sizes for readability
5. **Add Illustrations**: Custom illustrations for empty states
6. **Improve Animations**: Smooth, meaningful transitions
7. **Dark Mode**: Consider dark theme variant
8. **Accessibility**: Screen reader support, larger touch targets

### Current Strengths

- Consistent color palette
- Clear component hierarchy
- Good use of white space
- Intuitive navigation
- Responsive layouts

### Areas for Improvement

- More distinctive visual identity
- Enhanced micro-interactions
- Better loading states
- More engaging empty states
- Richer illustrations
- Advanced animations

---

## 🔗 Component Dependencies

### External Libraries

- `react-native-maps`: Map display
- `@gorhom/bottom-sheet`: Bottom sheet UI
- `react-native-gifted-chat`: Chat interface
- `react-native-qrcode-svg`: QR code generation
- `@stripe/stripe-react-native`: Payment processing
- `@clerk/clerk-expo`: Authentication
- `react-native-modal`: Modal dialogs
- `expo-vector-icons`: Icon library

### Custom Components Hierarchy

```
Common/
├── CustomButton
├── InputField
├── GoogleTextInput
├── DriverCard
├── Map
├── OAuth
└── StarRating

Home/
├── QuickActions
├── Features
├── AdditionalServices
├── PolygonLuminary
└── Stats

Ride/
├── RideLayout
├── RideCard
├── Payment
└── RatingModal

Chat/
├── ChatHeader
├── ChatInterface
├── ChatBubble
├── ChatInput
├── QuickReplies
└── AIAssistant

Payment/
└── QRPaymentModal
```

---

## 📊 Screen Flow Diagram

```
Welcome (Onboarding)
    ↓
Sign Up / Sign In
    ↓
Home (Tabs)
├── Home Tab
│   ├── Search Location
│   ├── View Map
│   └── Quick Actions
│       ├── Book Ride → Find Ride → Confirm Ride → Book Ride
│       └── View History → Rides Tab
├── Rides Tab
│   ├── View All Rides
│   └── Cancel Ride (if applicable)
├── Chat Tab
│   ├── Chat with AI
│   └── Quick Replies
└── Profile Tab
    └── View Profile Info
```

---

## 🎯 Design Tokens Summary

### Colors (Hex Values)

```javascript
const colors = {
  primary: {
    main: "#16a34a",
    light: "#22c55e",
    lighter: "#86efac",
    lightest: "#dcfce7",
  },
  success: {
    main: "#38A169",
    accent: "#0CC25F",
  },
  background: {
    main: "#FFFFFF",
    light: "#F6F8FA",
    lightBlue: "#E6F3FF",
    gray: "#EEEEEE",
  },
  text: {
    primary: "#333333",
    secondary: "#666666",
    placeholder: "#AAAAAA",
    light: "#858585",
  },
  border: {
    light: "#F1F1F1",
    medium: "#D9D9D9",
    dark: "#EBEBEB",
  },
};
```

### Spacing Scale

```javascript
const spacing = {
  xs: 4, // 0.25rem
  sm: 8, // 0.5rem
  md: 12, // 0.75rem
  base: 16, // 1rem
  lg: 20, // 1.25rem
  xl: 24, // 1.5rem
  "2xl": 32, // 2rem
  "3xl": 48, // 3rem
};
```

### Typography Scale

```javascript
const fontSize = {
  xs: 12, // text-xs
  sm: 14, // text-sm
  base: 16, // text-base
  md: 18, // text-md (custom)
  lg: 20, // text-lg
  xl: 24, // text-xl
  "2xl": 28, // text-2xl
  "3xl": 32, // text-3xl
};
```

---

## 📄 Export Information

**Document Version**: 1.0  
**Last Updated**: 2025-12-27  
**Project**: Uber Clone Mobile App  
**Platform**: React Native (Expo)  
**Design System**: TailwindCSS + NativeWind

---

**Ghi chú**: Tài liệu này được tạo tự động từ source code. Vui lòng tham khảo các file component thực tế để có thông tin chi tiết nhất về implementation.
