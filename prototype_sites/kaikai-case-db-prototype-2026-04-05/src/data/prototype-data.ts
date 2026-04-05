export type DataKind =
  | "timeline"
  | "person"
  | "organization"
  | "session"
  | "document"
  | "statement"
  | "glossary"
  | "source";

export type SearchRecord = {
  id: string;
  kind: DataKind;
  title: string;
  summary: string;
  tags: string[];
  source?: string;
};

export const siteMeta = {
  title: "剴剴案研究資料庫雛形",
  subtitle: "案件研究資料庫 / 脈絡探索網站 / 專業共構筆記平台",
  description:
    "這是一個為剴剴案研究而設計的資料庫網站雛形。它不是新聞頁，也不是一般文章站，而是用六個研究階段承接案情、人物、法庭、官方資料、輿論與名詞詞典的知識骨架。",
};

export const overviewCards = [
  {
    label: "研究階段",
    value: "6",
    detail: "以六個主題頁承接案件研究成果，讓後續資料補入時不會失去脈絡。",
  },
  {
    label: "時間軸事件",
    value: "8",
    detail: "從出養媒合、就醫死亡、監察調查到審判與修法，保留關鍵節點。",
  },
  {
    label: "人物與機構",
    value: "12",
    detail: "先以核心涉案者、證人與主要機構為主，之後可逐步擴充成完整百科。",
  },
  {
    label: "官方與輿論資料",
    value: "18",
    detail: "把官方文件、工會聲明、倡議行動與社會回應都轉成可引用的資料卡。",
  },
];

export const phaseCards = [
  {
    id: "overview",
    title: "案情總覽與時間軸",
    description:
      "把案件發展拆成可閱讀的事件節點，方便後續將人物、證詞與官方文件掛回相應時間點。",
    accent: "slate",
    count: "事件節點 8+",
  },
  {
    id: "entities",
    title: "人物與機構",
    description:
      "聚焦涉案人、證人、醫療與社福機構，先用百科型卡片建立角色關係。",
    accent: "amber",
    count: "條目 12",
  },
  {
    id: "court",
    title: "法庭與證詞",
    description:
      "用庭期卡和證詞摘要卡重建審判過程，維持冷靜、結構化、不情緒化的研究氣質。",
    accent: "indigo",
    count: "庭期 5",
  },
  {
    id: "official",
    title: "官方與法理資料",
    description:
      "整理監察院、衛福部、法務部與法條頁，做成後續可擴充的文件中樞。",
    accent: "emerald",
    count: "文件 6",
  },
  {
    id: "discourses",
    title: "輿論光譜與多元論述",
    description:
      "收斂工會聲明、機構回應、倡議事件與社會反應，形成可比對的論述資料層。",
    accent: "rose",
    count: "條目 6",
  },
  {
    id: "glossary",
    title: "名詞與延伸資料",
    description:
      "把制度、法律與社工實務名詞整理成詞條，讓整站更像可延伸的知識系統。",
    accent: "stone",
    count: "詞條 6",
  },
];

