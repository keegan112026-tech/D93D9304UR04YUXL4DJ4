import database from './database.json';

// Mapping 8 Research Phases to the 9 Narrative Chapters
export const CHAPTERS = [
  {
    id: "exec-summary",
    title: "執行摘要 (Executive Summary)",
    chapterNum: "DOC",
    content: `本存檔整合了「剴剴案」自 2022 年出生至 2026 年司法判決的所有核心文獻。資料庫目前收錄 ${(database.sources||[]).length} 筆來源、${(database.entities||[]).length} 位關鍵實體及 ${(database.hearings||[]).length} 場庭訊記錄。重點聚焦於社工案（114訴51）中關於「保證人地位」與「專業自律」的法理爭議。`,
    source: "Daylight Institutional Index"
  },
  {
    id: "ch1",
    title: "壹、案發前傳：收出養媒合體系的脆弱起點",
    chapterNum: "I",
    content: `第一階段：從剴剴出生至進入兒盟體系。本章揭示原生家庭功能不足與制度介入的初步斷點。`,
    timeline: (database.events || [])
      .filter(e => e.phase === 'prehistory-family' || e.phase === 'referral-adoption-placement')
      .map(e => ({ date: e.date, type: "事件", focus: e.title, id: e.id })),
    source: "MOHW / New Taipei Social Work"
  },
  {
    id: "ch2",
    title: "貳、司法起訴基礎與過失認定",
    chapterNum: "II",
    content: `第二階段：台北地檢署之偵查與 10 項核心過失認定。檢方主張被告具備「生存追蹤」之保證人義務。`,
    negligence: [
      { id: 1, item: "未告知外婆費用減免規定", law: "資訊對稱義務" },
      { id: 2, item: "保母表示難帶卻未及時更換", law: "風險預警義務" },
      { id: 3, item: "牙齒脫落異常未通報", law: "醫療常識責任" },
      { id: 4, item: "未確認剴剴與保母互動狀況", law: "訪視核實義務" },
      { id: 5, item: "訪視紀錄與實際訪視時間不符", law: "業務登載真實性" },
      { id: 6, item: "未就醫療報告異常進行追蹤", law: "風險評估責任" },
      { id: 7, item: "知悉剴剴消瘦後未上報", law: "緊急通報義務" },
      { id: 8, item: "未對保母異常說詞進行核實", law: "訪視確認義務" },
      { id: 9, item: "案發前後補寫訪視紀錄", law: "業務登載不實" },
      { id: 10, item: "案發後集體補正、修改報告", law: "業務登載不實" }
    ],
    source: "臺北地檢署起訴書"
  },
  {
    id: "ch3",
    title: "參、庭審實錄：證人交叉詰問 (2025-2026)",
    chapterNum: "III",
    content: `第三階段：臺北地院審理實況。本章節錄 ${(database.hearings||[]).length} 場庭訊之核心活動記錄。`,
    timeline: (database.hearings || []).map(h => ({
      date: h.date,
      type: h.proceedings_type || h.procedure_type || '庭審',
      focus: h.title || h.stage || h.court_activity || h.id,
      id: h.id
    })),
    source: "Judicial Archive"
  },
  {
    id: "ch4",
    title: "肆、專業自律層級：社工倫理與懲戒機制",
    chapterNum: "IV",
    content: `第四階段：2023 年《社會工作師法》修法後之懲戒體系。探討倫理審查委員會與刑事審判之優先權衝突。`,
    findings: [
      { title: "增訂懲戒機制", text: "社工師法第17條修正，強化自律審查。" },
      { title: "工會 vs 公會", text: "職業工會主張司法定案前不應公開倫理結果。" }
    ],
    source: "MOHW / SW Guild"
  },
  {
    id: "ch5",
    title: "伍、角色定位辯證：被告與證人之專業表述",
    chapterNum: "V",
    content: `第五階段：法庭上的專業自我定位。被告主張「媒合社工」非「督導保母」；證人主張「主責」定義取決於安置與否。`,
    timeline: (database.hearings || [])
      .filter(h => h.id.includes('20251127') || h.id.includes('20251218') || h.id.includes('20260223'))
      .map(h => ({
        date: h.date,
        type: "專業對標",
        focus: h.court_activity || h.title || h.id,
        id: h.id
      })),
    source: "Supplement (補充文件)"
  },
  {
    id: "ch6",
    title: "陸、兒盟體系：制度性缺失與改革前線",
    chapterNum: "VI",
    content: `第六階段：兒盟內部審核與行政漏洞分析。比較新舊版安置流程之差異。`,
    findings: (database.claims || []).map(c => ({
      title: c.statement,
      text: c.point_of_contention
    })),
    source: "CWLF Audit Report"
  },
  {
    id: "ch7",
    title: "柒、跨領域鑑定：醫療、心理與牙科觀點",
    chapterNum: "VII",
    content: `第七階段：萬芳醫院與台大醫院之醫療鑑定。針對掉牙、傷勢與神情呆滯之生理分析。`,
    source: "Medical Experts"
  },
  {
    id: "ch8",
    title: "捌、修法後續：剴剴條款與兒少保護網 2.0",
    chapterNum: "VIII",
    content: `第八階段：刑法第 272-1 條修正案與社會安全網 2.0 之落實。`,
    source: "Legislative Yuan"
  },
  {
    id: "ch9",
    title: "玖、檔案索引與高精準度交叉引用",
    chapterNum: "IX",
    content: `本章提供全案 ${(database.sources||[]).length} 筆來源之完整引用代碼與存檔路徑。`,
    source: "Archive Master Index"
  }
];
