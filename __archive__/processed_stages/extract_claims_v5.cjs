const fs = require('fs');
const path = require('path');

const claimBase = 'c:/Users/User/OneDrive/Desktop/網站雛型/content/claims';
const topicBase = 'c:/Users/User/OneDrive/Desktop/網站雛型/content/topics';
const indexPath = 'c:/Users/User/OneDrive/Desktop/網站雛型/content/_index.json';

[claimBase, topicBase].forEach(p => {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});

const CLAIMS = [
  { id: "clm-sw-union-20240313", type: "Professional", statement: "質疑警方上銬合法性與比例原則", pro: ["prs-taipei-sw-union"], con: ["prs-national-police-agency"], summary: "主張社會情緒不應取代程序正義，警察上銬行為涉嫌違反偵查不公開。" },
  { id: "clm-academic-joint-20260402", type: "Academic", statement: "司法應審酌社工實務侷限，拒絕以結果論定罪", pro: ["prs-ntu-sw-department", "prs-ntnu-sw-department"], con: ["prs-lin-yu-mei"], summary: "近20所大學社工系所聯合聲明，認為不應將制度性缺口完全歸責於個人。 " },
  { id: "clm-cwlf-reform-20250513", type: "Institutional", statement: "建立中高風險個案雙人訪視與複判制度", pro: ["org-cwlf"], con: [], summary: "兒盟因應案件提出三大作為，包含雙人訪視、強制複訓及疑慮個案即時複判。" },
  { id: "clm-public-protest-20250510", type: "Public", statement: "萬人凱道遊行：訴求重罰虐童與成立專責機關", pro: ["prs-yu-fang", "prs-jia-yong-jie"], con: ["org-mohw"], summary: "民間自發「剴剴網路媽媽群」發起集會，收集逾8萬份連署書訴求制度改革。" },
  { id: "clm-guarantor-status-debate", type: "Legal", statement: "社工是否具備「保證人地位」之法律義務", pro: ["prs-lin-yu-mei"], con: ["prs-chen-shang-jie"], summary: "檢方認為社工身為聯繫窗口負有生命追蹤義務；辯方認為社工非保姆，不應承擔結果。" }
];

const TOPICS = [
  { id: "top-adoption", title: "出養 (Adoption)", def: "透過法律程序轉移生父母親權，終止原親子關係並建立新收養關係之行為。" },
  { id: "top-fragile-family", title: "脆弱家庭 (Fragile Family)", def: "因貧窮、失業、身心障礙等因素致功能不足，需多重支持介入之家庭體系。" },
  { id: "top-unannounced-visits", title: "不預約訪視 (Unannounced Visits)", def: "居托訪視原則：不預報、不同時段、親見兒童，以確認真實照顧情況。" },
  { id: "top-mandatory-reporting", title: "責任通報 (Mandatory Reporting)", def: "醫事、社工、警察等人員知悉兒虐時需於24小時內向主管機關報告之法定義務。" },
  { id: "top-kaikai-clause", title: "剴剴條款 (Kaikai Clause)", def: "刑法第272-1、286條修正案，加重虐待7歲以下幼童致死之刑責至上死刑。" }
];

CLAIMS.forEach(c => {
  const data = {
    claim_id: c.id,
    statement: c.statement,
    claim_type: c.type,
    point_of_contention: c.summary,
    pro_arguments: c.pro,
    con_arguments: c.con,
    source_refs: [],
    related_entities: [...c.pro, ...c.con]
  };
  fs.writeFileSync(path.join(claimBase, `${c.id}.json`), JSON.stringify(data, null, 2));
});

TOPICS.forEach(t => {
  const data = {
    topic_id: t.id,
    title: t.title,
    definition: t.def,
    related_claims: [],
    related_events: [],
    tags: ["Glossary", "Legal"]
  };
  fs.writeFileSync(path.join(topicBase, `${t.id}.json`), JSON.stringify(data, null, 2));
});

// Final Index Update
const indexData = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
indexData.claims = CLAIMS.map(c => c.id);
indexData.total_claims = CLAIMS.length;
indexData.topics = TOPICS.map(t => t.id);
indexData.total_topics = TOPICS.length;
indexData.last_updated = new Date().toISOString();
fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2));

console.log(`Generated ${CLAIMS.length} claims and ${TOPICS.length} topics. Global index finalized.`);