export const timelineEvents = [
  {
    id: "ev-placement",
    date: "2023",
    type: "安置 / 出養",
    title: "出養媒合與安置過程啟動",
    summary:
      "研究主線從出養安置與脆弱家庭服務的交會開始，之後牽動保母照顧、訪視與機構責任。",
    related: ["兒福聯盟", "新北市社會局", "文山居托中心"],
    key: true,
  },
  {
    id: "ev-death",
    date: "2023-12",
    type: "醫療",
    title: "受虐就醫與死亡成為案件核心轉折",
    summary:
      "男童送醫後死亡，醫療端的傷勢判斷與病歷內容成為後續刑事與制度檢討的重要起點。",
    related: ["萬芳醫院", "黃聖心", "兒虐判斷"],
    key: true,
  },
  {
    id: "ev-social-audit",
    date: "2024-03",
    type: "行政調查",
    title: "社政與兒少保護系統進入檢討階段",
    summary:
      "衛福部與地方政府陸續提出檢討與修正方向，聚焦訪視、安置與委託機構責任。",
    related: ["衛福部", "臺北市社會局", "新北市社會局"],
    key: true,
  },
  {
    id: "ev-indictment",
    date: "2024-08-27",
    type: "司法",
    title: "檢方起訴涉案社工",
    summary:
      "檢察官依過失致死與業務登載不實相關爭點起訴涉案社工，案件進入正式刑事審判。",
    related: ["陳尚潔", "臺北地院 114 年度訴字第 51 號"],
    key: true,
  },
  {
    id: "ev-monitor-report",
    date: "2025-05-29",
    type: "官方報告",
    title: "監察院調查報告公布",
    summary:
      "監察院提出調查與糾正意見，成為制度層面檢驗與責任歸屬的重要官方文件。",
    related: ["監察院", "糾正案", "制度缺失"],
    key: true,
  },
  {
    id: "ev-sessions-open",
    date: "2025-12",
    type: "庭期",
    title: "證人密集出庭，審理重點逐步成形",
    summary:
      "醫師、督導、訪視員與相關工作人員陸續出庭，證詞與檢辯攻防開始形成穩定主軸。",
    related: ["黃聖心", "白麗芳", "林心慈"],
    key: true,
  },
  {
    id: "ev-argument",
    date: "2026-02-26",
    type: "庭期",
    title: "言詞辯論與被告最後陳述",
    summary:
      "檢辯針對責任判準、訪視義務、病歷記載與制度負荷提出集中論述，成為目前研究的重要節點。",
    related: ["檢方主張", "辯方主張", "最後陳述"],
    key: true,
  },
  {
    id: "ev-judgment",
    date: "2026-04-16",
    type: "司法",
    title: "已公告宣判日期",
    summary:
      "此節點可保留為未來更新入口，承接判決結果、法庭理由與後續社會回應。",
    related: ["判決", "後續回應"],
    key: false,
  },
];

export const people = [
  {
    id: "per-chen",
    name: "陳尚潔",
    kind: "涉案社工",
    affiliation: "兒福聯盟",
    role: "本案刑事審判的核心被告之一，爭點集中於訪視、通報、紀錄與注意義務。",
    relatedSessions: ["2025-12-11", "2025-12-18", "2026-02-26"],
  },
  {
    id: "per-huang",
    name: "黃聖心",
    kind: "醫師",
    affiliation: "萬芳醫院",
    role: "醫療端關鍵證人，與受傷判斷、傷勢描述與就醫過程有高度關聯。",
    relatedSessions: ["2025-12-11"],
  },
  {
    id: "per-lin",
    name: "林心慈",
    kind: "訪視員 / 證人",
    affiliation: "文山居托中心",
    role: "訪視流程與照顧觀察的重要證人，影響對訪視品質與制度責任的判讀。",
    relatedSessions: ["2026-01-29"],
  },
  {
    id: "per-bai",
    name: "白麗芳",
    kind: "督導 / 證人",
    affiliation: "兒福聯盟",
    role: "與督導鏈、交辦紀錄、內部工作分工及機構管理有直接關聯。",
    relatedSessions: ["2025-12-18"],
  },
  {
    id: "per-liu",
    name: "劉彩萱",
    kind: "保母案被告",
    affiliation: "保母照顧端",
    role: "雖與社工案審理分流，但仍是整體案件脈絡的重要人物節點。",
    relatedSessions: ["保母案"],
  },
  {
    id: "per-nien",
    name: "粘羽涵",
    kind: "社工 / 關聯人",
    affiliation: "社福系統",
    role: "作為制度鏈上的相關工作者，常出現在社工責任與系統負荷討論中。",
    relatedSessions: ["制度討論"],
  },
];

export const organizations = [
  {
    id: "org-cl",
    name: "兒童福利聯盟文教基金會",
    type: "民間機構",
    role: "在本案中與出養媒合、社工業務及內部督導鏈高度相關。",
  },
  {
    id: "org-ntpc",
    name: "新北市政府社會局",
    type: "地方政府",
    role: "涉及委託安置、社會安全網與脆弱家庭支持的行政節點。",
  },
  {
    id: "org-tp",
    name: "臺北市政府社會局",
    type: "地方政府",
    role: "與跨縣市行政配套、委託安置流程與後續檢討有關。",
  },
  {
    id: "org-wenshan",
    name: "文山居托中心",
    type: "托育 / 訪視單位",
    role: "訪視與照顧觀察的重要節點，與證人出庭及實務流程密切相關。",
  },
  {
    id: "org-wanfang",
    name: "萬芳醫院",
    type: "醫療院所",
    role: "受傷判斷、送醫處理與醫療端證詞的重要來源。",
  },
  {
    id: "org-cy",
    name: "監察院",
    type: "監察機關",
    role: "公布調查報告與糾正案，是制度面檢討的核心官方資料來源。",
  },
];

