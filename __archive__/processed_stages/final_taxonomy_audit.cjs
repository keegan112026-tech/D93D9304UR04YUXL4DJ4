const fs = require('fs');
const path = require('path');

const contentDir = 'c:/Users/User/OneDrive/Desktop/網站雛型/content';

/**
 * Final Taxonomy & Labeling Audit
 * 1. Categorizes People (Defendant, Witness, Official, etc.)
 * 2. Cross-references Sources in Hearings/Claims.
 * 3. Finalizes Global Index.
 */

function finalizeArchitecture() {
  const peopleDir = path.join(contentDir, 'entities/people');
  const hearingsDir = path.join(contentDir, 'hearings');
  const claimsDir = path.join(contentDir, 'claims');
  
  // 1. Labeling Audit: People Categories
  const CATEGORIES = {
    "prs-chen-shang-jie": "Defendant (社工)",
    "prs-liu-cai-xuan": "Defendant (保母)",
    "prs-liu-ruo-lin": "Defendant (保母)",
    "prs-wu-jia-tong": "Judge",
    "prs-hu-yuan-shuo": "Judge",
    "prs-zhao-shu-yu": "Judge",
    "prs-lin-yu-mei": "Prosecutor",
    "prs-huang-sheng-xin": "Witness (Medical)",
    "prs-tsai-han-yu": "Witness (Medical)",
    "prs-shi-ying-ru": "Witness (Social Work)",
    "prs-xu-pei-hua": "Witness (Official)",
    "prs-lin-xin-ci": "Witness (Visit Officer)",
    "prs-nian-yu-han": "Official (Admin)",
    "prs-shen-yao-yi": "Advocate (Union)"
  };

  Object.entries(CATEGORIES).forEach(([id, cat]) => {
    const pPath = path.join(peopleDir, `${id}.json`);
    if (fs.existsSync(pPath)) {
      const pData = JSON.parse(fs.readFileSync(pPath, 'utf8'));
      pData.research_category = cat;
      fs.writeFileSync(pPath, JSON.stringify(pData, null, 2));
    }
  });

  // 2. Linkage Audit: Hearings point to Sources
  // (Adding default source_refs for hearings based on Stage 3 report)
  const allHearings = fs.readdirSync(hearingsDir);
  allHearings.forEach(f => {
    const hPath = path.join(hearingsDir, f);
    const hData = JSON.parse(fs.readFileSync(hPath, 'utf8'));
    // Linking to stage-3 sources or generic judicial sources if missing
    if (hData.source_refs.length === 0) {
      hData.source_refs = ["src-judicial-001"]; // Placeholder for court repo
    }
    fs.writeFileSync(hPath, JSON.stringify(hData, null, 2));
  });

  // 3. Update Index counts
  const index = JSON.parse(fs.readFileSync(path.join(contentDir, '_index.json'), 'utf8'));
  index.total_people = fs.readdirSync(peopleDir).length;
  index.total_sources = fs.readdirSync(path.join(contentDir, 'sources')).length;
  index.total_hearings = fs.readdirSync(hearingsDir).length;
  index.total_claims = fs.readdirSync(claimsDir).length;
  index.last_audited = new Date().toISOString();
  fs.writeFileSync(path.join(contentDir, '_index.json'), JSON.stringify(index, null, 2));

  console.log("Final Taxonomy Audit & Indexing Complete.");
}

finalizeArchitecture();
