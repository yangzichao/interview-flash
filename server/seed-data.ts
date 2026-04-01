export interface SeedProblem {
  slug: string;
  category: string;
  solution: string;
}

const problems: SeedProblem[] = [
  // ============================================================
  // Arrays & Hashing
  // ============================================================
  {
    slug: 'two-sum',
    category: 'Arrays & Hashing',
    solution: `**Approach:** Hash Map (one-pass)
**Key Insight:** For each number, check if (target - num) already exists in a hash map. If yes, return both indices. Otherwise, store the current number and its index.
**Steps:**
1. Create a hash map: value → index.
2. Iterate through the array. For each element, compute complement = target - nums[i].
3. If complement is in the map, return [map[complement], i].
4. Otherwise, add nums[i] → i to the map.
**Complexity:** O(n) time, O(n) space.`,
  },
  {
    slug: 'contains-duplicate',
    category: 'Arrays & Hashing',
    solution: `**Approach:** Hash Set
**Key Insight:** Insert each element into a set. If the element is already in the set, we found a duplicate.
**Steps:**
1. Create an empty set.
2. For each number, check if it's in the set. If yes, return true. Otherwise, add it.
3. If we finish without finding a duplicate, return false.
**Complexity:** O(n) time, O(n) space.`,
  },
  {
    slug: 'valid-anagram',
    category: 'Arrays & Hashing',
    solution: `**Approach:** Character frequency count
**Key Insight:** Two strings are anagrams if and only if they have the same character frequencies.
**Steps:**
1. If lengths differ, return false.
2. Count character frequencies for both strings (use an array of size 26 or a hash map).
3. Compare the frequency counts.
**Complexity:** O(n) time, O(1) space (fixed 26-char alphabet).`,
  },
  {
    slug: 'group-anagrams',
    category: 'Arrays & Hashing',
    solution: `**Approach:** Hash Map with sorted-string key
**Key Insight:** All anagrams produce the same string when their characters are sorted. Use this sorted string as a hash map key to group them.
**Steps:**
1. Create a hash map: sorted_string → list of original strings.
2. For each word, sort its characters and use as the key.
3. Return all values from the map.
**Alternative key:** Use character frequency tuple (e.g., count of each letter) as key to avoid sorting.
**Complexity:** O(n * k log k) time where k is max string length, O(n * k) space.`,
  },
  {
    slug: 'top-k-frequent-elements',
    category: 'Arrays & Hashing',
    solution: `**Approach:** Bucket Sort
**Key Insight:** Use an array of buckets where index = frequency. Since max frequency is n, we can create n+1 buckets and collect elements from high to low frequency.
**Steps:**
1. Count frequencies with a hash map.
2. Create buckets array of size n+1, where buckets[i] = list of elements with frequency i.
3. Iterate buckets from end to start, collecting elements until we have k.
**Alternative:** Use a min-heap of size k — push (freq, num) and pop when size > k.
**Complexity:** O(n) time with bucket sort, O(n) space.`,
  },
  {
    slug: 'product-of-array-except-self',
    category: 'Arrays & Hashing',
    solution: `**Approach:** Prefix and suffix products (two-pass)
**Key Insight:** result[i] = product of all elements to the left × product of all elements to the right. We can compute these with two passes without using division.
**Steps:**
1. First pass (left to right): build prefix products. result[i] = product of nums[0..i-1].
2. Second pass (right to left): multiply each result[i] by the running suffix product.
**Complexity:** O(n) time, O(1) extra space (output array doesn't count).`,
  },
  {
    slug: 'longest-consecutive-sequence',
    category: 'Arrays & Hashing',
    solution: `**Approach:** Hash Set
**Key Insight:** Put all numbers in a set. A number is the start of a sequence only if (num - 1) is NOT in the set. From each start, count consecutive numbers.
**Steps:**
1. Add all numbers to a hash set.
2. For each number, check if (num - 1) is in the set. If not, it's a sequence start.
3. From the start, keep checking num+1, num+2, ... and count the length.
4. Track the maximum length.
**Complexity:** O(n) time (each element is visited at most twice), O(n) space.`,
  },

  // ============================================================
  // Two Pointers
  // ============================================================
  {
    slug: 'valid-palindrome',
    category: 'Two Pointers',
    solution: `**Approach:** Two pointers from both ends
**Key Insight:** Use left and right pointers, skip non-alphanumeric characters, compare lowercase characters.
**Steps:**
1. Left pointer at 0, right pointer at end.
2. Skip non-alphanumeric characters on both sides.
3. Compare lowercased characters. If mismatch, return false.
4. Move pointers inward. If they cross, return true.
**Complexity:** O(n) time, O(1) space.`,
  },
  {
    slug: '3sum',
    category: 'Two Pointers',
    solution: `**Approach:** Sort + Two Pointers
**Key Insight:** Sort the array. Fix one element, then use two pointers on the remaining subarray to find pairs that sum to the negative of the fixed element. Skip duplicates to avoid repeated triplets.
**Steps:**
1. Sort the array.
2. For each index i, set target = -nums[i]. Use two pointers (lo = i+1, hi = end).
3. If sum < 0, move lo right. If sum > 0, move hi left. If sum == 0, record and skip duplicates.
4. Skip duplicate values of nums[i] as well.
**Complexity:** O(n²) time, O(1) extra space (ignoring sort).`,
  },
  {
    slug: 'container-with-most-water',
    category: 'Two Pointers',
    solution: `**Approach:** Two Pointers (greedy)
**Key Insight:** Start with the widest container (left=0, right=end). Always move the pointer with the shorter height, because moving the taller one can never increase the area (width decreases and height is bottlenecked by the shorter side).
**Steps:**
1. Left at 0, right at end. Track max area.
2. Area = min(height[l], height[r]) × (r - l).
3. Move the pointer with the smaller height inward.
4. Repeat until pointers meet.
**Complexity:** O(n) time, O(1) space.`,
  },

  // ============================================================
  // Sliding Window
  // ============================================================
  {
    slug: 'best-time-to-buy-and-sell-stock',
    category: 'Sliding Window',
    solution: `**Approach:** Single pass — track minimum price
**Key Insight:** Keep track of the minimum price seen so far. At each day, the max profit if we sell today is price - min_so_far. Track the global max.
**Steps:**
1. Initialize min_price = prices[0], max_profit = 0.
2. For each price, update min_price = min(min_price, price).
3. Update max_profit = max(max_profit, price - min_price).
**Complexity:** O(n) time, O(1) space.`,
  },
  {
    slug: 'longest-substring-without-repeating-characters',
    category: 'Sliding Window',
    solution: `**Approach:** Sliding window with hash set/map
**Key Insight:** Maintain a window [left, right] with no duplicate characters. Use a set or map to track characters in the window. When a duplicate is found, shrink from the left.
**Steps:**
1. Use a hash map: char → last seen index (or a set).
2. Expand right pointer. If char is in the map and its index >= left, move left to map[char] + 1.
3. Update map[char] = right. Track max window size.
**Complexity:** O(n) time, O(min(n, alphabet_size)) space.`,
  },
  {
    slug: 'longest-repeating-character-replacement',
    category: 'Sliding Window',
    solution: `**Approach:** Sliding window with character count
**Key Insight:** In a window of size (right - left + 1), if we know the count of the most frequent character (maxFreq), the number of characters we need to replace is windowSize - maxFreq. If this exceeds k, shrink the window.
**Steps:**
1. Use a frequency array for 26 letters. Track maxFreq.
2. Expand right: increment count. Update maxFreq.
3. If (window_size - maxFreq) > k, shrink from left.
4. Track max window size.
**Note:** maxFreq doesn't need to be decremented when shrinking — it's a historical max that only affects when the window can grow.
**Complexity:** O(n) time, O(1) space.`,
  },
  {
    slug: 'minimum-window-substring',
    category: 'Sliding Window',
    solution: `**Approach:** Sliding window with two pointers + frequency maps
**Key Insight:** Expand the window to include all characters of t, then contract from the left to find the minimum valid window. Use a "have" vs "need" counter to efficiently track when the window is valid.
**Steps:**
1. Build a frequency map for t. Track "need" = number of distinct chars in t, "have" = 0.
2. Expand right: if adding s[right] satisfies a character's required count, increment "have".
3. While have == need: update the minimum window, then shrink from left.
4. Return the minimum window found.
**Complexity:** O(n + m) time, O(m) space where m = len(t).`,
  },

  // ============================================================
  // Stack
  // ============================================================
  {
    slug: 'valid-parentheses',
    category: 'Stack',
    solution: `**Approach:** Stack
**Key Insight:** Push opening brackets onto the stack. For each closing bracket, check if it matches the top of the stack. If the stack is empty or doesn't match, return false.
**Steps:**
1. Create a map: ')' → '(', ']' → '[', '}' → '{'.
2. For each char: if opening, push. If closing, check stack top matches.
3. At the end, stack must be empty.
**Complexity:** O(n) time, O(n) space.`,
  },

  // ============================================================
  // Binary Search
  // ============================================================
  {
    slug: 'find-minimum-in-rotated-sorted-array',
    category: 'Binary Search',
    solution: `**Approach:** Modified Binary Search
**Key Insight:** Compare mid with right. If nums[mid] > nums[right], the minimum is in the right half. Otherwise, it's in the left half (including mid).
**Steps:**
1. lo = 0, hi = n-1.
2. While lo < hi: mid = (lo + hi) / 2.
3. If nums[mid] > nums[hi], lo = mid + 1 (min is in right portion).
4. Else, hi = mid (min is in left portion or is mid).
5. Return nums[lo].
**Complexity:** O(log n) time, O(1) space.`,
  },
  {
    slug: 'search-in-rotated-sorted-array',
    category: 'Binary Search',
    solution: `**Approach:** Modified Binary Search
**Key Insight:** At least one half of the array (divided by mid) is always sorted. Determine which half is sorted and check if the target lies within that sorted half.
**Steps:**
1. lo = 0, hi = n-1. While lo <= hi: mid = (lo+hi)/2.
2. If nums[mid] == target, return mid.
3. If left half is sorted (nums[lo] <= nums[mid]):
   - If target is in [nums[lo], nums[mid]), search left. Else search right.
4. Else right half is sorted:
   - If target is in (nums[mid], nums[hi]], search right. Else search left.
**Complexity:** O(log n) time, O(1) space.`,
  },

  // ============================================================
  // Linked List
  // ============================================================
  {
    slug: 'reverse-linked-list',
    category: 'Linked List',
    solution: `**Approach:** Iterative — three pointers
**Key Insight:** Use prev, curr, and next pointers. At each step, reverse the current node's pointer and advance all three.
**Steps:**
1. prev = null, curr = head.
2. While curr: save next = curr.next. Set curr.next = prev. Move prev = curr, curr = next.
3. Return prev (new head).
**Recursive approach:** reverse(head.next), then head.next.next = head, head.next = null.
**Complexity:** O(n) time, O(1) space iterative / O(n) space recursive.`,
  },
  {
    slug: 'merge-two-sorted-lists',
    category: 'Linked List',
    solution: `**Approach:** Iterative merge with dummy head
**Key Insight:** Use a dummy node to simplify edge cases. Compare heads of both lists, append the smaller one, advance that pointer.
**Steps:**
1. Create dummy node. tail = dummy.
2. While both lists are non-null: compare, append smaller to tail, advance.
3. Append remaining non-null list.
4. Return dummy.next.
**Complexity:** O(n + m) time, O(1) space.`,
  },
  {
    slug: 'reorder-list',
    category: 'Linked List',
    solution: `**Approach:** Find middle + Reverse second half + Merge
**Key Insight:** Split the list into two halves, reverse the second half, then interleave (merge) the two halves.
**Steps:**
1. Use slow/fast pointers to find the middle.
2. Reverse the second half of the list.
3. Merge the two halves by alternating nodes: take from first half, then second half.
**Complexity:** O(n) time, O(1) space.`,
  },
  {
    slug: 'remove-nth-node-from-end-of-list',
    category: 'Linked List',
    solution: `**Approach:** Two pointers with n-gap
**Key Insight:** Advance the "fast" pointer n steps ahead first. Then move both fast and slow together. When fast reaches the end, slow is at the node before the one to remove.
**Steps:**
1. Create dummy → head. fast = dummy, slow = dummy.
2. Advance fast n+1 steps.
3. Move both until fast is null. slow.next = slow.next.next.
4. Return dummy.next.
**Complexity:** O(n) time, O(1) space, single pass.`,
  },
  {
    slug: 'linked-list-cycle',
    category: 'Linked List',
    solution: `**Approach:** Floyd's Tortoise and Hare
**Key Insight:** Use a slow pointer (1 step) and fast pointer (2 steps). If there's a cycle, they will eventually meet. If fast reaches null, there's no cycle.
**Steps:**
1. slow = head, fast = head.
2. While fast and fast.next: slow = slow.next, fast = fast.next.next.
3. If slow == fast, return true (cycle found).
4. If loop ends, return false.
**Complexity:** O(n) time, O(1) space.`,
  },
  {
    slug: 'merge-k-sorted-lists',
    category: 'Linked List',
    solution: `**Approach:** Min-Heap or Divide and Conquer
**Min-Heap approach:** Push the head of each list into a min-heap. Pop the minimum, append to result, push its next node.
**Divide and Conquer:** Repeatedly merge lists in pairs (like merge sort) until one list remains.
**Steps (D&C):**
1. While more than 1 list: merge pairs → new list of merged results.
2. Each level halves the number of lists, with O(N) work per level.
**Complexity:** O(N log k) time, O(1) or O(k) space. N = total nodes, k = number of lists.`,
  },

  // ============================================================
  // Trees
  // ============================================================
  {
    slug: 'invert-binary-tree',
    category: 'Trees',
    solution: `**Approach:** Recursion (DFS)
**Key Insight:** Swap left and right children of every node, recursively.
**Steps:**
1. Base case: if node is null, return null.
2. Swap node.left and node.right.
3. Recursively invert left and right subtrees.
4. Return node.
**Complexity:** O(n) time, O(h) space where h = height.`,
  },
  {
    slug: 'maximum-depth-of-binary-tree',
    category: 'Trees',
    solution: `**Approach:** Recursion (DFS)
**Key Insight:** Depth of a tree = 1 + max(depth of left subtree, depth of right subtree).
**Steps:**
1. Base case: if null, return 0.
2. Return 1 + max(maxDepth(left), maxDepth(right)).
**Alternative:** BFS — count levels.
**Complexity:** O(n) time, O(h) space.`,
  },
  {
    slug: 'same-tree',
    category: 'Trees',
    solution: `**Approach:** Recursive comparison
**Key Insight:** Two trees are the same if roots have equal values and left/right subtrees are the same.
**Steps:**
1. If both null, return true. If one null, return false.
2. If values differ, return false.
3. Recursively check left subtrees and right subtrees.
**Complexity:** O(n) time, O(h) space.`,
  },
  {
    slug: 'subtree-of-another-tree',
    category: 'Trees',
    solution: `**Approach:** Recursive — check isSameTree at every node
**Key Insight:** For each node in the main tree, check if the subtree rooted there is identical to the target tree using the same-tree comparison.
**Steps:**
1. If root is null, return false.
2. If isSameTree(root, subRoot), return true.
3. Recursively check root.left and root.right.
**Complexity:** O(m * n) time worst case, O(h) space. Can optimize to O(n) with tree hashing or serialization.`,
  },
  {
    slug: 'lowest-common-ancestor-of-a-binary-search-tree',
    category: 'Trees',
    solution: `**Approach:** Exploit BST property
**Key Insight:** In a BST, if both p and q are less than current node, LCA is in the left subtree. If both are greater, LCA is in the right subtree. Otherwise, current node is the LCA (the split point).
**Steps:**
1. Start at root.
2. If p.val and q.val < node.val, go left.
3. If p.val and q.val > node.val, go right.
4. Otherwise, return current node.
**Complexity:** O(h) time, O(1) space iterative.`,
  },
  {
    slug: 'binary-tree-level-order-traversal',
    category: 'Trees',
    solution: `**Approach:** BFS with queue
**Key Insight:** Use a queue. Process all nodes at the current level before moving to the next. The number of nodes to process at each level equals the current queue size.
**Steps:**
1. If root is null, return []. Initialize queue with root.
2. While queue is non-empty: levelSize = queue.size. Process levelSize nodes, adding their children.
3. Collect each level's values into a list.
**Complexity:** O(n) time, O(n) space.`,
  },
  {
    slug: 'validate-binary-search-tree',
    category: 'Trees',
    solution: `**Approach:** Recursion with min/max bounds
**Key Insight:** Each node must be within a valid range (min, max). The left child must be < current node, and the right child must be > current node. Pass updated bounds down.
**Steps:**
1. Helper function isValid(node, min, max).
2. If null, return true.
3. If node.val <= min or node.val >= max, return false.
4. Recurse: isValid(left, min, node.val) && isValid(right, node.val, max).
5. Start with (-∞, +∞).
**Alternative:** In-order traversal should produce a strictly increasing sequence.
**Complexity:** O(n) time, O(h) space.`,
  },
  {
    slug: 'kth-smallest-element-in-a-bst',
    category: 'Trees',
    solution: `**Approach:** In-order traversal
**Key Insight:** In-order traversal of a BST visits nodes in ascending order. The k-th visited node is the answer.
**Steps:**
1. Perform in-order traversal (left, root, right).
2. Decrement k at each visit. When k reaches 0, return current node's value.
**Can use iterative in-order with a stack to stop early.
**Complexity:** O(H + k) time with iterative, O(H) space.`,
  },
  {
    slug: 'construct-binary-tree-from-preorder-and-inorder-traversal',
    category: 'Trees',
    solution: `**Approach:** Recursive construction with hash map
**Key Insight:** Preorder's first element is the root. Find that root in inorder — everything left of it is the left subtree, everything right is the right subtree. Use a hash map for O(1) lookups in inorder.
**Steps:**
1. Build a map: inorder value → index.
2. First element of preorder is the root. Find it in inorder.
3. Recursively build left subtree (elements before root in inorder) and right subtree (elements after).
4. Use a global index into preorder, incrementing as we create nodes.
**Complexity:** O(n) time, O(n) space.`,
  },
  {
    slug: 'binary-tree-maximum-path-sum',
    category: 'Trees',
    solution: `**Approach:** DFS with global max
**Key Insight:** At each node, the max "gain" we can contribute to a parent path is node.val + max(left_gain, right_gain, 0). But the max path *through* this node could be node.val + left_gain + right_gain. Track the global max separately.
**Steps:**
1. DFS returns max gain from this node going down one side.
2. At each node: left = max(0, dfs(left)), right = max(0, dfs(right)).
3. Update global max with node.val + left + right.
4. Return node.val + max(left, right).
**Complexity:** O(n) time, O(h) space.`,
  },
  {
    slug: 'serialize-and-deserialize-binary-tree',
    category: 'Trees',
    solution: `**Approach:** Preorder traversal with null markers
**Key Insight:** Serialize using preorder DFS, recording "null" for null nodes. Deserialize by reading the serialized values in order and reconstructing the tree recursively.
**Steps:**
Serialize: DFS — append node value or "null". Join with commas.
Deserialize: Split by comma. Use a global index. Read value: if "null", return null. Else create node, recursively build left then right.
**Alternative:** Use BFS/level-order with null markers.
**Complexity:** O(n) time, O(n) space.`,
  },

  // ============================================================
  // Tries
  // ============================================================
  {
    slug: 'implement-trie-prefix-tree',
    category: 'Tries',
    solution: `**Approach:** Tree of nodes, each with children map and end-of-word flag
**Key Insight:** Each node has a map/array of children (one per character) and a boolean marking if a word ends here.
**Steps:**
Insert: traverse/create nodes for each character, mark end.
Search: traverse nodes for each character, return true only if end-of-word is set.
StartsWith: same as search but don't check end-of-word.
**Complexity:** O(L) time per operation where L = word length. O(total characters) space.`,
  },
  {
    slug: 'design-add-and-search-words-data-structure',
    category: 'Tries',
    solution: `**Approach:** Trie with DFS for wildcard '.'
**Key Insight:** Build a standard trie. For search, when encountering '.', try all children via DFS/backtracking.
**Steps:**
addWord: standard trie insert.
search: for each char, if it's '.', recursively search all children. Otherwise, follow the specific child. Return true if any path matches the full word.
**Complexity:** addWord O(L), search O(26^L) worst case with all dots, but typically much better.`,
  },
  {
    slug: 'word-search-ii',
    category: 'Tries',
    solution: `**Approach:** Trie + Backtracking on the board
**Key Insight:** Build a trie from the word list. Then DFS/backtrack from each cell on the board, following trie edges. This is much faster than searching for each word independently.
**Steps:**
1. Insert all words into a trie.
2. For each cell on the board, start DFS. At each step, check if the current trie node has the character as a child.
3. If a trie node marks end-of-word, add the word to results (and remove the flag to avoid duplicates).
4. Optimization: prune trie branches that have no remaining words.
**Complexity:** O(m * n * 4^L) worst case, but trie pruning makes it much faster in practice.`,
  },

  // ============================================================
  // Heap / Priority Queue
  // ============================================================
  {
    slug: 'find-median-from-data-stream',
    category: 'Heap',
    solution: `**Approach:** Two heaps — max-heap for lower half, min-heap for upper half
**Key Insight:** Maintain a max-heap (left half) and min-heap (right half). The median is either the top of the max-heap (odd count) or the average of both tops (even count). Balance the heaps so their sizes differ by at most 1.
**Steps:**
addNum: add to max-heap. Move max-heap top to min-heap. If min-heap is larger, move its top back.
findMedian: if sizes equal, average both tops. Else, return max-heap top.
**Complexity:** O(log n) per add, O(1) per findMedian.`,
  },

  // ============================================================
  // Backtracking
  // ============================================================
  {
    slug: 'combination-sum',
    category: 'Backtracking',
    solution: `**Approach:** Backtracking with reuse
**Key Insight:** At each step, try adding each candidate (starting from the current index to avoid duplicate combinations). The same number can be used unlimited times. Backtrack when the remaining target goes below 0.
**Steps:**
1. Sort candidates (optional, helps with pruning).
2. DFS(start_index, remaining_target, current_combination).
3. If remaining == 0, add combination to results.
4. For i from start_index to end: if candidates[i] <= remaining, recurse with updated remaining.
**Complexity:** Exponential in worst case, depends on target and candidates.`,
  },
  {
    slug: 'word-search',
    category: 'Backtracking',
    solution: `**Approach:** DFS/Backtracking on the grid
**Key Insight:** From each cell, try to match the word character by character using DFS in 4 directions. Mark cells as visited during the current path to avoid reuse.
**Steps:**
1. For each cell matching word[0], start DFS.
2. DFS(i, j, word_index): if index == word.length, return true.
3. Check bounds, if cell matches word[index], mark visited, recurse in 4 directions, unmark.
4. Return true if any direction succeeds.
**Complexity:** O(m * n * 4^L) where L = word length.`,
  },

  // ============================================================
  // Graphs
  // ============================================================
  {
    slug: 'number-of-islands',
    category: 'Graphs',
    solution: `**Approach:** DFS/BFS flood fill
**Key Insight:** Iterate through the grid. When we find a '1', increment the island count and flood-fill (mark all connected '1's as visited using DFS or BFS).
**Steps:**
1. For each cell (i, j): if grid[i][j] == '1', increment count.
2. DFS/BFS from (i, j), marking all connected '1's as '0' (or visited).
3. Return count.
**Complexity:** O(m * n) time, O(m * n) space worst case for DFS stack.`,
  },
  {
    slug: 'clone-graph',
    category: 'Graphs',
    solution: `**Approach:** BFS or DFS with hash map
**Key Insight:** Use a hash map: original node → cloned node. For each node, create its clone and recursively/iteratively clone its neighbors.
**Steps:**
1. If node is null, return null. Create clone of node, add to map.
2. BFS/DFS: for each neighbor, if not in map, clone it and add to map. Add cloned neighbor to current clone's neighbor list.
3. Return the clone of the starting node.
**Complexity:** O(V + E) time, O(V) space.`,
  },
  {
    slug: 'pacific-atlantic-water-flow',
    category: 'Graphs',
    solution: `**Approach:** Reverse BFS/DFS from ocean borders
**Key Insight:** Instead of flowing water downhill from each cell, reverse the problem: start from ocean borders and flow uphill (to cells with height ≥ current). Find cells reachable from both oceans.
**Steps:**
1. BFS/DFS from all Pacific border cells (top row + left column) — mark reachable cells.
2. BFS/DFS from all Atlantic border cells (bottom row + right column) — mark reachable cells.
3. Return cells in both sets.
**Complexity:** O(m * n) time, O(m * n) space.`,
  },
  {
    slug: 'course-schedule',
    category: 'Graphs',
    solution: `**Approach:** Topological Sort (BFS/Kahn's) or DFS cycle detection
**Key Insight:** The courses form a directed graph. If there's a cycle, it's impossible to finish all courses. Use topological sort — if all nodes are processed, no cycle exists.
**Steps (Kahn's BFS):**
1. Build adjacency list and in-degree array.
2. Add all nodes with in-degree 0 to queue.
3. Process queue: for each node, reduce in-degree of neighbors. If in-degree becomes 0, add to queue.
4. If processed count == numCourses, return true.
**Complexity:** O(V + E) time, O(V + E) space.`,
  },
  {
    slug: 'course-schedule-ii',
    category: 'Graphs',
    solution: `**Approach:** Topological Sort (Kahn's BFS)
**Key Insight:** Same as Course Schedule I, but collect the processing order. If a valid ordering exists (no cycle), return it.
**Steps:**
1. Build adjacency list and in-degree array.
2. Queue all nodes with in-degree 0.
3. Process queue: append node to result, reduce neighbors' in-degrees.
4. If result length == numCourses, return result. Else return [] (cycle exists).
**Complexity:** O(V + E) time, O(V + E) space.`,
  },

  // ============================================================
  // 1-D Dynamic Programming
  // ============================================================
  {
    slug: 'climbing-stairs',
    category: '1-D DP',
    solution: `**Approach:** DP (Fibonacci-like)
**Key Insight:** To reach step n, you can come from step n-1 (1 step) or n-2 (2 steps). So dp[n] = dp[n-1] + dp[n-2]. This is the Fibonacci sequence.
**Steps:**
1. dp[1] = 1, dp[2] = 2.
2. For i from 3 to n: dp[i] = dp[i-1] + dp[i-2].
3. Return dp[n].
**Space optimization:** Only keep the last two values.
**Complexity:** O(n) time, O(1) space.`,
  },
  {
    slug: 'house-robber',
    category: '1-D DP',
    solution: `**Approach:** DP — rob or skip
**Key Insight:** At each house, choose to rob it (add its value to the loot from two houses back) or skip it (keep the loot from the previous house). dp[i] = max(dp[i-1], dp[i-2] + nums[i]).
**Steps:**
1. dp[0] = nums[0], dp[1] = max(nums[0], nums[1]).
2. For i from 2 to n-1: dp[i] = max(dp[i-1], dp[i-2] + nums[i]).
3. Return dp[n-1].
**Space optimization:** Use two variables (prev1, prev2).
**Complexity:** O(n) time, O(1) space.`,
  },
  {
    slug: 'house-robber-ii',
    category: '1-D DP',
    solution: `**Approach:** Two passes of House Robber I
**Key Insight:** Houses are in a circle, so house 0 and house n-1 are adjacent. Run House Robber I on nums[0..n-2] and nums[1..n-1], take the max.
**Steps:**
1. If only 1 house, return nums[0].
2. Run house_robber(nums[0..n-2]) and house_robber(nums[1..n-1]).
3. Return max of both results.
**Complexity:** O(n) time, O(1) space.`,
  },
  {
    slug: 'longest-palindromic-substring',
    category: '1-D DP',
    solution: `**Approach:** Expand around center
**Key Insight:** A palindrome can be expanded from its center. For each position, try expanding from that center (both odd-length and even-length palindromes). Track the longest found.
**Steps:**
1. For each index i, expand around center (i, i) for odd length and (i, i+1) for even length.
2. Expand while s[left] == s[right]. Track the max length and starting index.
3. Return the substring.
**Complexity:** O(n²) time, O(1) space. (Manacher's algorithm can do O(n) but is rarely expected.)`,
  },
  {
    slug: 'palindromic-substrings',
    category: '1-D DP',
    solution: `**Approach:** Expand around center
**Key Insight:** Same technique as Longest Palindromic Substring. For each center, expand and count each valid expansion as a palindrome.
**Steps:**
1. For each index i, expand from (i, i) and (i, i+1).
2. While s[left] == s[right], increment count, expand further.
3. Return total count.
**Complexity:** O(n²) time, O(1) space.`,
  },
  {
    slug: 'decode-ways',
    category: '1-D DP',
    solution: `**Approach:** DP
**Key Insight:** At each position, we can decode one digit (if non-zero) or two digits (if they form 10-26). dp[i] = dp[i-1] (if s[i] != '0') + dp[i-2] (if s[i-1..i] is 10-26).
**Steps:**
1. dp[0] = 1 (empty prefix), dp[1] = 1 if s[0] != '0'.
2. For i from 2 to n: dp[i] = 0. If s[i-1] != '0', dp[i] += dp[i-1]. If 10 <= s[i-2..i-1] <= 26, dp[i] += dp[i-2].
3. Return dp[n].
**Complexity:** O(n) time, O(1) space with optimization.`,
  },
  {
    slug: 'coin-change',
    category: '1-D DP',
    solution: `**Approach:** Bottom-up DP
**Key Insight:** dp[amount] = minimum coins to make that amount. For each amount, try every coin: dp[a] = min(dp[a], dp[a - coin] + 1).
**Steps:**
1. dp = array of size amount+1, initialized to infinity. dp[0] = 0.
2. For a from 1 to amount: for each coin, if a >= coin, dp[a] = min(dp[a], dp[a-coin] + 1).
3. Return dp[amount] if it's not infinity, else -1.
**Complexity:** O(amount * numCoins) time, O(amount) space.`,
  },
  {
    slug: 'maximum-product-subarray',
    category: '1-D DP',
    solution: `**Approach:** Track both max and min products
**Key Insight:** A negative number can turn the minimum product into the maximum. So track both the running max and running min product ending at each position.
**Steps:**
1. maxProd = minProd = result = nums[0].
2. For each num from index 1: if num < 0, swap maxProd and minProd.
3. maxProd = max(num, maxProd * num). minProd = min(num, minProd * num).
4. result = max(result, maxProd).
**Complexity:** O(n) time, O(1) space.`,
  },
  {
    slug: 'word-break',
    category: '1-D DP',
    solution: `**Approach:** DP with word dictionary
**Key Insight:** dp[i] = true if s[0..i-1] can be segmented into dictionary words. Check all possible last words: dp[i] = any(dp[j] and s[j..i] in wordDict) for j < i.
**Steps:**
1. Put wordDict in a set. dp = boolean array of size n+1. dp[0] = true.
2. For i from 1 to n: for j from 0 to i-1: if dp[j] and s[j..i] is in the set, dp[i] = true, break.
3. Return dp[n].
**Optimization:** Only check j where i-j <= max word length.
**Complexity:** O(n² * k) time where k = max word length, O(n) space.`,
  },
  {
    slug: 'longest-increasing-subsequence',
    category: '1-D DP',
    solution: `**Approach:** DP with binary search (Patience Sorting)
**Simple DP:** dp[i] = length of LIS ending at index i. For each j < i, if nums[j] < nums[i], dp[i] = max(dp[i], dp[j]+1). O(n²).
**Optimal approach — binary search on tails array:**
1. Maintain an array "tails" where tails[i] = smallest tail element of all increasing subsequences of length i+1.
2. For each num: binary search for the position in tails where num should go. If num > all tails, append. Else, replace the first tail >= num.
3. Answer = length of tails.
**Complexity:** O(n log n) time, O(n) space.`,
  },

  // ============================================================
  // 2-D Dynamic Programming
  // ============================================================
  {
    slug: 'unique-paths',
    category: '2-D DP',
    solution: `**Approach:** DP grid
**Key Insight:** dp[i][j] = number of ways to reach (i, j). You can only come from above or from the left: dp[i][j] = dp[i-1][j] + dp[i][j-1].
**Steps:**
1. Initialize first row and first column to 1 (only one way to reach them).
2. Fill the rest: dp[i][j] = dp[i-1][j] + dp[i][j-1].
3. Return dp[m-1][n-1].
**Space optimization:** Use a 1D array.
**Math approach:** Result is C(m+n-2, m-1) — a combinatorics formula.
**Complexity:** O(m*n) time, O(n) space.`,
  },
  {
    slug: 'longest-common-subsequence',
    category: '2-D DP',
    solution: `**Approach:** 2D DP table
**Key Insight:** dp[i][j] = LCS length of text1[0..i-1] and text2[0..j-1]. If characters match, dp[i][j] = dp[i-1][j-1] + 1. Otherwise, dp[i][j] = max(dp[i-1][j], dp[i][j-1]).
**Steps:**
1. Create (m+1) × (n+1) table initialized to 0.
2. For each i, j: if text1[i-1] == text2[j-1], dp[i][j] = dp[i-1][j-1] + 1. Else dp[i][j] = max(dp[i-1][j], dp[i][j-1]).
3. Return dp[m][n].
**Complexity:** O(m*n) time, O(m*n) space (can optimize to O(min(m,n))).`,
  },

  // ============================================================
  // Greedy
  // ============================================================
  {
    slug: 'maximum-subarray',
    category: 'Greedy',
    solution: `**Approach:** Kadane's Algorithm
**Key Insight:** At each position, decide whether to extend the current subarray or start a new one. If the running sum is negative, starting fresh is better.
**Steps:**
1. currentSum = maxSum = nums[0].
2. For each num from index 1: currentSum = max(num, currentSum + num).
3. maxSum = max(maxSum, currentSum).
4. Return maxSum.
**Complexity:** O(n) time, O(1) space.`,
  },
  {
    slug: 'jump-game',
    category: 'Greedy',
    solution: `**Approach:** Greedy — track max reachable index
**Key Insight:** Maintain the farthest index you can reach. Iterate through the array; if current index exceeds max reachable, return false. Otherwise update max reachable.
**Steps:**
1. maxReach = 0.
2. For i from 0 to n-1: if i > maxReach, return false. maxReach = max(maxReach, i + nums[i]).
3. Return true.
**Complexity:** O(n) time, O(1) space.`,
  },

  // ============================================================
  // Intervals
  // ============================================================
  {
    slug: 'insert-interval',
    category: 'Intervals',
    solution: `**Approach:** Linear scan — add before, merge overlapping, add after
**Key Insight:** Split intervals into three groups: those entirely before the new interval, those overlapping (merge them), and those entirely after.
**Steps:**
1. Add all intervals that end before newInterval starts.
2. Merge all overlapping intervals: update newInterval's start = min, end = max.
3. Add the merged interval.
4. Add all remaining intervals.
**Complexity:** O(n) time, O(n) space for output.`,
  },
  {
    slug: 'merge-intervals',
    category: 'Intervals',
    solution: `**Approach:** Sort by start, then merge
**Key Insight:** Sort intervals by start time. Iterate and merge if the current interval overlaps with the last one in the result (i.e., current.start <= last.end).
**Steps:**
1. Sort by start time.
2. Initialize result with first interval.
3. For each interval: if it overlaps with result's last (start <= last.end), merge by updating end = max(ends). Else, add as new.
**Complexity:** O(n log n) time, O(n) space.`,
  },
  {
    slug: 'non-overlapping-intervals',
    category: 'Intervals',
    solution: `**Approach:** Greedy — sort by end time
**Key Insight:** Sort by end time. Greedily keep intervals that don't overlap (classic activity selection). The number of removals = total - number of non-overlapping intervals kept.
**Steps:**
1. Sort intervals by end time.
2. Track the end of the last kept interval.
3. For each interval: if its start >= last end, keep it (update last end). Else, skip it (increment removal count).
**Complexity:** O(n log n) time, O(1) space.`,
  },

  // ============================================================
  // Math & Geometry
  // ============================================================
  {
    slug: 'rotate-image',
    category: 'Math & Geometry',
    solution: `**Approach:** Transpose then reverse each row
**Key Insight:** A 90° clockwise rotation = transpose the matrix (swap rows and columns) + reverse each row.
**Steps:**
1. Transpose: swap matrix[i][j] with matrix[j][i] for j > i.
2. Reverse each row.
**Alternative:** Rotate layer by layer, swapping 4 cells at a time.
**Complexity:** O(n²) time, O(1) space (in-place).`,
  },
  {
    slug: 'spiral-matrix',
    category: 'Math & Geometry',
    solution: `**Approach:** Boundary simulation
**Key Insight:** Maintain four boundaries (top, bottom, left, right). Traverse right along top row, down along right column, left along bottom row, up along left column. Shrink boundaries after each pass.
**Steps:**
1. top=0, bottom=m-1, left=0, right=n-1.
2. While top <= bottom and left <= right:
   - Traverse right: left to right on row top. top++.
   - Traverse down: top to bottom on column right. right--.
   - Traverse left: right to left on row bottom (if top <= bottom). bottom--.
   - Traverse up: bottom to top on column left (if left <= right). left++.
**Complexity:** O(m*n) time, O(1) extra space.`,
  },
  {
    slug: 'set-matrix-zeroes',
    category: 'Math & Geometry',
    solution: `**Approach:** Use first row/column as markers
**Key Insight:** Instead of extra space, use the first row and first column to mark which rows/columns should be zeroed. Track separately whether the first row/column themselves should be zeroed.
**Steps:**
1. Check if first row or first column has any zero (save in flags).
2. For each cell (i,j) where i>0, j>0: if matrix[i][j] == 0, set matrix[i][0] = 0 and matrix[0][j] = 0.
3. Use the markers to zero out cells.
4. Handle first row and first column using the saved flags.
**Complexity:** O(m*n) time, O(1) space.`,
  },

  // ============================================================
  // Bit Manipulation
  // ============================================================
  {
    slug: 'number-of-1-bits',
    category: 'Bit Manipulation',
    solution: `**Approach:** Brian Kernighan's trick: n & (n-1) removes the lowest set bit
**Key Insight:** n & (n-1) flips the lowest set bit to 0. Count how many times we can do this until n becomes 0.
**Steps:**
1. count = 0. While n != 0: n = n & (n-1), count++.
2. Return count.
**Alternative:** Check each bit with n & 1, then right shift.
**Complexity:** O(number of set bits) time, O(1) space.`,
  },
  {
    slug: 'counting-bits',
    category: 'Bit Manipulation',
    solution: `**Approach:** DP using dp[i] = dp[i >> 1] + (i & 1)
**Key Insight:** The number of 1-bits in i equals the number in i/2 (right shift) plus the last bit. Or use dp[i] = dp[i & (i-1)] + 1.
**Steps:**
1. dp = array of size n+1. dp[0] = 0.
2. For i from 1 to n: dp[i] = dp[i >> 1] + (i & 1).
3. Return dp.
**Complexity:** O(n) time, O(n) space.`,
  },
  {
    slug: 'reverse-bits',
    category: 'Bit Manipulation',
    solution: `**Approach:** Bit-by-bit reversal
**Key Insight:** Extract the last bit of n, shift it into the result from the left. Repeat 32 times.
**Steps:**
1. result = 0. For 32 iterations:
2. result = (result << 1) | (n & 1). n = n >> 1.
3. Return result.
**Complexity:** O(1) time (always 32 iterations), O(1) space.`,
  },
  {
    slug: 'missing-number',
    category: 'Bit Manipulation',
    solution: `**Approach:** XOR or Math (sum formula)
**XOR:** XOR all numbers 0..n and XOR all elements in the array. The result is the missing number (all pairs cancel out).
**Math:** Expected sum = n*(n+1)/2. Missing = expected - actual sum.
**Steps (XOR):**
1. result = n (start with n since indices are 0..n-1).
2. For i from 0 to n-1: result ^= i ^ nums[i].
3. Return result.
**Complexity:** O(n) time, O(1) space.`,
  },
  {
    slug: 'sum-of-two-integers',
    category: 'Bit Manipulation',
    solution: `**Approach:** Bit manipulation — XOR for sum, AND+shift for carry
**Key Insight:** a XOR b gives the sum without carries. (a AND b) << 1 gives the carries. Repeat until carry is 0.
**Steps:**
1. While b != 0:
2. carry = (a & b) << 1.
3. a = a ^ b.
4. b = carry.
5. Return a.
**Note:** In languages with fixed-width integers, handle overflow/negative numbers carefully.
**Complexity:** O(1) time (max 32 iterations), O(1) space.`,
  },

  // ============================================================
  // Extra Classics
  // ============================================================
  {
    slug: 'trapping-rain-water',
    category: 'Two Pointers',
    solution: `**Approach:** Two Pointers
**Key Insight:** Water at position i = min(max_left, max_right) - height[i]. Use two pointers from both ends, tracking the max heights seen from each side. Process the side with the smaller max.
**Steps:**
1. left = 0, right = n-1. leftMax = 0, rightMax = 0. water = 0.
2. While left < right:
3. If height[left] < height[right]: leftMax = max(leftMax, height[left]). water += leftMax - height[left]. left++.
4. Else: rightMax = max(rightMax, height[right]). water += rightMax - height[right]. right--.
**Complexity:** O(n) time, O(1) space.`,
  },
  {
    slug: 'median-of-two-sorted-arrays',
    category: 'Binary Search',
    solution: `**Approach:** Binary search on the smaller array
**Key Insight:** We need to partition both arrays such that all left elements ≤ all right elements. Binary search on the smaller array's partition point. For a valid partition: maxLeft1 ≤ minRight2 and maxLeft2 ≤ minRight1.
**Steps:**
1. Ensure nums1 is the smaller array. Binary search on partition of nums1.
2. For each partition i in nums1, partition j in nums2 is (m+n+1)/2 - i.
3. Check if maxLeft1 <= minRight2 and maxLeft2 <= minRight1.
4. If valid: median = average of max(lefts) and min(rights) for even total, or max(lefts) for odd.
**Complexity:** O(log(min(m,n))) time, O(1) space.`,
  },
  {
    slug: 'lru-cache',
    category: 'Design',
    solution: `**Approach:** Hash Map + Doubly Linked List
**Key Insight:** Use a hash map for O(1) lookups and a doubly linked list for O(1) insert/remove to maintain access order. Most recently used goes to the front; evict from the back.
**Steps:**
get: if key in map, move node to front, return value. Else return -1.
put: if key exists, update value, move to front. If new key and at capacity, remove tail node and its map entry. Insert new node at front, add to map.
**Use dummy head and tail nodes to simplify edge cases.
**Complexity:** O(1) for both get and put.`,
  },
  {
    slug: 'daily-temperatures',
    category: 'Stack',
    solution: `**Approach:** Monotonic decreasing stack
**Key Insight:** Use a stack that stores indices of temperatures in decreasing order. When a warmer temperature is found, pop all cooler indices and compute the wait days.
**Steps:**
1. Initialize result array of zeros. Stack = [].
2. For each index i: while stack is non-empty and temps[i] > temps[stack.top()]:
3. Pop idx from stack. result[idx] = i - idx.
4. Push i onto stack.
**Complexity:** O(n) time, O(n) space.`,
  },
  {
    slug: 'task-scheduler',
    category: 'Greedy',
    solution: `**Approach:** Math / Greedy — count the most frequent task
**Key Insight:** The most frequent task determines the minimum time. Arrange in frames of size (n+1). Total = (maxFreq - 1) * (n + 1) + count_of_tasks_with_maxFreq. Answer = max(this value, total tasks).
**Steps:**
1. Count task frequencies. Find maxFreq and how many tasks have maxFreq.
2. result = (maxFreq - 1) * (n + 1) + numMaxFreqTasks.
3. Return max(result, total number of tasks).
**Complexity:** O(n) time, O(1) space (26 letters).`,
  },
];

export default problems;
