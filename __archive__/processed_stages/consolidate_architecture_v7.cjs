const fs = require('fs');
const path = require('path');

const contentDir = 'c:/Users/User/OneDrive/Desktop/網站雛型/content';

/**
 * Bulk Consolidation Script
 * 1. Enriches Hearings with Trial Testimonies from Supplement.
 * 2. Cross-references Entities and Sources.
 * 3. Enforces standardized labels.
 */

function consolidate() {
  const hearingsDir = path.join(contentDir, 'hearings');
  const peopleDir = path.join(contentDir, 'entities/people');
  
  // 1. Enrich Specific Hearings with "Self-Positioning" data from Supplement
  const hearingUpdates = {
    "hearing-20251127-witness-testimony-1": {
      testimony: [
        { id: "prs-shi-ying-ru", text: "主張：若以『安置』為前提，本案沒有所謂『主責社工』。自我界定為追蹤原生家庭、而非追蹤出養後照顧狀況者。" },
        { id: "prs-xu-pei-hua", text: "強調：收出養媒合機構屬『特許行業』，社工角色受媒合與服務規範體系所繫。" }
      ]
    },
    "hearing-20251211-medical-witnesses": {
      testimony: [
        { id: "prs-li-fang-ling", text: "自我定位：不是陳尚潔的直接督導，無法推論其是否有盡到義務。" },
        { id: "prs-jiang-yi-yun", text: "程序攻防：否認偵查筆錄中『嚴重疏失』之記載，聲稱不知筆錄為何如此記載。" }
      ]
    },
    "hearing-20260122-dentist-and-visit-officer": {
      testimony: [
        { id: "prs-lin-xin-ci", text: "專業觀察：認為孩童較安靜但未達異常，且劉姓保母態度積極。" }
      ]
    },
    "hearing-20260129-falsification-debate": {
      testimony: [
        { id: "prs-nian-yu-han", text: "行政監理：釐清文山居托中心、訪視員與婦幼科之間的監理鏈條與上傳義務。" }
      ]
    },
    "hearing-20260223-video-interrogation": {
      testimony: [
        { id: "prs-chen-shang-jie", text: "角色辯護：否認自己是『主責社工』，主張係『個案出養社工』；並辯護『督導保母非兒盟職責』。" }
      ]
    }
  };

  // Apply Hearing Updates
  Object.keys(hearingUpdates).forEach(hId => {
    const filePath = path.join(hearingsDir, `${hId}.json`);
    if (fs.existsSync(filePath)) {
      const hData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      hData.witnesses = hData.witnesses.map(w => {
        const update = hearingUpdates[hId].testimony.find(t => t.id === w.entity_id);
        if (update) w.testimony_summary = update.text;
        return w;
      });
      fs.writeFileSync(filePath, JSON.stringify(hData, null, 2));
    }
  });

  // 2. Cross-reference Entities (Linking People to Orgs mentioned in Supplement)
  const peopleUpdates = {
    "prs-shi-ying-ru": { affiliation: "org-shuying-center", role: "新北樹鶯社福中心社工" },
    "prs-xu-pei-hua": { affiliation: "org-sfaa", role: "衛福部社家署家庭支持組督導" },
    "prs-lin-xin-ci": { affiliation: "org-wenshan-childcare", role: "臺北市文山區居家托育服務中心訪視員" },
    "prs-nian-yu-han": { affiliation: "org-taipei-sw", role: "臺北市政府社會局婦幼科科長" },
    "prs-li-fang-ling": { affiliation: "org-cwlf", role: "兒福聯盟副處長" }
  };

  Object.keys(peopleUpdates).forEach(pId => {
    const filePath = path.join(peopleDir, `${pId}.json`);
    if (fs.existsSync(filePath)) {
      const pData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      Object.assign(pData, peopleUpdates[pId]);
      fs.writeFileSync(filePath, JSON.stringify(pData, null, 2));
    }
  });

  console.log("Consolidation & Re-mapping logic applied.");
}

consolidate();
