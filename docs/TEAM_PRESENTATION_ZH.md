# Smart Book System — 團隊匯報
**粵語版本 | 20 頁幻燈片 | Team ERB-Team-A**

---

## 第 1 頁：封面

# Smart Book System
## 全棧圖書館管理平台

**Team ERB-Team-A**
**技術：** Node.js · Express · MongoDB · JWT · Vanilla JS
**每人報告時間：** 5 分鐘

---

## 第 2 頁：隊長 — 系統概述

**系統目的：** 數碼圖書館管理，包含借閱、願望清單同線上文庫。

**核心功能：**
- JWT 認證配合角色基礎訪問控制
- 書庫畫廊，即時庫存追蹤
- 借閱狀態機：有興趣 → 待審批 → 已借閱 → 已歸還
- 線上文庫閱讀器
- 管理員控制台，全面管理系統

**架構模式：** MVC 模式，Express 路由、Mongoose Model、靜態 HTML 前端。

---

## 第 3 頁：隊長 — 技術架構

| 層次 | 技術 |
|-------|-----------|
| **運行環境** | Node.js v18+ |
| **後端框架** | Express.js |
| **數據庫** | MongoDB + Mongoose ODM |
| **認證系統** | JWT (jsonwebtoken) + bcrypt |
| **前端技術** | HTML5, CSS3, Vanilla JavaScript |
| **部署平台** | Vercel / Render / Railway |

**核心檔案：**
- `app.js` — Express 入口點
- `config/db.js` — MongoDB 連接配置
- `middleware/` — 認證、角色守衛、錯誤處理

---

## 第 4 頁：隊長 + 成員 1 — 認證與用戶模組

**HTML 頁面：** `public/login.html`
- 登入同註冊分頁設計
- HTML5 表單驗證
- JWT Token 儲存於 `localStorage`
- 根據角色登入後自動跳轉

**Controller：** `controllers/authController.js`
- `registerUser` — 創建用戶、bcrypt 加密密碼、返回 JWT
- `loginUser` — 驗證憑證、返回 JWT
- `getMe` — 返回當前登入用戶資料

**Model：** `models/User.js`
- 欄位：`name`、`email`（唯一）、`password`（`select: false`）、`role`
- Pre-save hook 自動用 bcrypt 加密密碼
- `matchPassword()` 方法用於登入驗證

---

## 第 5 頁：隊長 + 成員 4 — 管理員控制台與用戶管理

**HTML 頁面：** `public/admin.html`
- 書籍管理表格，含新增/編輯/刪除彈出視窗
- 用戶管理表格，含創建/刪除功能
- 所有借閱記錄表格供管理員查閱
- 響應式 CSS Grid 佈局

**Controller：** `controllers/userController.js` + `controllers/bookController.js`
- `getUsers` — 列出所有用戶（排除密碼）
- `createUser` — 管理員創建新用戶帳號
- `deleteUser` — 刪除用戶連帶刪除借閱記錄
- Book CRUD 操作並檢查 ISBN 唯一性

**Model：** `models/User.js` + `models/Book.js`
- User schema 內含 `role` enum（`user` / `admin`）
- Book schema 內含 `isbn` 唯一約束同 `stock` 驗證

---

## 第 6 頁：隊長 + 成員 5 — 書庫畫廊與前端

**HTML 頁面：** `public/index.html`
- 即時搜尋輸入框
- 書籍網格顯示庫存狀態標籤（有現貨 / 存量低 / 售罄）
- 每本書顯示編輯同刪除按鈕
- 加載動畫同空狀態提示

**Controller：** `controllers/bookController.js`
- `getBooks` — 返回所有書籍（按新增時間排序）
- `searchBooks` — 不區分大小寫正則搜尋書名/作者
- `getBookById` — 單本書籍詳情
- `getBookContent` — 返回書本內容供閱讀器使用

**Model：** `models/Book.js`
- 欄位：`title`、`author`、`isbn`（唯一）、`totalQty`、`stock`、`content`
- 創建時 `stock` 預設等於 `totalQty`
- Timestamps 記錄建立同更新時間

---

## 第 7 頁：隊長 — 中介軟體與安全管線

**中介軟體堆疊（app.js）：**
1. `cors()` — 跨來源資源共享
2. `express.json()` / `express.urlencoded()` — 請求體解析
3. `express.static()` — 從 `public/` 提供前端檔案
4. JWT 驗證 via `protect` 中介軟體
5. 管理員專用 via `adminOnly` 守衛

**安全特性：**
- 密碼永遠不會在 API 回應中返回（`select: false`）
- JWT 過期時間（30 天）
- 管理員專用路由處理 destructive 操作
- 所有修改操作都有輸入驗證

---

## 第 8 頁：隊長 — 錯誤處理與 API 設計

