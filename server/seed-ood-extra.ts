import type { NonAlgoProblem } from './seed-data-non-algo.js';

const oodExtraProblems: NonAlgoProblem[] = [
  // ============================================================
  // OOD — ADDITIONAL PROBLEMS
  // ============================================================
  {
    slug: 'ood-hotel-reservation',
    title: 'Design a Hotel Reservation System',
    leetcode_id: -108,
    difficulty: 'Medium',
    category: 'OOD',
    lists: ['OOD'],
    topics: ['OOD', 'Booking', 'Concurrency'],
    content: `<p><strong>Design an object-oriented hotel reservation system.</strong></p>
<p><strong>Requirements:</strong></p>
<ul>
<li>The hotel has multiple room types (Standard, Deluxe, Suite) with different prices</li>
<li>Guests can search for available rooms by date range and room type</li>
<li>Guests can make, modify, and cancel reservations</li>
<li>Handle check-in and check-out</li>
<li>Apply pricing strategies (seasonal pricing, discounts, loyalty rewards)</li>
<li>Prevent double-booking of the same room</li>
<li>Support multiple hotels (hotel chain)</li>
</ul>
<p><strong>Design the classes, their relationships, and key methods.</strong></p>`,
    solution: `**Core Classes:**
1. **Hotel** — name, address, rooms[], reservations[]. Methods: searchAvailableRooms(dateRange, roomType), getRoomsByFloor().
2. **Room** — roomNumber, roomType, floor, pricePerNight, status (Available, Reserved, Occupied, Maintenance). Methods: isAvailableForDates(checkIn, checkOut), getPrice(dateRange).
3. **RoomType** (enum) — Standard, Deluxe, Suite. Each has base price and amenities list.
4. **Reservation** — reservationId, guest, room, checkIn, checkOut, status (Confirmed, CheckedIn, CheckedOut, Cancelled), totalPrice. Methods: modify(newDates), cancel(), calculateTotal().
5. **Guest** — name, email, phone, loyaltyTier, reservationHistory[]. Methods: makeReservation(), cancelReservation().
6. **Payment** — amount, paymentMethod, status, transactionId. Methods: processPayment(), refund().
7. **PricingStrategy** (interface) — calculatePrice(room, dateRange). Implementations: StandardPricing, SeasonalPricing, LoyaltyDiscountPricing.
8. **HotelChain** — hotels[], centralReservationSystem. Methods: searchAcrossHotels(), transferReservation().

**Key Design Decisions:**
- Room availability is checked against existing reservations for date overlap — Reservation stores dateRange, and Room.isAvailableForDates() queries reservation list for conflicts
- Strategy pattern for pricing — swap between seasonal, discount, and standard rates without modifying Room
- Reservation acts as the central entity linking Guest, Room, and Payment
- Double-booking prevention: synchronized check-and-reserve in a transaction; optimistic locking on room availability

**Patterns Used:** Strategy (pricing), Observer (notify guest on reservation changes), Singleton (HotelChain registry), Builder (complex reservation construction with optional add-ons).

**Key Methods:**
- Hotel.searchAvailableRooms(checkIn, checkOut, type): filter rooms where no existing reservation overlaps the date range
- Reservation.modify(newCheckIn, newCheckOut): verify new dates available, update, recalculate price
- PricingStrategy.calculatePrice(room, dateRange): apply dynamic pricing rules`,
  },
  {
    slug: 'ood-movie-ticket-booking',
    title: 'Design a Movie Ticket Booking System',
    leetcode_id: -109,
    difficulty: 'Medium',
    category: 'OOD',
    lists: ['OOD'],
    topics: ['OOD', 'Booking', 'Concurrency', 'Seat Selection'],
    content: `<p><strong>Design an object-oriented movie ticket booking system (like BookMyShow or Fandango).</strong></p>
<p><strong>Requirements:</strong></p>
<ul>
<li>Multiple cinemas, each with multiple screens/halls</li>
<li>Each screen shows movies at different showtimes</li>
<li>Users can browse movies, view showtimes, and select seats</li>
<li>Seats have different categories (Regular, Premium, VIP) with different prices</li>
<li>Users can select and temporarily hold seats during booking (seat lock with timeout)</li>
<li>Handle concurrent seat selection — two users cannot book the same seat</li>
<li>Support payment and booking confirmation</li>
</ul>
<p><strong>Design the classes, their relationships, and key methods.</strong></p>`,
    solution: `**Core Classes:**
1. **Cinema** — name, location, screens[]. Methods: getScreens(), getShowtimes(movie).
2. **Screen** — screenNumber, seats[][], totalCapacity. Methods: getAvailableSeats(showtime).
3. **Seat** — row, column, seatType (Regular, Premium, VIP), price. Immutable — represents the physical seat.
4. **Movie** — title, genre, duration, rating, releaseDate. Methods: getShowtimes(cinema).
5. **Showtime** — movie, screen, startTime, date, seatAvailability map<Seat, SeatStatus>. Methods: getAvailableSeats(), holdSeat(seat, userId), releaseSeat(seat).
6. **SeatStatus** (enum) — Available, Held, Booked.
7. **SeatHold** — seat, userId, showtime, expiresAt. Temporary lock on a seat with TTL (e.g., 10 minutes).
8. **Booking** — bookingId, user, showtime, seats[], totalPrice, status (Confirmed, Cancelled), payment. Methods: confirm(), cancel().
9. **User** — name, email, bookingHistory[]. Methods: searchMovies(), selectSeats(), makeBooking().
10. **Payment** — amount, method, status, transactionId. Methods: process(), refund().

**Key Design Decisions:**
- Showtime owns the seat availability map, not Seat itself — the same physical Seat is available or booked per showing
- Seat hold mechanism: when a user selects seats, a SeatHold is created with a TTL. A background job or lazy expiration releases unheld seats. This prevents users from holding seats indefinitely without paying
- Concurrency: synchronized or optimistic locking on the seatAvailability map. Check-and-set pattern: only transition Available → Held if still Available
- Seat[][] in Screen represents the theater layout; the UI can render this grid

**Patterns Used:** Observer (notify users when held seats are released), Strategy (pricing by seat type, day of week, matinee vs evening), State (SeatStatus transitions: Available → Held → Booked or Held → Available on timeout).

**Key Methods:**
- Showtime.holdSeat(seat, userId): atomically check seat is Available, create SeatHold with TTL, set status to Held
- Showtime.getAvailableSeats(): return seats where status == Available (also lazily expire stale holds)
- Booking.confirm(): verify all held seats still held by this user, process payment, transition seats to Booked`,
  },
  {
    slug: 'ood-atm-machine',
    title: 'Design an ATM Machine',
    leetcode_id: -110,
    difficulty: 'Medium',
    category: 'OOD',
    lists: ['OOD'],
    topics: ['OOD', 'State Machine', 'Transaction'],
    content: `<p><strong>Design an object-oriented ATM (Automated Teller Machine) system.</strong></p>
<p><strong>Requirements:</strong></p>
<ul>
<li>User authenticates with a card and PIN</li>
<li>Support operations: check balance, withdraw cash, deposit cash, transfer funds</li>
<li>ATM has a finite supply of cash in different denominations</li>
<li>Dispense optimal combination of bills (minimize number of bills)</li>
<li>Handle insufficient funds (both user account and ATM cash)</li>
<li>Print transaction receipts</li>
<li>Handle card retention after multiple failed PIN attempts</li>
</ul>
<p><strong>Design the classes, state machine, and key methods.</strong></p>`,
    solution: `**Core Classes:**
1. **ATM** — location, cashDispenser, cardReader, screen, receiptPrinter, currentSession. Methods: insertCard(), authenticateUser(), selectTransaction(), endSession().
2. **CardReader** — Methods: readCard(), ejectCard(), retainCard().
3. **CashDispenser** — cashInventory map<Denomination, count>. Methods: dispenseCash(amount), canDispense(amount), addCash(denomination, count).
4. **Denomination** (enum) — HUNDRED(100), FIFTY(50), TWENTY(20), TEN(10), FIVE(5), ONE(1).
5. **Account** — accountNumber, balance, accountType (Checking, Savings). Methods: getBalance(), debit(amount), credit(amount).
6. **Card** — cardNumber, expiryDate, linkedAccounts[]. Methods: isExpired().
7. **Transaction** (abstract) — transactionId, account, amount, timestamp, status. Subclasses: WithdrawalTransaction, DepositTransaction, TransferTransaction, BalanceInquiry.
8. **Session** — card, authenticatedUser, failedAttempts, transactions[]. Methods: authenticate(pin), isAuthenticated().
9. **ATMState** (enum/interface) — Idle, CardInserted, Authenticated, TransactionSelected, Processing, Dispensing, OutOfService. Each state defines valid transitions.

**Key Design Decisions:**
- **State Machine:** ATM transitions through well-defined states. In each state, only certain operations are valid. Use the State pattern: each ATMState implementation handles user actions and transitions to the next state.
- **Cash dispensing algorithm (Greedy):** Start with largest denomination, use as many as possible, then next smaller. If greedy fails, fall back to dynamic programming for exact change.
- **Security:** 3 failed PIN attempts → retain card, lock session. PIN is never stored in the ATM — validated against bank server.
- **Transaction is abstract:** Each subclass (Withdrawal, Deposit, Transfer) implements execute() differently. Template Method: all share pre-validation, execution, receipt generation.

**Patterns Used:** State (ATM states), Template Method (transaction flow), Strategy (cash dispensing algorithm), Chain of Responsibility (bill denomination selection).

**Key Methods:**
- CashDispenser.dispenseCash(amount): greedy algorithm over denominations. Deduct from inventory. Return map of denomination→count. Throw InsufficientCashException if impossible.
- Session.authenticate(pin): validate against bank, increment failedAttempts on failure, retain card at 3.
- WithdrawalTransaction.execute(): check balance >= amount, check ATM can dispense, debit account, dispense cash, print receipt.`,
  },
  {
    slug: 'ood-vending-machine',
    title: 'Design a Vending Machine',
    leetcode_id: -111,
    difficulty: 'Easy',
    category: 'OOD',
    lists: ['OOD'],
    topics: ['OOD', 'State Machine', 'Inventory'],
    content: `<p><strong>Design an object-oriented vending machine.</strong></p>
<p><strong>Requirements:</strong></p>
<ul>
<li>The machine sells multiple products at different prices</li>
<li>Accept coins and bills as payment</li>
<li>Dispense the correct product after sufficient payment</li>
<li>Return change using available denominations</li>
<li>Track inventory for each product</li>
<li>Handle edge cases: insufficient payment, out of stock, unable to make change</li>
</ul>
<p><strong>Design the classes, state transitions, and key methods.</strong></p>`,
    solution: `**Core Classes:**
1. **VendingMachine** — inventory, currentBalance, selectedProduct, state. Methods: insertMoney(coin), selectProduct(code), dispense(), cancelAndRefund().
2. **Product** — name, price, code (e.g., "A1"). Immutable value object.
3. **Slot** — product, quantity, position. Methods: isAvailable(), decrementQuantity().
4. **Inventory** — slots map<String, Slot>. Methods: getSlot(code), restock(code, quantity), isAvailable(code).
5. **Coin** (enum) — PENNY(0.01), NICKEL(0.05), DIME(0.10), QUARTER(0.25), DOLLAR(1.00). Each has a value.
6. **CoinInventory** — counts map<Coin, Integer>. Methods: addCoin(), makeChange(amount), canMakeChange(amount).
7. **VendingMachineState** (interface) — Methods: insertMoney(), selectProduct(), dispense(), cancel(). Implementations: IdleState, HasMoneyState, ProductSelectedState, DispensingState.

**Key Design Decisions:**
- **State Pattern is central:** In IdleState, only insertMoney() is valid. In HasMoneyState, user can selectProduct() or cancel(). In ProductSelectedState, machine checks payment and dispenses or asks for more.
- **Change-making algorithm:** Greedy from largest coin to smallest. Track the machine's own coin inventory so it can determine if change is possible before accepting a purchase.
- **Slot-based inventory:** Each slot holds one product type with a count. Product is a value object, Slot manages the count.
- **Separation of concerns:** VendingMachine delegates to state objects. State transitions are explicit.

**Patterns Used:** State (core pattern — each state defines valid operations and transitions), Strategy (change-making algorithm), Singleton (VendingMachine instance).

**Key Methods:**
- VendingMachine.insertMoney(coin): add to currentBalance, add coin to machine's coin inventory, transition state
- VendingMachine.selectProduct(code): check inventory, check balance >= price, if yes → dispense, return change; if no → display "insert more money"
- CoinInventory.makeChange(amount): greedy allocation from largest to smallest. Return list of coins or throw CannotMakeChangeException.`,
  },
  {
    slug: 'ood-online-shopping',
    title: 'Design an Online Shopping System',
    leetcode_id: -112,
    difficulty: 'Hard',
    category: 'OOD',
    lists: ['OOD'],
    topics: ['OOD', 'E-commerce', 'Relationships'],
    content: `<p><strong>Design an object-oriented online shopping system (like Amazon).</strong></p>
<p><strong>Requirements:</strong></p>
<ul>
<li>Users can browse and search for products by name, category, or price range</li>
<li>Users can add products to a shopping cart</li>
<li>Users can place orders and make payments</li>
<li>Support multiple payment methods (credit card, PayPal, etc.)</li>
<li>Order tracking with status updates (Processing, Shipped, Delivered)</li>
<li>Product reviews and ratings</li>
<li>Inventory management — prevent overselling</li>
<li>Support sellers who list their own products</li>
</ul>
<p><strong>Design the classes, their relationships, and key methods.</strong></p>`,
    solution: `**Core Classes:**
1. **User** (abstract) — userId, name, email, address[], account. Subclasses: Customer, Seller, Admin.
2. **Customer** (extends User) — cart, orderHistory[], wishlist[]. Methods: addToCart(), placeOrder(), leaveReview().
3. **Seller** (extends User) — storeName, products[]. Methods: addProduct(), updateInventory(), viewSalesReport().
4. **Product** — productId, name, description, price, category, seller, reviews[], averageRating. Methods: updatePrice(), getDetails().
5. **ProductCategory** — name, parentCategory, subCategories[]. Tree structure for hierarchical browsing.
6. **ShoppingCart** — items map<Product, CartItem>, owner. Methods: addItem(product, qty), removeItem(product), updateQuantity(), getTotal(), clear().
7. **CartItem** — product, quantity, priceAtAddition. Methods: getSubtotal().
8. **Order** — orderId, customer, items[], shippingAddress, status (Placed, Confirmed, Shipped, Delivered, Cancelled, Returned), payment, orderDate, trackingNumber. Methods: cancel(), trackStatus(), getTotal().
9. **OrderItem** — product, quantity, priceAtPurchase. Snapshot of price at time of order.
10. **Payment** (abstract) — amount, status. Subclasses: CreditCardPayment, PayPalPayment, BankTransferPayment. Methods: processPayment(), refund().
11. **Review** — reviewer, product, rating (1-5), comment, date. Methods: edit(), delete().
12. **Inventory** — product, quantity, warehouse. Methods: reserve(qty), release(qty), deduct(qty). Handles stock management.
13. **ProductCatalog** — Methods: searchByName(query), searchByCategory(category), filterByPriceRange(min, max), sortBy(criteria).

**Key Design Decisions:**
- CartItem and OrderItem snapshot the price — price changes after adding to cart or placing order should not affect existing carts/orders
- Inventory uses reserve-then-deduct pattern: when order is placed, stock is reserved; when payment succeeds, stock is deducted; if payment fails, reservation is released. Prevents overselling.
- Payment is abstract — Strategy pattern allows adding new payment methods without modifying Order
- ProductCategory is a tree (Composite pattern) for hierarchical navigation (Electronics > Phones > Smartphones)
- Catalog search uses filtering and sorting — can be backed by an index or search engine

**Patterns Used:** Strategy (payment methods), Observer (notify customer on order status change, notify seller on new order), Composite (category tree), Builder (Order construction with many optional fields), Repository (ProductCatalog).

**Key Methods:**
- Customer.placeOrder(): validate cart not empty, reserve inventory for each item, calculate total, process payment, create Order, clear cart. If payment fails, release inventory.
- Inventory.reserve(qty): atomically check quantity >= qty, decrement available, increment reserved. Thread-safe.
- ProductCatalog.searchByName(query): full-text search over product names and descriptions, return ranked results.`,
  },
  {
    slug: 'ood-social-media',
    title: 'Design a Social Media Platform',
    leetcode_id: -113,
    difficulty: 'Hard',
    category: 'OOD',
    lists: ['OOD'],
    topics: ['OOD', 'Graph', 'Relationships', 'Privacy'],
    content: `<p><strong>Design an object-oriented social media platform (like Facebook — focus on OOD, not system design).</strong></p>
<p><strong>Requirements:</strong></p>
<ul>
<li>Users can create profiles with personal information</li>
<li>Users can send and accept friend requests</li>
<li>Users can create posts (text, images, links)</li>
<li>Users can comment on and like/react to posts</li>
<li>Users can send private messages to friends</li>
<li>Privacy settings: public, friends-only, private posts</li>
<li>Notification system for friend requests, likes, comments, messages</li>
<li>Search for users by name</li>
</ul>
<p><strong>Design the classes, their relationships, and key methods.</strong></p>`,
    solution: `**Core Classes:**
1. **User** — userId, name, email, profile, friends set<User>, friendRequests[], posts[], privacySettings. Methods: sendFriendRequest(user), acceptFriendRequest(request), createPost(content), sendMessage(user, text).
2. **Profile** — bio, profilePicture, coverPhoto, workplace, education, location. Methods: update(), getPublicView().
3. **FriendRequest** — sender, receiver, status (Pending, Accepted, Rejected), timestamp. Methods: accept(), reject().
4. **Post** — postId, author, content, media[], timestamp, likes[], comments[], privacy (Public, FriendsOnly, Private). Methods: addComment(), addLike(), edit(), delete(), isVisibleTo(user).
5. **Comment** — commentId, author, post, text, timestamp, likes[]. Methods: edit(), delete(), reply().
6. **Like/Reaction** — user, targetType (Post or Comment), targetId, reactionType (Like, Love, Laugh, Sad, Angry), timestamp.
7. **Message** — sender, receiver, text, timestamp, readStatus. Methods: markAsRead().
8. **Conversation** — participants[], messages[]. Methods: sendMessage(), getMessages(), getUnreadCount().
9. **Notification** — recipient, type (FriendRequest, Like, Comment, Message), sourceUser, targetEntity, timestamp, isRead. Methods: markAsRead().
10. **PrivacySettings** — defaultPostPrivacy, profileVisibility, searchable. Methods: canView(user, content).
11. **NotificationService** — Methods: notify(user, notification), getUnread(user). Uses Observer pattern.

**Key Design Decisions:**
- **Friendship is bidirectional:** When A befriends B, both appear in each other's friends set. FriendRequest manages the handshake.
- **Post visibility:** Post.isVisibleTo(user) checks privacy level — Public (anyone), FriendsOnly (check friends set), Private (author only). Privacy is a first-class concern in every data access.
- **Reaction is polymorphic on target:** A Like/Reaction can be on a Post or Comment. Use targetType + targetId for flexibility (or separate PostReaction/CommentReaction classes for type safety).
- **Notification via Observer:** When a post is liked, the post's author is notified. When a comment is added, the post author and previous commenters are notified. NotificationService observes these events.
- **Conversation groups messages:** Rather than standalone messages, a Conversation between two users holds the full chat thread.

**Patterns Used:** Observer (notifications), Strategy (privacy checking), Composite (comment replies forming a tree), Factory (creating different notification types).

**Key Methods:**
- User.sendFriendRequest(target): create FriendRequest(this, target, Pending), add to target's pending requests, notify target.
- Post.isVisibleTo(viewer): if privacy == Public, return true; if FriendsOnly, return author.friends.contains(viewer); if Private, return viewer == author.
- NotificationService.notify(user, notification): create Notification, push to user's notification queue, trigger real-time push if online.`,
  },
  {
    slug: 'ood-restaurant-management',
    title: 'Design a Restaurant Management System',
    leetcode_id: -114,
    difficulty: 'Medium',
    category: 'OOD',
    lists: ['OOD'],
    topics: ['OOD', 'Workflow', 'State Machine'],
    content: `<p><strong>Design an object-oriented restaurant management system.</strong></p>
<p><strong>Requirements:</strong></p>
<ul>
<li>Manage tables with different seating capacities</li>
<li>Handle reservations and walk-in customers</li>
<li>Manage a menu with categories (appetizers, mains, desserts, drinks)</li>
<li>Take orders, send to kitchen, track order status</li>
<li>Generate bills with itemized charges, tax, and tip</li>
<li>Handle table assignment and turnover</li>
<li>Support different staff roles: host, waiter, chef, manager</li>
</ul>
<p><strong>Design the classes, their relationships, and key methods.</strong></p>`,
    solution: `**Core Classes:**
1. **Restaurant** — name, tables[], menu, staff[], reservations[]. Methods: getAvailableTables(partySize, time), makeReservation().
2. **Table** — tableNumber, capacity, status (Available, Occupied, Reserved, Cleaning), currentOrder. Methods: assignParty(), release(), isAvailableFor(partySize).
3. **Reservation** — guest, table, dateTime, partySize, status (Confirmed, Seated, Cancelled, NoShow). Methods: confirm(), cancel(), seat().
4. **Menu** — categories map<String, MenuItem[]>. Methods: getItemsByCategory(), search(), addItem(), removeItem().
5. **MenuItem** — name, description, price, category, isAvailable. Methods: updatePrice(), setAvailability().
6. **Order** — orderId, table, items[], waiter, status (Placed, InPreparation, Ready, Served, Completed), timestamp. Methods: addItem(menuItem, qty), removeItem(), getTotal(), sendToKitchen().
7. **OrderItem** — menuItem, quantity, specialInstructions, status (Pending, Preparing, Ready, Served). Methods: updateStatus().
8. **Bill** — order, subtotal, tax, tip, totalAmount, paymentStatus. Methods: calculateTotal(), splitBill(ways), addTip(amount), processPayment().
9. **Staff** (abstract) — name, role. Subclasses: Host, Waiter, Chef, Manager.
10. **Host** (extends Staff) — Methods: seatGuest(table), manageWaitlist().
11. **Waiter** (extends Staff) — assignedTables[]. Methods: takeOrder(), submitOrder(), serveDish().
12. **Chef** (extends Staff) — station. Methods: receiveOrder(), prepareItem(), markReady().
13. **KitchenDisplay** — pendingOrders queue. Methods: addOrder(), getNextOrder(), markItemReady(). Acts as the interface between waiters and chefs.

**Key Design Decisions:**
- **Order lifecycle is a state machine:** Placed → InPreparation → Ready → Served → Completed. Each OrderItem has its own status since dishes finish at different times.
- **Table assignment considers capacity:** Host finds the smallest available table that fits the party size to maximize seating efficiency.
- **KitchenDisplay decouples front-of-house from kitchen:** Waiter submits order to the display queue, Chef pulls from it. Observer pattern notifies waiter when items are ready.
- **Bill supports splitting:** splitBill(n) divides evenly, or splitByItems() lets each guest pay for their own items.

**Patterns Used:** State (order and table status), Observer (kitchen notifies waiter when dish is ready), Command (order items as commands sent to kitchen), Strategy (bill splitting strategies).

**Key Methods:**
- Host.seatGuest(partySize): find smallest available table with capacity >= partySize, mark table as Occupied, create Order for table.
- Order.sendToKitchen(): validate items, set status to Placed, add to KitchenDisplay queue, notify chefs.
- Bill.calculateTotal(): sum of item prices * quantities + tax rate + tip.`,
  },
  {
    slug: 'ood-snake-game',
    title: 'Design a Snake Game',
    leetcode_id: -115,
    difficulty: 'Medium',
    category: 'OOD',
    lists: ['OOD'],
    topics: ['OOD', 'Game Design', 'Queue', 'State'],
    content: `<p><strong>Design an object-oriented Snake game (the classic mobile game).</strong></p>
<p><strong>Requirements:</strong></p>
<ul>
<li>The game is played on a rectangular grid</li>
<li>The snake starts with length 1 and grows each time it eats food</li>
<li>Food appears at random positions on the grid</li>
<li>The snake moves continuously in the current direction</li>
<li>The player can change direction (Up, Down, Left, Right)</li>
<li>Game ends if the snake hits a wall or its own body</li>
<li>Track and display the score</li>
<li>Support increasing speed as the snake grows</li>
</ul>
<p><strong>Design the classes, game loop, and key methods.</strong></p>`,
    solution: `**Core Classes:**
1. **SnakeGame** — board, snake, food, score, status (Playing, GameOver), speed. Methods: start(), update(), changeDirection(direction), isGameOver(), getScore().
2. **Board** — width, height. Methods: isWithinBounds(position), getRandomEmptyPosition(snake).
3. **Snake** — body (Deque<Position>), direction, isAlive. Methods: move(), grow(), getHead(), getBody(), containsPosition(pos), changeDirection(dir).
4. **Position** — row, col. Value object. Methods: equals(), adjacentIn(direction). Returns a new Position in the given direction.
5. **Direction** (enum) — UP, DOWN, LEFT, RIGHT. Each has deltaRow, deltaCol. Methods: isOpposite(other) — prevents 180-degree turns.
6. **Food** — position. Methods: spawn(board, snake) — pick random empty cell.
7. **GameLoop** — timer, tickRate. Methods: tick() — called on each game cycle, drives snake movement.

**Key Design Decisions:**
- **Snake body as Deque<Position>:** Head is front, tail is back. On move: add new head position to front, remove tail from back. On eat (grow): add new head but do NOT remove tail. This gives O(1) move operations.
- **Collision detection per tick:** After computing next head position, check: (1) isWithinBounds? (2) does snake body contain that position? If either fails, game over.
- **Direction validation:** Ignore direction changes that are opposite to current direction (pressing Left while moving Right should do nothing). Direction.isOpposite() prevents instant self-collision.
- **Food respawn:** After food is eaten, generate a new random position that is not occupied by the snake. Board.getRandomEmptyPosition() handles this.
- **Speed scaling:** As score increases, decrease tick interval (increase speed). speed = baseSpeed - (score * speedIncrement), clamped to a minimum.

**Patterns Used:** Game Loop (fixed-timestep update cycle), State (Playing vs GameOver), Observer (UI observes game state changes for rendering).

**Key Methods:**
- Snake.move(): nextPos = head.adjacentIn(direction). If board has food at nextPos, grow (don't remove tail), increment score, spawn new food. Otherwise, add nextPos to front, remove tail. Check collisions before adding.
- SnakeGame.update(): called each tick. snake.move(). Check wall collision (bounds) and self collision (body contains head). Update score and speed.
- Direction.isOpposite(other): UP<->DOWN, LEFT<->RIGHT. Return true if they are opposite pairs.`,
  },
  {
    slug: 'ood-tic-tac-toe',
    title: 'Design a Tic-Tac-Toe Game',
    leetcode_id: -116,
    difficulty: 'Easy',
    category: 'OOD',
    lists: ['OOD'],
    topics: ['OOD', 'Game Design', 'Validation'],
    content: `<p><strong>Design an object-oriented Tic-Tac-Toe game.</strong></p>
<p><strong>Requirements:</strong></p>
<ul>
<li>Standard 3x3 board (bonus: support NxN)</li>
<li>Two players take turns placing X and O</li>
<li>Detect a winner (3 in a row, column, or diagonal)</li>
<li>Detect a draw (board full, no winner)</li>
<li>Validate moves (cell must be empty, correct player's turn)</li>
<li>Support restarting the game</li>
<li>Bonus: AI opponent using minimax algorithm</li>
</ul>
<p><strong>Design the classes, win detection algorithm, and key methods.</strong></p>`,
    solution: `**Core Classes:**
1. **Game** — board, players[2], currentPlayerIndex, status (InProgress, Won, Draw). Methods: makeMove(row, col), switchTurn(), isOver(), getWinner(), reset().
2. **Board** — grid (Piece[][]), size (N). Methods: placePiece(row, col, piece), isValidMove(row, col), isFull(), checkWinner(), reset().
3. **Player** — name, piece (X or O), isAI. Methods: makeMove(board) — for AI, runs minimax.
4. **Piece** (enum) — X, O, EMPTY.
5. **AIPlayer** (extends Player) — difficulty. Methods: makeMove(board) — uses minimax with alpha-beta pruning to pick optimal move.

**Key Design Decisions:**
- **O(1) win detection (for NxN):** Instead of scanning the entire board after each move, maintain running counts: rowCounts[N], colCounts[N], diagCount, antiDiagCount. For player X, add +1; for O, add -1. If any count reaches +N or -N, that player wins. This is O(1) per move instead of O(N).
- **Fallback O(N) check:** After a move at (r,c), only need to check row r, column c, and (if applicable) the two diagonals. No need to scan entire board.
- **Board validates moves:** isValidMove checks bounds and that the cell is EMPTY.
- **Game controls turn order:** currentPlayerIndex alternates. Game rejects moves from the wrong player.
- **Extensible to NxN:** Board size is configurable. Win condition is N-in-a-row.

**Patterns Used:** Strategy (AI vs Human player behavior), Template Method (game loop: makeMove → checkWinner → switchTurn), Observer (notify UI on board state change).

**Key Methods:**
- Game.makeMove(row, col): validate it's the right player's turn, board.placePiece(), check for winner, check for draw, switchTurn().
- Board.checkWinner(): use row/col/diagonal counting approach. Return winning Piece or null.
- AIPlayer.makeMove(board): minimax(board, depth, isMaximizing, alpha, beta). Evaluate all possible moves recursively. Return the move with the best score.`,
  },
  {
    slug: 'ood-blackjack-game',
    title: 'Design a Blackjack Game',
    leetcode_id: -117,
    difficulty: 'Medium',
    category: 'OOD',
    lists: ['OOD'],
    topics: ['OOD', 'Game Design', 'Inheritance', 'State'],
    content: `<p><strong>Design an object-oriented Blackjack (21) card game.</strong></p>
<p><strong>Requirements:</strong></p>
<ul>
<li>Standard 52-card deck, support for multiple decks (shoe)</li>
<li>One dealer and one or more players</li>
<li>Players can Hit, Stand, Double Down, or Split pairs</li>
<li>Dealer follows fixed rules (hit on 16 or below, stand on 17+)</li>
<li>Handle Ace as 1 or 11 dynamically</li>
<li>Natural Blackjack (Ace + 10-value card) pays 3:2</li>
<li>Betting system with chips</li>
<li>Detect bust (over 21), push (tie), and winner</li>
</ul>
<p><strong>Design the classes, game flow, and key methods.</strong></p>`,
    solution: `**Core Classes:**
1. **BlackjackGame** — deck, dealer, players[], status. Methods: startRound(), dealInitialCards(), playPlayerTurns(), playDealerTurn(), determineWinners(), resetRound().
2. **Shoe** — decks (multiple Deck instances shuffled together), cards[]. Methods: shuffle(), drawCard(), needsReshuffle() — reshuffle when penetration threshold reached.
3. **Deck** — standard 52 cards. Methods: generate() — creates all suit/rank combinations.
4. **Card** — suit, rank, isFaceUp. Methods: getValue() — 2-10 face value, J/Q/K = 10, Ace = 11 (adjusted in Hand).
5. **Hand** — cards[]. Methods: addCard(), getScore(), isBust(), isBlackjack(), isSoft() — has Ace counted as 11.
6. **Hand.getScore():** Sum all card values. For each Ace (counted as 11), if total > 21, convert one Ace to 1 (subtract 10). This handles the dynamic Ace logic.
7. **Player** — name, chips, hands[] (multiple due to split), currentBet. Methods: hit(), stand(), doubleDown(), split(), placeBet().
8. **Dealer** (extends Player) — follows fixed strategy. Methods: playTurn() — hit while score < 17, then stand. Second card is face-down until their turn.
9. **Bet** — player, amount. Methods: payout(multiplier), lose().

**Key Design Decisions:**
- **Hand, not Player, tracks cards:** A player can have multiple Hands after splitting. Each Hand is played independently with its own score and outcome.
- **Ace handling in getScore():** Count all Aces as 11 initially. While total > 21 and there are Aces counted as 11, convert one to 1. This automatically finds the best Ace valuation.
- **Dealer strategy is hardcoded, player strategy is interactive:** Dealer's playTurn() is deterministic. Player's actions are driven by user input. Strategy pattern if you want to plug in an AI player.
- **Shoe for multi-deck:** Casinos use 6-8 decks. Shoe concatenates and shuffles all decks. Reshuffle when ~75% dealt (penetration).
- **Game flow as Template Method:** dealInitialCards() → check naturals → playPlayerTurns() (each player in order) → playDealerTurn() → determineWinners() → settle bets.

**Patterns Used:** Template Method (game round flow), Strategy (player strategy: human input vs AI), State (player turn: can Hit/Stand/DoubleDown vs already standing/bust), Observer (UI updates on card dealt).

**Key Methods:**
- Hand.getScore(): total = sum of card values. softAces = count of aces. While total > 21 and softAces > 0: total -= 10, softAces--. Return total.
- BlackjackGame.determineWinners(): for each player hand: if bust → lose. Else compare to dealer score. Higher wins (pay 1:1), natural blackjack (pay 3:2), tie is push (return bet), lower loses.
- Player.split(): hand must have exactly 2 cards of same rank. Create two new Hands, each with one card. Draw one more card for each. Place equal bet on second hand.`,
  },
  {
    slug: 'ood-music-player',
    title: 'Design a Music Player',
    leetcode_id: -118,
    difficulty: 'Medium',
    category: 'OOD',
    lists: ['OOD'],
    topics: ['OOD', 'State Machine', 'Iterator', 'Collections'],
    content: `<p><strong>Design an object-oriented music player application (like Spotify).</strong></p>
<p><strong>Requirements:</strong></p>
<ul>
<li>Users can browse and search for songs, albums, and artists</li>
<li>Users can create, edit, and delete playlists</li>
<li>Playback controls: play, pause, stop, next, previous, seek</li>
<li>Playback modes: sequential, shuffle, repeat one, repeat all</li>
<li>Maintain a play queue with upcoming songs</li>
<li>Track listening history and play counts</li>
<li>Support user library (liked songs, followed artists)</li>
</ul>
<p><strong>Design the classes, their relationships, and key methods.</strong></p>`,
    solution: `**Core Classes:**
1. **MusicPlayer** — currentUser, playbackEngine, nowPlaying, queue. Methods: play(song), pause(), resume(), stop(), next(), previous(), seek(position).
2. **Song** — songId, title, artist, album, duration, genre, playCount. Methods: getDetails().
3. **Artist** — name, albums[], songs[], bio. Methods: getDiscography().
4. **Album** — title, artist, songs[], releaseDate, coverArt. Methods: getSongs(), getDuration().
5. **Playlist** — name, owner, songs[], isPublic, createdDate. Methods: addSong(), removeSong(), reorder(), getSongs(), getDuration(), getTotalSongs().
6. **PlayQueue** — songs deque, currentIndex. Methods: addNext(song), addToEnd(song), remove(index), clear(), getCurrent(), peekNext().
7. **PlaybackEngine** — currentSong, currentPosition, status (Playing, Paused, Stopped), volume. Methods: play(), pause(), resume(), stop(), seek(seconds), setVolume().
8. **PlaybackMode** (interface) — Methods: getNextSong(queue, currentIndex), getPreviousSong(queue, currentIndex). Implementations: SequentialMode, ShuffleMode, RepeatOneMode, RepeatAllMode.
9. **User** — userId, name, playlists[], likedSongs[], followedArtists[], listeningHistory[]. Methods: createPlaylist(), likeSong(), followArtist().
10. **ListeningHistory** — user, entries[]. Each entry: song, timestamp, durationListened. Methods: getRecentlyPlayed(), getMostPlayed().
11. **MusicLibrary** — allSongs[], allArtists[], allAlbums[]. Methods: searchByTitle(query), searchByArtist(name), searchByGenre(genre).

**Key Design Decisions:**
- **PlaybackMode as Strategy:** Shuffle, sequential, repeat-one, and repeat-all each implement getNextSong() differently. ShuffleMode maintains a shuffled index list; RepeatOneMode always returns the same song; SequentialMode increments index.
- **Queue is separate from Playlist:** Playing a playlist populates the queue. User can modify the queue (add next, reorder) without affecting the original playlist.
- **PlaybackEngine encapsulates audio:** Separates the audio playback concern from the queue/song management. MusicPlayer coordinates between PlaybackEngine, Queue, and PlaybackMode.
- **Song is a value/entity:** Songs belong to Albums and Artists. Many-to-many with Playlists (a song can be in many playlists).

**Patterns Used:** Strategy (playback modes), Observer (UI observes playback state for progress bar, now-playing display), Iterator (PlaybackMode acts as a custom iterator over the queue), Singleton (MusicPlayer per user session), Command (playback controls as undoable commands).

**Key Methods:**
- MusicPlayer.next(): nextSong = playbackMode.getNextSong(queue, currentIndex). If null (end of queue and no repeat), stop(). Else playbackEngine.play(nextSong), update currentIndex.
- ShuffleMode.getNextSong(queue, index): maintain a shuffled permutation of indices. Advance through that permutation. Reshuffle when exhausted (if repeat-all).
- Playlist.addSong(song): append to songs list. If currently playing this playlist, optionally add to queue.`,
  },
  {
    slug: 'ood-airline-management',
    title: 'Design an Airline / Flight Booking System',
    leetcode_id: -119,
    difficulty: 'Hard',
    category: 'OOD',
    lists: ['OOD'],
    topics: ['OOD', 'Booking', 'Search', 'Concurrency'],
    content: `<p><strong>Design an object-oriented airline flight booking system.</strong></p>
<p><strong>Requirements:</strong></p>
<ul>
<li>Search for flights by origin, destination, date, and number of passengers</li>
<li>Support one-way and round-trip bookings</li>
<li>Multiple seat classes: Economy, Business, First Class with different prices</li>
<li>Seat selection from a seat map</li>
<li>Handle booking, cancellation, and modification</li>
<li>Flight status tracking (On Time, Delayed, Cancelled, Boarding, In Air, Landed)</li>
<li>Handle connecting flights (itinerary with multiple legs)</li>
<li>Passenger check-in and boarding pass generation</li>
</ul>
<p><strong>Design the classes, their relationships, and key methods.</strong></p>`,
    solution: `**Core Classes:**
1. **Airline** — name, code, fleet[], flights[]. Methods: searchFlights(), addFlight().
2. **Airport** — name, code (e.g., "SFO"), city, country, terminals[]. Methods: getDepartures(date), getArrivals(date).
3. **Flight** — flightNumber, airline, origin (Airport), destination (Airport), departureTime, arrivalTime, aircraft, status (Scheduled, Boarding, InAir, Landed, Delayed, Cancelled), seatMap. Methods: getAvailableSeats(seatClass), getPrice(seatClass), updateStatus().
4. **Aircraft** — model, tailNumber, seatConfiguration map<SeatClass, Seat[]>, totalCapacity. Methods: getSeatMap().
5. **Seat** — seatNumber (e.g., "12A"), seatClass (Economy, Business, First), row, column, isWindow, isAisle, status (Available, Booked, Blocked). Methods: isAvailable().
6. **SeatClass** (enum) — Economy, PremiumEconomy, Business, First. Each has base price multiplier.
7. **Passenger** — name, passport, email, phone, frequentFlyerNumber. Methods: checkIn(), getBoardingPass().
8. **Booking** — bookingId, passengers[], itinerary, totalPrice, status (Confirmed, Cancelled, CheckedIn), payment. Methods: cancel(), modify(), addPassenger().
9. **Itinerary** — legs (FlightReservation[]), type (OneWay, RoundTrip). Methods: getTotalDuration(), getLayoverDurations(), getTotalPrice().
10. **FlightReservation** — flight, passenger, seat, seatClass, price, status. Methods: selectSeat(), changeSeat(), checkIn().
11. **BoardingPass** — passenger, flight, seat, gate, boardingGroup, barcode. Methods: generate().
12. **FlightSearch** — Methods: search(origin, destination, date, passengers, seatClass): returns list of Itinerary options, including direct flights and connections.
13. **Payment** — amount, method, status. Methods: charge(), refund().

**Key Design Decisions:**
- **Itinerary as a composite:** A booking can have multiple flight legs (connecting flights). Itinerary holds ordered FlightReservations. Total duration includes layovers.
- **Flight search for connections:** FlightSearch.search() first looks for direct flights. If none (or to offer alternatives), finds paths with 1-2 connections using BFS/DFS on the airport graph where edges are scheduled flights. Filter by total duration and layover constraints.
- **Seat availability is per-flight:** Flight's seatMap tracks which seats are booked. Concurrency: use optimistic locking or synchronized seat assignment to prevent double-booking.
- **Booking vs FlightReservation:** Booking is the customer-facing entity (one booking can cover multiple passengers and flights). FlightReservation links one passenger to one flight with one seat.
- **Flight status as state machine:** Scheduled → Boarding → InAir → Landed. Delayed and Cancelled can happen from Scheduled. Status changes trigger notifications to booked passengers.

**Patterns Used:** Strategy (pricing by class, dynamic pricing), Observer (flight status change notifies passengers), Composite (itinerary of flight legs), Builder (complex booking with passengers, flights, seats, payment), State (flight status).

**Key Methods:**
- FlightSearch.search(origin, dest, date, pax, class): find direct flights + connecting itineraries. Sort by price, duration, number of stops. Return ranked options.
- Booking.cancel(): for each FlightReservation, release seat, update status. Process refund based on cancellation policy (time-based strategy).
- Passenger.checkIn(flightReservation): verify within check-in window (24h before departure), assign seat if not selected, generate BoardingPass, update reservation status.`,
  },
  {
    slug: 'ood-stack-overflow',
    title: 'Design a Q&A Platform (Stack Overflow)',
    leetcode_id: -120,
    difficulty: 'Medium',
    category: 'OOD',
    lists: ['OOD'],
    topics: ['OOD', 'Voting', 'Reputation', 'Search'],
    content: `<p><strong>Design an object-oriented Q&A platform like Stack Overflow.</strong></p>
<p><strong>Requirements:</strong></p>
<ul>
<li>Users can post questions with tags</li>
<li>Users can post answers to questions</li>
<li>Users can comment on questions and answers</li>
<li>Voting system: upvote/downvote questions and answers</li>
<li>Question author can accept one answer as the best answer</li>
<li>Reputation system: earn points for upvotes, accepted answers, etc.</li>
<li>Tag-based categorization and search</li>
<li>Privileges unlock at reputation thresholds (e.g., edit others' posts at 2000 rep)</li>
<li>Close/reopen questions (duplicate, off-topic, etc.)</li>
</ul>
<p><strong>Design the classes, their relationships, and key methods.</strong></p>`,
    solution: `**Core Classes:**
1. **User** — userId, name, email, reputation, badges[], questions[], answers[]. Methods: askQuestion(), postAnswer(), comment(), vote(), acceptAnswer(). Reputation gates: can user perform this action?
2. **Question** — questionId, title, body, author, tags[], answers[], comments[], votes (VoteTracker), views, status (Open, Closed, Duplicate), acceptedAnswer, createdAt, editHistory[]. Methods: addAnswer(), addComment(), close(reason), reopen(), edit(), accept(answer).
3. **Answer** — answerId, question, body, author, comments[], votes (VoteTracker), isAccepted, createdAt, editHistory[]. Methods: addComment(), edit(), markAccepted().
4. **Comment** — commentId, body, author, parentType (Question or Answer), parentId, createdAt, upvotes. Methods: edit(), delete().
5. **Tag** — name, description, questionCount. Methods: getQuestions().
6. **Vote** — voter, targetType (Question/Answer), targetId, voteType (Upvote, Downvote). One vote per user per target.
7. **VoteTracker** — votes map<User, VoteType>, score. Methods: addVote(user, type), removeVote(user), getScore(). Enforces one vote per user, toggles on repeat.
8. **ReputationSystem** — rules map<Action, points>. Actions: QuestionUpvoted(+10), AnswerUpvoted(+10), AnswerAccepted(+15), QuestionDownvoted(-2), Downvoting(-1). Methods: award(user, action), checkPrivilege(user, privilege).
9. **Privilege** (enum) — Comment(50), Upvote(15), Downvote(125), EditOthers(2000), CloseVote(3000). Each has a reputation threshold.
10. **Badge** — name, description, type (Gold, Silver, Bronze), criteria. E.g., "Answered a question with 100+ upvotes."
11. **SearchService** — Methods: searchByKeyword(query), searchByTag(tag), searchByUser(user). Returns ranked questions.

**Key Design Decisions:**
- **VoteTracker per Question/Answer:** Encapsulates voting logic — ensures one vote per user, calculates net score, handles vote reversal (click upvote again to undo). Stored as a map from User to VoteType.
- **Reputation as a centralized system:** ReputationSystem is a single source of truth. Every vote, accept, or other action calls ReputationSystem.award(). Privileges are checked against the user's current reputation.
- **Question/Answer share Votable interface:** Both support upvoting, downvoting, commenting, and editing. Could use an abstract Votable or Post base class.
- **Edit history:** Each Question and Answer stores a list of edits (EditHistory: editor, timestamp, previousBody). Enables rollback and transparency.
- **Closing a question:** Requires N close votes from users with CloseVote privilege. Close reasons: Duplicate (link to original), OffTopic, TooBoard, OpinionBased.

**Patterns Used:** Observer (notify question author when new answer is posted, notify answerer when answer is accepted), Strategy (reputation rules can be swapped), Decorator (privilege checks wrap actions), Template Method (shared voting/commenting logic in base Post class).

**Key Methods:**
- User.vote(target, voteType): check privilege (reputation >= threshold). VoteTracker.addVote(). ReputationSystem.award(target.author, action). If downvote, also deduct 1 from voter.
- Question.accept(answer): only question author can accept. Set acceptedAnswer, mark answer.isAccepted = true. ReputationSystem.award(answer.author, AnswerAccepted +15).
- ReputationSystem.checkPrivilege(user, privilege): return user.reputation >= privilege.threshold.`,
  },
  {
    slug: 'ood-task-management',
    title: 'Design a Task Management System',
    leetcode_id: -121,
    difficulty: 'Medium',
    category: 'OOD',
    lists: ['OOD'],
    topics: ['OOD', 'Workflow', 'Collaboration', 'State'],
    content: `<p><strong>Design an object-oriented task management system (like Jira or Trello).</strong></p>
<p><strong>Requirements:</strong></p>
<ul>
<li>Users can create projects/boards with multiple task lists (columns)</li>
<li>Create, edit, delete, and assign tasks to team members</li>
<li>Tasks have status transitions: To Do, In Progress, In Review, Done</li>
<li>Tasks have priority levels: Critical, High, Medium, Low</li>
<li>Support subtasks (parent-child task relationships)</li>
<li>Add comments and attachments to tasks</li>
<li>Filter and sort tasks by assignee, priority, due date, labels</li>
<li>Sprint management: create sprints, assign tasks to sprints, track progress</li>
<li>Activity log: track all changes to tasks</li>
</ul>
<p><strong>Design the classes, their relationships, and key methods.</strong></p>`,
    solution: `**Core Classes:**
1. **User** — userId, name, email, role (Admin, ProjectManager, Developer, Viewer), assignedTasks[]. Methods: createTask(), assignTask(), commentOnTask().
2. **Project** — projectId, name, description, owner, members[], boards[], sprints[]. Methods: addMember(), createBoard(), createSprint().
3. **Board** — boardId, name, columns[], project. Methods: addColumn(), moveTask(task, fromCol, toCol), getTasksByFilter().
4. **Column** — name, tasks[], position, wipLimit (optional Work-In-Progress limit). Methods: addTask(), removeTask(), reorder(). Represents a status lane (To Do, In Progress, etc.).
5. **Task** — taskId, title, description, status, priority, assignee, reporter, labels[], dueDate, estimatedHours, subtasks[], parentTask, comments[], attachments[], activityLog[], sprint, createdAt, updatedAt. Methods: assign(user), updateStatus(status), addSubtask(), addComment(), addAttachment(), logActivity().
6. **TaskStatus** (enum) — Todo, InProgress, InReview, Done, Blocked. Defines allowed transitions.
7. **Priority** (enum) — Critical, High, Medium, Low. Used for sorting and filtering.
8. **Comment** — author, body, timestamp, editedAt. Methods: edit(), delete().
9. **Attachment** — fileName, fileUrl, uploadedBy, uploadedAt, size. Methods: download(), delete().
10. **Sprint** — sprintId, name, startDate, endDate, tasks[], status (Planning, Active, Completed), goal. Methods: addTask(), removeTask(), start(), complete(), getBurndownData().
11. **Label** — name, color. Used for categorization (e.g., "bug", "feature", "tech-debt").
12. **ActivityLog** — task, user, action, field, oldValue, newValue, timestamp. Records every change for auditing.
13. **TaskFilter** — assignee, status, priority, labels, dueDate range, sprint. Methods: apply(tasks[]): filters and returns matching tasks.

**Key Design Decisions:**
- **Board + Column = Kanban view:** Board has ordered Columns. Moving a task between columns changes its status. Column.wipLimit enforces process discipline (e.g., max 3 tasks In Progress).
- **Task hierarchy (Composite):** A Task can have subtasks. Parent task completion depends on subtask completion. Subtasks inherit project/sprint but can have different assignees.
- **Activity log for auditability:** Every field change on a Task creates an ActivityLog entry (field: "status", oldValue: "Todo", newValue: "InProgress", user, timestamp). This provides full history.
- **Status transitions are validated:** Not all transitions are valid. A task cannot go from Todo directly to Done. Define allowed transitions in a state machine map: Todo → [InProgress], InProgress → [InReview, Blocked], InReview → [Done, InProgress], etc.
- **Sprint burndown:** Sprint tracks total estimated hours vs completed hours over time. getBurndownData() returns daily remaining work for chart rendering.

**Patterns Used:** Observer (notify assignee when task is assigned, notify watchers on status change), State (task status transitions), Composite (parent tasks and subtasks), Command (task actions logged for undo/audit), Strategy (filtering and sorting strategies).

**Key Methods:**
- Task.updateStatus(newStatus): validate transition is allowed from current status. Update status, log activity (old, new), notify watchers. If moving to Done, check all subtasks also Done.
- Board.moveTask(task, fromCol, toCol): remove from fromCol, add to toCol. Check toCol.wipLimit. Update task.status to match column. Log activity.
- Sprint.getBurndownData(): for each day in sprint, sum remaining estimatedHours of incomplete tasks. Return as time series for chart.`,
  },
  {
    slug: 'ood-ride-sharing',
    title: 'Design a Ride-Sharing Service',
    leetcode_id: -122,
    difficulty: 'Hard',
    category: 'OOD',
    lists: ['OOD'],
    topics: ['OOD', 'Matching', 'State Machine', 'Geolocation'],
    content: `<p><strong>Design an object-oriented ride-sharing service (like Uber or Lyft).</strong></p>
<p><strong>Requirements:</strong></p>
<ul>
<li>Riders can request rides by specifying pickup and dropoff locations</li>
<li>Different ride types: Economy, Premium, XL (larger vehicle)</li>
<li>Match riders with nearby available drivers</li>
<li>Drivers can accept or decline ride requests</li>
<li>Real-time ride tracking with ETA</li>
<li>Fare calculation based on distance, time, ride type, and surge pricing</li>
<li>Rating system: riders rate drivers and vice versa</li>
<li>Payment processing with multiple payment methods</li>
<li>Trip history for both riders and drivers</li>
</ul>
<p><strong>Design the classes, their relationships, and key methods.</strong></p>`,
    solution: `**Core Classes:**
1. **Rider** — userId, name, paymentMethods[], rating, tripHistory[]. Methods: requestRide(pickup, dropoff, rideType), cancelRide(), rateDriver(trip, score).
2. **Driver** — userId, name, vehicle, licenseNumber, status (Available, OnTrip, Offline), currentLocation, rating, tripHistory[]. Methods: goOnline(), goOffline(), acceptRide(rideRequest), declineRide(), rateRider(trip, score), updateLocation(location).
3. **Vehicle** — make, model, year, licensePlate, color, capacity, rideType (Economy, Premium, XL). Methods: canServe(rideType).
4. **RideRequest** — rider, pickup (Location), dropoff (Location), rideType, timestamp, status (Pending, Matched, Expired, Cancelled), estimatedFare. Methods: cancel(), expire().
5. **Trip** — tripId, rider, driver, pickup, dropoff, rideType, status (DriverEnRoute, WaitingForRider, InProgress, Completed, Cancelled), route[], startTime, endTime, fare, riderRating, driverRating. Methods: start(), complete(), cancel(), calculateFare().
6. **Location** — latitude, longitude. Methods: distanceTo(other), toString().
7. **RideType** (enum) — Economy, Premium, XL. Each has a base rate, per-mile rate, per-minute rate, and minimum fare.
8. **FareCalculator** (interface) — Methods: calculate(distance, duration, rideType, surgeMultiplier). Implementations: StandardFareCalculator, SurgeFareCalculator.
9. **SurgeManager** — Methods: getSurgeMultiplier(location, time). Based on supply/demand ratio in a geographic zone.
10. **DriverMatchingService** — Methods: findNearestDrivers(location, rideType, radius), matchDriver(rideRequest). Finds available drivers sorted by distance, sends request to nearest first.
11. **Rating** — fromUser, toUser, trip, score (1-5), comment, timestamp.
12. **Payment** — trip, amount, paymentMethod, status. Methods: charge(), refund().
13. **TripStatus** (enum) — DriverEnRoute, WaitingForRider, InProgress, Completed, Cancelled.

**Key Design Decisions:**
- **Driver matching is a separate service:** DriverMatchingService maintains an index of available drivers by location (geospatial index or grid). When a ride is requested, find drivers within radius, filter by rideType compatibility, sort by distance, and send request to closest.
- **Trip state machine:** Pending → DriverEnRoute (driver accepted) → WaitingForRider (driver arrived at pickup) → InProgress (rider picked up) → Completed (arrived at dropoff). Cancellation possible at most states with different policies.
- **Fare = base + (per-mile * distance) + (per-minute * duration) * surgeMultiplier.** Surge is determined by geographic zone demand. FareCalculator is a Strategy.
- **Rating is bidirectional:** After trip completion, both rider and driver rate each other. Average rating affects future matching priority (low-rated drivers get fewer requests).
- **Driver location updates:** Driver periodically sends location updates. Stored in a geospatial index for efficient nearest-neighbor queries.

**Patterns Used:** Strategy (fare calculation, driver matching algorithms), State (trip lifecycle), Observer (notify rider of driver location updates and ETA changes), Singleton (SurgeManager, DriverMatchingService), Command (ride request as a command that can be cancelled).

**Key Methods:**
- DriverMatchingService.matchDriver(rideRequest): get nearby available drivers for the ride type. Send request to closest. If declined or no response in 15s, try next driver. If all decline, notify rider no drivers available.
- Trip.calculateFare(): distance = route total distance. duration = endTime - startTime. surge = SurgeManager.getSurgeMultiplier(pickup, startTime). Return FareCalculator.calculate(distance, duration, rideType, surge). Apply minimum fare.
- Trip.complete(): set status to Completed, set endTime, calculateFare(), charge Payment, prompt for ratings, add to both rider and driver trip history. Set driver status back to Available.`,
  },
];

export default oodExtraProblems;