export const courtSessions = [
  {
    id: "session-2025-12-11",
    date: "2025-12-11",
    type: "證人詰問",
    court: "臺北地方法院 114 年度訴字第 51 號",
    highlights: "醫療證人出庭，焦點集中於傷勢判讀、就醫時序與病歷內容。",
    prosecution: "強調被告先前的注意義務與後續紀錄內容之間存在重大落差。",
    defense: "主張社工並非醫療專業，對傷勢判斷與病況發展無法完全預見。",
    witnesses: ["黃聖心"],
  },
  {
    id: "session-2025-12-18",
    date: "2025-12-18",
    type: "督導 / 機構證人",
    court: "臺北地方法院 114 年度訴字第 51 號",
    highlights: "機構督導鏈、工作分工與交辦紀錄成為法庭攻防重點。",
    prosecution: "指出內部流程與監督義務未有效落實。",
    defense: "主張工作分工複雜，不能把整體制度負荷完全歸責於單一被告。",
    witnesses: ["白麗芳"],
  },
  {
    id: "session-2026-01-22",
    date: "2026-01-22",
    type: "制度背景證人",
    court: "臺北地方法院 114 年度訴字第 51 號",
    highlights: "法庭逐步將焦點延伸到制度配置與實務限制。",
    prosecution: "認為制度困難不能完全排除個別行為責任。",
    defense: "強調人力負荷、交接與系統斷點對個案處理的實質影響。",
    witnesses: ["粘羽涵"],
  },
  {
    id: "session-2026-01-29",
    date: "2026-01-29",
    type: "訪視證人",
    court: "臺北地方法院 114 年度訴字第 51 號",
    highlights: "訪視頻率、不預告訪視與照顧觀察內容成為核心爭點。",
    prosecution: "主張訪視與後續追蹤不足，無法及時阻止風險升高。",
    defense: "指出訪視端與社工端有不同職責分工，不能簡化為單線責任。",
    witnesses: ["林心慈"],
  },
  {
    id: "session-2026-02-26",
    date: "2026-02-26",
    type: "言詞辯論 / 最後陳述",
    court: "臺北地方法院 114 年度訴字第 51 號",
    highlights: "檢辯雙方集中處理責任判準、紀錄真實性、制度風險與被告最後陳述。",
    prosecution: "強調刑法上注意義務與紀錄內容的可歸責性。",
    defense: "主張制度失靈與資訊落差不應被折算成單一被告的刑責。",
    witnesses: ["檢方", "辯方", "被告最後陳述"],
  },
];

export const documents = [
  {
    id: "doc-cy-report",
    title: "監察院調查報告與糾正案",
    issuer: "監察院",
    date: "2025-05-29",
    type: "調查報告",
    theme: "制度責任與行政監督",
    summary:
      "整理兒虐案件中的行政與委託體系缺失，成為檢驗社會安全網與委託安置流程的重要官方基準。",
    url: "https://www.cy.gov.tw/News_Content.aspx?n=125&s=34118",
  },
  {
    id: "doc-mohw-plan",
    title: "兒虐防治與社安網檢討說明",
    issuer: "衛生福利部",
    date: "2024-03-13",
    type: "新聞稿 / 政策說明",
    theme: "社會安全網與檢討機制",
    summary:
      "回應剴剴案後的制度檢討方向，包含跨系統合作、訪視與安置流程的修正。",
    url: "https://www.mohw.gov.tw/cp-6653-77975-1.html",
  },
  {
    id: "doc-mohw-audit",
    title: "兒少保護事件專案檢討結果",
    issuer: "衛生福利部",
    date: "2024-03-24",
    type: "政策檢討",
    theme: "中央檢討與修正措施",
    summary:
      "聚焦個案流程、委託合作與行政督導，作為後續制度補強的重要文件。",
    url: "https://www.mohw.gov.tw/cp-6653-78147-1.html",
  },
  {
    id: "doc-criminal-15",
    title: "刑法第 15 條",
    issuer: "全國法規資料庫",
    date: "現行法",
    type: "法條",
    theme: "不作為犯與保證人地位",
    summary:
      "提供討論社工責任時常被引用的法理背景，與不作為是否可成立刑責有關。",
    url: "https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=15&pcode=C0000001",
  },
  {
    id: "doc-criminal-215",
    title: "刑法第 215 條",
    issuer: "全國法規資料庫",
    date: "現行法",
    type: "法條",
    theme: "業務登載不實",
    summary:
      "涉及紀錄真實性與業務登載內容的法律基礎，是本案刑事爭點之一。",
    url: "https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=215&pcode=C0000001",
  },
  {
    id: "doc-criminal-286",
    title: "刑法第 286 條",
    issuer: "全國法規資料庫",
    date: "現行法",
    type: "法條",
    theme: "對兒少之傷害與死亡",
    summary:
      "在剴剴案整體社會脈絡中，常被拿來對照虐待與致死責任的法律條文。",
    url: "https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=286&pcode=C0000001",
  },
];