**全域錯誤處理器：** `middleware/errorHandler.js`
- 捕獲 Mongoose 驗證錯誤 → 400
- 捕獲重複鍵錯誤 → 400 並返回欄位名稱
- 捕獲 JWT 錯誤 → 401
- 未定義路由 → 404 處理器

**REST API 設計：**
- `/api/auth/*` — 註冊、登入、個人資料
- `/api/books/*` — 書籍 CRUD + 搜尋 + 閱讀器
- `/api/borrow/*` — 願望清單、借閱申請、狀態更新
- `/api/users/*` — 管理員用戶管理
- `/api/health` — 健康檢查端點

---

## 第 9 頁：隊長 — 數據庫連接與種子數據

**數據庫配置：** `config/db.js`
- 伺服器啟動時延遲連接
- 連接字符串來自 `MONGO_URI` 環境變數
- 連接失敗時記錄錯誤並退出進程

**數據庫種子：** `seed.js`
- 創建 12 本演示書籍，每本包含章節內容
- 創建預設管理員：`admin@smartbook.com` / `admin123`
- 冪等性設計 — 可重複執行

**使用 Model：**
- `User.js` — 1 個管理員 + 演示用戶
- `Book.js` — 12 本書含 `totalQty`、`stock`、`content`
- `BorrowRecord.js` — 示例借閱記錄

---

## 第 10 頁：隊長 — 部署與 GitHub 工作流程

**分支策略：**
- `main` — 生產環境代碼，受保護
- `development` — 功能整合分支
- Feature branches → PR → Code Review → Merge

**GitHub 工作流程：**
1. Clone 倉庫並安裝依賴
2. 根據 `.env.example` 創建 `.env`
3. 執行 `npm run seed` 初始化數據庫
4. `npm run dev` 啟動伺服器（端口 5000）
5. 推送 feature branches 並開啟 PR

**免費部署選項：**
- Render（推薦）— 從 GitHub 自動部署
- Vercel — 無伺服器函數
- Railway — 快速部署

---

## 第 11 頁：成員 2 — 書庫與庫存模組概述

**成員 2 職責：** 書籍庫存管理、搜尋功能、管理員書籍工具。

**擁有檔案：**
- `models/Book.js`
- `controllers/bookController.js`
- `routes/bookRoutes.js`
- `public/index.html`
- `public/js/books.js`
- `public/admin.html`
- `public/js/admin.js`
- `public/reader.html`
- `public/js/reader.js`

**主要貢獻：** 完整的書籍生命週期，從創建到閱讀。

---

## 第 12 頁：成員 2 — HTML 頁面：書庫畫廊（`public/index.html`）

**用途：** 所有用戶的主要書籍瀏覽介面。

**結構：**
- 搜尋輸入框配合防抖即時過濾
- 書籍網格容器（`#bookGrid`）動態渲染卡片
- 「新增書籍」按鈕（僅管理員可見）
- 加載動畫同空狀態提示訊息

**用戶流程：**
1. 頁面載入 → `loadBooks()` 獲取 `/api/books`
2. 用戶輸入搜尋 → `searchBooks()` 查詢 `/api/books/search`
3. 管理員點擊「新增」 → 彈出表單 → POST 至 `/api/books`
4. Toast 通知確認成功或錯誤

---

## 第 13 頁：成員 2 — Controller：`controllers/bookController.js`

**REST 端點：**

| 方法 | 路由 | 訪問權限 | 函數 |
|--------|-------|--------|----------|
| GET | `/api/books` | 公開 | `getBooks` — 列出所有書籍 |
| GET | `/api/books/search` | 公開 | `searchBooks` — 正則搜尋 |
| GET | `/api/books/:id` | 公開 | `getBookById` — 單本書籍 |
| POST | `/api/books` | 管理員 | `createBook` — 新增書籍 |
| PUT | `/api/books/:id` | 管理員 | `updateBook` — 更新資料/庫存 |
| DELETE | `/api/books/:id` | 管理員 | `deleteBook` — 刪除書籍 |
| GET | `/api/books/:id/read` | 私人 | `getBookContent` — 閱讀器存取 |

**庫存邏輯：**
- `createBook` 設置 `stock = totalQty`
- `updateBook` 在 `totalQty` 變更時按比例調整庫存
- 明確庫存覆蓋經 `totalQty` 驗證

---

## 第 14 頁：成員 2 — Model：`models/Book.js`

**Schema 定義：**
```javascript
{
  title: String (必填, 最多 200 字),
  author: String (必填, 最多 100 字),
  isbn: String (必填, 唯一, 最多 20 字),
  totalQty: Number (必填, 最少 1, 預設 1),
  stock: Number (最少 0, 預設等於 totalQty),
  content: String (最多 50000 字)
}
```

**驗證規則：**
- 唯一 ISBN 防止重複輸入
- 庫存不能超過 `totalQty`
- 庫存不能為負數
- Timestamps 記錄建立同更新時間

**關聯關係：**
- 被 `BorrowRecord` 透過 `bookId` 引用
- 在 `bookController` 中用於所有 CRUD 操作

