import db from './db.js';

interface ManualProblem {
  leetcode_id: number;
  title: string;
  slug: string;
  difficulty: string;
  content: string;
  solution: string;
  category: string;
  topics: string[];
  lists: string[];
}

const problems: ManualProblem[] = [
  {
    leetcode_id: 269,
    title: 'Alien Dictionary',
    slug: 'alien-dictionary',
    difficulty: 'Hard',
    content: `<p>There is a new alien language that uses the English alphabet. However, the order of the letters is unknown to you.</p>
<p>You are given a list of strings <code>words</code> from the alien language's dictionary, where the strings in <code>words</code> are <strong>sorted lexicographically</strong> by the rules of this new language.</p>
<p>Derive the order of letters in this language. If the order is invalid, return <code>""</code>. If there are multiple valid orderings, return any of them.</p>
<p><strong>Example 1:</strong></p>
<pre>Input: words = ["wrt","wrf","er","ett","rftt"]
Output: "wertf"</pre>
<p><strong>Example 2:</strong></p>
<pre>Input: words = ["z","x"]
Output: "zx"</pre>
<p><strong>Example 3:</strong></p>
<pre>Input: words = ["z","x","z"]
Output: ""
Explanation: The order is invalid, so return "".</pre>
<p><strong>Constraints:</strong></p>
<ul>
<li><code>1 <= words.length <= 100</code></li>
<li><code>1 <= words[i].length <= 100</code></li>
<li><code>words[i]</code> consists of only lowercase English letters.</li>
</ul>`,
    solution: `**Approach:** Topological sort on character graph
**Key Insight:** Compare adjacent words to derive ordering constraints (edges). Build a directed graph of character ordering. Topological sort gives the alien alphabet order. If there's a cycle, return "".
**Steps:**
1. Compare consecutive words: find first differing character → add edge.
2. If a shorter word comes after a longer word with the same prefix → invalid.
3. Topological sort (BFS/Kahn's) on the character graph.
**Complexity:** O(total characters) time, O(1) space (26 chars max).`,
    category: 'Graphs',
    topics: ['Graph', 'Topological Sort', 'BFS'],
    lists: ['Blind 75', 'NeetCode 150'],
  },
  {
    leetcode_id: 261,
    title: 'Graph Valid Tree',
    slug: 'graph-valid-tree',
    difficulty: 'Medium',
    content: `<p>You have a graph of <code>n</code> nodes labeled from <code>0</code> to <code>n - 1</code>. You are given an integer <code>n</code> and a list of <code>edges</code> where <code>edges[i] = [a<sub>i</sub>, b<sub>i</sub>]</code> indicates that there is an undirected edge between nodes <code>a<sub>i</sub></code> and <code>b<sub>i</sub></code> in the graph.</p>
<p>Return <code>true</code> if the edges of the given graph make up a valid tree, and <code>false</code> otherwise.</p>
<p><strong>Example 1:</strong></p>
<pre>Input: n = 5, edges = [[0,1],[0,2],[0,3],[1,4]]
Output: true</pre>
<p><strong>Example 2:</strong></p>
<pre>Input: n = 5, edges = [[0,1],[1,2],[2,3],[1,3],[1,4]]
Output: false</pre>
<p><strong>Constraints:</strong></p>
<ul>
<li><code>1 <= n <= 2000</code></li>
<li><code>0 <= edges.length <= 5000</code></li>
<li><code>edges[i].length == 2</code></li>
<li>There are no self-loops or repeated edges.</li>
</ul>`,
    solution: `**Approach:** Union-Find or DFS
**Key Insight:** A graph is a valid tree if it has exactly n-1 edges and is fully connected (no cycles). Use union-find: if unioning two already-connected nodes, there's a cycle.
**Steps:**
1. If edges != n-1, return false.
2. Union-Find: for each edge, if find(u) == find(v), cycle → false. Else union.
3. Check all nodes are connected (single component).
**Complexity:** O(n * α(n)) time, O(n) space.`,
    category: 'Graphs',
    topics: ['Graph', 'Union Find', 'DFS', 'BFS'],
    lists: ['Blind 75', 'NeetCode 150'],
  },
  {
    leetcode_id: 323,
    title: 'Number of Connected Components in an Undirected Graph',
    slug: 'number-of-connected-components-in-an-undirected-graph',
    difficulty: 'Medium',
    content: `<p>You have a graph of <code>n</code> nodes. You are given an integer <code>n</code> and an array <code>edges</code> where <code>edges[i] = [a<sub>i</sub>, b<sub>i</sub>]</code> indicates that there is an edge between <code>a<sub>i</sub></code> and <code>b<sub>i</sub></code> in the graph.</p>
<p>Return <em>the number of connected components in the graph</em>.</p>
<p><strong>Example 1:</strong></p>
<pre>Input: n = 5, edges = [[0,1],[1,2],[3,4]]
Output: 2</pre>
<p><strong>Example 2:</strong></p>
<pre>Input: n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]
Output: 1</pre>
<p><strong>Constraints:</strong></p>
<ul>
<li><code>1 <= n <= 2000</code></li>
<li><code>1 <= edges.length <= 5000</code></li>
</ul>`,
    solution: `**Approach:** Union-Find or DFS
**Key Insight:** Count connected components using Union-Find (start with n components, each union reduces by 1) or DFS (count number of DFS calls from unvisited nodes).
**Steps (Union-Find):**
1. Initialize n components.
2. For each edge: if find(u) != find(v), union them, decrement count.
3. Return count.
**Complexity:** O(E * α(n)) time, O(n) space.`,
    category: 'Graphs',
    topics: ['Graph', 'Union Find', 'DFS', 'BFS'],
    lists: ['Blind 75', 'NeetCode 150'],
  },
  {
    leetcode_id: 286,
    title: 'Walls and Gates',
    slug: 'walls-and-gates',
    difficulty: 'Medium',
    content: `<p>You are given an <code>m x n</code> grid <code>rooms</code> initialized with these three possible values:</p>
<ul>
<li><code>-1</code> — A wall or an obstacle.</li>
<li><code>0</code> — A gate.</li>
<li><code>INF</code> — Infinity means an empty room. We use the value <code>2<sup>31</sup> - 1 = 2147483647</code> to represent INF.</li>
</ul>
<p>Fill each empty room with the distance to its <strong>nearest gate</strong>. If it is impossible to reach a gate, leave it as <code>INF</code>.</p>
<p><strong>Example:</strong></p>
<pre>Input:
INF  -1  0  INF
INF INF INF  -1
INF  -1 INF  -1
  0  -1 INF INF

Output:
  3  -1   0   1
  2   2   1  -1
  1  -1   2  -1
  0  -1   3   4</pre>
<p><strong>Constraints:</strong></p>
<ul>
<li><code>m == rooms.length</code></li>
<li><code>n == rooms[i].length</code></li>
<li><code>1 <= m, n <= 250</code></li>
</ul>`,
    solution: `**Approach:** Multi-source BFS from all gates
**Key Insight:** Start BFS from all gate cells (value 0) simultaneously. Each level increments distance by 1. This fills in the shortest distance from any gate for all empty rooms.
**Steps:**
1. Add all gate positions to queue.
2. BFS: for each cell, update unvisited neighbors with distance + 1.
3. Walls and gates are never updated.
**Complexity:** O(m*n) time, O(m*n) space.`,
    category: 'Graphs',
    topics: ['Graph', 'BFS', 'Matrix'],
    lists: ['NeetCode 150'],
  },
  {
    leetcode_id: 362,
    title: 'Design Hit Counter',
    slug: 'design-hit-counter',
    difficulty: 'Medium',
    content: `<p>Design a hit counter which counts the number of hits received in the past <code>5</code> minutes (i.e., the past <code>300</code> seconds).</p>
<p>Your system should accept a <code>timestamp</code> parameter (in seconds granularity), and you may assume that calls are being made to the system in chronological order (i.e., <code>timestamp</code> is monotonically increasing). Several hits may arrive at roughly the same time.</p>
<p>Implement the <code>HitCounter</code> class:</p>
<ul>
<li><code>HitCounter()</code> Initializes the object of the hit counter system.</li>
<li><code>void hit(int timestamp)</code> Records a hit that happened at <code>timestamp</code> (in seconds). Several hits may happen at the same <code>timestamp</code>.</li>
<li><code>int getHits(int timestamp)</code> Returns the number of hits in the past 5 minutes from <code>timestamp</code> (i.e., the past <code>300</code> seconds).</li>
</ul>
<p><strong>Example:</strong></p>
<pre>Input: ["HitCounter", "hit", "hit", "hit", "getHits", "hit", "getHits", "getHits"]
[[], [1], [2], [3], [4], [300], [300], [301]]
Output: [null, null, null, null, 3, null, 4, 3]</pre>
<p><strong>Constraints:</strong></p>
<ul>
<li><code>1 <= timestamp <= 2 * 10<sup>9</sup></code></li>
<li>All calls are made in chronological order.</li>
<li>At most <code>300</code> calls will be made to <code>hit</code> and <code>getHits</code>.</li>
</ul>`,
    solution: `**Approach:** Circular buffer of size 300
**Key Insight:** Only need to count hits in the last 300 seconds. Use two arrays of size 300: times[] and hits[]. Index = timestamp % 300. If times[idx] == timestamp, increment. Else reset.
**Steps:**
hit(t): idx = t % 300. If times[idx] == t, hits[idx]++. Else times[idx] = t, hits[idx] = 1.
getHits(t): sum all hits[i] where times[i] > t - 300.
**Complexity:** hit O(1), getHits O(300) = O(1).`,
    category: 'Design',
    topics: ['Design', 'Queue', 'Array'],
    lists: ['Top Interview'],
  },
  {
    leetcode_id: 340,
    title: 'Longest Substring with At Most K Distinct Characters',
    slug: 'longest-substring-with-at-most-k-distinct-characters',
    difficulty: 'Medium',
    content: `<p>Given a string <code>s</code> and an integer <code>k</code>, return <em>the length of the longest substring of <code>s</code> that contains at most <code>k</code> distinct characters</em>.</p>
<p><strong>Example 1:</strong></p>
<pre>Input: s = "eceba", k = 2
Output: 3
Explanation: The substring is "ece" with length 3.</pre>
<p><strong>Example 2:</strong></p>
<pre>Input: s = "aa", k = 1
Output: 2
Explanation: The substring is "aa" with length 2.</pre>
<p><strong>Constraints:</strong></p>
<ul>
<li><code>1 <= s.length <= 5 * 10<sup>4</sup></code></li>
<li><code>0 <= k <= 50</code></li>
</ul>`,
    solution: `**Approach:** Sliding window with hash map
**Key Insight:** Maintain a window with at most k distinct characters using a hash map (char → count). When distinct count exceeds k, shrink from the left.
**Steps:**
1. Expand right, add char to map.
2. While map.size > k: decrement map[left char], remove if 0, move left.
3. Track max window size.
**Complexity:** O(n) time, O(k) space.`,
    category: 'Sliding Window',
    topics: ['Sliding Window', 'Hash Table', 'String'],
    lists: ['Top Interview'],
  },
  {
    leetcode_id: 271,
    title: 'Encode and Decode Strings',
    slug: 'encode-and-decode-strings',
    difficulty: 'Medium',
    content: `<p>Design an algorithm to encode a list of strings to a single string. The encoded string is then decoded back to the original list of strings.</p>
<p>Implement the <code>encode</code> and <code>decode</code> methods.</p>
<p>The string may contain any possible characters out of 256 valid ASCII characters. Your algorithm should be generalized enough to work on any possible characters.</p>
<p><strong>Example 1:</strong></p>
<pre>Input: ["hello","world"]
Output: ["hello","world"]
Explanation:
encode: "5#hello5#world"
decode: ["hello","world"]</pre>
<p><strong>Example 2:</strong></p>
<pre>Input: [""]
Output: [""]</pre>
<p><strong>Constraints:</strong></p>
<ul>
<li><code>0 <= strs.length <= 200</code></li>
<li><code>0 <= strs[i].length <= 200</code></li>
<li><code>strs[i]</code> contains any possible characters including special characters.</li>
</ul>`,
    solution: `**Approach:** Length-prefixed encoding
**Key Insight:** Encode each string as its length + a delimiter + the string itself. E.g., "hello" → "5#hello". This handles any characters including the delimiter.
**Steps:**
encode: for each string, append len(s) + '#' + s.
decode: read the number before '#', extract that many characters, repeat.
**Complexity:** O(total chars) time, O(1) extra space.`,
    category: 'Arrays & Hashing',
    topics: ['String', 'Design'],
    lists: ['Blind 75', 'NeetCode 150'],
  },
  {
    leetcode_id: 252,
    title: 'Meeting Rooms',
    slug: 'meeting-rooms',
    difficulty: 'Easy',
    content: `<p>Given an array of meeting time <code>intervals</code> where <code>intervals[i] = [start<sub>i</sub>, end<sub>i</sub>]</code>, determine if a person could attend all meetings.</p>
<p><strong>Example 1:</strong></p>
<pre>Input: intervals = [[0,30],[5,10],[15,20]]
Output: false</pre>
<p><strong>Example 2:</strong></p>
<pre>Input: intervals = [[7,10],[2,4]]
Output: true</pre>
<p><strong>Constraints:</strong></p>
<ul>
<li><code>0 <= intervals.length <= 10<sup>4</sup></code></li>
<li><code>intervals[i].length == 2</code></li>
<li><code>0 <= start<sub>i</sub> < end<sub>i</sub> <= 10<sup>6</sup></code></li>
</ul>`,
    solution: `**Approach:** Sort by start time, check overlaps
**Key Insight:** Sort intervals by start time. If any interval's start < previous interval's end, there's an overlap (can't attend all meetings).
**Steps:**
1. Sort by start time.
2. For i from 1 to n-1: if intervals[i].start < intervals[i-1].end, return false.
3. Return true.
**Complexity:** O(n log n) time, O(1) space.`,
    category: 'Intervals',
    topics: ['Array', 'Sorting'],
    lists: ['Blind 75', 'NeetCode 150'],
  },
  {
    leetcode_id: 253,
    title: 'Meeting Rooms II',
    slug: 'meeting-rooms-ii',
    difficulty: 'Medium',
    content: `<p>Given an array of meeting time <code>intervals</code> where <code>intervals[i] = [start<sub>i</sub>, end<sub>i</sub>]</code>, return <em>the minimum number of conference rooms required</em>.</p>
<p><strong>Example 1:</strong></p>
<pre>Input: intervals = [[0,30],[5,10],[15,20]]
Output: 2</pre>
<p><strong>Example 2:</strong></p>
<pre>Input: intervals = [[7,10],[2,4]]
Output: 1</pre>
<p><strong>Constraints:</strong></p>
<ul>
<li><code>1 <= intervals.length <= 10<sup>4</sup></code></li>
<li><code>0 <= start<sub>i</sub> < end<sub>i</sub> <= 10<sup>6</sup></code></li>
</ul>`,
    solution: `**Approach:** Min-heap or sweep line
**Key Insight (heap):** Sort by start time. Use a min-heap of end times. For each meeting, if earliest ending room is free (heap top <= current start), reuse it (pop). Always push current end. Heap size = rooms needed.
**Key Insight (sweep line):** Separate start and end times, sort. Sweep through: +1 at start, -1 at end. Max concurrent = answer.
**Complexity:** O(n log n) time, O(n) space.`,
    category: 'Intervals',
    topics: ['Array', 'Sorting', 'Heap', 'Greedy'],
    lists: ['Blind 75', 'NeetCode 150'],
  },
  {
    leetcode_id: 1062,
    title: 'Longest Repeating Substring',
    slug: 'longest-repeating-substring',
    difficulty: 'Medium',
    content: `<p>Given a string <code>s</code>, return <em>the length of the longest repeating substring</em>. A <strong>repeating substring</strong> is a substring that occurs at least twice in <code>s</code>. If no repeating substring exists, return <code>0</code>.</p>
<p><strong>Example 1:</strong></p>
<pre>Input: s = "abcd"
Output: 0
Explanation: There is no repeating substring.</pre>
<p><strong>Example 2:</strong></p>
<pre>Input: s = "abbaba"
Output: 2
Explanation: The longest repeating substring is "ab" or "ba", occurring twice.</pre>
<p><strong>Example 3:</strong></p>
<pre>Input: s = "aabcaabdaab"
Output: 3
Explanation: The longest repeating substring is "aab", occurring 3 times.</pre>
<p><strong>Constraints:</strong></p>
<ul>
<li><code>1 <= s.length <= 2000</code></li>
<li><code>s</code> consists of lowercase English letters.</li>
</ul>`,
    solution: `**Approach:** Binary search on length + rolling hash (Rabin-Karp)
**Key Insight:** Binary search for the longest length L such that a repeating substring of length L exists. For each L, use rolling hash to check for duplicate substrings in O(n).
**Steps:**
1. Binary search: lo=1, hi=n-1. For each mid, check if a repeating substring of length mid exists.
2. Use rolling hash: compute hashes of all substrings of length L, check for duplicates.
**Complexity:** O(n log n) average time with good hash.`,
    category: 'Binary Search',
    topics: ['String', 'Binary Search', 'Rolling Hash'],
    lists: ['Top Interview'],
  },
  {
    leetcode_id: 249,
    title: 'Group Shifted Strings',
    slug: 'group-shifted-strings',
    difficulty: 'Medium',
    content: `<p>We can shift a string by shifting each of its letters to its successive letter. For example, <code>"abc"</code> can be shifted to <code>"bcd"</code>.</p>
<p>We can keep shifting to form a sequence: <code>"abc" → "bcd" → ... → "xyz"</code>.</p>
<p>Given an array of strings <code>strings</code>, group all strings that belong to the same shifting sequence. You can return the answer in <strong>any order</strong>.</p>
<p><strong>Example 1:</strong></p>
<pre>Input: strings = ["abc","bcd","acef","xyz","az","ba","a","z"]
Output: [["acef"],["a","z"],["abc","bcd","xyz"],["az","ba"]]</pre>
<p><strong>Example 2:</strong></p>
<pre>Input: strings = ["a"]
Output: [["a"]]</pre>
<p><strong>Constraints:</strong></p>
<ul>
<li><code>1 <= strings.length <= 200</code></li>
<li><code>1 <= strings[i].length <= 50</code></li>
<li><code>strings[i]</code> consists of lowercase English letters.</li>
</ul>`,
    solution: `**Approach:** Normalize shift pattern as key
**Key Insight:** Two strings belong to the same group if the differences between consecutive characters (mod 26) are the same. Use this difference tuple as a hash map key.
**Steps:**
1. For each string, compute the key = tuple of (s[i] - s[i-1]) % 26 for each consecutive pair.
2. Group strings by this key in a hash map.
**Complexity:** O(total chars) time, O(total chars) space.`,
    category: 'Arrays & Hashing',
    topics: ['Hash Table', 'String'],
    lists: ['Top Interview'],
  },
];

const insertStmt = db.prepare(`
  INSERT OR IGNORE INTO problems (leetcode_id, title, slug, difficulty, content, solution, category, topics, lists)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const updateStmt = db.prepare(`
  UPDATE problems SET content = ?, solution = ?, category = ?, topics = ?, lists = ?
  WHERE slug = ?
`);

let added = 0;
let updated = 0;

for (const p of problems) {
  const existing = db.prepare('SELECT id, content FROM problems WHERE slug = ?').get(p.slug) as any;
  if (existing) {
    if (!existing.content || existing.content === '') {
      updateStmt.run(p.content, p.solution, p.category, JSON.stringify(p.topics), JSON.stringify(p.lists), p.slug);
      console.log(`  ✓ ${p.title} (updated with description)`);
      updated++;
    } else {
      console.log(`  - ${p.title} (already has content)`);
    }
  } else {
    insertStmt.run(p.leetcode_id, p.title, p.slug, p.difficulty, p.content, p.solution, p.category, JSON.stringify(p.topics), JSON.stringify(p.lists));
    console.log(`  ✓ ${p.title} (added)`);
    added++;
  }
}

console.log(`\nDone! Added: ${added}, Updated: ${updated}`);
