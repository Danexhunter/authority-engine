/* ═══════════════════════════════════════════════════════════════
   AUTHORITY ENGINE — Main Application Controller
   ═══════════════════════════════════════════════════════════════ */

/* ─── State ─── */
let currentMode = Storage.getMode();
let currentModule = 'thread-builder';
let currentImageType = 'intro';
let lastThread = null;
let lastHooks = null;

/* ─── Init ─── */
document.addEventListener('DOMContentLoaded', () => {
    applyMode(currentMode);
    updateUsageDisplay();
    renderVault();
    initBrandColors();
});

/* ════════════════════════════════════════════
   Page / Navigation
   ════════════════════════════════════════════ */

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const page = document.getElementById(pageId);
    if (page) page.classList.add('active');
    if (pageId === 'dashboard') {
        updateUsageDisplay();
    }
}

function selectMode(mode) {
    currentMode = mode;
    Storage.setMode(mode);
    applyMode(mode);
    showPage('dashboard');
}

function applyMode(mode) {
    document.body.setAttribute('data-mode', mode);
    const config = MODES[mode];
    if (!config) return;
    const badge = document.getElementById('mode-badge');
    if (badge) {
        badge.querySelector('.mode-badge-icon').textContent = config.icon;
        badge.querySelector('.mode-badge-name').textContent = config.name + ' Mode';
    }
    // Update brand color defaults
    const bp = document.getElementById('brand-primary');
    const bb = document.getElementById('brand-bg');
    const ba = document.getElementById('brand-accent');
    if (bp) bp.value = config.colors.primary;
    if (bb) bb.value = config.colors.bg;
    if (ba) ba.value = config.colors.accent;
}

function initBrandColors() {
    const kit = Storage.getBrandKit();
    const config = MODES[currentMode];
    const bp = document.getElementById('brand-primary');
    const bb = document.getElementById('brand-bg');
    const ba = document.getElementById('brand-accent');
    bp.value = kit.primary || config.colors.primary;
    bb.value = kit.bg || config.colors.bg;
    ba.value = kit.accent || config.colors.accent;

    // Live preview on color change
    const liveRefresh = () => {
        const canvas = document.getElementById('image-canvas');
        const headline = document.getElementById('img-headline').value.trim();
        if (!headline || currentModule !== 'image-engine') return;
        const subtext = document.getElementById('img-subtext').value.trim();
        const colors = { primary: bp.value, bg: bb.value, accent: ba.value };
        ImageRenderer.render(canvas, currentImageType, headline, subtext, colors, currentMode);
    };
    bp.addEventListener('input', liveRefresh);
    bb.addEventListener('input', liveRefresh);
    ba.addEventListener('input', liveRefresh);
}

/* ─── Module Switching ─── */
function switchModule(moduleId) {
    currentModule = moduleId;
    // Nav active state
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const active = document.querySelector(`.nav-item[data-module="${moduleId}"]`);
    if (active) active.classList.add('active');
    // Module visibility
    document.querySelectorAll('.module').forEach(m => m.classList.remove('active'));
    const mod = document.getElementById('module-' + moduleId);
    if (mod) mod.classList.add('active');
    // Title
    const titles = {
        'thread-builder': 'Thread Builder',
        'hook-lab': 'Hook Lab',
        'image-engine': 'Image Engine',
        'content-pack': 'Content Pack',
        'voice-engine': 'Voice Engine',
        'shitpost': 'Shitpost Intel',
        'vault': 'Vault',
    };
    document.getElementById('module-title').textContent = titles[moduleId] || moduleId;
    // Refresh vault when switching
    if (moduleId === 'vault') renderVault();
}

function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('open');
}

/* ════════════════════════════════════════════
   Link Fetching Helper
   ════════════════════════════════════════════ */

let _linkCache = {};

