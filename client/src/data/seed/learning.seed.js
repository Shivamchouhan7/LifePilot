import { addDays, subDays } from 'date-fns';

const revDate = (days) => (days >= 0 ? addDays(new Date(), days) : subDays(new Date(), Math.abs(days))).toISOString();

export function generateLearningSeed() {
  return [
    {
      id: 'learn_01',
      skill: 'JavaScript Core & Internals',
      category: 'Language',
      nextRevisionDate: revDate(2),
      topics: [
        { id: 'top_01_1', name: 'Event Loop & Microtasks', done: true },
        { id: 'top_01_2', name: 'Prototypes & Inheritance', done: true },
        { id: 'top_01_3', name: 'Memory Management & Garbage Collection', done: false },
        { id: 'top_01_4', name: 'WeakMap, WeakSet & Finalizers', done: false },
      ],
      lessons: [
        { id: 'les_01_1', title: 'Call stack and Task queues deep dive', done: true },
        { id: 'les_01_2', title: 'Promise execution order and MutationObserver', done: true },
        { id: 'les_01_3', title: 'V8 Hidden classes and Inline Caching', done: false },
        { id: 'les_01_4', title: 'Generators and Async Iterators', done: true },
      ],
      resources: [
        { title: 'MDN: JavaScript Concurrency Model', url: 'https://developer.mozilla.org' },
        { title: 'V8 Blog: JavaScript Engine Optimization', url: 'https://v8.dev/blog' },
      ],
    },
    {
      id: 'learn_02',
      skill: 'React 18 & Advanced Patterns',
      category: 'Frontend',
      nextRevisionDate: revDate(1),
      topics: [
        { id: 'top_02_1', name: 'Concurrent Features (useTransition, useDeferredValue)', done: true },
        { id: 'top_02_2', name: 'Fiber Reconciler Architecture', done: true },
        { id: 'top_02_3', name: 'Custom Hook Design & Composition', done: true },
        { id: 'top_02_4', name: 'Server Components & Streaming SSR', done: false },
      ],
      lessons: [
        { id: 'les_02_1', title: 'Mastering startTransition and interruptible rendering', done: true },
        { id: 'les_02_2', title: 'Building resilient optimistic mutations with TanStack Query', done: true },
        { id: 'les_02_3', title: 'Architecting compound components with Context and Radix', done: true },
        { id: 'les_02_4', title: 'Hydration mismatches and selective hydration in React 18', done: false },
      ],
      resources: [
        { title: 'React Official Docs: Upgrading to React 18', url: 'https://react.dev' },
        { title: 'TkDodo: Practical React Query', url: 'https://tkdodo.eu/blog' },
      ],
    },
    {
      id: 'learn_03',
      skill: 'Node.js & Backend Architecture',
      category: 'Backend',
      nextRevisionDate: revDate(4),
      topics: [
        { id: 'top_03_1', name: 'Streams & Buffers', done: true },
        { id: 'top_03_2', name: 'Worker Threads & Clustering', done: false },
        { id: 'top_03_3', name: 'Authentication & JWT Security', done: true },
        { id: 'top_03_4', name: 'Rate Limiting & Middlewares', done: true },
      ],
      lessons: [
        { id: 'les_03_1', title: 'Readable, Writable, and Transform stream pipelines', done: true },
        { id: 'les_03_2', title: 'Thread pools in libuv and heavy CPU offloading', done: false },
        { id: 'les_03_3', title: 'Express middleware chains and global error handlers', done: true },
      ],
      resources: [
        { title: 'Node.js Streams Handbook', url: 'https://nodejs.org/api/stream.html' },
      ],
    },
    {
      id: 'learn_04',
      skill: 'MongoDB & Data Modeling',
      category: 'Database',
      nextRevisionDate: revDate(5),
      topics: [
        { id: 'top_04_1', name: 'Document Schema Design', done: true },
        { id: 'top_04_2', name: 'Indexing Strategies (Compound & Text)', done: true },
        { id: 'top_04_3', name: 'Aggregation Pipeline (Stages & Operators)', done: false },
        { id: 'top_04_4', name: 'Transactions & Replica Sets', done: false },
      ],
      lessons: [
        { id: 'les_04_1', title: 'Embedding vs Referencing relationships in NoSQL', done: true },
        { id: 'les_04_2', title: 'Query plans and explain() analysis', done: true },
        { id: 'les_04_3', title: 'Building complex aggregations with $facet and $lookup', done: false },
      ],
      resources: [
        { title: 'MongoDB University: Schema Design Patterns', url: 'https://learn.mongodb.com' },
      ],
    },
    {
      id: 'learn_05',
      skill: 'Data Structures & Algorithms',
      category: 'Computer Science',
      nextRevisionDate: revDate(0),
      topics: [
        { id: 'top_05_1', name: 'Binary Trees & BSTs', done: true },
        { id: 'top_05_2', name: 'Graph Traversal (BFS, DFS, Dijkstra)', done: true },
        { id: 'top_05_3', name: 'Dynamic Programming (1D & 2D)', done: false },
        { id: 'top_05_4', name: 'Sliding Window & Two Pointers', done: true },
      ],
      lessons: [
        { id: 'les_05_1', title: 'Solve 15 essential tree traversal problems', done: true },
        { id: 'les_05_2', title: 'Topological sorting with Kahn algorithm', done: true },
        { id: 'les_05_3', title: 'Memoization vs Tabulation on knapsack variations', done: false },
        { id: 'les_05_4', title: 'Trie data structure implementation from scratch', done: true },
      ],
      resources: [
        { title: 'NeetCode 150 Roadmap', url: 'https://neetcode.io' },
      ],
    },
    {
      id: 'learn_06',
      skill: 'System Design & Scalability',
      category: 'Architecture',
      nextRevisionDate: revDate(3),
      topics: [
        { id: 'top_06_1', name: 'Consistent Hashing & Partitioning', done: true },
        { id: 'top_06_2', name: 'Distributed Caching (Redis/Memcached)', done: true },
        { id: 'top_06_3', name: 'Message Queues (Kafka, RabbitMQ)', done: true },
        { id: 'top_06_4', name: 'CAP Theorem & Eventual Consistency', done: false },
      ],
      lessons: [
        { id: 'les_06_1', title: 'Design a Distributed Rate Limiter (Token bucket)', done: true },
        { id: 'les_06_2', title: 'Design a URL Shortener with high read throughput', done: true },
        { id: 'les_06_3', title: 'Design a Real-time Notification System with WebSockets', done: true },
        { id: 'les_06_4', title: 'Database sharding strategies and cross-shard queries', done: false },
      ],
      resources: [
        { title: 'ByteByteGo: System Design Interview Guide', url: 'https://bytebytego.com' },
      ],
    },
  ];
}
