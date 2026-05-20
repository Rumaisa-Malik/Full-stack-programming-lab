document.addEventListener('DOMContentLoaded', () => {
    // DOM Cache Elements
    const countrySelect = document.getElementById('countrySelect');
    const limitRange = document.getElementById('limitRange');
    const limitValue = document.getElementById('limitValue');
    const fetchBtn = document.getElementById('fetchBtn');
    const chips = document.querySelectorAll('.chip');
    
    const endpointPath = document.getElementById('endpointPath');
    const copyUrlBtn = document.getElementById('copyUrlBtn');
    const copyJsonBtn = document.getElementById('copyJsonBtn');
    
    const tabTriggers = document.querySelectorAll('.tab-trigger');
    const tabContentHeadlines = document.getElementById('tabHeadlines');
    const tabContentJson = document.getElementById('tabJson');
    
    const articlesGrid = document.getElementById('articlesGrid');
    const shimmerLoader = document.getElementById('shimmerLoader');
    const errorCard = document.getElementById('errorCard');
    const errorTitle = document.getElementById('errorTitle');
    const errorMsg = document.getElementById('errorMsg');
    const emptyCard = document.getElementById('emptyCard');
    const jsonCode = document.getElementById('jsonCode');

    // State Variables
    let currentCountry = 'us';
    let currentLimit = 8;
    let rawJsonResponse = null;

    // Synchronize current port from active window location
    const hostUrl = window.location.origin;
    document.getElementById('endpointHost').textContent = hostUrl;

    // 1. Sync Limit Slider Input
    limitRange.addEventListener('input', (e) => {
        currentLimit = e.target.value;
        limitValue.textContent = currentLimit;
        updateRequestUrl();
    });

    // 2. Sync Dropdown Selection
    countrySelect.addEventListener('change', (e) => {
        currentCountry = e.target.value;
        updateChipsHighlight(currentCountry);
        updateRequestUrl();
    });

    // 3. Sync Quick Chips Filter
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            
            currentCountry = chip.dataset.code;
            countrySelect.value = currentCountry;
            updateRequestUrl();
            fetchHeadlines();
        });
    });

    // Sync active state on chip highlights based on code
    function updateChipsHighlight(code) {
        chips.forEach(chip => {
            if (chip.dataset.code === code) {
                chip.classList.add('active');
            } else {
                chip.classList.remove('active');
            }
        });
    }

    // 4. Update request URL Box
    function updateRequestUrl() {
        endpointPath.textContent = `/api/news/${currentCountry}?limit=${currentLimit}`;
    }

    // 5. Tabs Switching Logic
    tabTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            tabTriggers.forEach(t => t.classList.remove('active'));
            trigger.classList.add('active');

            const targetTab = trigger.dataset.tab;
            if (targetTab === 'headlines') {
                tabContentHeadlines.classList.add('active');
                tabContentHeadlines.style.display = 'block';
                tabContentJson.classList.remove('active');
                tabContentJson.style.display = 'none';
            } else {
                tabContentJson.classList.add('active');
                tabContentJson.style.display = 'block';
                tabContentHeadlines.classList.remove('active');
                tabContentHeadlines.style.display = 'none';
            }
        });
    });

    // 6. Fetch news data from Express API Proxy
    async function fetchHeadlines() {
        // Reset states
        articlesGrid.innerHTML = '';
        errorCard.classList.add('hidden');
        emptyCard.classList.add('hidden');
        shimmerLoader.classList.remove('hidden');
        
        jsonCode.textContent = '// Loading API telemetry...';
        rawJsonResponse = null;

        const requestPath = `/api/news/${currentCountry}?limit=${currentLimit}`;

        try {
            const response = await fetch(requestPath);
            const data = await response.json();
            
            rawJsonResponse = data;
            
            // Pretty print JSON response to developer panel
            jsonCode.textContent = JSON.stringify(data, null, 2);

            if (!response.ok) {
                throw new Error(data.message || `API error (${response.status})`);
            }

            // Handle successful load
            shimmerLoader.classList.add('hidden');

            if (!data.articles || data.articles.length === 0) {
                emptyCard.classList.remove('hidden');
                return;
            }

            // Render articles
            renderArticles(data.articles);

        } catch (err) {
            console.error('Error fetching headlines:', err);
            shimmerLoader.classList.add('hidden');
            
            errorTitle.textContent = 'Request Failed';
            errorMsg.textContent = err.message || 'An error occurred while fetching headlines from the API endpoint.';
            errorCard.classList.remove('hidden');
        }
    }

    // 7. Render articles to card grid
    function renderArticles(articles) {
        articlesGrid.innerHTML = '';

        articles.forEach(article => {
            const dateObj = new Date(article.publishedAt);
            const formattedDate = dateObj.toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            // Clean title of typical source suffix (e.g., "- CNN" or "- Reuters")
            let cleanTitle = article.title;
            const dashIndex = cleanTitle.lastIndexOf(' - ');
            if (dashIndex > 0) {
                cleanTitle = cleanTitle.substring(0, dashIndex);
            }

            const card = document.createElement('article');
            card.className = 'article-card glass-panel';
            card.innerHTML = `
                <div class="card-glowing-edge"></div>
                <div class="card-header">
                    <span class="source-badge">${escapeHTML(article.sourceName)}</span>
                    <span class="date">${escapeHTML(formattedDate)}</span>
                </div>
                <div class="card-body">
                    <h3 class="article-title" title="${escapeHTML(article.title)}">${escapeHTML(cleanTitle)}</h3>
                </div>
                <div class="card-footer">
                    <a href="${escapeHTML(article.url)}" target="_blank" rel="noopener noreferrer" class="read-more-link">
                        <span>Read Full Story</span>
                        <i class="fa-solid fa-arrow-up-right-from-square"></i>
                    </a>
                </div>
            `;
            articlesGrid.appendChild(card);
        });
    }

    // Escape script inputs for safety
    function escapeHTML(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // 8. Clipboard Copy Helper
    async function copyToClipboard(text, button, successHTML, originalHTML) {
        try {
            await navigator.clipboard.writeText(text);
            button.innerHTML = successHTML;
            button.style.color = 'var(--success)';
            
            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.style.color = '';
            }, 2000);
        } catch (err) {
            console.error('Clipboard copy failed:', err);
        }
    }

    // Setup Copy Actions
    copyUrlBtn.addEventListener('click', () => {
        const fullUrl = `${hostUrl}${endpointPath.textContent}`;
        copyToClipboard(
            fullUrl, 
            copyUrlBtn, 
            '<i class="fa-solid fa-check"></i>', 
            '<i class="fa-regular fa-copy"></i>'
        );
    });

    copyJsonBtn.addEventListener('click', () => {
        if (!rawJsonResponse) return;
        copyToClipboard(
            JSON.stringify(rawJsonResponse, null, 2),
            copyJsonBtn,
            '<i class="fa-solid fa-check"></i> Copied!',
            '<i class="fa-regular fa-copy"></i> Copy JSON'
        );
    });

    // 9. Initial Load Action
    fetchBtn.addEventListener('click', fetchHeadlines);
    
    // Perform initial request
    updateRequestUrl();
    fetchHeadlines();
});
