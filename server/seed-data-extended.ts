import type { SeedProblem } from './seed-data.js';

const extended: SeedProblem[] = [
  // ============================================================
  // Array — Extra
  // ============================================================
  {
    slug: 'majority-element',
    category: 'Arrays & Hashing',
    solution: `**Approach:** Boyer-Moore Voting Algorithm
**Key Insight:** Maintain a candidate and a count. If count drops to 0, pick the current element as the new candidate. The majority element will always survive.
**Steps:**
1. candidate = nums[0], count = 1.
2. For each subsequent num: if num == candidate, count++. Else count--.
3. If count == 0, candidate = num, count = 1.
4. Return candidate.
**Complexity:** O(n) time, O(1) space.`,
  },
  {
    slug: 'sort-colors',
    category: 'Arrays & Hashing',
    solution: `**Approach:** Dutch National Flag (three-way partition)
**Key Insight:** Use three pointers: lo (next 0 position), mid (current), hi (next 2 position). Swap 0s to the front and 2s to the back in a single pass.
**Steps:**
1. lo = 0, mid = 0, hi = n-1.
2. While mid <= hi:
   - If nums[mid] == 0: swap(lo, mid), lo++, mid++.
   - If nums[mid] == 1: mid++.
   - If nums[mid] == 2: swap(mid, hi), hi--.
**Complexity:** O(n) time, O(1) space, single pass.`,
  },
  {
    slug: 'move-zeroes',
    category: 'Arrays & Hashing',
    solution: `**Approach:** Two pointers — write pointer
**Key Insight:** Use a write pointer to track where the next non-zero should go. Iterate with a read pointer; when a non-zero is found, write it to the write position and advance.
**Steps:**
1. writeIdx = 0.
2. For each num: if num != 0, nums[writeIdx++] = num.
3. Fill remaining positions with 0.
**Complexity:** O(n) time, O(1) space.`,
  },
  {
    slug: 'squares-of-a-sorted-array',
    category: 'Arrays & Hashing',
    solution: `**Approach:** Two pointers from both ends
**Key Insight:** The input is sorted, so the largest squares are at the extremes (most negative or most positive). Use two pointers from both ends, placing the larger square at the end of the result.
**Steps:**
1. left = 0, right = n-1. result array, fill from end.
2. Compare abs(nums[left]) vs abs(nums[right]). Place larger square, move that pointer.
**Complexity:** O(n) time, O(n) space for output.`,
  },
  {
    slug: 'subarray-sum-equals-k',
    category: 'Arrays & Hashing',
    solution: `**Approach:** Prefix sum + hash map
**Key Insight:** If prefix[j] - prefix[i] == k, then subarray (i, j] sums to k. Use a hash map to count how many prefix sums equal (currentPrefix - k).
**Steps:**
1. Map: {prefix_sum → count}. Initialize map[0] = 1.
2. Running prefix = 0, count = 0.
3. For each num: prefix += num. count += map[prefix - k]. map[prefix]++.
**Complexity:** O(n) time, O(n) space.`,
  },
  {
    slug: 'two-sum-ii-input-array-is-sorted',
    category: 'Two Pointers',
    solution: `**Approach:** Two pointers
**Key Insight:** Since the array is sorted, use left and right pointers. If sum < target, move left right. If sum > target, move right left. Exactly one solution is guaranteed.
**Steps:**
1. left = 0, right = n-1.
2. While left < right: sum = nums[left] + nums[right].
3. If sum == target, return [left+1, right+1]. If sum < target, left++. Else right--.
**Complexity:** O(n) time, O(1) space.`,
  },

  // ============================================================
  // String — Extra
  // ============================================================
  {
    slug: 'longest-common-prefix',
    category: 'String',
    solution: `**Approach:** Vertical scanning
**Key Insight:** Compare characters at the same position across all strings. Stop when a mismatch is found or a string ends.
**Steps:**
1. For each character index i (up to the shortest string's length):
2. Compare strs[0][i] with all other strs[j][i]. If mismatch, return strs[0][0..i-1].
3. If all match, continue. Return strs[0] if all characters matched.
**Complexity:** O(S) time where S = sum of all characters. O(1) space.`,
  },
  {
    slug: 'valid-palindrome-ii',
    category: 'String',
    solution: `**Approach:** Two pointers with one deletion allowance
**Key Insight:** Use two pointers from both ends. On the first mismatch, try skipping either the left or the right character, and check if the remaining substring is a palindrome.
**Steps:**
1. left = 0, right = n-1.
2. While left < right: if s[left] != s[right], check isPalindrome(left+1, right) || isPalindrome(left, right-1).
3. If no mismatch found, return true.
**Complexity:** O(n) time, O(1) space.`,
  },
  {
    slug: 'find-all-anagrams-in-a-string',
    category: 'Sliding Window',
    solution: `**Approach:** Sliding window with frequency comparison
**Key Insight:** Maintain a window of size len(p). Use a frequency count that tracks the difference between the window and p. When all counts are zero, it's an anagram.
**Steps:**
1. Build frequency map for p. Use a "matches" counter for how many characters have matching counts.
2. Slide a window of size len(p) over s. Add right char, remove left char, update matches.
3. When matches == 26, record the start index.
**Complexity:** O(n) time, O(1) space (fixed 26-char alphabet).`,
  },
  {
    slug: 'longest-palindrome',
    category: 'String',
    solution: `**Approach:** Character frequency counting
**Key Insight:** A palindrome can have at most one character with an odd count (the center). Use all even-count characters fully, and for odd-count characters, use count-1. Add 1 if any odd count exists.
**Steps:**
1. Count character frequencies.
2. length = sum of (count // 2 * 2) for each character.
3. If length < total string length, length++ (one center character).
**Complexity:** O(n) time, O(1) space.`,
  },
  {
    slug: 'string-to-integer-atoi',
    category: 'String',
    solution: `**Approach:** Sequential parsing
**Key Insight:** Handle whitespace, sign, digit conversion, and overflow in order. Stop at the first non-digit character after the sign.
**Steps:**
1. Skip leading whitespace.
2. Check for optional '+' or '-' sign.
3. Convert digits, checking for overflow at each step.
4. Clamp to [INT_MIN, INT_MAX] on overflow.
**Complexity:** O(n) time, O(1) space.`,
  },
  {
    slug: 'minimum-remove-to-make-valid-parentheses',
    category: 'Stack',
    solution: `**Approach:** Stack to track invalid parentheses indices
**Key Insight:** Use a stack to find unmatched parentheses indices. Push index for '('. For ')', if stack has '(', pop; otherwise push ')' index. Remove all indices in the stack.
**Steps:**
1. Stack stores indices. For each char: if '(' push index. If ')': pop if top is '(', else push index.
2. Collect all indices in stack into a set.
3. Build result string skipping those indices.
**Complexity:** O(n) time, O(n) space.`,
  },

  // ============================================================
  // Binary Search — Extra
  // ============================================================
  {
    slug: 'binary-search',
    category: 'Binary Search',
    solution: `**Approach:** Standard binary search
**Key Insight:** Repeatedly halve the search space. Compare the middle element with the target.
**Steps:**
1. lo = 0, hi = n-1.
2. While lo <= hi: mid = (lo + hi) / 2.
3. If nums[mid] == target, return mid. If nums[mid] < target, lo = mid+1. Else hi = mid-1.
4. Return -1 if not found.
**Complexity:** O(log n) time, O(1) space.`,
  },
  {
    slug: 'first-bad-version',
    category: 'Binary Search',
    solution: `**Approach:** Binary search for leftmost true
**Key Insight:** Binary search for the first version where isBadVersion returns true. If mid is bad, the answer is mid or earlier. If mid is good, the answer is later.
**Steps:**
1. lo = 1, hi = n.
2. While lo < hi: mid = lo + (hi - lo) / 2.
3. If isBadVersion(mid), hi = mid. Else lo = mid + 1.
4. Return lo.
**Complexity:** O(log n) time, O(1) space.`,
  },
  {
    slug: 'search-a-2d-matrix',
    category: 'Binary Search',
    solution: `**Approach:** Treat 2D matrix as a sorted 1D array
**Key Insight:** The matrix rows are sorted and each row starts after the previous row ends. Map 1D index to 2D: row = idx / cols, col = idx % cols. Then standard binary search.
**Steps:**
1. lo = 0, hi = m*n - 1.
2. Binary search: mid → matrix[mid/n][mid%n].
3. Compare with target and adjust lo/hi.
**Complexity:** O(log(m*n)) time, O(1) space.`,
  },
  {
    slug: 'koko-eating-bananas',
    category: 'Binary Search',
    solution: `**Approach:** Binary search on the eating speed
**Key Insight:** Binary search for the minimum speed k such that Koko can eat all bananas within h hours. For each speed, compute hours needed = sum(ceil(pile/k)).
**Steps:**
1. lo = 1, hi = max(piles).
2. While lo < hi: mid = (lo + hi) / 2. Compute total hours at speed mid.
3. If hours <= h, hi = mid. Else lo = mid + 1.
4. Return lo.
**Complexity:** O(n * log(max_pile)) time, O(1) space.`,
  },
  {
    slug: 'time-based-key-value-store',
    category: 'Binary Search',
    solution: `**Approach:** Hash map + binary search on timestamps
**Key Insight:** Store (timestamp, value) pairs in a list for each key. Since timestamps are strictly increasing (set is called with increasing timestamps), binary search for the largest timestamp <= given timestamp.
**Steps:**
set: append (timestamp, value) to the key's list.
get: binary search the key's list for the largest timestamp <= given. Return the corresponding value, or "" if none.
**Complexity:** set O(1), get O(log n).`,
  },

  // ============================================================
  // Linked List — Extra
  // ============================================================
  {
    slug: 'middle-of-the-linked-list',
    category: 'Linked List',
    solution: `**Approach:** Slow and fast pointers
**Key Insight:** Slow moves 1 step, fast moves 2 steps. When fast reaches the end, slow is at the middle.
**Steps:**
1. slow = head, fast = head.
2. While fast and fast.next: slow = slow.next, fast = fast.next.next.
3. Return slow.
**Complexity:** O(n) time, O(1) space.`,
  },
  {
    slug: 'palindrome-linked-list',
    category: 'Linked List',
    solution: `**Approach:** Find middle + reverse second half + compare
**Key Insight:** Use slow/fast to find the middle, reverse the second half, then compare both halves node by node.
**Steps:**
1. Find middle with slow/fast pointers.
2. Reverse the second half.
3. Compare first half and reversed second half.
4. (Optional) Restore the list.
**Complexity:** O(n) time, O(1) space.`,
  },
  {
    slug: 'add-two-numbers',
    category: 'Linked List',
    solution: `**Approach:** Elementary addition with carry
**Key Insight:** Numbers are stored in reverse order, so we can add digit by digit from the head, tracking carry. Create new nodes for the sum.
**Steps:**
1. Traverse both lists simultaneously. sum = l1.val + l2.val + carry.
2. New node value = sum % 10. carry = sum / 10 (integer division).
3. Advance pointers. After both lists end, if carry > 0, add one more node.
**Complexity:** O(max(m, n)) time, O(max(m, n)) space.`,
  },
  {
    slug: 'copy-list-with-random-pointer',
    category: 'Linked List',
    solution: `**Approach:** Hash map: original → copy
**Key Insight:** First pass: create all copied nodes and store in a map. Second pass: set next and random pointers using the map.
**Steps:**
1. Map each original node to its copy.
2. For each original node: copy.next = map[original.next], copy.random = map[original.random].
**Alternative:** Interleave copies between originals (O(1) space).
**Complexity:** O(n) time, O(n) space.`,
  },
  {
    slug: 'sort-list',
    category: 'Linked List',
    solution: `**Approach:** Merge sort on linked list
**Key Insight:** Split the list in half using slow/fast, recursively sort both halves, then merge. Linked list merge sort achieves O(1) extra space (unlike arrays).
**Steps:**
1. Base case: list is empty or has one node.
2. Find middle with slow/fast. Split into two halves.
3. Recursively sort both halves.
4. Merge two sorted halves.
**Complexity:** O(n log n) time, O(log n) space for recursion stack.`,
  },
  {
    slug: 'reverse-nodes-in-k-group',
    category: 'Linked List',
    solution: `**Approach:** Iteratively reverse k nodes at a time
**Key Insight:** Count k nodes ahead. If k nodes exist, reverse that segment and connect it to the previous group. Otherwise, leave the remaining nodes as-is.
**Steps:**
1. Use a dummy node before head.
2. For each group: check if k nodes remain. If yes, reverse them in-place. Connect previous group's tail to new head.
3. Move to the next group.
**Complexity:** O(n) time, O(1) space.`,
  },

  // ============================================================
  // Stack — Extra
  // ============================================================
  {
    slug: 'min-stack',
    category: 'Stack',
    solution: `**Approach:** Two stacks — main stack + min stack
**Key Insight:** Maintain a parallel stack that tracks the current minimum. When pushing, also push to min stack if the value is <= current min. When popping, also pop from min stack if the value equals current min.
**Alternative:** Store (value, currentMin) pairs in a single stack.
**Complexity:** O(1) for all operations. O(n) space.`,
  },
  {
    slug: 'evaluate-reverse-polish-notation',
    category: 'Stack',
    solution: `**Approach:** Stack-based evaluation
**Key Insight:** Push numbers onto the stack. When an operator is encountered, pop two operands, apply the operator, and push the result back.
**Steps:**
1. For each token: if it's a number, push. If operator, pop b, pop a, push a op b.
2. Final stack element is the result.
**Note:** Division truncates toward zero.
**Complexity:** O(n) time, O(n) space.`,
  },
  {
    slug: 'largest-rectangle-in-histogram',
    category: 'Stack',
    solution: `**Approach:** Monotonic increasing stack
**Key Insight:** Use a stack of indices with increasing heights. When a shorter bar is encountered, pop taller bars and calculate the area they can form. The width extends from the current stack top to the current index.
**Steps:**
1. Stack stores indices. For each bar i:
2. While stack is non-empty and heights[stack.top()] > heights[i]: pop idx. Width = i - stack.top() - 1 (or i if stack is empty). Area = heights[idx] * width. Update max.
3. Push i. After loop, process remaining in stack with i = n.
**Complexity:** O(n) time, O(n) space.`,
  },
  {
    slug: 'basic-calculator',
    category: 'Stack',
    solution: `**Approach:** Stack for handling parentheses + sign tracking
**Key Insight:** Use a stack to save/restore the sign and running result when entering/exiting parentheses. Track the current sign (+1 or -1) and accumulate the result.
**Steps:**
1. Iterate characters. For digits, build the full number.
2. For '+'/'-', apply the number with the current sign, then update the sign.
3. For '(', push current result and sign onto stack, reset.
4. For ')', apply current number, multiply by saved sign, add to saved result.
**Complexity:** O(n) time, O(n) space.`,
  },

  // ============================================================
  // Queue
  // ============================================================
  {
    slug: 'implement-queue-using-stacks',
    category: 'Design',
    solution: `**Approach:** Two stacks — push stack and pop stack
**Key Insight:** Push into stack1. For pop/peek, if stack2 is empty, transfer all elements from stack1 (reversing order). Pop from stack2.
**Steps:**
push: push to stack1.
pop/peek: if stack2 empty, move all from stack1 to stack2. Pop/peek from stack2.
**Amortized O(1) per operation because each element is moved at most once.
**Complexity:** Amortized O(1) per operation. O(n) space.`,
  },

  // ============================================================
  // Trees — Extra
  // ============================================================
  {
    slug: 'diameter-of-binary-tree',
    category: 'Trees',
    solution: `**Approach:** DFS — track depth, compute diameter at each node
**Key Insight:** The diameter through a node = left_depth + right_depth. The depth function returns max depth going down. Track the global maximum diameter.
**Steps:**
1. DFS returns depth of the subtree.
2. At each node: left = dfs(left), right = dfs(right).
3. Update max_diameter with left + right.
4. Return 1 + max(left, right) as depth.
**Complexity:** O(n) time, O(h) space.`,
  },
  {
    slug: 'balanced-binary-tree',
    category: 'Trees',
    solution: `**Approach:** DFS returning height, -1 for unbalanced
**Key Insight:** A tree is balanced if every node's left and right heights differ by at most 1. Return -1 early if any subtree is unbalanced.
**Steps:**
1. DFS(node): if null, return 0.
2. left = DFS(left), right = DFS(right).
3. If left == -1 or right == -1 or abs(left - right) > 1, return -1.
4. Return 1 + max(left, right).
5. Tree is balanced if DFS(root) != -1.
**Complexity:** O(n) time, O(h) space.`,
  },
  {
    slug: 'count-good-nodes-in-binary-tree',
    category: 'Trees',
    solution: `**Approach:** DFS passing the maximum value along the path
**Key Insight:** A node is "good" if its value is >= the maximum value from the root to that node. Pass the current max down the DFS.
**Steps:**
1. DFS(node, maxSoFar): if null, return 0.
2. good = 1 if node.val >= maxSoFar, else 0.
3. newMax = max(maxSoFar, node.val).
4. Return good + DFS(left, newMax) + DFS(right, newMax).
**Complexity:** O(n) time, O(h) space.`,
  },
  {
    slug: 'binary-tree-right-side-view',
    category: 'Trees',
    solution: `**Approach:** BFS (level-order), take the last node per level
**Key Insight:** Perform level-order traversal. The rightmost node at each level is visible from the right side.
**Steps:**
1. BFS with queue. Process each level.
2. The last node in each level's processing is the right-side-view node.
**Alternative DFS:** Traverse right first, then left. Track depth; add node if depth == result.length (first node seen at that depth).
**Complexity:** O(n) time, O(n) space.`,
  },
  {
    slug: 'lowest-common-ancestor-of-a-binary-tree',
    category: 'Trees',
    solution: `**Approach:** Recursive DFS
**Key Insight:** If the current node is p or q, return it. Recursively search left and right. If both sides return non-null, current node is the LCA. If only one side returns non-null, propagate it up.
**Steps:**
1. If node is null or node == p or node == q, return node.
2. left = LCA(node.left, p, q). right = LCA(node.right, p, q).
3. If both non-null, return node (LCA found).
4. Return left or right (whichever is non-null).
**Complexity:** O(n) time, O(h) space.`,
  },

  // ============================================================
  // Graph — Extra
  // ============================================================
  {
    slug: 'rotting-oranges',
    category: 'Graphs',
    solution: `**Approach:** Multi-source BFS
**Key Insight:** Start BFS from ALL rotten oranges simultaneously (multi-source). Each BFS level = 1 minute. Track the number of fresh oranges; if any remain after BFS, return -1.
**Steps:**
1. Add all rotten orange positions to the queue. Count fresh oranges.
2. BFS: for each level, rot adjacent fresh oranges, decrement fresh count.
3. Return minutes elapsed, or -1 if fresh > 0.
**Complexity:** O(m*n) time, O(m*n) space.`,
  },
  {
    slug: 'accounts-merge',
    category: 'Graphs',
    solution: `**Approach:** Union-Find (or DFS on email graph)
**Key Insight:** Build a graph where emails in the same account are connected. Find connected components — each component is one person's merged account.
**Steps:**
1. Map each email to an account index. Union emails within the same account.
2. Group emails by their root representative.
3. For each group, sort emails and prepend the account name.
**Complexity:** O(n * α(n)) with union-find, where n = total emails.`,
  },
  {
    slug: 'word-ladder',
    category: 'Graphs',
    solution: `**Approach:** BFS on word graph
**Key Insight:** Each word is a node. Two words are connected if they differ by one character. BFS from beginWord to endWord gives the shortest transformation.
**Steps:**
1. Put all words in a set for O(1) lookup.
2. BFS from beginWord. For each word, try changing each character to a-z. If the new word is in the set, add to next level, remove from set.
3. Return the level when endWord is reached, or 0 if not reachable.
**Complexity:** O(M² * N) where M = word length, N = word list size.`,
  },
  {
    slug: 'network-delay-time',
    category: 'Graphs',
    solution: `**Approach:** Dijkstra's shortest path
**Key Insight:** Find the shortest path from source node k to all other nodes. The answer is the maximum of all shortest distances. If any node is unreachable, return -1.
**Steps:**
1. Build adjacency list. Use a min-heap (priority queue).
2. Dijkstra from node k: process minimum-distance node, relax edges.
3. Return max distance among all nodes, or -1 if not all reached.
**Complexity:** O(E log V) time, O(V + E) space.`,
  },
  {
    slug: 'redundant-connection',
    category: 'Graphs',
    solution: `**Approach:** Union-Find
**Key Insight:** Process edges one by one. The first edge that connects two already-connected nodes is the redundant edge (creates the cycle).
**Steps:**
1. Initialize union-find with n nodes.
2. For each edge [u, v]: if find(u) == find(v), return this edge (it creates a cycle). Else, union(u, v).
**Complexity:** O(n * α(n)) time, O(n) space.`,
  },
  {
    slug: 'surrounded-regions',
    category: 'Graphs',
    solution: `**Approach:** DFS/BFS from border O's
**Key Insight:** O's connected to the border cannot be captured. Mark all border-connected O's, then flip all remaining O's to X.
**Steps:**
1. DFS/BFS from every 'O' on the border, marking them as safe (e.g., '#').
2. Iterate the board: 'O' → 'X' (captured), '#' → 'O' (restored).
**Complexity:** O(m*n) time, O(m*n) space.`,
  },

  // ============================================================
  // Heap — Extra
  // ============================================================
  {
    slug: 'k-closest-points-to-origin',
    category: 'Heap',
    solution: `**Approach:** Max-heap of size k (or Quickselect)
**Key Insight:** Use a max-heap of size k. For each point, if it's closer than the heap's max, replace it. After processing all points, the heap contains the k closest.
**Alternative:** Quickselect (partition-based) for average O(n).
**Complexity:** O(n log k) time with heap, O(n) average with quickselect. O(k) space.`,
  },
  {
    slug: 'kth-largest-element-in-an-array',
    category: 'Heap',
    solution: `**Approach:** Quickselect (partition-based)
**Key Insight:** Use quickselect to find the (n-k)th smallest element. Partition around a pivot; if the pivot lands at index n-k, we're done. Otherwise recurse on the correct side.
**Alternative:** Min-heap of size k — the top is the kth largest.
**Complexity:** O(n) average with quickselect, O(n log k) with heap.`,
  },
  {
    slug: 'reorganize-string',
    category: 'Heap',
    solution: `**Approach:** Max-heap by frequency
**Key Insight:** Always place the most frequent character next, but never the same character consecutively. Use a max-heap. After placing a character, hold it out for one round before reinserting.
**Steps:**
1. Count frequencies. Build max-heap.
2. Pop the most frequent char, append to result. Hold the previous char.
3. Re-insert the held char (if count > 0). If heap is empty and held char exists, it's impossible.
**Complexity:** O(n log 26) = O(n) time.`,
  },

  // ============================================================
  // DP — Extra
  // ============================================================
  {
    slug: 'min-cost-climbing-stairs',
    category: '1-D DP',
    solution: `**Approach:** DP — similar to climbing stairs
**Key Insight:** dp[i] = min cost to reach step i = min(dp[i-1] + cost[i-1], dp[i-2] + cost[i-2]). Start from step 0 or 1 (both free).
**Steps:**
1. dp[0] = 0, dp[1] = 0 (can start at either).
2. For i from 2 to n: dp[i] = min(dp[i-1] + cost[i-1], dp[i-2] + cost[i-2]).
3. Return dp[n].
**Complexity:** O(n) time, O(1) space with two variables.`,
  },
  {
    slug: 'partition-equal-subset-sum',
    category: '1-D DP',
    solution: `**Approach:** 0/1 Knapsack — can we make sum/2?
**Key Insight:** If total sum is odd, impossible. Otherwise, find if a subset sums to sum/2. Use a boolean DP set: dp[j] = true if sum j is achievable.
**Steps:**
1. If sum is odd, return false. target = sum / 2.
2. dp = set containing {0}. For each num, add num to each existing sum (iterate in reverse to avoid reuse).
3. Return dp[target].
**Complexity:** O(n * target) time, O(target) space.`,
  },
  {
    slug: 'edit-distance',
    category: '2-D DP',
    solution: `**Approach:** 2D DP
**Key Insight:** dp[i][j] = min operations to convert word1[0..i-1] to word2[0..j-1]. If chars match, dp[i][j] = dp[i-1][j-1]. Otherwise, min of insert (dp[i][j-1]+1), delete (dp[i-1][j]+1), replace (dp[i-1][j-1]+1).
**Steps:**
1. dp[0][j] = j, dp[i][0] = i (all insertions/deletions).
2. Fill table: if word1[i-1] == word2[j-1], dp[i][j] = dp[i-1][j-1]. Else dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]).
3. Return dp[m][n].
**Complexity:** O(m*n) time, O(m*n) space (can optimize to O(n)).`,
  },
  {
    slug: 'target-sum',
    category: '1-D DP',
    solution: `**Approach:** DP — count subsets (transformed knapsack)
**Key Insight:** Assigning + and - partitions nums into two groups: P (positive) and N (negative). P - N = target, P + N = sum. So P = (sum + target) / 2. Reduce to: count subsets summing to P.
**Steps:**
1. If (sum + target) is odd or target > sum, return 0. newTarget = (sum + target) / 2.
2. dp[j] = number of ways to make sum j. dp[0] = 1.
3. For each num: for j from newTarget down to num: dp[j] += dp[j - num].
**Complexity:** O(n * target) time, O(target) space.`,
  },
  {
    slug: 'best-time-to-buy-and-sell-stock-with-cooldown',
    category: '1-D DP',
    solution: `**Approach:** State machine DP
**Key Insight:** Three states: hold (holding a stock), sold (just sold), rest (cooldown/idle). Transitions:
- hold = max(hold, rest - price) — buy or keep holding
- sold = hold + price — sell
- rest = max(rest, sold) — do nothing or finish cooldown
**Steps:**
1. hold = -prices[0], sold = 0, rest = 0.
2. For each price: update all three states simultaneously.
3. Return max(sold, rest).
**Complexity:** O(n) time, O(1) space.`,
  },
  {
    slug: 'regular-expression-matching',
    category: '2-D DP',
    solution: `**Approach:** 2D DP
**Key Insight:** dp[i][j] = does s[0..i-1] match p[0..j-1]? If p[j-1] is '*', it matches zero occurrences (dp[i][j-2]) or one+ occurrences (dp[i-1][j] if s[i-1] matches p[j-2]). If p[j-1] is '.', it matches any single character.
**Steps:**
1. dp[0][0] = true. Handle patterns like a*, a*b*, etc. for empty string.
2. For each (i, j): if p[j-1] == '*': dp[i][j] = dp[i][j-2] || (match(s[i-1], p[j-2]) && dp[i-1][j]).
3. If p[j-1] is '.' or matches s[i-1]: dp[i][j] = dp[i-1][j-1].
**Complexity:** O(m*n) time, O(m*n) space.`,
  },

  // ============================================================
  // Backtracking — Extra
  // ============================================================
  {
    slug: 'permutations',
    category: 'Backtracking',
    solution: `**Approach:** Backtracking with used array
**Key Insight:** Build permutations one element at a time. For each position, try every unused element. Mark as used, recurse, then unmark (backtrack).
**Steps:**
1. If current permutation length == n, add to results.
2. For each num not yet used: add to current, mark used, recurse, backtrack.
**Alternative:** Swap-based: for position i, swap with each element from i to n-1.
**Complexity:** O(n! * n) time, O(n) space.`,
  },
  {
    slug: 'subsets',
    category: 'Backtracking',
    solution: `**Approach:** Backtracking (or iterative bit manipulation)
**Key Insight:** For each element, choose to include or exclude it. This generates all 2^n subsets.
**Steps (backtracking):**
1. DFS(start, current): add current to results.
2. For i from start to n-1: add nums[i], recurse with i+1, backtrack (remove).
**Iterative:** Start with [[]]. For each num, duplicate all existing subsets and add num to each copy.
**Complexity:** O(2^n * n) time, O(n) space for recursion.`,
  },
  {
    slug: 'subsets-ii',
    category: 'Backtracking',
    solution: `**Approach:** Sort + backtracking with duplicate skipping
**Key Insight:** Sort the array first. During backtracking, skip duplicate elements at the same level (if nums[i] == nums[i-1] and i > start, skip).
**Steps:**
1. Sort nums.
2. DFS(start, current): add current to results.
3. For i from start to n-1: if i > start and nums[i] == nums[i-1], skip. Else include nums[i], recurse, backtrack.
**Complexity:** O(2^n * n) time.`,
  },
  {
    slug: 'letter-combinations-of-a-phone-number',
    category: 'Backtracking',
    solution: `**Approach:** Backtracking with digit-to-letters mapping
**Key Insight:** Map each digit to its letters (2→abc, 3→def, etc.). For each digit, try each mapped letter and recurse to the next digit.
**Steps:**
1. Build mapping: {'2': 'abc', '3': 'def', ...}.
2. DFS(index, current): if index == digits.length, add current to results.
3. For each letter in mapping[digits[index]]: append letter, recurse(index+1), backtrack.
**Complexity:** O(4^n) time where n = number of digits (worst case 4 letters per digit).`,
  },
  {
    slug: 'generate-parentheses',
    category: 'Backtracking',
    solution: `**Approach:** Backtracking with open/close counts
**Key Insight:** We can add '(' if open count < n. We can add ')' if close count < open count. This ensures validity.
**Steps:**
1. DFS(current, open, close):
2. If length == 2n, add to results.
3. If open < n, add '(', recurse.
4. If close < open, add ')', recurse.
**Complexity:** O(4^n / sqrt(n)) — the n-th Catalan number.`,
  },
  {
    slug: 'n-queens',
    category: 'Backtracking',
    solution: `**Approach:** Backtracking row by row
**Key Insight:** Place one queen per row. For each row, try each column. Check that no column, diagonal, or anti-diagonal is already occupied using sets.
**Steps:**
1. DFS(row): for each col in 0..n-1:
2. If col, (row-col), (row+col) are not in their respective occupied sets: place queen, add to sets, recurse to next row, backtrack.
3. When row == n, record the board state.
**Complexity:** O(n!) time roughly.`,
  },
  {
    slug: 'combination-sum-ii',
    category: 'Backtracking',
    solution: `**Approach:** Sort + backtracking with duplicate skipping
**Key Insight:** Sort first. Each number can only be used once. Skip duplicates at the same recursion level (if nums[i] == nums[i-1] and i > start, skip).
**Steps:**
1. Sort candidates.
2. DFS(start, remaining, current): if remaining == 0, add to results. If < 0, return.
3. For i from start to n-1: skip if i > start and nums[i] == nums[i-1]. Recurse with i+1 and remaining - nums[i].
**Complexity:** O(2^n) worst case.`,
  },

  // ============================================================
  // Matrix — Extra
  // ============================================================
  {
    slug: 'valid-sudoku',
    category: 'Matrix',
    solution: `**Approach:** Hash sets for rows, columns, and boxes
**Key Insight:** For each filled cell, check if the digit already exists in its row, column, or 3x3 box. Use 9 sets for rows, 9 for columns, 9 for boxes.
**Steps:**
1. For each cell (i, j) with a digit: box_index = (i/3)*3 + j/3.
2. If digit is in row[i], col[j], or box[box_index], return false.
3. Add digit to all three sets.
4. If no conflict found, return true.
**Complexity:** O(81) = O(1) time, O(81) = O(1) space.`,
  },

  // ============================================================
  // Greedy — Extra
  // ============================================================
  {
    slug: 'gas-station',
    category: 'Greedy',
    solution: `**Approach:** Single pass greedy
**Key Insight:** If total gas >= total cost, a solution exists. Start tracking from index 0. If the running surplus goes negative, reset the start to the next index (all previous starts fail).
**Steps:**
1. totalSurplus = 0, currentSurplus = 0, start = 0.
2. For each i: diff = gas[i] - cost[i]. totalSurplus += diff. currentSurplus += diff.
3. If currentSurplus < 0: start = i + 1, currentSurplus = 0.
4. Return totalSurplus >= 0 ? start : -1.
**Complexity:** O(n) time, O(1) space.`,
  },
  {
    slug: 'hand-of-straights',
    category: 'Greedy',
    solution: `**Approach:** Greedy with sorted map/counter
**Key Insight:** Sort the cards. Always try to form a group starting from the smallest available card. Use a frequency map and greedily take consecutive cards.
**Steps:**
1. If n % groupSize != 0, return false.
2. Count frequencies. Sort unique values.
3. For each smallest card: try to form a group of groupSize consecutive cards. Decrement counts. If any card is missing, return false.
**Complexity:** O(n log n) time, O(n) space.`,
  },
  {
    slug: 'partition-labels',
    category: 'Greedy',
    solution: `**Approach:** Greedy — extend partition to include all occurrences
**Key Insight:** For each character, find its last occurrence. A partition must extend at least to the last occurrence of every character within it. Greedily extend the end.
**Steps:**
1. Map each character to its last occurrence index.
2. Iterate: track partition start and end. For each char, extend end = max(end, lastOccurrence[char]).
3. When i == end, record partition size, start new partition.
**Complexity:** O(n) time, O(1) space.`,
  },
  {
    slug: 'jump-game-ii',
    category: 'Greedy',
    solution: `**Approach:** Greedy BFS — track farthest reachable per jump
**Key Insight:** Think of it as BFS levels. Each "level" is one jump. Track the farthest index reachable in the current level. When we pass the current level's end, increment jumps.
**Steps:**
1. jumps = 0, currentEnd = 0, farthest = 0.
2. For i from 0 to n-2: farthest = max(farthest, i + nums[i]).
3. If i == currentEnd: jumps++, currentEnd = farthest.
4. Return jumps.
**Complexity:** O(n) time, O(1) space.`,
  },

  // ============================================================
  // Bit — Extra
  // ============================================================
  {
    slug: 'single-number',
    category: 'Bit Manipulation',
    solution: `**Approach:** XOR all elements
**Key Insight:** XOR of a number with itself is 0. XOR of a number with 0 is itself. Since every number appears twice except one, XOR all elements gives the single number.
**Steps:**
1. result = 0. For each num: result ^= num.
2. Return result.
**Complexity:** O(n) time, O(1) space.`,
  },

  // ============================================================
  // Math — Extra
  // ============================================================
  {
    slug: 'powx-n',
    category: 'Math',
    solution: `**Approach:** Fast exponentiation (binary exponentiation)
**Key Insight:** x^n = (x^(n/2))^2 if n is even, x * (x^(n/2))^2 if n is odd. Handle negative exponents by computing 1/x^(-n).
**Steps:**
1. If n < 0, x = 1/x, n = -n.
2. result = 1. While n > 0: if n is odd, result *= x. x *= x. n = n / 2.
**Complexity:** O(log n) time, O(1) space.`,
  },
  {
    slug: 'plus-one',
    category: 'Math',
    solution: `**Approach:** Iterate from the last digit, handle carry
**Key Insight:** Add 1 to the last digit. If it becomes 10, set to 0 and carry 1 to the next digit. If carry propagates past the first digit, prepend 1.
**Steps:**
1. For i from end to 0: digits[i]++. If digits[i] < 10, return. Else digits[i] = 0.
2. If we exit the loop, prepend 1 (e.g., 999 → 1000).
**Complexity:** O(n) time, O(1) space (or O(n) if prepending).`,
  },
  {
    slug: 'happy-number',
    category: 'Math',
    solution: `**Approach:** Floyd's cycle detection (or hash set)
**Key Insight:** Repeatedly compute sum of squared digits. If we reach 1, it's happy. Otherwise, the sequence cycles. Use slow/fast pointers (or a set) to detect the cycle.
**Steps (set):**
1. Compute next = sum of squares of digits.
2. If next == 1, return true. If next is in set, return false (cycle). Add to set.
**Steps (Floyd's):** slow = n, fast = next(n). Move slow by 1, fast by 2 until they meet or one reaches 1.
**Complexity:** O(log n) per step, O(1) space with Floyd's.`,
  },
  {
    slug: 'roman-to-integer',
    category: 'Math',
    solution: `**Approach:** Iterate right to left (or left to right with subtraction rule)
**Key Insight:** If a smaller value appears before a larger value, subtract it (e.g., IV = 4). Otherwise, add it.
**Steps:**
1. Map: I=1, V=5, X=10, L=50, C=100, D=500, M=1000.
2. Iterate from left to right. If current < next, subtract current. Else add.
**Complexity:** O(n) time, O(1) space.`,
  },
  {
    slug: 'reverse-integer',
    category: 'Math',
    solution: `**Approach:** Pop and push digits, check overflow
**Key Insight:** Repeatedly pop the last digit (x % 10) and push it to the result (result * 10 + digit). Before pushing, check if result would overflow 32-bit integer range.
**Steps:**
1. While x != 0: digit = x % 10. Check overflow before result = result * 10 + digit. x = x / 10 (truncated).
2. Return result, or 0 if overflow detected.
**Complexity:** O(log x) time, O(1) space.`,
  },

  // ============================================================
  // Sliding Window — Extra
  // ============================================================
  {
    slug: 'sliding-window-maximum',
    category: 'Sliding Window',
    solution: `**Approach:** Monotonic decreasing deque
**Key Insight:** Maintain a deque of indices in decreasing order of values. The front of the deque is always the maximum. Remove elements that fall outside the window from the front, and remove smaller elements from the back when adding a new element.
**Steps:**
1. Deque stores indices. For each i:
2. Remove front if it's outside the window (i - front >= k).
3. Remove from back while nums[back] <= nums[i].
4. Push i to back. If i >= k-1, front of deque is the max for this window.
**Complexity:** O(n) time, O(k) space.`,
  },
  {
    slug: 'permutation-in-string',
    category: 'Sliding Window',
    solution: `**Approach:** Fixed-size sliding window with frequency match
**Key Insight:** Slide a window of size len(s1) over s2. Use a frequency count difference. When all counts are 0, s2's window is a permutation of s1.
**Steps:**
1. Build frequency count of s1. Slide window of size len(s1) over s2.
2. Add right char (decrement count), remove left char (increment count).
3. Track how many characters have matching counts. When matches == 26, return true.
**Complexity:** O(n) time, O(1) space.`,
  },

  // ============================================================
  // Design — Extra
  // ============================================================
  {
    slug: 'design-twitter',
    category: 'Design',
    solution: `**Approach:** Hash maps + merge k sorted lists
**Key Insight:** Each user has a list of tweets (timestamped). For getNewsFeed, merge the k most recent tweets from the user and their followees — a min-heap of size k problem.
**Steps:**
Follow/Unfollow: hash map of userId → set of followees.
PostTweet: append (timestamp, tweetId) to user's tweet list.
GetNewsFeed: collect the most recent tweets from user + followees using a max-heap, take top 10.
**Complexity:** getNewsFeed O(k log k) where k = followees.`,
  },

  // ============================================================
  // More Classic Popular Problems
  // ============================================================
  {
    slug: 'next-permutation',
    category: 'Arrays & Hashing',
    solution: `**Approach:** Find rightmost ascent, swap, reverse suffix
**Key Insight:** Find the rightmost pair where nums[i] < nums[i+1] (the "ascent point"). Swap nums[i] with the smallest element to its right that is larger. Reverse the suffix after i.
**Steps:**
1. Find largest i where nums[i] < nums[i+1]. If none, reverse entire array.
2. Find largest j where nums[j] > nums[i]. Swap nums[i] and nums[j].
3. Reverse the subarray after index i.
**Complexity:** O(n) time, O(1) space.`,
  },
  {
    slug: 'first-missing-positive',
    category: 'Arrays & Hashing',
    solution: `**Approach:** Cyclic sort / index as hash
**Key Insight:** Place each number i in position i-1 (i.e., nums[i-1] = i). Then scan for the first position where nums[i] != i+1. That i+1 is the answer.
**Steps:**
1. For each index i: while nums[i] is in range [1, n] and nums[i] != nums[nums[i]-1], swap nums[i] to its correct position.
2. Scan for first i where nums[i] != i+1. Return i+1.
3. If all correct, return n+1.
**Complexity:** O(n) time, O(1) space.`,
  },
  {
    slug: 'longest-valid-parentheses',
    category: 'Stack',
    solution: `**Approach:** Stack with index tracking
**Key Insight:** Push indices onto the stack. Push -1 initially as a base. For '(', push index. For ')', pop. If stack is empty, push current index as new base. Otherwise, length = i - stack.top().
**Steps:**
1. Stack = [-1]. maxLen = 0.
2. For each i: if '(', push i. If ')': pop. If stack empty, push i. Else maxLen = max(maxLen, i - stack.top()).
**Alternative:** Two-pass with counters (left to right, then right to left).
**Complexity:** O(n) time, O(n) space.`,
  },
  {
    slug: 'remove-duplicates-from-sorted-array',
    category: 'Two Pointers',
    solution: `**Approach:** Two pointers — write pointer
**Key Insight:** Use a write pointer (slow) starting at 1. For each element (fast pointer), if it differs from the previous unique element, write it.
**Steps:**
1. If empty, return 0. slow = 1.
2. For fast from 1 to n-1: if nums[fast] != nums[fast-1], nums[slow++] = nums[fast].
3. Return slow.
**Complexity:** O(n) time, O(1) space.`,
  },
  {
    slug: 'search-insert-position',
    category: 'Binary Search',
    solution: `**Approach:** Binary search for insertion point
**Key Insight:** Standard binary search. If target is found, return the index. If not, lo will be at the correct insertion position.
**Steps:**
1. lo = 0, hi = n-1.
2. While lo <= hi: mid = (lo + hi) / 2.
3. If nums[mid] == target, return mid. If nums[mid] < target, lo = mid+1. Else hi = mid-1.
4. Return lo.
**Complexity:** O(log n) time, O(1) space.`,
  },
  {
    slug: 'best-time-to-buy-and-sell-stock-ii',
    category: 'Greedy',
    solution: `**Approach:** Greedy — collect every upward move
**Key Insight:** Since you can make unlimited transactions, add up every positive price difference between consecutive days. This captures all possible profit.
**Steps:**
1. profit = 0.
2. For i from 1 to n-1: if prices[i] > prices[i-1], profit += prices[i] - prices[i-1].
3. Return profit.
**Complexity:** O(n) time, O(1) space.`,
  },
  {
    slug: 'interleaving-string',
    category: '2-D DP',
    solution: `**Approach:** 2D DP
**Key Insight:** dp[i][j] = true if s3[0..i+j-1] can be formed by interleaving s1[0..i-1] and s2[0..j-1]. Either the last char came from s1 or s2.
**Steps:**
1. If len(s1) + len(s2) != len(s3), return false.
2. dp[i][j] = (dp[i-1][j] and s1[i-1] == s3[i+j-1]) or (dp[i][j-1] and s2[j-1] == s3[i+j-1]).
3. Return dp[m][n].
**Complexity:** O(m*n) time, O(m*n) space (can optimize to O(n)).`,
  },
  {
    slug: 'cheapest-flights-within-k-stops',
    category: 'Graphs',
    solution: `**Approach:** Bellman-Ford with k+1 relaxations (or modified Dijkstra/BFS)
**Key Insight:** Run Bellman-Ford for exactly k+1 iterations (k stops = k+1 edges). In each iteration, relax all edges using the *previous* iteration's distances to avoid extra hops.
**Steps:**
1. dist = array of infinity. dist[src] = 0.
2. For k+1 iterations: copy dist to prev. For each edge (u, v, w): dist[v] = min(dist[v], prev[u] + w).
3. Return dist[dst] if not infinity, else -1.
**Complexity:** O(k * E) time, O(V) space.`,
  },
  {
    slug: 'minimum-height-trees',
    category: 'Graphs',
    solution: `**Approach:** Topological peeling — remove leaves layer by layer
**Key Insight:** The roots of minimum height trees are the "center" of the tree (1 or 2 nodes). Repeatedly remove leaf nodes until 1-2 nodes remain — like peeling an onion.
**Steps:**
1. Build adjacency list and degree count. Queue all leaves (degree 1).
2. While remaining nodes > 2: remove all current leaves, update neighbors' degrees, add new leaves.
3. Return remaining nodes.
**Complexity:** O(n) time, O(n) space.`,
  },
  {
    slug: 'path-sum-ii',
    category: 'Trees',
    solution: `**Approach:** DFS backtracking
**Key Insight:** Traverse root-to-leaf paths, tracking the running sum. When a leaf is reached and sum equals targetSum, add the path to results. Backtrack after processing each node.
**Steps:**
1. DFS(node, remaining, path): if null, return.
2. Add node.val to path. remaining -= node.val.
3. If leaf and remaining == 0, add copy of path to results.
4. Recurse left and right. Pop node from path (backtrack).
**Complexity:** O(n * h) time (h for copying paths), O(h) space.`,
  },
  {
    slug: 'distinct-subsequences',
    category: '2-D DP',
    solution: `**Approach:** 2D DP
**Key Insight:** dp[i][j] = number of ways to form t[0..j-1] from s[0..i-1]. If s[i-1] == t[j-1], dp[i][j] = dp[i-1][j-1] + dp[i-1][j] (use this char or skip). Otherwise dp[i][j] = dp[i-1][j].
**Steps:**
1. dp[i][0] = 1 for all i (empty t matches any prefix of s).
2. For each (i, j): dp[i][j] = dp[i-1][j] + (s[i-1] == t[j-1] ? dp[i-1][j-1] : 0).
3. Return dp[m][n].
**Complexity:** O(m*n) time, O(m*n) space (can optimize to O(n)).`,
  },
  {
    slug: 'swim-in-rising-water',
    category: 'Graphs',
    solution: `**Approach:** Binary search + BFS/DFS, or Dijkstra-like with min-heap
**Key Insight:** We want the minimum time t such that there exists a path from (0,0) to (n-1,n-1) where all cells have elevation <= t. Use a min-heap (like Dijkstra): always expand the cell with the smallest elevation.
**Steps (min-heap):**
1. Push (grid[0][0], 0, 0) to min-heap. Track visited.
2. Pop minimum. max_elevation = max(max_so_far, cell_value).
3. If reached (n-1, n-1), return max_elevation.
4. Push all unvisited neighbors.
**Complexity:** O(n² log n) time, O(n²) space.`,
  },
  {
    slug: 'sort-characters-by-frequency',
    category: 'Heap',
    solution: `**Approach:** Frequency count + bucket sort (or max-heap)
**Key Insight:** Count character frequencies, then sort by frequency descending. Build the result by repeating each character by its count.
**Steps:**
1. Count frequencies with a map.
2. Sort entries by frequency descending (or use bucket sort with max frequency as bucket index).
3. Build result string.
**Complexity:** O(n) time with bucket sort, O(n) space.`,
  },
];

export default extended;
