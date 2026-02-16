/* ═══════════════════════════════════════════════════════════════
   AUTHORITY ENGINE — Constants & Configuration
   ═══════════════════════════════════════════════════════════════ */

const MODES = {
  web3: {
    name: 'Web3',
    icon: '🌐',
    tone: 'Alpha-style, conviction-driven, CT-native',
    colors: { primary: '#00FF88', bg: '#0a0a0f', accent: '#6366f1' },
    vocabulary: ['alpha', 'bullish', 'conviction', 'narrative', 'protocol', 'on-chain', 'anon', 'gm', 'wagmi', 'ngmi', 'degen'],
    hookStyles: ['authority', 'curiosity', 'data', 'controversial', 'story', 'degen'],
  },
  creator: {
    name: 'Creator',
    icon: '🎨',
    tone: 'Authentic, story-driven, personal brand',
    colors: { primary: '#f59e0b', bg: '#18181b', accent: '#ec4899' },
    vocabulary: ['audience', 'growth', 'authentic', 'journey', 'community', 'content', 'brand', 'viral', 'engage'],
    hookStyles: ['authority', 'curiosity', 'story', 'data', 'controversial'],
  },
  business: {
    name: 'Business',
    icon: '💼',
    tone: 'Professional, data-backed, authoritative',
    colors: { primary: '#3b82f6', bg: '#1e293b', accent: '#10b981' },
    vocabulary: ['ROI', 'strategy', 'revenue', 'scaling', 'framework', 'metrics', 'pipeline', 'stakeholder'],
    hookStyles: ['authority', 'data', 'curiosity', 'story'],
  },
  shitpost: {
    name: 'Shitpost',
    icon: '💀',
    tone: 'Irreverent, degen, viral, unhinged',
    colors: { primary: '#ef4444', bg: '#000000', accent: '#facc15' },
    vocabulary: ['ser', 'anon', 'wen', 'rekt', 'cope', 'seethe', 'based', 'ngmi', 'probably nothing', 'this is fine'],
    hookStyles: ['controversial', 'degen', 'story', 'curiosity'],
  },
  educational: {
    name: 'Educational',
    icon: '📚',
    tone: 'Clear, structured, instructive',
    colors: { primary: '#8b5cf6', bg: '#1a1a2e', accent: '#06b6d4' },
    vocabulary: ['learn', 'understand', 'framework', 'step-by-step', 'beginner', 'explained', 'breakdown', 'concept'],
    hookStyles: ['curiosity', 'authority', 'data', 'story'],
  },
};

const USAGE_LIMITS = {
  free: { threads: 5, hooks: 10, images: 3, vault: 20 },
  pro: { threads: Infinity, hooks: Infinity, images: Infinity, vault: Infinity },
};

const HOOK_CATEGORIES = {
  authority: { label: '🏛️ Authority', color: 'tag-authority' },
  curiosity: { label: '🔍 Curiosity', color: 'tag-curiosity' },
  data: { label: '📊 Data-Driven', color: 'tag-data' },
  controversial: { label: '🔥 Controversial', color: 'tag-controversial' },
  story: { label: '📖 Story-Based', color: 'tag-story' },
  degen: { label: '💀 Degen', color: 'tag-degen' },
};

const IMAGE_TYPES = {
  intro: { label: 'Intro Cover', icon: '📰' },
  data: { label: 'Data Card', icon: '📊' },
  quote: { label: 'Quote Card', icon: '💬' },
  meme: { label: 'Meme Card', icon: '😂' },
};

const THREAD_LENGTHS = {
  short: { min: 3, max: 5 },
  medium: { min: 7, max: 10 },
  long: { min: 12, max: 18 },
};

const SHITPOST_FORMATS = [
  'Nobody:\nAbsolutely nobody:\nMe:',
  'POV:',
  'That feeling when',
  'Narrator:',
  'Breaking:',
  '*record scratch* *freeze frame*',
  'Roses are red,\nViolets are blue,',
  'Day 1 of',
  'Therapist:',
  'Babe wake up,',
];

const MEME_TEMPLATES = [
  'Virgin {bad} vs Chad {good}',
  'Me: *does {thing}*\nAlso me:',
  '{thing} speedrun any%',
  'Tell me you\'re a {type} without telling me you\'re a {type}',
];

const SEGMENT_TYPES = {
  hook: { label: '🎣 HOOK', color: 'tweet-type-hook' },
  context: { label: '📋 CONTEXT', color: 'tweet-type-context' },
  tension: { label: '⚡ TENSION', color: 'tweet-type-tension' },
  insight: { label: '💡 INSIGHT', color: 'tweet-type-insight' },
  proof: { label: '📊 PROOF', color: 'tweet-type-proof' },
  contrarian: { label: '🔥 CONTRARIAN', color: 'tweet-type-contrarian' },
  expansion: { label: '🔭 EXPANSION', color: 'tweet-type-expansion' },
  summary: { label: '📝 SUMMARY', color: 'tweet-type-summary' },
  cta: { label: '📣 CTA', color: 'tweet-type-cta' },
};

const CTA_CATEGORIES = {
  engagement: { label: '💬 Engagement', icon: '💬' },
  debate: { label: '⚔️ Debate', icon: '⚔️' },
  community: { label: '🤝 Community', icon: '🤝' },
  lead: { label: '🎯 Lead Gen', icon: '🎯' },
  follow: { label: '➡️ Follow', icon: '➡️' },
};

