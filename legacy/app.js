import DATA from './data.js';

document.addEventListener('DOMContentLoaded', () => {
    const nav = document.getElementById('category-nav');
    const grid = document.getElementById('ref-section');
    const searchInput = document.getElementById('search-input');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalBody = document.getElementById('modal-body');
    const closeModal = document.querySelector('.close-modal');

    let activeCategory = 'all';

    // 1. Initialize Categories
    function initCategories() {
        DATA.categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = 'nav-item';
            btn.dataset.category = cat.id;
            btn.textContent = cat.name;
            btn.title = cat.description;
            btn.onclick = () => filterByCategory(cat.id);
            nav.appendChild(btn);
        });
    }

    // 2. Filter Logic
    function filterByCategory(id) {
        activeCategory = id;
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === id);
        });
        renderCards();
    }

    // 3. Search Logic
    searchInput.oninput = () => renderCards();

    // 4. Render Cards
    function renderCards() {
        const query = searchInput.value.toLowerCase();
        grid.innerHTML = '';

        const filtered = DATA.references.filter(ref => {
            const matchesCat = activeCategory === 'all' || ref.category === activeCategory;
            const matchesQuery = ref.title.toLowerCase().includes(query) || 
                                ref.source.toLowerCase().includes(query);
            return matchesCat && matchesQuery;
        });

        if (filtered.length === 0) {
            grid.innerHTML = '<div class="no-results">查無相關文獻。</div>';
            return;
        }

        filtered.forEach(ref => {
            const catName = DATA.categories.find(c => c.id === ref.category)?.name || '未分類';
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="card-tag">${catName}</div>
                <h3 class="card-title">${ref.title}</h3>
                <div class="card-meta">
                    <span>📅 ${ref.date}</span>
                    <span>🏢 ${ref.source}</span>
                </div>
                <div class="card-footer">
                    <a href="${ref.url}" target="_blank" class="card-link">🔗 前往查看</a>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    // 5. Modals
    window.showTimeline = () => {
        modalBody.innerHTML = `
            <div class="modal-header">
                <h2 style="color: var(--primary)">📅 庭審大事記與時間軸 (2025-2026)</h2>
                <p style="margin-bottom: 2rem; color: var(--text-muted)">依據法院公告與媒體報導彙整</p>
            </div>
            <div class="timeline">
                ${DATA.hearings.map(h => `
                    <div class="timeline-item">
                        <div class="timeline-date">${h.date}</div>
                        <div class="timeline-info">
                            <strong style="display: block; font-size: 1.1rem">${h.type}</strong>
                            <p style="color: var(--text-muted); margin-top: 0.5rem">${h.focus}</p>
                            <span style="font-size: 0.75rem; color: var(--accent)">來源：${h.source}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        modalOverlay.classList.remove('hidden');
    };

    window.showNegligence = () => {
        modalBody.innerHTML = `
            <div class="modal-header">
                <h2 style="color: var(--primary)">⚖️ 檢方認定社工陳尚潔之十項職務過失</h2>
                <p style="margin-bottom: 2rem; color: var(--text-muted)">完整事項與對應之法律爭點 (來源：北檢起訴內容)</p>
            </div>
            <div class="negligence-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>編號</th>
                            <th>檢方認定之過失事項</th>
                            <th>涉及之法律爭點</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${DATA.negligence.map(n => `
                            <tr>
                                <td style="font-weight: 700; color: var(--accent)">${n.id}</td>
                                <td>${n.text}</td>
                                <td style="color: #e11d48; font-weight: 500">${n.issue}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
        modalOverlay.classList.remove('hidden');
    };

    window.showWitnesses = () => {
        modalBody.innerHTML = `
            <div class="modal-header">
                <h2 style="color: var(--primary)">👥 證人名單與法庭證詞功能性分析</h2>
                <p style="margin-bottom: 2rem; color: var(--text-muted)">依據證人角色與證言性質分類彙整 (未刪減報告分析結果)</p>
            </div>
            <div class="witness-analysis">
                ${DATA.witnesses.map(group => `
                    <div class="witness-group" style="margin-bottom: 2.5rem;">
                        <h3 style="color: var(--primary); border-bottom: 2px solid var(--accent); padding-bottom: 0.5rem; margin-bottom: 1rem;">${group.group}</h3>
                        <p style="font-size: 0.95rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1.5rem;">${group.description}</p>
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>姓名</th>
                                    <th>職稱 / 單位</th>
                                    <th>出庭日期</th>
                                    <th>分析判斷 (未刪減)</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${group.list.map(w => `
                                    <tr>
                                        <td><strong>${w.name}</strong></td>
                                        <td>${w.title}</td>
                                        <td>${w.date}</td>
                                        <td style="font-size: 0.9rem; line-height: 1.5">${w.analysis}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `).join('')}
            </div>
        `;
        modalOverlay.classList.remove('hidden');
    };

    window.showAnalysis = () => {
        modalBody.innerHTML = `
            <div class="modal-header">
                <h2 style="color: var(--primary)">📝 深度分析：實務侷限、法律爭點與體制漏洞</h2>
                <p style="margin-bottom: 2rem; color: var(--text-muted)">完整收錄各類專業分析文摘 (未進行摘要處理，保留原文細節)</p>
            </div>
            <div class="analysis-container">
                ${DATA.analysis.map(a => `
                    <div class="analysis-block" style="margin-bottom: 2.5rem; background: #f8fafc; padding: 2rem; border-radius: 12px; border-left: 6px solid var(--accent)">
                        <h3 style="color: var(--primary); margin-bottom: 1rem;">${a.title}</h3>
                        <div style="line-height: 1.8; color: var(--text-main); font-size: 1rem;">
                            ${a.content}
                        </div>
                        <div style="margin-top: 1rem; font-size: 0.8rem; color: var(--text-muted)">— 來源：${a.source}</div>
                    </div>
                `).join('')}
            </div>
        `;
        modalOverlay.classList.remove('hidden');
    };

    // Event Listeners for buttons
    document.getElementById('view-timeline').onclick = showTimeline;
    document.getElementById('view-negligence').onclick = showNegligence;
    document.getElementById('view-witnesses').onclick = showWitnesses;
    document.getElementById('view-analysis').onclick = showAnalysis;
    document.querySelector('.nav-item[data-category="all"]').onclick = () => filterByCategory('all');

    closeModal.onclick = () => modalOverlay.classList.add('hidden');
    modalOverlay.onclick = (e) => {
        if (e.target === modalOverlay) modalOverlay.classList.add('hidden');
    };

    // Run
    initCategories();
    renderCards();
});
