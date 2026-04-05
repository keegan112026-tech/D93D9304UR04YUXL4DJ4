# 剴剴案百科資料庫｜主索引（Master Database Index）

> 版本：v0.1  
> 更新時間：2026-04-05（Asia/Taipei）  
> 目的：將六個階段的成果收斂成後續可網站化、可資料表化、可持續擴充的主索引。

---

## 一、使用方式

本索引不重寫六個階段的全文，而是回答三件事：

1. 這個資料庫目前有哪些主題模組
2. 每個模組的正式主檔與來源檔在哪裡
3. 後續若要擴充，應從哪個模組接續

---

## 二、核心模組總覽

| 模組代碼 | 模組名稱 | 對應階段 | 主檔 | 來源檔 | 目前狀態 |
|---|---|---|---|---|---|
| MOD-01 | 案情總覽與時間軸 | 第一階段 | `phase_01_case_overview/stage1_overview_source.md` | `phase_01_case_overview/stage1_links_source.md` | 已有基礎稿，可後續再整理為正式條目 |
| MOD-02 | 實體機構與關係人百科 | 第二階段 | `phase_02_entities_and_witnesses/phase2_entities_witnesses.md` | `phase_02_entities_and_witnesses/phase2_entities_witnesses_sources.md` | v0.1 完成 |
| MOD-03 | 法庭實況與證詞 | 第三階段 | `phase_03_court_proceedings/phase3_court_proceedings.md` | `phase_03_court_proceedings/phase3_court_proceedings_sources.md` | v0.1 完成 |
| MOD-04 | 官方與法理基準 | 第四階段 | `phase_04_official_data/phase4_official_data.md` | `phase_04_official_data/phase4_official_data_sources.md` | v0.1 完成 |
| MOD-05 | 輿論光譜與多元論述 | 第五階段 | `phase_05_public_discourses/phase5_public_discourses.md` | `phase_05_public_discourses/phase5_public_discourses_sources.md` | v0.1 完成 |
| MOD-06 | 名詞釋義與延伸資料 | 第六階段 | `phase_06_glossary_and_related/phase6_glossary_related.md` | `phase_06_glossary_and_related/phase6_glossary_related_sources.md` | v0.1 完成 |

---

## 三、資料庫主鍵建議

若後續要改寫成網站、Notion、Sheet 或資料表，建議至少建立以下主鍵類型：

### 1. 案件事件（Event）

| 建議欄位 | 說明 |
|---|---|
| `event_id` | 例如 `EV-2023-12-24-death` |
| `date` | 精確日期 |
| `title` | 事件標題 |
| `summary` | 客觀摘要 |
| `phase_refs` | 關聯到哪些階段條目 |
| `source_refs` | 關聯到哪些來源編號 |

### 2. 機構／單位（Entity）

| 建議欄位 | 說明 |
|---|---|
| `entity_id` | 例如 `ENT-CHILDREN-LEAGUE` |
| `name` | 全名 |
| `alias` | 簡稱 |
| `category` | 政府、法院、醫院、民間機構等 |
| `role_in_case` | 在本案中的角色 |
| `source_refs` | 來源編號 |

### 3. 人物（Person）

| 建議欄位 | 說明 |
|---|---|
| `person_id` | 例如 `PER-CHEN-SHANG-JIE` |
| `name` | 姓名 |
| `affiliation` | 隸屬單位 |
| `title` | 職稱 |
| `role_in_case` | 被告、證人、鑑定人、官員等 |
| `verification_status` | 已補證 / 待補證 |
| `source_refs` | 來源編號 |

### 4. 庭期（Hearing）

| 建議欄位 | 說明 |
|---|---|
| `hearing_id` | 例如 `HR-2025-12-11` |
| `date` | 開庭日期 |
| `case_number` | 案號 |
| `hearing_type` | 準備程序、言詞辯論、證人訊問等 |
| `highlights` | 重點摘要 |
| `witness_refs` | 關聯人物 |
| `source_refs` | 來源編號 |

