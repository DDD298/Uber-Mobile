## Đề xuất tính năng mở rộng cho dự án Uber Clone

### 1. Tổng quan hiện trạng project

- **Nền tảng**: Ứng dụng mobile dùng Expo/React Native.
- **Các phần đã có**:
  - Đăng ký/đăng nhập, luồng auth (`app/(auth)`).
  - Màn hình đặt xe: tìm chuyến, xác nhận chuyến (`book-ride`, `find-ride`, `confirm-ride`).
  - Tabs: `home`, `rides`, `profile`, `chat`.
  - Bản đồ, chọn điểm đi/điểm đến (`components/Common/Map`).
  - Thanh toán (Stripe API, các component trong `components/Payment`).
  - Chat & AI Assistant (`components/Chat`, `AIAssistant`).
  - Các thư viện hỗ trợ: `lib/auth`, `lib/map`, `lib/pricing`, `lib/ride-booking`.

Mục tiêu là phát triển thêm các tính năng **có chiều sâu**, **hợp lý với thời gian làm khóa luận**, và **dễ trình bày trong báo cáo** (phân tích yêu cầu, thiết kế hệ thống, giải thuật, đánh giá).

---

### 2. Hệ thống tài xế & ghép chuyến (Driver & Matching System)

- **Ứng dụng tài xế / Chế độ Driver**:
  - Cho phép người dùng đăng ký trở thành tài xế, upload giấy tờ, chờ duyệt.
  - Trạng thái tài xế: `Online / Offline / Đang đón khách / Đang chở khách`.
  - Mỗi tài xế có hồ sơ: thông tin cá nhân, loại xe, biển số, số chuyến, rating.

- **Thuật toán ghép chuyến (matching)**:
  - Luồng xử lý cơ bản:
    1. Khách đặt chuyến (chọn điểm đi/đến).
    2. Backend tìm tài xế phù hợp (đang Online, gần nhất, rảnh).
    3. Gửi yêu cầu đến app tài xế → tài xế chấp nhận hoặc từ chối.
    4. Nếu tài xế từ chối hoặc hết thời gian chờ → tìm tài xế khác.
  - Tiêu chí ghép chuyến có thể gồm:
    - Khoảng cách từ tài xế đến điểm đón.
    - Rating của tài xế.
    - Số chuyến đã chạy trong ngày (cân bằng tải).
    - Loại xe phù hợp với yêu cầu (xe 4 chỗ, 7 chỗ, v.v.).
  - Có thể thiết kế một hàm **score**:  
    \\(score = w\_1 \cdot distance + w\_2 \cdot rating + w\_3 \cdot load + \dots\\)  
    rồi chọn tài xế có `score` tốt nhất.

- **Ý nghĩa cho khóa luận**:
  - Có thể xây dựng chương riêng về **giải thuật ghép chuyến**, mô tả:
    - Mô hình bài toán.
    - Các chiến lược: nearest driver, nearest + rating, v.v.
    - So sánh kết quả (thời gian chờ trung bình, quãng đường rỗng của tài xế).

---

### 3. Hệ thống theo dõi chuyến đi & an toàn (Trip Tracking & Safety)

- **Quản lý trạng thái chuyến đi (Trip State Machine)**:
  - Các trạng thái: `Searching driver → Driver accepted → Driver on the way → In trip → Completed / Cancelled`.
  - Đồng bộ trạng thái giữa:
    - App khách.
    - App tài xế.
    - (Tuỳ chọn) Admin dashboard.
  - Cài đặt bằng cơ chế realtime (WebSocket, hoặc dịch vụ realtime khác).

- **Real-time tracking nâng cao**:
  - Hiển thị vị trí thời gian thực của tài xế trên bản đồ.
  - Timeline/stepper thể hiện từng bước của chuyến đi.
  - Lưu lại lộ trình để phục vụ phân tích sau này (hồ sơ chuyến đi).

- **Tính năng an toàn**:
  - **Chia sẻ hành trình**:
    - Tạo link theo dõi chuyến đi để gửi cho người thân.
    - Thông tin hiển thị: vị trí hiện tại, điểm đến, thông tin tài xế, biển số.
  - **Nút SOS**:
    - Gửi cảnh báo khẩn cấp (vị trí hiện tại, thông tin chuyến) đến số điện thoại liên hệ khẩn hoặc server giám sát.
  - **Mã PIN xác thực chuyến**:
    - Khi tài xế đến điểm đón, khách cung cấp mã PIN 4 số để bắt đầu chuyến.
    - Giảm khả năng đi nhầm xe hoặc giả mạo tài xế.

- **Ý nghĩa cho khóa luận**:
  - Làm rõ thiết kế **state machine** cho chuyến đi.
  - Trình bày kiến trúc realtime, flow dữ liệu và các yêu cầu về an toàn người dùng.

---

### 4. Định giá chuyến đi nâng cao (Dynamic Pricing & ETA)

