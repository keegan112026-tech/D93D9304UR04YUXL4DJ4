const fs = require('fs');
const path = require('path');

const contentDir = 'c:/Users/User/OneDrive/Desktop/網站雛型/content';
const indexPath = path.join(contentDir, '_index.json');

/** 
 * Stage 7 - Supplementary Data Extraction
 */

// 1. New Sources from Supplement
const NEW_SOURCES = [
  { id: "src-mohw-dosa-74724", publisher: "衛生福利部社會救助及社工司", title: "立法院三讀通過「社會工作師法」部分條文修正", url: "https://dep.mohw.gov.tw/DOSAASW/fp-609-74724-103.html" },
  { id: "src-mohw-dosa-ethics", publisher: "衛生福利部社會救助及社工司", title: "行政規則－社會救助及社工司 (社會工作倫理守則)", url: "https://dep.mohw.gov.tw/DOSAASW/cp-536-4692-103.html" },
  { id: "src-tpcsw-ethics-rules", publisher: "臺北市社會工作師公會", title: "社會工作倫理委員會組織簡則", url: "https://www.tpcsw.org.tw/about/ethics/1/124" },
  { id: "src-tpcsw-complaint-proc", publisher: "臺北市社會工作師公會", title: "倫理申訴案件處理程序", url: "https://www.tpcsw.org.tw/about/ethics/0/123" },
  { id: "src-tswu-oppose-ethics", publisher: "臺北市社會工作人員職業工會", title: "反對在司法定案前公布倫理審查結果連署", url: "https://www.civilmedia.tw/archives/134244" },
  { id: "src-udn-8904247", publisher: "聯合報", title: "剴剴案陳姓社工倫理審查將公布 北市社工工會恐妨礙司法公正", url: "https://udn.com/news/story/7315/8904247" }
];

// 2. New Claims from Supplement
const NEW_CLAIMS = [
  { 
    id: "clm-sw-discipline-mechanism", 
    statement: "2023年增訂社會工作師懲戒機制：專業自律與行政責任銜接", 
    type: "Legislation", 
    point_of_contention: "社工師若違反倫理或業務不正，得由公會或主管機關移付懲戒。此為本案倫理爭議的法條源頭。", 
    pro_arguments: ["org-mohw"], 
    con_arguments: [], 
    source_refs: ["src-mohw-dosa-74724"]
  },
  { 
    id: "clm-ethics-vs-criminal-precedence", 
    statement: "倫理審查是否應搶先於刑事判決公布：司法正義與專業自律的衝突", 
    type: "Professional Ethics", 
    point_of_contention: "工會主張倫理審查不應干預司法程序；公會則有既定規約應處理申訴。", 
    pro_arguments: ["org-tpcsw"], 
    con_arguments: ["org-taipei-sw-union"], 
    source_refs: ["src-tswu-oppose-ethics", "src-udn-8904247"]
  }
];

// 3. New Entities
const NEW_ENTITIES = [
  { id: "prs-shen-yao-yi", name: "沈曜逸", type: "people", detail: "臺北市社會工作人員職業工會副理事長", affiliation: "org-taipei-sw-union" }
];

// Write function
function writeData() {
  NEW_SOURCES.forEach(s => {
    fs.writeFileSync(path.join(contentDir, 'sources', `${s.id}.json`), JSON.stringify(s, null, 2));
  });
  NEW_CLAIMS.forEach(c => {
    fs.writeFileSync(path.join(contentDir, 'claims', `${c.id}.json`), JSON.stringify(c, null, 2));
  });
  NEW_ENTITIES.forEach(e => {
    fs.writeFileSync(path.join(contentDir, 'entities/people', `${e.id}.json`), JSON.stringify(e, null, 2));
  });

  // Update Index
  const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  NEW_SOURCES.forEach(s => !index.sources.includes(s.id) && index.sources.push(s.id));
  NEW_CLAIMS.forEach(c => !index.claims.includes(c.id) && index.claims.push(c.id));
  NEW_ENTITIES.forEach(e => !index.people.includes(e.id) && index.people.push(e.id));
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
  console.log("Stage 7 extraction complete.");
}

writeData();