async function fetchLinkContent(inputId, statusId) {
    const linkInput = document.getElementById(inputId);
    const statusEl = document.getElementById(statusId);
    if (!linkInput) return null;

    const url = linkInput.value.trim();
    if (!url) {
        if (statusEl) statusEl.innerHTML = '';
        return null;
    }

    // Check cache
    if (_linkCache[url]) {
        if (statusEl) statusEl.innerHTML = '<span class="link-status-ok">✅ Content loaded (cached)</span>';
        return _linkCache[url];
    }

    if (statusEl) statusEl.innerHTML = '<span class="link-status-loading">🔄 Fetching content...</span>';

    try {
        const result = await LinkFetcher.fetchURL(url);
        if (result && result.success) {
            _linkCache[url] = result.content;
            const wc = result.content.wordCount || 0;
            const hc = result.content.headings?.length || 0;
            if (statusEl) statusEl.innerHTML = `<span class="link-status-ok">✅ Loaded: ${wc} words, ${hc} sections</span>`;
            return result.content;
        } else {
            if (statusEl) statusEl.innerHTML = `<span class="link-status-error">⚠️ ${result?.error || 'Could not fetch'} — generating without link</span>`;
            return null;
        }
    } catch (err) {
        if (statusEl) statusEl.innerHTML = '<span class="link-status-error">⚠️ Fetch failed — generating without link</span>';
        return null;
    }
}

/* ════════════════════════════════════════════
   Thread Builder
   ════════════════════════════════════════════ */

async function generateThread() {
    const topic = document.getElementById('thread-topic').value.trim();
    if (!topic) return showToast('Please enter a topic!', 'warning');

    if (!Storage.canUse('threads')) {
        return showToast('Daily thread limit reached! Upgrade to Pro for unlimited.', 'danger');
    }

    const context = document.getElementById('thread-context').value.trim();
    const length = document.getElementById('thread-length').value;
    const tone = document.getElementById('thread-tone').value;

    // Loading state
    const btn = document.querySelector('#module-thread-builder .generate-btn');
    btn.classList.add('loading');
    btn.textContent = 'Generating...';

    // Fetch link content (async)
    const linkContent = await fetchLinkContent('thread-link', 'link-status');

    setTimeout(() => {
        const result = AIEngine.generateThread(topic, context, length, tone, currentMode, linkContent);
        lastThread = result;
        Storage.incrementUsage('threads');
        updateUsageDisplay();
        renderThreadResult(result, topic);
        btn.classList.remove('loading');
        btn.innerHTML = '⚡ Generate Thread';
        if (linkContent) showToast('Thread generated from link content!', 'success');
        else showToast('Thread generated!', 'success');
    }, 800 + Math.random() * 600);
}

