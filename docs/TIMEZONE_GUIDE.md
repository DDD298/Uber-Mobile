# Hướng dẫn xử lý Thời gian trong Project

## Múi giờ

Project này sử dụng **múi giờ Việt Nam (Asia/Ho_Chi_Minh, UTC+7)** làm múi giờ chính.

## Thư viện sử dụng

- `date-fns`: Thư viện xử lý ngày tháng hiện đại
- `date-fns-tz`: Extension cho date-fns để xử lý timezone

## Các hàm utility trong `lib/utils.ts`

### 1. Lấy thời gian hiện tại

```typescript
// Lấy thời gian Việt Nam dưới dạng ISO string
const currentTime = getVietnamTime();
// Output: "2026-01-09T06:40:00.000Z" (đã convert sang VN timezone)

// Lấy thời gian Việt Nam formatted để hiển thị
const formattedTime = getVietnamTimeFormatted();
// Output: "2026-01-09 13:40:00 (+07:00)"

// Lấy thời gian Việt Nam để lưu vào database
const dbTime = getVietnamTimeAsUTC();
// Output: ISO string đã convert sang VN timezone
```

### 2. Format ngày tháng

```typescript
// Format ngày theo định dạng Việt Nam (dd/MM/yyyy)
const dateVN = formatDateVN("2026-01-09T06:40:00.000Z");
// Output: "09/01/2026"

// Format ngày giờ đầy đủ
const dateTimeVN = formatDateTimeVN("2026-01-09T06:40:00.000Z");
// Output: "09/01/2026 13:40"

// Format ngày theo định dạng tiếng Anh
const dateEN = formatDate("2026-01-09T06:40:00.000Z");
// Output: "09 January 2026"
```

### 3. Format thời gian

```typescript
// Format phút thành HH:mm
const time1 = formatTimeVN(125); // 125 phút
// Output: "02:05"

// Format timestamp thành HH:mm
const time2 = formatTimeVN(1704783600000); // timestamp
// Output: "13:40" (theo giờ VN)
```

### 4. Convert timezone

```typescript
// Convert một date string sang Vietnam timezone
const vnDate = toVietnamTime("2026-01-09T06:40:00.000Z");
// Output: Date object đã convert sang VN timezone
```

## Quy tắc sử dụng

### ✅ Nên làm:

1. **Lưu vào Database**: Luôn sử dụng `getVietnamTimeAsUTC()` hoặc `getVietnamTime()`

   ```typescript
   const created_at = getVietnamTimeAsUTC();
   await sql`INSERT INTO rides (created_at) VALUES (${created_at})`;
   ```

2. **Hiển thị cho người dùng**: Sử dụng `formatDateVN()` hoặc `formatDateTimeVN()`

   ```typescript
   <Text>{formatDateVN(ride.created_at)}</Text>
   ```

3. **So sánh thời gian**: Sử dụng timestamp (getTime())
   ```typescript
   const now = new Date();
   const rideTime = new Date(ride.created_at);
   const diffMinutes = (now.getTime() - rideTime.getTime()) / (1000 * 60);
   ```

### ❌ Không nên làm:

1. **Không** sử dụng `new Date()` trực tiếp để lưu vào database
2. **Không** cộng/trừ offset thủ công (7 _ 60 _ 60 \* 1000)
3. **Không** dùng `toLocaleDateString()` - kết quả phụ thuộc vào thiết bị

## Ví dụ thực tế

### Tạo chuyến đi mới

```typescript
// ✅ Đúng
const vietnamTime = getVietnamTimeAsUTC();
await sql`
  INSERT INTO rides (created_at) 
  VALUES (${vietnamTime})
`;

// ❌ Sai
const wrongTime = new Date().toISOString();
```

### Hiển thị thông tin chuyến đi

```typescript
// ✅ Đúng
<Text>Ngày: {formatDateVN(ride.created_at)}</Text>
<Text>Giờ: {formatTimeVN(ride.ride_time)}</Text>

// ❌ Sai
<Text>Ngày: {new Date(ride.created_at).toLocaleDateString()}</Text>
```

### Kiểm tra thời gian hủy chuyến

```typescript
// ✅ Đúng
const rideCreatedAt = new Date(ride.created_at);
const now = new Date();
const timeDiffInMinutes =
  (now.getTime() - rideCreatedAt.getTime()) / (1000 * 60);

if (timeDiffInMinutes > 10) {
  return { canCancel: false };
}
```

## Lưu ý quan trọng

1. **Database timestamps**: Tất cả timestamps trong database đã được convert sang VN timezone trước khi lưu
2. **API responses**: Timestamps từ API đã ở VN timezone, chỉ cần format để hiển thị
3. **User input**: Khi nhận thời gian từ user, cần convert sang VN timezone trước khi lưu
4. **Comparisons**: So sánh timestamps luôn an toàn vì đều là UTC internally

## Testing

Để test timezone handling:

```typescript
// Test format date
console.log(formatDateVN(new Date().toISOString()));
// Expected: "09/01/2026" (ngày hiện tại theo VN)

// Test format time
console.log(formatTimeVN(Date.now()));
// Expected: "13:40" (giờ hiện tại theo VN)

// Test Vietnam time
console.log(getVietnamTimeFormatted());
// Expected: "2026-01-09 13:40:00 (+07:00)"
```
