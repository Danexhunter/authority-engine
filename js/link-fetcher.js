/* ═══════════════════════════════════════════════════════════════
   AUTHORITY ENGINE — Link Fetcher Module
   Fetches, parses, and extracts structured content from URLs
   using CORS proxies for client-side operation.
   ═══════════════════════════════════════════════════════════════ */

const LinkFetcher = (() => {

    /* ─── CORS Proxies (ordered by reliability) ─── */
    const PROXIES = [
        url => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
        url => `https://corsproxy.io/?${encodeURIComponent(url)}`,
        url => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
    ];

    /* ─── Noise selectors to strip ─── */
    const STRIP_SELECTORS = [
        'script', 'style', 'noscript', 'iframe', 'svg', 'canvas',
        'nav', 'header', 'footer', 'aside',
        '.nav', '.navbar', '.navigation', '.menu', '.sidebar',
        '.footer', '.site-footer', '.page-footer',
        '.header', '.site-header', '.page-header',
        '.ad', '.ads', '.advertisement', '.sponsor', '.promo',
        '.cookie', '.cookie-banner', '.consent', '.popup', '.modal',
        '.social', '.share', '.sharing', '.social-share',
        '.comments', '.comment-section', '#comments', '#disqus',
        '.related', '.recommended', '.more-articles',
        '.newsletter', '.subscribe', '.signup',
        '[role="navigation"]', '[role="banner"]', '[role="contentinfo"]',
        '[aria-hidden="true"]',
    ];

    /* ─── Content selectors (prioritized) ─── */
    const CONTENT_SELECTORS = [
        'article', '[role="main"]', 'main',
        '.post-content', '.article-content', '.entry-content',
        '.post-body', '.article-body', '.story-body',
        '.content', '.page-content', '#content',
        '.markdown-body', '.prose',
    ];

    /* ═══════════════════════════════════════════
       FETCH URL CONTENT
       ═══════════════════════════════════════════ */
    async function fetchURL(url) {
        if (!url || !url.trim()) return null;
        url = url.trim();
        if (!/^https?:\/\//i.test(url)) url = 'https://' + url;

        let html = null;
        let lastError = null;

        for (const proxyFn of PROXIES) {
            try {
                const proxyUrl = proxyFn(url);
                const response = await fetch(proxyUrl, {
                    signal: AbortSignal.timeout(12000),
                    headers: { 'Accept': 'text/html,application/xhtml+xml,*/*' },
                });
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                html = await response.text();
                if (html && html.length > 200) break;
                html = null;
            } catch (err) {
                lastError = err;
            }
        }

        if (!html) {
            return { success: false, error: lastError?.message || 'Failed to fetch URL' };
        }

        try {
            const content = parseHTML(html, url);
            return { success: true, content };
        } catch (err) {
            return { success: false, error: 'Failed to parse page content' };
        }
    }

    /* ═══════════════════════════════════════════
       HTML PARSER — extract structured content
       ═══════════════════════════════════════════ */
    function parseHTML(html, sourceUrl) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Strip noise
        STRIP_SELECTORS.forEach(sel => {
            try { doc.querySelectorAll(sel).forEach(el => el.remove()); } catch (e) { }
        });

        // Extract metadata
        const title = extractTitle(doc);
        const description = extractMeta(doc, 'description') || extractMeta(doc, 'og:description') || '';
        const author = extractMeta(doc, 'author') || extractMeta(doc, 'article:author') || '';
        const publishDate = extractMeta(doc, 'article:published_time') || extractMeta(doc, 'date') || '';

        // Find main content container
        const mainContent = findMainContent(doc);

        // Extract headings
        const headings = [];
        mainContent.querySelectorAll('h1, h2, h3, h4').forEach(h => {
            const text = cleanText(h.textContent);
            if (text.length > 5 && text.length < 200) {
                headings.push({ level: parseInt(h.tagName[1]), text });
            }
        });

        // Extract paragraphs
        const paragraphs = [];
        mainContent.querySelectorAll('p').forEach(p => {
            const text = cleanText(p.textContent);
            if (text.length > 40 && !isBoilerplate(text)) {
                paragraphs.push(text);
            }
        });

        // Extract list items as bullet points
        const bullets = [];
        mainContent.querySelectorAll('li').forEach(li => {
            const text = cleanText(li.textContent);
            if (text.length > 15 && text.length < 300 && !isBoilerplate(text)) {
                bullets.push(text);
            }
        });

        // Extract stats and numbers
        const keyStats = extractStats(paragraphs.join(' ') + ' ' + bullets.join(' '));

        // Extract notable quotes (blockquotes or text in quotes)
        const quotes = [];
        mainContent.querySelectorAll('blockquote').forEach(bq => {
            const text = cleanText(bq.textContent);
            if (text.length > 20 && text.length < 300) quotes.push(text);
        });

        // Build summary from first 3 meaningful paragraphs
        const summary = paragraphs.slice(0, 3).join('\n\n');

        // Extract key insights — sentences with strong signal words
        const keyInsights = extractKeyInsights(paragraphs);

        return {
            title,
            description,
            author,
            publishDate,
            sourceUrl,
            headings: headings.slice(0, 15),
            paragraphs: paragraphs.slice(0, 30),
            bullets: bullets.slice(0, 20),
            keyStats: keyStats.slice(0, 15),
            quotes: quotes.slice(0, 5),
            keyInsights: keyInsights.slice(0, 10),
            summary,
            wordCount: paragraphs.join(' ').split(/\s+/).length,
        };
    }

    /* ═══════════════════════════════════════════
       EXTRACTION HELPERS
       ═══════════════════════════════════════════ */

    function extractTitle(doc) {
        const ogTitle = extractMeta(doc, 'og:title');
        if (ogTitle) return ogTitle;
        const h1 = doc.querySelector('h1');
        if (h1) return cleanText(h1.textContent);
        const titleEl = doc.querySelector('title');
        if (titleEl) return cleanText(titleEl.textContent).split('|')[0].split('—')[0].split('-')[0].trim();
        return '';
    }

    function extractMeta(doc, name) {
        const el = doc.querySelector(
            `meta[name="${name}"], meta[property="${name}"], meta[property="og:${name}"]`
        );
        return el ? cleanText(el.getAttribute('content') || '') : '';
    }

    function findMainContent(doc) {
        for (const sel of CONTENT_SELECTORS) {
            const el = doc.querySelector(sel);
            if (el && el.textContent.trim().length > 200) return el;
        }
        return doc.body || doc.documentElement;
    }

    function cleanText(text) {
        return text.replace(/\s+/g, ' ').replace(/\n+/g, ' ').trim();
    }

    function isBoilerplate(text) {
        const lower = text.toLowerCase();
        const boilerplate = [
            'cookie', 'privacy policy', 'terms of service', 'subscribe',
            'sign up', 'newsletter', 'all rights reserved', 'copyright',
            'click here', 'read more', 'advertisement', 'sponsored',
            'accept cookies', 'manage preferences', 'login', 'sign in',
        ];
        return boilerplate.some(bp => lower.includes(bp));
    }

    function extractStats(text) {
        const stats = [];
        // Percentages
        const pctMatches = text.match(/\d+(?:\.\d+)?%[\s\w,]*/g) || [];
        pctMatches.forEach(m => {
            const context = m.trim().substring(0, 120);
            if (context.length > 5) stats.push({ type: 'percentage', text: context });
        });

        // Dollar amounts
        const dollarMatches = text.match(/\$[\d,.]+(?:\s*(?:billion|million|trillion|B|M|T|K))?/gi) || [];
        dollarMatches.forEach(m => stats.push({ type: 'money', text: m.trim() }));

        // Large numbers with context
        const numMatches = text.match(/\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+(?:\.\d+)?\s*(?:billion|million|trillion|x)/gi) || [];
        numMatches.forEach(m => stats.push({ type: 'number', text: m.trim() }));

        // Remove duplicates
        const seen = new Set();
        return stats.filter(s => {
            if (seen.has(s.text)) return false;
            seen.add(s.text);
            return true;
        });
    }

    function extractKeyInsights(paragraphs) {
        const signalWords = [
            'important', 'key', 'critical', 'significant', 'major',
            'breakthrough', 'growth', 'decline', 'increase', 'decrease',
            'trend', 'shift', 'transform', 'disrupt', 'innovate',
            'strategy', 'opportunity', 'risk', 'challenge', 'solution',
            'data shows', 'research', 'according to', 'study', 'found that',
            'surprisingly', 'notably', 'remarkably', 'interestingly',
            'first time', 'record', 'all-time', 'unprecedented',
            'bullish', 'bearish', 'adoption', 'institutional',
        ];

        const insights = [];
        for (const para of paragraphs) {
            const sentences = para.match(/[^.!?]+[.!?]+/g) || [para];
            for (const sentence of sentences) {
                const lower = sentence.toLowerCase();
                const signalCount = signalWords.filter(w => lower.includes(w)).length;
                if (signalCount >= 1 && sentence.length > 40 && sentence.length < 280) {
                    insights.push({ text: sentence.trim(), strength: signalCount });
                }
            }
        }
        return insights.sort((a, b) => b.strength - a.strength);
    }

    /* ═══════════════════════════════════════════
       CONTENT DIGEST — condensed version for generators
       ═══════════════════════════════════════════ */
    function buildDigest(content) {
        if (!content) return null;
        return {
            title: content.title || '',
            topHeadings: content.headings.slice(0, 8).map(h => h.text),
            topInsights: content.keyInsights.slice(0, 6).map(i => i.text),
            topStats: content.keyStats.slice(0, 8).map(s => s.text),
            topQuotes: content.quotes.slice(0, 3),
            topBullets: content.bullets.slice(0, 10),
            summary: content.summary || '',
            author: content.author || '',
            sourceUrl: content.sourceUrl || '',
        };
    }

    /* ═══════════════════════════════════════════
       PUBLIC API
       ═══════════════════════════════════════════ */
    return {
        fetchURL,
        parseHTML,
        buildDigest,
    };
})();
