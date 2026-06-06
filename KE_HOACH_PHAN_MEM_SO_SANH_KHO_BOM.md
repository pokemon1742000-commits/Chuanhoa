# Ke Hoach Tao Phan Mem So Sanh Du Lieu Kho Va Du Lieu Thiet Ke

## 1. Muc Tieu

Tao mot phan mem desktop co the:

- Load file Excel **Du Lieu Kho**.
- Co the them nhieu file Du Lieu Kho; du lieu se duoc cong don.
- Moi file Excel dau vao chi co 1 sheet.
- Tach du lieu trong cot A theo dau `,`.
- Hien thi bang du lieu kho da chuan hoa.
- Load file Excel **Du Lieu Thiet Ke**.
- Co the them nhieu file Du Lieu Thiet Ke; du lieu se duoc cong don.
- Lay cac truong can thiet tu BOM: ten mat hang, ma ban ve, nha san xuat, so luong/may.
- So sanh 2 file theo **ma ban ve** va **so luong/may**.
- Dung fuzzy search/fuzzy matching de tim cac ma gan giong nhau.
- Xuat file Excel ket qua gom cac bang:
  - `Du Lieu Kho`
  - `Du Lieu Thiet Ke`
  - `So Sanh`
  - `Thieu Thua`
  - `Xac Nhan Ma`
- Xuat rieng file Excel chi gom bang `So Sanh` de xem nhanh thieu/thua/du.
- Xuat rieng file Excel chi gom bang `Thieu Thua` de xem ma co trong BOM nhung khong co trong kho va nguoc lai.
- Clear toan bo du lieu da load khi can lam lai tu dau.
- Theme duoc chon bang cac icon tron nho o goc trai duoi.
- Mau nen phu thuoc vao theme dang chon; khong dung nen hong co dinh.
- Bo nut so sanh; khi da co ca Du Lieu Kho va Du Lieu Thiet Ke thi app tu dong so sanh.
- Theme hien tai gom: Binh minh, Bac ha, Bau troi, Oai huong.
- Nut load kho/BOM tu doi nhan: khi chua co du lieu hien `Du Lieu Kho` / `Du Lieu Thiet Ke`, khi da co du lieu hien `Them Du Lieu Kho` / `Them Du Lieu Thiet Ke`.
- Nguong `Tu ghep` va `Can xac nhan` nam ben phai thanh tab de mo rong khu vuc bang.
- Ten file da load hien rieng thanh hai nhom: `Du Lieu Kho` va `Du Lieu Thiet Ke`.
- Duong dan file da load lan cuoi duoc luu vao file temp `inventory-compare-recent-files.json`; khi mo app lai se tu doc va khoi phuc cac file con ton tai.
- Bo tab `Xac Nhan Ma`; cac ma can xac nhan hien o dau bang `So Sanh`.
- Khi chon hoac bo qua ma can xac nhan, app khong tu chuyen sang tab khac.
- Neu chi co `Du Lieu Kho`, toan bo ma duoc dua vao `Thieu Thua` voi trang thai `Thua`.
- Neu chi co `Du Lieu Thiet Ke`, toan bo ma duoc dua vao `Thieu Thua` voi trang thai `Thieu`.
- Trong `Thieu Thua`, ma `Thieu` duoc to nen do nhat.

## 2. Nen Tang Ky Thuat

Du an hien tai la ung dung Electron gom:

- `index.html`: giao dien chinh.
- `main.js`: tien trinh chinh cua Electron.
- `package.json`: cau hinh package va script chay app.

Can bo sung cac thanh phan:

- `preload.js`: cau noi an toan giua giao dien va Electron.
- `renderer.js`: xu ly logic tren giao dien.
- `style.css`: tach rieng CSS khoi `index.html`.

Thu vien can cai them:

```bash
npm install xlsx fuse.js
```

Co the can them thu vien bang neu muon hien thi giong Excel:

```bash
npm install tabulator-tables
```

## 3. Module Load Du Lieu Kho

### 3.1. Nut Chuc Nang

Them nut:

- `Them Du Lieu Kho`

Khi bam nut:

1. Mo hop thoai chon file Excel.
2. Doc sheet dau tien bang thu vien `xlsx`.
3. Lay du lieu trong cot A.
4. Tach tung dong theo dau `,`.
5. Chuan hoa thanh bang kho.
6. Cong don vao du lieu kho dang co trong app, khong xoa file da load truoc do.

### 3.2. Du Lieu Dau Vao Mau

```text
AUTS260311, S260311-FR7-001, 2, PMA, NK-PMA-260520, 20/05/2026, MKAC-PMA-260415-2
```

