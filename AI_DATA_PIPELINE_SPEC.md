# 剴剴案研究平台｜V3 AI 資料整理管線規格書 (Standardized)

**文件版本**：V3.2 (2026-04-05 Hardened)
**適用角色**：負責「資料拆解與 JSON 轉檔」的 AI 助手。
**核心原則**：極致客觀、數據扁平化、雙向關聯、引用必備。

---

## 一、 數據中立性標準 (Neutrality Standard)

> [!IMPORTANT]
> **嚴禁使用任何帶有評價性、情緒性或預設立場的詞彙。**
> 所有資料必須以「實務狀態」呈現，而非「評價結論」。

| 禁用詞彙 (Evaluative) | 建議替代詞 (Research/Objective) |
| :--- | :--- |
| 疏失 (Failure/Negligence) | **程序爭執點 / 實務差異** |
| 漏洞 (Loophole) | **體制節點 / 待釐清點** |
| 慘劇 (Tragedy) | **案件狀況 / 事件發展** |
| 謊稱 (Lied) | **陳述內容 (標記為 Contested)** |
| 診斷 (Diagnosis) | **現況分析 (Status Analysis)** |

---

## 二、 數據結構 (V3 Flattened Schema)

所有數據最終將匯入單一檔案 `/src/data/database.json`。AI 生產碎片 JSON 時必須符合以下結構：

### 2.1 Entities (實體扁平化)
不再區分 `people` 與 `orgs` 檔案夾。統一放入 `entities` 陣列。

```json
{
  "id": "prs-chen-shang-jie",
  "name": "陳尚潔",
  "entity_type": "person", // "person" 或 "organization"
  "role_in_case": "兒福聯盟出養社工，本案被告",
  "affiliation": "org-cwlf",
  "professional_positioning": "主張僅為『輔助性質』，非保證人地位。",
  "responsibility_boundary": "針對媒合保母後之實際照護狀況是否有獨立通報義務。",
  "source_refs": ["src-businesstoday-064"]
}
```

### 2.2 Events (事件時序)
每個事件必須包含 `source_refs` 並歸屬於 8 大階段之一。

```json
{
  "id": "evt-20230901-01",
  "title": "安置移交程序啟動",
  "date": "2023-09-01",
  "phase": "custody-and-abuse",
  "description": "兒盟社工與保母進行交接，剴剴正式進入劉姓保母住處。",
  "source_refs": ["src-businesstoday-064"],
  "related_entities": ["prs-chen-shang-jie", "prs-liu-cai-xuan"]
}
```

---

## 三、 模組對應規則 (Module Mapping)

AI 在整理資料時，應標記資料對應的 V3 模組：

1.  **Module 01 (Spine)**: 提供 `events` 與 `phase` 排序。
2.  **Module 02 (Hearings)**: 提供 `hearings` 陣列，含證人證詞摘要。
3.  **Module 03 (Topics)**: 將事件標記 `topics` (如：訪視規範、評估機制)。
4.  **Module 04 (Policy)**: 將事件分類為「體制規範」對照「實務狀況」。
5.  **Module 07 (Claims)**: 拆解檢方與辯方的法律主張。

---

## 四、 ID 命名公式 (ID Protocol)

| 前綴 | 邏輯 | 範例 |
| :--- | :--- | :--- |
| `prs-` | 人物 (漢語拼音) | `prs-liu-cai-xuan` |
| `org-` | 機構 (英文縮寫) | `org-cwlf` |
| `evt-` | 事件 (日期) | `evt-20240311-01` |
| `src-` | 來源 (出版者) | `src-businesstoday-064` |
| `hrg-` | 庭期 (日期) | `hrg-20251127` |

---

## 五、 作業檢查清單 (Quality Checklist)

- [ ] **1. 中立性**：是否移除了所有的「疏失」、「漏洞」等評價語？
- [ ] **2. 扁平化**：Entity 是否包含 `entity_type` 欄位？
- [ ] **3. 可溯源**：是否所有 Event 都至少有一個 Valid 的 `source_refs`？
- [ ] **4. 雙向性**：Event 提到人物 A，人物 A 的 `related_events` 裡是否有該 Event？

---
**請嚴格遵守此規格書產出 JSON，以確保與「日光高精準度存檔」V3 核心引擎 100% 兼容。**
