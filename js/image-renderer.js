/* ═══════════════════════════════════════════════════════════════
   AUTHORITY ENGINE — Canvas Image Renderer v2
   Professional, mode-aware visual engine for X-optimized images
   Inspired by Dribbble / Behance premium aesthetics
   ═══════════════════════════════════════════════════════════════ */

const ImageRenderer = (() => {

    const WIDTH = 1200;
    const HEIGHT = 675;
    let uploadedLogo = null;

    function setLogo(img) { uploadedLogo = img; }
    function getLogo() { return uploadedLogo; }

    /* ═══════════════════════════════════
       MODE-AWARE COLOR PALETTES
       ═══════════════════════════════════ */
    const MODE_PALETTES = {
        web3: {
            gradient1: '#00FF88', gradient2: '#6366f1', gradient3: '#00d4ff',
            text: '#f0f0f5', textMuted: '#8b8fa3',
            surface: '#141420', surfaceLight: '#1e1e30',
            glow1: '#00FF88', glow2: '#6366f1',
            pattern: 'hex', badge: '🌐 Web3',
        },
        creator: {
            gradient1: '#f59e0b', gradient2: '#ec4899', gradient3: '#f97316',
            text: '#fefce8', textMuted: '#a3a089',
            surface: '#1c1917', surfaceLight: '#292524',
            glow1: '#f59e0b', glow2: '#ec4899',
            pattern: 'flow', badge: '🎨 Creator',
        },
        business: {
            gradient1: '#3b82f6', gradient2: '#10b981', gradient3: '#6366f1',
            text: '#f1f5f9', textMuted: '#94a3b8',
            surface: '#0f172a', surfaceLight: '#1e293b',
            glow1: '#3b82f6', glow2: '#10b981',
            pattern: 'grid', badge: '💼 Business',
        },
        shitpost: {
            gradient1: '#ef4444', gradient2: '#facc15', gradient3: '#f97316',
            text: '#fafafa', textMuted: '#a1a1aa',
            surface: '#09090b', surfaceLight: '#18181b',
            glow1: '#ef4444', glow2: '#facc15',
            pattern: 'noise', badge: '💀 Shitpost',
        },
        educational: {
            gradient1: '#8b5cf6', gradient2: '#06b6d4', gradient3: '#a78bfa',
            text: '#ede9fe', textMuted: '#a5b4c4',
            surface: '#0f0f23', surfaceLight: '#1a1a35',
            glow1: '#8b5cf6', glow2: '#06b6d4',
            pattern: 'dots', badge: '📚 Educational',
        },
    };

    function getPalette(mode) {
        return MODE_PALETTES[mode] || MODE_PALETTES.web3;
    }

    /* ═══════════════════════════════════
       MAIN RENDER ENTRY
       ═══════════════════════════════════ */
    function render(canvas, type, headline, subtext, colors, mode) {
        const ctx = canvas.getContext('2d');
        canvas.width = WIDTH;
        canvas.height = HEIGHT;

        const palette = getPalette(mode);
        const primary = colors.primary || palette.gradient1;
        const bg = colors.bg || palette.surface;
        const accent = colors.accent || palette.gradient2;

        // Merge user colors into palette
        const p = { ...palette, gradient1: primary, gradient2: accent, surface: bg };

        // 1. Layered background
        drawBackground(ctx, p, type);

        // 2. Decorative pattern
        drawPattern(ctx, p);

        // 3. Decorative elements
        drawDecorations(ctx, p, type);

        // 4. Template content
        switch (type) {
            case 'intro': renderIntro(ctx, headline, subtext, p); break;
            case 'data': renderData(ctx, headline, subtext, p); break;
            case 'quote': renderQuote(ctx, headline, subtext, p); break;
            case 'meme': renderMeme(ctx, headline, subtext, p); break;
            default: renderIntro(ctx, headline, subtext, p);
        }

        // 5. Frame border
        drawFrame(ctx, p);

        // 6. Logo
        if (uploadedLogo) drawLogo(ctx, uploadedLogo, type, p);

        // 7. Watermark
        drawWatermark(ctx, p);

        // 8. Film grain
        drawGrain(ctx);
    }

    /* ═══════════════════════════════════
       LAYERED BACKGROUND
       ═══════════════════════════════════ */
    function drawBackground(ctx, p, type) {
        // Base gradient (angled)
        const grad = ctx.createLinearGradient(0, 0, WIDTH * 0.4, HEIGHT);
        grad.addColorStop(0, p.surface);
        grad.addColorStop(0.5, lighten(p.surface, 8));
        grad.addColorStop(1, p.surface);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        // Ambient glow orb 1 (top-right)
        drawGlowOrb(ctx, WIDTH * 0.8, HEIGHT * 0.15, 350, p.glow1, 0.07);

        // Ambient glow orb 2 (bottom-left)
        drawGlowOrb(ctx, WIDTH * 0.15, HEIGHT * 0.85, 300, p.glow2, 0.06);

        // Center diffusion (subtle)
        drawGlowOrb(ctx, WIDTH * 0.5, HEIGHT * 0.5, 500, p.gradient1, 0.025);

        // Intro gets extra right-side composition glow
        if (type === 'intro') {
            drawGlowOrb(ctx, WIDTH * 0.85, HEIGHT * 0.5, 280, p.gradient2, 0.08);
        }

        // Vignette
        drawVignette(ctx);
    }

    function drawGlowOrb(ctx, x, y, radius, color, alpha) {
        const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
        grad.addColorStop(0, hexToRgba(color, alpha));
        grad.addColorStop(0.6, hexToRgba(color, alpha * 0.3));
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
    }

    function drawVignette(ctx) {
        // Dark edges for depth
        const grad = ctx.createRadialGradient(WIDTH / 2, HEIGHT / 2, HEIGHT * 0.3, WIDTH / 2, HEIGHT / 2, WIDTH * 0.75);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(1, 'rgba(0,0,0,0.35)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
    }

    /* ═══════════════════════════════════
       MODE-SPECIFIC PATTERNS
       ═══════════════════════════════════ */
    function drawPattern(ctx, p) {
        ctx.save();
        const alpha = 0.035;

        switch (p.pattern) {
            case 'hex': drawHexGrid(ctx, p.gradient1, alpha); break;
            case 'flow': drawFlowLines(ctx, p.gradient1, alpha); break;
            case 'grid': drawCleanGrid(ctx, p.gradient1, alpha); break;
            case 'noise': drawNoisePattern(ctx, p.gradient1, alpha * 1.5); break;
            case 'dots': drawDotPattern(ctx, p.gradient1, alpha); break;
        }

        ctx.restore();
    }

    function drawHexGrid(ctx, color, alpha) {
        ctx.strokeStyle = hexToRgba(color, alpha);
        ctx.lineWidth = 1;
        const size = 40;
        const h = size * Math.sqrt(3);
        for (let row = -1; row < HEIGHT / h + 1; row++) {
            for (let col = -1; col < WIDTH / (size * 1.5) + 1; col++) {
                const cx = col * size * 1.5;
                const cy = row * h + (col % 2 ? h / 2 : 0);
                drawHexagon(ctx, cx, cy, size * 0.55);
            }
        }
    }

    function drawHexagon(ctx, x, y, r) {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 6;
            const px = x + r * Math.cos(angle);
            const py = y + r * Math.sin(angle);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
    }

    function drawFlowLines(ctx, color, alpha) {
        ctx.strokeStyle = hexToRgba(color, alpha);
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 12; i++) {
            ctx.beginPath();
            const startY = (HEIGHT / 12) * i + 20;
            ctx.moveTo(0, startY);
            for (let x = 0; x <= WIDTH; x += 20) {
                const y = startY + Math.sin(x * 0.005 + i * 0.8) * 30 + Math.sin(x * 0.01 + i) * 15;
                ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
    }

    function drawCleanGrid(ctx, color, alpha) {
        ctx.strokeStyle = hexToRgba(color, alpha);
        ctx.lineWidth = 1;
        const spacing = 50;
        for (let x = 0; x <= WIDTH; x += spacing) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, HEIGHT);
            ctx.stroke();
        }
        for (let y = 0; y <= HEIGHT; y += spacing) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(WIDTH, y);
            ctx.stroke();
        }
        // Cross markers at intersections
        ctx.fillStyle = hexToRgba(color, alpha * 2);
        for (let x = 0; x <= WIDTH; x += spacing) {
            for (let y = 0; y <= HEIGHT; y += spacing) {
                ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
            }
        }
    }

    function drawNoisePattern(ctx, color, alpha) {
        // Scattered rectangles for glitch/noise effect
        ctx.fillStyle = hexToRgba(color, alpha);
        for (let i = 0; i < 80; i++) {
            const x = Math.random() * WIDTH;
            const y = Math.random() * HEIGHT;
            const w = Math.random() * 60 + 5;
            const h = Math.random() * 3 + 1;
            ctx.fillRect(x, y, w, h);
        }
        // Scanlines
        ctx.strokeStyle = hexToRgba(color, alpha * 0.5);
        ctx.lineWidth = 0.5;
        for (let y = 0; y < HEIGHT; y += 4) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(WIDTH, y);
            ctx.stroke();
        }
    }

    function drawDotPattern(ctx, color, alpha) {
        ctx.fillStyle = hexToRgba(color, alpha * 1.5);
        const spacing = 30;
        for (let x = spacing; x < WIDTH; x += spacing) {
            for (let y = spacing; y < HEIGHT; y += spacing) {
                ctx.beginPath();
                ctx.arc(x, y, 1.5, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    /* ═══════════════════════════════════
       DECORATIVE ELEMENTS
       ═══════════════════════════════════ */
    function drawDecorations(ctx, p, type) {
        // Corner brackets
        drawCornerBrackets(ctx, p);

        // Floating particles (suggest motion)
        drawParticles(ctx, p);
    }

    function drawCornerBrackets(ctx, p) {
        const pad = 20;
        const len = 50;
        const lw = 2;

        ctx.strokeStyle = hexToRgba(p.gradient1, 0.25);
        ctx.lineWidth = lw;
        ctx.lineCap = 'round';

        // Top-left
        ctx.beginPath();
        ctx.moveTo(pad, pad + len);
        ctx.lineTo(pad, pad);
        ctx.lineTo(pad + len, pad);
        ctx.stroke();

        // Top-right
        ctx.beginPath();
        ctx.moveTo(WIDTH - pad - len, pad);
        ctx.lineTo(WIDTH - pad, pad);
        ctx.lineTo(WIDTH - pad, pad + len);
        ctx.stroke();

        // Bottom-left
        ctx.strokeStyle = hexToRgba(p.gradient2, 0.2);
        ctx.beginPath();
        ctx.moveTo(pad, HEIGHT - pad - len);
        ctx.lineTo(pad, HEIGHT - pad);
        ctx.lineTo(pad + len, HEIGHT - pad);
        ctx.stroke();

        // Bottom-right
        ctx.beginPath();
        ctx.moveTo(WIDTH - pad - len, HEIGHT - pad);
        ctx.lineTo(WIDTH - pad, HEIGHT - pad);
        ctx.lineTo(WIDTH - pad, HEIGHT - pad - len);
        ctx.stroke();
    }

    function drawParticles(ctx, p) {
        const particles = [
            { x: WIDTH * 0.75, y: HEIGHT * 0.2, r: 3, color: p.gradient1, a: 0.3 },
            { x: WIDTH * 0.82, y: HEIGHT * 0.35, r: 2, color: p.gradient2, a: 0.25 },
            { x: WIDTH * 0.9, y: HEIGHT * 0.15, r: 4, color: p.gradient1, a: 0.15 },
            { x: WIDTH * 0.7, y: HEIGHT * 0.7, r: 2, color: p.gradient2, a: 0.2 },
            { x: WIDTH * 0.15, y: HEIGHT * 0.3, r: 2.5, color: p.gradient1, a: 0.12 },
            { x: WIDTH * 0.6, y: HEIGHT * 0.1, r: 1.5, color: p.gradient2, a: 0.18 },
            { x: WIDTH * 0.88, y: HEIGHT * 0.6, r: 3, color: p.gradient1, a: 0.1 },
            { x: WIDTH * 0.35, y: HEIGHT * 0.85, r: 2, color: p.gradient2, a: 0.15 },
        ];
        particles.forEach(pt => {
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
            ctx.fillStyle = hexToRgba(pt.color, pt.a);
            ctx.fill();
            // Glow ring
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, pt.r * 3, 0, Math.PI * 2);
            ctx.fillStyle = hexToRgba(pt.color, pt.a * 0.2);
            ctx.fill();
        });
    }

    /* ═══════════════════════════════════
       FRAME BORDER
       ═══════════════════════════════════ */
    function drawFrame(ctx, p) {
        const inset = 12;
        const radius = 16;
        ctx.strokeStyle = hexToRgba(p.gradient1, 0.1);
        ctx.lineWidth = 1;
        roundRect(ctx, inset, inset, WIDTH - inset * 2, HEIGHT - inset * 2, radius, false, true);
    }

    /* ═══════════════════════════════════
       FILM GRAIN OVERLAY
       ═══════════════════════════════════ */
    function drawGrain(ctx) {
        const imageData = ctx.getImageData(0, 0, WIDTH, HEIGHT);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const noise = (Math.random() - 0.5) * 12;
            data[i] += noise;
            data[i + 1] += noise;
            data[i + 2] += noise;
        }
        ctx.putImageData(imageData, 0, 0);
    }

    /* ═══════════════════════════════════
       TEMPLATE: INTRO COVER
       ═══════════════════════════════════ */
    function renderIntro(ctx, headline, subtext, p) {
        const hl = headline || 'Your Headline Here';
        const st = subtext || '';

        // Right-side decorative composition
        drawIntroDecoration(ctx, p);

        // Mode badge (top-left)
        drawModeBadge(ctx, p, 60, 60);

        // Headline
        const headSize = smartFitText(ctx, hl, WIDTH * 0.55, 64, 32, '800');
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        // Gradient fill for headline
        const headGrad = ctx.createLinearGradient(60, 180, 60, 180 + headSize * 3);
        headGrad.addColorStop(0, p.text);
        headGrad.addColorStop(1, hexToRgba(p.text, 0.85));
        ctx.fillStyle = headGrad;
        ctx.font = `800 ${headSize}px Inter, system-ui, sans-serif`;
        ctx.letterSpacing = headSize > 48 ? '-1px' : '0px';

        // Text shadow for depth
        ctx.shadowColor = hexToRgba(p.gradient1, 0.15);
        ctx.shadowBlur = 30;
        ctx.shadowOffsetY = 4;
        const headlineLines = wrapText(ctx, hl, 60, 190, WIDTH * 0.55, headSize * 1.15);
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        // Accent divider bar
        const dividerY = 190 + headlineLines * (headSize * 1.15) + 20;
        const barGrad = ctx.createLinearGradient(60, dividerY, 160, dividerY);
        barGrad.addColorStop(0, p.gradient1);
        barGrad.addColorStop(1, hexToRgba(p.gradient2, 0.6));
        ctx.fillStyle = barGrad;
        roundRect(ctx, 60, dividerY, 80, 4, 2, true, false);

        // Subtext
        if (st) {
            ctx.fillStyle = p.textMuted;
            ctx.font = `500 ${Math.min(22, headSize * 0.38)}px Inter, system-ui, sans-serif`;
            ctx.letterSpacing = '0.5px';
            wrapText(ctx, st, 60, dividerY + 28, WIDTH * 0.5, 30);
        }

        // Bottom bar with thread badge
        drawBottomBar(ctx, p, '🧵 Thread');
    }

    function drawIntroDecoration(ctx, p) {
        // Geometric shapes on the right side
        const cx = WIDTH * 0.82;
        const cy = HEIGHT * 0.4;

        // Large circle outline
        ctx.strokeStyle = hexToRgba(p.gradient1, 0.08);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, 140, 0, Math.PI * 2);
        ctx.stroke();

        // Partial arc
        ctx.strokeStyle = hexToRgba(p.gradient2, 0.15);
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cx, cy, 100, -Math.PI * 0.3, Math.PI * 0.8);
        ctx.stroke();

        // Inner dot
        ctx.fillStyle = hexToRgba(p.gradient1, 0.2);
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fill();

        // Connecting lines
        ctx.strokeStyle = hexToRgba(p.gradient1, 0.05);
        ctx.lineWidth = 1;
        ctx.setLineDash([6, 10]);
        ctx.beginPath();
        ctx.moveTo(cx - 140, cy);
        ctx.lineTo(cx - 220, cy + 80);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx + 80, cy - 120);
        ctx.lineTo(cx + 120, cy - 160);
        ctx.stroke();
        ctx.setLineDash([]);

        // Small accent squares
        ctx.fillStyle = hexToRgba(p.gradient2, 0.1);
        ctx.save();
        ctx.translate(cx + 130, cy - 60);
        ctx.rotate(Math.PI / 4);
        ctx.fillRect(-10, -10, 20, 20);
        ctx.restore();

        ctx.fillStyle = hexToRgba(p.gradient1, 0.08);
        ctx.save();
        ctx.translate(cx - 60, cy + 130);
        ctx.rotate(Math.PI / 6);
        ctx.fillRect(-8, -8, 16, 16);
        ctx.restore();
    }

    /* ═══════════════════════════════════
       TEMPLATE: DATA CARD
       ═══════════════════════════════════ */
    function renderData(ctx, headline, subtext, p) {
        const stat = headline || '87%';
        const label = subtext || 'of threads fail in the first tweet';

        // Background bar chart decoration
        drawBarChartDecoration(ctx, p);

        // Big stat number
        const statSize = smartFitText(ctx, stat, WIDTH * 0.7, 140, 60, '900');
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Neon glow effect
        ctx.shadowColor = p.gradient1;
        ctx.shadowBlur = 60;
        ctx.fillStyle = p.gradient1;
        ctx.font = `900 ${statSize}px 'JetBrains Mono', monospace`;
        ctx.fillText(stat, WIDTH / 2, HEIGHT * 0.4);

        // Second layer (sharper)
        ctx.shadowBlur = 20;
        ctx.fillText(stat, WIDTH / 2, HEIGHT * 0.4);
        ctx.shadowBlur = 0;

        // Gradient overlay on stat
        const statGrad = ctx.createLinearGradient(
            WIDTH / 2 - 200, HEIGHT * 0.35,
            WIDTH / 2 + 200, HEIGHT * 0.45
        );
        statGrad.addColorStop(0, p.gradient1);
        statGrad.addColorStop(1, p.gradient2);
        ctx.fillStyle = statGrad;
        ctx.fillText(stat, WIDTH / 2, HEIGHT * 0.4);

        // Subtitle label
        ctx.fillStyle = hexToRgba(p.text, 0.7);
        ctx.font = `500 22px Inter, system-ui, sans-serif`;
        ctx.letterSpacing = '0.5px';
        wrapText(ctx, label, WIDTH / 2, HEIGHT * 0.4 + statSize * 0.5 + 30, WIDTH * 0.6, 30, true);

        // Decorative divider
        const divY = HEIGHT * 0.4 + statSize * 0.5 + 75;
        ctx.strokeStyle = hexToRgba(p.gradient1, 0.15);
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 8]);
        ctx.beginPath();
        ctx.moveTo(WIDTH / 2 - 120, divY);
        ctx.lineTo(WIDTH / 2 + 120, divY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Source line
        ctx.fillStyle = hexToRgba(p.textMuted, 0.5);
        ctx.font = `400 13px Inter, system-ui, sans-serif`;
        ctx.fillText('Source: Authority Engine Research', WIDTH / 2, divY + 28);

        // Mode badge
        drawModeBadge(ctx, p, WIDTH - 160, 50);
    }

    function drawBarChartDecoration(ctx, p) {
        const barCount = 8;
        const barWidth = 30;
        const maxHeight = 120;
        const startX = WIDTH * 0.08;
        const baseY = HEIGHT - 80;
        const gap = 14;

        for (let i = 0; i < barCount; i++) {
            const h = maxHeight * (0.3 + Math.sin(i * 0.7) * 0.35 + Math.random() * 0.2);
            const x = startX + i * (barWidth + gap);
            const grad = ctx.createLinearGradient(x, baseY - h, x, baseY);
            grad.addColorStop(0, hexToRgba(p.gradient1, 0.08));
            grad.addColorStop(1, hexToRgba(p.gradient1, 0.02));
            ctx.fillStyle = grad;
            roundRect(ctx, x, baseY - h, barWidth, h, 4, true, false);
        }

        // Mirror on right side
        for (let i = 0; i < barCount; i++) {
            const h = maxHeight * (0.3 + Math.cos(i * 0.9) * 0.35 + Math.random() * 0.15);
            const x = WIDTH - startX - (i + 1) * (barWidth + gap);
            const grad = ctx.createLinearGradient(x, baseY - h, x, baseY);
            grad.addColorStop(0, hexToRgba(p.gradient2, 0.06));
            grad.addColorStop(1, hexToRgba(p.gradient2, 0.015));
            ctx.fillStyle = grad;
            roundRect(ctx, x, baseY - h, barWidth, h, 4, true, false);
        }
    }

    /* ═══════════════════════════════════
       TEMPLATE: QUOTE CARD
       ═══════════════════════════════════ */
    function renderQuote(ctx, headline, subtext, p) {
        const quote = headline || 'Your insight quote goes here';
        const attribution = subtext || '';

        // Large decorative quotation mark
        const qGrad = ctx.createLinearGradient(40, 60, 200, 250);
        qGrad.addColorStop(0, hexToRgba(p.gradient1, 0.15));
        qGrad.addColorStop(1, hexToRgba(p.gradient2, 0.05));
        ctx.fillStyle = qGrad;
        ctx.font = '900 280px Georgia, "Times New Roman", serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText('\u201C', 30, 20);

        // Closing quote mark (smaller, bottom-right)
        ctx.fillStyle = hexToRgba(p.gradient2, 0.06);
        ctx.font = '900 180px Georgia, "Times New Roman", serif';
        ctx.textAlign = 'right';
        ctx.fillText('\u201D', WIDTH - 60, HEIGHT - 220);

        // Left accent border
        const borderGrad = ctx.createLinearGradient(80, 200, 80, HEIGHT - 150);
        borderGrad.addColorStop(0, p.gradient1);
        borderGrad.addColorStop(1, hexToRgba(p.gradient2, 0.4));
        ctx.fillStyle = borderGrad;
        roundRect(ctx, 80, 200, 4, HEIGHT - 380, 2, true, false);

        // Quote text
        const qSize = smartFitText(ctx, quote, WIDTH - 240, 44, 22, '600');
        ctx.fillStyle = p.text;
        ctx.font = `600 italic ${qSize}px Inter, system-ui, sans-serif`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.letterSpacing = '0.3px';

        // Subtle text shadow
        ctx.shadowColor = hexToRgba(p.gradient1, 0.1);
        ctx.shadowBlur = 20;
        wrapText(ctx, quote, 110, 220, WIDTH - 260, qSize * 1.45);
        ctx.shadowBlur = 0;

        // Attribution
        if (attribution) {
            ctx.fillStyle = p.gradient1;
            ctx.font = '600 18px Inter, system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(`— ${attribution}`, 110, HEIGHT - 110);

            // Small line after attribution
            ctx.fillStyle = hexToRgba(p.gradient1, 0.3);
            const nameWidth = ctx.measureText(`— ${attribution}`).width;
            roundRect(ctx, 110 + nameWidth + 16, HEIGHT - 103, 40, 2, 1, true, false);
        }

        // Mode badge (bottom-right)
        drawModeBadge(ctx, p, WIDTH - 160, HEIGHT - 60);
    }

    /* ═══════════════════════════════════
       TEMPLATE: MEME CARD
       ═══════════════════════════════════ */
    function renderMeme(ctx, headline, subtext, p) {
        const mainText = headline || 'When the devs say "trust the process"';
        const reaction = subtext || '💀';

        // Top banner
        const bannerGrad = ctx.createLinearGradient(0, 0, WIDTH, 0);
        bannerGrad.addColorStop(0, hexToRgba(p.gradient1, 0.12));
        bannerGrad.addColorStop(0.5, hexToRgba(p.gradient2, 0.08));
        bannerGrad.addColorStop(1, hexToRgba(p.gradient1, 0.12));
        ctx.fillStyle = bannerGrad;
        ctx.fillRect(0, 0, WIDTH, 70);

        // Banner divider line
        const lineGrad = ctx.createLinearGradient(0, 70, WIDTH, 70);
        lineGrad.addColorStop(0, 'transparent');
        lineGrad.addColorStop(0.3, hexToRgba(p.gradient1, 0.3));
        lineGrad.addColorStop(0.7, hexToRgba(p.gradient2, 0.3));
        lineGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = lineGrad;
        ctx.fillRect(0, 68, WIDTH, 2);

        // Certified badge
        ctx.font = '700 15px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = p.gradient1;
        ctx.letterSpacing = '3px';
        ctx.fillText('💀  SHITPOST CERTIFIED  💀', WIDTH / 2, 44);
        ctx.letterSpacing = '0px';

        // Main meme text (large, bold, centered)
        const mSize = smartFitText(ctx, mainText, WIDTH - 160, 48, 24, '800');
        ctx.font = `800 ${mSize}px Inter, system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillStyle = p.text;

        // Text with stroke for meme impact
        ctx.strokeStyle = hexToRgba(p.surface, 0.6);
        ctx.lineWidth = 4;
        ctx.lineJoin = 'round';
        const memeLines = wrapTextCentered(ctx, mainText, WIDTH / 2, 170, WIDTH - 160, mSize * 1.35, true);

        // Reaction / bottom text
        if (reaction) {
            const reactionY = 170 + memeLines * (mSize * 1.35) + 50;
            ctx.fillStyle = hexToRgba(p.text, 0.5);
            ctx.font = '500 24px Inter, system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(reaction, WIDTH / 2, reactionY);
        }

        // Bottom bar
        ctx.fillStyle = hexToRgba(p.gradient2, 0.06);
        ctx.fillRect(0, HEIGHT - 50, WIDTH, 50);
        const btmLine = ctx.createLinearGradient(0, HEIGHT - 50, WIDTH, HEIGHT - 50);
        btmLine.addColorStop(0, 'transparent');
        btmLine.addColorStop(0.5, hexToRgba(p.gradient2, 0.2));
        btmLine.addColorStop(1, 'transparent');
        ctx.fillStyle = btmLine;
        ctx.fillRect(0, HEIGHT - 50, WIDTH, 1);

        ctx.fillStyle = hexToRgba(p.textMuted, 0.4);
        ctx.font = '500 12px "JetBrains Mono", monospace';
        ctx.fillText('made with Authority Engine', WIDTH / 2, HEIGHT - 22);
    }

    /* ═══════════════════════════════════
       SHARED UI COMPONENTS
       ═══════════════════════════════════ */
    function drawModeBadge(ctx, p, x, y) {
        ctx.save();
        const text = p.badge || '🌐 Web3';
        ctx.font = '600 13px Inter, system-ui, sans-serif';
        const tw = ctx.measureText(text).width;
        const padX = 16;
        const padY = 10;
        const bw = tw + padX * 2;
        const bh = 28;

        // Background pill
        ctx.fillStyle = hexToRgba(p.gradient1, 0.1);
        roundRect(ctx, x - bw / 2, y - bh / 2, bw, bh, bh / 2, true, false);

        // Border
        ctx.strokeStyle = hexToRgba(p.gradient1, 0.2);
        ctx.lineWidth = 1;
        roundRect(ctx, x - bw / 2, y - bh / 2, bw, bh, bh / 2, false, true);

        // Text
        ctx.fillStyle = p.gradient1;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, x, y);
        ctx.restore();
    }

    function drawBottomBar(ctx, p, label) {
        // Background strip
        ctx.fillStyle = hexToRgba(p.gradient1, 0.04);
        ctx.fillRect(0, HEIGHT - 55, WIDTH, 55);

        // Top line gradient
        const lineGrad = ctx.createLinearGradient(0, HEIGHT - 55, WIDTH, HEIGHT - 55);
        lineGrad.addColorStop(0, hexToRgba(p.gradient1, 0.3));
        lineGrad.addColorStop(0.5, hexToRgba(p.gradient2, 0.15));
        lineGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = lineGrad;
        ctx.fillRect(0, HEIGHT - 55, WIDTH, 1.5);

        // Label
        ctx.font = '600 13px Inter, system-ui, sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = hexToRgba(p.gradient1, 0.6);
        ctx.fillText(label, WIDTH - 40, HEIGHT - 28);
    }

    /* ═══════════════════════════════════
       LOGO INTEGRATION
       ═══════════════════════════════════ */
    function drawLogo(ctx, img, type, p) {
        const size = 48;
        let x, y;

        // Adaptive placement per template
        switch (type) {
            case 'intro': x = WIDTH - size - 40; y = HEIGHT - 100; break;
            case 'data': x = WIDTH / 2 - size / 2; y = 40; break;
            case 'quote': x = WIDTH - size - 40; y = 40; break;
            case 'meme': x = 40; y = HEIGHT - 100; break;
            default: x = WIDTH - size - 40; y = 40;
        }

        ctx.save();

        // Contrast background pill
        ctx.fillStyle = hexToRgba(p.surface, 0.7);
        roundRect(ctx, x - 6, y - 6, size + 12, size + 12, 12, true, false);

        // Border glow
        ctx.strokeStyle = hexToRgba(p.gradient1, 0.2);
        ctx.lineWidth = 1.5;
        roundRect(ctx, x - 6, y - 6, size + 12, size + 12, 12, false, true);

        // Clip to rounded rect and draw image
        ctx.beginPath();
        const r = 8;
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + size, y, x + size, y + size, r);
        ctx.arcTo(x + size, y + size, x, y + size, r);
        ctx.arcTo(x, y + size, x, y, r);
        ctx.arcTo(x, y, x + size, y, r);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(img, x, y, size, size);
        ctx.restore();
    }

    /* ═══════════════════════════════════
       WATERMARK
       ═══════════════════════════════════ */
    function drawWatermark(ctx, p) {
        ctx.fillStyle = hexToRgba(p.text, 0.06);
        ctx.font = '500 11px Inter, system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        ctx.fillText('⚡ Authority Engine', 40, HEIGHT - 16);
    }

    /* ═══════════════════════════════════
       TYPOGRAPHY ENGINE
       ═══════════════════════════════════ */
    function smartFitText(ctx, text, maxWidth, maxSize, minSize, weight) {
        // Accounts for both width AND expected line count
        for (let size = maxSize; size >= minSize; size -= 2) {
            ctx.font = `${weight} ${size}px Inter, system-ui, sans-serif`;
            const words = text.split(' ');
            let lines = 1;
            let line = '';
            for (const word of words) {
                const test = line + word + ' ';
                if (ctx.measureText(test).width > maxWidth && line !== '') {
                    lines++;
                    line = word + ' ';
                } else {
                    line = test;
                }
            }
            // Limit to reasonable line count for the canvas
            const maxLines = size > 40 ? 3 : size > 28 ? 5 : 7;
            if (lines <= maxLines) return size;
        }
        return minSize;
    }

    function wrapText(ctx, text, x, y, maxWidth, lineHeight, centered) {
        const words = text.split(' ');
        let line = '';
        let posY = y;
        let lineCount = 0;

        for (const word of words) {
            const test = line + word + ' ';
            if (ctx.measureText(test).width > maxWidth && line !== '') {
                ctx.fillText(line.trim(), centered ? x : x, posY);
                line = word + ' ';
                posY += lineHeight;
                lineCount++;
            } else {
                line = test;
            }
        }
        ctx.fillText(line.trim(), centered ? x : x, posY);
        lineCount++;
        return lineCount;
    }

    function wrapTextCentered(ctx, text, x, y, maxWidth, lineHeight, stroke) {
        // First pass: compute lines
        const words = text.split(' ');
        const lines = [];
        let current = '';

        for (const word of words) {
            const test = current + word + ' ';
            if (ctx.measureText(test).width > maxWidth && current !== '') {
                lines.push(current.trim());
                current = word + ' ';
            } else {
                current = test;
            }
        }
        if (current.trim()) lines.push(current.trim());

        // Second pass: render centered
        ctx.textAlign = 'center';
        lines.forEach((line, i) => {
            const ly = y + i * lineHeight;
            if (stroke) {
                ctx.strokeText(line, x, ly);
            }
            ctx.fillText(line, x, ly);
        });

        return lines.length;
    }

    /* ═══════════════════════════════════
       UTILITY FUNCTIONS
       ═══════════════════════════════════ */
    function hexToRgba(hex, alpha) {
        if (!hex || hex.charAt(0) !== '#') return `rgba(128,128,128,${alpha})`;
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    function lighten(hex, amount) {
        if (!hex || hex.charAt(0) !== '#') return hex;
        let r = parseInt(hex.slice(1, 3), 16);
        let g = parseInt(hex.slice(3, 5), 16);
        let b = parseInt(hex.slice(5, 7), 16);
        r = Math.min(255, r + amount);
        g = Math.min(255, g + amount);
        b = Math.min(255, b + amount);
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    function roundRect(ctx, x, y, w, h, r, fill, stroke) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
        if (fill) ctx.fill();
        if (stroke) ctx.stroke();
    }

    /* ═══════════════════════════════════
       EXPORT / DOWNLOAD
       ═══════════════════════════════════ */
    function download(canvas, filename) {
        const link = document.createElement('a');
        link.download = filename || 'authority-engine-image.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }

    return { render, download, setLogo, getLogo };
})();