### 5. 政策／法規／官方文件（Official Record）

| 建議欄位 | 說明 |
|---|---|
| `official_id` | 例如 `OFF-CY-2025-05-29` |
| `title` | 文件或事件名稱 |
| `issuer` | 發布單位 |
| `date` | 日期 |
| `category` | 監察院、衛福部、法條、司法院等 |
| `summary` | 客觀摘要 |
| `source_refs` | 來源編號 |

### 6. 論述／倡議（Discourse）

| 建議欄位 | 說明 |
|---|---|
| `discourse_id` | 例如 `DIS-320-SOCIAL-WORK` |
| `speaker` | 發表單位／倡議群體 |
| `date` | 日期 |
| `position_type` | 專業論述 / 社會倡議 / 政治發言 |
| `core_claim` | 核心主張 |
| `source_refs` | 來源編號 |

### 7. 名詞條目（Glossary）

| 建議欄位 | 說明 |
|---|---|
| `term_id` | 例如 `TERM-GUARANTOR-DUTY` |
| `term` | 名詞 |
| `definition` | 定義 |
| `case_relevance` | 與本案關聯 |
| `source_refs` | 來源編號 |

---

## 四、目前可直接作為正式條目群的內容

### A. 機構條目

- 兒福聯盟
- 新北市政府社會局
- 樹鶯社福中心
- 臺北市政府社會局
- 文山居托中心
- 社家署
- 臺北地院
- 臺北地檢署
- 萬芳醫院
- 財團法人天主教福利會

來源主檔：
- `phase_02_entities_and_witnesses/phase2_entities_witnesses.md`

### B. 人物條目

- 陳尚潔
- 劉彩萱
- 劉若琳
- 黃聖心
- 林心慈
- 粘羽涵
- 白麗芳
- 葉亭希
- 葉詩宇
- 呂立
- 許倬憲
- 丘彥南
- 徐堅棋
- 周姓保母

備註：
- 徐珮華、施盈如目前仍維持待補證，不列入正式條目群。

### C. 庭期條目

- 2025-01-06
- 2025-04-17
- 2025-07-17
- 2025-11-27
- 2025-12-11
- 2025-12-18
- 2026-01-22
- 2026-01-29
- 2026-02-23
- 2026-02-26
- 2026-04-16（待發生／待補）

### D. 官方文件／法理條目

- 監察院調查與糾正
- 衛福部策進方向說明
- 聯合查核兒福聯盟結果
- 居托訪視指引修訂
- 社安網第二期
- 刑法第 15 條
- 刑法第 215 條
- 刑法第 286 條
- 國民法官制度

### E. 論述條目

- 320 挺社工
- 社工工會要求政府道歉與制度改革
- 19 所大學社工系所教師聯合聲明
- 兒福聯盟澄清與聲明
- 護兒大遊行／陳情
- 剴剴戰士法院外聲援
- 社工上銬移送比例原則爭議
- 政治人物與公眾人物介入討論

### F. 名詞條目

- 收出養媒合
- 脆弱家庭
- 不預告訪視
- 業務登載不實罪
- 不作為犯／保證人地位
- 國民法官
- 準備程序
- 居家托育服務中心

---

## 五、後續建議的資料庫化順序

1. 先將第二、三、四階段轉成結構化表格
2. 再建立人物、機構、庭期、法規之間的關聯欄位
3. 最後再把第五、六階段接上，形成：
   - 事實層
   - 官方基準層
   - 論述層
   - 名詞層

---

## 六、搭配文件

- 來源總表：`source_manifest/SOURCE_MANIFEST.md`
- 目前狀態：`working_notes/CURRENT_STATUS.md`
- 待補證索引：`database_structures/PENDING_VERIFICATION_INDEX.md`
- 交叉對照表：`database_structures/CROSS_REFERENCE_MATRIX.md`
