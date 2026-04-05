# 剴剴案研究資料庫 Prototype

這是一個**完全獨立於原網站專案**的資料庫網站雛形，用來承接六階段研究成果。

## 目的

這個 prototype 不追求先填滿所有內容，而是先把下面這些骨架做出來：

- 首頁與全站搜尋
- 六階段主題入口
- 案情總覽與時間軸
- 人物與機構百科卡
- 法庭與證詞模組
- 官方資料表格
- 輿論與論述卡牆
- 名詞與來源庫
- React Flow 關聯圖譜
- 側邊詳情抽屜

## 技術骨架

- Vite
- React + TypeScript
- shadcn/ui
- TanStack Table
- Fuse.js
- Motion
- React Flow

## 啟動方式

```bash
npm install
npm run dev
```

Production build：

```bash
npm run build
```

## 關鍵檔案

- `src/App.tsx`
  - 單頁 prototype 主骨架
- `src/data/prototype-data.ts`
  - 雛形資料物件與搜尋索引來源
- `src/lib/prototype-graph.ts`
  - 關聯圖譜節點與邊
- `src/components/section-heading.tsx`
- `src/components/legend-item.tsx`
- `src/components/court-argument-card.tsx`

## 與研究工作區的關係

這個站是展示與資料結構雛形，不是研究正文來源。研究正文與分階段輸出在另一個獨立工作區：

- `C:\\Users\\User\\Documents\\Playground\\剴剴案百科資料庫_研究工作區_2026-04-05`

建議之後的工作方式：

1. 先在研究工作區補資料與來源
2. 再把資料逐步轉成這個 prototype 所需的結構化欄位
3. 最後才把 placeholder 替換成正式條目

## 目前完成度

- 已可編譯
- 已有完整首頁型資料庫骨架
- 已接上搜尋、表格、圖譜與 detail sheet
- 已避免污染原網站專案

## 下一步建議

- 將六階段研究輸出轉成更嚴格的資料 schema
- 為人物、機構、庭期、文件建立真正的關聯 ID
- 把來源庫做成可引用 / 可追溯 / 可複製格式
- 補齊空狀態與資料稀疏時的展示策略
