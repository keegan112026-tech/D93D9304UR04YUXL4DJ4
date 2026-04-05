const fs = require('fs');
const path = require('path');

const outputBase = 'c:/Users/User/OneDrive/Desktop/網站雛型/content/hearings';
const indexPath = 'c:/Users/User/OneDrive/Desktop/網站雛型/content/_index.json';

if (!fs.existsSync(outputBase)) {
  fs.mkdirSync(outputBase, { recursive: true });
}

const HEARINGS = [
  { id: "hearing-20250106-review", date: "2025-01-06", type: "審查庭", title: "首度審查庭：被告否認犯罪", witnesses: [], summary: "被告陳尚潔否認偽造訪視紀錄及過失致死罪嫌，案件轉為一般審理程序。" },
  { id: "hearing-20250417-trial-continued", date: "2025-04-17", type: "審理程序", title: "續行審理：維持無罪立場", witnesses: [], summary: "被告延續無罪立場，針對是否補寫工作紀錄與檢方對質。" },
  { id: "hearing-20250717-trial-3", date: "2025-07-17", type: "審理程序", title: "第三次庭訊：和解談判未果", witnesses: [], summary: "辯方表態目前不考慮與家屬和解，法庭持續進行程序整理。" },
  { id: "hearing-20250925-preparation", date: "2025-09-25", type: "準備程序", title: "準備程序終結：傳喚11名證人", witnesses: [], summary: "完成所有爭點整理，法庭宣布將傳喚包含醫師、社工、兒盟高層在內的11名關鍵證人。" },
  { id: "hearing-20251127-witness-testimony-1", date: "2025-11-27", type: "審理程序", title: "第一波證人詰問：職務義務之辯", witnesses: ["prs-xu-pei-hua", "prs-shi-ying-ru", "prs-ding-yan-qi"], summary: "樹鶯社福中心社工施盈如證述：被告曾來電詢問孩童瘀傷，證明被告早已知悉異常。" },
  { id: "hearing-20251211-medical-witnesses", date: "2025-12-11", type: "審理程序", title: "醫療與督導證言：傷勢可見度爭議", witnesses: ["prs-huang-sheng-xin", "prs-li-fang-ling", "prs-jiang-yi-yun"], summary: "急診醫師黃聖心證稱孩童体溫僅24度，身上傷勢為肉眼絕對可辨。兒盟主管證詞引發檢方追問掉牙異常。" },
  { id: "hearing-20251218-cwlf-executives", date: "2025-12-18", type: "審理程序", title: "兒盟高層作證：程序筆錄爭議", witnesses: ["prs-bai-li-fang", "prs-ye-ting-xi", "prs-ye-shi-yu"], summary: "白麗芳對社工疏失避重就輕引發法官不滿；葉詩宇坦承庭前曾透過被告律師閱覽筆錄，形成串證疑慮。" },
  { id: "hearing-20260122-dentist-and-visit-officer", date: "2026-01-22", type: "審理程序", title: "專業鑑定與行政查核證言", witnesses: ["prs-tsai-han-yu", "prs-lin-xin-ci", "prs-huang-ling-fang"], summary: "牙醫證稱磨牙不可能造成連續斷齒。居托訪視員林心慈坦承訪視紀錄日期與實際不符。" },
  { id: "hearing-20260129-falsification-debate", date: "2026-01-29", type: "審理程序", title: "訪視紀錄真實性攻防：政風移送案", witnesses: ["prs-nian-yu-han"], summary: "北市社會局確認將涉嫌造假的訪輔員函送檢察署。辯方聲請勘驗偵訊影音遭駁回。" },
  { id: "hearing-20260223-video-interrogation", date: "2026-02-23", type: "審理程序", title: "全日庭訊：影像勘驗與被告訊問", witnesses: ["prs-chen-shang-jie"], summary: "法庭勘驗牙醫診所監視器，檢方指孩童神情呆滯已顯異常；被告首度吐露心聲，自稱受保母包裝欺瞞。" },
  { id: "hearing-20260226-closing-arguments", date: "2026-02-26", type: "審理程序", title: "辯論終結：檢方求處重刑", witnesses: [], summary: "言詞辯論終結。檢方求處重刑，辯方主張被告不應承擔制度性缺口。定於2026-04-16宣判。" }
];

HEARINGS.forEach(h => {
  const data = {
    hearing_id: h.id,
    date: h.date,
    case_number: "114年度訴字第51號",
    proceedings_type: h.type,
    title: h.title,
    judge: ["prs-wu-jia-tong", "prs-hu-yuan-shuo", "prs-zhao-shu-yu"],
    prosecutor: "prs-lin-yu-mei",
    defendant: "prs-chen-shang-jie",
    witnesses: h.witnesses.map(w => ({
      entity_id: w,
      testimony_summary: "" 
    })),
    legal_arguments: [],
    court_activity: h.summary,
    source_refs: []
  };
  fs.writeFileSync(path.join(outputBase, `${h.id}.json`), JSON.stringify(data, null, 2));
});

// Update Index
const indexData = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
indexData.hearings = HEARINGS.map(h => h.id);
indexData.total_hearings = HEARINGS.length;
fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2));

console.log(`Generated ${HEARINGS.length} hearing files and updated index.`);
