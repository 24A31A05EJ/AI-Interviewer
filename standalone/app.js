// ========== STATE MANAGEMENT ==========
const state = {
    currentUser: null,
    currentPage: 'home',
    isDarkMode: localStorage.getItem('darkMode') === 'true',
    interviewData: {
        questions: [],
        currentIndex: 0,
        answers: [],
        scores: [],
        startTime: null,
        type: 'technical',
        difficulty: 'medium',
        role: 'backend'
    },
    userStats: {
        totalInterviews: localStorage.getItem('totalInterviews') ? parseInt(localStorage.getItem('totalInterviews')) : 0,
        interviews: JSON.parse(localStorage.getItem('interviews') || '[]'),
        avgScore: 0,
        streak: 0,
        topicsMastered: 0
    }
};

// ========== QUESTION DATABASE ==========
// ========== QUESTION DATABASE (Chained — each answer leads into the next question) ==========
const questionDatabase = {
    technical: {
        easy: [
            // Chain: variables → data types → functions → async → REST → JSON → HTTP → errors
            { text: "What is a variable in programming, and why do we need them?", category: "Basics", answer: "A variable is a named storage location that holds a value which can change during program execution. They allow programs to store, retrieve, and manipulate data dynamically." },
            { text: "Since variables hold different types of data, what are the primitive data types in JavaScript and how do they differ?", category: "JavaScript", answer: "Primitive types include string, number, boolean, null, undefined, symbol, and bigint. They are immutable and stored by value, unlike objects which are stored by reference." },
            { text: "Now that we understand data types, explain the difference between let, const, and var for declaring variables.", category: "JavaScript", answer: "var is function-scoped and hoisted. let and const are block-scoped. const doesn't allow reassignment but objects declared with const can still be mutated." },
            { text: "Given that JavaScript is single-threaded, how does async/await help manage time-consuming operations without blocking?", category: "JavaScript", answer: "async/await is syntactic sugar for Promises. It allows writing asynchronous code that looks synchronous, pausing execution at await without blocking the main thread by using the event loop." },
            { text: "When making async network calls, what does a REST API represent and how does it work?", category: "APIs", answer: "Representational State Transfer. REST APIs use HTTP methods (GET, POST, PUT, DELETE) and stateless communication to transfer resources identified by URLs between client and server." },
            { text: "REST APIs exchange data using JSON — what is JSON and why is it preferred over XML?", category: "Data Format", answer: "JavaScript Object Notation. A lightweight, human-readable data interchange format. Preferred over XML because it is less verbose, natively parsed by JavaScript, and more compact." },
            { text: "When a REST API call fails, what HTTP status codes would you return for client vs. server errors, and why does the distinction matter?", category: "HTTP", answer: "4xx codes (400 Bad Request, 401 Unauthorized, 404 Not Found) indicate client errors. 5xx codes (500 Internal Server Error, 503 Service Unavailable) indicate server faults. The distinction helps clients handle errors appropriately." },
            { text: "How would you implement proper error handling in an async JavaScript function that calls a REST API?", category: "JavaScript", answer: "Wrap the await call in a try/catch block to capture rejected promises. Check response.ok before parsing JSON. Use finally to clean up resources like loading indicators." }
        ],
        medium: [
            // Chain: SQL vs NoSQL → indexing → binary search → caching → microservices → API gateway → rate limiting → async messaging
            { text: "Explain the fundamental differences between SQL and NoSQL databases and when you'd choose each.", category: "Databases", answer: "SQL: relational, structured, ACID compliant, better for complex queries and transactions. NoSQL: non-relational, flexible schemas, horizontally scalable, better for large volumes of unstructured data." },
            { text: "Since SQL databases use structured tables, how do database indexes work and why are they critical for query performance?", category: "Databases", answer: "Indexes are data structures (usually B-Trees or Hash tables) that allow the database engine to find rows without scanning the entire table. They trade write performance and storage for faster reads." },
            { text: "Binary search is the principle behind B-Tree indexes — explain binary search and its time complexity.", category: "Algorithms", answer: "Binary search repeatedly divides a sorted array in half, comparing the target to the midpoint. Time complexity is O(log n), making it far faster than linear search O(n) for large datasets." },
            { text: "To avoid hitting the database on every query, how does caching work and what are the main caching strategies?", category: "Caching", answer: "Cache stores frequently accessed data in fast memory. Strategies: Cache-aside (app manages cache), Write-through (write to cache and DB simultaneously), Write-back (write to cache, async DB update). Cache eviction uses LRU, LFU, or TTL." },
            { text: "As systems scale, caching alone is insufficient — explain microservices architecture and the problem it solves.", category: "Architecture", answer: "Breaking a monolithic application into small, independently deployable services each responsible for a specific business capability. Solves tight coupling, enables independent scaling, deployment, and technology choice per service." },
            { text: "With many microservices, how does an API Gateway help manage routing, authentication, and rate limiting?", category: "Architecture", answer: "An API Gateway is a single entry point for all clients. It handles cross-cutting concerns like auth, SSL termination, routing to downstream services, request transformation, rate limiting, and observability." },
            { text: "How does rate limiting protect a system, and what algorithms would you use to implement it?", category: "System Design", answer: "Rate limiting controls how many requests a client can make in a time window. Token bucket allows bursts; sliding window log is precise; fixed window is simple. State can be stored in Redis for distributed enforcement." },
            { text: "Beyond rate limiting, how does asynchronous messaging via queues help decouple microservices and improve resilience?", category: "Architecture", answer: "Message queues (e.g. RabbitMQ, Kafka) decouple producers and consumers. Producers fire-and-forget without waiting for consumers. This improves resilience (consumer can be down), enables retries, and prevents cascading failures." }
        ],
        hard: [
            // Chain: CAP theorem → consistency models → distributed transactions → distributed cache → rate limiting at scale → eventual consistency → CRDT → observability
            { text: "Explain the CAP theorem and its real-world implications for distributed system design.", category: "Distributed Systems", answer: "CAP states a distributed system can guarantee only 2 of 3: Consistency (every read gets the latest write), Availability (every request gets a response), Partition tolerance (system continues despite network splits). Most systems choose CP or AP." },
            { text: "Given the CAP tradeoff, what are the different consistency models available (strong, eventual, causal) and when would you use each?", category: "Distributed Systems", answer: "Strong consistency: all nodes see the same data simultaneously (high latency cost). Eventual consistency: all nodes converge to same state given no new updates (high availability). Causal: preserves cause-and-effect ordering. Choose based on business tolerance for stale reads." },
            { text: "For operations requiring strong consistency, how would you implement distributed transactions with ACID properties?", category: "Databases", answer: "Use Two-Phase Commit (2PC) for cross-service transactions, or Sagas (choreography/orchestration) for long-running transactions. Write-ahead logs ensure atomicity. Distributed locks prevent concurrent conflicts." },
            { text: "Design a distributed cache system like Redis, including replication, eviction, and consistency guarantees.", category: "System Design", answer: "Use consistent hashing to shard data. Replicate with primary-replica pattern. Eviction policies: LRU, LFU, TTL. For consistency, accept eventual consistency (async replication) or use WAIT command for sync. Handle cache stampede with mutex locks or probabilistic early expiration." },
            { text: "Your distributed cache is a hot path — design a rate limiter that works at scale across multiple cache nodes.", category: "System Design", answer: "Use Redis with atomic Lua scripts or INCR+EXPIRE for token bucket. For sliding window, use Redis sorted sets with timestamps. Ensure atomicity with transactions. Handle Redis unavailability with local fallback counters." },
            { text: "In an eventually consistent system, two nodes may accept conflicting writes — how do you resolve these conflicts?", category: "Distributed Systems", answer: "Strategies: Last-Write-Wins (LWW) using timestamps (may lose data), version vectors to track causality, application-level merge logic, CRDTs (Conflict-free Replicated Data Types) that mathematically guarantee convergence." },
            { text: "You mentioned CRDTs — explain how they achieve conflict-free merging and give a practical use case.", category: "Distributed Systems", answer: "CRDTs define data types with merge operations that are commutative, associative, and idempotent, guaranteeing any order of merges produces the same result. Examples: G-Counter for view counts, OR-Set for collaborative editing, LWW-Register for key-value stores." },
            { text: "With all this distributed complexity, how do you observe and debug a distributed system in production?", category: "Observability", answer: "The three pillars: Logs (structured, correlated by trace ID), Metrics (Prometheus/Grafana for latency, error rate, saturation), and Distributed Traces (Jaeger/Zipkin to follow a request across services). Use RED method: Rate, Errors, Duration per service." }
        ]
    },
    hr: {
        easy: [
            // Chain: intro → motivation → strengths → weakness → growth plan → work style → team fit → career goals
            { text: "Tell me about yourself and your professional journey so far.", category: "Introduction", answer: "Cover background, key experiences, achievements, skills, and why you are interested in this opportunity. Keep it concise and relevant." },
            { text: "Based on your background, why are you specifically interested in this role and this company?", category: "Motivation", answer: "Research the company's mission, products, and culture. Align your personal values and career aspirations with specific aspects of the role or company." },
            { text: "What are your three strongest professional strengths and can you give a brief example of each in action?", category: "Self-Assessment", answer: "Choose strengths directly relevant to the role. Back each with a specific, brief STAR example to make the claim credible." },
            { text: "Everyone has areas to improve — what is a real professional weakness you are actively working on?", category: "Self-Assessment", answer: "Choose a genuine weakness. Show self-awareness and describe concrete steps you are taking to improve. Avoid clichés like 'I work too hard'." },
            { text: "How do you approach learning new technologies or skills required for a role you don't fully know yet?", category: "Learning", answer: "Describe your learning process: online courses, documentation, side projects, peer learning. Show proactivity and a growth mindset." },
            { text: "How do you prefer to receive feedback, and how have you applied critical feedback in the past?", category: "Self-Assessment", answer: "Show openness to both positive and constructive feedback. Give a specific example of receiving difficult feedback and the change you made as a result." },
            { text: "Describe your ideal working environment and collaboration style with a team.", category: "Team Fit", answer: "Be honest about preferences (remote/in-office, collaborative/independent). Describe how you adapt your style to different team dynamics and personalities." },
            { text: "Where do you see yourself professionally in the next 3-5 years and how does this role fit into that plan?", category: "Career Goals", answer: "Show ambition aligned with the role's growth path. Mention specific skills or leadership responsibilities you aim to develop. Make the interviewer see you as a long-term investment." }
        ],
        medium: [
            // Chain: failure → conflict → leadership → difficult stakeholder → prioritization → project ownership → feedback culture → resilience
            { text: "Tell me about a time you failed significantly and what you learned from it.", category: "Behavioral", answer: "Use STAR method. Choose a real failure, not a trivial one. Focus on what you specifically did wrong, the impact, and the concrete lesson you applied afterward." },
            { text: "That failure likely involved other people — tell me about a time you had a conflict with a team member and how you resolved it.", category: "Teamwork", answer: "Show active listening, empathy, and seeking common ground. Describe addressing it directly rather than escalating immediately. Emphasize the relationship outcome, not just the task outcome." },
            { text: "Resolving conflict often requires leadership — describe a time you led a team or initiative without formal authority.", category: "Leadership", answer: "Informal leadership: taking initiative, rallying colleagues, making decisions under pressure. Show influence through credibility, communication, and results." },
            { text: "Leaders must manage up too — describe a time you disagreed with a manager or stakeholder and how you handled it.", category: "Conflict", answer: "Present your perspective respectfully with data, listen to their reasoning, seek to understand business constraints, and accept the decision gracefully if overruled while documenting your concerns." },
            { text: "With multiple stakeholders having conflicting demands, how do you prioritize when everything feels urgent?", category: "Management", answer: "Use impact/effort matrix or business value scoring. Communicate explicitly with stakeholders about trade-offs. Don't silently deprioritize — always align expectations." },
            { text: "Tell me about a project you fully owned from idea to delivery and what you'd do differently.", category: "Achievements", answer: "Cover the challenge, your specific contribution vs. the team's, key decisions you made, metrics that improved, and a genuine reflection on what you'd change." },
            { text: "How do you build a culture of honest feedback on a team that avoids giving it?", category: "Culture", answer: "Model vulnerability by asking for feedback yourself first. Create psychological safety through blameless retrospectives. Give specific, behavior-focused feedback regularly, not just at reviews." },
            { text: "Describe a time you were under extreme pressure or facing burnout — what did you do and what did you learn about resilience?", category: "Resilience", answer: "Be honest about the struggle. Show self-awareness about warning signs. Describe specific coping strategies (reprioritization, communication, boundaries). Show what structural change you made to prevent recurrence." }
        ],
        hard: [
            // Chain: crisis → ambiguity → strategic trade-offs → mentorship → organizational dynamics → layoffs → cultural change → legacy
            { text: "Walk me through how you handled a critical production incident that affected customers — what was your role and what happened after?", category: "Crisis", answer: "Show immediate triage (communicate, assign roles, isolate cause), then structured post-mortem (timeline, root cause, blameless analysis), then prevention (monitoring, runbooks, system changes)." },
            { text: "After that incident, you likely had to make decisions with incomplete information — how do you operate effectively under high ambiguity?", category: "Decision-Making", answer: "Use frameworks: define knowns vs. unknowns, make reversible vs. irreversible decision distinction, consult broadly but decide quickly, document your reasoning, and create feedback loops to course-correct." },
            { text: "When navigating ambiguity involves strategic trade-offs, how do you balance long-term tech investment against short-term delivery pressure?", category: "Management", answer: "Allocate explicit capacity (e.g. 20% per sprint) for tech debt. Frame improvements in business terms (e.g. reliability, developer velocity). Avoid letting urgency permanently crowd out importance." },
            { text: "Describe your approach to mentoring someone who is technically strong but struggles with professional communication or visibility.", category: "Leadership", answer: "Identify the root cause (anxiety, imposter syndrome, cultural difference). Create safe practice opportunities. Coach on structured communication frameworks. Advocate for their visibility in meetings they might normally stay quiet in." },
            { text: "You've mentored individuals, but how do you influence the culture of an entire organization when you don't control it top-down?", category: "Culture", answer: "Culture change happens through consistent behavior, not mandates. Model the behaviors you want to see. Find and amplify champions. Create low-friction rituals (demos, retros, learning sessions) that embed values organically." },
            { text: "If you had to make significant team reductions while maintaining morale and retaining key talent, how would you approach it?", category: "Crisis", answer: "Make decisions based on objective skills and role alignment, not favoritism. Communicate with radical transparency and compassion. Provide support to impacted individuals. Over-communicate the path forward to retain remaining team trust." },
            { text: "After organizational upheaval, how do you rebuild psychological safety and re-engage a demoralized team?", category: "Leadership", answer: "Acknowledge the difficulty honestly. Create space for people to process. Return to purpose and small wins. Increase autonomy and recognition. Address any lingering uncertainty directly rather than leaving a vacuum for speculation." },
            { text: "Reflecting on your entire career, what is the most important professional lesson you've learned that you wish you'd known earlier?", category: "Reflection", answer: "This reveals self-awareness and wisdom. The best answers are specific, not generic, and show that the candidate has genuinely reflected on their journey and growth." }
        ]
    },
    'system-design': {
        easy: [
            // Chain: requirements → storage → auth → API → notifications → search → scalability → monitoring
            { text: "When starting a system design, how do you gather and prioritize requirements?", category: "Process", answer: "Clarify functional requirements (what it does) and non-functional requirements (scale, latency, availability). Estimate DAU, QPS, storage. Prioritize the top 3 features before drawing anything." },
            { text: "Given those requirements, how do you choose between SQL and NoSQL storage for a new app?", category: "Storage", answer: "SQL for structured relational data, ACID transactions, complex queries. NoSQL for flexible schema, high write throughput, horizontal scale. Evaluate based on query patterns, consistency needs, and team familiarity." },
            { text: "Once storage is chosen, how would you design a secure authentication system for a web app?", category: "Auth", answer: "Use hashed passwords (bcrypt), JWT or session tokens, HTTPS only, refresh token rotation, rate-limit login attempts, support MFA." },
            { text: "With auth in place, how do you design a clean REST API for a TODO application?", category: "API Design", answer: "Resource-based URLs (/todos, /todos/:id), correct HTTP verbs, JSON responses, versioning (/v1/), pagination, consistent error format, input validation." },
            { text: "The app needs to notify users of updates — design a notification system.", category: "Notifications", answer: "Event-driven: services publish events to a queue (Kafka/SQS). Notification service consumes events and dispatches via email, SMS, or push. Store preferences per user and honor unsubscribes." },
            { text: "Users also need to search their content — design a basic search feature.", category: "Search", answer: "For simple search: database full-text search (Postgres tsvector). For scale: Elasticsearch with an inverted index. Index on write, query on read. Handle typos with fuzzy matching." },
            { text: "As the user base grows, what strategies do you use to scale the application horizontally?", category: "Scalability", answer: "Stateless app servers behind a load balancer. Cache hot data in Redis. Read replicas for DB. CDN for static assets. Queue async work. Shard database if single instance becomes bottleneck." },
            { text: "How do you monitor and alert on the health of this system in production?", category: "Monitoring", answer: "Metrics: request rate, error rate, latency (p50/p99), saturation. Logs: structured, correlated by request ID. Alerts on SLO breaches. Dashboards in Grafana. On-call rotation with runbooks." }
        ],
        medium: [
            // Chain: chat app → real-time → message delivery → storage → presence → history → scale → security
            { text: "Design the high-level architecture of a real-time chat application like WhatsApp.", category: "Messaging", answer: "Clients connect via WebSocket to chat servers. Message broker (Kafka) for async delivery. DB for persistence (Cassandra for high write throughput). Presence service tracks online status." },
            { text: "How do you ensure real-time message delivery with WebSockets at scale?", category: "Real-Time", answer: "Use a pub/sub system (Redis Pub/Sub or Kafka) so any server can receive a message and push to the correct WebSocket connection regardless of which server holds it. Sticky sessions or routing table." },
            { text: "What delivery guarantees do you implement — at-most-once, at-least-once, or exactly-once?", category: "Reliability", answer: "At-least-once with idempotency keys is the practical choice. Client retries on failure. Server deduplicates using message IDs. True exactly-once requires distributed transactions and is expensive." },
            { text: "How do you store billions of chat messages efficiently and still serve history quickly?", category: "Storage", answer: "Time-series optimized storage (Cassandra partitioned by conversation_id + time bucket). Hot data in cache. Cold data archived to object storage (S3). Pagination with cursor-based approach." },
            { text: "How do you implement accurate online presence indicators at scale?", category: "Presence", answer: "Heartbeat mechanism: client pings every 30s. Presence service stores last-seen in Redis with TTL. On WebSocket connect/disconnect update presence. Fanout presence changes to subscribers." },
            { text: "How do you handle message search across billions of messages efficiently?", category: "Search", answer: "Write messages to Elasticsearch asynchronously via Kafka. Index by user_id, conversation_id, and timestamp. Use multi-field search with BM25 ranking. Restrict search to user's own conversations for security." },
            { text: "Your chat app must handle 500M daily active users — how do you scale the infrastructure?", category: "Scale", answer: "Shard users to regional clusters to reduce latency. Consistent hashing to assign users to servers. Separate media (S3 + CDN) from messages. Auto-scale WebSocket servers. Use Kafka partitions for parallelism." },
            { text: "What security measures are critical to protect user messages end-to-end?", category: "Security", answer: "End-to-end encryption (Signal Protocol): keys generated on device, never server-side. TLS for transport. No server-side message decryption. Key verification for users. Ephemeral messages with TTL deletion." }
        ],
        hard: [
            // Chain: Google Search → crawling → indexing → ranking → serving → freshness → personalization → ads
            { text: "Design the web crawling subsystem for a Google-scale search engine.", category: "Search", answer: "Distributed crawlers with politeness (robots.txt, crawl delay). URL frontier with priority queue (importance + freshness). Consistent hashing to assign URLs to crawlers. Detect duplicate content via SimHash. Store raw pages in distributed object storage." },
            { text: "Once crawled, how do you build an inverted index that can handle trillions of documents?", category: "Indexing", answer: "MapReduce pipeline: map emits (term, docID, position), reduce aggregates to posting lists. Partition index by term hash across shards. Compress posting lists with delta encoding. Store in columnar format for fast lookup." },
            { text: "How does PageRank work and what are its limitations in modern search ranking?", category: "Ranking", answer: "PageRank assigns scores based on link graph: a page is important if important pages link to it. Iterative convergence. Limitations: gameable via link farms, doesn't capture semantic relevance, ignores content quality. Modern systems use 200+ signals including BERT embeddings." },
            { text: "How do you serve search results with sub-100ms latency at billions of QPS?", category: "Serving", answer: "Tiered serving: L1 cache (Memcached) for hot queries, sharded index servers for fresh results. Scatter-gather: fan out query to all shards, merge results. Precompute top-N for popular queries. Use approximate nearest neighbor for embedding search." },
            { text: "How do you keep the index fresh for news and live events without full re-indexing?", category: "Freshness", answer: "Tiered indexing: real-time index (updated in minutes via streaming), recent index (hours), main index (days). Query merges results from all tiers. Prioritize crawl of high-update-frequency domains." },
            { text: "How do you personalize search results without creating a filter bubble?", category: "Personalization", answer: "Use user signals (click history, location, language) to re-rank results. Apply diversity constraints to ensure non-personalized results appear. A/B test personalization impact on discovery metrics." },
            { text: "Design the auction system that determines which ads appear alongside search results.", category: "Ads", answer: "Second-price auction (Vickrey): advertisers bid on keywords, winner pays second-highest bid. Ad rank = bid x quality score (CTR prediction x landing page relevance). Separate ads index, merged at serving layer." },
            { text: "How do you detect and defend against search index spam and SEO manipulation?", category: "Anti-Abuse", answer: "Link spam detection via graph anomaly detection. Content farm detection via duplicate/thin content analysis. Behavioral signals (pogo-sticking). Sandboxing new domains. Manual actions for egregious violations. Continuous adversarial red-teaming." }
        ]
    },
    'frontend': {
        easy: [
            // Chain: HTML semantics → DOM → CSS layout → flexbox vs grid → JS variables → closures → events → async
            { text: "What is semantic HTML and why does it matter for accessibility and SEO?", category: "HTML", answer: "Semantic tags (article, header, nav, main, section) convey meaning to browsers, screen readers, and search engines. They improve accessibility (ARIA roles implied), SEO rankings, and code readability." },
            { text: "The browser parses that HTML into the DOM — what is the DOM and how can JavaScript interact with it?", category: "Basics", answer: "Document Object Model: a tree representation of the page. JavaScript interacts via APIs: querySelector, addEventListener, createElement, innerHTML, classList, setAttribute." },
            { text: "Once the DOM is rendered, CSS controls layout — what is the box model and how does it affect element sizing?", category: "CSS", answer: "Every element is a box: content + padding + border + margin. box-sizing: border-box includes padding and border in the declared width, preventing layout surprises." },
            { text: "For complex layouts, when would you choose CSS Flexbox vs CSS Grid?", category: "CSS", answer: "Flexbox is 1D (row or column), ideal for component-level alignment (nav bars, card rows). Grid is 2D (rows and columns), ideal for page-level layouts. They complement each other." },
            { text: "JavaScript manages interactivity — explain the difference between let, const, and var and which you should use.", category: "JavaScript", answer: "var is function-scoped and hoisted (avoid). let is block-scoped and reassignable. const is block-scoped and cannot be reassigned. Prefer const by default, use let when reassignment is needed." },
            { text: "JavaScript uses closures extensively — explain what a closure is and give a practical example.", category: "JavaScript", answer: "A closure is a function that retains access to its lexical scope even when executed outside that scope. Example: counter factories, event handlers capturing loop variables, memoization functions." },
            { text: "Events drive interactivity — explain event bubbling, capturing, and how event delegation works.", category: "JavaScript", answer: "Events bubble up from target to root (bubbling) or travel down (capturing). Event delegation attaches one listener to a parent to handle events from many children, improving performance and handling dynamic elements." },
            { text: "Making API calls is async — explain the JavaScript event loop and how Promises and async/await fit in.", category: "JavaScript", answer: "The event loop runs the call stack, processes the microtask queue (Promises), then the macrotask queue (setTimeout). async/await is syntactic sugar over Promises, making async code readable without blocking the main thread." }
        ],
        medium: [
            // Chain: virtual DOM → reconciliation → state management → performance → CORS → service workers → SSR → bundle optimization
            { text: "How does React's virtual DOM work and why is it faster than direct DOM manipulation?", category: "React", answer: "React maintains a virtual DOM (in-memory tree). On state change it re-renders the virtual DOM, diffs it against the previous version (reconciliation), and only applies the minimal real DOM changes. Batches updates for efficiency." },
            { text: "React's reconciliation relies on keys — why are keys critical and what happens when they're missing or incorrect?", category: "React", answer: "Keys help React identify which items in a list changed, added, or removed. Missing keys force full re-renders. Using array index as key breaks when list order changes, causing incorrect component reuse." },
            { text: "With complex apps, component state becomes hard to manage — what are the main state management patterns?", category: "State Management", answer: "Local state (useState), context API for shared state without prop drilling, Redux/Zustand for global app state with predictable updates, React Query for server state (caching, refetching)." },
            { text: "How do you diagnose and fix a React application that feels slow or laggy?", category: "Performance", answer: "Profile with React DevTools Profiler. Identify unnecessary re-renders (use React.memo, useMemo, useCallback). Virtualize long lists (react-window). Code-split with lazy/Suspense. Avoid large state in context." },
            { text: "When your frontend calls a different domain's API, CORS blocks it — explain CORS and how to configure it correctly.", category: "Security", answer: "Cross-Origin Resource Sharing: browser enforces same-origin policy. Server opts in by returning Access-Control-Allow-Origin headers. Preflight OPTIONS request for non-simple requests. Never use wildcard (*) with credentials." },
            { text: "To work offline, you use Service Workers — explain what they are and how caching strategies differ.", category: "PWA", answer: "Service Workers are background scripts intercepting network requests. Caching strategies: Cache-first (fast, stale risk), Network-first (fresh, slow offline), Stale-while-revalidate (fast + background update)." },
            { text: "For SEO and initial load performance, how does Server-Side Rendering differ from Client-Side Rendering and Static Generation?", category: "Architecture", answer: "CSR: browser fetches JS and renders (slow FCP, poor SEO). SSR: server renders HTML per request (fast FCP, good SEO, server load). SSG: HTML pre-built at build time (fastest, no server, not dynamic)." },
            { text: "How does Webpack bundle your code and what optimizations reduce bundle size?", category: "Build Tools", answer: "Webpack builds a dependency graph from entry points, applies loaders (Babel, CSS), and emits bundles. Optimizations: tree shaking (dead code elimination), code splitting (lazy chunks), minification, compression (gzip/brotli), long-term caching via content hashing." }
        ],
        hard: [
            // Chain: browser internals → rendering pipeline → paint → layout thrashing → state architecture → SSR hydration → micro-frontends → security
            { text: "Walk through the complete browser rendering pipeline from receiving HTML bytes to painting pixels on screen.", category: "Internals", answer: "Bytes → Characters → Tokens → DOM. CSS → CSSOM. DOM + CSSOM → Render Tree. Layout (compute geometry). Paint (rasterize layers). Composite (GPU layers merged). JS can block parsing; use defer/async." },
            { text: "What triggers layout (reflow) vs paint vs compositing, and why does it matter for performance?", category: "Internals", answer: "Reflow: changing geometry (width, height, position) — expensive, cascades. Repaint: changing visual style (color, background) — cheaper. Compositing: transform/opacity — cheapest, GPU-accelerated. Animate with transform/opacity only." },
            { text: "What is layout thrashing and how do you prevent it in JavaScript?", category: "Performance", answer: "Reading layout properties (offsetWidth) after a DOM write forces synchronous reflow. Batch reads before writes. Use requestAnimationFrame to schedule visual updates. Use FastDOM library to queue reads and writes." },
            { text: "Design a scalable state management system from scratch — what principles would guide your architecture?", category: "Architecture", answer: "Single source of truth (one store). State is read-only (only modified via actions). Pure reducer functions. Selectors for derived state. Middleware for side effects. Devtools for time-travel debugging. Matches Redux/Zustand patterns." },
            { text: "SSR sends HTML then React 'hydrates' it — what is hydration, and what problems can cause hydration mismatch errors?", category: "SSR", answer: "Hydration: React attaches event listeners to existing server-rendered DOM instead of re-rendering. Mismatches occur when server and client render different HTML (dates, random values, browser-only APIs). Fix: suppress hydration warnings, use useEffect for client-only code." },
            { text: "What are micro-frontends and when would you use them over a monolithic frontend?", category: "Architecture", answer: "Micro-frontends split a UI into independently deployed pieces owned by separate teams. Use when teams are large, release cycles conflict, or tech stacks diverge. Implement via iframes, web components, module federation (Webpack 5), or server-side composition." },
            { text: "How do you implement Content Security Policy (CSP) and what XSS attack vectors does it block?", category: "Security", answer: "CSP is an HTTP header restricting sources of scripts, styles, fonts, images. Blocks inline scripts (most XSS), eval(), external script injection. Use nonces for inline scripts. Report-only mode for incremental rollout." },
            { text: "Design an accessible, keyboard-navigable modal dialog that follows ARIA best practices.", category: "Accessibility", answer: "On open: move focus to modal, trap Tab within it, set role=dialog aria-modal=true aria-labelledby. On close: return focus to trigger. Close on Escape. Overlay blocks pointer interaction outside. Test with screen readers (NVDA, VoiceOver)." }
        ]
    },
    'backend': {
        easy: [
            // Chain: API basics → HTTP verbs → status codes → auth → JWT → database → primary key → MVC
            { text: "What is an API and why is it the backbone of modern software architecture?", category: "Basics", answer: "Application Programming Interface: a contract for how software components communicate. Enables decoupling, reuse, and integration between services, platforms, and third parties." },
            { text: "REST APIs use HTTP verbs — explain GET, POST, PUT, PATCH, and DELETE and when to use each.", category: "HTTP", answer: "GET: read (idempotent). POST: create (non-idempotent). PUT: full replace (idempotent). PATCH: partial update. DELETE: remove. Idempotency means repeating the operation has the same effect." },
            { text: "How do HTTP status codes communicate the result of an API call to the client?", category: "HTTP", answer: "2xx: success (200 OK, 201 Created, 204 No Content). 3xx: redirect. 4xx: client error (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 429 Too Many Requests). 5xx: server error." },
            { text: "APIs need to restrict access — explain the difference between authentication and authorization.", category: "Auth", answer: "Authentication: verifying identity (who you are) — login, tokens. Authorization: verifying permissions (what you can do) — RBAC, scopes. Authentication must come before authorization." },
            { text: "JWT is a common auth token — explain its structure, how it works, and its security considerations.", category: "Auth", answer: "JWT has 3 base64url-encoded parts: Header (algorithm), Payload (claims), Signature. Server signs with secret; client sends in Authorization header. Stateless. Risks: no revocation without blocklist, signature must be verified, use short expiry with refresh tokens." },
            { text: "The backend needs to persist data — what is a primary key and what makes a good one?", category: "Databases", answer: "A primary key uniquely identifies each row. Good PKs: stable (don't change), unique, indexed. Options: auto-increment integers (simple, sequential), UUIDs (globally unique, no enumeration risk), ULIDs (sortable UUIDs)." },
            { text: "How does the MVC pattern structure a backend application and what are the responsibilities of each layer?", category: "Architecture", answer: "Model: data access and business logic. View: presentation layer (or API response serialization). Controller: handles HTTP request/response, delegates to Model. Separation of concerns makes code testable and maintainable." },
            { text: "How do you write a backend that is easy to test, and what types of tests should you have?", category: "Testing", answer: "Unit tests: individual functions in isolation with mocked dependencies. Integration tests: test DB/API interactions against a real or in-memory DB. E2E tests: full HTTP request through the stack. Aim for the testing pyramid: many unit, fewer integration, fewest E2E." }
        ],
        medium: [
            // Chain: SQL injection → input validation → ORM → N+1 → indexing → caching → rate limiting → migrations
            { text: "What is SQL injection and how do prepared statements prevent it?", category: "Security", answer: "SQL injection: attacker injects SQL via user input (e.g. ' OR 1=1 --). Prepared statements send query structure separately from data, so user input is always treated as a literal value, never as SQL syntax." },
            { text: "Beyond SQL injection, what other input validation must a backend enforce?", category: "Security", answer: "Type validation, length limits, format checks (email, UUID), allowlisting over denylisting, HTML sanitization to prevent XSS, file type validation for uploads, numeric range checks." },
            { text: "ORMs abstract database access — explain what an ORM is and what the N+1 query problem is.", category: "Databases", answer: "ORM maps objects to DB rows. N+1: fetching a list then querying each item individually (1 query + N queries). Fix with eager loading (JOIN or include) to fetch related data in one query." },
            { text: "Database indexes dramatically speed up queries — explain how B-Tree indexes work and their trade-offs.", category: "Databases", answer: "B-Tree indexes maintain sorted keys in a balanced tree, enabling O(log n) lookups and efficient range queries. Trade-off: each index adds write overhead (INSERT/UPDATE/DELETE must update index) and storage cost." },
            { text: "To reduce database load, how do the main caching strategies (cache-aside, write-through, write-back) differ?", category: "Caching", answer: "Cache-aside: app checks cache first, loads from DB on miss. Write-through: write to cache and DB simultaneously. Write-back: write to cache, flush to DB asynchronously (risk of data loss on crash)." },
            { text: "How does rate limiting protect the backend API and what algorithms implement it?", category: "API", answer: "Rate limiting caps requests per time window per client. Token bucket: smooth bursts. Fixed window: simple but allows edge-case spikes. Sliding window log: precise. Store state in Redis for distributed systems." },
            { text: "How do you run database schema migrations safely in a production system with zero downtime?", category: "DevOps", answer: "Expand/Contract pattern: (1) add new column (nullable), (2) dual-write old+new, (3) backfill data, (4) switch reads to new column, (5) remove old column. Never deploy breaking schema changes with a single migration." },
            { text: "How do you structure error handling in a Node.js/Express backend so errors are consistent and observable?", category: "Architecture", answer: "Centralized error handler middleware catches all errors. Use typed error classes (NotFoundError, ValidationError). Return consistent JSON error schema. Log with correlation IDs. Never expose stack traces in production." }
        ],
        hard: [
            // Chain: message queue → delivery semantics → distributed lock → OAuth 2.0 → PKCE → normalization → CQRS → zero-downtime deploy
            { text: "Design a message queue system — what are the key components and delivery guarantees it must support?", category: "Architecture", answer: "Producers, brokers (partitioned topics), consumer groups. Delivery guarantees: at-most-once (fire-and-forget), at-least-once (ack after processing), exactly-once (idempotent producers + transactional consumers). Persist messages to disk. Replay from offset." },
            { text: "Message queues require consumers to be idempotent — how do you design an idempotent consumer?", category: "Architecture", answer: "Each message carries a unique ID. Consumer checks a processed-IDs store (Redis SET or DB unique index) before processing. If ID exists, skip. This makes duplicate delivery safe. Clear IDs after retention window." },
            { text: "When multiple consumers race to process the same resource, how do you implement a distributed lock?", category: "Distributed Systems", answer: "Redis SET key value NX PX ttl (atomic set-if-not-exists with TTL). Use the Redlock algorithm for multi-node Redis. ZooKeeper ephemeral nodes also work. Always include TTL to prevent deadlock if lock holder crashes." },
            { text: "Explain the OAuth 2.0 Authorization Code flow end-to-end — why is it the recommended flow for web apps?", category: "Auth", answer: "(1) Client redirects user to auth server with scope+state. (2) User authenticates, server issues auth code. (3) Client exchanges code for access+refresh tokens server-side. Tokens never exposed in browser. State param prevents CSRF." },
            { text: "Why should public clients (SPAs, mobile apps) use PKCE and how does it work?", category: "Auth", answer: "Public clients can't keep a secret. PKCE: client generates code_verifier (random), sends code_challenge=SHA256(verifier) with auth request. Server stores challenge. On token exchange, client sends verifier; server verifies. Prevents auth code interception." },
            { text: "Explain database normalization to 3NF and when you'd intentionally denormalize.", category: "Databases", answer: "1NF: atomic values, no repeating groups. 2NF: 1NF + all non-key columns depend on the whole PK. 3NF: 2NF + no transitive dependencies. Denormalize for read performance: pre-join data for reporting, materialized views, CQRS read models." },
            { text: "What is CQRS and when does separating read and write models provide real value?", category: "Architecture", answer: "Command Query Responsibility Segregation: separate models for writes (commands, normalized, consistent) and reads (queries, denormalized, optimized). Value when read/write patterns diverge significantly, read scalability is critical, or complex domain logic warrants event sourcing." },
            { text: "How do you deploy a new backend version with zero downtime in a containerized production environment?", category: "DevOps", answer: "Rolling deployment: incrementally replace old containers with new ones, health-check before routing traffic. Blue-Green: switch load balancer after new version passes smoke tests. Canary: send 5% traffic to new version, monitor, then expand. Use readiness probes to prevent premature traffic." }
        ]
    },
    'devops': {
        easy: [
            // Chain: version control → CI → CD → containers → IaC → networking → load balancing → monitoring
            { text: "What is Git and why is branching strategy important for a team?", category: "VCS", answer: "Git is a distributed VCS. Branching strategies (Gitflow, trunk-based) define how features, releases, and hotfixes are managed. Trunk-based development with feature flags reduces merge conflicts and enables continuous delivery." },
            { text: "What is Continuous Integration and what practices make a CI pipeline effective?", category: "CI/CD", answer: "CI: developers merge code frequently (daily); automated build and tests run on every push. Effective CI: fast pipeline (<10 min), comprehensive tests, failing builds block merges, clear notifications." },
            { text: "CI validates code — how does Continuous Delivery/Deployment extend this into production releases?", category: "CI/CD", answer: "CD: every passing build is deployable (Continuous Delivery) or automatically deployed (Continuous Deployment). Uses deployment pipelines with environment promotion (dev → staging → prod), approval gates, and automated smoke tests." },
            { text: "Modern deployments use containers — what is Docker and how does containerization improve consistency?", category: "Containers", answer: "Docker packages an app with its runtime, libraries, and config into an image. Containers run identically everywhere (dev, CI, prod). Eliminates 'works on my machine'. Images are versioned and immutable." },
            { text: "What is Infrastructure as Code and what problems does it solve compared to manual provisioning?", category: "IaC", answer: "IaC (Terraform, CloudFormation) defines infrastructure in version-controlled files. Eliminates config drift, enables reproducible environments, peer review for infra changes, and automated provisioning/destruction." },
            { text: "How does DNS resolution work from typing a URL to the browser receiving a response?", category: "Networking", answer: "Browser checks local cache → OS resolver → Recursive DNS resolver → Root NS → TLD NS → Authoritative NS returns IP. Browser connects via TCP+TLS, sends HTTP request, receives response." },
            { text: "What is a load balancer and what are the main load balancing algorithms?", category: "Networking", answer: "Routes traffic across server pool to prevent overload. Algorithms: Round Robin (sequential), Least Connections (route to least busy), IP Hash (sticky sessions), Weighted (capacity-based)." },
            { text: "How do you monitor an application in production and what are the key signals to track?", category: "Observability", answer: "USE method for infrastructure: Utilization, Saturation, Errors. RED method for services: Rate, Errors, Duration. Track via Prometheus+Grafana (metrics), ELK/Loki (logs), Jaeger (traces). Alert on SLO breach." }
        ],
        medium: [
            // Chain: Docker vs VMs → Kubernetes → K8s networking → deployments → rolling updates → blue-green → Terraform → secrets
            { text: "What are the key architectural differences between Docker containers and virtual machines?", category: "Containers", answer: "VMs virtualize hardware with a full OS per VM (heavy, slow boot). Containers share the host OS kernel, isolate at process level (lightweight, fast start). Containers are less isolated but far more efficient." },
            { text: "Kubernetes orchestrates containers — explain its core components: Pod, Deployment, Service, Ingress.", category: "Orchestration", answer: "Pod: smallest unit, 1+ containers sharing network/storage. Deployment: manages Pod replicas with rolling updates. Service: stable network endpoint for a set of Pods (ClusterIP, NodePort, LoadBalancer). Ingress: HTTP routing rules to Services." },
            { text: "How does networking work inside a Kubernetes cluster across nodes?", category: "Networking", answer: "Every Pod gets a unique IP. Pods communicate directly across nodes via CNI plugins (Calico, Flannel) without NAT. Services use kube-proxy to maintain iptables/IPVS rules. DNS (CoreDNS) resolves service names." },
            { text: "How does a Kubernetes rolling update work and how do readiness probes prevent bad deploys?", category: "Deployments", answer: "Rolling update replaces Pods incrementally. New Pod must pass the readiness probe (HTTP check, exec, or TCP) before old Pod is terminated and traffic is routed to the new one. Failed probes halt the rollout automatically." },
            { text: "Explain Blue-Green deployment — when is it preferable to rolling updates?", category: "Deployments", answer: "Blue-Green: maintain two identical environments. Switch load balancer after new (Green) passes smoke tests. Instant switch and instant rollback (flip back to Blue). Preferable when you can't tolerate mixed-version traffic or need clean rollback." },
            { text: "How does Terraform manage infrastructure state and what problems arise with team collaboration?", category: "IaC", answer: "Terraform stores state in a file (local or remote). State tracks real resources. Team issues: concurrent applies corrupt state (use remote state with locking in S3+DynamoDB), state drift if resources changed outside Terraform, secrets in state (use Vault or encrypted backends)." },
            { text: "How do you securely manage secrets (API keys, DB passwords) in a containerized production environment?", category: "Security", answer: "Never store secrets in code or images. Options: Kubernetes Secrets (base64, encrypt at rest with KMS), HashiCorp Vault (dynamic secrets, rotation, audit), AWS Secrets Manager/Parameter Store with IRSA. Inject as env vars or mounted files." },
            { text: "How do you implement observability for microservices running in Kubernetes?", category: "Observability", answer: "Metrics: Prometheus scrapes metrics endpoints, Grafana dashboards. Logs: structured JSON logs to stdout, aggregated via Fluentd/Loki. Traces: OpenTelemetry SDK instruments services, Jaeger/Tempo collects spans. Correlate via trace ID in all logs." }
        ],
        hard: [
            // Chain: resilient K8s → HPA → service mesh → split-brain → disaster recovery → SLO/SLA → chaos engineering → cost optimization
            { text: "Design a production-grade, resilient Kubernetes cluster architecture for a high-traffic application.", category: "Design", answer: "Multi-AZ control plane (3 masters). Worker nodes in multiple AZs with auto-scaling groups. Node affinity for critical workloads. PodDisruptionBudgets. Network policies (Calico). Ingress with TLS (cert-manager). Velero for cluster backups." },
            { text: "How does the Horizontal Pod Autoscaler work and what are its limitations?", category: "Scaling", answer: "HPA scales Pod replicas based on metrics (CPU, memory, custom via Prometheus Adapter). Control loop checks metrics every 15s and adjusts replicas within min/max bounds. Limitations: doesn't scale to zero (use KEDA), slow to react to sudden spikes, doesn't handle stateful apps well." },
            { text: "What is a Service Mesh and what problems does Istio/Linkerd solve that Kubernetes alone doesn't?", category: "Architecture", answer: "Service mesh uses sidecar proxies to handle service-to-service traffic. Provides: mutual TLS (mTLS) encryption, fine-grained traffic routing (canary, circuit breaking), observability (distributed tracing, metrics) without app code changes." },
            { text: "A network partition causes a split-brain scenario in your distributed cluster — how do you design against it?", category: "Networking", answer: "Use quorum-based consensus (Raft, Paxos) requiring majority agreement. Fencing prevents split-brain nodes from writing (STONITH for VMs, lease-based fencing for distributed DBs). Odd number of nodes ensures majority. Design for partition tolerance explicitly." },
            { text: "Design a disaster recovery plan defining RTO and RPO for a critical production system.", category: "Strategy", answer: "RTO (Recovery Time Objective): max downtime tolerated. RPO (Recovery Point Objective): max data loss tolerated. DR strategies: Backup/Restore (cheapest, highest RTO/RPO), Pilot Light (minimal standby), Warm Standby (scaled-down replica), Multi-Site Active-Active (lowest RTO/RPO, highest cost)." },
            { text: "How do you define, measure, and alert on SLOs to balance reliability with velocity?", category: "Reliability", answer: "SLI (metric, e.g. p99 latency) → SLO (target, e.g. 99.9% requests <200ms) → Error Budget (allowed downtime). Alert when error budget burn rate is high. Use error budget to gate risky deployments. Prioritize reliability work when budget is exhausted." },
            { text: "What is chaos engineering and how do you implement it safely in production?", category: "Reliability", answer: "Chaos engineering deliberately injects failures (Chaos Monkey, Gremlin, LitmusChaos) to find weaknesses before they cause outages. Run experiments in production during low-traffic hours with a hypothesis, blast radius limit, and rollback plan. Gamedays for team practice." },
            { text: "How do you optimize Kubernetes infrastructure costs without sacrificing reliability?", category: "Cost", answer: "Right-size resource requests/limits (VPA). Use Spot/Preemptible instances for stateless workloads (with graceful interruption handling). Cluster autoscaler to remove idle nodes. Consolidate low-utilization workloads. Use ARM-based instances where compatible. Cost-attribution via labels." }
        ]
    },
    'data-science': {
        easy: [
            // Chain: supervised/unsupervised → classification vs regression → overfitting → train/test split → cross-validation → bias-variance → p-value → feature engineering
            { text: "What is the difference between supervised and unsupervised learning, and when do you use each?", category: "ML Basics", answer: "Supervised uses labeled data to learn a mapping from inputs to outputs (classification, regression). Unsupervised finds hidden structure in unlabeled data (clustering, dimensionality reduction). Semi-supervised combines both." },
            { text: "Within supervised learning, what distinguishes a classification problem from a regression problem?", category: "ML Basics", answer: "Classification predicts discrete class labels (spam/not spam, cat/dog). Regression predicts continuous numerical values (house price, temperature). Choice of model and evaluation metrics differs accordingly." },
            { text: "A model performs perfectly on training data but fails on new data — what is this called and why does it happen?", category: "ML Basics", answer: "Overfitting: the model memorizes training noise rather than learning the underlying pattern. Caused by excessive model complexity relative to data size. Fix: regularization, more data, simpler model, dropout, early stopping." },
            { text: "To detect overfitting, you split your data — explain the train/validation/test split and the role of each.", category: "Training", answer: "Train: learn model parameters. Validation: tune hyperparameters and compare models (used during development). Test: final unbiased evaluation, touched only once. Never use test set for model selection." },
            { text: "Cross-validation gives a more reliable estimate than a single split — explain k-fold cross-validation.", category: "Training", answer: "Split data into k equal folds. Train on k-1 folds, evaluate on the remaining fold. Repeat k times. Average the k scores. Gives a less biased estimate of generalization performance. Stratified k-fold preserves class distribution." },
            { text: "Explain the bias-variance tradeoff and its relationship to overfitting and underfitting.", category: "Theory", answer: "High bias (underfitting): model too simple, misses patterns. High variance (overfitting): model too complex, fits noise. Ideal model balances both. Total error = bias² + variance + irreducible noise. Regularization trades variance for bias." },
            { text: "What is a p-value and what does it tell you (and not tell you) in hypothesis testing?", category: "Statistics", answer: "p-value: probability of seeing results at least as extreme as observed, assuming the null hypothesis is true. p < 0.05 rejects null. Does NOT measure effect size, practical significance, or probability the null is true." },
            { text: "What is feature engineering and why can it matter more than model choice?", category: "Data Prep", answer: "Feature engineering: transforming raw data into informative representations. Includes: encoding categoricals, creating interaction terms, log-transforming skewed features, extracting time-based features. Good features often outperform complex models on poor features." }
        ],
        medium: [
            // Chain: decision trees → random forest → gradient boosting → gradient descent → imbalanced data → metrics → PCA → feature selection
            { text: "How does a decision tree work and what are its main failure modes?", category: "Algorithms", answer: "Decision tree recursively splits data on features that maximize information gain (or Gini impurity). Failure modes: overfitting (deep trees), instability (small data changes produce different trees), poor performance on continuous features." },
            { text: "Random Forest addresses decision tree weaknesses — explain how it works and why bagging reduces variance.", category: "Algorithms", answer: "Random Forest: ensemble of trees, each trained on a bootstrapped sample with a random feature subset. Averaging predictions reduces variance without increasing bias (law of large numbers). Feature randomness decorrelates trees." },
            { text: "Gradient Boosting is often more accurate than Random Forest — explain how it builds an ensemble sequentially.", category: "Algorithms", answer: "Gradient Boosting builds trees sequentially, each fitting the residual errors of the previous ensemble. Uses gradient descent in function space to minimize a loss function. XGBoost/LightGBM add regularization, leaf-wise growth, and optimized computation." },
            { text: "Gradient descent optimizes model parameters — explain SGD, mini-batch, and adaptive optimizers (Adam).", category: "Optimization", answer: "SGD: update weights on each sample (noisy, fast). Mini-batch: update on batches (balances noise and stability). Adam: adaptive learning rates per parameter using running averages of gradients and squared gradients. Handles sparse features well." },
            { text: "Your training data has 95% negative, 5% positive examples — how do you handle this class imbalance?", category: "Data Prep", answer: "Resampling: oversample minority (SMOTE) or undersample majority. Class weights in loss function. Use appropriate metrics (F1, AUC-ROC, precision-recall curve instead of accuracy). Threshold tuning on calibrated probabilities." },
            { text: "What do precision, recall, F1, and AUC-ROC measure, and when would you prioritize each?", category: "Evaluation", answer: "Precision: fraction of predicted positives that are correct (important when FP is costly). Recall: fraction of actual positives caught (important when FN is costly). F1: harmonic mean of both. AUC-ROC: overall ranking ability across thresholds." },
            { text: "What is PCA and when should you use it (and when should you avoid it)?", category: "Dimensionality", answer: "PCA projects data onto orthogonal axes (principal components) capturing maximum variance. Use for: dimensionality reduction, visualization, removing multicollinearity. Avoid when: interpretability is critical, features are categorical, or non-linear structure matters." },
            { text: "How do you select which features to include in a model and avoid the curse of dimensionality?", category: "Feature Selection", answer: "Filter methods: correlation, mutual information. Wrapper methods: recursive feature elimination. Embedded methods: L1 regularization (Lasso), tree feature importance. Dimensionality reduction (PCA). Rule of thumb: at least 10-20 samples per feature." }
        ],
        hard: [
            // Chain: CNN → transfer learning → Transformer → attention → backprop → RL → recommendation → MLOps
            { text: "How does a Convolutional Neural Network (CNN) extract hierarchical features from images?", category: "Deep Learning", answer: "Convolutional layers apply learned filters (kernels) across the input, detecting local patterns. Pooling reduces spatial dimensions (max/avg pool). Stacking layers builds hierarchy: edges → textures → parts → objects. Fully connected layers at the end for classification." },
            { text: "Training CNNs from scratch requires massive data — explain transfer learning and fine-tuning strategies.", category: "Deep Learning", answer: "Pre-trained model (ImageNet) captures general features. Transfer learning: freeze all layers, replace head, train only head (little data). Fine-tuning: unfreeze later layers and train with a small LR (more data). Discriminative LRs: smaller LR for early layers." },
            { text: "The Transformer architecture replaced RNNs for sequence tasks — explain self-attention and why it works better.", category: "NLP", answer: "Self-attention computes a weighted sum of all positions in a sequence for each position, allowing direct modeling of long-range dependencies. Unlike RNNs, it's parallelizable. Scaled dot-product attention: Q·Kᵀ/√d gives attention weights, applied to V." },
            { text: "Multi-head attention is central to Transformers — why use multiple heads and how are they combined?", category: "NLP", answer: "Multiple heads allow the model to attend to different aspects of the input simultaneously (syntax, semantics, coreference). Each head has its own Q/K/V projections. Outputs are concatenated and linearly projected. Enables richer representation." },
            { text: "Explain the backpropagation algorithm — how do gradients flow through a neural network?", category: "Math", answer: "Forward pass: compute predictions and loss. Backward pass: apply chain rule to compute gradient of loss with respect to each weight. Gradients flow from output to input through the computation graph. Vanishing gradients fixed by ReLU, residual connections, batch norm." },
            { text: "Explain reinforcement learning — what are the key components and how does Q-learning work?", category: "RL", answer: "Agent, environment, state, action, reward, policy. Q-learning: off-policy TD algorithm learning Q(s,a)=expected future reward. Bellman equation: Q(s,a) = r + γ max Q(s',a'). Deep Q-Networks (DQN) use neural nets to approximate Q for large state spaces." },
            { text: "Design a production recommendation engine — what approaches would you combine and why?", category: "System Design", answer: "Collaborative filtering: user-item matrix factorization (ALS, SVD). Content-based: item features. Hybrid: weighted or learned combination. Two-stage: candidate generation (ANN retrieval) then ranking (gradient boosted or deep neural ranker). Cold start: popularity-based fallback." },
            { text: "How do you productionize an ML model reliably — what does a good MLOps pipeline look like?", category: "MLOps", answer: "Data validation (Great Expectations), feature store (Feast), experiment tracking (MLflow), model registry, CI/CD for model training/testing, canary deployment, monitoring for data drift (KS test, PSI) and prediction drift, automated retraining triggers." }
        ]
    },
    'leadership': {
        easy: [
            // Chain: culture definition → psychological safety → management style → 1:1s → feedback → hiring → onboarding → delegation
            { text: "What does a healthy engineering culture look like and how do you recognize when it's broken?", category: "Culture", answer: "Healthy: blameless post-mortems, continuous learning, high psychological safety, transparent communication, focus on impact over activity. Broken signals: blame culture, knowledge hoarding, fear of speaking up, high attrition, low experimentation." },
            { text: "You mentioned psychological safety — what is it concretely and how do you build it on a team?", category: "Culture", answer: "Belief that one won't be punished for speaking up with ideas, questions, or mistakes. Build it by: modeling vulnerability, responding to bad news with curiosity not blame, celebrating learning from failure, creating structured feedback rituals." },
            { text: "How does your personal management style create that psychological safety day-to-day?", category: "Style", answer: "Servant leadership: remove blockers, shield from politics, manage outcomes not hours. Be predictable and fair. Default to trust. Give context (the 'why') so the team can make autonomous decisions. Manage up to protect the team's focus." },
            { text: "The 1:1 is your most important management tool — how do you structure effective 1:1 meetings?", category: "Management", answer: "Their agenda first, not yours. Cover: blockers, career development, feedback (both directions), wellbeing. Ask open-ended questions. Take notes and follow through on commitments. Adjust cadence based on seniority and need." },
            { text: "Feedback is critical — how do you give constructive feedback that actually changes behavior?", category: "Management", answer: "SBI model: Situation (when/where), Behavior (what they did, observable), Impact (effect on team/project). Be specific, timely, private. Focus on behavior not character. Ask for their perspective. Co-create an action plan." },
            { text: "A strong team starts with great hiring — describe your approach to structured engineering interviews.", category: "Hiring", answer: "Define rubric before interviewing. Use consistent questions across candidates. Score independently before debrief. Assess: technical ability, problem-solving approach, communication, collaboration, growth trajectory. Avoid bias: diverse panels, blind resume review where possible." },
            { text: "You've hired great people — how do you design an onboarding program that gets engineers productive fast?", category: "Onboarding", answer: "30-60-90 day plan with clear milestones. Assign an onboarding buddy (not the manager). First PR within the first week on a real (small) task. Gradually increase scope. Regular check-ins on confusion points. Documentation of tribal knowledge." },
            { text: "As engineers ramp up, how do you delegate effectively without micromanaging or abandoning them?", category: "Management", answer: "Match delegation level to the person's skill and context: direct (new/complex), coach (developing), support (skilled, new domain), delegate fully (trusted expert). Set clear outcomes and constraints, not step-by-step instructions. Check in on progress, not process." }
        ],
        medium: [
            // Chain: underperformance → IC to manager → business alignment → conflict resolution → innovation → technical strategy → cross-team influence → team health
            { text: "How do you diagnose and address an underperforming engineer — is it always a performance issue?", category: "Performance", answer: "First diagnose root cause: skill gap, unclear expectations, personal issues, wrong role, or toxic environment. Communicate specific gaps with examples. Co-create an improvement plan with measurable goals and timeline. Provide support and check-ins. PIP only after genuine coaching effort fails." },
            { text: "One of your best ICs wants to become a manager — how do you help them transition successfully?", category: "Growth", answer: "Start with mentoring responsibilities, then tech lead role. Proxy management tasks (1:1s, sprint planning). Train on feedback, coaching, conflict resolution. Redefine success metrics: team output, retention, growth of reports — not personal code output. Provide a safety net to return to IC if it's not the right fit." },
            { text: "How do you ensure your engineering team's work is aligned with business goals without turning engineers into ticket-takers?", category: "Strategy", answer: "Translate company OKRs into engineering initiatives collaboratively. Involve engineers in product discovery and customer conversations. Communicate the 'why' behind every initiative. Let engineers propose solutions. Measure outcomes (business impact), not outputs (features shipped)." },
            { text: "Two senior engineers have a strong technical disagreement that's blocking the team — how do you resolve it?", category: "Conflict", answer: "Listen to both perspectives independently first. Facilitate a structured discussion focused on trade-offs, not opinions. Define decision criteria (performance, maintainability, timeline). If no consensus, use a decision framework (DACI) and make the call transparently. Document the decision and rationale." },
            { text: "How do you create space for innovation when the team is under constant delivery pressure?", category: "Culture", answer: "Protect dedicated time (20% time, hack weeks). Celebrate calculated risks even when they fail. Create low-friction demo rituals. Connect innovation to real customer problems so it doesn't feel wasteful. Shield exploratory work from sprint commitments." },
            { text: "How do you set technical strategy for your team while empowering engineers to own the architecture?", category: "Strategy", answer: "Define guardrails and principles (not prescriptive solutions). Facilitate RFCs and architecture decision records. Let the team propose and debate. Your role: ask hard questions, ensure long-term thinking, break deadlocks. Own the vision, delegate the decisions." },
            { text: "How do you influence teams and stakeholders outside your direct reporting line?", category: "Influence", answer: "Build relationships before you need them. Lead with data and shared goals, not authority. Write clear proposals (RFC, one-pager). Find champions in other teams. Show willingness to compromise on non-essentials. Follow through on commitments to build trust capital." },
            { text: "What signals tell you a team is unhealthy, and how do you intervene before it's too late?", category: "Health", answer: "Signals: increasing attrition, declining velocity, passive meetings, lack of disagreement (false harmony), skipping retros, one person doing all the work. Intervene: anonymous pulse surveys, skip-level 1:1s, facilitate a candid team health check, address structural issues (workload, clarity, toxic individuals)." }
        ],
        hard: [
            // Chain: scaling org → layoffs → brilliant jerk → leveling framework → legacy rewrite → org design → exec communication → long-term vision
            { text: "How do you scale an engineering organization from 10 to 50 engineers without losing velocity or culture?", category: "Scaling", answer: "Introduce engineering managers at ~7 reports each. Create squads aligned to product areas. Standardize hiring bar and process. Invest in onboarding docs and developer experience. Establish architecture review and RFC processes. Preserve culture through rituals, not rules." },
            { text: "You must reduce your team by 20% due to business conditions — walk through your approach.", category: "Crisis", answer: "Use objective criteria (role necessity, skill alignment, performance data — never tenure or likability). Communicate with radical transparency, empathy, and speed (no slow drip). Provide generous severance and outplacement support. Immediately address remaining team: explain the 'why', acknowledge the pain, over-communicate the path forward." },
            { text: "A 10x engineer is also toxic to the team — they deliver but demoralize everyone around them. What do you do?", category: "Culture", answer: "Address behavior immediately with specific examples (SBI). Set clear, documented expectations. Monitor for change with a short timeline (2-4 weeks). If behavior doesn't change, terminate — the cost to team output, retention, and culture always exceeds the individual's contribution. No exceptions." },
            { text: "Design an engineering career ladder and leveling framework from IC1 through Principal Engineer.", category: "Strategy", answer: "Define axes: scope (task → org-wide), complexity (well-defined → ambiguous), leadership (self → industry), impact (individual → business-critical). Each level maps to expectations on all axes. Separate IC and management tracks with equal seniority. Include concrete examples. Calibrate across teams." },
            { text: "How do you manage a legacy system rewrite that the business depends on daily?", category: "Architecture", answer: "Strangler Fig pattern: build new service alongside old, gradually redirect traffic. Never stop product momentum. Use feature flags for incremental rollout. Dual-write during migration. Measure parity before decommissioning. Communicate timeline and risks to stakeholders continuously." },
            { text: "How do you design an engineering org structure as the company goes from one product to a platform with multiple products?", category: "Org Design", answer: "Separate platform teams (shared infrastructure, APIs) from product teams (vertical feature delivery). Platform teams serve internal customers with SLAs. Product teams own end-to-end delivery. Avoid: matrix management, shared ownership without clear accountability. Use Team Topologies (stream-aligned, platform, enabling, complicated-subsystem)." },
            { text: "How do you communicate technical strategy and trade-offs to non-technical executives effectively?", category: "Communication", answer: "Lead with business impact, not technical details. Use analogies. Quantify risk and opportunity cost. Present options with trade-offs, not a single recommendation. Use visuals over text. Anticipate their concerns (cost, timeline, risk). Build credibility through accurate forecasting over time." },
            { text: "How do you develop and communicate a 3-year technical vision for your engineering organization?", category: "Vision", answer: "Assess current state honestly (strengths, debt, gaps). Align with business strategy. Define target architecture, capabilities, and team shape. Identify 3-5 strategic bets. Communicate through a living tech strategy doc, not a slide deck. Revisit quarterly. Get buy-in by involving senior ICs in crafting the vision." }
        ]
    },
    'security': {
        easy: [
            // Chain: encryption → symmetric vs asymmetric → hashing → social engineering → phishing → MFA → passwords → XSS
            { text: "What is encryption and why is it fundamental to all of cybersecurity?", category: "Basics", answer: "Encryption converts readable plaintext into unreadable ciphertext using an algorithm and key. It protects data confidentiality at rest (stored) and in transit (network). Without encryption, any intercepted data is immediately readable." },
            { text: "There are two main encryption approaches — explain the difference between symmetric and asymmetric encryption.", category: "Crypto", answer: "Symmetric: one shared key for encrypt and decrypt (AES) — fast, used for bulk data. Asymmetric: public key encrypts, private key decrypts (RSA, ECC) — slower, used for key exchange and digital signatures. TLS uses both: asymmetric for handshake, symmetric for data." },
            { text: "Hashing is often confused with encryption — what is hashing and how is it used in security?", category: "Crypto", answer: "Hashing is a one-way function producing a fixed-size digest (SHA-256, bcrypt). Unlike encryption, it cannot be reversed. Used for: password storage (with salt), data integrity verification (checksums), digital signatures, blockchain." },
            { text: "Not all attacks are technical — what is social engineering and why is it the most common attack vector?", category: "Threats", answer: "Social engineering manipulates people into revealing information or taking actions. Exploits trust, urgency, authority, or fear. Most breaches start with human error. Technical controls alone cannot prevent it — requires security awareness training." },
            { text: "Phishing is the most common social engineering attack — how does it work and how do you defend against it?", category: "Threats", answer: "Attacker impersonates a trusted entity via email, SMS, or fake websites to steal credentials or install malware. Defense: email filtering (SPF, DKIM, DMARC), link scanning, user training, reporting mechanisms, browser warnings." },
            { text: "Even if credentials are stolen, MFA can save you — explain Multi-Factor Authentication and its factors.", category: "Auth", answer: "MFA requires 2+ factors: knowledge (password), possession (phone, hardware key), inherence (biometrics). TOTP and hardware keys (FIDO2/WebAuthn) are stronger than SMS (vulnerable to SIM swapping). MFA blocks 99%+ of automated credential attacks." },
            { text: "Passwords are still the weakest link — what makes a password policy secure without being user-hostile?", category: "Auth", answer: "NIST guidelines: minimum 8 chars, check against breached password lists, no forced rotation (unless breach), allow passphrases, no complexity rules that lead to predictable patterns. Encourage password managers. Enforce MFA as the real security layer." },
            { text: "What is Cross-Site Scripting (XSS) and what are the three main types?", category: "Web Sec", answer: "XSS injects malicious scripts into web pages viewed by others. Stored XSS: persisted in DB (most dangerous). Reflected XSS: in URL parameters, reflected back. DOM-based XSS: client-side JS manipulation. Prevent with output encoding, CSP headers, and input sanitization." }
        ],
        medium: [
            // Chain: CSRF → input validation → SQL injection → API security → OAuth risks → session management → WAF → vulnerability scanning
            { text: "What is CSRF and how does it differ from XSS in terms of attack mechanism and prevention?", category: "Web Sec", answer: "CSRF tricks an authenticated user's browser into making unwanted requests (using their cookies). Unlike XSS (injecting scripts), CSRF exploits the server's trust in the browser. Prevent with anti-CSRF tokens (synchronizer pattern), SameSite cookies, and verifying Origin/Referer headers." },
            { text: "CSRF exploits insufficient validation — what comprehensive input validation should every backend implement?", category: "Security", answer: "Validate on server side (never trust client). Type checking, length limits, allowlist for expected values, regex for formats (email, UUID). Sanitize HTML to prevent XSS. Parameterize queries to prevent SQLi. Validate file uploads (type, size, content sniffing). Reject unexpected fields." },
            { text: "SQL injection bypasses input validation — explain how prepared statements prevent it and give an attack example.", category: "Security", answer: "Attack: input ' OR 1=1 -- turns SELECT * FROM users WHERE name='input' into returning all rows. Prepared statements separate SQL structure from data: the database compiles the query first, then binds user input as literal values, making injection impossible." },
            { text: "How do you comprehensively secure a REST API beyond just authentication?", category: "API", answer: "HTTPS everywhere. Auth: JWT with short expiry + refresh tokens. AuthZ: RBAC or ABAC per endpoint. Rate limiting per client. Input validation. CORS with specific origins. Request size limits. Audit logging. API versioning. Use an API gateway for centralized policy enforcement." },
            { text: "OAuth 2.0 has known security pitfalls — what are the most critical vulnerabilities and how do you mitigate them?", category: "Auth", answer: "Token leakage via URL fragments or logs (use Authorization Code + PKCE). Open redirect via unvalidated redirect_uri (strict allowlist). CSRF on callback (state parameter). Token replay (use short-lived tokens, audience validation). Insufficient scope restriction (principle of least privilege)." },
            { text: "How do you implement secure session management to prevent session hijacking and fixation?", category: "Web Sec", answer: "Generate cryptographically random session IDs. Set cookies with HttpOnly, Secure, SameSite=Strict flags. Rotate session ID after login (prevents fixation). Set reasonable expiration. Invalidate on logout (server-side). Store sessions server-side, not in cookies." },
            { text: "What is a WAF and how does it complement (not replace) application-level security?", category: "Network", answer: "Web Application Firewall inspects HTTP traffic for attack patterns (SQLi, XSS, path traversal). Deployed as reverse proxy. Provides defense-in-depth but can be bypassed with encoding tricks. Not a substitute for secure code — it's a safety net, not a primary defense." },
            { text: "How do you implement a vulnerability management program for a production application?", category: "Process", answer: "Dependency scanning (Snyk, Dependabot) in CI/CD. SAST (static analysis) for code vulnerabilities. DAST (dynamic scanning) against staging. Container image scanning. SLA for patching: critical within 24h, high within 7d. Track CVEs. Regular penetration testing (annual minimum)." }
        ],
        hard: [
            // Chain: TLS deep dive → certificate pinning → key management → Zero Trust → threat modeling → incident response → ransomware → secure SDLC
            { text: "Walk through the TLS 1.3 handshake step by step — how does it establish a secure connection?", category: "Network", answer: "Client Hello: supported cipher suites + key share (Diffie-Hellman). Server Hello: chosen cipher + key share + certificate. Client verifies certificate chain to trusted CA. Both derive session keys from shared secret. 1-RTT handshake (vs 2-RTT in TLS 1.2). Forward secrecy: compromising long-term key doesn't decrypt past sessions." },
            { text: "How does certificate pinning work and when should (and shouldn't) you use it?", category: "Network", answer: "Pinning hardcodes expected certificate or public key in the client, rejecting any other cert even if CA-signed. Prevents MITM with rogue CA certs. Use for: mobile apps to known APIs. Avoid for: websites (breaks with cert rotation), third-party APIs. Risks: bricking clients if pin rotates without app update." },
            { text: "Design a secure key management system for a cloud-native application handling sensitive financial data.", category: "Architecture", answer: "Envelope encryption: data encrypted with DEK, DEK encrypted with KEK stored in HSM (AWS KMS, HashiCorp Vault). Automatic key rotation on schedule. Separate keys per tenant. IAM policies restrict access to keys. Audit all key access. Never store keys in code, config, or alongside encrypted data." },
            { text: "Explain Zero Trust Architecture in depth — how do you implement it across network, identity, and data layers?", category: "Architecture", answer: "Network: micro-segmentation, no implicit trust between services, mutual TLS everywhere. Identity: continuous authentication, device posture checks, just-in-time access. Data: classify and encrypt sensitive data, DLP policies, least-privilege access. Assume breach: detect lateral movement, enforce per-request authorization." },
            { text: "How do you perform a structured threat modeling exercise using STRIDE for a new microservices system?", category: "Process", answer: "Draw data flow diagram (DFD) of the system. For each component and data flow, evaluate STRIDE threats: Spoofing (auth), Tampering (integrity), Repudiation (audit), Information Disclosure (encryption), Denial of Service (rate limiting), Elevation of Privilege (authz). Rank by risk (likelihood x impact). Define mitigations. Validate with pen testing." },
            { text: "A security incident is detected — walk through your incident response process from detection to post-mortem.", category: "Incident Response", answer: "Phases: (1) Detection & triage: confirm incident, assess severity. (2) Containment: isolate affected systems, preserve evidence. (3) Eradication: identify root cause, remove threat. (4) Recovery: restore from clean backups, monitor for re-compromise. (5) Post-mortem: blameless timeline, lessons learned, action items. Communicate to stakeholders throughout." },
            { text: "Your organization is hit by ransomware that encrypted the production database — what is your response plan?", category: "Incident Response", answer: "Do NOT pay ransom (no guarantee of recovery, funds future attacks). Isolate all affected systems from network. Determine entry vector (phishing, RDP, supply chain). Restore from immutable offline backups (tested regularly). Forensic analysis of attacker persistence. Notify legal, authorities (FBI/CERT), and affected customers per regulations. Harden defenses post-incident." },
            { text: "How do you build security into the entire SDLC rather than treating it as a gate at the end?", category: "Process", answer: "Shift-left security: threat modeling in design, SAST/SCA in CI pipeline, security unit tests, pre-commit hooks for secrets scanning. Security champions program (trained developer per team). Automated DAST in staging. Pen testing before major releases. Security retrospectives. Blameless vulnerability reporting culture." }
        ]
    }
};

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Load dark mode preference
    if (state.isDarkMode) {
        document.body.classList.add('dark-mode');
        document.querySelector('.btn-theme').textContent = '☀️';
    }

    // Load user from localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        state.currentUser = JSON.parse(savedUser);
        updateAuthUI();
    }

    // Sync stats from interviews
    syncUserStats();

    // Set home as active page
    navigateTo('home');
    updateCharts();
}