### 3.3. Bang Kho Sau Khi Tach

Bang **Du Lieu Kho** gom cac cot:

| Cot | Noi dung |
| --- | --- |
| A | STT |
| B | Ten ma du an |
| C | Ma ban ve |
| D | So luong/may, la so luong cho mot may |
| E | Nha san xuat |
| F | Ngay nhap kho |
| G | N/A |

### 3.4. Cau Truc Du Lieu Noi Bo

```js
const khoRows = [
  {
    projectCode: "AUTS260311",
    drawingCode: "S260311-FR7-001",
    quantity: 2,
    manufacturer: "PMA",
    importCode: "NK-PMA-260520",
    importDate: "20/05/2026",
    note: "MKAC-PMA-260415-2"
  }
];
```

## 4. Module Load Du Lieu Thiet Ke

### 4.1. Nut Chuc Nang

Them nut:

- `Them Du Lieu Thiet Ke`

Khi bam nut:

1. Mo hop thoai chon file Excel.
2. Doc sheet dau tien bang `xlsx`.
3. Lay cac cot BOM theo format tieu de co dinh:
   - `Ten mat hang`
   - `Model / Ma ban ve`
   - `Nha San xuat`
   - `So luong/May`
4. Chuan hoa thanh bang BOM.
5. Cong don vao du lieu BOM dang co trong app, khong xoa file da load truoc do.

### 4.2. Bang Bomlist Sau Khi Load

Bang **Du Lieu Thiet Ke** gom cac cot:

| Cot | Noi dung |
| --- | --- |
| A | STT |
| B | Ten mat hang |
| C | Ma ban ve |
| D | Nha san xuat |
| E | So luong/may |

### 4.3. Cau Truc Du Lieu Noi Bo

```js
const bomRows = [
  {
    itemName: "TAM DEM",
    drawingCode: "2205005-FR1-002",
    manufacturer: "",
    quantity: 8
  }
];
```

## 5. Chuan Hoa Du Lieu

Truoc khi so sanh, can chuan hoa du lieu ca 2 bang:

- Xoa khoang trang dau/cuoi.
- Chuyen ma ban ve ve chu hoa.
- Chuan hoa dau gach ngang.
- Chuyen `so luong/may` ve kieu so.
- Bo qua dong rong.
- Bo qua dong khong co ma ban ve.
- Xu ly cac dong trung ma ban ve.

Quy tac de xuat khi trung ma:

- Neu cung mot ma ban ve xuat hien nhieu lan trong kho, cong don so luong.
- Neu cung mot ma ban ve xuat hien nhieu lan trong BOM, cong don so luong.
- `So luong/may` trong kho duoc hieu la so luong cho mot may, khong phai tong ton kho.

## 6. Logic So Sanh

So sanh dua tren:

- `Ma ban ve`
- `So luong/may`

### 6.1. So Sanh Chinh Xac

Neu `ma ban ve` trong BOM trung hoan toan voi `ma ban ve` trong kho:

- Dua vao bang `So Sanh`.
- Tinh chenh lech:

```text
chenhLech = soLuongKho - soLuongBom
```

Trang thai:

| Dieu kien | Trang thai | Mau nen |
| --- | --- | --- |
| soLuongKho = soLuongBom | Äá»§ | Xanh |
| soLuongKho < soLuongBom | Thiáº¿u | Äá» |
| soLuongKho > soLuongBom | Thá»«a | Tráº¯ng |

### 6.2. Fuzzy Matching

Dung `fuse.js` de tim cac ma gan giong nhau.

De xuat nguong:

| Do tuong dong | Xu ly |
| --- | --- |
| >= 95% | Tu dong dua vao `So Sanh` |
| 70% - 94% | Dua vao `Xac Nhan Ma` |
| < 70% | Xem nhu khong co ma phu hop |

Luu y: nguong nay nen cho phep cau hinh trong app.

## 7. Bang So Sanh

Bang **So Sanh** chi hien thi cac ma da ghep va co so luong `Du`.

Bang **So Sanh** gom cac cot:

| Cot | Noi dung |
| --- | --- |
| STT | So thu tu |
| Ma BOM | Ma ban ve tu bomlist |
| Ma Kho | Ma ban ve tu Du Lieu Kho |
| Ten mat hang | Ten mat hang tu bomlist |
| Nha san xuat | Nha san xuat |
| So luong BOM | So luong/may trong bomlist |
| So luong Kho | So luong/may trong kho |
| Chenh lech | Kho - BOM |
| Trang thai | Äá»§ / Thiáº¿u / Thá»«a |
| Do tuong dong | Phan tram fuzzy matching |
| Ghi chu | Ghi ro ma co gop va gop bao nhieu dong |

