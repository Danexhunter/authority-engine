/* ═══════════════════════════════════════════════════════════════
   AUTHORITY ENGINE — Storage Service
   localStorage abstraction for vault, settings, and usage tracking
   ═══════════════════════════════════════════════════════════════ */

const Storage = (() => {
    const PREFIX = 'ae_';

    function get(key, fallback = null) {
        try {
            const val = localStorage.getItem(PREFIX + key);
            return val ? JSON.parse(val) : fallback;
        } catch { return fallback; }
    }

    function set(key, value) {
        try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); } catch { }
    }

    function remove(key) {
        try { localStorage.removeItem(PREFIX + key); } catch { }
    }

    /* ─── Mode ─── */
    function getMode() { return get('mode', 'web3'); }
    function setMode(mode) { set('mode', mode); }

    /* ─── Usage Tracking ─── */
    function getUsage() {
        const today = new Date().toISOString().slice(0, 10);
        const usage = get('usage', { date: today, threads: 0, hooks: 0, images: 0 });
        if (usage.date !== today) return { date: today, threads: 0, hooks: 0, images: 0 };
        return usage;
    }

    function incrementUsage(type) {
        const usage = getUsage();
        usage[type] = (usage[type] || 0) + 1;
        set('usage', usage);
        return usage;
    }

    function canUse(type) {
        const usage = getUsage();
        const limits = USAGE_LIMITS.free;
        return (usage[type] || 0) < limits[type];
    }

    /* ─── Vault ─── */
    function getVault() { return get('vault', []); }

    function saveToVault(item) {
        const vault = getVault();
        const limits = USAGE_LIMITS.free;
        if (vault.length >= limits.vault) {
            return { success: false, message: 'Vault is full! Upgrade to Pro for unlimited storage.' };
        }
        item.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
        item.savedAt = new Date().toISOString();
        vault.unshift(item);
        set('vault', vault);
        return { success: true, message: 'Saved to vault!' };
    }

    function removeFromVault(id) {
        const vault = getVault().filter(item => item.id !== id);
        set('vault', vault);
    }

    /* ─── Voice Profile ─── */
    function getVoiceProfile() { return get('voice_profile', null); }
    function setVoiceProfile(profile) { set('voice_profile', profile); }

    /* ─── Brand Kit ─── */
    function getBrandKit() {
        return get('brand_kit', {
            primary: '#00FF88',
            bg: '#0a0a0f',
            accent: '#6366f1',
            logo: null,
        });
    }
    function setBrandKit(kit) { set('brand_kit', kit); }

    return {
        get, set, remove,
        getMode, setMode,
        getUsage, incrementUsage, canUse,
        getVault, saveToVault, removeFromVault,
        getVoiceProfile, setVoiceProfile,
        getBrandKit, setBrandKit,
    };
})();