function syncUserStats() {
    const interviews = state.userStats.interviews;
    if (interviews.length === 0) {
        state.userStats.totalInterviews = 0;
        state.userStats.avgScore = 0;
        state.userStats.streak = 0;
        state.userStats.topicsMastered = 0;
        return;
    }

    state.userStats.totalInterviews = interviews.length;
    const totalScore = interviews.reduce((sum, item) => sum + item.score, 0);
    state.userStats.avgScore = Math.round(totalScore / interviews.length);
    
    // Calculate streak (consecutive days)
    const dates = [...new Set(interviews.map(i => i.date))].sort();
    let streak = 0;
    if (dates.length > 0) {
        streak = 1;
        for (let i = dates.length - 1; i > 0; i--) {
            const d1 = new Date(dates[i]);
            const d2 = new Date(dates[i-1]);
            const diff = (d1 - d2) / (1000 * 60 * 60 * 24);
            if (diff === 1) streak++;
            else break;
        }
    }
    state.userStats.streak = streak;

    // Calculate topics mastered (score >= 85)
    const topicScores = {};
    interviews.forEach(i => {
        if (!topicScores[i.type] || i.score > topicScores[i.type]) {
            topicScores[i.type] = i.score;
        }
    });
    state.userStats.topicsMastered = Object.values(topicScores).filter(s => s >= 85).length;
}

