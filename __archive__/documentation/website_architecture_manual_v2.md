# 日光高精準度存檔：全域開發與架構技術白皮書 (v2)

本文件為「剴剴案研究平台」的正式技術與架構手冊。本手冊旨在為開發者與研究者提供一套極致細緻的基準，陳述如何透過現代 Web 技術，在數位空間重塑「高精準度」的機構存檔美學。

---

## 1. 專案願景：日光下的體制校對 (Vision)

本專案拒絕平庸的 UI 設計，追求的是 **「日光高精準度 (Daylight High-Precision)」**。這不僅僅是淺色模式，而是一種對於資訊主體性的極致尊重。我們透過「米白色系」的溫潤質感與「0.5px」的冷靜邊框，讓法律研究與事實校對回歸到最純粹、最專注的狀態。

---

## 2. 全域設計系統 (Precision Design System)

本系統的所有視覺參數皆經過數學化計算，以確保在 1920x1080 及更高解析度下的完美平衡。

### A. 色彩動力學 (Color Palette)
| 代號 | Hex Code | 作用 | 設計心理學 |
| :--- | :--- | :--- | :--- |
| **Rice White** | `#FDFCF8` | 全域主背景 | 模擬高磅數 Bond Paper，減少螢幕發光感，提升長時閱讀舒適度。 |
| **Pale Green** | `#F5F6F0` | 側邊欄/次要背景 | 寧靜的機構氛圍，模擬檔案館中經過修復的石灰牆面與緞面材質。 |
| **Deep Charcoal** | `#1A1A1A` | 主標題與內文 | 提供極致的銳利度與對比，模仿高品質鋼筆墨水的顯色效果。 |
| **Deep Forest** | `#2F3A35` | 關鍵動作/點綴 | 代表權威與穩重的森林綠，是本系統的核心機構點綴色。 |

### B. 紋理與質感 (Subliminal Tactile)
*   **亞臨床纖維層 (Felt Overlay)**：使用 `0.008` 透明度的羊毛纖維紋理，疊加於全區域，創造微觀下的物理磨砂感。
*   **微量噪點 (Grain Overlay)**：疊加 `0.01` 透明度的數位噪點，消除大面積色塊的塑膠感，強化「物質實體性」。
*   **混合模式**：所有質感層均採用 `multiply` 模式，與底色自然融合。

### C. 字體工程 (Typography Engineering)
*   **標題體 (Display)**：`Playfair Display` (Italic)。特點是極細的高對比筆畫，字距壓縮至 `-0.04em`。
*   **內文體 (Sans)**：`Inter Variable`。權重分佈從 100 至 900。確保在各種字級下的可讀性。
*   **數據體 (Numeric)**：強制啟用 `tabular-nums`，確保日期、ID 在序列中垂直對齊，達到審計規範。

---

## 3. 核心模組架構與運作邏輯 (Module Specification)

### A. 主框架控邊模組 (App UI Framework)
*   **組件**：`App.jsx`
*   **邏輯**：
    *   **異步渲染**：使用 React `lazy` 與 `Suspense` 進行視圖切換，減少首屏載入壓力。
    *   **導航回饋**：側邊欄導航鈕具備「Glow」發光特效與「Layout Transition」，通過 `layoutId` 實現流暢的導航環選中效果。
    *   **引用抽屜 (Citation Sheet)**：基於 `shadcn/ui` 的 `Sheet` 組件。當研究者點選任何證據點位時，系統會開啟該側邊面板，展示對應的數位 ID 與歸檔路徑。

### B. 首頁流量門戶 (Home View)
*   **組件**：`views/Home.jsx`
*   **核心功能**：
    *   **英雄區 (Hero Section)**：使用 `radial-gradient` 營造出頂部的光束感，使標題成為視覺錨點。
    *   **數據帳簿 (Stat Ledger)**：將「訪談對象」、「文獻量」轉化為 Ledger 格式。每個項目在滑鼠懸停時會觸發輕微的 `border-primary` 高亮效果。
*   **組件技術**：`motion.div` Stagger Animations。進入首頁時，所有卡片會以 `staggerChildren` 邏輯依序浮現。

### C. 數位 Registry 資料庫 (Bibliography View)
*   **組件**：`views/Bibliography.jsx`
*   **運作邏輯**：
    *   **模糊過濾 (Fuzzy Filter)**：使用 `useMemo` 對 `DATA` 進行即時過濾，響應時間控制在 10ms 以內。
    *   **視圖轉換**：支援 `Grid` (視覺導向) 與 `List` (效率導向) 雙模切換，狀態由 React `useState` 維持。
    *   **搜索框設計**：具備 `shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]`，營造出在紙張上壓印出輸入框的視覺錯覺。

### D. 分析報告閱讀器 (Chapter Reader)
*   **組件**：`views/ChapterReader.jsx`
*   **設計標準**：
    *   **黃金行長**：內文寬度限制在 `max-w-4xl`，避免視線水平移動過長導致疲勞。
    *   **過失對標表**：使用 `Table` 組件展示。每行具備 ID 渲染邏輯 (String.padding)，展現嚴謹的編目感。
    *   **庭審紀錄卡片**：將日期 (Date) 處理為超大 `64px` 襯線字體，作為視覺引導，讓讀者迅速瀏覽時間節點。
*   **組件技術**：`ScrollArea` 用於處理長篇幅的導航索引。

### E. 權責拓補圖 (Relation Graph)
*   **組件**：`views/RelationGraph.jsx`
*   **操作邏輯**：
    *   **物理引擎**：基於 `React Flow`。使用 `Background` (Grid 模式) 來建立空間感。
    *   **節點類型**：自定義 `daylight-node` 樣規。節點在選中時會增加邊框厚度並觸發動態連線動畫。
    *   **MiniMap**：右下角提供全域縮略圖，方便在大規模權責圖譜中定位核心爭點。

---

## 4. 開源組件與外部依賴 (Open Source Ecosystem)

*   **shadcn/ui**：負責所有原子化組件 (Badge, Button, Card, Table, Sheet, Input, ScrollArea)。其核心價值在於提供一個高度乾淨、無隱藏樣式的基底。
*   **Lucide Icons**：所有圖示統一使用 `stroke-width={1.5}` 或 `{2}`，保持線條的精密感。
*   **Framer Motion**：處理全球視圖的 `motion.div` 運動，確保在 Daylight 模式下也能體驗到物理級的彈性動力學。
*   **React Flow**：負責 Topology Graph。其具備優異的操作流暢性，支援無限縮放與節點連線邏輯。

---

## 5. 狀態管理與性能規範 (State & Performance)

*   **過場動效**：統一 transition duration 為 **450ms**。使用 `cubic-bezier(0.16, 1, 0.3, 1)`，這是一種具備「先快後慢」性格的曲線，常用於頂級專業軟體 (如 Linear)。
*   **數據整合**：歸屬資料存放於 `src/data/`。所有外部文件 (PDF/DOCX) 的資料已在開發階段標註為 Metadata 嵌入代碼中。
*   **無障礙與 SEO**：全站具備語義化 HTML5 標籤 (nav, main, section, article)，並支援螢幕閱讀器的基本 Aria 標註。

---

> [!TIP]
> **維護建議**：
> 當需要新增頁面或組件時，請務必繼承 `border-precision` 類別，並在背景使用 `bg-[#FDFCF8]` 搭配 `bg-[#F5F6F0]`。確保「米白 vs 淡綠」的 60/30/10 比例，以維持整體的機構一致性。
