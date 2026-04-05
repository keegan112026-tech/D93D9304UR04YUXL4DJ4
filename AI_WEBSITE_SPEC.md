# 日光存檔：V3 高精準度研究平台規格書 (Architectural Spec)

**文件版本**：V3.5 (2026-04-05 Final Hardened)
**適用角色**：負責「前端開發與模組建構」的 AI 助手。
**核心理念**：極致清晰、體制厚度、情緒中立、數位實體感 (Digital Tangibility)。

---

## 1. 八大核心研究模組 (The 8 Research Pillars)

本平台由八個相互關聯的專業模組構成，所有數據均從單一真值來源 (SSOT) `src/data/database.json` 讀取。

| 模組 | 組件路徑 | 核心職能 | 視覺關鍵詞 |
| :--- | :--- | :--- | :--- |
| **01 案件全景主軸** | `CaseSpine.jsx` | 8 大階段時序導航。 | 骨幹、縱深、事實標章。 |
| **02 庭期檔案索引** | `HearingIndex.jsx` | 11+ 次庭期對話與證詞存檔。 | 儀式感、證詞對讀、法庭座標。 |
| **03 系統專題中心** | `TopicHub.jsx` | 橫向議題（如訪視規範）歸約。 | 標籤雲、專題網格、跨時空關聯。 |
| **04 體制分析看板** | `PolicyDashboard.jsx` | 「規範設計」對照「實務軌跡」。 | 分欄對比、中立看板、法規溯源。 |
| **05 文獻註冊總庫** | `Bibliography.jsx` | 170+ 筆原始來源標本室。 | 數位網格、來源分級 (Tier 1-4)。 |
| **06 權責互動拓補** | `RelationGraph.jsx` | 38+ 實體之權責網絡。 | 動態節點 (ReactFlow)、拓補鏈。 |
| **07 法律主張矩陣** | `ClaimTracker.jsx` | 攻防主張與司法見解追蹤。 | 對立面、見解狀態、爭議雷達。 |
| **08 深層解析報告** | `ChapterReader.jsx` | 專家級章節式研究閱讀。 | 打字機質感、長文排版、細讀模式。 |

---

## 2. 日光設計系統 (Elite Light-Mode tokens)

> [!TIP]
> **視覺美學決定了研究的重量。**
> 必須維持「制度的冷靜」與「紙質的溫度」。

- **Color Pallette**: 
  - `Rice White`: `#FDFCF8` (主色調，背景)
  - `Deep Forest`: `#2F3A35` (點綴色，主要按鈕與標示)
  - `Deep Charcoal`: `#1A1A1A` (內文顏色，確保易讀性)
- **Typography**:
  - `Heading`: Serif (如 Playfair Display)，傾斜 (Italic) 以示專業存檔感。
  - `Data`: Monospace / Tabular nums，用於日期與 ID 編號。
- **Tactile Tokens**:
  - `refined-tactile`: 在 `index.css` 定義的微細紋理圖層。
  - `daylight-card`: 柔和邊界感 (Border 0.08 alpha) 與極微細陰影。

---

## 3. 數據硬化協議 (Data Hardening Protocol)

所有開發均須符合 **V3 Flattened Schema**:
1.  **扁平化實體**：`entities` 不再分層，統一使用 `entity_type`。
2.  **事件歸約**：`events` 必須攜帶 `source_refs` 並精確對應至 `phase`。
3.  **引用透明性**：點擊任何數據點必須彈出 `DetailSheet`。

---

## 4. 品質校閱標準 (QA Checklist)

- [ ] **中立性校對**：UI 介面不得出現「疏失」、「漏洞」等結論性詞彙。
- [ ] **關聯性校對**：確認 `TopicHub` 點擊後能正確跳轉至該專題的關聯事件。
- [ ] **響應式校對**：Mobile 版面需將側邊欄隱藏至側拉選單，維持研究專注度。

---
**請依照此規格書繼續維護並擴充「日光高精準度存檔」前端。**
