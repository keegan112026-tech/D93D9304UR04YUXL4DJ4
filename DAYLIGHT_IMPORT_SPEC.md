# DAYLIGHT ARCHIVE — AI 資料匯入工作流程規格書
**版本 v1.0 ｜ 架構書 v3 對應版**

本文件是給「快速型 AI」使用的嚴格工作流程。
任何協助匯入資料的 AI 必須完整遵守本規格，不得自行簡化或跳步。

---

## 一、核心原則（不可違反）

1. **來源至上**：沒有明確來源的內容不得進入 `sources` 以外的任何陣列。
2. **節點先建**：先建 Source，再建 Entity，再建 Event / Hearing / Claim / Topic。
3. **分類明確**：每一筆資料必須屬於以下六種類型之一：`source` / `event` / `entity` / `hearing` / `claim` / `topic`
4. **狀態標示**：所有陳述必須標明狀態，禁止把未證實傳言直接寫入主線事件。
5. **雙向關聯**：建立任何關聯時，雙邊都要寫入。（例如 event.related_entities 寫了 entity ID，該 entity.related_events 也要補上 event ID）
6. **禁止自行補全**：若原始文件只有「陳社工」，不得補全為「陳尚潔」。姓名補全需人工確認。

---

## 二、工作流程（六個階段，必須按順序）

### Stage 1 — 來源接收
輸入形式可以是：URL、PDF 摘要、新聞稿全文、判決書節錄、Markdown 整理稿

**輸出：**在 `database.json` 的 `sources` 陣列中新增一筆 Source 物件。

**檢查清單：**
- [ ] `source_id` 有填且唯一（格式：`src-[出版商縮寫]-[流水號]`，例：`src-cna-142`）
- [ ] `title` 有填
- [ ] `source_type` 已分類（見下方枚舉）
- [ ] `publisher` 有填
- [ ] `url` 已填（若有）
- [ ] `reliability_tier` 已標（1/2/3/4）
- [ ] `citation_text` 已填

### Stage 2 — 實體識別
掃描來源文本，識別出所有：人物姓名、機構名稱、法規名稱

**對照已有實體：**先查 `database.entities` 是否已存在。
若已存在，只在該實體的 `source_refs` 加入新 source_id，**不要重複建立實體**。
若不存在，新建 Entity 物件。

**禁止自行補全全名。若只有姓氏或職稱，entity_type 標 person，name 填已知部分，並在 description_short 說明資訊不完整。**

### Stage 3 — 事件拆分
將來源文本拆分成獨立事件。

規則：
- 每個事件必須有明確的日期（或日期範圍）
- 每個事件對應「一件發生的事」，不可把多件事合成一筆
- 事件的 `status` 必須根據來源層級填寫

### Stage 4 — 庭期識別（若涉及法庭記錄）
識別出庭期記錄，單獨建立 Hearing 物件。

庭期與事件的區別：庭期是法庭程序，有案號、庭期類型、出庭名單。

### Stage 5 — 主張拆分（若涉及爭議陳述）
將不同來源的說法各自建立為 Claim 物件。
同一個爭議的不同說法，透過 `counter_claims` 互相連結。

### Stage 6 — 主題標注（選擇性）
判斷本次資料是否涉及現有主題，若是，在對應 topic 的 `related_events` / `related_claims` 中補入新建的 ID。

---

## 三、資料物件 JSON Schema

### 3.1 Source（來源）

```json
{
  "source_id": "src-[publisher]-[number]",
  "id": "src-[publisher]-[number]",
  "title": "完整標題（含日期如有）",
  "source_type": "judicial | official | media | academic | commentary | statement | social",
  "publisher": "出版單位名稱",
  "publish_date": "YYYY-MM-DD 或 null",
  "url": "https://... 或 null",
  "reliability_tier": 1,
  "language": "zh-TW",
  "citation_text": "APA 格式引用文字",
  "archive_status": "active",
  "tags": ["標籤1", "標籤2"],
  "related_entities": [],
  "related_events": []
}
```