function renderThreadResult(result, topic) {
    const output = document.getElementById('thread-output');
    const scoreClass = result.engagementScore >= 90 ? 'score-fire'
        : result.engagementScore >= 75 ? 'score-high'
            : result.engagementScore >= 50 ? 'score-mid' : 'score-low';

    let html = `<div class="thread-result">`;

    // Header
    html += `<div class="thread-header">
    <div>
      <span class="score-badge-component ${scoreClass}">🎯 Engagement Score: ${result.engagementScore}/100</span>
    </div>
    <div class="thread-actions">
      <button class="btn btn-primary btn-sm" onclick="regenerateThread('viral')">🔥 Make More Viral</button>
      <button class="btn btn-ghost btn-sm" onclick="regenerateThread('controversy')">⚡ Add Controversy</button>
      ${result.engagementScore < 90 ? `<button class="btn btn-primary btn-sm" onclick="regenerateThread('improve')" style="animation: glow-pulse 2s infinite">📈 Improve to 90+</button>` : ''}
      <button class="btn btn-ghost btn-sm" onclick="saveThreadToVault()">🔒 Save to Vault</button>
      <button class="btn btn-ghost btn-sm" onclick="copyFullThread()">📋 Copy All</button>
    </div>
  </div>`;

    // Hook variations with scores
    html += `<div class="hook-variations">
    <h4>🎣 Hook Variations — Click to swap</h4>
    <div class="hook-var-list">`;
    result.hookVariations.forEach((h, i) => {
        const catInfo = HOOK_CATEGORIES[h.category] || { label: h.category, color: 'tag-authority' };
        const hookScore = h.score || 0;
        const hookScoreClass = hookScore >= 80 ? 'score-high' : hookScore >= 60 ? 'score-mid' : 'score-low';
        html += `<button class="hook-var-item ${i === 0 ? 'active' : ''}" onclick="swapHook(${i})">
      <span class="hook-var-num">#${i + 1}</span>
      <span class="tag ${catInfo.color}">${catInfo.label}</span>
      <span class="hook-score-mini ${hookScoreClass}">${hookScore}</span>
      <span style="flex:1;text-align:left">${truncate(h.text.split('\n')[0], 60)}</span>
    </button>`;
    });
    html += `</div></div>`;

    // Thread tweets with segment-type badges
    result.thread.forEach((tweet, i) => {
        const typeClass = tweet.type === 'hook' ? 'tweet-hook' : tweet.type === 'cta' ? 'tweet-cta' : '';
        const segInfo = SEGMENT_TYPES[tweet.type] || { label: tweet.type.toUpperCase(), color: 'tweet-type-tension' };
        html += `<div class="tweet-card ${typeClass}" style="animation-delay: ${i * 0.05}s">
      <div class="tweet-card-header">
        <span class="tweet-position">${tweet.position}/${result.thread.length}</span>
        <span class="tweet-type-badge ${segInfo.color}">${segInfo.label}</span>
      </div>
      <div class="tweet-text">${escapeHtml(tweet.text)}</div>
      <div class="tweet-footer">
        <span class="char-count ${tweet.text.length > 280 ? 'over' : ''}">${tweet.text.length}/280</span>
        <button class="tweet-copy-btn" onclick="copyText(\`${escapeForAttr(tweet.text)}\`)">📋 Copy</button>
      </div>
    </div>`;
    });

    // Alternate CTAs
    if (result.alternateCTAs && result.alternateCTAs.length > 0) {
        html += `<div class="alt-ctas-section">
      <h4>📣 Alternate CTAs — Click to swap ending</h4>
      <div class="alt-cta-list">`;
        result.alternateCTAs.forEach((cta, i) => {
            const ctaInfo = CTA_CATEGORIES[cta.category] || { label: cta.category, icon: '📣' };
            html += `<button class="alt-cta-item" onclick="swapCTA(${i})">
        <span class="tag tag-authority">${ctaInfo.icon} ${ctaInfo.label}</span>
        <span style="flex:1;text-align:left;font-size:var(--fs-sm)">${truncate(cta.text.split('\n')[0], 70)}</span>
      </button>`;
        });
        html += `</div></div>`;
    }

    // Short tweets
    html += `<div class="short-tweets-section">
    <h4>🐦 Short Tweet Versions (standalone)</h4>`;
    result.shortTweets.forEach((st, i) => {
        html += `<div class="short-tweet" style="animation-delay: ${i * 0.05}s">
      <span class="short-tweet-text">${escapeHtml(st)}</span>
      <button class="tweet-copy-btn" onclick="copyText(\`${escapeForAttr(st)}\`)">📋</button>
    </div>`;
    });
    html += `</div></div>`;

    output.innerHTML = html;
}

function swapHook(index) {
    if (!lastThread) return;
    const variation = lastThread.hookVariations[index];
    if (!variation) return;
    lastThread.thread[0].text = variation.text;
    lastThread.engagementScore = AIEngine.computeScore(lastThread.thread);
    renderThreadResult(lastThread, '');
}

function regenerateThread(type) {
    const topic = document.getElementById('thread-topic').value.trim() || 'content strategy';
    const length = document.getElementById('thread-length').value;
    const context = type === 'viral' ? 'Make this extremely viral and shareable'
        : type === 'controversy' ? 'Add a controversial angle to provoke discussion'
            : 'Maximize engagement score above 90';

    const btn = document.querySelector('#module-thread-builder .generate-btn');
    btn.classList.add('loading');
    btn.textContent = 'Regenerating...';

    setTimeout(() => {
        const result = AIEngine.generateThread(topic, context, length, 'auto', currentMode);
        // Bias score up for regenerations
        result.engagementScore = Math.min(98, result.engagementScore + Math.floor(Math.random() * 10) + 5);
        lastThread = result;
        renderThreadResult(result, topic);
        btn.classList.remove('loading');
        btn.innerHTML = '⚡ Generate Thread';
    }, 600 + Math.random() * 400);
}

function saveThreadToVault() {
    if (!lastThread) return;
    const result = Storage.saveToVault({
        type: 'thread',
        content: lastThread,
        preview: lastThread.thread[0]?.text?.substring(0, 100) || 'Thread',
        score: lastThread.engagementScore,
        mode: currentMode,
    });
    showToast(result.message, result.success ? 'success' : 'warning');
}

function copyFullThread() {
    if (!lastThread) return;
    const text = lastThread.thread.map((t, i) => `${i + 1}/${lastThread.thread.length}\n${t.text}`).join('\n\n');
    copyText(text);
}

