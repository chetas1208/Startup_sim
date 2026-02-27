export const mockData = {
  query: "An AI-powered voice tutor for kids aged 6 to 12",
  status: "complete",

  competitors: [
    {
      id: "ello",
      name: "Ello",
      website: "ello.com",
      description: "AI-powered reading companion that listens to children read aloud, gently corrects mistakes, and adapts to their reading level in real-time.",
      founded: "2020",
      hq: "San Francisco, CA",
      employees: 85,
      funding_total: "$40M",
      pricing: "$14.99/mo per child",
      classification: "direct_competitor",
      features: ["Voice-based reading", "Real-time pronunciation feedback", "Adaptive difficulty", "Parent dashboard", "Curated book library"],
      technologies: ["Whisper ASR", "Custom NLP", "React Native", "AWS"],
      strengths: ["Purpose-built for kids", "Strong voice recognition for children", "Excellent UX for young learners", "Growing brand awareness"],
      weaknesses: ["Reading-only, no conversational tutoring", "English only", "Limited to reading vs. broader voice interaction", "Premium pricing"],
      people: [
        { name: "Elizabeth Adams", role: "CEO & Co-founder" },
        { name: "Tom Sayer", role: "CTO & Co-founder" },
        { name: "Catalin Voss", role: "Co-founder" }
      ],
      funding_rounds: [
        { round: "Seed", amount: "$4M", date: "2020", investors: ["Y Combinator", "Homebrew"] },
        { round: "Series A", amount: "$15M", date: "2022", investors: ["Goodwater Capital", "Homebrew"] },
        { round: "Series B", amount: "$21M", date: "2024", investors: ["Goodwater Capital", "Reach Capital"] }
      ],
      videos: [
        { title: "Ello: How AI Teaches Kids to Read", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", source: "YouTube", duration: "3:42", date: "2024-03", thumbnail_id: "dQw4w9WgXcQ" },
        { title: "Ello CEO on the Future of EdTech", url: "https://www.youtube.com/watch?v=jNQXAC9IVRw", source: "YouTube", duration: "12:08", date: "2024-01", thumbnail_id: "jNQXAC9IVRw" }
      ]
    },
    {
      id: "speak",
      name: "Speak",
      website: "speak.com",
      description: "AI-powered language learning app focused on speaking practice with advanced voice AI that enables realistic conversations.",
      founded: "2016",
      hq: "San Francisco, CA",
      employees: 200,
      funding_total: "$78M",
      pricing: "$12.99/mo, $99.99/yr",
      classification: "direct_competitor",
      features: ["AI conversation partner", "Speech recognition", "Pronunciation scoring", "Curriculum-based lessons", "Multiple languages"],
      technologies: ["GPT-4", "Custom ASR", "React Native", "GCP"],
      strengths: ["Best-in-class voice AI", "Strong traction in South Korea", "OpenAI partnership", "Deep speech technology expertise"],
      weaknesses: ["Adult-focused, no kids mode", "Limited markets (primarily Asia)", "No gamification for young learners", "Conversation-heavy UX not suitable for children"],
      people: [
        { name: "Connor Zwick", role: "CEO & Founder" },
        { name: "Andrew Hsu", role: "CTO" }
      ],
      funding_rounds: [
        { round: "Seed", amount: "$6M", date: "2017", investors: ["Y Combinator", "Founders Fund"] },
        { round: "Series A", amount: "$16M", date: "2020", investors: ["Founders Fund", "Khosla Ventures"] },
        { round: "Series B", amount: "$27M", date: "2022", investors: ["OpenAI Startup Fund", "Khosla Ventures"] },
        { round: "Series B+", amount: "$29M", date: "2023", investors: ["Buckley Ventures", "Lachy Groom"] }
      ],
      videos: [
        { title: "Speak App — Practice Languages with AI", url: "https://www.youtube.com/watch?v=L_jWHffIx5E", source: "YouTube", duration: "2:15", date: "2024-05", thumbnail_id: "L_jWHffIx5E" },
        { title: "How Speak Uses GPT-4 for Language Learning", url: "https://www.youtube.com/watch?v=aircAruvnKk", source: "YouTube", duration: "18:22", date: "2023-11", thumbnail_id: "aircAruvnKk" },
        { title: "Connor Zwick: Building the Future of Language AI", url: "https://www.youtube.com/watch?v=zjkBMFhNj_g", source: "YouTube", duration: "45:10", date: "2024-02", thumbnail_id: "zjkBMFhNj_g" }
      ]
    },
    {
      id: "speakbuddy",
      name: "SpeakBuddy",
      website: "speakbuddy.me",
      description: "AI English conversation partner app that helps users practice speaking English through voice-based dialogues with AI characters.",
      founded: "2016",
      hq: "Tokyo, Japan",
      employees: 60,
      funding_total: "$18M",
      pricing: "$12.99/mo",
      classification: "direct_competitor",
      features: ["AI conversation partner", "Voice recognition", "Scenario-based practice", "Progress tracking", "Multiple AI personas"],
      technologies: ["GPT-4", "Azure Speech Services", "Flutter", "Azure"],
      strengths: ["Established in Japan market", "Good voice interaction UX", "Character-driven engagement", "Enterprise partnerships"],
      weaknesses: ["Not designed for children", "Limited to English learning", "Small team vs. competitors", "Narrow geographic focus"],
      people: [
        { name: "Rui Hirokawa", role: "CEO & Founder" }
      ],
      funding_rounds: [
        { round: "Series A", amount: "$7M", date: "2019", investors: ["SBI Investment", "JAFCO"] },
        { round: "Series B", amount: "$11M", date: "2022", investors: ["SBI Investment", "Mitsubishi UFJ Capital"] }
      ],
      videos: [
        { title: "SpeakBuddy AI English Practice Demo", url: "https://www.youtube.com/watch?v=SpeakBuddy1", source: "YouTube", duration: "1:58", date: "2024-04", thumbnail_id: "hY7m5jjJ9mM" }
      ]
    },
    {
      id: "novakid",
      name: "Novakid",
      website: "novakidschool.com",
      description: "Online English school for children aged 4-12, offering live tutoring sessions with native speakers augmented by gamified curriculum.",
      founded: "2017",
      hq: "San Francisco, CA",
      employees: 350,
      funding_total: "$50M",
      pricing: "$8.50–$17/session",
      classification: "direct_competitor",
      features: ["Live 1-on-1 tutoring", "Gamified lessons", "Native speaker teachers", "AR-based activities", "Progress reports"],
      technologies: ["WebRTC", "React", "AWS", "Custom ML models"],
      strengths: ["Purpose-built for kids", "Strong European presence", "Proven engagement model", "Experienced teaching staff"],
      weaknesses: ["Relies on human tutors (not AI-first)", "High per-session cost", "Scaling limited by teacher supply", "No asynchronous learning mode"],
      people: [
        { name: "Max Azarov", role: "CEO & Co-founder" },
        { name: "Dmitry Malin", role: "CPO & Co-founder" }
      ],
      funding_rounds: [
        { round: "Series A", amount: "$4.25M", date: "2020", investors: ["LearnStart", "BonAngels"] },
        { round: "Series B", amount: "$35M", date: "2021", investors: ["Owl Ventures", "Goodwater Capital"] },
        { round: "Series C", amount: "$10M", date: "2023", investors: ["Owl Ventures", "Conor Venture Partners"] }
      ],
      videos: [
        { title: "Novakid: How Kids Learn English Online", url: "https://www.youtube.com/watch?v=Novakid1", source: "YouTube", duration: "2:30", date: "2024-06", thumbnail_id: "ScMzIvxBSi4" },
        { title: "Novakid AR Classroom Experience", url: "https://www.youtube.com/watch?v=Novakid2", source: "YouTube", duration: "4:15", date: "2023-12", thumbnail_id: "pTTGmGn6kHE" }
      ]
    },
    {
      id: "duolingo",
      name: "Duolingo",
      website: "duolingo.com",
      description: "World's most popular language learning platform with gamified lessons, now integrating AI-powered conversation practice and voice features.",
      founded: "2011",
      hq: "Pittsburgh, PA",
      employees: 700,
      funding_total: "$183M",
      pricing: "Freemium, $7.99/mo premium",
      classification: "indirect_competitor",
      features: ["Gamified lessons", "Speech recognition", "Adaptive learning", "Social features", "Duolingo Max (GPT-4)", "Streak system"],
      technologies: ["GPT-4", "React Native", "AWS", "Custom ML"],
      strengths: ["Massive user base (500M+)", "Strong brand recognition", "Proven gamification", "Public company resources", "Data advantage"],
      weaknesses: ["Not focused on children under 12", "No dedicated voice tutoring", "One-size-fits-all approach", "Voice features are limited"],
      people: [
        { name: "Luis von Ahn", role: "CEO & Co-founder" },
        { name: "Severin Hacker", role: "CTO & Co-founder" }
      ],
      funding_rounds: [
        { round: "Series D", amount: "$45M", date: "2015", investors: ["Google Capital", "Union Square Ventures"] },
        { round: "Series E", amount: "$25M", date: "2017", investors: ["Drive Capital"] },
        { round: "Series F", amount: "$30M", date: "2020", investors: ["General Atlantic"] },
        { round: "IPO", amount: "$521M", date: "2021", investors: ["Public Market"] }
      ],
      videos: [
        { title: "Duolingo Max: AI-Powered Language Learning", url: "https://www.youtube.com/watch?v=Duo1", source: "YouTube", duration: "5:12", date: "2024-07", thumbnail_id: "nItMRK0vNG0" },
        { title: "Luis von Ahn: How Duolingo Uses GPT-4", url: "https://www.youtube.com/watch?v=Duo2", source: "YouTube", duration: "22:45", date: "2024-03", thumbnail_id: "P6FORpg0KVo" },
        { title: "Duolingo Product Teardown | Strategy Analysis", url: "https://www.youtube.com/watch?v=Duo3", source: "TechCrunch", duration: "14:30", date: "2023-09", thumbnail_id: "gyMwXuJrbJQ" }
      ]
    },
    {
      id: "lingokids",
      name: "Lingokids",
      website: "lingokids.com",
      description: "Playful learning app for kids aged 2-8, blending English language education with STEM, social skills, and creative content.",
      founded: "2016",
      hq: "Madrid, Spain",
      employees: 120,
      funding_total: "$72M",
      pricing: "Freemium, $14.99/mo premium",
      classification: "indirect_competitor",
      features: ["Adaptive learning paths", "Parental controls", "Offline mode", "Multi-subject curriculum", "Interactive games"],
      technologies: ["Unity", "React Native", "AWS", "TensorFlow"],
      strengths: ["Strong focus on young children", "Multi-subject approach", "Good parental controls", "Global reach (30M families)"],
      weaknesses: ["Limited voice interaction", "Screen-heavy experience", "No real-time tutoring", "Engagement drops after age 8"],
      people: [
        { name: "Cristobal Viedma", role: "CEO & Co-founder" },
        { name: "Marieta Gómez", role: "COO" }
      ],
      funding_rounds: [
        { round: "Series A", amount: "$6M", date: "2017", investors: ["Holtzbrinck Ventures"] },
        { round: "Series B", amount: "$10M", date: "2019", investors: ["Ravensburger", "Holtzbrinck Ventures"] },
        { round: "Series C", amount: "$40M", date: "2021", investors: ["Reach Capital", "Owl Ventures"] }
      ],
      videos: [
        { title: "Lingokids: Playful Learning for Kids", url: "https://www.youtube.com/watch?v=Lingo1", source: "YouTube", duration: "1:45", date: "2024-01", thumbnail_id: "rfscVS0vtbw" }
      ]
    },
    {
      id: "khanacademy",
      name: "Khan Academy Kids",
      website: "khanacademy.org/kids",
      description: "Free educational app for children 2-8 featuring thousands of interactive activities across reading, math, and social-emotional learning.",
      founded: "2018",
      hq: "Mountain View, CA",
      employees: 250,
      funding_total: "$80M",
      pricing: "Free (non-profit)",
      classification: "indirect_competitor",
      features: ["Adaptive learning", "Cross-subject curriculum", "Khanmigo AI tutor", "Teacher tools", "Offline access"],
      technologies: ["GPT-4 (Khanmigo)", "React", "GCP", "Custom ML"],
      strengths: ["Completely free", "Strong non-profit brand", "Khanmigo AI integration", "Cross-subject depth"],
      weaknesses: ["No voice-first experience", "Focused on text/visual learning", "Slower innovation cycle", "Not gamified enough for sustained engagement"],
      people: [
        { name: "Sal Khan", role: "Founder & CEO" },
        { name: "Caroline Hu Flexer", role: "President" }
      ],
      funding_rounds: [
        { round: "Grant", amount: "$10M", date: "2022", investors: ["Google.org"] },
        { round: "Grant", amount: "$20M", date: "2023", investors: ["Gates Foundation", "Google.org"] }
      ]
    },
    {
      id: "abc_mouse",
      name: "ABCmouse",
      website: "abcmouse.com",
      description: "Comprehensive digital learning program for children ages 2-8, covering reading, math, science, and art through interactive curriculum.",
      founded: "2010",
      hq: "Glendale, CA",
      employees: 800,
      funding_total: "$175M",
      pricing: "$12.99/mo, $59.99/yr",
      classification: "indirect_competitor",
      features: ["10,000+ learning activities", "Step-by-step learning paths", "Progress tracking", "Reward system", "Multi-subject"],
      technologies: ["Flash/HTML5", "React", "AWS", "Custom analytics"],
      strengths: ["Massive content library", "Proven curriculum", "Strong parent trust", "Multi-platform"],
      weaknesses: ["Dated technology stack", "No AI or voice features", "Screen time concerns from parents", "Subscription fatigue among competitors"],
      people: [
        { name: "Doug Dohring", role: "Founder & CEO" }
      ],
      funding_rounds: [
        { round: "Series A", amount: "$25M", date: "2012", investors: ["Iconiq Capital"] },
        { round: "Series B", amount: "$150M", date: "2015", investors: ["Iconiq Capital", "TCV"] }
      ]
    },
    {
      id: "talkberry",
      name: "TalkBerry",
      website: "talkberry.ai",
      description: "Early-stage startup building an AI voice companion for young language learners, using adaptive conversation to build fluency and confidence.",
      founded: "2024",
      hq: "New York, NY",
      employees: 8,
      funding_total: "$2.1M",
      pricing: "Beta — free waitlist",
      classification: "emerging",
      features: ["Voice-first AI tutor", "Adaptive difficulty", "Child-safe content", "Parent insights", "Story-based learning"],
      technologies: ["Whisper", "GPT-4", "ElevenLabs", "React Native"],
      strengths: ["Purpose-built voice-first UX", "Strong founding team (ex-Duolingo)", "COPPA-compliant from day one", "Early mover in voice + kids niche"],
      weaknesses: ["Pre-revenue", "Tiny team", "No proven engagement metrics yet", "Dependent on third-party voice APIs"],
      people: [
        { name: "Sarah Chen", role: "CEO & Co-founder" },
        { name: "Marcus Rivera", role: "CTO & Co-founder" }
      ],
      funding_rounds: [
        { round: "Pre-Seed", amount: "$2.1M", date: "2024", investors: ["Y Combinator", "Pioneer Fund"] }
      ],
      videos: [
        { title: "TalkBerry YC Demo Day Pitch", url: "https://www.youtube.com/watch?v=TB1", source: "Y Combinator", duration: "2:00", date: "2024-09", thumbnail_id: "8S0FDjFBj8o" }
      ]
    },
    {
      id: "voicepaw",
      name: "VoicePaw",
      website: "voicepaw.com",
      description: "Interactive voice-based learning games for children, using AI animal characters that teach vocabulary, phonics, and storytelling through play.",
      founded: "2023",
      hq: "Austin, TX",
      employees: 12,
      funding_total: "$3.5M",
      pricing: "$9.99/mo",
      classification: "emerging",
      features: ["AI animal characters", "Voice-driven games", "Phonics training", "Storytelling mode", "Parent controls"],
      technologies: ["Claude AI", "Azure Speech", "React Native", "Firebase"],
      strengths: ["Unique character-driven approach", "Strong engagement metrics in beta", "Voice-only mode available", "Low screen time option"],
      weaknesses: ["Very early stage", "Limited language coverage", "Small content library", "Unproven unit economics"],
      people: [
        { name: "Jordan Wright", role: "CEO & Founder" },
        { name: "Priya Patel", role: "Head of Product" }
      ],
      funding_rounds: [
        { round: "Seed", amount: "$3.5M", date: "2024", investors: ["Reach Capital", "Afore Capital"] }
      ]
    },
    {
      id: "wonderwords",
      name: "WonderWords",
      website: "wonderwords.ai",
      description: "AI-powered vocabulary builder for kids that uses spaced repetition and conversational AI to teach words in context through voice interactions.",
      founded: "2024",
      hq: "London, UK",
      employees: 6,
      funding_total: "$1.2M",
      pricing: "Beta — $6.99/mo",
      classification: "emerging",
      features: ["Spaced repetition", "Contextual vocabulary", "Voice conversations", "Reading level assessment", "Multi-language support"],
      technologies: ["GPT-4", "Deepgram", "Next.js", "Supabase"],
      strengths: ["Novel spaced repetition + voice combo", "Strong edtech advisory board", "Multi-language from launch", "EU market focus"],
      weaknesses: ["Pre-product-market-fit", "Bootstrapped team", "No mobile app yet", "Competing with free alternatives"],
      people: [
        { name: "Oliver Thompson", role: "CEO & Co-founder" },
        { name: "Aisha Mahmoud", role: "CTO & Co-founder" }
      ],
      funding_rounds: [
        { round: "Pre-Seed", amount: "$1.2M", date: "2024", investors: ["Entrepreneur First", "Angel Investors"] }
      ]
    }
  ],

  investors: [
    {
      id: "owl_ventures",
      name: "Owl Ventures",
      logo: null,
      companies_in_space: ["Novakid", "Lingokids"],
      thesis_fit: "Largest dedicated edtech VC globally. Active thesis in AI + education.",
      recent_deals: 12,
      aum: "$2B"
    },
    {
      id: "reach_capital",
      name: "Reach Capital",
      logo: null,
      companies_in_space: ["Ello", "Lingokids", "VoicePaw"],
      thesis_fit: "Focused on early education and learning tools. Strong kids-focused portfolio.",
      recent_deals: 8,
      aum: "$500M"
    },
    {
      id: "yc",
      name: "Y Combinator",
      logo: null,
      companies_in_space: ["Ello", "Speak", "TalkBerry"],
      thesis_fit: "Active in AI + education startups. Funded multiple companies in this space.",
      recent_deals: 25,
      aum: "$6B"
    },
    {
      id: "khosla",
      name: "Khosla Ventures",
      logo: null,
      companies_in_space: ["Speak"],
      thesis_fit: "Strong AI thesis. Backed leading voice AI companies.",
      recent_deals: 15,
      aum: "$15B"
    },
    {
      id: "goodwater",
      name: "Goodwater Capital",
      logo: null,
      companies_in_space: ["Ello", "Novakid"],
      thesis_fit: "Consumer tech focus with data-driven approach. Active in edtech.",
      recent_deals: 10,
      aum: "$3B"
    },
    {
      id: "founders_fund",
      name: "Founders Fund",
      logo: null,
      companies_in_space: ["Speak"],
      thesis_fit: "Backs category-defining companies. Voice AI fits their frontier tech thesis.",
      recent_deals: 6,
      aum: "$12B"
    },
    {
      id: "general_atlantic",
      name: "General Atlantic",
      logo: null,
      companies_in_space: ["Duolingo"],
      thesis_fit: "Growth equity in market leaders. Edtech is an active vertical.",
      recent_deals: 4,
      aum: "$84B"
    },
    {
      id: "pioneer_fund",
      name: "Pioneer Fund",
      logo: null,
      companies_in_space: ["TalkBerry"],
      thesis_fit: "Early-stage focus on AI-native products. Strong founder network.",
      recent_deals: 18,
      aum: "$200M"
    }
  ],

  market_sizing: {
    tam: "$12.8B",
    tam_description: "Global K-12 edtech market",
    sam: "$3.2B",
    sam_description: "AI-powered language learning for children (ages 4-14)",
    som: "$180M",
    som_description: "Voice-first AI tutoring for English-speaking kids 6-12 in US/UK/Canada",
    growth_rate: "18.5% CAGR",
    growth_period: "2024-2030",
    pricing_benchmarks: [
      { competitor: "Duolingo", price: "$7.99/mo", model: "Freemium" },
      { competitor: "Speak", price: "$12.99/mo", model: "Subscription" },
      { competitor: "Lingokids", price: "$14.99/mo", model: "Freemium" },
      { competitor: "Ello", price: "$14.99/mo", model: "Subscription" },
      { competitor: "Novakid", price: "$8.50–$17/session", model: "Per-session" },
      { competitor: "ABCmouse", price: "$12.99/mo", model: "Subscription" },
      { competitor: "VoicePaw", price: "$9.99/mo", model: "Subscription" },
      { competitor: "WonderWords", price: "$6.99/mo", model: "Subscription" }
    ],
    key_stats: [
      { label: "Average price", value: "$11.50/mo" },
      { label: "Parents willing to pay for edtech", value: "67%" },
      { label: "Voice AI adoption in education", value: "23% YoY growth" },
      { label: "Kids screen time concern", value: "78% of parents" }
    ]
  },

  demand_signals: [
    {
      id: "ds1",
      source: "Reddit",
      subreddit: "r/parenting",
      text: "My 8-year-old loves Duolingo but the lessons aren't designed for kids her age. She gets frustrated with the adult-oriented content. Wish there was something more age-appropriate with voice practice.",
      date: "2025-11",
      theme: "UX not kid-friendly",
      sentiment: "negative",
      url: "https://reddit.com/r/parenting/comments/abc123"
    },
    {
      id: "ds2",
      source: "Reddit",
      subreddit: "r/languagelearning",
      text: "Looking for something that helps my kid actually SPEAK, not just tap buttons on a screen. All these apps are basically flashcard games with cute animations.",
      date: "2025-10",
      theme: "Lack of voice interaction",
      sentiment: "negative",
      url: "https://reddit.com/r/languagelearning/comments/def456"
    },
    {
      id: "ds3",
      source: "Twitter/X",
      subreddit: null,
      text: "Hot take: the next billion-dollar edtech company will be voice-first, not screen-first. Kids under 10 learn by talking, not typing. Who's building this?",
      date: "2025-12",
      theme: "Voice-first opportunity",
      sentiment: "positive",
      url: "https://x.com/edtechvc/status/123"
    },
    {
      id: "ds4",
      source: "Hacker News",
      subreddit: null,
      text: "Ello is impressive for reading but I want something my 7yo can have actual conversations with. The speech-to-text for kids is getting good enough now.",
      date: "2025-09",
      theme: "Conversational AI for kids",
      sentiment: "positive",
      url: "https://news.ycombinator.com/item?id=789"
    },
    {
      id: "ds5",
      source: "Reddit",
      subreddit: "r/Mommit",
      text: "We're spending $200/month on a human tutor for my son's speech and language. Would absolutely pay $15/month for an AI alternative that actually works and keeps him engaged.",
      date: "2025-11",
      theme: "Price sensitivity / willingness to pay",
      sentiment: "positive",
      url: "https://reddit.com/r/Mommit/comments/ghi789"
    },
    {
      id: "ds6",
      source: "Reddit",
      subreddit: "r/slp",
      text: "As a speech-language pathologist, I see huge potential in AI voice tools for kids BUT the speech recognition needs to handle child voices and articulation errors. Current tools can't do this well.",
      date: "2025-08",
      theme: "Technical challenge: child speech recognition",
      sentiment: "neutral",
      url: "https://reddit.com/r/slp/comments/jkl012"
    },
    {
      id: "ds7",
      source: "Product Hunt",
      subreddit: null,
      text: "Just tried Ello with my daughter and she asked if she could 'talk to the book.' The demand for conversational AI tutoring for kids is clearly there. We just need someone to build it right.",
      date: "2025-10",
      theme: "Demand for conversational learning",
      sentiment: "positive",
      url: "https://producthunt.com/posts/ello#comment-345"
    },
    {
      id: "ds8",
      source: "Twitter/X",
      subreddit: null,
      text: "My kids won't stop talking to Alexa and Siri. Imagine if those conversations were actually educational and adaptive. That's a company waiting to happen.",
      date: "2025-12",
      theme: "Voice assistant behavior in kids",
      sentiment: "positive",
      url: "https://x.com/parenttech/status/456"
    },
    {
      id: "ds9",
      source: "Reddit",
      subreddit: "r/edtech",
      text: "COPPA compliance is a nightmare for startups building for kids. The ones who figure out privacy-first voice AI for children will have a massive moat.",
      date: "2025-09",
      theme: "Regulatory moat opportunity",
      sentiment: "neutral",
      url: "https://reddit.com/r/edtech/comments/mno345"
    },
    {
      id: "ds10",
      source: "Hacker News",
      subreddit: null,
      text: "Spent a year building a voice tutor for adults. Pivoting to kids because the retention numbers are 3x better — kids love talking to AI characters. The hard part is the speech recognition pipeline.",
      date: "2025-11",
      theme: "Builder validation",
      sentiment: "positive",
      url: "https://news.ycombinator.com/item?id=101"
    }
  ],

  white_space: [
    {
      id: "ws1",
      gap: "No voice-first tutoring for children under 10",
      evidence: "All existing solutions are text/screen-heavy. No product offers a primarily voice-driven learning experience for pre-literate and early-literate children.",
      opportunity_size: "high",
      competitors_missing: ["Duolingo", "ABCmouse", "Khan Academy Kids", "Lingokids"]
    },
    {
      id: "ws2",
      gap: "Child-optimized speech recognition is underserved",
      evidence: "Major ASR models are trained on adult speech. Child speech has higher pitch, more articulation errors, and different patterns. First company to nail this has a major moat.",
      opportunity_size: "high",
      competitors_missing: ["Speak", "SpeakBuddy", "Duolingo"]
    },
    {
      id: "ws3",
      gap: "Low-screen-time learning products for concerned parents",
      evidence: "78% of parents worry about screen time. A voice-first product that works with minimal screen use addresses a top parental concern that no competitor solves.",
      opportunity_size: "medium",
      competitors_missing: ["ABCmouse", "Lingokids", "Khan Academy Kids"]
    },
    {
      id: "ws4",
      gap: "Multilingual voice tutoring for bilingual households",
      evidence: "22% of US households speak a language other than English at home. No voice tutoring product supports bilingual learning paths for children.",
      opportunity_size: "medium",
      competitors_missing: ["Ello", "Novakid", "VoicePaw"]
    },
    {
      id: "ws5",
      gap: "AI tutoring integrated with school curriculum standards",
      evidence: "Parents want tools that align with Common Core / state standards. Most AI tutors are standalone and don't map to what kids learn in school.",
      opportunity_size: "medium",
      competitors_missing: ["Speak", "SpeakBuddy", "TalkBerry"]
    }
  ],

  strategic_summary: {
    attractive: true,
    reasoning: "Growing $3.2B market with clear underserved segment. Voice AI technology has matured significantly in 2024-2025. Existing players focus on adults (Speak, SpeakBuddy) or screen-heavy kids experiences (Duolingo, ABCmouse). The intersection of voice-first + kids aged 6-12 is wide open. Only 2-3 emerging startups are pursuing this — none have achieved scale yet.",
    must_be_true: [
      "Parents will pay $10-15/mo for a dedicated child voice learning tool",
      "Voice AI quality is good enough for child speech recognition (varied accents, articulation errors)",
      "Child engagement can be sustained through voice-only interactions without heavy screen gamification",
      "COPPA-compliant data practices can be implemented without crippling the product experience"
    ],
    risks: [
      "Duolingo could launch a kids-focused voice feature leveraging their 500M+ user base",
      "Child data privacy regulations (COPPA, EU GDPR-K) add significant compliance burden and cost",
      "Customer acquisition through parents is expensive ($40-80 CAC in edtech)",
      "Child speech recognition accuracy may not yet be reliable enough for a good UX"
    ],
    next_steps: [
      "Validate willingness-to-pay with 20 parent interviews ($10-15/mo price point)",
      "Build a 1-feature prototype testing voice-only interaction with kids aged 6-8",
      "Partner with 2-3 elementary schools for pilot testing and feedback",
      "Apply to Y Combinator W26 batch (strong edtech + AI thesis fit)"
    ]
  },

  graph: {
    nodes: [
      // Companies
      { id: "ello", label: "Ello", type: "company", size: 30 },
      { id: "speak", label: "Speak", type: "company", size: 35 },
      { id: "speakbuddy", label: "SpeakBuddy", type: "company", size: 22 },
      { id: "novakid", label: "Novakid", type: "company", size: 28 },
      { id: "duolingo", label: "Duolingo", type: "company", size: 50 },
      { id: "lingokids", label: "Lingokids", type: "company", size: 26 },
      { id: "khanacademy", label: "Khan Academy Kids", type: "company", size: 32 },
      { id: "abc_mouse", label: "ABCmouse", type: "company", size: 35 },
      { id: "talkberry", label: "TalkBerry", type: "company", size: 14 },
      { id: "voicepaw", label: "VoicePaw", type: "company", size: 15 },
      { id: "wonderwords", label: "WonderWords", type: "company", size: 12 },
      // Investors
      { id: "owl_ventures", label: "Owl Ventures", type: "investor", size: 22 },
      { id: "reach_capital", label: "Reach Capital", type: "investor", size: 20 },
      { id: "yc", label: "Y Combinator", type: "investor", size: 28 },
      { id: "khosla", label: "Khosla Ventures", type: "investor", size: 24 },
      { id: "goodwater", label: "Goodwater Capital", type: "investor", size: 20 },
      { id: "founders_fund", label: "Founders Fund", type: "investor", size: 22 },
      { id: "general_atlantic", label: "General Atlantic", type: "investor", size: 24 },
      { id: "pioneer_fund", label: "Pioneer Fund", type: "investor", size: 16 },
      // Key People
      { id: "luis", label: "Luis von Ahn", type: "person", size: 14 },
      { id: "connor", label: "Connor Zwick", type: "person", size: 12 },
      { id: "elizabeth", label: "Elizabeth Adams", type: "person", size: 12 },
      { id: "sal", label: "Sal Khan", type: "person", size: 14 },
      { id: "sarah_chen", label: "Sarah Chen", type: "person", size: 10 },
      // Technologies
      { id: "gpt4", label: "GPT-4", type: "technology", size: 18 },
      { id: "whisper", label: "Whisper ASR", type: "technology", size: 16 },
      { id: "react_native", label: "React Native", type: "technology", size: 14 },
      { id: "claude", label: "Claude AI", type: "technology", size: 14 },
      // Features
      { id: "speech_rec", label: "Speech Recognition", type: "feature", size: 16 },
      { id: "adaptive", label: "Adaptive Learning", type: "feature", size: 14 },
      { id: "gamification", label: "Gamification", type: "feature", size: 14 },
      { id: "voice_tutor", label: "Voice Tutoring", type: "feature", size: 16 },
      { id: "parent_dash", label: "Parent Dashboard", type: "feature", size: 12 },
    ],
    edges: [
      // Competition edges
      { from: "ello", to: "speak", label: "COMPETES_WITH" },
      { from: "ello", to: "novakid", label: "COMPETES_WITH" },
      { from: "speak", to: "speakbuddy", label: "COMPETES_WITH" },
      { from: "duolingo", to: "lingokids", label: "COMPETES_WITH" },
      { from: "duolingo", to: "speak", label: "COMPETES_WITH" },
      { from: "talkberry", to: "voicepaw", label: "COMPETES_WITH" },
      { from: "abc_mouse", to: "lingokids", label: "COMPETES_WITH" },
      { from: "abc_mouse", to: "khanacademy", label: "COMPETES_WITH" },
      // Funding edges
      { from: "ello", to: "yc", label: "FUNDED_BY" },
      { from: "ello", to: "goodwater", label: "FUNDED_BY" },
      { from: "ello", to: "reach_capital", label: "FUNDED_BY" },
      { from: "speak", to: "yc", label: "FUNDED_BY" },
      { from: "speak", to: "founders_fund", label: "FUNDED_BY" },
      { from: "speak", to: "khosla", label: "FUNDED_BY" },
      { from: "novakid", to: "owl_ventures", label: "FUNDED_BY" },
      { from: "novakid", to: "goodwater", label: "FUNDED_BY" },
      { from: "duolingo", to: "general_atlantic", label: "FUNDED_BY" },
      { from: "lingokids", to: "reach_capital", label: "FUNDED_BY" },
      { from: "lingokids", to: "owl_ventures", label: "FUNDED_BY" },
      { from: "talkberry", to: "yc", label: "FUNDED_BY" },
      { from: "talkberry", to: "pioneer_fund", label: "FUNDED_BY" },
      { from: "voicepaw", to: "reach_capital", label: "FUNDED_BY" },
      // Founded edges
      { from: "luis", to: "duolingo", label: "FOUNDED" },
      { from: "connor", to: "speak", label: "FOUNDED" },
      { from: "elizabeth", to: "ello", label: "FOUNDED" },
      { from: "sal", to: "khanacademy", label: "FOUNDED" },
      { from: "sarah_chen", to: "talkberry", label: "FOUNDED" },
      // Technology edges
      { from: "duolingo", to: "gpt4", label: "USES" },
      { from: "speak", to: "gpt4", label: "USES" },
      { from: "speakbuddy", to: "gpt4", label: "USES" },
      { from: "khanacademy", to: "gpt4", label: "USES" },
      { from: "talkberry", to: "whisper", label: "USES" },
      { from: "ello", to: "whisper", label: "USES" },
      { from: "voicepaw", to: "claude", label: "USES" },
      { from: "duolingo", to: "react_native", label: "USES" },
      { from: "speak", to: "react_native", label: "USES" },
      // Feature edges
      { from: "ello", to: "speech_rec", label: "OFFERS" },
      { from: "speak", to: "speech_rec", label: "OFFERS" },
      { from: "duolingo", to: "speech_rec", label: "OFFERS" },
      { from: "speakbuddy", to: "speech_rec", label: "OFFERS" },
      { from: "duolingo", to: "gamification", label: "OFFERS" },
      { from: "lingokids", to: "gamification", label: "OFFERS" },
      { from: "abc_mouse", to: "gamification", label: "OFFERS" },
      { from: "ello", to: "adaptive", label: "OFFERS" },
      { from: "khanacademy", to: "adaptive", label: "OFFERS" },
      { from: "novakid", to: "voice_tutor", label: "OFFERS" },
      { from: "speak", to: "voice_tutor", label: "OFFERS" },
      { from: "talkberry", to: "voice_tutor", label: "OFFERS" },
      { from: "voicepaw", to: "voice_tutor", label: "OFFERS" },
      { from: "ello", to: "parent_dash", label: "OFFERS" },
      { from: "lingokids", to: "parent_dash", label: "OFFERS" },
    ],
  },

  voice_briefing_text: "Here's your market landscape for an AI-powered voice tutor for kids aged 6 to 12. I found 11 companies in this space, ranging from established players like Duolingo and ABCmouse to emerging startups like TalkBerry and VoicePaw. Three are direct competitors focused on voice or tutoring for children: Ello, Speak, and Novakid. However, none of them offer a voice-first experience specifically designed for the 6-to-12 age group. The serviceable addressable market is 3.2 billion dollars, growing at 18.5% annually. The biggest opportunity? No existing player combines voice-first AI tutoring with a child-optimized experience. The key risk is Duolingo launching a kids voice feature, leveraging their 500 million plus user base. Average pricing in the space is around 11 dollars and 50 cents per month, and 67% of parents say they're willing to pay for quality edtech. My recommendation: validate willingness to pay with 20 parent interviews, then build a single-feature prototype testing voice-only interaction with kids aged 6 to 8. This market is attractive — the timing is right, the technology is ready, and the segment is underserved."
};

export const exampleQueries = [
  "An AI-powered voice tutor for kids aged 6 to 12",
  "A fintech app that helps gig workers manage irregular income and taxes",
  "A B2B SaaS platform for restaurant supply chain management",
  "An AR-based interior design tool for homeowners",
];
