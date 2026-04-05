# ⚡️ 日光存檔：高精準度體制研究平台 (Daylight High-Precision Archive)

**核心定位**：基於數據硬化 (Data Hardening) 與體制中立 (Institutional Neutrality) 原則建構的數位人文研究存檔庫。
**當前版本**：V3.5 (2026-04-05 Hardened)

---

## 🏛 平台八大核心模組 (The 8 Research Pillars)

1.  **案件全景主軸 (Case Spine)** - 8 大關鍵階段時序全導航。
2.  **庭期檔案索引 (Hearing Index)** - 11+ 次庭審證詞與對話實錄。
3.  **系統專題中心 (Topic Hub)** - 橫向制度議題（如訪視、產出評估）分析中心。
4.  **體制分析看板 (Policy Dash)** - 「法規設計」與「實務軌跡」的中立對照。
5.  **文獻標本註冊 (Bibliography)** - 170+ 筆原始來源的數位管理中心。
6.  **權責互動拓補 (Topology)** - 38+ 個實體間的動態權責網絡。
7.  **法律主張矩陣 (Claim Tracker)** - 司法攻防、檢辯主張與證詞爭點追蹤。
8.  **深層解析報告 (Chapter Reader)** - 專家級長文閱讀與章節式脈絡解讀。

---

## 🛡 數據硬化與中立性標準 (Neutrality Standard)

本平台嚴格遵守「去評價化」原則：
- **數據全溯源**：所有事件 (Events) 必須鏈接至 `database.json` 中的 `source_refs`。
- **詞彙中立化**：界面與數據庫已移除「疏失」、「漏洞」、「錯誤」等主觀詞彙，改為 **「程序爭執點」**、**「功能運作現況」** 等實務術語。
- **單一真值來源 (SSOT)**：全站數據由 `src/data/database.json` 統一管理。

---

## 🛠 操作指令 (Operational Commands)

### 開發與預覽
```bash
npm install     # 安裝相依套件
npm run dev     # 啟動研究平台預覽 (Rice White UI)
npm run build   # 生產正式部署版本
```

### 資料管理工具
```bash
node final_data_audit.cjs   # 執行數據審計 (檢查孤立節點、時序與中立性)
node fix_audit_errors.cjs   # 自動修復數據異常與中立化替換
node link_topics.cjs        # 重新建立專題與事件的語意關聯
```

### 資料擴充腳本 (Data Pipeline)
詳細的 AI 轉檔規則請參閱 `AI_DATA_PIPELINE_SPEC.md`。

---

## 🎨 設計規範 (Design Tokens)

- **主題**：Elite Light-Mode / Rice White (#FDFCF8)
- **字體**：Serif (Playfair Display) + Sans (Inter) + Mono (Tabular numerals)
- **質感**：`refined-tactile` (微粒感實體紋理層)

---
**本平台為「剴剴案研究計畫」之數位基礎設施，旨在為法學、社會工作與行政體制研究者提供最精準的原始檔案對接。**