function swapCTA(index) {
    if (!lastThread || !lastThread.alternateCTAs) return;
    const cta = lastThread.alternateCTAs[index];
    if (!cta) return;
    lastThread.thread[lastThread.thread.length - 1].text = cta.text;
    lastThread.engagementScore = AIEngine.computeScore(lastThread.thread);
    renderThreadResult(lastThread, '');
    showToast('CTA swapped!', 'success');
}

/* ════════════════════════════════════════════
   Article Generator
   ════════════════════════════════════════════ */

async function generateArticle() {
    const topic = document.getElementById('thread-topic').value.trim();
    if (!topic) return showToast('Enter a topic first!', 'warning');

    const context = document.getElementById('thread-context').value.trim();
    const output = document.getElementById('thread-output');
    output.innerHTML = '<div class="loading-shimmer" style="height:300px;border-radius:var(--radius-lg);"></div>';

    // Fetch link content (async)
    const linkContent = await fetchLinkContent('thread-link', 'link-status');

    setTimeout(() => {
        const article = AIEngine.generateArticle(topic, context, currentMode, linkContent);
        renderArticleResult(article);
        if (linkContent) showToast('Article generated from link content!', 'success');
        else showToast('Article generated!', 'success');
    }, 800 + Math.random() * 600);
}

function renderArticleResult(article) {
    const output = document.getElementById('thread-output');
    let html = `<div class="thread-result">`;

    // Title
    html += `<div class="article-header">
    <h3 class="article-title">${escapeHtml(article.title)}</h3>
    <div class="thread-actions">
      <button class="btn btn-ghost btn-sm" onclick="copyArticle()">📋 Copy Full Article</button>
      <button class="btn btn-ghost btn-sm" onclick="saveToVault('article')">🔒 Save to Vault</button>
    </div>
  </div>`;

    // Intro
    html += `<div class="article-section">
    <div class="article-section-label">Introduction</div>
    <div class="article-body">${escapeHtml(article.intro)}</div>
  </div>`;

    // Sections
    article.sections.forEach((section, i) => {
        html += `<div class="article-section" style="animation-delay:${i * 0.08}s">
      <div class="article-section-title">${escapeHtml(section.title)}</div>
      <div class="article-body">${escapeHtml(section.body)}</div>
    </div>`;
    });

    // Conclusion
    html += `<div class="article-section">
    <div class="article-section-label">Conclusion</div>
    <div class="article-body">${escapeHtml(article.conclusion)}</div>
  </div>`;

    // Excerpts
    html += `<div class="short-tweets-section">
    <h4>🐦 Tweet-Sized Excerpts</h4>`;
    article.excerpts.forEach((ex, i) => {
        html += `<div class="short-tweet" style="animation-delay:${i * 0.05}s">
      <span class="short-tweet-text">${escapeHtml(ex)}</span>
      <button class="tweet-copy-btn" onclick="copyText(\`${escapeForAttr(ex)}\`)">📋</button>
    </div>`;
    });
    html += `</div></div>`;

    output.innerHTML = html;
    window._lastArticle = article;
}

function copyArticle() {
    if (!window._lastArticle) return;
    const a = window._lastArticle;
    let text = `# ${a.title}\n\n${a.intro}\n\n`;
    a.sections.forEach(s => { text += `## ${s.title}\n\n${s.body}\n\n`; });
    text += `## Conclusion\n\n${a.conclusion}`;
    copyText(text);
}

/* ════════════════════════════════════════════
   Hook Lab
   ════════════════════════════════════════════ */

let currentHookFilter = 'all';

async function generateHooks() {
    const topic = document.getElementById('hook-topic').value.trim();
    if (!topic) return showToast('Please enter a topic!', 'warning');

    if (!Storage.canUse('hooks')) {
        return showToast('Daily hook limit reached! Upgrade to Pro.', 'danger');
    }

    Storage.incrementUsage('hooks');
    updateUsageDisplay();

    // Fetch link content (async)
    const linkContent = await fetchLinkContent('hook-link', 'hook-link-status');

    const hooks = AIEngine.generateHooks(topic, currentMode, linkContent);
    lastHooks = hooks;
    currentHookFilter = 'all';
    renderHooks(hooks);
    if (linkContent) showToast('Hooks generated from link content!', 'success');
}