- **Mô hình tính giá cơ bản**:
  - Giá = \\(base\_fare + a \cdot distance + b \cdot time\\).
  - `base_fare`: giá mở cửa.
  - `distance`: quãng đường dự kiến (từ API bản đồ).
  - `time`: thời gian di chuyển ước tính.

- **Định giá động (Surge Pricing)**:
  - Tăng giá theo:
    - Giờ cao điểm (sáng, chiều).
    - Khu vực có nhu cầu cao (near center, sân bay, trường học giờ tan tầm).
  - Hệ số nhân: `surge_multiplier` (ví dụ 1.0, 1.2, 1.5, 2.0).
  - Có thể mô phỏng dữ liệu để biểu diễn các kịch bản: ngày thường, mưa, lễ Tết.

- **Dự đoán ETA (Estimated Time of Arrival)**:
  - Giai đoạn 1: Dùng trực tiếp API bản đồ (Google/Mapbox) để lấy ETA.
  - Giai đoạn 2 (nâng cao):
    - Thu thập dữ liệu giả lập: quãng đường, giờ trong ngày, điều kiện đường (giả lập), thời gian thực tế.
    - Dùng mô hình thống kê đơn giản (ví dụ: hồi quy tuyến tính) để dự đoán ETA.
    - So sánh sai số với ETA từ API bản đồ (nếu có).

- **Ý nghĩa cho khóa luận**:
  - Chương riêng về **mô hình định giá** và **dự đoán ETA**.
  - Có thể làm phần đánh giá bằng cách so sánh các phương án tính giá khác nhau.

---

### 5. Hệ thống đánh giá, gợi ý & loyalty (Ratings, Recommendation, Loyalty)

- **Đánh giá tài xế & khách**:
  - Sau mỗi chuyến, khách đánh giá tài xế (sao + bình luận).
  - Tài xế cũng có thể đánh giá khách (tuỳ chọn).
  - Cơ chế xử lý:
    - Nếu tài xế bị nhiều đánh giá xấu liên tiếp → cảnh báo, tạm khoá hoặc đưa vào review.

- **Hệ thống gợi ý (Recommendation)**:
  - Gợi ý:
    - Tuyến đường thường đi (nhà ↔ trường, nhà ↔ công ty).
    - Loại xe thường chọn (xe 4 chỗ/7 chỗ).
    - Khung giờ khách hay đặt.
  - Có thể sử dụng:
    - Rule-based (dựa trên thống kê lịch sử).
    - Hoặc mô hình đơn giản (gợi ý top-N tuyến phổ biến của chính user).

- **Loyalty & điểm thưởng**:
  - Mỗi chuyến đi +X điểm.
  - Xây dựng hệ thống hạng: Silver / Gold / Platinum.
  - Quyền lợi: giảm giá %, ưu tiên ghép tài xế tốt, voucher.

- **Ý nghĩa cho khóa luận**:
  - Thể hiện được **khía cạnh kinh doanh** và **cá nhân hóa trải nghiệm**.
  - Có thể trình bày như một hệ thống gợi ý đơn giản nhưng trực quan.

---

### 6. Nâng cấp AI Assistant trong ứng dụng

Hiện dự án đã có `AIAssistant` và `ChatInterface`. Có thể mở rộng theo các hướng:

- **Trợ lý đặt xe bằng ngôn ngữ tự nhiên**:
  - Người dùng gõ: “Đặt xe từ nhà đến trường lúc 7h sáng mai”.
  - AI phân tích câu để trích xuất:
    - Địa điểm xuất phát (nhà – mapping với địa chỉ đã lưu).
    - Địa điểm đến (trường – mapping với địa chỉ đã lưu).
    - Thời gian (7h sáng mai).
  - App tự động pre-fill form đặt xe, người dùng chỉ cần xác nhận.

- **Hỗ trợ đa ngôn ngữ (Việt/Anh)**:
  - Phát hiện ngôn ngữ đầu vào.
  - Trả lời bằng ngôn ngữ tương ứng.

- **AI phân tích thói quen di chuyển**:
  - Dựa vào lịch sử chuyến đi:
    - Gợi ý tuyến gần nhất với thói quen.
    - Gợi ý khung giờ đặt xe trước để tránh kẹt xe.

- **Ý nghĩa cho khóa luận**:
  - Phù hợp nếu khoa của bạn thiên về **AI/NLP**.
  - Có thể mô tả pipeline: nhận input → NLU (Intent, Entity) → Mapping sang action → Trả kết quả.

---

### 7. Hệ thống quản trị (Admin Dashboard)

- **Web admin (ứng dụng web riêng)**:
  - Đăng nhập admin.
  - Quản lý user (khách), tài xế.
  - Quản lý chuyến đi, theo dõi trạng thái, xử lý khiếu nại.
  - Duyệt hồ sơ tài xế: giấy tờ, xe, bằng lái.

