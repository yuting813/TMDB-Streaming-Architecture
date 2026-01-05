[English](README.md) | [繁體中文](README.zh-TW.md)

# Netflix Clone - Frontend Engineering Portfolio

這是一個 Netflix 風格的影音串流網站，著重於 **UI 架構設計、狀態可預測性、UX 邊界情境處理與可及性**，而非單純堆疊功能。

Live demo: https://stream.tinahu.dev/
Source code: https://github.com/yuting813/netflix-clone-nextjs

Demo 帳號：

- Email: demo@tinahu.dev
- Password: Demo1234!

---

## 為什麼做這個專案

此專案刻意模擬真實前端工程場景：

- 登入狀態與路由保護
- 訂閱制權限控管對 UI 的影響
- 外部 API 不穩定資料處理
- UX 邊界案例（loading、empty、fallback、error）
- 易於說明與擴充的前端結構

目標是呈現 **我如何設計前端系統**，而非只展示功能數量。

---

## 前端工程重點

- **UI 架構**：components 純呈現，hooks 負責副作用
- **狀態可預測**：集中 auth/subscription 狀態並進行 guarded init
- **UX 邊界處理**：loading、trailer 缺失、fallback
- **可及性**：ESC 關閉、focus 回復、鍵盤操作流程
- **RWD 穩定性**：header/rows 在 scroll/resize 下保持穩定
- **可維護性**：typed helpers + 共用型別，降低 UI 耦合

---

## 主要功能

- 註冊 / 登入 / 自動登出（Firebase Auth）
- 訂閱建立與權限控管（Stripe + Firestore）
- 影片瀏覽：隨機 Hero Banner + 分類橫向列
- 影片詳情 Modal：預告片播放與完整 fallback 狀態
- 我的清單：即時同步

---

## 技術棧

- **Framework**：Next.js（Pages Router）、React
- **Language**：TypeScript
- **Styling**：Tailwind CSS
- **State**：Recoil
- **Auth**：Firebase Auth
- **Database**：Firestore
- **Payments**：Stripe Checkout
- **External API**：TMDB API
- **Tooling**：ESLint、Prettier

---

## 專案結構

```text
pages/        Next.js 路由 + API routes
components/   純 UI 元件（無 side effects）
hooks/        商業邏輯（auth, subscription, lists）
utils/        API helpers 與共用工具
atoms/        Recoil state 定義
constants/    共用常數（如 TMDB image base URL）
lib/          服務整合（Stripe, Firebase）
types/        共用型別
```

設計原則：

- UI 元件不直接呼叫 API
- Side effects 集中於 hooks
- 型別優先，避免 any 擴散

---

## 安裝與啟動

```bash
git clone https://github.com/your-username/netflix-clone-nextjs.git
cd netflix-clone-nextjs
npm install
cp .env.example .env.local   # 填入金鑰
npm run dev                  # http://localhost:3000
```

### 環境變數

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

## 最近的前端亮點

- 降低登入初始化期間的誤導頁，讓首屏流程更穩定
- 避免預告片失敗造成空白畫面，提供清楚的 loading 與 fallback
- Header 在 scroll / resize 下保持版面穩定，維持互動品質
- 圖片載入階段維持縮圖版面，降低視覺跳動
- 將 TMDB 請求集中為 typed helpers，降低 UI 與資料層耦合

---

## 後續可延伸方向

- 補上 component 與 integration tests（modal、auth guard、subscription）
- 效能 profiling 與關鍵路徑優化
- 更完整的 error boundary 與 retry 策略

---

## 關於我

這個專案用於展示我在前端工程上的設計取捨與實作方式，
特別著重於 UI 架構、狀態管理與 UX 邊界情境處理。

Contact: tinahuu321@gmail.com  
LinkedIn: https://www.linkedin.com/in/tina-hu-frontend  
GitHub: https://github.com/yuting813

註：此專案為個人學習與職涯轉換期間完成，著重於工程設計與可說明性。

---