function renderHooks(hooks) {
    const output = document.getElementById('hook-output');
    const filtered = currentHookFilter === 'all' ? hooks : hooks.filter(h => h.category === currentHookFilter);

    let html = `<div class="hook-categories">
    <button class="category-btn ${currentHookFilter === 'all' ? 'active' : ''}" onclick="filterHooks('all')">All (${hooks.length})</button>`;
    const cats = {};
    hooks.forEach(h => { cats[h.category] = (cats[h.category] || 0) + 1; });
    for (const [cat, count] of Object.entries(cats)) {
        const info = HOOK_CATEGORIES[cat] || { label: cat };
        html += `<button class="category-btn ${currentHookFilter === cat ? 'active' : ''}" onclick="filterHooks('${cat}')">${info.label} (${count})</button>`;
    }
    html += `</div><div class="hooks-grid">`;

    filtered.forEach((hook, i) => {
        const catInfo = HOOK_CATEGORIES[hook.category] || { label: hook.category, color: 'tag-authority' };
        const hScore = hook.score || 0;
        const hScoreClass = hScore >= 80 ? 'score-high' : hScore >= 60 ? 'score-mid' : 'score-low';
        html += `<div class="hook-card" style="animation-delay: ${i * 0.03}s">
      <div class="hook-card-header">
        <span class="tag ${catInfo.color}">${catInfo.label}</span>
        <span class="hook-score-badge ${hScoreClass}">🎯 ${hScore}</span>
      </div>
      <div class="hook-text">${escapeHtml(hook.text)}</div>
      <div class="hook-card-actions">
        <button class="btn btn-primary btn-sm" onclick="useHookInThread(\`${escapeForAttr(hook.text)}\`)">🧵 Use in Thread</button>
        <button class="btn btn-ghost btn-sm" onclick="copyText(\`${escapeForAttr(hook.text)}\`)">📋 Copy</button>
        <button class="btn btn-ghost btn-sm" onclick="saveHookToVault(\`${escapeForAttr(hook.text)}\`, '${hook.category}')">🔒</button>
      </div>
    </div>`;
    });
    html += `</div>`;
    output.innerHTML = html;
}

function filterHooks(category) {
    currentHookFilter = category;
    if (lastHooks) renderHooks(lastHooks);
}

function useHookInThread(hookText) {
    switchModule('thread-builder');
    document.getElementById('thread-topic').value = hookText.split('\n')[0].replace(/[:\.\?!]+$/, '').substring(0, 100);
    showToast('Hook loaded into Thread Builder!', 'success');
}

function saveHookToVault(text, category) {
    const result = Storage.saveToVault({
        type: 'hook',
        content: text,
        preview: text.substring(0, 80),
        category,
        mode: currentMode,
    });
    showToast(result.message, result.success ? 'success' : 'warning');
}

/* ════════════════════════════════════════════
   Image Engine
   ════════════════════════════════════════════ */

function selectImageType(type) {
    currentImageType = type;
    document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`.type-btn[data-type="${type}"]`).classList.add('active');
}

function handleLogoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            ImageRenderer.setLogo(img);
            document.getElementById('upload-text').textContent = '✅ ' + file.name;
            showToast('Logo uploaded!', 'success');
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function renderImage() {
    const headline = document.getElementById('img-headline').value.trim();
    if (!headline) return showToast('Please enter a headline!', 'warning');

    if (!Storage.canUse('images')) {
        return showToast('Daily image limit reached! Upgrade to Pro.', 'danger');
    }

    Storage.incrementUsage('images');
    updateUsageDisplay();

    const subtext = document.getElementById('img-subtext').value.trim();
    const canvas = document.getElementById('image-canvas');
    const colors = {
        primary: document.getElementById('brand-primary').value,
        bg: document.getElementById('brand-bg').value,
        accent: document.getElementById('brand-accent').value,
    };

    ImageRenderer.render(canvas, currentImageType, headline, subtext, colors, currentMode);
    document.getElementById('canvas-actions').style.display = 'flex';
    showToast('Image generated!', 'success');
}

function downloadImage() {
    const canvas = document.getElementById('image-canvas');
    ImageRenderer.download(canvas, `authority-engine-${currentImageType}-${Date.now()}.png`);
}

/* ════════════════════════════════════════════
   Content Pack
   ════════════════════════════════════════════ */