**source_type 枚舉：**
- `judicial` — 法院公告、判決、裁定
- `official` — 行政機關文件、新聞稿、監察報告
- `media` — 媒體報導（主流媒體）
- `academic` — 學術論文、研究報告
- `commentary` — 法律評論、專業分析
- `statement` — 團體聲明、公開信
- `social` — 社群媒體、網路討論

**reliability_tier 枚舉：**
- `1` — 法院/官方文件（第一手）
- `2` — 主流媒體逐庭報導、官方訪談
- `3` — 專業評論、學術分析
- `4` — 網路二手資料、社群討論

---

### 3.2 Entity — Person（人物）

```json
{
  "entity_id": "prs-[姓名拼音-連字符]",
  "id": "prs-[姓名拼音-連字符]",
  "name": "姓名（如不完整，填已知部分）",
  "alias": ["別稱1", "別稱2"],
  "entity_type": "person",
  "role_in_case": "在本案中的角色描述",
  "case_involvement": "defendant | witness-prosecution | witness-defense | witness-neutral | expert | official | other",
  "affiliation": "org-[所屬機構ID]",
  "description_short": "30字內簡述",
  "professional_positioning": "專業角色的具體內容（可較長）",
  "responsibility_boundary": "責任邊界說明",
  "appeared_in_hearings": [],
  "source_refs": ["src-xxx-001"],
  "related_entities": [],
  "related_events": [],
  "related_topics": []
}
```

---

### 3.3 Entity — Organization（機構）

```json
{
  "entity_id": "org-[縮寫]",
  "id": "org-[縮寫]",
  "name": "正式全稱",
  "alias": ["縮寫", "常用簡稱"],
  "entity_type": "organization",
  "org_type": "government-central | government-local | court | ngo | hospital | union | other",
  "jurisdiction": "Taiwan | Taipei | NewTaipei | other",
  "official_mandate": "正式職掌",
  "role_in_case": "在本案中的角色",
  "key_personnel": ["prs-xxx"],
  "source_refs": [],
  "related_entities": [],
  "related_events": [],
  "related_topics": []
}
```

---

### 3.4 Entity — Law（法規）

```json
{
  "entity_id": "law-[縮寫-條號]",
  "id": "law-[縮寫-條號]",
  "name": "法規全稱含條號",
  "alias": ["俗稱", "縮寫"],
  "entity_type": "law",
  "definition": "條文原文或主要內容",
  "relevance_to_case": "與本案的關聯",
  "source_refs": [],
  "related_entities": [],
  "related_events": [],
  "related_topics": []
}
```

---

### 3.5 Event（事件）

```json
{
  "event_id": "evt-[YYYYMMDD]-[關鍵字]",
  "id": "evt-[YYYYMMDD]-[關鍵字]",
  "date": "YYYY-MM-DD",
  "title": "事件標題（不超過60字）",
  "phase": "prehistory-family | referral-adoption-placement | care-period-signs | injury-death-event | criminal-investigation-nanny | social-worker-trial | monitoring-admin-responsibility | reform-public-response",
  "status": "Confirmed | Claim | Court Recognized | Danger",
  "significance": "事件重要性說明（120字內）",
  "description": "詳細描述（若有）",
  "location": "地點（若有）",
  "related_entities": ["prs-xxx", "org-xxx"],
  "source_refs": ["src-xxx-001"],
  "related_hearings": [],
  "related_claims": [],
  "related_topics": [],
  "tags": []
}
```

**phase 枚舉：**
- `prehistory-family` — 前史與家庭背景（2022年初）
- `referral-adoption-placement` — 轉介、收出養與安置決策
- `care-period-signs` — 保母照顧期間與異常徵兆（2023.09-12）
- `injury-death-event` — 傷勢、醫療發現與死亡事件（2023.12.24）
- `criminal-investigation-nanny` — 刑事偵辦與保母案審理（2024.01-2025.05）
- `social-worker-trial` — 社工案起訴、庭期與法庭攻防（2024.08-2026.04）
- `monitoring-admin-responsibility` — 監察調查、行政責任與制度檢討
- `reform-public-response` — 修法、輿論反應與後續制度效應（2024.03-）