- **Giám sát theo thời gian thực**:
  - Bản đồ hiển thị vị trí các xe đang hoạt động.
  - Xem danh sách chuyến đi đang diễn ra, có thể can thiệp (huỷ, liên hệ).

- **Báo cáo & thống kê**:
  - Biểu đồ số chuyến đi theo ngày/tuần/tháng.
  - Doanh thu theo khu vực.
  - Tỷ lệ huỷ chuyến, tỷ lệ tài xế chấp nhận chuyến.

- **Ý nghĩa cho khóa luận**:
  - Giúp bạn có thêm chương về **quản trị & giám sát hệ thống**.
  - Nhiều biểu đồ, số liệu minh họa, dễ trình bày trong phần kết quả thực nghiệm.

---

### 8. Thanh toán & ví điện tử nội bộ

Hiện dự án đã tích hợp Stripe (các API dưới `app/(api)/(stripe)` và UI trong `components/Payment`). Có thể mở rộng:

- **Ví nội bộ (In-app Wallet)**:
  - Người dùng nạp tiền qua Stripe (hoặc cổng thanh toán khác).
  - Số dư được lưu trong hệ thống.
  - Khi thanh toán chuyến đi, tiền trừ trực tiếp từ ví.
  - Lưu lịch sử giao dịch đầy đủ.

- **Đối soát doanh thu cho tài xế**:
  - Màn hình thống kê cho tài xế:
    - Doanh thu theo ngày/tuần.
    - Số chuyến đã chạy.
    - Phí nền tảng bị trừ.

- **Ý nghĩa cho khóa luận**:
  - Cho phép phân tích về **luồng thanh toán**, **bảo mật**, **toàn vẹn dữ liệu**.
  - Có thể mô tả mô hình transaction log, xử lý lỗi khi thanh toán.

---

### 9. Gợi ý tổ hợp tính năng thành đề tài khóa luận

Để không bị lan man, nên chọn một **chủ đề chính**, rồi chọn các tính năng liên quan:

- **Đề tài 1: Hệ thống ghép chuyến & định giá động cho ứng dụng đặt xe**:
  - Tính năng chính:
    - Hệ thống tài xế & matching.
    - Quản lý trạng thái chuyến đi.
    - Dynamic pricing & ETA.
  - Trọng tâm báo cáo:
    - Mô hình hoá bài toán ghép chuyến.
    - Thiết kế và so sánh các chiến lược matching.
    - Phân tích tác động của các tham số định giá.

- **Đề tài 2: Ứng dụng đặt xe thông minh tích hợp trợ lý AI và hệ thống gợi ý**:
  - Tính năng chính:
    - AI Assistant đặt xe bằng ngôn ngữ tự nhiên.
    - Gợi ý tuyến đường, loại xe, giờ đặt xe.
    - Hệ thống đánh giá & loyalty.
  - Trọng tâm báo cáo:
    - Thiết kế pipeline NLP.
    - Mô hình hoá hệ thống gợi ý.
    - Đánh giá độ hài lòng/tiện lợi qua kịch bản sử dụng.

- **Đề tài 3: Nền tảng quản lý và giám sát dịch vụ đặt xe theo thời gian thực**:
  - Tính năng chính:
    - Real-time tracking, state machine chuyến đi.
    - Admin dashboard giám sát tài xế & chuyến đi.
    - Tính năng an toàn (SOS, chia sẻ hành trình).
  - Trọng tâm báo cáo:
    - Kiến trúc hệ thống realtime.
    - Thiết kế cơ chế giám sát, cảnh báo.
    - Phân tích khả năng mở rộng và độ tin cậy.

---

### 10. Hướng dẫn chọn và triển khai

- **Chọn theo hướng mạnh của bản thân**:
  - Nếu mạnh về **lập trình hệ thống/giải thuật** → chọn Đề tài 1.
  - Nếu thích **AI/NLP, trải nghiệm người dùng thông minh** → chọn Đề tài 2.
  - Nếu thích **kiến trúc hệ thống, quản trị, realtime** → chọn Đề tài 3.

- **Lộ trình triển khai gợi ý**:
  1. Hoàn thiện lại **MVP** hiện có: đảm bảo flow đặt chuyến, thanh toán, bản đồ hoạt động ổn định.
  2. Chọn **1 đề tài chính**, list ra 3–5 tính năng cốt lõi nhất.
  3. Thiết kế kiến trúc (sơ đồ use case, sequence, ERD, component diagram).
  4. Cài đặt tính năng theo từng module nhỏ, kèm test cơ bản.
  5. Thu thập dữ liệu mô phỏng/chạy thử để có **số liệu, biểu đồ** cho báo cáo.

File này có thể dùng làm **phụ lục hoặc phần định hướng** trong báo cáo khóa luận, và là checklist để phát triển dần trong quá trình làm project.