function generateContentPack() {
    const topic = document.getElementById('pack-topic').value.trim();
    if (!topic) return showToast('Please enter a topic!', 'warning');

    const progress = document.getElementById('pack-progress');
    const output = document.getElementById('pack-output');
    progress.style.display = 'block';
    output.innerHTML = '';

    const steps = ['step-thread', 'step-images', 'step-tweets', 'step-done'];
    let stepIndex = 0;

    function advanceStep() {
        if (stepIndex > 0) {
            document.getElementById(steps[stepIndex - 1]).classList.remove('active');
            document.getElementById(steps[stepIndex - 1]).classList.add('done');
        }
        if (stepIndex < steps.length) {
            document.getElementById(steps[stepIndex]).classList.add('active');
        }
        stepIndex++;
    }

    // Step 1: Thread
    advanceStep();
    setTimeout(() => {
        const thread = AIEngine.generateThread(topic, '', 'medium', 'auto', currentMode);

        // Step 2: Images
        advanceStep();
        setTimeout(() => {
            const config = MODES[currentMode];
            const colors = {
                primary: config.colors.primary,
                bg: config.colors.bg,
                accent: config.colors.accent,
            };

            // Generate 4 image canvases
            const imageTypes = [
                { type: 'intro', headline: topic, subtext: 'A deep dive thread' },
                { type: 'data', headline: '87%', subtext: `of people miss this about ${topic}` },
                { type: 'quote', headline: thread.thread[1]?.text?.split('\n')[0] || topic, subtext: '@you' },
                { type: 'meme', headline: `Me explaining ${topic} to normies`, subtext: '💀' },
            ];

            const canvases = imageTypes.map(img => {
                const c = document.createElement('canvas');
                ImageRenderer.render(c, img.type, img.headline, img.subtext, colors, currentMode);
                return { canvas: c, type: img.type };
            });

            // Step 3: Short tweets
            advanceStep();
            setTimeout(() => {
                // Step 4: Done
                advanceStep();

                // Render gallery
                let html = '';

                // Thread section
                html += `<div class="pack-section">
          <h4>🧵 Thread (${thread.thread.length} tweets) — Score: ${thread.engagementScore}/100</h4>`;
                thread.thread.forEach(tweet => {
                    html += `<div class="tweet-card ${tweet.type === 'hook' ? 'tweet-hook' : ''}">
            <div class="tweet-card-header">
              <span class="tweet-position">${tweet.position}/${thread.thread.length}</span>
            </div>
            <div class="tweet-text">${escapeHtml(tweet.text)}</div>
          </div>`;
                });
                html += `</div>`;

                // Images section
                html += `<div class="pack-section">
          <h4>🎨 Visual Assets (4 images)</h4>
          <div class="pack-images-grid">`;
                canvases.forEach((c, i) => {
                    c.canvas.id = `pack-canvas-${i}`;
                    html += `<div class="pack-image-card">
            <div id="pack-canvas-container-${i}"></div>
            <div class="pack-image-actions">
              <button class="btn btn-ghost btn-sm" onclick="downloadPackImage(${i})">⬇️ Download</button>
            </div>
          </div>`;
                });
                html += `</div></div>`;

                // Short tweets
                html += `<div class="pack-section">
          <h4>🐦 Short Tweets (5)</h4>`;
                thread.shortTweets.forEach(st => {
                    html += `<div class="short-tweet">
            <span class="short-tweet-text">${escapeHtml(st)}</span>
            <button class="tweet-copy-btn" onclick="copyText(\`${escapeForAttr(st)}\`)">📋</button>
          </div>`;
                });
                html += `</div>`;

                output.innerHTML = html;

                // Insert canvases into DOM
                canvases.forEach((c, i) => {
                    c.canvas.style.width = '100%';
                    const container = document.getElementById(`pack-canvas-container-${i}`);
                    if (container) container.appendChild(c.canvas);
                });

                // Store canvases globally for download
                window._packCanvases = canvases;

            }, 600);
        }, 800);
    }, 800);
}

function downloadPackImage(index) {
    if (window._packCanvases && window._packCanvases[index]) {
        ImageRenderer.download(window._packCanvases[index].canvas,
            `authority-pack-${window._packCanvases[index].type}-${Date.now()}.png`);
    }
}

/* ════════════════════════════════════════════
   Voice Engine
   ════════════════════════════════════════════ */

