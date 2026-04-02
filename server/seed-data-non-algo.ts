import type { SeedProblem } from './seed-data.js';

// These use the same shape but content/solution are written manually (not from LeetCode)
export interface NonAlgoProblem {
  slug: string;
  title: string;
  leetcode_id: number; // use negative IDs for non-leetcode
  difficulty: string;
  category: string;
  lists: string[];
  topics: string[];
  content: string;
  solution: string;
}

const problems: NonAlgoProblem[] = [
  // ============================================================
  // BEHAVIORAL
  // ============================================================
  {
    slug: 'behavioral-tell-me-about-yourself',
    title: 'Tell Me About Yourself',
    leetcode_id: -1,
    difficulty: 'Easy',
    category: 'Behavioral',
    lists: ['Behavioral'],
    topics: ['Introduction', 'Self-Presentation'],
    content: `<p>This is the most common opening question in any interview.</p>
<p><strong>The Question:</strong> "Tell me about yourself."</p>
<p><strong>What the interviewer is looking for:</strong></p>
<ul>
<li>A concise, well-structured summary of your professional background</li>
<li>Relevance to the role you're interviewing for</li>
<li>Your ability to communicate clearly and confidently</li>
<li>A narrative arc: where you've been → where you are → where you're going</li>
</ul>
<p><strong>Guidelines:</strong></p>
<ul>
<li>Keep it under 2 minutes</li>
<li>Focus on professional experience, not personal life</li>
<li>Tailor your answer to the specific role</li>
<li>End with why you're excited about this opportunity</li>
</ul>`,
    solution: `**Framework:** Present → Past → Future
**Key Elements:**
1. **Present:** Start with your current role and a key accomplishment. "I'm currently a senior engineer at X, where I lead the Y team..."
2. **Past:** Briefly mention 1-2 relevant experiences that build credibility. "Before that, I worked on Z at Company A, where I..."
3. **Future:** Connect to the role. "I'm excited about this role because..."

**What makes it strong:**
- Specific accomplishments, not generic descriptions
- Tailored to the role's requirements
- Shows progression and intentionality
- Under 90 seconds

**Common mistakes:**
- Reciting your entire resume chronologically
- Starting from college or childhood
- Being too vague ("I'm a hard worker")
- Not connecting your story to the role`,
  },
  {
    slug: 'behavioral-biggest-challenge',
    title: 'Tell Me About Your Biggest Challenge',
    leetcode_id: -2,
    difficulty: 'Medium',
    category: 'Behavioral',
    lists: ['Behavioral'],
    topics: ['Problem Solving', 'Resilience'],
    content: `<p><strong>The Question:</strong> "Tell me about the biggest technical challenge you've faced and how you overcame it."</p>
<p><strong>What the interviewer is looking for:</strong></p>
<ul>
<li>Your problem-solving process under pressure</li>
<li>Technical depth — can you explain complex problems clearly?</li>
<li>Collaboration and resourcefulness</li>
<li>Self-awareness about what you learned</li>
</ul>
<p><strong>Use the STAR method:</strong></p>
<ul>
<li><strong>Situation:</strong> Set the context</li>
<li><strong>Task:</strong> What was your responsibility?</li>
<li><strong>Action:</strong> What specific steps did YOU take?</li>
<li><strong>Result:</strong> What was the outcome? Quantify if possible.</li>
</ul>`,
    solution: `**Framework:** STAR with emphasis on Action
**Key Elements:**
1. **Pick a real, significant challenge** — not a trivial bug. Production outages, scaling problems, impossible deadlines, or cross-team conflicts work well.
2. **Be specific about YOUR actions** — not what the team did. Use "I" not "we." Explain your debugging process, the options you considered, and WHY you chose your approach.
3. **Show technical depth** — mention specific technologies, trade-offs, and constraints.
4. **Quantify the result** — "reduced latency by 40%", "saved $200k/year", "unblocked 3 teams."
5. **Reflect on what you learned** — shows growth mindset.

**What makes it strong:**
- The challenge was genuinely hard (not self-inflicted)
- Clear decision-making under constraints
- Collaboration without losing ownership
- Measurable impact

**Common mistakes:**
- Blaming others for the challenge
- Being vague about your specific contributions
- Choosing a challenge that's too simple
- Forgetting the result/learning`,
  },
  {
    slug: 'behavioral-conflict-with-teammate',
    title: 'Conflict with a Teammate',
    leetcode_id: -3,
    difficulty: 'Medium',
    category: 'Behavioral',
    lists: ['Behavioral'],
    topics: ['Teamwork', 'Conflict Resolution'],
    content: `<p><strong>The Question:</strong> "Tell me about a time you had a disagreement or conflict with a teammate. How did you handle it?"</p>
<p><strong>What the interviewer is looking for:</strong></p>
<ul>
<li>Emotional intelligence and maturity</li>
<li>Ability to disagree constructively</li>
<li>Focus on the problem, not the person</li>
<li>Willingness to compromise or find common ground</li>
<li>Professional growth from the experience</li>
</ul>`,
    solution: `**Framework:** STAR with emphasis on resolution
**Key Elements:**
1. **Describe the disagreement objectively** — show both sides fairly. "I wanted to use approach A because of X. My colleague preferred B because of Y. Both had valid points."
2. **Focus on professional disagreement** — technical approach, architecture, priorities. Never personal conflicts.
3. **Show your process:** Listened first, understood their perspective, proposed a compromise or data-driven resolution.
4. **Resolution:** How you reached agreement. Did you prototype both? Run benchmarks? Bring in a third opinion? Compromise?
5. **Outcome:** The decision worked (or what you learned if it didn't).

**What makes it strong:**
- Shows respect for the other person's view
- Uses data/evidence to resolve, not authority
- Demonstrates active listening
- Results in a better outcome than either original proposal

**Common mistakes:**
- Making the other person look bad
- Saying "I was right and they came around"
- Choosing a trivial disagreement
- Not showing what you learned about collaboration`,
  },
  {
    slug: 'behavioral-leadership-example',
    title: 'Leadership and Influence',
    leetcode_id: -4,
    difficulty: 'Medium',
    category: 'Behavioral',
    lists: ['Behavioral'],
    topics: ['Leadership', 'Influence'],
    content: `<p><strong>The Question:</strong> "Tell me about a time you led a project or influenced a decision without direct authority."</p>
<p><strong>What the interviewer is looking for:</strong></p>
<ul>
<li>Leadership beyond title/authority</li>
<li>Ability to influence through data, persuasion, and building consensus</li>
<li>Initiative — did you step up when needed?</li>
<li>Outcome and impact of your leadership</li>
</ul>`,
    solution: `**Framework:** STAR with emphasis on HOW you influenced
**Key Elements:**
1. **Context:** Why was leadership needed? Was there a gap, crisis, or opportunity no one was owning?
2. **Your initiative:** What made you step up? Show proactiveness.
3. **How you influenced:**
   - Built alignment by talking to stakeholders 1:1
   - Created a proposal/doc/prototype to make the abstract concrete
   - Used data to make the case
   - Identified and addressed concerns from skeptics
4. **Scale of impact:** How many people/teams were affected?
5. **Result:** What changed because of your leadership?

**What makes it strong:**
- Leadership through influence, not authority
- Specific tactics (wrote an RFC, presented data, ran a pilot)
- Shows both technical and people skills
- Measurable outcome

**Common mistakes:**
- Only talking about leading by delegating tasks
- Not explaining why others followed your lead
- Choosing an example where you had formal authority`,
  },
  {
    slug: 'behavioral-failure-and-learning',
    title: 'Tell Me About a Failure',
    leetcode_id: -5,
    difficulty: 'Hard',
    category: 'Behavioral',
    lists: ['Behavioral'],
    topics: ['Self-Awareness', 'Growth Mindset'],
    content: `<p><strong>The Question:</strong> "Tell me about a time you failed. What happened and what did you learn?"</p>
<p><strong>What the interviewer is looking for:</strong></p>
<ul>
<li>Genuine self-awareness and honesty</li>
<li>Accountability — do you own the failure or blame others?</li>
<li>What you learned and how you changed your behavior</li>
<li>Resilience — how you bounced back</li>
</ul>
<p><strong>Warning:</strong> This question is a trap if you pick a fake failure ("I work too hard") or blame external factors. The best answers show a real mistake with a real lesson.</p>`,
    solution: `**Framework:** STAR with emphasis on learning and change
**Key Elements:**
1. **Pick a real failure** — a bad technical decision, a missed deadline, a miscommunication that caused problems. Not a humble-brag.
2. **Own it completely** — "I made the decision to X, and it was wrong because Y." No blaming circumstances.
3. **Explain what went wrong and why** — show you understand the root cause, not just the symptom.
4. **What you learned** — be specific: "I now always do X before making decisions like this."
5. **How you've applied that lesson since** — prove the learning stuck.

**What makes it strong:**
- Genuine vulnerability without being unprofessional
- Clear cause-and-effect analysis
- Concrete behavioral change as a result
- Appropriate scope (significant but not catastrophic)

**Common mistakes:**
- Fake failures ("I'm too much of a perfectionist")
- Blaming the team, timeline, or management
- A failure so catastrophic it raises red flags
- Not showing what changed afterward`,
  },
  {
    slug: 'behavioral-why-this-company',
    title: 'Why This Company?',
    leetcode_id: -6,
    difficulty: 'Easy',
    category: 'Behavioral',
    lists: ['Behavioral'],
    topics: ['Motivation', 'Research'],
    content: `<p><strong>The Question:</strong> "Why do you want to work here?" / "Why this company?"</p>
<p><strong>What the interviewer is looking for:</strong></p>
<ul>
<li>Have you done your research?</li>
<li>Genuine interest vs just needing a job</li>
<li>Alignment between your goals and the company's mission/work</li>
<li>Understanding of what makes this company unique</li>
</ul>`,
    solution: `**Framework:** Company → Role → You
**Key Elements:**
1. **Company-specific reasons** — mention specific products, technical challenges, culture, or mission. NOT generic things ("great company, good benefits").
2. **Role alignment** — why this specific role matches your skills and growth goals.
3. **Personal connection** — have you used their product? Admire a specific technical decision? Read a blog post from their engineering team?

**What makes it strong:**
- Shows genuine research (mention specific projects, blog posts, products)
- Connects your skills to their problems
- Shows enthusiasm without being sycophantic
- Forward-looking: what you want to contribute, not just consume

**Common mistakes:**
- Generic answers that could apply to any company
- Only mentioning compensation/perks
- Not knowing what the company actually does
- Being dishonest about your motivation`,
  },
  {
    slug: 'behavioral-project-you-are-proud-of',
    title: 'Project You Are Most Proud Of',
    leetcode_id: -7,
    difficulty: 'Medium',
    category: 'Behavioral',
    lists: ['Behavioral'],
    topics: ['Achievement', 'Impact'],
    content: `<p><strong>The Question:</strong> "Tell me about a project you're most proud of."</p>
<p><strong>What the interviewer is looking for:</strong></p>
<ul>
<li>What you value in engineering work</li>
<li>Your ability to drive impact</li>
<li>Technical depth and ownership</li>
<li>How you communicate about complex work</li>
</ul>`,
    solution: `**Framework:** Context → Challenge → Your Contribution → Impact
**Key Elements:**
1. **Pick a project with clear impact** — user-facing feature, performance improvement, system redesign, or developer tool that changed how the team works.
2. **Explain why it was hard** — not just "I built X." What constraints existed? What made it interesting?
3. **Your specific contribution** — even if it was a team project, what was YOUR unique impact?
4. **Quantify results** — users served, latency reduced, developer hours saved, revenue impact.
5. **Why you're proud** — technical elegance? Impact? Overcoming obstacles? Growth?

**What makes it strong:**
- Genuine passion shows through
- Technical depth balanced with business impact
- Clear ownership of your part
- Shows your engineering values (quality, users, simplicity, etc.)`,
  },
  {
    slug: 'behavioral-tight-deadline',
    title: 'Working Under a Tight Deadline',
    leetcode_id: -8,
    difficulty: 'Medium',
    category: 'Behavioral',
    lists: ['Behavioral'],
    topics: ['Time Management', 'Prioritization'],
    content: `<p><strong>The Question:</strong> "Tell me about a time you had to deliver under a very tight deadline."</p>
<p><strong>What the interviewer is looking for:</strong></p>
<ul>
<li>How you prioritize when time is limited</li>
<li>Communication with stakeholders about trade-offs</li>
<li>Quality vs speed decision-making</li>
<li>Staying calm under pressure</li>
</ul>`,
    solution: `**Framework:** STAR with emphasis on prioritization decisions
**Key Elements:**
1. **Set stakes clearly** — why was the deadline important? Launch commitment, client obligation, competitive pressure?
2. **Show your prioritization process** — how did you decide what to cut, simplify, or defer? "I identified the 3 must-have features and negotiated deferring 2 nice-to-haves."
3. **Communication** — how did you keep stakeholders informed about trade-offs?
4. **What you delivered** — did you hit the deadline? What quality trade-offs were made?
5. **Follow-up** — did you go back and address tech debt / deferred items?

**What makes it strong:**
- Shows strategic thinking, not just "I worked overtime"
- Explicit trade-off communication with stakeholders
- Maintains quality standards even under pressure
- Shows follow-through on deferred work`,
  },

  // ============================================================
  // OOD (Object-Oriented Design)
  // ============================================================
  {
    slug: 'ood-parking-lot',
    title: 'Design a Parking Lot',
    leetcode_id: -101,
    difficulty: 'Medium',
    category: 'OOD',
    lists: ['OOD'],
    topics: ['OOD', 'Class Design'],
    content: `<p><strong>Design an object-oriented system for a parking lot.</strong></p>
<p><strong>Requirements:</strong></p>
<ul>
<li>The parking lot has multiple levels, each level has multiple rows of spots</li>
<li>The parking lot can park motorcycles, cars, and buses</li>
<li>A motorcycle can park in any spot (small, compact, or large)</li>
<li>A car can park in a compact or large spot</li>
<li>A bus can park in five consecutive large spots</li>
<li>The system should handle parking and unparking vehicles</li>
<li>The system should be able to tell if spots are available</li>
</ul>
<p><strong>Design the classes, their relationships, and key methods.</strong></p>`,
    solution: `**Core Classes:**
1. **ParkingLot** — top-level class, contains levels. Methods: parkVehicle(), unparkVehicle(), getAvailableSpots().
2. **Level** — contains rows of ParkingSpots. Methods: park(), findAvailableSpots().
3. **ParkingSpot** — has a size (Small, Compact, Large) and optional reference to parked Vehicle. Methods: canFitVehicle(), park(), removeVehicle().
4. **Vehicle** (abstract) — base class with licensePlate, size. Subclasses: Motorcycle, Car, Bus.
5. **VehicleSize** (enum) — Small, Compact, Large.

**Key Design Decisions:**
- Vehicle is abstract — polymorphism lets each type define its own parking rules
- ParkingSpot knows its size, Vehicle knows its required size — matching logic in ParkingSpot.canFitVehicle()
- Bus needs 5 consecutive large spots — Level.findConsecutiveSpots(count, size)
- Use composition: ParkingLot HAS levels, Level HAS spots

**Patterns Used:** Strategy pattern for spot selection, Factory for vehicle creation.

**Key Methods:**
- ParkingLot.parkVehicle(vehicle): iterate levels, try to park. Return ticket/spot info.
- Level.park(vehicle): find available spot(s) that fit, assign vehicle.
- ParkingSpot.canFitVehicle(vehicle): check size compatibility.`,
  },
  {
    slug: 'ood-elevator-system',
    title: 'Design an Elevator System',
    leetcode_id: -102,
    difficulty: 'Hard',
    category: 'OOD',
    lists: ['OOD'],
    topics: ['OOD', 'State Machine', 'Scheduling'],
    content: `<p><strong>Design an object-oriented system for an elevator system in a building.</strong></p>
<p><strong>Requirements:</strong></p>
<ul>
<li>The building has N floors and M elevators</li>
<li>Users can request an elevator from any floor (up or down)</li>
<li>Users inside an elevator can select destination floors</li>
<li>The system should efficiently dispatch elevators to minimize wait time</li>
<li>Handle edge cases: doors opening/closing, capacity limits, maintenance mode</li>
</ul>
<p><strong>Design the classes, their state machines, and the scheduling algorithm.</strong></p>`,
    solution: `**Core Classes:**
1. **ElevatorSystem** — manages all elevators, handles dispatch. Methods: requestElevator(floor, direction), dispatch().
2. **Elevator** — represents one elevator. State: currentFloor, direction (UP/DOWN/IDLE), doorState (OPEN/CLOSED), destinationQueue. Methods: addDestination(), move(), openDoor(), closeDoor().
3. **Request** — represents a user request: floor, direction, timestamp.
4. **Direction** (enum) — UP, DOWN, IDLE.
5. **ElevatorState** (enum) — MOVING, STOPPED, MAINTENANCE.
6. **Button** — FloorButton (external, has direction) and ElevatorButton (internal, has floor number).

**Key Design Decisions:**
- **Scheduling algorithm (SCAN/LOOK):** Each elevator services requests in its current direction, then reverses. Like disk scheduling.
- **Dispatch strategy:** Assign the closest elevator going in the same direction. If none, assign the closest idle elevator.
- **State machine for each elevator:** IDLE → MOVING_UP → STOPPED → MOVING_UP/DOWN → IDLE
- **Destination queue:** Use a sorted set — one for up destinations, one for down.

**Patterns:** State pattern for elevator states, Observer for floor buttons notifying the system, Strategy for dispatch algorithms.

**Concurrency:** Multiple elevators operate independently. The dispatch controller needs thread-safe request queue.`,
  },
  {
    slug: 'ood-library-management',
    title: 'Design a Library Management System',
    leetcode_id: -103,
    difficulty: 'Medium',
    category: 'OOD',
    lists: ['OOD'],
    topics: ['OOD', 'CRUD', 'Relationships'],
    content: `<p><strong>Design an object-oriented system for a library management system.</strong></p>
<p><strong>Requirements:</strong></p>
<ul>
<li>The library has books, each with multiple copies</li>
<li>Members can search, borrow, and return books</li>
<li>A member can borrow up to 5 books at a time</li>
<li>Books can be reserved if all copies are checked out</li>
<li>Overdue books incur fines</li>
<li>Librarians can add/remove books and manage members</li>
</ul>
<p><strong>Design the classes, their relationships, and key methods.</strong></p>`,
    solution: `**Core Classes:**
1. **Library** — singleton, manages books and members. Methods: searchBook(), registerMember().
2. **Book** — title, author, ISBN, subject. Has multiple BookItems (copies).
3. **BookItem** (extends Book) — specific copy with barcode, status (Available, CheckedOut, Reserved, Lost). Methods: checkout(), returnBook(), reserve().
4. **Member** — name, id, borrowedBooks[], reservations[]. Methods: borrow(), return(), reserve(). Enforce 5-book limit.
5. **Librarian** (extends Member) — additional methods: addBook(), removeBook(), manageMembers().
6. **Loan** — links Member to BookItem with checkoutDate, dueDate, returnDate. Methods: isOverdue(), calculateFine().
7. **Reservation** — links Member to Book with reservationDate, status.
8. **Fine** — amount, member, loan, paid status.

**Key Design Decisions:**
- Book vs BookItem: Book is the title/metadata, BookItem is a physical copy — one-to-many
- Member has a borrow limit — enforce in borrow() method
- Reservation triggers notification when a copy becomes available — Observer pattern
- Fine calculation strategy can vary — Strategy pattern

**Search:** Catalog class with search by title, author, subject, ISBN. Can use indexing for performance.`,
  },
  {
    slug: 'ood-deck-of-cards',
    title: 'Design a Deck of Cards',
    leetcode_id: -104,
    difficulty: 'Easy',
    category: 'OOD',
    lists: ['OOD'],
    topics: ['OOD', 'Inheritance', 'Generics'],
    content: `<p><strong>Design an object-oriented system for a generic deck of cards that can be used for different card games.</strong></p>
<p><strong>Requirements:</strong></p>
<ul>
<li>Support a standard 52-card deck</li>
<li>The design should be extensible for different card games (Blackjack, Poker, etc.)</li>
<li>Support operations: shuffle, draw, reset</li>
<li>Implement a simple Blackjack game using your card system</li>
</ul>`,
    solution: `**Core Classes:**
1. **Card** — suit (enum: Hearts, Diamonds, Clubs, Spades), rank (enum: Ace through King). Can be abstract if different games assign different values.
2. **Deck** — list of Cards. Methods: shuffle(), draw(), reset(), isEmpty(). Uses Collections.shuffle() or Fisher-Yates.
3. **Hand** — list of Cards held by a player. Methods: addCard(), getCards(), score() (game-specific).
4. **Suit** (enum) — Hearts, Diamonds, Clubs, Spades.
5. **Rank** (enum) — Ace, Two, ..., King. Can have a value field.

**For Blackjack specifically:**
6. **BlackjackCard** (extends Card) — value() returns 1-11 for Ace, 10 for face cards, face value otherwise.
7. **BlackjackHand** (extends Hand) — score() sums card values, handles Ace as 1 or 11.
8. **BlackjackGame** — manages dealer and players, handles hit/stand/bust logic.

**Key Design Decisions:**
- Card is a value object (immutable) — suit and rank set in constructor, no setters
- Deck uses composition (HAS cards), not inheritance
- Game-specific logic in subclasses, not base classes
- Generics possible: Deck<T extends Card> for maximum flexibility

**Patterns:** Template Method for game flow, Factory for creating decks.`,
  },
  {
    slug: 'ood-chess-game',
    title: 'Design a Chess Game',
    leetcode_id: -105,
    difficulty: 'Hard',
    category: 'OOD',
    lists: ['OOD'],
    topics: ['OOD', 'Polymorphism', 'State'],
    content: `<p><strong>Design an object-oriented system for a chess game.</strong></p>
<p><strong>Requirements:</strong></p>
<ul>
<li>Standard 8x8 chess board with all standard pieces</li>
<li>Two players take turns</li>
<li>Validate legal moves for each piece type</li>
<li>Detect check, checkmate, and stalemate</li>
<li>Support special moves: castling, en passant, pawn promotion</li>
</ul>`,
    solution: `**Core Classes:**
1. **Game** — manages the game state. Fields: board, players[2], currentTurn, status (Active/Check/Checkmate/Stalemate/Resigned). Methods: makeMove(), isOver().
2. **Board** — 8x8 grid of Cells. Methods: getCell(), movePiece(), isPathClear().
3. **Cell** — row, col, piece (nullable). Methods: isOccupied(), getPiece().
4. **Piece** (abstract) — color (White/Black), position. Abstract method: getValidMoves(board). Subclasses: King, Queen, Rook, Bishop, Knight, Pawn.
5. **Player** — color, name. Methods: makeMove().
6. **Move** — fromCell, toCell, pieceMoved, pieceCaptured, isSpecial (castling/en passant/promotion).

**Key Design for each Piece:**
- **Pawn:** Forward 1 (or 2 from start), diagonal capture, en passant, promotion. Most complex piece.
- **Knight:** L-shaped, can jump over pieces. Simplest validation.
- **King:** 1 square any direction + castling. Must check if move puts self in check.
- **Queen/Rook/Bishop:** Line-based movement. Check path is clear.

**Key Design Decisions:**
- Each Piece subclass implements getValidMoves() — polymorphism
- Board validates that a move doesn't leave own king in check
- Move history stored for undo and en passant detection
- Game uses State pattern for status transitions

**Check/Checkmate detection:** After each move, check if opponent's king is attacked. If attacked and no legal moves exist → checkmate. If not attacked and no legal moves → stalemate.`,
  },
  {
    slug: 'ood-lru-cache',
    title: 'Design an LRU Cache (OOD)',
    leetcode_id: -106,
    difficulty: 'Medium',
    category: 'OOD',
    lists: ['OOD'],
    topics: ['OOD', 'Data Structure Design'],
    content: `<p><strong>Design an object-oriented LRU (Least Recently Used) Cache.</strong></p>
<p><strong>Requirements:</strong></p>
<ul>
<li>Fixed capacity, evicts least recently used item when full</li>
<li>O(1) time for both get and put operations</li>
<li>Generic — works with any key/value types</li>
<li>Thread-safe (bonus)</li>
</ul>
<p><strong>Focus on the class design, data structures used, and why each design choice is made.</strong></p>`,
    solution: `**Core Classes:**
1. **LRUCache<K, V>** — main class. Fields: capacity, hashMap<K, Node<K,V>>, doublyLinkedList. Methods: get(key), put(key, value).
2. **DoublyLinkedList<K, V>** — maintains access order. Fields: head (dummy), tail (dummy). Methods: addToFront(), remove(), moveToFront(), removeLast().
3. **Node<K, V>** — key, value, prev, next. Stores key so we can remove from map during eviction.

**Why this design:**
- **HashMap** gives O(1) lookup by key
- **Doubly Linked List** gives O(1) insert/remove (with node reference from map)
- **Dummy head/tail** simplify edge cases (no null checks)
- **Node stores key** because when evicting from the tail, we need to also remove from the map

**Key Methods:**
- get(key): if in map, move node to front, return value. Else return null.
- put(key, value): if exists, update value, move to front. If new: if at capacity, remove tail's prev (LRU), remove from map. Create new node, add to front, add to map.

**Thread-safety:** Wrap get/put in synchronized or use ReadWriteLock (readers don't block each other, writers are exclusive).

**Patterns:** This IS a data structure design. The key insight is combining two data structures (hash map + linked list) to get O(1) for everything.`,
  },
  {
    slug: 'ood-file-system',
    title: 'Design an In-Memory File System',
    leetcode_id: -107,
    difficulty: 'Hard',
    category: 'OOD',
    lists: ['OOD'],
    topics: ['OOD', 'Composite Pattern', 'Tree'],
    content: `<p><strong>Design an object-oriented in-memory file system.</strong></p>
<p><strong>Requirements:</strong></p>
<ul>
<li>Support files and directories</li>
<li>Directories can contain files and other directories</li>
<li>Operations: create file, create directory, delete, move, list contents, read/write file content</li>
<li>Support path-based navigation (e.g., /root/dir1/file.txt)</li>
<li>Search for files by name</li>
</ul>`,
    solution: `**Core Classes:**
1. **FileSystemEntry** (abstract) — name, createdAt, parent (Directory). Abstract methods: getSize(), getPath(). This is the Component in the Composite pattern.
2. **File** (extends FileSystemEntry) — content (String or byte[]), size. Methods: read(), write(), append().
3. **Directory** (extends FileSystemEntry) — children map<String, FileSystemEntry>. Methods: addEntry(), removeEntry(), listContents(), getChild(), getSize() (recursive sum).
4. **FileSystem** — root Directory, current Directory. Methods: mkdir(), touch(), rm(), mv(), ls(), cd(), find(), cat().

**Key Design Decisions:**
- **Composite Pattern:** Directory and File share the same interface (FileSystemEntry). Directory contains FileSystemEntries — can be Files or other Directories. Recursive operations (getSize, delete) work naturally.
- **Path resolution:** Split path by '/', traverse from root or current directory. Handle '..' for parent navigation.
- **children as Map<String, Entry>** — O(1) lookup by name within a directory.
- **Parent reference** — enables getPath() by walking up to root, and cd('..').

**Patterns:** Composite (core pattern), Iterator for directory traversal, Visitor for search/size calculation.`,
  },

  // ============================================================
  // SYSTEM DESIGN
  // ============================================================
  {
    slug: 'sysdesign-url-shortener',
    title: 'Design a URL Shortener (TinyURL)',
    leetcode_id: -201,
    difficulty: 'Medium',
    category: 'System Design',
    lists: ['System Design'],
    topics: ['System Design', 'Hashing', 'Database'],
    content: `<p><strong>Design a URL shortening service like TinyURL or bit.ly.</strong></p>
<p><strong>Requirements:</strong></p>
<ul>
<li>Given a long URL, generate a short URL</li>
<li>Given a short URL, redirect to the original long URL</li>
<li>Short URLs should be as short as possible</li>
<li>High availability — the service should always work</li>
<li>Low latency redirects (&lt;100ms)</li>
<li>Handle 100M new URLs per month, 10:1 read:write ratio</li>
</ul>
<p><strong>Discuss: API design, database schema, URL generation strategy, caching, and scaling.</strong></p>`,
    solution: `**API:**
- POST /shorten { longUrl } → { shortUrl }
- GET /{shortCode} → 301 redirect to longUrl

**URL Generation (key decision):**
- Option 1: Base62 encoding of auto-increment ID (a-z, A-Z, 0-9). 7 chars = 62^7 = 3.5 trillion URLs. Simple, guaranteed unique.
- Option 2: MD5/SHA hash of URL, take first 7 chars. Possible collisions — need check-and-retry.
- Option 3: Pre-generated key service (KGS) — generate random keys offline, hand them out. No collision checking at write time.
- **Best:** KGS or Base62 of distributed ID (Snowflake).

**Database:**
- Table: urls (id, shortCode, longUrl, createdAt, expiresAt, userId)
- NoSQL (DynamoDB) or SQL. Key lookup by shortCode — fits KV store well.

**Caching:**
- Cache hot URLs in Redis/Memcached. 20% of URLs get 80% of traffic.
- Cache on read: check cache → if miss, query DB → populate cache. TTL-based eviction.

**Scaling:**
- Read-heavy (10:1) → multiple read replicas or cache-first architecture.
- Stateless app servers behind load balancer.
- Database sharding by first character of shortCode or consistent hashing.
- CDN for global low-latency redirects.

**Capacity estimate:** 100M/month = ~40 writes/sec. 1B reads/month = ~400 reads/sec. Very manageable.`,
  },
  {
    slug: 'sysdesign-twitter',
    title: 'Design Twitter / Social Feed',
    leetcode_id: -202,
    difficulty: 'Hard',
    category: 'System Design',
    lists: ['System Design'],
    topics: ['System Design', 'Fan-out', 'Feed'],
    content: `<p><strong>Design a social media feed system like Twitter.</strong></p>
<p><strong>Requirements:</strong></p>
<ul>
<li>Users can post tweets (text, up to 280 chars)</li>
<li>Users can follow/unfollow other users</li>
<li>Users see a home timeline (feed) of tweets from people they follow</li>
<li>The feed should be ordered by time (newest first)</li>
<li>Support 300M monthly active users</li>
<li>A user can have millions of followers (celebrities)</li>
</ul>
<p><strong>Discuss: feed generation strategy, fan-out approaches, caching, and scaling for celebrity users.</strong></p>`,
    solution: `**Core Components:**
1. **Tweet Service** — stores tweets. Writes are straightforward: insert into tweets table.
2. **Follow Service** — manages follow graph. Table: follows(follower_id, followee_id).
3. **Feed Service** — generates the home timeline. This is the hardest part.

**Feed Generation (key decision):**
- **Fan-out on write (push model):** When user posts, push tweet ID to all followers' feed caches (Redis lists). Fast reads (pre-computed), but expensive for celebrities (1M+ followers = 1M+ writes per tweet).
- **Fan-out on read (pull model):** When user loads feed, query all followees' tweets and merge. No write amplification, but slow reads for users following many people.
- **Hybrid (Twitter's actual approach):** Fan-out on write for normal users. Fan-out on read for celebrities (>10K followers). Merge at read time.

**Data Storage:**
- Tweets: SQL or NoSQL, sharded by userId.
- Social graph: adjacency list in Redis or dedicated graph store.
- Feed cache: Redis sorted sets (tweet_id scored by timestamp) per user. Keep last 800 tweets.

**Scaling:**
- Tweets table: sharded by user_id. Heavy reads → read replicas.
- Feed generation: async workers process fan-out. Use message queue (Kafka) to decouple.
- Celebrity fan-out: don't fan out. At read time, fetch celebrity tweets separately and merge with pre-computed feed.
- CDN for media (images/videos).

**Capacity:** 300M MAU, 500M tweets/day ≈ 6000 tweets/sec. Fan-out: avg 200 followers × 6000 = 1.2M feed inserts/sec → need distributed cache cluster.`,
  },
  {
    slug: 'sysdesign-chat-system',
    title: 'Design a Chat System (WhatsApp/Messenger)',
    leetcode_id: -203,
    difficulty: 'Hard',
    category: 'System Design',
    lists: ['System Design'],
    topics: ['System Design', 'WebSocket', 'Messaging'],
    content: `<p><strong>Design a real-time chat system like WhatsApp or Facebook Messenger.</strong></p>
<p><strong>Requirements:</strong></p>
<ul>
<li>One-on-one messaging</li>
<li>Group chat (up to 500 members)</li>
<li>Online/offline status indicators</li>
<li>Message delivery receipts (sent, delivered, read)</li>
<li>Support 50M daily active users</li>
<li>Messages should be persisted</li>
</ul>
<p><strong>Discuss: real-time delivery, message storage, group messaging, offline handling, and scaling.</strong></p>`,
    solution: `**Real-time Communication:**
- **WebSocket connections** for real-time bidirectional communication. Each user maintains a persistent connection to a chat server.
- **Connection gateway** maps userId → which chat server holds their WebSocket.
- When user A sends to user B: A's chat server looks up B's server via gateway, forwards message.
- **If B is offline:** Store message in DB, deliver when B reconnects (push notification for mobile).

**Core Components:**
1. **Chat Service** — handles message routing between connected users.
2. **Message Storage** — persist all messages. Key-value store (HBase/Cassandra) with partition key = conversation_id, sort key = timestamp. Efficient range queries for chat history.
3. **Presence Service** — tracks online/offline status. Heartbeat-based with Redis. User sends heartbeat every 30s.
4. **Notification Service** — push notifications for offline users (APNs/FCM).
5. **Group Service** — manages group membership. For group messages: look up all members, fan out to each member's chat server.

**Message Flow:**
1. User A sends message via WebSocket.
2. Chat server generates message_id (Snowflake), persists to DB.
3. Looks up recipient's chat server(s).
4. Forwards to recipient's server → delivers via WebSocket.
5. Recipient ACKs → update delivery status.

**Key Design Decisions:**
- **Message ordering:** Use server-side timestamps + sequence numbers per conversation.
- **Group chat fan-out:** For small groups (<500), fan out to each member. For large groups, use pub/sub.
- **End-to-end encryption:** Messages encrypted on sender's device, decrypted on recipient's. Server stores ciphertext only.

**Scaling:** 50M DAU × 40 msgs/day = 2B msgs/day ≈ 25K msgs/sec. Shard message storage by conversation_id. Multiple chat server instances behind load balancer (sticky sessions for WebSocket).`,
  },
  {
    slug: 'sysdesign-rate-limiter',
    title: 'Design a Rate Limiter',
    leetcode_id: -204,
    difficulty: 'Medium',
    category: 'System Design',
    lists: ['System Design'],
    topics: ['System Design', 'Algorithms', 'Middleware'],
    content: `<p><strong>Design a rate limiting system for an API.</strong></p>
<p><strong>Requirements:</strong></p>
<ul>
<li>Limit requests per user/IP to N requests per time window</li>
<li>Support different rate limits for different API endpoints</li>
<li>Distributed — works across multiple API servers</li>
<li>Low latency — should not add significant overhead</li>
<li>Configurable rules (e.g., 100 requests/minute for /api/posts, 1000/minute for /api/reads)</li>
</ul>
<p><strong>Discuss: algorithms, storage, distributed coordination, and client communication.</strong></p>`,
    solution: `**Algorithms (key decision):**
1. **Fixed Window Counter:** Count requests in fixed time windows (e.g., 0:00-1:00, 1:00-2:00). Simple but allows burst at window boundaries (2x rate).
2. **Sliding Window Log:** Store timestamp of each request. Count requests in [now - window, now]. Accurate but memory-intensive.
3. **Sliding Window Counter:** Hybrid — weighted count between current and previous window. Good balance of accuracy and memory.
4. **Token Bucket:** Bucket holds N tokens, refills at rate R/sec. Each request takes a token. Allows controlled bursts. **Most commonly used.**
5. **Leaky Bucket:** Requests enter a queue, processed at fixed rate. Smooths traffic but can add latency.

**Best choice: Token Bucket** — simple, allows bursts, easy to implement in Redis.

**Implementation with Redis:**
- Key: rate_limit:{user_id}:{endpoint}
- Use Redis MULTI/EXEC for atomic check-and-decrement
- Token bucket in Redis: store (tokens_remaining, last_refill_timestamp). On each request: refill tokens based on elapsed time, then decrement.

**Architecture:**
- Rate limiter as middleware (before API handler)
- Centralized Redis cluster for distributed counting
- Rules stored in config service (hot-reloadable)
- Return 429 Too Many Requests with Retry-After header

**Scaling:**
- Redis cluster for high throughput
- Local in-memory cache of rules (refresh periodically)
- Race conditions: use Redis Lua scripts for atomic operations
- Multiple rate limit tiers: per-user, per-IP, per-endpoint, global`,
  },
  {
    slug: 'sysdesign-notification-system',
    title: 'Design a Notification System',
    leetcode_id: -205,
    difficulty: 'Medium',
    category: 'System Design',
    lists: ['System Design'],
    topics: ['System Design', 'Message Queue', 'Push'],
    content: `<p><strong>Design a scalable notification system that supports multiple channels.</strong></p>
<p><strong>Requirements:</strong></p>
<ul>
<li>Support push notifications (iOS/Android), SMS, and email</li>
<li>Handle 10M notifications per day</li>
<li>Users can set notification preferences (opt-in/out per channel)</li>
<li>Rate limiting — don't spam users</li>
<li>Template-based notifications</li>
<li>Retry on failure</li>
<li>Analytics: delivery rate, open rate</li>
</ul>
<p><strong>Discuss: architecture, message queue design, third-party integrations, and reliability.</strong></p>`,
    solution: `**Architecture (event-driven):**
1. **Notification Service (API)** — receives notification requests from other services. Validates, checks preferences, and enqueues.
2. **Message Queues** — separate queues per channel (push_queue, sms_queue, email_queue). Decouples sending from receiving. Use Kafka or SQS.
3. **Workers** — consume from queues, render templates, call third-party providers. Separate worker pools per channel for independent scaling.
4. **Third-party providers:** APNs/FCM for push, Twilio for SMS, SendGrid/SES for email.
5. **User Preferences Service** — stores opt-in/out settings per user per channel.
6. **Template Service** — manages notification templates with variable substitution.
7. **Analytics Service** — tracks delivery, opens, clicks. Consume delivery events from providers.

**Flow:**
1. Service calls POST /notify { userId, type, data }
2. Notification Service checks user preferences, applies rate limiting.
3. Renders template with data. Enqueues to appropriate channel queue(s).
4. Workers dequeue, call third-party API.
5. On failure: retry with exponential backoff (max 3 retries). Dead letter queue for permanently failed.
6. Log delivery event for analytics.

**Key Design Decisions:**
- **Separate queues per channel** — different throughput/latency characteristics. Email is slow, push is fast.
- **Idempotency** — dedup by notification_id to prevent double sends.
- **Rate limiting** — max N notifications per user per hour. Prevent notification fatigue.
- **Priority levels** — critical (password reset) vs marketing. Different queues/SLAs.

**Scaling:** 10M/day ≈ 115/sec. Not extreme, but bursty (marketing campaigns). Auto-scale workers based on queue depth.`,
  },
  {
    slug: 'sysdesign-key-value-store',
    title: 'Design a Distributed Key-Value Store',
    leetcode_id: -206,
    difficulty: 'Hard',
    category: 'System Design',
    lists: ['System Design'],
    topics: ['System Design', 'Distributed Systems', 'Consistency'],
    content: `<p><strong>Design a distributed key-value store like DynamoDB or Redis Cluster.</strong></p>
<p><strong>Requirements:</strong></p>
<ul>
<li>Put(key, value) and Get(key) operations</li>
<li>Highly available — no single point of failure</li>
<li>Scalable — handle petabytes of data</li>
<li>Tunable consistency (strong vs eventual)</li>
<li>Automatic data partitioning and replication</li>
<li>Failure detection and recovery</li>
</ul>
<p><strong>Discuss: partitioning, replication, consistency, failure handling, and the CAP theorem trade-offs.</strong></p>`,
    solution: `**Core Components:**

**1. Partitioning (Consistent Hashing):**
- Hash ring with virtual nodes. Each physical server owns multiple positions on the ring.
- Key is hashed → placed on ring → assigned to the next server clockwise.
- Virtual nodes ensure even distribution and smooth rebalancing when servers join/leave.

**2. Replication:**
- Each key is replicated to N servers (e.g., N=3) — the next N servers clockwise on the ring.
- Coordinator node handles writes: forwards to all replicas.
- Tunable consistency with W (write quorum) and R (read quorum): W + R > N for strong consistency. W=1, R=1 for eventual consistency (fast but may read stale).

**3. Consistency Model:**
- **Strong (W=N, R=1 or W=majority, R=majority):** Every read sees the latest write. Higher latency.
- **Eventual (W=1, R=1):** Writes are fast, reads may be stale. Resolve conflicts with vector clocks or last-writer-wins.
- **Vector clocks** for conflict detection: each replica maintains a version vector. On conflict, return both versions to client for resolution.

**4. Failure Handling:**
- **Gossip protocol** for membership and failure detection. Nodes periodically exchange heartbeats.
- **Hinted handoff:** If a replica is down, write to another node with a "hint." When the original recovers, replay the hinted writes.
- **Anti-entropy (Merkle trees):** Periodically compare data between replicas using hash trees to detect and repair inconsistencies.

**5. Storage Engine:**
- Each node uses an LSM tree (Log-Structured Merge Tree): write to in-memory memtable → flush to sorted SSTable on disk → periodic compaction. Optimized for write-heavy workloads.

**CAP Theorem:** This design chooses AP (Available + Partition-tolerant) with tunable consistency. During network partitions, each partition continues serving reads/writes → eventual consistency after healing.`,
  },
  {
    slug: 'sysdesign-web-crawler',
    title: 'Design a Web Crawler',
    leetcode_id: -207,
    difficulty: 'Medium',
    category: 'System Design',
    lists: ['System Design'],
    topics: ['System Design', 'Distributed', 'Queue'],
    content: `<p><strong>Design a web crawler that can crawl the entire web.</strong></p>
<p><strong>Requirements:</strong></p>
<ul>
<li>Crawl billions of web pages</li>
<li>Be polite — respect robots.txt and rate limit per domain</li>
<li>Handle duplicate URLs</li>
<li>Prioritize important/fresh pages</li>
<li>Distributed across many machines</li>
<li>Fault-tolerant — handle failures gracefully</li>
</ul>
<p><strong>Discuss: architecture, URL frontier, deduplication, politeness, and scaling.</strong></p>`,
    solution: `**Architecture:**
1. **Seed URLs** → URL Frontier (priority queue)
2. **URL Frontier** → Fetcher (HTTP download)
3. **Fetcher** → Content Parser (extract text + links)
4. **Parser** → URL Filter (dedup, robots.txt) → URL Frontier (new URLs)
5. **Parser** → Content Storage (store crawled pages)

**Key Components:**

**URL Frontier (most important):**
- Not a simple queue — needs politeness and priority.
- **Front queues (priority):** Multiple queues by priority. PageRank, freshness, domain importance determine priority.
- **Back queues (politeness):** One queue per domain. Each domain has a rate limit (e.g., 1 request/sec). Worker picks from a domain queue only when the politeness delay has passed.
- This two-level design ensures we crawl important pages first while being polite.

**Deduplication:**
- **URL dedup:** Bloom filter (probabilistic, space-efficient) or hash set. Before adding to frontier, check if URL was already seen.
- **Content dedup:** Compute fingerprint (SimHash or MinHash) of page content. Detect near-duplicate pages (same content, different URL).

**Robots.txt:**
- Cache robots.txt per domain. Check before crawling. Respect Crawl-delay directive.

**Storage:**
- URLs (seen set): distributed hash table or Bloom filter.
- Crawled content: distributed file system (HDFS) or blob storage (S3).
- Metadata: database with URL, last crawled, content hash, status.

**Scaling:**
- Multiple crawler nodes, each responsible for a set of domains (partition by domain hash).
- DNS resolver cache — DNS lookups are slow, cache aggressively.
- Async I/O for fetching — one machine can maintain thousands of concurrent connections.
- Checkpoint frontier state for fault tolerance — resume after crash.

**Capacity:** 1B pages, avg 100KB each = 100TB storage. At 1000 pages/sec = 12 days for 1B pages.`,
  },
  {
    slug: 'sysdesign-youtube',
    title: 'Design YouTube / Video Streaming',
    leetcode_id: -208,
    difficulty: 'Hard',
    category: 'System Design',
    lists: ['System Design'],
    topics: ['System Design', 'CDN', 'Encoding'],
    content: `<p><strong>Design a video sharing and streaming platform like YouTube.</strong></p>
<p><strong>Requirements:</strong></p>
<ul>
<li>Users can upload videos</li>
<li>Users can stream/watch videos with adaptive quality</li>
<li>Support 1B daily active users</li>
<li>Video search and recommendations</li>
<li>Comments, likes, view counts</li>
<li>Low latency video start time</li>
</ul>
<p><strong>Discuss: video upload pipeline, encoding, CDN distribution, and streaming protocols.</strong></p>`,
    solution: `**Two main flows: Upload and Watch.**

**Upload Flow:**
1. Client uploads raw video to upload service (chunked upload for large files, resumable).
2. Upload service stores original in blob storage (S3/GCS).
3. Triggers **transcoding pipeline** (async, via message queue):
   - Split into segments (e.g., 10-sec chunks)
   - Encode into multiple resolutions (360p, 720p, 1080p, 4K) and formats (H.264, VP9, AV1)
   - Generate thumbnails
   - This is CPU-intensive — use a transcoding worker fleet (can take minutes for long videos)
4. Store encoded segments in blob storage.
5. Update metadata DB: video is ready.

**Watch Flow:**
1. Client requests video → API returns video metadata + CDN URLs.
2. Client uses **adaptive bitrate streaming (ABR):** HLS or DASH protocol. Client downloads a manifest file listing segments at each quality level.
3. Client starts with low quality for fast start, then adapts to network speed. Switches quality per-segment seamlessly.
4. Video segments served from **CDN** (edge servers close to user). Cache hit rate >95% for popular videos.

**Core Components:**
- **API servers:** metadata, search, recommendations, comments. Stateless, behind LB.
- **Metadata DB:** video info, user info, comments. SQL (MySQL/Postgres), sharded by video_id.
- **Blob storage:** raw and encoded video files. S3/GCS.
- **CDN:** serve video segments globally. Push popular content to edge. Pull for long-tail.
- **Transcoding service:** worker fleet consuming from job queue. Auto-scale based on upload volume.
- **Search:** Elasticsearch on video titles, descriptions, tags.
- **Recommendation:** ML pipeline (not in scope but acknowledge it).

**View counts:** Use Redis for real-time counter (INCR), async flush to DB. Handle thundering herd with batched writes.

**Scaling:** 1B DAU watching avg 5 videos/day = 5B views/day ≈ 58K views/sec. CDN handles most traffic. Origin serves <5% of requests.`,
  },
];

export default problems;