**status 枚舉：**
- `Confirmed` — 多來源證實或具第一手文件
- `Claim` — 某方主張，尚未被法院認定
- `Court Recognized` — 法院已採認
- `Danger` — 涉及死亡、重大傷害的核心事件

---

### 3.6 Hearing（庭期）

```json
{
  "hearing_id": "hearing-[YYYYMMDD]-[關鍵字]",
  "id": "hearing-[YYYYMMDD]-[關鍵字]",
  "date": "YYYY-MM-DD",
  "case_number": "案號（如：114年度訴字第51號）",
  "proceedings_type": "審查庭 | 準備程序 | 審理程序 | 言詞辯論 | 宣判",
  "title": "本庭主要議題標題",
  "judge": ["prs-xxx"],
  "prosecutor": "prs-xxx",
  "defendant": "prs-xxx",
  "witnesses": [
    {
      "entity_id": "prs-xxx",
      "testimony_summary": "證詞重點（不超過100字）"
    }
  ],
  "legal_arguments": ["論點1", "論點2"],
  "court_activity": "本庭主要活動與攻防描述（200字內）",
  "source_refs": ["src-xxx-001"],
  "related_claims": [],
  "related_topics": []
}
```

---

### 3.7 Claim（主張 / 說法 / 爭議）

```json
{
  "claim_id": "clm-[主題關鍵字]",
  "id": "clm-[主題關鍵字]",
  "statement": "主張的核心命題（一句話）",
  "claim_type": "Legal | Institutional | Academic | Professional Ethics | Public | Media",
  "status": "Confirmed | Contested | Unverified | Court Adopted | Court Rejected",
  "point_of_contention": "爭點詳述（200字內）",
  "pro_arguments": ["prs-xxx（支持此主張的人/機構 ID）"],
  "con_arguments": ["prs-xxx（反對此主張的人/機構 ID）"],
  "counter_claims": ["clm-xxx（對立主張 ID）"],
  "source_refs": ["src-xxx-001"],
  "related_entities": ["prs-xxx"],
  "related_events": ["evt-xxx"],
  "related_topics": ["top-xxx"]
}
```

---

### 3.8 Topic（主題 / 專題）

```json
{
  "topic_id": "top-[主題縮寫]",
  "id": "top-[主題縮寫]",
  "title": "主題名稱",
  "name": "主題名稱（同 title）",
  "topic_group": "法律責任 | 收出養制度 | 訪視制度 | 社工專業 | 輿論光譜 | 修法後果 | 醫療鑑定",
  "definition": "主題定義與本案關聯（150字內）",
  "tags": ["標籤"],
  "related_events": ["evt-xxx"],
  "related_hearings": ["hearing-xxx"],
  "related_claims": ["clm-xxx"],
  "related_laws": ["law-xxx"],
  "related_entities": ["prs-xxx", "org-xxx"],
  "related_sources": ["src-xxx-001"]
}
```

---

## 四、匯入到 database.json 的方法

`database.json` 的頂層結構：
```json
{
  "index": { ... },
  "sources": [ ... ],
  "entities": [ ... ],
  "events": [ ... ],
  "hearings": [ ... ],
  "claims": [ ... ],
  "topics": [ ... ]
}
```

匯入規則：
1. 新增一筆 Source → 加入 `sources` 陣列末尾，**同時**在 `index.sources` 陣列末尾加入該 source_id
2. 新增一筆 Entity → 加入 `entities` 陣列末尾（依 entity_type 區分，加入對應的 `index.people` / `index.orgs` / `index.laws`）
3. 新增一筆 Event → 加入 `events` 陣列，加入 `index.events`
4. 新增一筆 Hearing → 加入 `hearings` 陣列，加入 `index.hearings`
5. 新增一筆 Claim → 加入 `claims` 陣列
6. 新增一筆 Topic → 加入 `topics` 陣列

---

## 五、各方反應 / 論述 / 意識形態資料的處理方式

這類資料最容易被混入主線事件，造成事實與說法混淆。
正確處理流程：