function analyzeVoice() {
    const tweets = document.getElementById('voice-tweets').value.trim();
    if (!tweets || tweets.split('\n').filter(l => l.trim()).length < 3) {
        return showToast('Please paste at least 3 tweets!', 'warning');
    }

    const output = document.getElementById('voice-output');
    output.innerHTML = '<div class="loading-shimmer" style="height: 200px; border-radius: var(--radius-lg);"></div>';

    setTimeout(() => {
        const result = AIEngine.analyzeVoice(tweets);
        if (!result) return showToast('Could not analyze voice. Try pasting more tweets.', 'danger');

        Storage.setVoiceProfile(result.profile);

        let html = `<div class="voice-profile-card">
      <h4>🎤 Your Voice Profile</h4>`;

        // Traits
        const traits = [
            { label: 'Tone', value: result.profile.toneMarkers.join(', ') },
            { label: 'Sentence Rhythm', value: result.profile.sentenceRhythm },
            { label: 'Emoji Usage', value: result.profile.emojiUsage },
            { label: 'Avg Tweet Length', value: result.profile.avgTweetLength + ' chars' },
        ];
        traits.forEach(t => {
            html += `<div class="voice-trait">
        <span class="voice-trait-label">${t.label}</span>
        <span class="voice-trait-value">${t.value}</span>
      </div>`;
        });

        // Aggression bar
        html += `<div class="voice-trait">
      <span class="voice-trait-label">Aggression Level</span>
      <div class="voice-trait-bar">
        <div class="voice-trait-bar-fill" style="width: ${result.profile.aggressionLevel * 10}%"></div>
      </div>
    </div>`;

        // Vocabulary
        html += `<div class="voice-trait" style="flex-direction: column; align-items: flex-start; gap: 8px;">
      <span class="voice-trait-label">Vocabulary Bias</span>
      <div class="voice-tags">
        ${result.profile.vocabularyBias.map(w => `<span class="tag tag-authority">${w}</span>`).join('')}
      </div>
    </div>`;

        // Signature phrases
        html += `<div class="voice-trait" style="flex-direction: column; align-items: flex-start; gap: 8px;">
      <span class="voice-trait-label">Signature Phrases</span>
      ${result.profile.signaturePhrases.map(p => `<div style="color: var(--text-primary); font-style: italic; font-size: var(--fs-sm);">"${escapeHtml(p)}"</div>`).join('')}
    </div>`;

        html += `</div>`;

        // Sample in voice
        html += `<div class="voice-sample">
      <h4>✍️ Sample Thread in Your Voice</h4>`;
        result.sampleThread.thread.slice(0, 3).forEach(tweet => {
            html += `<div class="tweet-card" style="margin-bottom: 8px;">
        <div class="tweet-text">${escapeHtml(tweet.text)}</div>
      </div>`;
        });
        html += `</div>`;

        output.innerHTML = html;
        showToast('Voice profile created! Content will now match your style.', 'success');
    }, 1200);
}

/* ════════════════════════════════════════════
   Shitpost Intelligence
   ════════════════════════════════════════════ */

function updateDegenLabel(val) {
    const labels = ['Mild 😏', 'Spicy 🌶️', 'Degen 💀', 'Unhinged 🤡', 'Nuclear ☢️'];
    document.getElementById('degen-label').textContent = labels[val - 1];
}

function generateShitposts() {
    const topic = document.getElementById('shitpost-topic').value.trim();
    if (!topic) return showToast('Enter a topic!', 'warning');

    const mood = document.getElementById('shitpost-mood').value;
    const degenLevel = parseInt(document.getElementById('degen-level').value);

    const posts = AIEngine.generateShitposts(topic, mood, degenLevel);
    const output = document.getElementById('shitpost-output');

    let html = '';
    posts.forEach((post, i) => {
        html += `<div class="shitpost-card" style="animation-delay: ${i * 0.05}s">
      <div class="shitpost-format">${post.format.split('\n')[0]}</div>
      <div class="shitpost-text">${escapeHtml(post.text)}</div>
      <div class="shitpost-card-actions">
        <button class="btn btn-ghost btn-sm" onclick="copyText(\`${escapeForAttr(post.text)}\`)">📋 Copy</button>
        <button class="btn btn-ghost btn-sm" onclick="saveHookToVault(\`${escapeForAttr(post.text)}\`, 'degen')">🔒 Vault</button>
      </div>
    </div>`;
    });
    output.innerHTML = html;
}

/* ════════════════════════════════════════════
   Vault
   ════════════════════════════════════════════ */

let vaultFilter = 'all';