// ========== NAVIGATION ==========
function navigateTo(page) {
    console.log(`Navigating to: ${page}`);
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    // Show selected page
    const selectedPage = document.getElementById(page);
    if (selectedPage) {
        selectedPage.classList.add('active');
    }

    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === page) {
            link.classList.add('active');
        }
    });

    state.currentPage = page;

    // Handle page-specific logic
    switch (page) {
        case 'dashboard':
            if (!state.currentUser) {
                console.warn('Redirecting to login: No current user for dashboard');
                navigateTo('login');
                return;
            }
            updateDashboard();
            break;
        case 'interview':
            if (!state.currentUser) {
                console.warn('Redirecting to login: No current user for interview');
                navigateTo('login');
                return;
            }
            break;
    }

    window.scrollTo(0, 0);
    return false;
}

// ========== AUTHENTICATION ==========
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Load registered users from localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
    
    // Add demo user to list if not present
    const demoUserEmail = 'email@test.com';
    const hasDemo = registeredUsers.some(u => u.email === demoUserEmail);
    if (!hasDemo) {
        registeredUsers.push({ name: 'Demo User', email: demoUserEmail, password: 'password', role: 'backend' });
        localStorage.setItem('registered_users', JSON.stringify(registeredUsers));
    }

    // Verify credentials
    const user = registeredUsers.find(u => u.email === email && u.password === password);

    if (user) {
        state.currentUser = { name: user.name, email: user.email, role: user.role };
        localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
        updateAuthUI();
        navigateTo('dashboard');
    } else {
        alert('Invalid email or password. Please try again or sign up.');
    }
}

