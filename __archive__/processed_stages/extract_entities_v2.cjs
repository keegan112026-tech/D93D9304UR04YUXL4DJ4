const fs = require('fs');
const path = require('path');

const inputFiles = [
  'c:/Users/User/OneDrive/Desktop/網站雛型/第二階段完成.md',
  'c:/Users/User/OneDrive/Desktop/網站雛型/第二階段：剴剴案實體機構與關係人百科暨權責網絡深度調查報告.md'
];

const outputBase = 'c:/Users/User/OneDrive/Desktop/網站雛型/content/entities';
const indexPath = 'c:/Users/User/OneDrive/Desktop/網站雛型/content/_index.json';

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

ensureDir(path.join(outputBase, 'people'));
ensureDir(path.join(outputBase, 'orgs'));
ensureDir(path.join(outputBase, 'laws'));

// Seed list of entity IDs based on manual mapping and the SPEC
const ENTITIES = {
  people: [
    { id: "prs-chen-shang-jie", name: "陳尚潔", role: "兒福聯盟出養社工，本案被告", affiliation: "org-cwlf", involvement: "defendant" },
    { id: "prs-liu-cai-xuan", name: "劉彩萱", role: "居家托育人員，保母案被告（已判刑）", affiliation: "org-taipei-sw", involvement: "defendant" },
    { id: "prs-liu-ruo-lin", name: "劉若琳", role: "居家托育人員，劉彩萱之妹，保母案被告（已判刑）", affiliation: "org-taipei-sw", involvement: "defendant" },
    { id: "prs-ye-da-hua", name: "葉大華", role: "監察委員", affiliation: "org-control-yuan", involvement: "official" },
    { id: "prs-wang-you-ling", name: "王幼玲", role: "監察委員", affiliation: "org-control-yuan", involvement: "official" },
    { id: "prs-zhang-ju-fang", name: "張菊芳", role: "監察委員", affiliation: "org-control-yuan", involvement: "official" },
    { id: "prs-lin-yu-zhen", name: "林鈺珍", role: "臺灣臺北地方法院審判長", affiliation: "org-tpd-court", involvement: "judge" },
    { id: "prs-lin-yu-mei", name: "林于湄", role: "臺灣臺北地方檢察署檢察官", affiliation: "org-tpd-prosecution", involvement: "prosecutor" },
    { id: "prs-xu-zhuo-xian", name: "許倬憲", role: "法務部法醫研究所病理組組長", affiliation: "org-forensic-moj", involvement: "expert" },
    { id: "prs-lyu-li", name: "呂立", role: "臺大醫院兒少保護醫療中心主任", affiliation: "org-ntu-hospital", involvement: "expert" },
    { id: "prs-qiu-yan-nan", name: "丘彥南", role: "臺大醫院兒童精神科醫師", affiliation: "org-ntu-hospital", involvement: "expert" },
    { id: "prs-li-fang-ling", name: "李芳玲", role: "兒福聯盟副處長", affiliation: "org-cwlf", involvement: "witness-neutral" },
    { id: "prs-jiang-yi-yun", name: "江怡韻", role: "兒福聯盟督導", affiliation: "org-cwlf", involvement: "witness-neutral" },
    { id: "prs-ye-shi-yu", name: "葉詩宇", role: "兒福聯盟社工", affiliation: "org-cwlf", involvement: "witness-neutral" },
    { id: "prs-ye-ting-xi", name: "葉亭希", role: "兒福聯盟組長", affiliation: "org-cwlf", involvement: "witness-neutral" },
    { id: "prs-bai-li-fang", name: "白麗芳", role: "兒福聯盟前執行長", affiliation: "org-cwlf", involvement: "witness-neutral" },
    { id: "prs-shi-ying-ru", name: "施盈如", role: "樹鶯社福中心社工", affiliation: "org-shuying-center", involvement: "witness-neutral" },
    { id: "prs-huang-sheng-xin", name: "黃聖心", role: "萬芳醫院急診醫學科主治醫師", affiliation: "org-wanfang-hospital", involvement: "witness-neutral" },
    { id: "prs-xu-pei-hua", name: "徐珮華", role: "社家署家庭支持組家庭資源科視察", affiliation: "org-sfaa", involvement: "official" },
    { id: "prs-huang-ling-fang", name: "黃鈴芳", role: "文山居托中心督導", affiliation: "org-wenshan-childcare", involvement: "witness-neutral" },
    { id: "prs-lin-xin-ci", name: "林心慈", role: "文山居托中心訪視員", affiliation: "org-wenshan-childcare", involvement: "witness-neutral" },
    { id: "prs-nian-yu-han", name: "粘羽涵", role: "臺北市政府社會局婦幼科科長", affiliation: "org-taipei-sw", involvement: "official" }
  ],
  orgs: [
    { id: "org-control-yuan", name: "監察院", alias: ["監院"], type: "government-central" },
    { id: "org-mohw", name: "衛生福利部", alias: ["衛福部"], type: "government-central" },
    { id: "org-sfaa", name: "衛生福利部社會及家庭署", alias: ["社家署", "SFAA"], type: "government-central" },
    { id: "org-taipei-sw", name: "臺北市政府社會局", alias: ["北市社會局"], type: "government-local" },
    { id: "org-ntpc-sw", name: "新北市政府社會局", alias: ["新北社會局"], type: "government-local" },
    { id: "org-shuying-center", name: "樹鶯社福中心", alias: ["樹鶯中心"], type: "government-local" },
    { id: "org-wenshan-childcare", name: "臺北市文山區居家托育服務中心", alias: ["文山居托中心"], type: "government-local" },
    { id: "org-da-ai-care", name: "社團法人新北市大愛關懷協會", alias: ["大愛關懷協會"], type: "ngo" },
    { id: "org-cwlf", name: "財團法人中華民國兒童福利聯盟文教基金會", alias: ["兒福聯盟", "兒盟", "CWLF"], type: "ngo" },
    { id: "org-tpd-court", name: "臺灣臺北地方法院", alias: ["北院", "台北地院"], type: "court" },
    { id: "org-tpd-prosecution", name: "臺灣臺北地方檢察署", alias: ["北檢"], type: "prosecution" },
    { id: "org-wanfang-hospital", name: "臺北市立萬芳醫院", alias: ["萬芳醫院"], type: "hospital" },
    { id: "org-forensic-moj", name: "法務部法醫研究所", alias: ["法醫所"], type: "academic" },
    { id: "org-ntu-hospital", name: "國立臺灣大學醫學院附設醫院", alias: ["臺大醫院"], type: "hospital" },
    { id: "org-catholic-welfare", name: "財團法人天主教福利會", alias: ["天主教福利會"], type: "ngo" }
  ],
  laws: [
    { id: "law-guarantor-status", name: "保證人地位", type: "legal-principle", description: "刑法上對於防止犯罪結果發生負有法律義務之地位。" },
    { id: "law-criminal-15", name: "刑法第15條", type: "legislation", description: "不作為犯之處罰規定。" },
    { id: "law-criminal-215", name: "刑法第215條", type: "legislation", description: "業務登載不實罪。" },
    { id: "law-child-youth-welfare-act", name: "兒童及少年福利與權益保障法", type: "legislation", description: "保障兒少身心健康與權益之核心法規。" }
  ]
};