function filterVault(type) {
    vaultFilter = type;
    document.querySelectorAll('.vault-filters .filter-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    renderVault();
}

function renderVault() {
    const vault = Storage.getVault();
    const container = document.getElementById('vault-items');

    const filtered = vaultFilter === 'all' ? vault : vault.filter(v => v.type === vaultFilter);

    if (filtered.length === 0) {
        container.innerHTML = `<div class="empty-state">
      <span class="empty-icon">🔒</span>
      <h3>Vault is empty</h3>
      <p>Save threads, hooks, and images here for quick access.</p>
    </div>`;
        return;
    }

    let html = '';
    filtered.forEach((item, i) => {
        const typeIcon = item.type === 'thread' ? '🧵' : item.type === 'hook' ? '🎣' : '🎨';
        const typeColor = item.type === 'thread' ? 'tag-authority' : item.type === 'hook' ? 'tag-curiosity' : 'tag-data';
        const date = new Date(item.savedAt).toLocaleDateString();

        html += `<div class="vault-item" style="animation-delay: ${i * 0.03}s">
      <div class="vault-item-header">
        <span class="tag ${typeColor}">${typeIcon} ${item.type}</span>
        <span class="vault-item-date">${date}</span>
      </div>
      <div class="vault-item-preview">${escapeHtml(item.preview || '')}</div>
      ${item.score ? `<span class="score-badge-component score-high" style="font-size: 11px;">Score: ${item.score}</span>` : ''}
      <div class="vault-item-actions" style="margin-top: 8px;">
        <button class="btn btn-ghost btn-sm" onclick="copyText(\`${escapeForAttr(item.preview || '')}\`)">📋 Copy</button>
        <button class="btn btn-danger btn-sm" onclick="removeVaultItem('${item.id}')">🗑️ Remove</button>
      </div>
    </div>`;
    });
    container.innerHTML = html;
}

function removeVaultItem(id) {
    Storage.removeFromVault(id);
    renderVault();
    showToast('Removed from vault.', 'success');
}

function saveToVault(type) {
    if (type === 'image') {
        const canvas = document.getElementById('image-canvas');
        const result = Storage.saveToVault({
            type: 'image',
            preview: document.getElementById('img-headline').value || 'Image',
            mode: currentMode,
        });
        showToast(result.message, result.success ? 'success' : 'warning');
    }
}

/* ════════════════════════════════════════════
   Usage Display
   ════════════════════════════════════════════ */

function updateUsageDisplay() {
    const usage = Storage.getUsage();
    const limits = USAGE_LIMITS.free;
    const total = (usage.threads || 0) + (usage.hooks || 0) + (usage.images || 0);
    const max = limits.threads + limits.hooks + limits.images;
    const pct = Math.min(100, (total / max) * 100);

    const fill = document.getElementById('usage-fill');
    const text = document.getElementById('usage-text');
    if (fill) fill.style.width = pct + '%';
    if (text) text.textContent = `${usage.threads || 0}/${limits.threads} threads · ${usage.hooks || 0}/${limits.hooks} hooks`;
}

/* ════════════════════════════════════════════
   Utilities
   ════════════════════════════════════════════ */

function copyText(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!', 'success');
    }).catch(() => {
        // Fallback
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast('Copied!', 'success');
    });
}

function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/\n/g, '<br>');
}

function escapeForAttr(str) {
    return str.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
}

function truncate(str, len) {
    return str.length > len ? str.substring(0, len) + '...' : str;
}

/* ─── Toast System ─── */
function showToast(message, type = 'info') {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:8px;';
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    const colors = {
        success: 'rgba(16,185,129,0.15)',
        warning: 'rgba(245,158,11,0.15)',
        danger: 'rgba(239,68,68,0.15)',
        info: 'rgba(99,102,241,0.15)',
    };
    const borders = {
        success: 'rgba(16,185,129,0.3)',
        warning: 'rgba(245,158,11,0.3)',
        danger: 'rgba(239,68,68,0.3)',
        info: 'rgba(99,102,241,0.3)',
    };
    const icons = { success: '✅', warning: '⚠️', danger: '❌', info: 'ℹ️' };

    toast.style.cssText = `
    background: ${colors[type] || colors.info};
    border: 1px solid ${borders[type] || borders.info};
    backdrop-filter: blur(12px);
    color: #f0f0f5;
    padding: 12px 20px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 8px;
    animation: fadeIn 0.3s ease-out;
    max-width: 360px;
  `;
    toast.innerHTML = `<span>${icons[type] || ''}</span><span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