function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const role = document.getElementById('signupRole').value;

    const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
    
    if (registeredUsers.some(u => u.email === email)) {
        alert('Email already registered! Please log in.');
        return;
    }

    const newUser = { name, email, password, role };
    registeredUsers.push(newUser);
    localStorage.setItem('registered_users', JSON.stringify(registeredUsers));

    // Auto login after signup
    state.currentUser = { name, email, role };
    localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
    updateAuthUI();
    navigateTo('dashboard');
}

function logout() {
    state.currentUser = null;
    localStorage.removeItem('currentUser');
    updateAuthUI();
    navigateTo('home');
}

function updateAuthUI() {
    const authBtn = document.getElementById('authBtn');
    const userMenu = document.getElementById('userMenu');
    const dashboardLink = document.querySelector('[data-page="dashboard"]');
    const interviewLink = document.querySelector('[data-page="interview"]');
    const resultsLink = document.querySelector('[data-page="results"]');

    if (state.currentUser) {
        authBtn.style.display = 'none';
        userMenu.style.display = 'flex';
        document.getElementById('userName').textContent = state.currentUser.name;
        dashboardLink.style.display = 'block';
        interviewLink.style.display = 'block';
        resultsLink.style.display = 'block';
    } else {
        authBtn.style.display = 'block';
        userMenu.style.display = 'none';
        dashboardLink.style.display = 'none';
        interviewLink.style.display = 'none';
        resultsLink.style.display = 'none';
    }
}