// Process People
ENTITIES.people.forEach(p => {
  const data = {
    entity_id: p.id,
    name: p.name,
    alias: [],
    entity_type: "person",
    role_in_case: p.role,
    affiliation: p.affiliation,
    description_short: p.role, // Simple fallback
    case_involvement: p.involvement,
    appeared_in_hearings: [],
    source_refs: [], // To be populated if matching
    related_entities: [p.affiliation],
    related_events: [],
    related_topics: []
  };
  fs.writeFileSync(path.join(outputBase, 'people', `${p.id}.json`), JSON.stringify(data, null, 2));
});

// Process Orgs
ENTITIES.orgs.forEach(o => {
  const data = {
    entity_id: o.id,
    name: o.name,
    alias: o.alias,
    entity_type: "organization",
    org_type: o.type,
    jurisdiction: "Taiwan",
    official_mandate: "",
    role_in_case: "",
    key_personnel: ENTITIES.people.filter(p => p.affiliation === o.id).map(p => p.id),
    source_refs: [],
    related_entities: [],
    related_events: [],
    related_topics: []
  };
  fs.writeFileSync(path.join(outputBase, 'orgs', `${o.id}.json`), JSON.stringify(data, null, 2));
});

// Process Laws
ENTITIES.laws.forEach(l => {
  const data = {
    entity_id: l.id,
    name: l.name,
    entity_type: "law",
    law_type: l.type,
    description: l.description,
    source_refs: [],
    related_topics: []
  };
  fs.writeFileSync(path.join(outputBase, 'laws', `${l.id}.json`), JSON.stringify(data, null, 2));
});

// Update Index
const indexData = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
indexData.people = ENTITIES.people.map(p => p.id);
indexData.orgs = ENTITIES.orgs.map(o => o.id);
indexData.laws = ENTITIES.laws.map(l => l.id);
indexData.total_entities = indexData.people.length + indexData.orgs.length + indexData.laws.length;
fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2));

console.log(`Generated ${ENTITIES.people.length} people, ${ENTITIES.orgs.length} orgs, and ${ENTITIES.laws.length} laws.`);