export const statements = [
  {
    id: "statement-320",
    speaker: "320 挺社工行動與相關工會聲明",
    date: "2024-03-18",
    type: "專業聲明",
    position: "反對把制度失靈簡化為單一社工責任",
    summary:
      "主張應區分制度缺陷、工作負荷與個別刑責，不應用單一事件壓垮整體社工專業。",
  },
  {
    id: "statement-apology",
    speaker: "政府道歉與制度改革訴求",
    date: "2025-12-24",
    type: "社會倡議",
    position: "要求政府承認制度失靈並提出更具體改革",
    summary:
      "將剴剴案視為社會安全網與兒少保護體系長期問題的集中表現，要求明確改革時程。",
  },
  {
    id: "statement-teachers",
    speaker: "19 所社工系所聯合聲明",
    date: "2026-04-03",
    type: "學界聲明",
    position: "呼籲從專業與制度層次理解社工審判風險",
    summary:
      "希望社會不要用簡化敘事替代制度分析，並關注刑事審判對社工專業帶來的長期效應。",
  },
  {
    id: "statement-cl-response",
    speaker: "兒福聯盟回應",
    date: "2025-05-28",
    type: "機構回應",
    position: "回應外界對機構責任與內部改革的質疑",
    summary:
      "強調內部檢討與制度改善方向，但外界仍高度關注責任釐清與實際改變。",
  },
  {
    id: "statement-march",
    speaker: "護兒倡議與街頭行動",
    date: "2025-05-10",
    type: "倡議事件",
    position: "要求加重兒虐保護與制度問責",
    summary:
      "以街頭行動和公眾聲量推動制度改革，讓案件不只停留在個別審判層次。",
  },
  {
    id: "statement-warriors",
    speaker: "剴剴戰士與網路社群",
    date: "2025-12-11",
    type: "社會輿論",
    position: "以網路社群形式持續關注案件進展",
    summary:
      "透過社群追蹤庭期、聲援行動與資料整理，形成新的公眾參與模式。",
  },
];

export const glossary = [
  {
    id: "term-adoption",
    term: "出養媒合",
    type: "社工實務",
    definition:
      "指兒少經適當程序後，進入收養或出養安排時的配對與評估過程，涉及社工、機構與行政節點。",
    relevance:
      "本案研究需要從出養媒合與安置脈絡出發，才能理解後續照顧、訪視與責任鏈。",
  },
  {
    id: "term-vulnerable",
    term: "脆弱家庭服務",
    type: "政策 / 社工",
    definition:
      "社會福利系統針對高風險或支持薄弱家庭提供的持續性支持與追蹤服務。",
    relevance:
      "本案的行政與制度討論，經常回到社會安全網與脆弱家庭支持是否有效銜接。",
  },
  {
    id: "term-unannounced",
    term: "不預告訪視",
    type: "訪視實務",
    definition:
      "在未預先通知的情況下進行訪視，以更接近真實照顧狀態的方式觀察環境與兒少狀況。",
    relevance:
      "法庭與制度討論裡，不預告訪視常被視為評估風險與照顧狀態的重要手段。",
  },
  {
    id: "term-false-record",
    term: "業務登載不實",
    type: "刑法",
    definition:
      "指業務上應記載的事項，故意登載與事實不符內容，可能引發刑事責任。",
    relevance:
      "這是社工案審判中非常重要的法律爭點，直接關聯紀錄內容與可歸責性。",
  },
  {
    id: "term-omission",
    term: "不作為犯",
    type: "刑法",
    definition:
      "在法律上具有作為義務的人，未履行其應作為而造成結果時，可能成立犯罪。",
    relevance:
      "檢辯爭點之一，就是社工是否具備足以成立不作為責任的法律地位與注意義務。",
  },
  {
    id: "term-lay-judges",
    term: "國民法官",
    type: "司法制度",
    definition:
      "由一般公民與職業法官共同參與重大刑事案件審判的制度。",
    relevance:
      "雖本 prototype 聚焦社工案研究，但保母案與社會討論常讓國民法官制度成為延伸關注點。",
  },
];

