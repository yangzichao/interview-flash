import type { SeedProblem } from './seed-data.js';

const extra: SeedProblem[] = [
  // ============================================================
  // Classic DP
  // ============================================================
  {
    slug: 'maximal-square',
    lists: ['Top Interview'],
    category: '2-D DP',
    solution: `**Approach:** DP on matrix
**Key Insight:** dp[i][j] = side length of the largest square with bottom-right corner at (i,j). If matrix[i][j] == '1', dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1.
**Steps:**
1. Create dp table same size as matrix.
2. For each cell with '1': dp[i][j] = 1 + min(top, left, top-left).
3. Track the global max side length. Answer = max².
**Complexity:** O(m*n) time, O(m*n) space (can optimize to O(n)).`,
  },
  {
    slug: 'minimum-path-sum',
    lists: ['Top Interview'],
    category: '2-D DP',
    solution: `**Approach:** DP on grid
**Key Insight:** dp[i][j] = minimum path sum to reach (i,j). Can only move right or down, so dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1]).
**Steps:**
1. Initialize first row and first column as cumulative sums.
2. Fill rest: dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1]).
3. Return dp[m-1][n-1].
**Complexity:** O(m*n) time, O(1) space if modifying grid in-place.`,
  },
  {
    slug: 'triangle',
    lists: ['Top Interview'],
    category: '2-D DP',
    solution: `**Approach:** Bottom-up DP
**Key Insight:** Start from the bottom row and work up. For each cell, add the minimum of the two cells below it. The top cell ends up with the answer.
**Steps:**
1. Copy the bottom row into dp array.
2. For each row from second-to-last up to top: dp[j] = triangle[i][j] + min(dp[j], dp[j+1]).
3. Return dp[0].
**Complexity:** O(n²) time, O(n) space.`,
  },
  {
    slug: 'longest-palindromic-subsequence',
    lists: ['Top Interview'],
    category: '2-D DP',
    solution: `**Approach:** 2D DP
**Key Insight:** dp[i][j] = longest palindromic subsequence in s[i..j]. If s[i] == s[j], dp[i][j] = dp[i+1][j-1] + 2. Otherwise dp[i][j] = max(dp[i+1][j], dp[i][j-1]).
**Alternative:** LCS of s and reverse(s).
**Steps:**
1. Base case: dp[i][i] = 1 for all i.
2. Fill for increasing lengths. If chars match, extend. Else take max of excluding either end.
**Complexity:** O(n²) time, O(n²) space.`,
  },
  {
    slug: 'burst-balloons',
    lists: ['Top Interview'],
    category: '2-D DP',
    solution: `**Approach:** Interval DP
**Key Insight:** Think of which balloon to burst LAST in a range [i,j]. If balloon k is burst last in range, then dp[i][j] = max over k of (dp[i][k-1] + dp[k+1][j] + nums[i-1]*nums[k]*nums[j+1]).
**Steps:**
1. Add 1 to both ends of the array (virtual balloons).
2. dp[i][j] = max coins from bursting all balloons in (i, j) exclusive.
3. Fill for increasing interval lengths, trying each k as the last burst.
**Complexity:** O(n³) time, O(n²) space.`,
  },
  {
    slug: 'palindrome-partitioning',
    lists: ['NeetCode 150'],
    category: 'Backtracking',
    solution: `**Approach:** Backtracking with palindrome checking
**Key Insight:** Try every prefix that is a palindrome, then recursively partition the rest. Use backtracking to collect all valid partitions.
**Steps:**
1. DFS(start, current_partition): if start == n, add partition to results.
2. For end from start to n-1: if s[start..end] is palindrome, recurse with end+1.
3. Backtrack by removing the last substring.
**Optimization:** Precompute a palindrome table dp[i][j] for O(1) checks.
**Complexity:** O(n * 2^n) time worst case.`,
  },

  // ============================================================
  // Classic Graph
  // ============================================================
  {
    slug: 'alien-dictionary',
    lists: ['Blind 75', 'NeetCode 150'],
    category: 'Graphs',
    solution: `**Approach:** Topological sort on character graph
**Key Insight:** Compare adjacent words to derive ordering constraints (edges). Build a directed graph of character ordering. Topological sort gives the alien alphabet order. If there's a cycle, return "".
**Steps:**
1. Compare consecutive words: find first differing character → add edge.
2. If a shorter word comes after a longer word with the same prefix → invalid.
3. Topological sort (BFS/Kahn's) on the character graph.
**Complexity:** O(total characters) time, O(1) space (26 chars max).`,
  },
  {
    slug: 'graph-valid-tree',
    lists: ['Blind 75', 'NeetCode 150'],
    category: 'Graphs',
    solution: `**Approach:** Union-Find or DFS
**Key Insight:** A graph is a valid tree if it has exactly n-1 edges and is fully connected (no cycles). Use union-find: if unioning two already-connected nodes, there's a cycle.
**Steps:**
1. If edges != n-1, return false.
2. Union-Find: for each edge, if find(u) == find(v), cycle → false. Else union.
3. Check all nodes are connected (single component).
**Complexity:** O(n * α(n)) time, O(n) space.`,
  },
  {
    slug: 'number-of-connected-components-in-an-undirected-graph',
    lists: ['Blind 75', 'NeetCode 150'],
    category: 'Graphs',
    solution: `**Approach:** Union-Find or DFS
**Key Insight:** Count connected components using Union-Find (start with n components, each union reduces by 1) or DFS (count number of DFS calls from unvisited nodes).
**Steps (Union-Find):**
1. Initialize n components.
2. For each edge: if find(u) != find(v), union them, decrement count.
3. Return count.
**Complexity:** O(E * α(n)) time, O(n) space.`,
  },
  {
    slug: 'walls-and-gates',
    lists: ['NeetCode 150'],
    category: 'Graphs',
    solution: `**Approach:** Multi-source BFS from all gates
**Key Insight:** Start BFS from all gate cells (value 0) simultaneously. Each level increments distance by 1. This fills in the shortest distance from any gate for all empty rooms.
**Steps:**
1. Add all gate positions to queue.
2. BFS: for each cell, update unvisited neighbors with distance + 1.
3. Walls and gates are never updated.
**Complexity:** O(m*n) time, O(m*n) space.`,
  },
  {
    slug: 'max-area-of-island',
    lists: ['NeetCode 150', 'Grind 169'],
    category: 'Graphs',
    solution: `**Approach:** DFS/BFS flood fill
**Key Insight:** Same as Number of Islands, but instead of counting islands, track the size of each island and return the maximum.
**Steps:**
1. For each unvisited '1', DFS/BFS to count the area. Mark visited.
2. Track the maximum area found.
**Complexity:** O(m*n) time, O(m*n) space.`,
  },
  {
    slug: 'evaluate-division',
    lists: ['Top Interview'],
    category: 'Graphs',
    solution: `**Approach:** Build weighted graph + BFS/DFS
**Key Insight:** a/b = k means edge a→b with weight k and b→a with weight 1/k. To evaluate x/y, find a path from x to y in the graph and multiply the edge weights.
**Steps:**
1. Build adjacency list with weights from equations.
2. For each query [x, y]: BFS/DFS from x to y, multiplying weights along the path.
3. If no path exists or variables unknown, return -1.
**Complexity:** O(Q * (V + E)) time.`,
  },
  {
    slug: 'critical-connections-in-a-network',
    lists: ['Top Interview'],
    category: 'Graphs',
    solution: `**Approach:** Tarjan's Bridge-Finding Algorithm
**Key Insight:** An edge (u,v) is a bridge if removing it disconnects the graph. Use DFS with discovery times. Track the lowest reachable discovery time (low-link). If low[v] > disc[u], edge (u,v) is a bridge.
**Steps:**
1. DFS from any node, assigning discovery times.
2. For each node, compute low[u] = min of disc[u], disc of back-edge ancestors, and low of children.
3. If low[v] > disc[u] for child v, (u,v) is a bridge.
**Complexity:** O(V + E) time, O(V) space.`,
  },

  // ============================================================
  // Classic Tree
  // ============================================================
  {
    slug: 'path-sum',
    lists: ['Top Interview'],
    category: 'Trees',
    solution: `**Approach:** DFS
**Key Insight:** Subtract the current node's value from targetSum as you go down. At a leaf, check if remaining sum is 0.
**Steps:**
1. If null, return false.
2. Subtract node.val from targetSum.
3. If leaf and targetSum == 0, return true.
4. Recurse on left and right.
**Complexity:** O(n) time, O(h) space.`,
  },
  {
    slug: 'symmetric-tree',
    lists: ['Top Interview'],
    category: 'Trees',
    solution: `**Approach:** Recursive mirror check
**Key Insight:** A tree is symmetric if the left subtree is a mirror of the right subtree. Compare left.left with right.right and left.right with right.left.
**Steps:**
1. Helper isMirror(t1, t2): if both null, true. If one null, false.
2. If t1.val != t2.val, false.
3. Return isMirror(t1.left, t2.right) && isMirror(t1.right, t2.left).
**Complexity:** O(n) time, O(h) space.`,
  },
  {
    slug: 'populating-next-right-pointers-in-each-node',
    lists: ['Top Interview'],
    category: 'Trees',
    solution: `**Approach:** BFS level-order or use existing next pointers
**Key Insight:** For a perfect binary tree: node.left.next = node.right. If node.next exists, node.right.next = node.next.left. Process level by level using the next pointers already established.
**Steps:**
1. Start at root. For each level, iterate using next pointers.
2. Connect children: left.next = right. If next exists, right.next = next.left.
3. Move to next level (leftmost child).
**Complexity:** O(n) time, O(1) space.`,
  },
  {
    slug: 'binary-tree-zigzag-level-order-traversal',
    lists: ['Top Interview'],
    category: 'Trees',
    solution: `**Approach:** BFS with alternating direction
**Key Insight:** Standard level-order traversal but reverse every other level's result. Use a flag to track direction.
**Steps:**
1. BFS with queue. Process each level.
2. If current level is odd (0-indexed), reverse the level's values before adding to result.
3. Toggle direction flag.
**Complexity:** O(n) time, O(n) space.`,
  },
  {
    slug: 'flatten-binary-tree-to-linked-list',
    lists: ['Top Interview'],
    category: 'Trees',
    solution: `**Approach:** Reverse postorder (right, left, root) or Morris-like
**Key Insight:** Process in reverse preorder (right → left → root). Keep a "prev" pointer. Set each node's right to prev and left to null.
**Alternative:** For each node, find the rightmost node in the left subtree, point it to the right subtree, then move left subtree to right.
**Steps:**
1. For each node: if left exists, find rightmost of left subtree. Point its right to node.right. Move node.left to node.right. Set node.left = null.
**Complexity:** O(n) time, O(1) space with iterative.`,
  },

  // ============================================================
  // Classic Design
  // ============================================================
  {
    slug: 'lfu-cache',
    lists: ['Top Interview'],
    category: 'Design',
    solution: `**Approach:** Hash Map + Frequency Buckets with Doubly Linked Lists
**Key Insight:** Like LRU but evict by least frequency (ties broken by LRU within that frequency). Maintain a map from frequency → doubly-linked-list of nodes. Track the minimum frequency.
**Steps:**
get: if key exists, increment its frequency, move to new frequency bucket, return value.
put: if exists, update and increment freq. If new and at capacity, evict from min-frequency bucket's tail. Insert at head of frequency-1 bucket. Update minFreq = 1.
**Complexity:** O(1) for both get and put.`,
  },
  {
    slug: 'design-hit-counter',
    lists: ['Top Interview'],
    category: 'Design',
    solution: `**Approach:** Circular buffer of size 300
**Key Insight:** Only need to count hits in the last 300 seconds. Use two arrays of size 300: times[] and hits[]. Index = timestamp % 300. If times[idx] == timestamp, increment. Else reset.
**Steps:**
hit(t): idx = t % 300. If times[idx] == t, hits[idx]++. Else times[idx] = t, hits[idx] = 1.
getHits(t): sum all hits[i] where times[i] > t - 300.
**Complexity:** hit O(1), getHits O(300) = O(1).`,
  },
  {
    slug: 'min-stack',
    lists: ['Grind 169', 'NeetCode 150'],
    category: 'Stack',
    solution: `**Approach:** Two stacks — main stack + min stack
**Key Insight:** Maintain a parallel stack that tracks the current minimum. When pushing, also push to min stack if the value is <= current min.
**Complexity:** O(1) for all operations. O(n) space.`,
  },

  // ============================================================
  // More Classic Arrays
  // ============================================================
  {
    slug: 'longest-substring-with-at-most-k-distinct-characters',
    lists: ['Top Interview'],
    category: 'Sliding Window',
    solution: `**Approach:** Sliding window with hash map
**Key Insight:** Maintain a window with at most k distinct characters using a hash map (char → count). When distinct count exceeds k, shrink from the left.
**Steps:**
1. Expand right, add char to map.
2. While map.size > k: decrement map[left char], remove if 0, move left.
3. Track max window size.
**Complexity:** O(n) time, O(k) space.`,
  },
  {
    slug: 'encode-and-decode-strings',
    lists: ['Blind 75', 'NeetCode 150'],
    category: 'Arrays & Hashing',
    solution: `**Approach:** Length-prefixed encoding
**Key Insight:** Encode each string as its length + a delimiter + the string itself. E.g., "hello" → "5#hello". This handles any characters including the delimiter.
**Steps:**
encode: for each string, append len(s) + '#' + s.
decode: read the number before '#', extract that many characters, repeat.
**Complexity:** O(total chars) time, O(1) extra space.`,
  },
  {
    slug: 'meeting-rooms',
    lists: ['Blind 75', 'NeetCode 150'],
    category: 'Intervals',
    solution: `**Approach:** Sort by start time, check overlaps
**Key Insight:** Sort intervals by start time. If any interval's start < previous interval's end, there's an overlap (can't attend all meetings).
**Steps:**
1. Sort by start time.
2. For i from 1 to n-1: if intervals[i].start < intervals[i-1].end, return false.
3. Return true.
**Complexity:** O(n log n) time, O(1) space.`,
  },
  {
    slug: 'meeting-rooms-ii',
    lists: ['Blind 75', 'NeetCode 150'],
    category: 'Intervals',
    solution: `**Approach:** Min-heap or sweep line
**Key Insight (heap):** Sort by start time. Use a min-heap of end times. For each meeting, if earliest ending room is free (heap top <= current start), reuse it (pop). Always push current end. Heap size = rooms needed.
**Key Insight (sweep line):** Separate start and end times, sort. Sweep through: +1 at start, -1 at end. Max concurrent = answer.
**Complexity:** O(n log n) time, O(n) space.`,
  },

  // ============================================================
  // More Classic Strings
  // ============================================================
  {
    slug: 'longest-repeating-substring',
    lists: ['Top Interview'],
    category: 'Binary Search',
    solution: `**Approach:** Binary search on length + rolling hash (Rabin-Karp)
**Key Insight:** Binary search for the longest length L such that a repeating substring of length L exists. For each L, use rolling hash to check for duplicate substrings in O(n).
**Steps:**
1. Binary search: lo=1, hi=n-1. For each mid, check if a repeating substring of length mid exists.
2. Use rolling hash: compute hashes of all substrings of length L, check for duplicates.
**Complexity:** O(n log n) average time with good hash.`,
  },
  {
    slug: 'group-shifted-strings',
    lists: ['Top Interview'],
    category: 'Arrays & Hashing',
    solution: `**Approach:** Normalize shift pattern as key
**Key Insight:** Two strings belong to the same group if the differences between consecutive characters (mod 26) are the same. Use this difference tuple as a hash map key.
**Steps:**
1. For each string, compute the key = tuple of (s[i] - s[i-1]) % 26 for each consecutive pair.
2. Group strings by this key in a hash map.
**Complexity:** O(total chars) time, O(total chars) space.`,
  },
  {
    slug: 'zigzag-conversion',
    lists: ['Top Interview'],
    category: 'String',
    solution: `**Approach:** Simulate rows
**Key Insight:** Create numRows strings. Iterate through characters, distributing them to rows in a zigzag pattern (down then up). Concatenate all rows.
**Steps:**
1. Create numRows empty strings. Track current row and direction.
2. For each char: append to current row. If at top or bottom, reverse direction. Move to next row.
3. Concatenate all rows.
**Complexity:** O(n) time, O(n) space.`,
  },

  // ============================================================
  // More Backtracking
  // ============================================================
  {
    slug: 'restore-ip-addresses',
    lists: ['Top Interview'],
    category: 'Backtracking',
    solution: `**Approach:** Backtracking with constraints
**Key Insight:** An IP has 4 parts, each 0-255, no leading zeros. Try placing dots at valid positions and validate each part.
**Steps:**
1. DFS(start, parts): if 4 parts and start == n, add to results.
2. Try 1-3 digit segments from start. Validate: no leading zeros, value 0-255.
3. Recurse with remaining string and incremented part count.
**Complexity:** O(1) — bounded by 3^4 valid placements.`,
  },
  {
    slug: 'word-break-ii',
    lists: ['Top Interview'],
    category: 'Backtracking',
    solution: `**Approach:** Backtracking with memoization
**Key Insight:** At each position, try every word in the dictionary that matches the prefix. Recursively solve the rest. Memoize results per start index.
**Steps:**
1. DFS(start): for each word matching s[start..], recurse on rest.
2. Memoize: cache the list of valid sentences from each start index.
3. Combine current word + each result from recursion.
**Complexity:** Exponential worst case, but memoization prunes significantly.`,
  },

  // ============================================================
  // More Stack / Monotonic Stack
  // ============================================================
  {
    slug: 'online-stock-span',
    lists: ['Top Interview'],
    category: 'Stack',
    solution: `**Approach:** Monotonic decreasing stack
**Key Insight:** Maintain a stack of (price, span) pairs. When a new price comes in, pop all entries with price <= current, accumulating their spans. Push the new entry with the total span.
**Steps:**
1. Stack stores (price, span).
2. For each new price: span = 1. While stack top's price <= current price: pop, span += popped span.
3. Push (price, span). Return span.
**Complexity:** Amortized O(1) per call, O(n) space.`,
  },
  {
    slug: 'car-fleet',
    lists: ['NeetCode 150'],
    category: 'Stack',
    solution: `**Approach:** Sort by position descending + monotonic stack
**Key Insight:** Sort cars by starting position (closest to target first). Compute arrival time for each. A slower car ahead blocks faster ones behind — they merge into a fleet. Count distinct fleets using a stack of arrival times.
**Steps:**
1. Pair (position, speed), sort by position descending.
2. Compute time = (target - pos) / speed for each car.
3. Stack: if current time > stack top, push (new fleet). Else, it merges with the fleet ahead.
4. Return stack size.
**Complexity:** O(n log n) time, O(n) space.`,
  },

  // ============================================================
  // More Binary Search
  // ============================================================
  {
    slug: 'find-peak-element',
    lists: ['Top Interview'],
    category: 'Binary Search',
    solution: `**Approach:** Binary search
**Key Insight:** If nums[mid] < nums[mid+1], a peak exists on the right side (ascending). Otherwise, a peak exists on the left side (including mid). This works because nums[-1] = nums[n] = -∞.
**Steps:**
1. lo = 0, hi = n-1.
2. While lo < hi: mid = (lo+hi)/2. If nums[mid] < nums[mid+1], lo = mid+1. Else hi = mid.
3. Return lo.
**Complexity:** O(log n) time, O(1) space.`,
  },
  {
    slug: 'find-first-and-last-position-of-element-in-sorted-array',
    lists: ['Top Interview'],
    category: 'Binary Search',
    solution: `**Approach:** Two binary searches — find leftmost and rightmost
**Key Insight:** Binary search twice: once to find the first occurrence (go left on match) and once to find the last (go right on match).
**Steps:**
findLeft: if nums[mid] >= target, hi = mid. Else lo = mid+1. Check if nums[lo] == target.
findRight: if nums[mid] <= target, lo = mid. Else hi = mid-1. Check if nums[hi] == target.
**Complexity:** O(log n) time, O(1) space.`,
  },

  // ============================================================
  // More Linked List
  // ============================================================
  {
    slug: 'intersection-of-two-linked-lists',
    lists: ['Top Interview'],
    category: 'Linked List',
    solution: `**Approach:** Two pointers — switch heads
**Key Insight:** Pointer A traverses list A then list B. Pointer B traverses list B then list A. They will meet at the intersection (or both reach null) because they travel the same total distance.
**Steps:**
1. pA = headA, pB = headB.
2. While pA != pB: pA = pA ? pA.next : headB. pB = pB ? pB.next : headA.
3. Return pA (intersection or null).
**Complexity:** O(m + n) time, O(1) space.`,
  },
  {
    slug: 'swap-nodes-in-pairs',
    lists: ['Top Interview'],
    category: 'Linked List',
    solution: `**Approach:** Iterative with dummy node
**Key Insight:** For each pair (first, second): redirect pointers so second comes before first. Use a prev pointer to connect to the previous pair.
**Steps:**
1. dummy → head. prev = dummy.
2. While prev.next and prev.next.next: first = prev.next, second = first.next.
3. prev.next = second. first.next = second.next. second.next = first. prev = first.
**Complexity:** O(n) time, O(1) space.`,
  },
  {
    slug: 'odd-even-linked-list',
    lists: ['Top Interview'],
    category: 'Linked List',
    solution: `**Approach:** Separate odd and even indexed nodes, then concatenate
**Key Insight:** Maintain two pointers: odd and even. Odd skips to even's next, even skips to odd's next. Finally, connect odd list's tail to even list's head.
**Steps:**
1. odd = head, even = head.next, evenHead = even.
2. While even and even.next: odd.next = even.next, odd = odd.next. even.next = odd.next, even = even.next.
3. odd.next = evenHead.
**Complexity:** O(n) time, O(1) space.`,
  },
  {
    slug: 'linked-list-cycle-ii',
    lists: ['Top Interview'],
    category: 'Linked List',
    solution: `**Approach:** Floyd's algorithm — find cycle start
**Key Insight:** After slow and fast meet (cycle detected), move one pointer back to head. Advance both by 1 step — they meet at the cycle start. This works because the distance from head to cycle start equals the distance from meeting point to cycle start (going around).
**Steps:**
1. Detect cycle with slow/fast. If no cycle, return null.
2. Reset one pointer to head. Advance both by 1.
3. They meet at the cycle start.
**Complexity:** O(n) time, O(1) space.`,
  },

  // ============================================================
  // More Math / Bit
  // ============================================================
  {
    slug: 'integer-to-roman',
    lists: ['Top Interview'],
    category: 'Math',
    solution: `**Approach:** Greedy with value table
**Key Insight:** Define value-symbol pairs in descending order (including subtractive forms: 900=CM, 400=CD, etc.). Greedily subtract the largest possible value and append its symbol.
**Steps:**
1. Table: [(1000,'M'),(900,'CM'),(500,'D'),(400,'CD'),...,(1,'I')].
2. For each (val, sym): while num >= val: append sym, num -= val.
**Complexity:** O(1) time (bounded by 3999), O(1) space.`,
  },
  {
    slug: 'multiply-strings',
    lists: ['Top Interview'],
    category: 'Math',
    solution: `**Approach:** Grade-school multiplication
**Key Insight:** Result has at most m+n digits. For each pair of digits num1[i] * num2[j], the product contributes to positions [i+j] and [i+j+1] in the result array.
**Steps:**
1. Create result array of size m+n, filled with 0.
2. For each i (right to left in num1), for each j (right to left in num2): mul = digit_i * digit_j. Add to result[i+j+1]. Carry to result[i+j].
3. Convert result array to string, strip leading zeros.
**Complexity:** O(m*n) time, O(m+n) space.`,
  },
  {
    slug: 'basic-calculator-ii',
    lists: ['Top Interview'],
    category: 'Stack',
    solution: `**Approach:** Stack with operator precedence
**Key Insight:** Process * and / immediately (higher precedence), defer + and -. Use a stack: for +/-, push number (with sign). For *//,  pop and compute immediately, push result.
**Steps:**
1. Track current number and previous operator (default '+').
2. When hitting an operator or end: if prev op is +, push num. If -, push -num. If *, push stack.pop() * num. If /, push trunc(stack.pop() / num).
3. Return sum of stack.
**Complexity:** O(n) time, O(n) space.`,
  },

  // ============================================================
  // More Heap
  // ============================================================
  {
    slug: 'top-k-frequent-words',
    lists: ['Top Interview'],
    category: 'Heap',
    solution: `**Approach:** Hash map + min-heap of size k (or bucket sort)
**Key Insight:** Count frequencies, then use a min-heap of size k to find the top k. For ties, sort alphabetically (custom comparator).
**Steps:**
1. Count word frequencies.
2. Push into min-heap with comparator: lower freq first, then reverse alphabetical for ties.
3. Pop all from heap, reverse for final order.
**Complexity:** O(n log k) time, O(n) space.`,
  },
  {
    slug: 'merge-k-sorted-arrays',
    lists: ['Top Interview'],
    category: 'Heap',
    solution: `**Approach:** Min-heap
**Key Insight:** Push the first element of each array into a min-heap with (value, array_index, element_index). Pop minimum, push the next element from that array.
**Steps:**
1. Initialize heap with first element of each array.
2. Pop minimum, add to result. Push next element from the same array (if exists).
3. Repeat until heap is empty.
**Complexity:** O(N log k) time where N = total elements, k = number of arrays.`,
  },

  // ============================================================
  // More Greedy
  // ============================================================
  {
    slug: 'meeting-rooms-iii',
    lists: ['Top Interview'],
    category: 'Heap',
    solution: `**Approach:** Two heaps — available rooms and busy rooms
**Key Insight:** Use a min-heap of available room numbers and a min-heap of (end_time, room_number) for busy rooms. For each meeting (sorted by start), free up rooms that finished, then assign.
**Steps:**
1. Sort meetings by start time. Available heap = [0, 1, ..., n-1]. Busy heap = [].
2. For each meeting: move finished rooms from busy to available. If available, assign lowest room. Else, wait for earliest busy room to finish.
3. Track meeting count per room. Return room with most meetings.
**Complexity:** O(m log n) time where m = meetings, n = rooms.`,
  },
  {
    slug: 'largest-number',
    lists: ['Top Interview'],
    category: 'Greedy',
    solution: `**Approach:** Custom sort comparator
**Key Insight:** Compare two numbers a and b by comparing the concatenations "ab" vs "ba". If "ab" > "ba", a should come first.
**Steps:**
1. Convert all numbers to strings.
2. Sort with comparator: a+b > b+a → a comes first.
3. Concatenate sorted strings. Handle edge case: if result starts with '0', return '0'.
**Complexity:** O(n log n * k) time where k = average digit count.`,
  },

  // ============================================================
  // More Classic Must-Know
  // ============================================================
  {
    slug: 'design-hashmap',
    lists: ['Top Interview'],
    category: 'Design',
    solution: `**Approach:** Array of linked lists (chaining)
**Key Insight:** Use a fixed-size array (e.g., 10007 — a prime). Hash function = key % size. Handle collisions with linked lists (chaining).
**Steps:**
put: compute bucket = key % size. Search the chain for the key. If found, update. Else, append.
get: compute bucket, search chain. Return value or -1.
remove: compute bucket, search chain, remove node.
**Complexity:** O(n/k) average per operation where k = bucket count.`,
  },
  {
    slug: 'random-pick-with-weight',
    lists: ['Top Interview'],
    category: 'Binary Search',
    solution: `**Approach:** Prefix sum + binary search
**Key Insight:** Build a prefix sum of weights. Generate a random number in [1, total_weight]. Binary search for the smallest prefix sum >= random number. That index is the picked element.
**Steps:**
1. Build prefix sum array.
2. Pick random int in [1, total]. Binary search for leftmost index where prefix[i] >= random.
**Complexity:** O(n) init, O(log n) per pick.`,
  },
  {
    slug: 'maximal-rectangle',
    lists: ['Top Interview'],
    category: 'Stack',
    solution: `**Approach:** Largest Rectangle in Histogram per row
**Key Insight:** For each row, compute the histogram heights (consecutive 1s above including current row). Then apply Largest Rectangle in Histogram on each row's histogram.
**Steps:**
1. For each row, update heights: if matrix[i][j] == '1', height[j]++. Else height[j] = 0.
2. Apply monotonic stack (Largest Rectangle in Histogram) on heights.
3. Track global max area.
**Complexity:** O(m*n) time, O(n) space.`,
  },
  {
    slug: 'word-pattern',
    lists: ['Top Interview'],
    category: 'Arrays & Hashing',
    solution: `**Approach:** Two-way mapping
**Key Insight:** Map each pattern character to a word and each word to a pattern character. Both mappings must be consistent (bijection).
**Steps:**
1. Split string by spaces. If lengths differ from pattern, return false.
2. Map char → word and word → char. If any mismatch, return false.
**Complexity:** O(n) time, O(n) space.`,
  },
  {
    slug: 'isomorphic-strings',
    lists: ['Top Interview'],
    category: 'Arrays & Hashing',
    solution: `**Approach:** Two-way character mapping
**Key Insight:** Same as Word Pattern but character-to-character. Map s[i] → t[i] and t[i] → s[i]. Both must be consistent.
**Steps:**
1. If lengths differ, false.
2. Two maps: s_to_t and t_to_s. For each position, check and update both maps.
**Complexity:** O(n) time, O(1) space (bounded alphabet).`,
  },
  {
    slug: 'game-of-life',
    lists: ['Top Interview'],
    category: 'Matrix',
    solution: `**Approach:** In-place with state encoding
**Key Insight:** Use intermediate states to avoid needing a copy: 2 = was alive, now dead. 3 = was dead, now alive. This way we can read the original state (val % 2) while computing the next.
**Steps:**
1. For each cell, count live neighbors (using val % 2 to read original state).
2. Apply rules: live cell with 2-3 neighbors stays (else mark 2). Dead cell with 3 neighbors becomes alive (mark 3).
3. Final pass: replace 2→0, 3→1.
**Complexity:** O(m*n) time, O(1) space.`,
  },
  {
    slug: 'container-with-most-water',
    lists: ['Blind 75', 'Grind 169', 'NeetCode 150'],
    category: 'Two Pointers',
    solution: `**Approach:** Two Pointers (greedy)
**Key Insight:** Start with widest container. Move the shorter pointer inward — moving the taller one can never help.
**Complexity:** O(n) time, O(1) space.`,
  },

  // ============================================================
  // More DP Classics
  // ============================================================
  {
    slug: 'dungeon-game',
    lists: ['Top Interview'],
    category: '2-D DP',
    solution: `**Approach:** Bottom-up DP from bottom-right
**Key Insight:** Work backwards from the princess. dp[i][j] = minimum HP needed at (i,j) to survive to the end. dp[i][j] = max(1, min(dp[i+1][j], dp[i][j+1]) - dungeon[i][j]).
**Steps:**
1. dp[m-1][n-1] = max(1, 1 - dungeon[m-1][n-1]).
2. Fill last row and column. Then fill rest from bottom-right to top-left.
3. Return dp[0][0].
**Complexity:** O(m*n) time, O(m*n) space.`,
  },
  {
    slug: 'cherry-pickup-ii',
    lists: ['Top Interview'],
    category: '2-D DP',
    solution: `**Approach:** 3D DP (row, col1, col2)
**Key Insight:** Two robots start at top corners. At each row, each can move to 3 columns (left, stay, right). dp[row][c1][c2] = max cherries collected from row to bottom with robot 1 at c1 and robot 2 at c2.
**Steps:**
1. Base case: last row values. If c1 == c2, count once.
2. For each row (bottom-up): try all 9 combinations of moves for both robots.
3. Return dp[0][0][n-1].
**Complexity:** O(m * n²) time, O(n²) space with rolling array.`,
  },
  {
    slug: 'russian-doll-envelopes',
    lists: ['Top Interview'],
    category: '1-D DP',
    solution: `**Approach:** Sort + LIS on heights
**Key Insight:** Sort by width ascending, then by height descending (for same width). Then find the LIS on heights — this gives the maximum nesting. Sorting height descending for same width prevents using two envelopes with the same width.
**Steps:**
1. Sort: (w ascending, h descending).
2. Extract heights array. Find LIS using patience sorting (binary search on tails).
**Complexity:** O(n log n) time, O(n) space.`,
  },
];

export default extra;