Quy tac mau:

- `Äá»§`: ná»n xanh.

Quy tac so sanh da cap nhat:

- Láº¥y danh sÃ¡ch mÃ£ kho Ä‘Ã£ gá»™p lÃ m gá»‘c.
- Náº¿u nhiá»u dÃ²ng kho cÃ³ cÃ¹ng má»™t mÃ£ báº£n váº½, chá»‰ táº¡o má»™t dÃ²ng tá»•ng há»£p trong báº£ng `So Sanh`.
- Sá»‘ lÆ°á»£ng dÃ¹ng Ä‘á»ƒ so sÃ¡nh lÃ  tá»•ng sá»‘ lÆ°á»£ng Ä‘Ã£ cá»™ng dá»“n cá»§a mÃ£ Ä‘Ã³.
- Cac ma kho bi gop se co ghi chu cuoi dong, vi du `Co gop 3 dong, tong SL 12`.
- Neu `So luong Kho` bang `So luong BOM` thi dong do vao bang `So Sanh`.
- Neu `So luong Kho` khac `So luong BOM` thi dong do vao bang `Thieu Thua`.
- Neu ma kho chua ghep duoc voi ma BOM, tam xem la `Chi co trong kho` va dua vao bang `Thieu Thua`.

## 8. Bang Xac Nhan Ma

Bang **Xac Nhan Ma** dung cho cac ma ban ve gan giong nhau nhung chua du chac chan de tu dong ghep.

Bang gom cac cot:

| Cot | Noi dung |
| --- | --- |
| STT | So thu tu |
| Ma Kho | Ma ban ve trong kho, dung lam goc |
| So luong Kho | So luong kho da cong don |
| Ma BOM De Xuat | Dropdown chon mot trong cac ma BOM gan giong |
| Ten mat hang | Ten mat hang tu bomlist |
| So luong BOM | So luong trong bomlist |
| Do tuong dong | Phan tram giong nhau |
| Hanh dong | Chon / Bo qua |

Neu mot ma kho co nhieu ma BOM gan giong, app hien toi da 3 lua chon theo do tuong dong cao nhat, vi du 90%, 80%, 70%.

Khi nguoi dung bam `Chon`:

1. Ma Kho va ma BOM dang chon trong dropdown duoc xem la cung mot ma.
2. Dong du lieu chuyen sang bang `So Sanh`.
3. App tu tinh lai trang thai du/thieu/thua.

Khi nguoi dung bam `Bo qua`:

1. Tat ca ma BOM de xuat cho ma kho do bi danh dau bo qua.
2. Ma kho va cac ma BOM khong ghep se duoc tinh vao bang `Thieu Thua`.
3. App chuyen sang bang `Thieu Thua` de nguoi dung xem ket qua lech.

## 8.1. Bang Thieu Thua

Bang **Thieu Thua** gom cac cot:

| Cot | Noi dung |
| --- | --- |
| STT | So thu tu |
| Nguon | Chi co trong kho / Chi co trong BOM / Lech so luong |
| Ma BOM | Ma ban ve trong BOM |
| Ma Kho | Ma ban ve trong kho |
| Ten mat hang | Ten mat hang tu BOM |
| Nha san xuat | Nha san xuat |
| So luong BOM | So luong trong BOM |
| So luong Kho | So luong trong kho |
| Chenh lech | Kho - BOM |
| Trang thai | Thieu / Thua |
| Ghi chu | Ly do dua vao bang thieu thua |

Quy tac dua vao bang:

- Ma co trong BOM nhung khong co trong kho: `Thieu`.
- Ma co trong kho nhung khong co trong BOM: `Thua`.
- Ma co ca hai bang nhung so luong khac nhau: dua vao theo trang thai `Thieu` hoac `Thua`.
- Ma dang cho xac nhan khong hien trong `So Sanh`; truoc khi xac nhan se hien trong `Thieu Thua` theo dang `Chi co trong kho` va `Chi co trong BOM`.
- Sau khi xac nhan, neu so luong bang nhau thi chuyen vao `So Sanh`; neu van thieu/thua thi giu o `Thieu Thua`.

## 9. Xuat Bao Cao Excel

Them nut:

- `Xuat Bao Cao`
- `Xuat Excel`
- `Clear du lieu`

File Excel xuat ra gom cac sheet:

1. `Du Lieu Kho`
2. `Du Lieu Thiet Ke`
3. `So Sanh`
4. `Thieu Thua`
5. `Xac Nhan Ma`