export const sources = [
  {
    id: "src-cy",
    title: "監察院調查報告與糾正案",
    publisher: "監察院",
    date: "2025-05-29",
    type: "官方文件",
    credibility: "A",
    url: "https://www.cy.gov.tw/News_Content.aspx?n=125&s=34118",
  },
  {
    id: "src-mohw",
    title: "衛福部兒虐防治與社安網檢討說明",
    publisher: "衛生福利部",
    date: "2024-03-13",
    type: "官方新聞稿",
    credibility: "A",
    url: "https://www.mohw.gov.tw/cp-6653-77975-1.html",
  },
  {
    id: "src-cna",
    title: "中央社相關起訴與庭期報導",
    publisher: "中央社",
    date: "2024-08-27",
    type: "新聞報導",
    credibility: "A-",
    url: "https://www.cna.com.tw/",
  },
  {
    id: "src-pts",
    title: "公視新聞與專題報導",
    publisher: "公視新聞網",
    date: "2024-03-13",
    type: "新聞 / 專題",
    credibility: "A-",
    url: "https://news.pts.org.tw/",
  },
];

export const searchRecords: SearchRecord[] = [
  ...timelineEvents.map((item) => ({
    id: item.id,
    kind: "timeline" as const,
    title: item.title,
    summary: item.summary,
    tags: [item.type, ...item.related],
  })),
  ...people.map((item) => ({
    id: item.id,
    kind: "person" as const,
    title: item.name,
    summary: `${item.kind} / ${item.affiliation} / ${item.role}`,
    tags: [item.kind, item.affiliation, ...item.relatedSessions],
  })),
  ...organizations.map((item) => ({
    id: item.id,
    kind: "organization" as const,
    title: item.name,
    summary: `${item.type} / ${item.role}`,
    tags: [item.type, item.role],
  })),
  ...courtSessions.map((item) => ({
    id: item.id,
    kind: "session" as const,
    title: `${item.date} / ${item.type}`,
    summary: item.highlights,
    tags: [item.court, ...item.witnesses],
  })),
  ...documents.map((item) => ({
    id: item.id,
    kind: "document" as const,
    title: item.title,
    summary: item.summary,
    tags: [item.issuer, item.type, item.theme],
    source: item.url,
  })),
  ...statements.map((item) => ({
    id: item.id,
    kind: "statement" as const,
    title: `${item.speaker} / ${item.type}`,
    summary: item.summary,
    tags: [item.position, item.date],
  })),
  ...glossary.map((item) => ({
    id: item.id,
    kind: "glossary" as const,
    title: item.term,
    summary: item.definition,
    tags: [item.type],
  })),
  ...sources.map((item) => ({
    id: item.id,
    kind: "source" as const,
    title: item.title,
    summary: `${item.publisher} / ${item.date} / ${item.type}`,
    tags: [item.publisher, item.type, item.credibility],
    source: item.url,
  })),
];

export const latestUpdates = [
  {
    id: "upd-1",
    label: "官方資料更新",
    title: "已把監察院、衛福部與法條頁納入文件中樞",
    detail: "後續可以直接接上文件摘要、關聯事件與引用格式，而不必重做結構。",
  },
  {
    id: "upd-2",
    label: "法庭模組雛形",
    title: "已用庭期卡 + 證詞摘要建立法庭主頁骨架",
    detail: "等正式資料補進來後，可以把每一庭的證詞與攻防擴成更完整的研究頁。",
  },
  {
    id: "upd-3",
    label: "圖譜頁預備",
    title: "人物、機構、事件與文件的關聯節點已先抽象化",
    detail: "這讓 React Flow 不再只是技術 demo，而是之後真正的案件關聯圖基底。",
  },
];
