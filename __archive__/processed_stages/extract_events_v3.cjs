const fs = require('fs');
const path = require('path');

const outputBase = 'c:/Users/User/OneDrive/Desktop/網站雛型/content/events';
const indexPath = 'c:/Users/User/OneDrive/Desktop/網站雛型/content/_index.json';

if (!fs.existsSync(outputBase)) {
  fs.mkdirSync(outputBase, { recursive: true });
}

const EVENTS = [
  // Phase 1: Pre-history
  { id: "evt-20220221-kaikai-born", date: "2022-02-21", title: "剴剴（A童）出生", phase: "prehistory-family", significance: "案件被害人出生，後因家庭功能失調進入社安網。" },
  
  // Phase 2: Referral
  { id: "evt-20230901-transfer-to-cwlf", date: "2023-09-01", title: "新北市政府轉介至兒福聯盟", phase: "referral-adoption-placement", significance: "由新北市樹鶯社福中心委託兒盟辦理收出養服務。" },
  { id: "evt-20230904-placement-with-nanny-liu", date: "2023-09-04", title: "剴剴安置於保母劉彩萱家中", phase: "referral-adoption-placement", significance: "正式開始由兒盟合作保母進行全日托育安置。" },
  
  // Phase 3: Custody & Abuse
  { id: "evt-20230926-taipei-first-visit", date: "2023-09-26", title: "臺北市居托中心首次訪視", phase: "custody-and-abuse", significance: "文山區居托中心訪視員林心慈首次家訪，未發現異狀。" },
  { id: "evt-20231024-bruises-found", date: "2023-10-24", title: "兒盟社工發現剴剴額頭瘀青", phase: "custody-and-abuse", significance: "社工陳尚潔訪視時發現傷勢，採信保母「公園撞傷」說詞。" },
  
  // Phase 4: Death
  { id: "evt-20231224-kaikai-death", date: "2023-12-24", title: "剴剴因受虐致死於萬芳醫院", phase: "injury-medical-death", significance: "男童到院前死亡，案情爆發並引發大規模司法調查。" },
  
  // Phase 5: Nanny Trial
  { id: "evt-20240311-news-breaks", date: "2024-03-11", title: "虐童案情由媒體與家屬友人首度揭露", phase: "criminal-nanny-trial", significance: "引發全臺輿論高度關注。 " },
  { id: "evt-20240418-nanny-indictment", date: "2024-04-18", title: "臺北地檢署起訴保母姊妹", phase: "criminal-nanny-trial", significance: "劉彩萱、劉若琳被控凌虐幼童案致死罪。" },
  { id: "evt-20250512-nanny-first-verdict", date: "2025-05-12", title: "保母姊妹一審判決宣判", phase: "criminal-nanny-trial", significance: "北院國民法官判處劉彩萱無期徒刑、劉若琳18年徒刑。" },
  { id: "evt-20260126-nanny-second-verdict", date: "2026-01-26", title: "保母姊妹二審宣判（維持原判）", phase: "criminal-nanny-trial", significance: "高等法院駁回上訴，維持一審重刑判定。" },
  
  // Phase 6: Social Worker Trial
  { id: "evt-20240313-cwlf-raid-social-worker-handcuffed", date: "2024-03-13", title: "兒福聯盟總部遭搜索，主責社工被帶走", phase: "criminal-social-worker-trial", significance: "社工手銬爭議引發社工界集體抗議與不安。" },
  { id: "evt-20240827-social-worker-indictment", date: "2024-08-27", title: "臺北地檢署起訴社工陳尚潔", phase: "criminal-social-worker-trial", significance: "起訴罪名包含過失致死、偽造訪視紀錄（業務登載不實）。" },
  { id: "evt-20251211-social-worker-witness-hearing-1", date: "2025-12-11", title: "社工案關鍵證人（醫師、兒盟副處長）出庭", phase: "criminal-social-worker-trial", significance: "萬芳醫院醫師黃聖心證稱傷勢為肉眼可辨。" },
  { id: "evt-20260416-social-worker-scheduled-verdict", date: "2026-04-16", title: "社工案一審預定宣判日", phase: "criminal-social-worker-trial", significance: "焦點在於「保證人地位」的法律判定。" },
  
  // Phase 7: Oversight
  { id: "evt-20240325-mohw-cwlf-audit-report", date: "2024-03-25", title: "衛福部與教育部公布兒盟聯合查核結果", phase: "oversight-admin-review", significance: "列出兒盟內部督導與安置評估之七大缺失。" },
  { id: "evt-20250529-control-yuan-correction", date: "2025-05-29", title: "監察院通過糾正案文", phase: "oversight-admin-review", significance: "正式糾正衛福部、新北市府、臺北市府，指監督流於形式。" },
  
  // Phase 8: Legislation
  { id: "evt-20250718-kaikai-clause-legislation", date: "2025-07-18", title: "立法院通過「剴剴條款」（刑法修正）", phase: "legislation-public-discourse", significance: "加重虐童致死刑責，最高可處死刑或無期徒刑。" },
  { id: "evt-20250801-kaikai-clause-effective", date: "2025-08-01", title: "「剴剴條款」總統公布生效", phase: "legislation-public-discourse", significance: "法規正式上路，完成本案引導之法制補洞。" }
];

EVENTS.forEach(e => {
  const data = {
    event_id: e.id,
    date: e.date,
    title: e.title,
    phase: e.phase,
    description: "", // Fallback
    significance: e.significance,
    location: "",
    related_entities: [],
    source_refs: [],
    tags: [e.phase]
  };
  fs.writeFileSync(path.join(outputBase, `${e.id}.json`), JSON.stringify(data, null, 2));
});

// Update Index
const indexData = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
indexData.events = EVENTS.map(e => e.id);
indexData.total_events = EVENTS.length;
fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2));

console.log(`Generated ${EVENTS.length} events and updated index.`);
