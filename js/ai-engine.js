/* ═══════════════════════════════════════════════════════════════
   AUTHORITY ENGINE — AI Content Engine v2
   Advanced template-driven content generation with narrative
   architecture, mode-specific intelligence, article generation,
   voice replication, and multi-signal engagement scoring.
   ═══════════════════════════════════════════════════════════════ */

const AIEngine = (() => {

    /* ─── Utility ─── */
    const pick = arr => arr[Math.floor(Math.random() * arr.length)];
    const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);
    const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
    const weightedPick = (arr, weights) => {
        const total = weights.reduce((s, w) => s + w, 0);
        let r = Math.random() * total;
        for (let i = 0; i < arr.length; i++) { r -= weights[i]; if (r <= 0) return arr[i]; }
        return arr[arr.length - 1];
    };

    /* ═══════════════════════════════════════════════════════════
       HOOK TEMPLATES — 10+ per category × 6 categories = 60+
       ═══════════════════════════════════════════════════════════ */
    const HOOK_TEMPLATES = {
        authority: [
            `I've spent {time} studying {topic}.\n\nHere's what 99% of people still get wrong:`,
            `After {time} in the {topic} space, I've identified the #1 mistake everyone makes.\n\nIt's not what you think:`,
            `I've built {number} {things} in the last year.\n\nHere's everything I've learned about {topic}:`,
            `Most people will never understand {topic}.\n\nAfter {time} of research, here's the truth:`,
            `I've helped {number}+ {people} with {topic}.\n\nHere's the framework that works every time:`,
            `The top 1% of {people} all do this one thing differently.\n\nAfter studying {number}+ cases of {topic}:`,
            `I spent {time} interviewing the best minds in {topic}.\n\nThe one thing they all agree on will surprise you:`,
            `After {number} failures and {time} of iteration on {topic}—\n\nI finally cracked the code. Here's the full breakdown:`,
            `Nobody taught me {topic}. I learned it the hard way over {time}.\n\nSave yourself the mistakes. Read this:`,
            `{number}+ hours researching {topic} so you don't have to.\n\nThe definitive guide, in one thread:`,
            `I went from zero to expert in {topic} in {time}.\n\nHere's the exact roadmap I followed:`,
        ],
        curiosity: [
            `There's a hidden pattern in every successful {topic}.\n\nOnce you see it, you can't unsee it:`,
            `Nobody's talking about this, but {topic} is about to change everything.\n\nLet me explain:`,
            `I discovered something about {topic} that made me rethink everything.\n\nThis thread will do the same for you:`,
            `What if everything you know about {topic} is wrong?\n\nHere's what the data actually shows:`,
            `99% of people overlook this about {topic}.\n\nThe remaining 1% are printing money:`,
            `The biggest secret in {topic} is hiding in plain sight.\n\nHere it is:`,
            `Something strange is happening in {topic} right now.\n\nMost people won't notice until it's too late:`,
            `I just realized why most people fail at {topic}.\n\nIt has nothing to do with skill or intelligence:`,
            `There's a reason the smartest people in {topic} aren't sharing this publicly.\n\nI'm about to:`,
            `The next 12 months in {topic} will be unlike anything we've seen.\n\nHere's exactly what's coming:`,
            `Everyone is asking the wrong question about {topic}.\n\nThe right question changes everything:`,
        ],
        data: [
            `I analyzed {number}+ {things} to find the {topic} formula.\n\nHere are the numbers:`,
            `{percentage}% of {things} fail at {topic}.\n\nThe data shows exactly why — and how to fix it:`,
            `We tracked {number} {things} over {time}.\n\nThe results about {topic} will shock you:`,
            `The numbers don't lie.\n\n{topic} in {year}: a data breakdown 📊`,
            `I ran the numbers on {topic}.\n\n{number} data points. {time} of research.\n\nHere's what I found:`,
            `New data just dropped on {topic}.\n\n{number}+ {things} analyzed. {percentage}% showed the same pattern:`,
            `I built a spreadsheet tracking every major move in {topic}.\n\n{number} entries later, the trend is undeniable:`,
            `{percentage}% of {people} ignore this metric in {topic}.\n\nBut it's the one that predicts everything:`,
            `The correlation between {topic} success and this one variable is {percentage}%.\n\nHere's what the data reveals:`,
            `Quant breakdown:\n\n{number}+ {things}. {time} of data. One clear conclusion about {topic}:`,
        ],
        controversial: [
            `Unpopular opinion: {topic} is completely broken.\n\nHere's why nobody wants to admit it:`,
            `Everyone's celebrating {topic}.\n\nBut nobody's talking about the elephant in the room:`,
            `Hot take: {topic} is overrated.\n\nBefore you @ me, hear me out:`,
            `I'm about to make a lot of enemies with this thread about {topic}.\n\nBut someone needs to say it:`,
            `{topic} is a scam. There, I said it.\n\nHere's the proof:`,
            `Stop pretending {topic} is fine.\n\nIt's not. Here's what's really happening:`,
            `The uncomfortable truth about {topic} that your favorite influencer won't tell you:`,
            `I'm going to get cancelled for saying this about {topic}.\n\nBut I don't care. The truth matters more:`,
            `The {topic} narrative is built on a lie.\n\nI have receipts:`,
            `Everyone praising {topic} right now is going to look very foolish in 6 months.\n\nHere's why:`,
            `The emperor has no clothes.\n\n{topic} is not what they told you. A thread:`,
        ],
        story: [
            `Last {timeframe}, I {event}.\n\nIt completely changed how I think about {topic}.\n\nHere's the full story:`,
            `2 years ago, I had $0 and no clue about {topic}.\n\nToday, everything is different.\n\nHere's exactly what happened:`,
            `I almost quit {topic} last year.\n\nThen one conversation changed everything:`,
            `This is the story nobody knows about {topic}.\n\nI've been waiting to share it:`,
            `In {year}, I made the biggest mistake of my life with {topic}.\n\nHere's what I learned:`,
            `A stranger DM'd me about {topic} last {timeframe}.\n\nWhat they told me changed my entire strategy:`,
            `3 AM. Couldn't sleep. Opened my laptop.\n\nWhat I found about {topic} that night changed everything:`,
            `I was laughed at for believing in {topic}.\n\nFast forward to today — nobody's laughing anymore:`,
            `The day I almost lost everything because of {topic}.\n\nA thread I've never shared publicly:`,
            `From broke to breakthrough:\n\nHow {topic} transformed my entire life in {time}. 🧵`,
        ],
        degen: [
            `Anon, I found the next massive play in {topic}.\n\nNFA but read this thread:`,
            `gm to everyone who's been sleeping on {topic}.\n\nWake up. This is the alpha:`,
            `The {topic} meta just shifted.\n\nIf you're not paying attention, you're ngmi:`,
            `ser, {topic} is about to go parabolic.\n\nHere's why the smart money is already positioning:`,
            `Faded {topic}? You're about to regret it.\n\nLet me show you what's coming:`,
            `wagmi if you understand {topic}.\n\nngmi if you don't. Simple as.`,
            `Just found a {topic} alpha leak that nobody's talking about.\n\nAnon... you need to see this:`,
            `The {topic} chart is giving me 2021 vibes.\n\nIf you know, you know. Thread:`,
            `CT is sleeping on {topic}.\n\nWhen they wake up, the entry won't be this good.\n\nDeep dive:`,
            `ape in or cope later.\n\n{topic} thesis in 10 tweets. NFA:`,
        ],
    };

    /* ═══════════════════════════════════════════════════════════
       BODY SEGMENT TEMPLATES — 8 types for narrative arc
       ═══════════════════════════════════════════════════════════ */
    const BODY_TEMPLATES = {
        context: [
            `First, some context:\n\n{topic} isn't new. But the game has fundamentally changed.\n\nHere's what shifted:`,
            `To understand why this matters, you need the background:\n\n{modePoint}\n\nThis sets the stage for everything that follows.`,
            `Let me set the scene.\n\n{modePoint}\n\nMost people skip this. That's why they get it wrong.`,
            `Quick context before we dive in:\n\n{modePoint}\n\nKeep this in mind — it's the foundation.`,
            `Why now? Why does {topic} matter today?\n\n{modePoint}\n\nThe timing is everything.`,
        ],
        tension: [
            `Here's the thing most people miss:\n\n{modePoint}\n\nThis alone changes everything about how you should approach it.`,
            `Let's break this down:\n\n→ {bullet1}\n→ {bullet2}\n→ {bullet3}\n\nEach one compounds on the last.`,
            `Most people stop here. But the real insight goes deeper:\n\n{modePoint}`,
            `This is where it gets interesting.\n\n{modePoint}\n\nAnd it only gets wilder from here...`,
            `The problem nobody wants to address:\n\n{modePoint}\n\nUntil we fix this, nothing else matters.`,
            `Here's where 90% of {people} go wrong:\n\n{modePoint}\n\nThe top 10% do the exact opposite.`,
        ],
        insight: [
            `Here's where the magic happens:\n\n{modePoint}\n\nOnce you internalize this, your entire approach shifts.`,
            `The key insight that ties everything together:\n\n{modePoint}\n\nThis is what separates the top 1%.`,
            `Here's the part nobody tells you:\n\n{modePoint}\n\nNow you know what most people never will.`,
            `The non-obvious truth:\n\n{modePoint}\n\nRead that again. Let it sink in.`,
            `This is the insight that changed my entire perspective on {topic}:\n\n{modePoint}\n\nIt seems simple. It's anything but.`,
        ],
        proof: [
            `The proof is in the numbers:\n\n📊 {stat1}\n📈 {stat2}\n🎯 {stat3}\n\nThe trend is undeniable.`,
            `Don't take my word for it. Look at the data:\n\n{modePoint}\n\nThe evidence speaks for itself.`,
            `Here's a real example:\n\n{modePoint}\n\nThis isn't theory. This is what actually happened.`,
            `I tested this myself:\n\n→ Before: {before}\n→ After: {after}\n\nThe difference was night and day.`,
            `Case study:\n\n{modePoint}\n\nThe results speak louder than any theory ever could.`,
            `Receipts:\n\n📊 {stat1}\n📈 {stat2}\n🎯 {stat3}\n\nStill think this is just hype?`,
        ],
        contrarian: [
            `Now here's where I'll lose some of you.\n\nThe conventional wisdom on {topic} is dead wrong.\n\n{modePoint}`,
            `Controversial take:\n\n{modePoint}\n\nI know this goes against the narrative. But the data supports it.`,
            `Most experts won't say this, but:\n\n{modePoint}\n\nThe crowd is wrong. Again.`,
            `Here's the uncomfortable truth that nobody in {topic} wants to hear:\n\n{modePoint}\n\nDisagree? Show me your data.`,
            `I used to believe the opposite. Then I saw the evidence:\n\n{modePoint}\n\nSometimes the minority is right.`,
        ],
        expansion: [
            `Let's go deeper.\n\nThe second-order effects of this are massive:\n\n→ {bullet1}\n→ {bullet2}\n→ {bullet3}`,
            `But wait — there's more.\n\nThe implications extend far beyond {topic}:\n\n{modePoint}`,
            `Zooming out:\n\n{modePoint}\n\nThis is bigger than most people realize.`,
            `The ripple effects:\n\n{modePoint}\n\nWe're only seeing the beginning.`,
            `Here's what happens next:\n\n→ {bullet1}\n→ {bullet2}\n→ {bullet3}\n\nConnect the dots.`,
        ],
        summary: [
            `Let me tie it all together:\n\n{modePoint}\n\nThat's the full picture.`,
            `TL;DR for the impatient:\n\n→ {bullet1}\n→ {bullet2}\n→ {bullet3}\n\nNow you know more than 99%.`,
            `The bottom line:\n\n{modePoint}\n\nEverything else is noise.`,
            `To recap what matters:\n\n{modePoint}\n\nBookmark this. Come back to it.`,
        ],
        cta: [
            `If you found this valuable:\n\n♻️ Repost to help others discover this\n🔖 Bookmark for reference\n➡️ Follow me for more breakdowns`,
            `TL;DR:\n\n{summary}\n\nIf this resonated, repost it. Someone in your network needs to see this.`,
            `That's the full breakdown.\n\nRepost if you found value here.\nFollow for daily threads like this.\n\n🔖 Save this. You'll want to come back to it.`,
            `Found this useful?\n\n→ Repost to share with your audience\n→ Follow for more deep dives\n→ Drop a 🔥 if you want part 2`,
            `This took me {time} to research and write.\n\nIf it saved you even 5 minutes, a repost goes a long way.\n\nMore threads like this → follow me.`,
            `That's a wrap. 🧵\n\nIf you made it this far, two things:\n\n1. You're already ahead of 99%\n2. Hit follow — I drop threads like this daily`,
            `Agree? Disagree?\n\nDrop your take below. I read every reply.\n\n♻️ Repost if someone in your circle needs this.\n➡️ Follow for the next breakdown.`,
            `Want the full strategy, not just the thread?\n\nDM me "{topic}" and I'll send you the deep-dive.\n\nMeanwhile — repost this for others ♻️`,
        ],
    };

    /* ═══════════════════════════════════════════════════════════
       MODE-SPECIFIC CONTENT BANKS
       ═══════════════════════════════════════════════════════════ */
    const MODE_POINTS = {
        web3: [
            `On-chain data shows a {percentage}% spike in smart contract deployments. The builders never stopped — they just went quiet.`,
            `TVL is a vanity metric. The real signal? Active addresses and transaction volume. That's where the alpha hides.`,
            `The narrative cycle is predictable: accumulation → early alpha → CT picks it up → mainstream → exit liquidity. Know where you are.`,
            `Protocol revenue > token price. If the protocol makes money, the token will follow. Stop chasing pumps, start reading dashboards.`,
            `Every cycle, the same pattern: infrastructure gets built in the bear, applications explode in the bull. We're at the inflection point.`,
            `The teams shipping in silence right now will be the ones everyone's copying in 6 months. Watch the GitHub commits, not the tweets.`,
            `Tokenomics tell you the game theory. If you can't read a vesting schedule, you're the exit liquidity.`,
            `L2s aren't competing with each other. They're competing with TradFi. When fees hit $0.001, the floodgates open.`,
            `The smart money is watching wallet flows, not price charts. On-chain analytics separate the signal from the noise.`,
            `Composability is the moat that TradFi can't replicate. Permissionless money legos compound in ways nobody can predict.`,
        ],
        creator: [
            `Your first 1,000 followers don't come from going viral. They come from being consistent when nobody's watching.`,
            `The algorithm doesn't reward perfection. It rewards engagement. Write something people can't help but respond to.`,
            `Content is leverage. One thread that resonates can do more for your brand than 6 months of generic posting.`,
            `The creators winning right now aren't the most talented. They're the most consistent. Talent is common. Discipline is rare.`,
            `Your audience doesn't want polished content. They want authentic content. The imperfections are what make it human.`,
            `Distribution > creation. The best content in the world means nothing if nobody sees it. Master the algorithm first.`,
            `Niching down feels scary. But the narrower your focus, the stronger your signal. Generic content drowns in noise.`,
            `The fastest way to grow: find someone 10x your size and add value to their conversations. Borrowed audience is still audience.`,
            `Every piece of content should do one of three things: educate, entertain, or inspire. If it does two, it goes viral.`,
            `Stop optimizing for likes. Start optimizing for saves and shares. That's where real growth compounds.`,
        ],
        business: [
            `The ROI on thought leadership isn't measured in likes — it's measured in pipeline. Every thread is a top-of-funnel asset.`,
            `B2B buyers consume 13 pieces of content before making a purchase decision. The question is: are they consuming yours?`,
            `The companies winning on social have one thing in common: their executives are visible, opinionated, and consistent.`,
            `Frameworks scale. Opinions don't. Package your expertise into repeatable frameworks and watch your authority compound.`,
            `Revenue follows attention. If your competitors are more visible than you, they're winning deals you'll never even know about.`,
            `The most underrated metric in B2B: share of voice. Who's dominating the conversation in your category? It should be you.`,
            `Case studies are the most persuasive content format in B2B. Real results, real numbers, real companies. Everything else is theory.`,
            `The cost of NOT building a personal brand in {year}: lost deals, missed partnerships, and talent that chooses your competitor.`,
            `Data-backed content outperforms opinion-based content by 3.2x in B2B. Lead with numbers, follow with narrative.`,
            `Your content strategy should mirror your sales funnel: awareness → consideration → decision. Map every piece to a stage.`,
        ],
        shitpost: [
            `ser, the vibes are immaculate and the portfolio is in shambles. This is the way.`,
            `Imagine explaining your investment thesis to a financial advisor and it's just "the meme was funny"`,
            `Portfolio allocation: 40% hopium, 30% copium, 20% ramen budget, 10% actual research`,
            `Just told my therapist about my trading strategy and she started crying`,
            `"Do your own research" — me, buying a token because someone on CT used 🔥 emoji`,
            `The market giveth and the market taketh away. Mostly taketh.`,
            `My financial advisor asked me to diversify so I bought 15 different memecoins`,
            `Bullish indicator: when your uber driver asks about your bags, it's time to sell. Bearish indicator: when they already sold.`,
            `Day 247 of "this is the bottom." Narrator: it was not the bottom.`,
            `The charts are forming a pattern known in technical analysis as "I have no idea what I'm doing"`,
        ],
        educational: [
            `Let's start with the basics. {topic} is fundamentally about solving one problem: reducing friction between intent and outcome.`,
            `Think of {topic} like building with LEGO. Each concept snaps onto the last. Miss one, and the structure collapses.`,
            `The simplest way to understand {topic}: imagine you had to explain it to a 12-year-old. Strip away the jargon. What remains is truth.`,
            `There are 3 levels of understanding {topic}: beginner (you know what), intermediate (you know how), expert (you know why).`,
            `The #1 mistake beginners make with {topic}: trying to learn everything at once. Focus on one concept until it clicks.`,
            `Here's a mental model that makes {topic} 10x easier to understand: think of it as a game with rules, players, and incentives.`,
            `Most tutorials on {topic} teach you WHAT to do. I'm going to teach you WHY it works. Understanding principles > memorizing steps.`,
            `Step 1 of mastering {topic}: forget everything you think you know. Beginner's mind is your biggest advantage.`,
            `The best framework for learning {topic}: Input → Process → Output → Feedback → Iterate. That's it. Everything else is a variation.`,
            `Common misconception about {topic}: it's complicated. Reality: it's complex but learnable. There's a difference.`,
        ],
    };

    const MODE_BULLETS = {
        web3: [
            'Smart money is accumulating. On-chain data confirms it.',
            'Protocol revenue is up {percentage}% QoQ while price is flat.',
            'Developer activity hitting ATH on key infrastructure.',
            'Wallet creation rates accelerating across L2s.',
            'Institutional capital flowing in through regulated on-ramps.',
            'Cross-chain bridges processing record volume.',
            'DeFi TVL recovering faster than previous cycles.',
        ],
        creator: [
            'Consistency compounds. 90 days of daily posting changes everything.',
            'The best hooks share one trait: they create a curiosity gap.',
            'Repurposing > creating from scratch. One idea, 10 formats.',
            'Engagement rate matters more than follower count.',
            'Newsletter subscribers convert 40x better than social followers.',
            'Collaborations accelerate growth faster than any algorithm hack.',
            'Your voice is your unfair advantage. Nobody can replicate authenticity.',
        ],
        business: [
            'Companies with executive thought leadership close 38% faster.',
            'Content-led growth reduces CAC by 62% on average.',
            'B2B social selling generates 5x more pipeline than cold outreach.',
            'Thought leadership content increases pricing power by 27%.',
            'Data-driven threads get 3.2x more saves than opinion threads.',
            'LinkedIn + X combo outperforms any single-channel strategy.',
            'Consistent posting for 6 months increases inbound leads by 182%.',
        ],
        shitpost: [
            'My portfolio looking like a Jackson Pollock painting rn',
            'wen lambo → wen break even → wen ramen',
            'bullish on copium, it\'s the only asset that never runs out',
            '"I\'m in it for the tech" 🤡',
            'This is gentlemen. (it is not gentlemen.)',
            'Zoom out. *zooms out* oh no that\'s worse.',
            'TA stands for "Totally Arbitrary" and you can\'t convince me otherwise',
        ],
        educational: [
            'Start with WHY before diving into HOW.',
            'Use analogies to anchor new concepts to familiar ones.',
            'Break complex topics into 3–5 digestible sub-concepts.',
            'Provide examples for every abstract principle.',
            'Test understanding by explaining it back in your own words.',
            'Spaced repetition beats cramming every single time.',
            'Real mastery = ability to teach it to someone else.',
        ],
    };

    /* ═══════════════════════════════════════════════════════════
       SHORT TWEET TEMPLATES — 20+
       ═══════════════════════════════════════════════════════════ */
    const SHORT_TWEET_TEMPLATES = [
        `The biggest mistake in {topic}: trying to {mistake}.\n\nDo {solution} instead.`,
        `{topic} in {year}:\n\n→ {bullet1}\n→ {bullet2}\n→ {bullet3}\n\nThe future is already here.`,
        `Hot take: If you're not investing in {topic}, you're falling behind.\n\nHere's why:`,
        `One sentence that changed how I think about {topic}:\n\n"{insight}"`,
        `{topic} cheat code: {tip}\n\nYou're welcome.`,
        `The {topic} playbook is simple:\n\n1. {step1}\n2. {step2}\n3. {step3}\n\nStop overcomplicating it.`,
        `Why {topic} matters more than ever:\n\nBecause {reason}.\n\nAnd it's only getting started.`,
        `If I could only give one piece of advice about {topic}:\n\n{advice}\n\nThat's it. That's the tweet.`,
        `The gap between those who understand {topic} and those who don't is growing exponentially.\n\nWhich side are you on?`,
        `{topic} truth bomb:\n\n{insight}\n\nSave this tweet.`,
        `Everyone wants to talk about {topic}.\n\nNobody wants to put in the work.\n\nThat's your edge.`,
        `Underrated {topic} strategy:\n\n{tip}\n\nBookmark this. Thank me later.`,
        `The next 90 days will define who wins and who loses in {topic}.\n\nAre you positioned?`,
        `{topic} simplified:\n\n1. {step1}\n2. {step2}\n3. {step3}\n\nComplexity is the enemy of execution.`,
        `Most people treat {topic} like a sprint.\n\nThe winners treat it like a marathon.\n\nPlay long-term games.`,
        `{percentage}% of people will scroll past this.\n\nThe {topic}-literate ones will bookmark it.`,
        `Stop asking "is {topic} dead?"\n\nStart asking "what's being built while everyone's distracted?"`,
        `Harsh truth about {topic}:\n\n{insight}\n\nNot what you wanted to hear. But what you needed to.`,
        `2 types of people in {topic}:\n\n1. Those who wait for permission\n2. Those who just build\n\nBe #2.`,
        `My {topic} stack for {year}:\n\n→ {step1}\n→ {step2}\n→ {step3}\n\nSimple. Effective. Compounding.`,
    ];

    /* ═══════════════════════════════════════════════════════════
       SHITPOST FORMATS — 24+
       ═══════════════════════════════════════════════════════════ */
    const ADVANCED_SHITPOST_FORMATS = [
        'Nobody:\nAbsolutely nobody:\nMe:', 'POV:', 'That feeling when',
        'Narrator:', 'Breaking:', '*record scratch* *freeze frame*',
        'Roses are red,\nViolets are blue,', 'Day 1 of', 'Therapist:',
        'Babe wake up,', 'Me vs the guy she told me not to worry about:',
        'How it started → How it\'s going:', 'Plot twist:', 'Interviewer:',
        'My portfolio:\nMy financial advisor:', 'Main character moment:',
        'Real ones know:', '"Don\'t worry, it\'s a stablecoin"',
        'Expectation vs Reality:', '5 stages of grief, {topic} edition:',
        'If {topic} was a text message:', 'Google search history:',
        '{topic} alignment chart:', 'The four horsemen of {topic}:',
        'Tell me you\'re a {type} without telling me you\'re a {type}:',
    ];

    const SHITPOST_BODIES = [
        `Me explaining {topic} to my family at dinner 💀`,
        `{topic} really said "trust me bro" and we all believed it`,
        `Imagine explaining {topic} to someone from 2019. They'd call the cops.`,
        `How it started vs how it's going with {topic}`,
        `{topic} is either going to make us rich or give us great stories for therapy`,
        `"I'm in it for the tech" — me, crying, looking at {topic}`,
        `The {topic} doesn't care about your feelings.\n\nAnd neither does mine.`,
        `wen {topic}? Best I can do is more volatility.`,
        `Therapist: {topic} can't hurt you.\n{topic}:`,
        `{topic} speedrun any% 💀 new world record`,
        `Me: I'll be responsible with {topic}\nAlso me: *apes entire portfolio*`,
        `Breaking: local man discovers {topic}, becomes insufferable at parties`,
        `The {topic} experience™:\n1. Excitement\n2. Confusion\n3. Denial\n4. Acceptance\n5. "I'm never doing this again"\n6. *does it again*`,
        `{topic} said 📈 then said 📉 then said 📈 and honestly same`,
        `My risk tolerance vs my net worth after {topic}: 📐↗️ vs 📐↘️`,
    ];

    /* ═══════════════════════════════════════════════════════════
       NARRATIVE ARC — segment ordering per length
       ═══════════════════════════════════════════════════════════ */
    const NARRATIVE_ARCS = {
        short: ['hook', 'insight', 'proof', 'cta'],
        medium: ['hook', 'context', 'tension', 'insight', 'proof', 'contrarian', 'expansion', 'cta'],
        long: ['hook', 'context', 'tension', 'insight', 'proof', 'contrarian', 'expansion', 'tension', 'insight', 'proof', 'summary', 'cta'],
    };

    /* ═══════════════════════════════════════════════════════════
       GENERATE THREAD
       ═══════════════════════════════════════════════════════════ */
    function generateThread(topic, context, length, tone, mode) {
        const modeConfig = MODES[mode] || MODES.web3;
        const len = THREAD_LENGTHS[length] || THREAD_LENGTHS.medium;
        const tweetCount = randInt(len.min, len.max);
        const thread = [];
        const categories = modeConfig.hookStyles;

        let arc = [...(NARRATIVE_ARCS[length] || NARRATIVE_ARCS.medium)];
        while (arc.length < tweetCount) {
            arc.splice(arc.length - 1, 0, pick(['insight', 'proof', 'tension', 'expansion']));
        }
        arc = arc.slice(0, tweetCount);
        arc[0] = 'hook';
        arc[arc.length - 1] = 'cta';

        for (let i = 0; i < arc.length; i++) {
            const segType = arc[i];
            let text;
            if (segType === 'hook') {
                const hookCat = pick(categories);
                text = fillTemplate(pick(HOOK_TEMPLATES[hookCat] || HOOK_TEMPLATES.curiosity), topic, mode, modeConfig);
            } else {
                text = fillTemplate(pick(BODY_TEMPLATES[segType] || BODY_TEMPLATES.tension), topic, mode, modeConfig);
            }
            thread.push({ position: i + 1, type: segType, text });
        }

        const hookVariations = [];
        const usedCats = shuffle(Object.keys(HOOK_TEMPLATES)).slice(0, randInt(5, 10));
        for (const cat of usedCats) {
            const tmpl = pick(HOOK_TEMPLATES[cat]);
            const text = fillTemplate(tmpl, topic, mode, modeConfig);
            hookVariations.push({ category: cat, text, score: scoreHook(text) });
        }
        hookVariations.sort((a, b) => b.score - a.score);

        const shortTweets = shuffle(SHORT_TWEET_TEMPLATES).slice(0, 5).map(t =>
            fillTemplate(t, topic, mode, modeConfig)
        );
        const alternateCTAs = generateAlternateCTAs(topic, mode);
        const engagementScore = computeScore(thread, mode);

        return { thread, hookVariations, shortTweets, alternateCTAs, engagementScore };
    }

    /* ═══════════════════════════════════════════════════════════
       GENERATE HOOKS — 60+ with per-hook scoring
       ═══════════════════════════════════════════════════════════ */
    function generateHooks(topic, mode) {
        const modeConfig = MODES[mode] || MODES.web3;
        const hooks = [];
        for (const cat of Object.keys(HOOK_TEMPLATES)) {
            const templates = HOOK_TEMPLATES[cat];
            const count = cat === 'degen' && mode !== 'web3' && mode !== 'shitpost' ? 2 : randInt(5, 8);
            shuffle(templates).slice(0, count).forEach(tmpl => {
                const text = fillTemplate(tmpl, topic, mode, modeConfig);
                hooks.push({ category: cat, text, score: scoreHook(text) });
            });
        }
        return shuffle(hooks);
    }

    /* ═══════════════════════════════════════════════════════════
       GENERATE ARTICLE
       ═══════════════════════════════════════════════════════════ */
    function generateArticle(topic, context, mode) {
        const modeConfig = MODES[mode] || MODES.web3;
        const mPoints = MODE_POINTS[mode] || MODE_POINTS.web3;
        const mBullets = MODE_BULLETS[mode] || MODE_BULLETS.web3;

        const title = pick([
            `The Complete Guide to ${topic}: What Nobody's Telling You`,
            `${topic} in ${pick(['2025', '2026'])}: A Deep Dive`,
            `Why ${topic} Matters More Than Ever`,
            `The ${topic} Playbook: From Theory to Execution`,
            `Demystifying ${topic}: An Evidence-Based Breakdown`,
        ]);

        const intro = `${pick(mPoints)}\n\nIn this article, we break down everything you need to know about ${topic} — from fundamentals to advanced strategies. Whether you're just getting started or sharpening your edge, this covers the full picture.\n\n${pick(mPoints)}`;

        const sectionTitles = shuffle([
            `The Current State of ${topic}`,
            `Why ${topic} Is at an Inflection Point`,
            `The Framework for Understanding ${topic}`,
            `Common Mistakes and How to Avoid Them`,
            `The Data Behind ${topic}`,
            `What the Experts Are Saying`,
            `Actionable Steps You Can Take Today`,
            `The Contrarian View`,
            `Second-Order Effects Nobody's Discussing`,
        ]).slice(0, randInt(3, 5));

        const sections = sectionTitles.map(sTitle => ({
            title: sTitle,
            body: `${pick(mPoints)}\n\n${pick(mPoints)}\n\nKey takeaways:\n\n→ ${pick(mBullets)}\n→ ${pick(mBullets)}\n→ ${pick(mBullets)}\n\n${pick(mPoints)}`,
        }));

        const conclusion = `${topic} isn't going away. The question is whether you'll be positioned to take advantage of what's coming.\n\n${pick(mPoints)}\n\nThe winners will be the ones who combine deep understanding with consistent execution. Start today.`;

        const excerpts = shuffle(SHORT_TWEET_TEMPLATES).slice(0, 5).map(t =>
            fillTemplate(t, topic, mode, modeConfig)
        );

        return { title, intro, sections, conclusion, excerpts };
    }

    /* ═══════════════════════════════════════════════════════════
       GENERATE SHITPOSTS
       ═══════════════════════════════════════════════════════════ */
    function generateShitposts(topic, mood, degenLevel) {
        const posts = [];
        const count = randInt(8, 14);
        const moodPx = {
            bullish: ['We\'re all gonna make it.', 'Number only goes up.', 'LFG 🚀', 'The vibes have never been better.'],
            bearish: ['Pain.', 'This is fine. 🔥', 'We deserve this.', 'My portfolio rn: 📉💀', 'HODL they said.'],
            crabbing: ['Day 47 of nothing happening.', '*checks portfolio* *closes app*', 'Even the charts fell asleep.'],
            chaos: ['WHAT IS HAPPENING', 'SER WHAT', 'THIS TIMELINE THO', 'EVERYBODY STAY CALM'],
        };
        const moodSx = {
            bullish: ['🚀', 'WAGMI', 'bullish af'], bearish: ['💀', 'F in chat', '🪦'],
            crabbing: ['😐', 'zzzz'], chaos: ['🔥🔥🔥', '😱', 'AAAAAAA'],
        };

        for (let i = 0; i < count; i++) {
            const format = pick(ADVANCED_SHITPOST_FORMATS);
            const body = pick(SHITPOST_BODIES).replaceAll('{topic}', topic || 'the market');
            const prefix = pick(moodPx[mood] || moodPx.chaos);
            const suffix = pick(moodSx[mood] || moodSx.chaos);
            let text = degenLevel >= 4 ? `${format}\n\n${body}\n\n${prefix}\n\n${suffix}`
                : degenLevel >= 2 ? `${format} ${body}\n\n${prefix}` : `${format} ${body}`;
            posts.push({
                format: format.split('\n')[0], text: text.trim().replaceAll('{type}', pick(['degen', 'builder', 'founder'])),
                degenLevel, score: randInt(40, 95),
            });
        }
        return posts.sort((a, b) => b.score - a.score);
    }

    /* ═══════════════════════════════════════════════════════════
       ANALYZE VOICE — advanced profile extraction
       ═══════════════════════════════════════════════════════════ */
    function analyzeVoice(tweets) {
        const lines = tweets.split('\n').filter(l => l.trim().length > 0);
        if (lines.length < 3) return null;

        const allText = lines.join(' ');
        const lowerText = allText.toLowerCase();
        const avgLen = lines.reduce((s, l) => s + l.length, 0) / lines.length;

        const emojiMatches = allText.match(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu) || [];
        const emojiFreq = emojiMatches.length / lines.length;
        const exclamations = (allText.match(/!/g) || []).length;
        const questions = (allText.match(/\?/g) || []).length;
        const ellipsis = (allText.match(/\.\.\./g) || []).length;
        const emDashes = (allText.match(/[—–]/g) || []).length;
        const allCapsWords = (allText.match(/\b[A-Z]{3,}\b/g) || []).length;

        // N-gram extraction
        const words = lowerText.split(/\s+/).filter(w => w.length > 2);
        const bigrams = {};
        for (let i = 0; i < words.length - 1; i++) {
            const bg = `${words[i]} ${words[i + 1]}`;
            bigrams[bg] = (bigrams[bg] || 0) + 1;
        }
        const topBigrams = Object.entries(bigrams).filter(([, c]) => c >= 2)
            .sort((a, b) => b[1] - a[1]).slice(0, 5).map(([p]) => p);

        // Word frequency fingerprint
        const stops = new Set(['the', 'a', 'an', 'is', 'are', 'was', 'in', 'on', 'to', 'for', 'of', 'and', 'or', 'but', 'not', 'this', 'that', 'it', 'with', 'you', 'my']);
        const wf = {};
        words.forEach(w => { if (!stops.has(w)) wf[w] = (wf[w] || 0) + 1; });
        const topWords = Object.entries(wf).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([w]) => w);

        const profile = {
            toneMarkers: [],
            sentenceRhythm: avgLen < 50 ? 'short-punchy' : avgLen < 90 ? 'snappy' : avgLen < 140 ? 'balanced' : 'long-form',
            aggressionLevel: clamp(Math.round(exclamations / lines.length * 4 + allCapsWords * 0.5 + 2), 1, 10),
            emojiUsage: emojiFreq > 1 ? 'heavy' : emojiFreq > 0.3 ? 'moderate' : emojiFreq > 0 ? 'light' : 'none',
            topEmojis: [...new Set(emojiMatches)].slice(0, 5),
            punctuationStyle: {
                exclamationRate: +(exclamations / lines.length).toFixed(2),
                questionRate: +(questions / lines.length).toFixed(2),
                usesEllipsis: ellipsis > 1,
                usesEmDash: emDashes > 0,
            },
            capitalizationStyle: allCapsWords > lines.length * 0.5 ? 'CAPS_HEAVY' : allCapsWords > 2 ? 'occasional-caps' : 'standard',
            vocabularyFingerprint: topWords,
            signaturePhrases: topBigrams.length > 0 ? topBigrams : lines.filter(l => l.length < 50 && l.length > 10).slice(0, 3),
            avgTweetLength: Math.round(avgLen),
        };

        if (lowerText.includes('honestly') || lowerText.includes('truth')) profile.toneMarkers.push('candid');
        if (lowerText.includes('data') || lowerText.includes('research') || lowerText.includes('%')) profile.toneMarkers.push('analytical');
        if (exclamations > 3 || allCapsWords > 3) profile.toneMarkers.push('energetic');
        if (lowerText.includes('story') || lowerText.includes('journey')) profile.toneMarkers.push('narrative');
        if (lowerText.includes('learn') || lowerText.includes('tip') || lowerText.includes('how to')) profile.toneMarkers.push('educational');
        if (lowerText.includes('lol') || lowerText.includes('lmao') || lowerText.includes('💀')) profile.toneMarkers.push('humorous');
        if (lowerText.includes('ser') || lowerText.includes('anon') || lowerText.includes('wagmi')) profile.toneMarkers.push('ct-native');
        if (profile.toneMarkers.length === 0) profile.toneMarkers.push('casual', 'conversational');

        const vocabWords = ['bullish', 'alpha', 'degen', 'based', 'growth', 'scale', 'strategy', 'build', 'ship', 'learn', 'revenue', 'framework'];
        for (const w of vocabWords) { if (lowerText.includes(w)) profile.vocabularyFingerprint.push(w); }
        profile.vocabularyFingerprint = [...new Set(profile.vocabularyFingerprint)].slice(0, 12);

        function guessMode(p) {
            const m = p.toneMarkers.join(' ') + ' ' + p.vocabularyFingerprint.join(' ');
            if (/degen|alpha|ser|anon|wagmi|bullish/.test(m)) return 'web3';
            if (/humorous|lol|💀/.test(m)) return 'shitpost';
            if (/revenue|roi|pipeline/.test(m)) return 'business';
            if (/learn|step|framework|beginner/.test(m)) return 'educational';
            return 'creator';
        }

        const sampleThread = generateThread('your niche', '', 'short', 'auto', guessMode(profile));
        return { profile, sampleThread };
    }

    /* ═══════════════════════════════════════════════════════════
       ALTERNATE CTAs
       ═══════════════════════════════════════════════════════════ */
    function generateAlternateCTAs(topic, mode) {
        const bank = {
            engagement: [
                `What's your take on ${topic}? Drop it below 👇\n\nBest reply gets a repost.`,
                `Agree or disagree? Quote this with your perspective on ${topic}.`,
            ],
            debate: [
                `I might be wrong about ${topic}. Change my mind.\n\nBest counter-argument gets pinned.`,
                `${topic} — bullish or bearish? Pick a side and defend it.`,
            ],
            community: [
                `Who else is deep in the ${topic} rabbit hole?\n\nFollow + repost = I follow back everyone interested.`,
                `Building a thread series on ${topic}.\n\nRepost if you want part 2.`,
            ],
            lead: [
                `I wrote a full breakdown on ${topic} (10x deeper than this thread).\n\nDM me "ALPHA" and I'll send it.`,
                `Want the complete ${topic} playbook?\n\nRepost + follow, DM me for the extended guide.`,
            ],
            follow: [
                `I share threads like this about ${topic} every week.\n\n→ Follow to never miss one\n♻️ Repost to help your network`,
                `This is 1 of 7 threads I'm dropping this week on ${topic}.\n\nFollow for the rest. 🔖 Bookmark this one.`,
            ],
        };
        return Object.entries(bank).map(([category, templates]) => ({
            category, text: pick(templates),
        }));
    }

    /* ═══════════════════════════════════════════════════════════
       TEMPLATE FILL ENGINE
       ═══════════════════════════════════════════════════════════ */
    function fillTemplate(template, topic, mode, modeConfig) {
        const mc = modeConfig || MODES[mode] || MODES.web3;
        const mPoints = MODE_POINTS[mode] || MODE_POINTS.web3;
        const mBullets = MODE_BULLETS[mode] || MODE_BULLETS.web3;

        const r = {
            '{topic}': topic || 'this space',
            '{time}': pick(['6 months', '1 year', '2 years', '3 years', '5 years', '10,000 hours']),
            '{number}': pick(['50', '100', '200', '500', '1,000', '10,000']),
            '{things}': pick(['examples', 'case studies', 'data points', 'projects', 'accounts', 'threads']),
            '{people}': pick(['founders', 'creators', 'builders', 'professionals', 'people']),
            '{percentage}': pick(['73', '82', '87', '91', '95']),
            '{year}': pick(['2024', '2025', '2026']),
            '{timeframe}': pick(['month', 'week', 'quarter', 'year']),
            '{event}': pick(['lost everything', 'had a breakthrough', 'made a critical discovery', 'changed my entire strategy']),
            '{modePoint}': pick(mPoints).replaceAll('{topic}', topic || 'this space').replaceAll('{percentage}', pick(['73', '82', '91'])),
            '{bullet1}': pick(mBullets).replaceAll('{percentage}', pick(['73', '82', '91'])),
            '{bullet2}': pick(mBullets).replaceAll('{percentage}', pick(['64', '78', '88'])),
            '{bullet3}': pick(mBullets).replaceAll('{percentage}', pick(['55', '69', '93'])),
            '{stat1}': genStat(topic), '{stat2}': genStat(topic), '{stat3}': genStat(topic),
            '{before}': pick(['struggling', 'losing money', 'stuck at 0', 'invisible']),
            '{after}': pick(['thriving', 'profitable', '10x growth', 'industry leader']),
            '{summary}': `Master ${topic || 'this'} by focusing on fundamentals, data, and consistency.`,
            '{mistake}': pick(['do everything at once', 'follow the crowd', 'skip fundamentals', 'chase trends']),
            '{solution}': pick(['focus on one thing', 'build in public', 'master the basics', 'think long-term']),
            '{insight}': pick([`The best approach to ${topic || 'success'} is the one nobody's willing to try.`, `The winners in ${topic || 'every field'} started before they felt ready.`]),
            '{tip}': pick(['Start before you\'re ready', 'Consistency beats talent', 'Simple scales, complex fails']),
            '{step1}': pick(['Study the top performers', 'Identify the gap', 'Build your foundation']),
            '{step2}': pick(['Execute relentlessly', 'Iterate on feedback', 'Double down on what works']),
            '{step3}': pick(['Scale what works', 'Teach others', 'Never stop learning']),
            '{advice}': pick(['Start today', 'Be consistent', 'Focus on value', 'Think long-term']),
            '{reason}': pick(['the market is shifting', 'early movers win', 'the data proves it', 'the opportunity is NOW']),
            '{type}': pick(['degen', 'builder', 'founder', 'creator']),
            '{thing}': pick(['buying the dip', 'checking charts', 'posting threads', 'shipping features']),
            '{bad}': pick(['paper hands', 'lurker', 'follower']),
            '{good}': pick(['diamond hands', 'builder', 'thought leader']),
        };

        let result = template;
        for (const [key, val] of Object.entries(r)) { result = result.replaceAll(key, val); }
        return result;
    }

    function genStat(topic) {
        return pick([
            `${pick(['73', '82', '87', '91'])}% growth in ${topic || 'engagement'} YoY`,
            `${pick(['2.4', '3.7', '5.1', '8.2'])}x increase in ${pick(['adoption', 'usage', 'ROI'])}`,
            `Top performers spend ${pick(['3x', '5x', '10x'])} more time on ${topic || 'fundamentals'}`,
            `Only ${pick(['3', '5', '7'])}% of ${pick(['people', 'teams', 'projects'])} achieve this`,
            `${pick(['$2.1B', '$5.7B', '$14.3B'])} deployed into ${topic || 'this category'} in ${pick(['2024', '2025'])}`,
        ]);
    }

    /* ═══════════════════════════════════════════════════════════
       ENGAGEMENT SCORING
       ═══════════════════════════════════════════════════════════ */
    function scoreHook(text) {
        let s = 50;
        if (text.includes('\n')) s += 6;
        if (text.length < 200) s += 5;
        if (text.length < 140) s += 3;
        if (text.includes('?') || text.includes('!')) s += 4;
        if (/\d/.test(text)) s += 5;
        if (text.includes('%')) s += 3;
        if (/99%|#1|top 1%/i.test(text)) s += 4;
        if (/secret|hidden|nobody|never|truth/i.test(text)) s += 5;
        if (text.includes(':')) s += 2;
        s += randInt(-3, 5);
        return clamp(s, 30, 98);
    }

    function computeScore(thread, mode) {
        let s = 45;
        if (thread.length >= 1) s += scoreHook(thread[0].text) * 0.3;
        const types = new Set(thread.map(t => t.type));
        s += Math.min(types.size * 2.5, 15);
        if (thread.length >= 5) s += 4;
        if (thread.length >= 8) s += 3;
        if (thread[thread.length - 1]?.type === 'cta') s += 5;
        if (thread.some(t => t.type === 'context')) s += 3;
        if (thread.some(t => t.type === 'proof')) s += 4;
        if (thread.some(t => t.type === 'contrarian')) s += 3;
        if (thread.some(t => t.type === 'insight')) s += 3;
        s -= thread.filter(t => t.text.length > 280).length * 3;
        s += randInt(-3, 5);
        return clamp(Math.round(s), 30, 98);
    }

    /* ═══════════════════════════════════════════════════════════
       PUBLIC API
       ═══════════════════════════════════════════════════════════ */
    return {
        generateThread,
        generateHooks,
        generateArticle,
        generateShitposts,
        analyzeVoice,
        generateAlternateCTAs,
        computeScore,
        scoreHook,
    };
})();