1. **每一個立場/論述建立為一筆 Claim**，claim_type 填 `Public` 或 `Academic`
2. 發聲機構或人物記錄在 `pro_arguments` 或 `con_arguments`
3. 若有媒體報導此論述，建立 Source，在 Claim.source_refs 中引用
4. 若此論述影響了特定事件（如工會集結），在對應 Event.related_claims 中加入此 Claim ID
5. 若此論述涉及特定主題（如「社工勞動保護」），在 Topic.related_claims 中加入

**範例：全國19所大學社工聯合聲明（2026-04-02）**
```json
{
  "claim_id": "clm-academic-joint-20260402",
  "statement": "全國大學社工學系聯合呼籲：個人刑責不應替代制度性改革",
  "claim_type": "Academic",
  "status": "Contested",
  "pro_arguments": ["org-academic-sw-coalition"],
  "con_arguments": ["prs-lin-yu-mei"],
  "source_refs": ["src-xxx-声明来源"],
  "related_events": ["evt-2026-04-02-88"],
  "related_topics": ["top-sw-discipline-mechanism"]
}
```

---

## 六、專有名詞的處理方式

專有名詞（如「保證人地位」「業務登載不實」「不預告訪視」）應建立為 `law` 類型的 Entity 或 `topic`：

- **若為法律概念（有法條依據）** → 建立 `entity_type: "law"` 的 Entity，`name` 填正式名稱，`alias` 填俗稱
- **若為制度概念（無單一法條但涉及制度）** → 建立 Topic，`topic_group` 填對應分類

建立後，在所有提及此概念的事件（event）、庭期（hearing）、說法（claim）中加入對應的 related_topics 或 related_entities。

---

## 七、快速型 AI 的工作輸出格式

快速型 AI 每次工作後，必須輸出以下格式的摘要，供人工或主 AI 驗收：

```
## 本次匯入摘要
- 新增 Source：X 筆
  - [source_id] — 標題
- 新增 Entity：X 筆
  - [entity_id] — 姓名/機構
- 新增 Event：X 筆
  - [event_id] — 日期 — 標題
- 新增 Hearing：X 筆
- 新增 Claim：X 筆
- 新增 Topic：X 筆

## 需要人工確認的項目
- [ ] 人名補全：「陳社工」是否為「陳尚潔」（prs-chen-shang-jie）？
- [ ] 狀態確認：evt-xxx 的 status 是否應為 Court Recognized？

## 雙向關聯補充建議
- prs-xxx 的 related_events 建議新增：evt-yyy
```

---

## 八、常見錯誤與禁止事項

| 禁止行為 | 正確做法 |
|----------|----------|
| 把工會聲明直接寫進主線事件 | 建立 Claim（claim_type: Public），再在對應 Event.related_claims 中引用 |
| 把「據報導」的說法標記為 Confirmed | status 填 Claim，source_refs 填媒體來源 ID |
| 合併多個事件為一筆 | 每個日期、每個發生地點的事件獨立建立 |
| 自行補全不完整姓名 | name 填已知部分，description_short 說明「姓名待確認」 |
| 在一個 Event 中夾雜多個來源的說法 | 每個說法獨立成 Claim |
| 略過 index 更新 | 每次新增條目都必須同步更新 index 對應陣列 |

---

## 九、Obsidian 式雙向連結的實現原理

本系統的 Obsidian-like 功能是透過以下機制實現的：

1. **正向連結**：每個物件的 `related_xxx` 陣列是「我連結到誰」
2. **反向查找（backlinks）**：context-engine.js 的 `findBacklinks()` 函式會在整個資料庫中搜尋「誰連結到我」
3. **名稱掃描**：同一函式也會用實體名稱（含 alias）掃描所有文字欄位，自動建立未顯式連結但提及該實體的反向連結
4. **文字標記**：`tagText()` 函式在任何呈現文字時，自動找出實體名稱並包成可點擊的連結 chip

因此，**即使 related_entities 陣列為空**，只要文字中包含實體名稱，系統仍然會自動建立連結。
資料品質越高（related_xxx 填越完整），連結越精確；即使資料品質較低，名稱比對仍會提供兜底的關聯。

---

*文件結束 — DAYLIGHT ARCHIVE Import Specification v1.0*