---

## 第 15 頁：成員 2 — 搜尋、庫存與閱讀器功能

**搜尋功能：**
- 不區分大小寫正則匹配 `title` 同 `author`
- `public/js/books.js` 內 300ms 防抖輸入監聽
- 返回排序結果（`createdAt` 降序）

**庫存狀態標籤：**
- `stock > 10` → 綠色「有現貨」
- `stock === 0` → 紅色「售罄」
- `0 < stock ≤ 10` → 黃色「餘下 X 本」

**書籍閱讀器：**
- `public/reader.html` — 簡潔閱讀介面
- `getBookContent` 檢查用戶是否已借閱（或是否管理員）
- 書籍內容從 `Book.content` 欄位渲染
- 返回按鈕導向 `member.html`

---

## 第 16 頁：成員 3 — 借閱與願望清單模組概述

**成員 3 職責：** 借閱狀態機、願望清單、借閱流程、會員中心頁面。

**擁有檔案：**
- `models/BorrowRecord.js`
- `controllers/borrowController.js`
- `routes/borrowRoutes.js`
- `public/member.html`
- `public/js/borrow.js`

**主要貢獻：** 完整借閱生命週期，包含庫存驗證同狀態機強制執行。

---

## 第 17 頁：成員 3 — HTML 頁面：會員中心（`public/member.html`）

**用途：** 已登入會員的個人儀表板。

**結構：**
- **個人資料卡** — 顯示用戶名稱、電郵、角色
- **願望清單卡** — 列出有興趣/待審批書籍，含借閱按鈕
- **借閱記錄卡** — 顯示借閱歷史，含狀態標籤同歸還按鈕

**用戶流程：**
1. 頁面載入 → `loadProfile()` 獲取 `/api/auth/me`
2. `loadWishlist()` 獲取 `/api/borrow/my-records` 按狀態篩選
3. 用戶點擊「借閱」 → POST `/api/borrow/checkout`
4. 用戶點擊「歸還」 → PUT `/api/borrow/status/:id` 狀態改為 `returned`

---

## 第 18 頁：成員 3 — Controller：`controllers/borrowController.js`

**狀態機流程：**
```
有興趣 → 待審批 → 已借閱 → 已歸還
```

**端點：**

| 方法 | 路由 | 訪問權限 | 函數 |
|--------|-------|--------|----------|
| POST | `/api/borrow/interest` | 私人 | `addInterest` — 加入願望清單 |
| POST | `/api/borrow/checkout` | 私人 | `checkout` — 提交借閱申請 |
| PUT | `/api/borrow/status/:id` | 私人 | `updateStatus` — 狀態轉換 |
| GET | `/api/borrow/my-records` | 私人 | `getMyRecords` — 用戶借閱歷史 |
| GET | `/api/borrow/all` | 管理員 | `getAllRecords` — 所有借閱記錄 |

**庫存管理：**
- `borrowed` → `book.stock -= 1`，`record.borrowDate = new Date()`
- `returned` → `book.stock += 1`，`record.returnDate = new Date()`

---

## 第 19 頁：成員 3 — Model：`models/BorrowRecord.js`

**Schema 定義：**
```javascript
{
  userId: ObjectId (引用 User, 必填),
  bookId: ObjectId (引用 Book, 必填),
  status: String (enum: interested/pending/borrowed/returned, 預設: interested),
  borrowDate: Date,
  returnDate: Date
}
```

**狀態機驗證：**
- `interested` → 只能轉換至 `pending`
- `pending` → 可轉換至 `borrowed` 或 `returned`
- `borrowed` → 只能轉換至 `returned`
- `returned` → 終止狀態（無法再轉換）

**數據完整性：**
- 複合索引 `{ userId, bookId, status }` 防止重複有效記錄
- Controllers 內 `populate()` 獲取用戶同書籍詳情

---

## 第 20 頁：成員 3 — 整合、測試與示範

**整合點：**
- `borrowController` 同時引用 `User` 同 `Book` Model
- `updateStatus` 內庫存更新立即生效
- 前端 `borrow.js` 透過 `API` 輔助函數處理所有操作

**測試檢查清單：**
- 註冊新用戶 → 登入 → 查看個人資料
- 瀏覽書籍 → 加入願望清單 → 借閱 → 歸還
- 驗證借閱時庫存減少、歸還時庫存增加
- 管理員審批借閱申請 → 庫存相應減少
- 閱讀器頁面僅在借閱後才能進入

**示範流程：**
1. 打開 `http://localhost:5000` → 書庫畫廊
2. 以 `admin@smartbook.com` / `admin123` 登入
3. 進入管理員控制台 → 管理書籍/用戶
4. 登出 → 註冊新用戶 → 測試借閱流程
5. 在閱讀器中閱讀已借閱的書籍

---

*團隊 ERB-Team-A | Smart Book System 項目匯報*