Nut `Xuat Excel` hoat dong theo bang dang chon:

- Neu dang o bang `So Sanh`, xuat sheet `So Sanh`.
- Neu dang o bang `Thieu Thua`, xuat sheet `Thieu Thua`.

Nut `Clear du lieu` xoa:

- Danh sach kho da load.
- Danh sach BOM da load.
- Bang `So Sanh`.
- Bang `Thieu Thua`.
- Bang `Xac Nhan Ma`.
- Cac lua chon xac nhan ma thu cong.

Ten file de xuat:

```text
BaoCao_SoSanh_YYYYMMDD_HHmm.xlsx
```

Sheet `So Sanh` can co mau nen:

- Khong to nen xanh cho ma du.
- Khong to nen do cho ma thieu; chi in dam chu thieu.
- Trang cho ma thua.

## 10. Giao Dien De Xuat

Thanh ben trai:

- Bang thong ke
- Du Lieu Kho
- Du Lieu Thiet Ke
- So Sanh
- Xac Nhan Ma
- Xuat Bao Cao

Khu vuc chinh:

- Hien thi bang theo menu dang chon.
- Font chu hien thi la Times New Roman de hien thi tieng Viet co dau ro rang.
- Thanh dieu huong chuyen sang dang ngang.
- Cac nut thao tac `Du Lieu Kho`, `Du Lieu Thiet Ke`, `So Sanh`, `Clear du lieu` xep doc trong panel thao tac.
- Goc trai duoi co icon tron chon theme: Binh minh, Bac ha, Bau troi, Oai huong.
- Co thanh tim kiem theo ma ban ve.
- Co thong ke nhanh:
  - Tong ma BOM
  - Tong ma kho
  - So ma du
  - So ma thieu
  - So ma thua
  - So ma can xac nhan

## 11. Thu Tu Trien Khai

### Giai Doan 1: Nen Tang

1. Sua loi font tieng Viet trong giao dien hien tai.
2. Tach CSS va JS ra file rieng.
3. Them `preload.js` cho Electron.
4. Cai thu vien `xlsx` va `fuse.js`.

### Giai Doan 2: Load Va Hien Thi Du Lieu

1. Lam nut load file `Du Lieu Kho`.
2. Cho phep load nhieu file kho va cong don du lieu.
3. Tach cot A theo dau `,`.
4. Hien thi bang kho.
5. Lam nut load file `Du Lieu Thiet Ke`.
6. Cho phep load nhieu file BOM va cong don du lieu.
7. Lay cac cot can thiet tu BOM.
8. Hien thi bang bomlist.

### Giai Doan 3: So Sanh

1. Viet ham chuan hoa ma ban ve.
2. Viet ham so sanh exact match.
3. Hien thi bang `So Sanh`.
4. To mau theo trang thai du/thieu/thua.

### Giai Doan 4: Fuzzy Matching

1. Tich hop `fuse.js`.
2. Tim cac ma gan giong.
3. Dua ma chua chac chan vao bang `Xac Nhan Ma`.
4. Them nut `Chon` va `Bo qua`.
5. Khi chon, chuyen du lieu sang bang `So Sanh`.

### Giai Doan 5: Xuat Excel

1. Tao workbook bang `xlsx`.
2. Tao cac sheet can thiet.
3. Xuat file ket qua.
4. Kiem tra mau nen va dinh dang.

## 12. Cac Quy Tac Da Chot

1. Moi file Excel dau vao chi co 1 sheet.
2. Dong tieu de BOM luon co format co dinh nhu hinh mau.
3. `So luong/may` trong kho la so luong cho mot may.
4. Khi mot ma xuat hien nhieu dong trong kho, can cong don so luong.
5. Nguong fuzzy matching de tu dong ghep ma la 95%.
6. Cac ma fuzzy tu 70% den 94% dua vao bang `Xac Nhan Ma`.
7. Bang `So Sanh` lay danh sach ma kho da gop lam goc, khong lay BOM lam goc.

## 13. Phien Ban MVP De Lam Truoc

Phien ban toi thieu nen lam truoc:

1. Load file kho.
2. Load file BOM.
3. Hien thi 2 bang.
4. So sanh ma ban ve trung chinh xac.
5. Tinh du/thieu/thua.
6. Hien thi bang `So Sanh`.
7. Xuat Excel ket qua.

Sau khi MVP chay on dinh moi them:

- Fuzzy matching.
- Bang `Xac Nhan Ma`.
- Cau hinh nguong fuzzy.
- Bao cao mau dep hon.
- Tim kiem va loc nang cao.