// ========== DASHBOARD ==========
function updateDashboard() {
    syncUserStats(); // Re-sync before updating
    document.getElementById('totalInterviews').textContent = state.userStats.totalInterviews;
    document.getElementById('avgScore').textContent = state.userStats.avgScore;
    document.getElementById('currentStreak').textContent = state.userStats.streak;
    document.getElementById('topicsMastered').textContent = state.userStats.topicsMastered;
    
    updateCharts();
}

function updateCharts() {
    drawScoreChart();
    drawTopicsChart();
}

function drawScoreChart() {
    const canvas = document.getElementById('scoreChart');
    const ctx = canvas.getContext('2d');
    
    // Get real data from interviews
    const interviews = [...state.userStats.interviews].sort((a,b) => new Date(a.date) - new Date(b.date));
    const data = interviews.length > 7 ? interviews.slice(-7).map(i => i.score) : 
                interviews.length > 0 ? interviews.map(i => i.score) : [0];
    const labels = interviews.length > 7 ? interviews.slice(-7).map(i => i.date.split('/').slice(0,2).join('/')) :
                  interviews.length > 0 ? interviews.map(i => i.date.split('/').slice(0,2).join('/')) : ['None'];

    const padding = 40;
    const width = canvas.width - 2 * padding;
    const height = canvas.height - 2 * padding;
    const maxScore = 100;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (interviews.length === 0) {
        ctx.fillStyle = '#64748b';
        ctx.textAlign = 'center';
        ctx.fillText('No interview history yet', canvas.width / 2, canvas.height / 2);
        return;
    }

    // Draw axes
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();

    // Draw grid lines and labels
    ctx.fillStyle = '#64748b';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';
    
    for (let i = 0; i <= 5; i++) {
        const y = padding + (height / 5) * i;
        ctx.strokeStyle = '#f1f5f9';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();
        
        ctx.fillText(100 - (i * 20), padding - 10, y + 4);
    }

    // Draw data line
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    const stepX = data.length > 1 ? width / (data.length - 1) : 0;
    data.forEach((value, i) => {
        const x = padding + stepX * i;
        const y = padding + height - (value / maxScore) * height;
        
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw points
    ctx.fillStyle = '#6366f1';
    data.forEach((value, i) => {
        const x = padding + stepX * i;
        const y = padding + height - (value / maxScore) * height;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw x labels
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'center';
    labels.forEach((label, i) => {
        const x = padding + stepX * i;
        ctx.fillText(label, x, canvas.height - padding + 20);
    });
}

function drawTopicsChart() {
    const topicsChart = document.getElementById('topicsChart');
    topicsChart.innerHTML = '';
    
    const interviews = state.userStats.interviews;
    if (interviews.length === 0) {
        topicsChart.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #64748b;">No data yet</p>';
        return;
    }

    const topicStats = {};
    interviews.forEach(i => {
        if (!topicStats[i.type]) topicStats[i.type] = { scores: [], sum: 0 };
        topicStats[i.type].scores.push(i.score);
        topicStats[i.type].sum += i.score;
    });

    Object.keys(topicStats).forEach(type => {
        const avg = Math.round(topicStats[type].sum / topicStats[type].scores.length);
        const item = document.createElement('div');
        item.className = 'topic-item';
        item.innerHTML = `
            <strong>${avg}</strong>
            <small>${type.charAt(0).toUpperCase() + type.slice(1)}</small>
        `;
        topicsChart.appendChild(item);
    });
}

function showHistory() {
    const modal = document.getElementById('historyModal');
    const historyList = document.getElementById('historyList');
    document.querySelector('#historyModal h3').textContent = 'Interview History';
    
    const interviews = state.userStats.interviews.slice(0, 10);
    
    historyList.innerHTML = interviews.length > 0 
        ? interviews.map(interview => `
            <div class="history-item">
                <strong>${interview.type} Interview (${interview.difficulty})</strong>
                <small>Score: ${interview.score} | ${interview.date}</small>
            </div>
        `).join('')
        : '<p style="text-align: center; color: #64748b;">No interviews yet. Start practicing!</p>';
    
    modal.style.display = 'flex';
}

function showWeakTopics() {
    const interviews = state.userStats.interviews;
    const topicStats = {};
    interviews.forEach(i => {
        if (!topicStats[i.type]) topicStats[i.type] = { sum: 0, count: 0 };
        topicStats[i.type].sum += i.score;
        topicStats[i.type].count++;
    });

    const weakTopics = Object.keys(topicStats)
        .map(type => ({ type, avg: topicStats[type].sum / topicStats[type].count }))
        .filter(t => t.avg < 80)
        .sort((a,b) => a.avg - b.avg);

    const historyList = document.getElementById('historyList');
    const modal = document.getElementById('historyModal');
    document.querySelector('#historyModal h3').textContent = 'Weak Areas Analysis';
    
    historyList.innerHTML = weakTopics.length > 0
        ? `<div>
            <p style="margin-bottom: 1rem;">Based on your last ${interviews.length} sessions, focal on these areas:</p>
            ${weakTopics.map(t => `
                <div class="history-item" style="border-left: 4px solid var(--error);">
                    <strong>${t.type.toUpperCase()}</strong>
                    <small>Average Score: ${Math.round(t.avg)}% | Needs more practice</small>
                </div>
            `).join('')}
           </div>`
        : '<p style="text-align: center; color: var(--success); font-weight: 600;">Amazing! You are performing well across all topics.</p>';
    
    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('historyModal').style.display = 'none';
}

// ========== INTERVIEW ==========
function updateQuestions() {
    const type = document.getElementById('interviewType').value;
    const difficulty = document.getElementById('difficulty').value;
    
    state.interviewData.type = type;
    state.interviewData.difficulty = difficulty;
}

function startNewInterview() {
    const type = document.getElementById('interviewType').value;
    const difficulty = document.getElementById('difficulty').value;
    const role = document.getElementById('role').value;

    state.interviewData.type = type;
    state.interviewData.difficulty = difficulty;
    state.interviewData.role = role;
    state.interviewData.currentIndex = 0;
    state.interviewData.answers = [];
    state.interviewData.scores = [];
    state.interviewData.startTime = Date.now();

    // Get questions
    const typeQuestions = questionDatabase[type] || questionDatabase.technical;
    state.interviewData.questions = (typeQuestions[difficulty] || typeQuestions.easy).slice(0, 5);

    // Hide controls, show interview
    document.querySelector('.interview-controls').style.display = 'none';
    document.getElementById('interviewContent').style.display = 'block';

    // Set up interview
    document.getElementById('totalQuestions').textContent = state.interviewData.questions.length;
    startTimer();
    displayQuestion();
}

function startTimer() {
    let timeLeft = 300; // 5 minutes
    
    const updateTimer = () => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        document.getElementById('timerDisplay').textContent = 
            `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        timeLeft--;
        
        if (timeLeft < 0) {
            clearInterval(state.timerInterval);
            alert('Time\'s up! Submitting your current answer.');
            submitAnswer();
        }
    };

    updateTimer();
    state.timerInterval = setInterval(updateTimer, 1000);
}

function displayQuestion() {
    const question = state.interviewData.questions[state.interviewData.currentIndex];
    
    document.getElementById('questionNumber').textContent = state.interviewData.currentIndex + 1;
    document.getElementById('questionText').textContent = question.text;
    document.getElementById('questionDifficulty').textContent = 
        `${state.interviewData.difficulty.charAt(0).toUpperCase() + state.interviewData.difficulty.slice(1)} • `;
    document.getElementById('questionCategory').textContent = question.category;
    document.getElementById('questionTag').textContent = state.interviewData.type.toUpperCase();
    document.getElementById('answerInput').value = '';
    document.getElementById('feedbackBox').style.display = 'none';
}

function submitAnswer() {
    const answer = document.getElementById('answerInput').value.trim();
    
    if (!answer) {
        alert('Please provide an answer');
        return;
    }

    // Store answer - feedback is now deferred to the end
    state.interviewData.answers.push(answer);
    
    // Evaluate answer (Passing the full question object for correct matching)
    const question = state.interviewData.questions[state.interviewData.currentIndex];
    const evaluation = mlModelAnalysis(answer, question);
    state.interviewData.scores.push(evaluation);

    // Proceed to next question
    nextQuestion();
}

function mlModelAnalysis(answer, question) {
    // Simulated Trained ML Model (NLP & Heuristic Analysis)
    const length = answer.length;
    const tokens = answer.toLowerCase().replace(/[()]/g, ' ').split(/\s+/).filter(Boolean);
    
    // Check if the response is meaningful (not random characters)
    const isMeaningful = checkMeaningfulContent(answer);
    
    // Calculate Relevance against Reference Answer
    const dbAnswer = (question.answer || "").toLowerCase();
    const dbKeywords = dbAnswer.match(/\b[a-z0-9]{2,}\b/g) || [];
    
    // Improved matching: Check if tokens include or are included in dbKeywords (e.g. logn matches log)
    const relevanceWords = tokens.filter(t => 
        dbKeywords.some(kw => t.includes(kw) || kw.includes(t))
    );
    
    // Precise Technical Notation Detection
    const hasBigO = /\b[oO0]\s*\(\s*[a-z0-9\s^]+\s*\)/.test(answer);
    const hasLogN = /\b(log\s*n|n\s*log\s*n)\b/i.test(answer);
    const hasTechnicalNotation = hasBigO || hasLogN;

    const relevanceScore = (relevanceWords.length / Math.max(1, dbKeywords.slice(0, 8).length)) * 100;
    
    // Heuristic: Technical Keyword Density
    const technicalKeywords = [
        'algorithm', 'structure', 'binary', 'database', 'transaction', 
        'concurrency', 'asynchronous', 'latency', 'bandwidth', 'protocol',
        'scaling', 'efficiency', 'overhead', 'memory', 'pointer',
        'architecture', 'endpoint', 'payload', 'schema', 'query',
        'distributed', 'consistency', 'availability', 'partition'
    ];
    
    const matchedKeywords = tokens.filter(t => technicalKeywords.includes(t));

    // STRICT ZERO SCORE POLICY (Garbage / Irrelevant)
    const isIrrelevant = !hasTechnicalNotation && relevanceScore < 5 && matchedKeywords.length < 1;
    
    if (!isMeaningful || isIrrelevant) {
        return {
            score: 0, 
            clarity: 0,
            accuracy: 0,
            completeness: 0,
            feedback: isIrrelevant 
                ? "The provided response appears to be irrelevant to the specific interview question. Focus on addressing the technical requirements asked."
                : "Analysis suggests non-meaningful content or gibberish. Provide a technical, English-based response for a detailed review."
        };
    }

    // HIGH POTENTIAL SCORE FLAG (Correct Technical Notation)
    const isTechnicalMatch = hasTechnicalNotation && relevanceScore > 10;
    
    // Scoring logic (REFINED CALIBRATION)
    let baseScore = 15; 
    if (isTechnicalMatch) baseScore = 75; // Technical match (notation) gets expert base instantly
    else if (relevanceScore > 60) baseScore = 35; // Conceptual boost for accurate definitions
    
    if (length > 200) baseScore += 15;
    if (answer.toLowerCase().includes('example')) baseScore += 10;
    
    // Add relevance weight
    baseScore += Math.min(25, relevanceScore * 0.5);
    baseScore = Math.min(100, Math.round(baseScore));

    // ── BALANCED COMPLETENESS SCORING ──────────────────────────────────────
    // Factor 1 (40%): Keyword coverage — how many unique reference concepts were addressed
    const allDbKeywords = dbAnswer.match(/\b[a-z0-9]{3,}\b/g) || [];
    const uniqueDbKeywords = [...new Set(allDbKeywords)];
    const coveredCount = uniqueDbKeywords.filter(kw =>
        tokens.some(t => t.includes(kw) || kw.includes(t))
    ).length;
    const keywordCoverage = Math.min(100, (coveredCount / Math.max(1, uniqueDbKeywords.length)) * 100);

    // Factor 2 (25%): Structural depth — distinct sentences/clauses (not just length)
    const sentences = answer.split(/[.!?;]+/).map(s => s.trim()).filter(s => s.length > 8);
    const sentenceScore = Math.min(100, sentences.length * 18); // ~6 sentences = full marks

    // Factor 3 (20%): Length depth — logarithmic scale to penalise pure verbosity
    const lengthScore = Math.min(100, Math.round((Math.log(Math.max(1, length)) / Math.log(600)) * 100));

    // Factor 4 (15%): Explanatory richness — examples, causal reasoning, tradeoff language
    const lowerAnswer = answer.toLowerCase();
    const richnessScore = Math.min(100,
        (lowerAnswer.includes('example') || lowerAnswer.includes('e.g') || lowerAnswer.includes('for instance') ? 40 : 0) +
        (lowerAnswer.includes('because') || lowerAnswer.includes('therefore') || lowerAnswer.includes('which means') ? 30 : 0) +
        (lowerAnswer.includes('however') || lowerAnswer.includes('tradeoff') || lowerAnswer.includes('but') ? 20 : 0) +
        (isTechnicalMatch ? 10 : 0)
    );

    const completeness = Math.min(100, Math.round(
        keywordCoverage * 0.40 +
        sentenceScore   * 0.25 +
        lengthScore     * 0.20 +
        richnessScore   * 0.15
    ));
    // ───────────────────────────────────────────────────────────────────────

    return {
        score: baseScore,
        clarity: Math.min(100, Math.round(isTechnicalMatch ? 90 : (40 + (length / 40)))),
        accuracy: Math.min(100, Math.round(relevanceScore + (isTechnicalMatch ? 50 : 20))),
        completeness,
        feedback: generateMLFeedback(baseScore, length, matchedKeywords.length, isTechnicalMatch)
    };
}

function checkMeaningfulContent(text) {
    if (!text || text.length < 2) return false;
    
    // Technical notation is inherently meaningful
    if (/\b[oO0]\s*\(.*\)/.test(text) || /\b(log\s*n|n\^2|n\s*log\s*n)\b/i.test(text)) return true;
    
    const words = text.split(/\s+/).filter(w => w.length > 2);
    if (words.length === 0) return text.length >= 2;

    let validWordCount = 0;
    words.forEach(word => {
        const vowels = word.match(/[aeiou]/gi);
        if (vowels || word.length < 4 || /[0-9()]/.test(word)) validWordCount++;
    });

    return (validWordCount / words.length) > 0.5;
}

function generateMLFeedback(score, length, keywords, isTechnicalMatch) {
    if (isTechnicalMatch && score >= 80) return "Excellent technical precision. Your use of correct algorithmic notation matches the expected performance criteria.";
    if (score >= 90) return "Expert-level analysis. Your response effectively uses technical terminology and provides comprehensive structural detail.";
    if (score >= 75) return "Very good technical summary. You've correctly identified the core components with appropriate detail.";
    if (score >= 50) return "Intermediate response. While you've covered the basics, further technical depth or examples would improve the evaluation.";
    if (length < 100 && !isTechnicalMatch) return "The response is overly concise. Our evaluation model suggests expanding with more technical context and real-world examples.";
    if (keywords === 0 && !isTechnicalMatch) return "Answer lacks specific technical keywords. Focus on using domain-specific accuracy in your descriptions.";
    return "Introductory response. Higher technical precision and further elaboration on the 'how' and 'why' is recommended.";
}

function skipQuestion() {
    state.interviewData.answers.push('No answer provided (Skipped)');
    state.interviewData.scores.push({ 
        score: 0, 
        clarity: 0, 
        accuracy: 0, 
        completeness: 0,
        feedback: "This question was skipped. Focus on practicing this area to improve your overall technical coverage."
    });
    nextQuestion();
}

function nextQuestion() {
    if (state.interviewData.currentIndex < state.interviewData.questions.length - 1) {
        state.interviewData.currentIndex++;
        displayQuestion();
    } else {
        endInterview();
    }
}

function endInterview() {
    clearInterval(state.timerInterval);

    // ── ACTUAL ELAPSED TIME ─────────────────────────────────────────────────
    const elapsedMs = Date.now() - (state.interviewData.startTime || Date.now());
    const elapsedSec = Math.round(elapsedMs / 1000);
    const mins = Math.floor(elapsedSec / 60);
    const secs = elapsedSec % 60;
    const timeTakenFormatted = `${mins}m ${secs.toString().padStart(2, '0')}s`;
    // ────────────────────────────────────────────────────────────────────────

    // Calculate results — include ALL questions (skipped = 0) in denominator for accurate average
    const allScores = state.interviewData.scores;
    const avgScore = allScores.length > 0
        ? Math.round(allScores.reduce((a, b) => a + b.score, 0) / allScores.length)
        : 0;
    const scores = allScores.filter(s => s.score > 0); // still used for questionsAnswered count

    // Save interview
    const interview = {
        type: state.interviewData.type,
        difficulty: state.interviewData.difficulty,
        score: avgScore,
        date: new Date().toLocaleDateString()
    };

    state.userStats.interviews.push(interview);

    // Recalculate all stats correctly
    syncUserStats();

    localStorage.setItem('interviews', JSON.stringify(state.userStats.interviews));
    localStorage.setItem('totalInterviews', state.userStats.totalInterviews);

    showResults(avgScore, scores, timeTakenFormatted);
}

function showResults(score, scores, timeTaken) {
    document.getElementById('scoreCircle').textContent = score;
    document.getElementById('questionsAnswered').textContent = scores.length;
    document.getElementById('averageScore').textContent = score;
    document.getElementById('accuracyResult').textContent = Math.round(score * 0.95) + '%';
    document.getElementById('timeTaken').textContent = timeTaken || '--';

    const scoreFeedback = score >= 80 ? "Excellent Performance!" : score >= 70 ? "Strong Result" : "Practice Recommended";
    document.getElementById('scoreMessage').textContent = scoreFeedback;
    
    let summary = '<div class="feedback-report">';
    state.interviewData.questions.forEach((q, i) => {
        const s = state.interviewData.scores[i];
        const a = state.interviewData.answers[i] || 'No answer provided';
        
        if (!s) {
            console.error(`Missing score for question ${i+1}`);
            return;
        }

        const statusClass = s.score >= 80 ? 'status-good' : s.score >= 60 ? 'status-fair' : 'status-poor';
        
        summary += `
            <div class="feedback-card ${statusClass}">
                <div class="card-header">
                    <h4>Question ${i + 1}</h4>
                    <span class="card-score">${Math.round(s.score / 10)}/10</span>
                </div>
                <div class="card-body">
                    <p class="card-question"><strong>Q:</strong> ${q.text}</p>
                    <p class="card-answer"><strong>Your Answer:</strong> ${a}</p>
                    <div class="card-ml-feedback">
                        <div class="ml-badge">ML REVIEW</div>
                        <p>${s.feedback || 'No feedback available'}</p>
                        <div class="ml-metrics">
                            <span>Clarity: ${s.clarity || 0}%</span>
                            <span>Accuracy: ${s.accuracy || 0}%</span>
                            <span>Completeness: ${s.completeness || 0}%</span>
                        </div>
                    </div>
                </div>
            </div>`;
    });
    summary += '</div>';
    document.getElementById('resultsSummary').innerHTML = summary;
    
    document.querySelector('.interview-controls').style.display = 'grid';
    document.getElementById('interviewContent').style.display = 'none';
    
    navigateTo('results');
}

// ========== THEME TOGGLE ==========
function toggleTheme() {
    state.isDarkMode = !state.isDarkMode;
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', state.isDarkMode);
    document.querySelector('.btn-theme').textContent = state.isDarkMode ? '☀️' : '🌙';
}

// ========== UTILITY ==========
function scrollToFeatures() {
    document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
}
