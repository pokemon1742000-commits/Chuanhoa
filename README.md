# Inventory Compare App

Phần mềm Electron dùng để load **Dữ Liệu Kho** và **Dữ Liệu Thiết Kế** từ file Excel, tự động so sánh mã bản vẽ và số lượng/máy, sau đó xuất báo cáo Excel.

## Tính năng chính

- Load nhiều file **Dữ Liệu Kho** và cộng dồn dữ liệu.
- Load nhiều file **Dữ Liệu Thiết Kế** và cộng dồn dữ liệu.
- Tự động so sánh khi đã có dữ liệu từ một hoặc cả hai nguồn.
- Tách dữ liệu kho từ cột A theo dấu `,`.
- Đọc BOM theo format cố định:
  - Tên mặt hàng
  - Mã bản vẽ
  - Nhà sản xuất
  - Số lượng/máy
- Cộng dồn số lượng khi một mã bản vẽ xuất hiện nhiều dòng.
- So sánh theo:
  - Mã bản vẽ
  - Số lượng/máy
- Fuzzy matching để đề xuất các mã bản vẽ gần giống.
- Hiển thị các bảng:
  - Bảng thống kê
  - Dữ Liệu Kho
  - Dữ Liệu Thiết Kế
  - So Sánh
  - Thiếu Thừa
- Gộp phần xác nhận mã vào đầu bảng `So Sánh`.
- Xuất riêng Excel cho bảng `So Sánh` hoặc `Thiếu Thừa`.
- Xuất báo cáo Excel đầy đủ gồm các sheet dữ liệu.
- Lưu đường dẫn file đã load gần nhất vào file temp; lần sau mở app sẽ tự khôi phục nếu file còn tồn tại.
- Hỗ trợ theme giao diện bằng các nút tròn nhỏ ở góc trái dưới.

## Cài đặt

Yêu cầu:

- Node.js
- npm

Cài dependencies:

```bash
npm install
```

## Chạy phần mềm

```bash
npm start
```

## Hướng dẫn sử dụng

### 1. Load Dữ Liệu Kho

1. Bấm nút `Dữ Liệu Kho`.
2. Chọn file Excel kho.
3. Sau khi load file đầu tiên, nút sẽ đổi thành `Thêm Dữ Liệu Kho`.
4. Có thể bấm tiếp để thêm nhiều file kho; dữ liệu sẽ được cộng dồn.

Format dữ liệu kho:

- Dữ liệu nằm trong cột A.
- Mỗi dòng có các giá trị cách nhau bằng dấu `,`.

Ví dụ:

```text
AUTS260311, S260311-FR7-001, 2, PMA, NK-PMA-260520, 20/05/2026, MKAC-PMA-260415-2
```

Sau khi tách, app lấy:

- Tên mã dự án
- Mã bản vẽ
- Số lượng/máy
- Nhà sản xuất
- Ngày nhập kho
- N/A

### 2. Load Dữ Liệu Thiết Kế

1. Bấm nút `Dữ Liệu Thiết Kế`.
2. Chọn file Excel BOM/thiết kế.
3. Sau khi load file đầu tiên, nút sẽ đổi thành `Thêm Dữ Liệu Thiết Kế`.
4. Có thể bấm tiếp để thêm nhiều file BOM; dữ liệu sẽ được cộng dồn.

File thiết kế được đọc theo các cột:

- Tên mặt hàng
- Model / Mã bản vẽ
- Nhà sản xuất
- Số lượng/máy

### 3. Tự động so sánh

App tự động so sánh sau khi load file.

Quy tắc:

- Nếu chỉ có `Dữ Liệu Kho`, tất cả mã sẽ nằm trong bảng `Thiếu Thừa` với trạng thái `Thừa`.
- Nếu chỉ có `Dữ Liệu Thiết Kế`, tất cả mã sẽ nằm trong bảng `Thiếu Thừa` với trạng thái `Thiếu`.
- Nếu có cả hai nguồn, app so sánh theo mã bản vẽ và số lượng/máy.
- Mã có số lượng bằng nhau sẽ nằm trong bảng `So Sánh`.
- Mã thiếu/thừa hoặc chỉ có trong một nguồn sẽ nằm trong bảng `Thiếu Thừa`.
- Mã gần giống nhau nhưng chưa chắc chắn sẽ hiện ở đầu bảng `So Sánh` để người dùng xác nhận.

### 4. Xác nhận mã gần giống

Trong bảng `So Sánh`, các mã cần xác nhận hiển thị ở phần đầu bảng.

- Cột `Mã BOM đề xuất` có dropdown để chọn mã phù hợp.
- Bấm `Chọn` để ghép mã kho với mã BOM đang chọn.
- Bấm `Bỏ qua` để bỏ qua các đề xuất cho mã đó.
- Sau khi chọn hoặc bỏ qua, app tính lại kết quả nhưng không tự chuyển sang tab khác.

### 5. Bảng Thiếu Thừa

Bảng `Thiếu Thừa` hiển thị các trường hợp:

- Mã có trong kho nhưng không có trong BOM.
- Mã có trong BOM nhưng không có trong kho.
- Mã có cả hai nguồn nhưng số lượng khác nhau.

Trạng thái:

- `Thiếu`: nền đỏ nhạt.
- `Thừa`: nền trắng.

### 6. Xuất Excel

Nút `Xuất Excel` hoạt động theo bảng đang xem:

- Nếu đang ở bảng `So Sánh`, xuất file Excel bảng `So Sánh`.
- Nếu đang ở bảng `Thiếu Thừa`, xuất file Excel bảng `Thiếu Thừa`.

Nút `Xuất báo cáo` sẽ xuất báo cáo đầy đủ gồm:

- Dữ Liệu Kho
- Dữ Liệu Thiết Kế
- So Sánh
- Thiếu Thừa
- Cần Xác Nhận, nếu có dữ liệu cần xác nhận

### 7. Clear dữ liệu

Bấm `Clear dữ liệu` để xóa:

- Dữ liệu kho đã load.
- Dữ liệu thiết kế đã load.
- Kết quả so sánh.
- Bảng thiếu/thừa.
- Các lựa chọn xác nhận.
- Đường dẫn file đã lưu trong temp.

## Lưu đường dẫn file gần nhất

App lưu đường dẫn file gần nhất vào file temp:

```text
inventory-compare-recent-files.json
```

Khi mở lại app, nếu các file vẫn còn tồn tại, app sẽ tự load lại và khôi phục dữ liệu.

## Cấu trúc file chính

- `main.js`: Electron main process, đọc/xuất Excel, lưu/khôi phục đường dẫn temp.
- `preload.js`: cầu nối API an toàn giữa renderer và Electron.
- `renderer.js`: xử lý giao diện, parse dữ liệu, so sánh, fuzzy matching.
- `index.html`: cấu trúc giao diện.
- `style.css`: giao diện và theme.
- `KE_HOACH_PHAN_MEM_SO_SANH_KHO_BOM.md`: kế hoạch và ghi chú triển khai.

## Ghi chú

- Mỗi file Excel đầu vào hiện tại đọc sheet đầu tiên.
- Ngưỡng fuzzy mặc định:
  - Tự ghép: 95%
  - Cần xác nhận: 70%
- Có thể thay đổi ngưỡng trên giao diện.
