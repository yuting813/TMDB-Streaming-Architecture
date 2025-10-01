#  Netflix Clone - 全端影音串流平台

> 使用 **Next.js + TypeScript + Firebase + Stripe** 打造的 Netflix 風格影音串流平台，實現從 **用戶註冊 → 訂閱付費 → 影片瀏覽與收藏** 的完整流程。

這個專案的目標是展現我在 **前端框架整合、金流流程設計與 UI 邏輯還原** 的能力。  
並透過這個作品展示 **工程化流程、跨服務整合、以及使用者體驗細節**。

---

##  專案亮點速覽

| 類別        | 亮點                                       | 程式依據                                                                  |
| --------- | ---------------------------------------- | --------------------------------------------------------------------- |
| **用戶系統**  | Firebase Auth 登入/註冊 + 30 分鐘自動登出          | `hooks/useAuth.tsx`                                                   |
| **訂閱付費**  | Stripe Checkout + Firestore 訂閱同步         | `components/Plans.tsx`, `hooks/useSubscription.tsx`                   |
| **影片功能**  | TMDB API 片單、隨機 Banner、Modal Trailer      | `components/Banner.tsx`, `components/Row.tsx`, `components/Modal.tsx` |
| **收藏清單**  | Firestore 即時同步「我的清單」                     | `hooks/useList.tsx`                                                   |
| **UI/UX** | Tailwind CSS + Recoil Modal，Netflix 風格互動 | `components/*`, `styles/globals.css`                                  |

---

##  Demo / Screenshots

* [線上 Demo](https://project-netflix-clone-two.vercel.app/login)
* 專案截圖
![專案截圖](https://github.com/user-attachments/assets/bda236ce-ad05-4714-a03d-b0c3f2279931)

---

## 技術棧

* **前端**：Next.js 13 (React 18)、TypeScript、Tailwind CSS、Recoil
* **UI 元件**：Material-UI、Heroicons、React Hook Form
* **後端服務**：Firebase Authentication、Firestore
* **金流**：Stripe Checkout / Webhook
* **外部 API**：TMDB (影片資訊)、YouTube (Trailer)
* **部署**：Vercel

---

## 功能介紹

* **註冊/登入/自動登出** → Firebase Auth 實作
* **多方案訂閱與付款** → Stripe Checkout
* **影片分類瀏覽** → Row 橫向滑動
* **首頁 Banner 推薦** → 隨機熱門影片
* **我的清單 (My List)** → 收藏/移除影片
* **影片詳情 Modal** → TMDB API + 預告片播放
* **UI/UX** → Netflix 風格設計、響應式 Header、Loader 動畫

---

##  專案結構（精華版）

```text
pages/        # Next.js 路由與資料抓取，不放業務邏輯
components/   # UI 元件，純呈現，無副作用
hooks/        # 自訂邏輯（Auth、Subscription、List），集中處理資料/副作用
atoms/        # Recoil 全域狀態，切小粒度，避免肥胖 atom
```

### 規範：

* **UI 與資料解耦**：components/ 不直接呼叫 API
* **副作用集中**：hooks/ 專責處理資料與 Firebase 監聽
* **型別前置**：跨層共用型別統一放在 types/，避免 any 擴散

--
## 環境變數

`.env.local` 範例：

```bash
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# TMDB
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

---

##  安裝與啟動

```bash
git clone https://github.com/your-username/project-_netflix-clone.git
cd project-_netflix-clone
npm install
cp .env.example .env.local   # 填入金鑰
npm run dev                  # http://localhost:3000
npm run build && npm run start
```

---
## 工程流程展示

* **分支策略**：feat/*、fix/*、refactor/*

* **Commit** 規範：Semantic Commit (feat, fix, chore, perf…)

* **PR 模板**：包含 Why / How / QA，並附 Before vs After 截圖
---

## FAQ

1. **登入後被導回登入頁？**
   → 檢查 Firebase 設定與 API key 是否正確。

2. **Stripe 付款流程失敗？**
   → 確認 API key 是否正確，並檢查 `create-checkout-session.ts`。

3. **影片無法載入？**
   → 檢查 TMDB API key 是否有效，以及 `utils/request.ts` 的路徑設定。

---

## 資安注意事項

* Firebase Firestore 規則需限制用戶只能存取自己的文件
* Stripe 開發建議使用「測試模式」
* 建議為 TMDB API key 設定域名限制

---

## 授權與致謝

* 僅供作品展示
* 影片資料來源：[TMDB API](https://www.themoviedb.org/documentation/api)

---


