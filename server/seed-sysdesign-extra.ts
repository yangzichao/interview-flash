import type { NonAlgoProblem } from './seed-data-non-algo.js';

const problems: NonAlgoProblem[] = [
  // ============================================================
  // SYSTEM DESIGN — EXTENDED SET
  // ============================================================
  {
    slug: 'sysdesign-google-maps',
    title: 'Design Google Maps / Location-Based Service',
    leetcode_id: -209,
    difficulty: 'Hard',
    category: 'System Design',
    lists: ['System Design'],
    topics: ['System Design', 'Geospatial', 'Graph Algorithms', 'Caching'],
    content: `<p><strong>Design a navigation and mapping service like Google Maps.</strong></p>
<p><strong>Requirements:</strong></p>
<ul>
<li>Display map tiles at various zoom levels</li>
<li>Calculate driving/walking/cycling routes between two points</li>
<li>Provide estimated time of arrival (ETA) with live traffic</li>
<li>Search for places/businesses by name or category</li>
<li>Support 1B daily active users, 50M navigation sessions per day</li>
<li>Map data: 100+ countries, billions of road segments</li>
</ul>
<p><strong>Discuss: map tile serving, routing algorithms, live traffic integration, location indexing, and scaling.</strong></p>`,
    solution: `**Architecture Overview:**
Three major subsystems: (1) Map Rendering / Tile Serving, (2) Navigation / Routing, (3) Search / Places.

**1. Map Tile Serving:**
- Pre-render map tiles at ~20 zoom levels using a tiling scheme (Slippy Map / Web Mercator projection). Each zoom level divides the world into 4^zoom tiles.
- Tiles stored as raster images (PNG) or vector tiles (Protocol Buffers) in blob storage (S3/GCS).
- Serve via CDN — tiles are highly cacheable. Popular areas (cities) cached at edge, rural areas served from origin.
- Vector tiles preferred: smaller payload, client-side rendering allows style customization, ~10x fewer bytes than raster.
- Total storage: ~50TB for global vector tiles across all zoom levels.

**2. Navigation / Routing Engine:**
- **Road network as a graph:** Nodes = intersections, edges = road segments. ~1B nodes, ~2B edges globally.
- **Shortest path:** Dijkstra is too slow for continental-scale queries. Use **Contraction Hierarchies (CH)** or **A*** with landmarks.
  - Contraction Hierarchies: preprocess the graph by contracting unimportant nodes, adding shortcut edges. Query time: ~1ms for cross-country routes (vs. seconds for plain Dijkstra).
  - Preprocessing takes hours but only needs to run when road network changes.
- **Edge weights:** base travel time from speed limits + road class. Adjust dynamically with live traffic.
- **Live traffic integration:**
  - Ingest GPS probe data from users (anonymized speed on road segments). Aggregate in real-time using Kafka + Flink.
  - Update edge weights every 1-2 minutes. Store in a fast KV store (Redis) keyed by road segment ID.
  - ETA = sum of segment travel times along the route using current traffic weights.
- **Route response:** Return a polyline (encoded list of lat/lng points), turn-by-turn instructions, and ETA.

**3. Search / Places:**
- **Geospatial index:** Use a Quadtree or Geohash-based index in Elasticsearch.
  - Geohash converts (lat, lng) into a string prefix — nearby points share prefixes. Enables range queries.
- **Places DB:** Store 200M+ POIs (name, category, lat, lng, hours, ratings). PostgreSQL + PostGIS or Elasticsearch with geo queries.
- **Autocomplete:** Trie or prefix index on place names, ranked by popularity and proximity to user's current location.

**Key Design Decisions:**
- **Partition road graph by geographic region** (e.g., country/state). Cross-region routing uses a hierarchical approach: route within origin region → cross-region backbone → route within destination region.
- **Offline support:** Allow downloading map tiles + precomputed routing data for a region.
- **Precompute tiles, don't render on the fly.** Tile rendering is CPU-intensive; do it in a batch pipeline and cache aggressively.

**Data Storage:**
- Map tiles: S3/GCS + CDN
- Road graph: Custom in-memory data structure on routing servers (loaded from HDFS/S3 at startup). ~20GB RAM per region.
- Places: Elasticsearch cluster
- Live traffic: Redis cluster (segment_id → current_speed)
- User GPS probes: Kafka → Flink → Redis

**Capacity Estimates:**
- 1B DAU loading ~20 tiles per session = 20B tile requests/day ≈ 230K tiles/sec. CDN handles 95%+.
- 50M navigation sessions/day ≈ 580 route requests/sec. Each takes ~5ms with CH → manageable with ~10 routing servers per region.
- GPS probes: 100M active navigating users reporting every 5 seconds = 20M probes/sec at peak → Kafka topic, aggregate per segment.

**Trade-offs:**
- Contraction Hierarchies: fast queries but slow preprocessing (~hours). Updates to road network (construction, closures) require re-preprocessing the affected region.
- Vector vs raster tiles: vector is smaller and more flexible, but requires client-side rendering capability.
- Freshness of traffic data vs computational cost: more frequent aggregation = better ETA accuracy but higher infra cost.`,
  },
  {
    slug: 'sysdesign-uber',
    title: 'Design Uber / Ride-Sharing Backend',
    leetcode_id: -210,
    difficulty: 'Hard',
    category: 'System Design',
    lists: ['System Design'],
    topics: ['System Design', 'Geospatial', 'Real-time', 'Matching'],
    content: `<p><strong>Design a ride-sharing backend like Uber or Lyft.</strong></p>
<p><strong>Requirements:</strong></p>
<ul>
<li>Riders request a ride from point A to point B</li>
<li>Match riders with nearby available drivers in real-time</li>
<li>Track driver location in real-time (update every 3-4 seconds)</li>
<li>Calculate fare estimates based on distance, time, and surge pricing</li>
<li>Support 20M daily rides, 5M concurrent drivers</li>
<li>ETA for driver arrival</li>
</ul>
<p><strong>Discuss: location tracking, driver matching, surge pricing, trip lifecycle, and scaling.</strong></p>`,
    solution: `**Core Services:**

**1. Location Service (most critical):**
- Drivers send GPS location every 4 seconds. 5M drivers × 0.25 updates/sec = 1.25M location updates/sec.
- Store driver locations in an in-memory geospatial index.
- **Data structure:** Geohash-based grid. Divide the world into cells (e.g., geohash precision 6 ≈ 1.2km × 0.6km). Each cell is a bucket of driver IDs.
- Store in Redis using geospatial commands (GEOADD, GEORADIUS) or a custom in-memory index.
- Partition by city/region — each region handled by a dedicated location service instance.
- Persist location history to Kafka → data warehouse for analytics/ETA models.

**2. Matching Service (Dispatch):**
- When rider requests a ride:
  1. Query Location Service for available drivers within radius (start 2km, expand if needed).
  2. Rank candidates by: distance to rider, driver rating, acceptance rate, ETA (via routing).
  3. Send ride request to top-ranked driver. Wait 15 seconds for response.
  4. If declined/timeout, offer to next driver.
- **Supply-demand matching:** During high demand, use a batch matching algorithm — collect requests over a short window (2-3 seconds) and solve a bipartite matching optimization to minimize total wait time.

**3. Trip Service:**
- Manages the trip lifecycle: REQUESTED → MATCHED → DRIVER_EN_ROUTE → ARRIVED → IN_PROGRESS → COMPLETED → BILLED.
- State machine persisted in PostgreSQL. Each state transition logged.
- During trip: track route, compute distance traveled (for fare), monitor for safety anomalies.

**4. Pricing / Surge Service:**
- Base fare: base + (per_mile × distance) + (per_minute × duration) + booking fee.
- **Surge pricing:** Divide city into hexagonal zones (H3 cells). For each zone, compute supply/demand ratio every 1-2 minutes.
  - demand / supply > threshold → surge multiplier (1.5x, 2x, etc.).
  - Publish surge map to riders before they confirm.
- Pricing service is read-heavy, cache surge multipliers in Redis with short TTL (60s).

**5. ETA Service:**
- Predict driver arrival time and trip duration.
- Use routing engine (similar to Google Maps) + ML model trained on historical trip data.
- Features: distance, time of day, traffic conditions, road type.

**Data Storage:**
- **Driver locations:** Redis Geo / in-memory geospatial index (ephemeral, latest only).
- **Trip data:** PostgreSQL, sharded by city. Trip table: (trip_id, rider_id, driver_id, status, pickup, dropoff, fare, timestamps).
- **User/Driver profiles:** PostgreSQL with read replicas.
- **Location history + events:** Kafka → S3/HDFS (for ML training, analytics).
- **Surge pricing:** Redis (zone_id → multiplier).

**Key Design Decisions:**
- **Geospatial partitioning by city:** Each city is an independent dispatch domain. Simplifies scaling — add servers per city as demand grows.
- **WebSocket for real-time updates:** Both rider and driver maintain WebSocket connections for live location tracking, trip status updates, and driver offers.
- **Idempotent fare calculation:** Fare computed server-side based on actual GPS trace, not client-reported data. Prevents manipulation.

**Scaling:**
- 20M rides/day ≈ 230 rides/sec globally. Distributed across ~100 cities, most cities see <10 rides/sec — very manageable per-city.
- Location updates: 1.25M/sec globally → partition by city, ~50K/sec in the busiest city (NYC/Mumbai) → single Redis instance handles this.
- Trip DB: sharded by city_id. Each shard handles a few hundred writes/sec.

**Capacity Estimates:**
- Location update payload: ~100 bytes × 1.25M/sec = 125 MB/sec ingress.
- Trip record: ~1KB × 20M/day = 20GB/day of trip data.
- Location history: 5M drivers × 0.25 updates/sec × 100 bytes × 86400 sec = ~10TB/day raw GPS data → compress and store in S3.`,
  },
  {
    slug: 'sysdesign-instagram',
    title: 'Design Instagram / Photo Sharing',
    leetcode_id: -211,
    difficulty: 'Hard',
    category: 'System Design',
    lists: ['System Design'],
    topics: ['System Design', 'CDN', 'Feed', 'Object Storage'],
    content: `<p><strong>Design a photo-sharing social platform like Instagram.</strong></p>
<p><strong>Requirements:</strong></p>
<ul>
<li>Users can upload photos with captions and filters</li>
<li>Users can follow others and see a news feed of photos</li>
<li>Like and comment on photos</li>
<li>Support Stories (ephemeral 24-hour content)</li>
<li>Explore/Discover page with recommended content</li>
<li>Support 500M daily active users, 100M photos uploaded per day</li>
<li>Low-latency feed loading (&lt;500ms)</li>
</ul>
<p><strong>Discuss: photo storage, feed generation, CDN strategy, and scaling for read-heavy workloads.</strong></p>`,
    solution: `**Architecture Overview:**

**1. Photo Upload Flow:**
1. Client uploads photo to an Upload Service (pre-signed URL to S3/GCS for direct upload, bypassing app servers for large files).
2. Upload triggers an async image processing pipeline (via SQS/Kafka):
   - Generate multiple resolutions (thumbnail 150px, medium 640px, full 1080px).
   - Apply filters server-side (optional — can also be client-side).
   - Strip EXIF metadata for privacy.
   - Run content moderation (NSFW detection ML model).
3. Store processed images in S3/GCS, organized by user_id and photo_id.
4. Write metadata to DB: photos table (photo_id, user_id, caption, s3_url, created_at).
5. Trigger feed fan-out (see below).

**2. News Feed Generation:**
- **Hybrid fan-out (same as Twitter design):**
  - On photo upload, fan out to followers' feed caches (Redis sorted sets, scored by timestamp).
  - For celebrity users (>500K followers), skip fan-out. At read time, merge celebrity photos into the user's feed.
- Feed request: fetch pre-built feed from Redis (user_id → sorted set of photo_ids), hydrate with photo metadata (batch DB lookup), return.
- Feed cache stores only photo IDs (not full objects) — keeps memory usage manageable.

**3. Stories:**
- Stories expire after 24 hours. Store in a separate table: stories (story_id, user_id, media_url, created_at, expires_at).
- User's story list: Redis sorted set with TTL. Automatically cleaned up.
- When loading a user's profile or feed, fetch active stories from followees. Group by user, sort by recency.

**4. Explore / Discover Page:**
- Content recommendation system: collaborative filtering + content-based features.
- Precompute candidate sets offline (Spark/Flink). Rank in real-time with a lightweight ML model using features: user interaction history, photo engagement metrics, content embeddings.
- Serve from a dedicated Explore Service with its own cache layer.

**Core Components:**
- **API Gateway / Load Balancer:** Route requests, rate limiting, authentication.
- **Photo Service:** Upload, metadata CRUD, image processing pipeline.
- **Feed Service:** Feed generation, fan-out workers, feed cache management.
- **Social Graph Service:** Follow/unfollow, follower lists. Store in Redis (adjacency list) + MySQL.
- **Interaction Service:** Likes, comments. Likes counter in Redis (INCR), async flush to DB.
- **Search Service:** Elasticsearch for hashtags, usernames, locations.
- **Notification Service:** Push notifications for likes, comments, follows, mentions.

**Data Storage:**
- **Photos (blobs):** S3/GCS. ~2MB average per photo × 100M/day = 200TB/day of new photos. Lifecycle policy: move old photos to cheaper storage tiers (S3 Infrequent Access → Glacier).
- **Metadata DB:** MySQL/PostgreSQL, sharded by user_id.
  - photos: (photo_id, user_id, caption, s3_key, created_at, location_id)
  - follows: (follower_id, followee_id)
  - likes: (user_id, photo_id, created_at) — sharded by photo_id
  - comments: (comment_id, photo_id, user_id, text, created_at)
- **Feed cache:** Redis cluster. Each user's feed = sorted set of last 500 photo_ids. 500M users × ~4KB = 2TB Redis.
- **CDN:** Serve all images via CDN (CloudFront/Akamai). Cache hit rate >98% for photos (immutable content).

**Key Design Decisions:**
- **Pre-signed URLs for upload:** Clients upload directly to S3, reducing load on app servers. App server issues a pre-signed URL with expiry.
- **Multiple image resolutions:** Serve appropriate size based on client screen. Saves bandwidth — thumbnail is 10x smaller than full resolution.
- **Separate read and write paths:** Write path is async (queue-based processing). Read path is cache-first (Redis + CDN). Optimized for read-heavy workload (100:1 read:write ratio).

**Scaling:**
- 500M DAU, each loading feed ~10 times/day = 5B feed requests/day ≈ 58K/sec. Cache-first architecture handles this.
- Photo uploads: 100M/day ≈ 1150/sec. Image processing workers auto-scale based on queue depth.
- Fan-out: 100M uploads × avg 200 followers = 20B feed cache writes/day. Redis cluster with ~50 nodes.

**Capacity Estimates:**
- Storage growth: 200TB/day × 365 = 73PB/year of photos. Need aggressive tiered storage and possibly dedup for reposts.
- CDN bandwidth: 500M users × 30 photos/session × 200KB avg = 3PB/day of CDN egress.`,
  },
  {
    slug: 'sysdesign-dropbox',
    title: 'Design Dropbox / Google Drive (File Storage & Sync)',
    leetcode_id: -212,
    difficulty: 'Hard',
    category: 'System Design',
    lists: ['System Design'],
    topics: ['System Design', 'File Storage', 'Sync', 'Deduplication'],
    content: `<p><strong>Design a cloud file storage and synchronization service like Dropbox or Google Drive.</strong></p>
<p><strong>Requirements:</strong></p>
<ul>
<li>Upload, download, and manage files and folders</li>
<li>Automatic sync across multiple devices</li>
<li>File sharing with permissions (view, edit)</li>
<li>File versioning — restore previous versions</li>
<li>Support files up to 10GB</li>
<li>Support 500M users, 100M daily active users</li>
<li>Low-latency sync — changes propagated within seconds</li>
</ul>
<p><strong>Discuss: chunked upload, deduplication, sync protocol, conflict resolution, and storage optimization.</strong></p>`,
    solution: `**Architecture Overview:**

**1. File Upload / Chunking (most important design decision):**
- Split files into fixed-size chunks (4MB each). Upload chunks independently.
- **Why chunking?**
  - Resume interrupted uploads (only re-upload failed chunks).
  - Deduplication: identical chunks across files/users stored only once.
  - Delta sync: when a file changes, only upload the changed chunks, not the entire file.
- **Content-addressable storage:** Each chunk is hashed (SHA-256). The hash is the chunk ID. If a chunk with the same hash already exists, skip upload (dedup).
- Upload flow:
  1. Client splits file into 4MB chunks, computes hash of each chunk.
  2. Client sends chunk hashes to server ("Do you already have these?").
  3. Server responds with list of missing chunks.
  4. Client uploads only missing chunks to Block Storage Service → S3/GCS.
  5. Server updates metadata: file → ordered list of chunk hashes.

**2. Metadata Service:**
- Stores the file system hierarchy and chunk manifests.
- Tables:
  - users: (user_id, email, quota_used, quota_limit)
  - files: (file_id, user_id, filename, parent_folder_id, size, is_folder, latest_version)
  - file_versions: (version_id, file_id, chunk_list JSON, created_at, size)
  - chunks: (chunk_hash, s3_key, ref_count, size)
  - sharing: (file_id, shared_with_user_id, permission)
- **Database:** MySQL/PostgreSQL, sharded by user_id. File metadata is relatively small compared to file content.

**3. Sync Service (critical for user experience):**
- **Sync protocol:** Combination of push and pull.
  - **Long polling or WebSocket:** Client maintains a connection to Sync Service. When a file changes on the server (uploaded from another device or shared edit), server pushes a notification.
  - Client receives notification → fetches updated file metadata → downloads only changed chunks.
- **Conflict resolution:**
  - If two devices edit the same file simultaneously, detect conflict by comparing version numbers.
  - Resolution strategy: save both versions, let user choose (Dropbox approach). Or: last-writer-wins for simple cases, create a "conflicted copy" for complex cases.
- **Change log:** An ordered log of all file changes per user (create, update, delete, move, rename). Each entry has a sequence number. Client tracks its last-seen sequence number and requests changes since then on reconnect.

**4. Block Storage Service:**
- Manages chunk storage in S3/GCS.
- Handles upload (with dedup check), download (serve chunks), and garbage collection (delete chunks with ref_count = 0).
- **Reference counting:** Each chunk has a ref_count of how many file versions reference it. When a version is deleted, decrement. When ref_count reaches 0, schedule chunk deletion.

**Core Components:**
- **API Gateway:** Auth, rate limiting, routing.
- **Upload Service:** Handles chunked uploads, dedup checks, writes chunks to S3.
- **Download Service:** Serves file chunks. Reconstruct file by concatenating chunks in order.
- **Metadata Service:** File/folder CRUD, versioning, sharing.
- **Sync Service:** Manages change notifications, conflict detection. WebSocket connections.
- **Notification Service:** Push notifications to mobile devices for shared file changes.

**Key Design Decisions:**
- **Chunk size trade-off:** Small chunks (1MB) = better dedup and smaller delta sync, but more metadata overhead. Large chunks (16MB) = less metadata, but more redundant upload. 4MB is a good balance.
- **Content-addressable storage enables cross-user dedup.** If 1000 users upload the same PDF, store it once. Dropbox reports 60%+ dedup ratio.
- **Delta sync (rsync-like):** For file edits, compute which chunks changed using rolling checksum (like rsync). Only upload changed chunks. A 1GB file with a 1-byte edit uploads only one 4MB chunk.

**Storage:**
- File content: S3/GCS (chunked). Cheap, durable, scalable.
- Metadata: MySQL sharded by user_id. ~1KB per file × 500M users × avg 1000 files = 500TB metadata.
- Sync state: Redis (user_id → last_sync_sequence, active_connections).

**Scaling:**
- 100M DAU, ~10 file operations/day = 1B operations/day ≈ 11.5K ops/sec. Metadata DB can handle this with sharding.
- Concurrent WebSocket connections: 100M = need ~1000 sync servers (each handling 100K connections).
- Upload throughput: 100M users uploading 10MB/day avg = 1PB/day ingress. S3 handles this natively.

**Capacity Estimates:**
- Total storage: 500M users × 10GB avg = 5EB (exabytes) logical. With dedup (60% savings) = 2EB physical. S3 cost at $0.023/GB/month = ~$46M/month for storage alone — this is why free tiers are limited.`,
  },
  {
    slug: 'sysdesign-autocomplete',
    title: 'Design Search Autocomplete / Typeahead',
    leetcode_id: -213,
    difficulty: 'Medium',
    category: 'System Design',
    lists: ['System Design'],
    topics: ['System Design', 'Trie', 'Caching', 'Ranking'],
    content: `<p><strong>Design a search autocomplete (typeahead) system like Google Search suggestions.</strong></p>
<p><strong>Requirements:</strong></p>
<ul>
<li>As the user types, show the top 5-10 suggestions after each keystroke</li>
<li>Suggestions ranked by popularity (search frequency)</li>
<li>Latency under 100ms for every keystroke</li>
<li>Support 10B daily search queries</li>
<li>Handle trending/real-time queries (new events should appear quickly)</li>
<li>Multi-language support</li>
<li>Filter offensive/inappropriate suggestions</li>
</ul>
<p><strong>Discuss: data structure, ranking algorithm, data collection pipeline, and latency optimization.</strong></p>`,
    solution: `**Architecture — Two Subsystems:**
(1) Data Collection Pipeline (offline) — aggregate search queries and build the suggestion index.
(2) Query Service (online) — serve suggestions with ultra-low latency.

**1. Data Collection Pipeline:**
- **Input:** Stream of all search queries from the search service.
- **Aggregation:** Use Kafka → Flink/Spark Streaming to count query frequencies in sliding time windows (1 hour, 1 day, 1 week).
- **Frequency table:** query_text → weighted_frequency. Weight recent queries higher: freq = hourly_count × 10 + daily_count × 5 + weekly_count × 1.
- **Build suggestion index:** Periodically (every 15 minutes for trending, daily for full rebuild):
  - Take top N (e.g., 10K) completions for every prefix.
  - Build a Trie where each node stores the top K suggestions for that prefix.
  - Serialize the Trie and distribute to query servers.

**2. Trie Data Structure:**
- Each node = a character. Path from root = a prefix.
- At each node, store the top 10 suggestions (pre-computed, sorted by frequency).
- Looking up suggestions for prefix "app" = traverse a→p→p, return the stored top-10 list. O(L) where L = prefix length.
- **Optimization:** Don't store suggestions at every single node — only at nodes where a query was typed. Use a compressed (Patricia) trie to save memory.
- **Size estimate:** 5B unique queries × avg 20 chars × 2 bytes = 200GB for the trie. Fits in memory on a beefy server or sharded across a few.

**3. Query Service:**
- **Request:** User types "ho" → service returns ["how to tie a tie", "hotels near me", "home depot", ...].
- **Flow:** Lookup prefix in trie → return pre-computed top-10 list.
- **Latency:** Trie lookup is O(prefix_length) ≈ microseconds. Target <10ms end-to-end.

**Key Design Decisions:**

- **Pre-compute top-K at each trie node (critical).** Don't traverse all children at query time — that's too slow. Pre-compute during the build phase so lookups are O(L).
- **Two-level caching:**
  1. **Application cache:** LRU cache of prefix → suggestions on the query server. Short prefixes (1-3 chars) get extremely high hit rates.
  2. **CDN/Browser caching:** Return suggestions with Cache-Control headers (max-age=60s). For prefix "a", the same 10 suggestions work for millions of users — cache at CDN edge.
- **Client-side optimization:**
  - Debounce requests: don't send a request for every keystroke. Wait 50-100ms after the user stops typing.
  - Prefetch: when user types "ho", also prefetch "hom", "hot", "hou" in the background.
  - Cancel in-flight: if user types "ho" then "hot", cancel the "ho" request.

- **Trending queries:**
  - Maintain a separate "trending trie" updated every 15 minutes from real-time aggregation (Flink).
  - At query time, merge results from the main trie and trending trie. Boost trending results.

- **Filtering:** Maintain a blocklist of offensive terms. Filter at two levels: (1) during trie build, exclude blocked queries, (2) at query time, filter results against the blocklist.

**Data Storage:**
- Trie: in-memory on query servers. Rebuilt periodically, loaded from a serialized snapshot in S3.
- Query logs: Kafka → S3 (raw logs) + Flink (real-time aggregation).
- Frequency counts: Redis or a time-series DB for real-time counts. HDFS/S3 for historical batch counts.

**Scaling:**
- 10B queries/day, ~30% trigger autocomplete ≈ 3B autocomplete requests/day ≈ 35K/sec.
- With CDN caching (popular prefixes), origin servers handle ~5K/sec — easily served by a small cluster.
- Shard the trie alphabetically (a-f on server 1, g-m on server 2, etc.) or by consistent hashing of the prefix.
- Each shard replicated 3x for availability.

**Capacity Estimates:**
- Trie size: ~200GB across all shards. 10 servers with 32GB each handle a shard + replicas.
- Cache hit rate for short prefixes (1-2 chars): >99%. These cover a huge fraction of requests.
- End-to-end latency: CDN hit = 5ms, cache hit on server = 10ms, trie lookup = 15ms. Well within 100ms target.`,
  },
  {
    slug: 'sysdesign-newsfeed-ranking',
    title: 'Design News Feed Ranking System',
    leetcode_id: -214,
    difficulty: 'Hard',
    category: 'System Design',
    lists: ['System Design'],
    topics: ['System Design', 'Machine Learning', 'Ranking', 'Feed'],
    content: `<p><strong>Design a ranked news feed system (like Facebook/LinkedIn feed ranking) that goes beyond chronological ordering.</strong></p>
<p><strong>Requirements:</strong></p>
<ul>
<li>Rank posts by predicted user engagement (not just recency)</li>
<li>Support multiple content types: text, images, videos, ads, suggested follows</li>
<li>Personalized per user based on their interaction history</li>
<li>Near real-time — new posts appear within minutes</li>
<li>A/B testable — easy to swap ranking models</li>
<li>Support 500M daily active users, each loading feed ~20 times/day</li>
</ul>
<p><strong>Discuss: candidate generation, feature engineering, ranking model, serving infrastructure, and feedback loops.</strong></p>`,
    solution: `**Architecture — Multi-stage Ranking Pipeline:**

A single feed request goes through: Candidate Generation → Pre-ranking → Full Ranking → Post-ranking → Blending.

**1. Candidate Generation (reduce from millions to ~1000):**
- Sources of candidates:
  - **Follow graph:** Recent posts from users/pages the viewer follows (primary source).
  - **Friends-of-friends:** Posts that friends liked/commented on (social signal).
  - **Interest-based:** Posts from topics/groups the user engages with.
  - **Trending/Explore:** Globally popular content.
- Each source independently retrieves candidates using simple heuristics (recency, author popularity).
- Union all sources → ~500-2000 candidates. Dedup by post_id.

**2. Pre-ranking (lightweight filter, reduce to ~500):**
- Apply a simple, fast model (logistic regression or small neural net) to quickly score candidates.
- Filter out low-quality content: spam, policy violations, content the user has hidden before.
- This step reduces computational load for the expensive full ranking stage.

**3. Full Ranking (the core ML model):**
- **Multi-task learning model** predicts multiple engagement types simultaneously:
  - P(like), P(comment), P(share), P(click), P(long_dwell), P(hide), P(report).
- **Final score** = weighted combination: score = w1·P(like) + w2·P(comment) + w3·P(share) - w4·P(hide) - w5·P(report).
  - Weights tuned via A/B testing to optimize long-term engagement metrics.
- **Model architecture:** Deep neural network (e.g., DeepFM, DLRM, or custom transformer) with:
  - Sparse features: user_id, post_author_id, post_type, user_interests, author_category (embedding layers).
  - Dense features: post_age_minutes, author_follower_count, user_past_engagement_rate, time_of_day.
  - Cross features: user-author affinity (historical interaction count), content_type-user preference match.
- **Feature store:** Pre-compute and cache user features (Redis) and item features (post statistics updated every few minutes).
- Model inference: ~5ms per candidate. 500 candidates × 5ms = 2.5 seconds sequentially → batch inference on GPU: 500 candidates in ~10ms.

**4. Post-ranking (business rules and diversity):**
- **Diversity:** Don't show 5 posts from the same author in a row. Spread content types (text, image, video).
- **Ads injection:** Insert ad slots at predetermined positions (every 5th post). Ads have their own ranking model.
- **Content policy:** Final check for blocked/muted authors, sensitive content warnings.
- **Freshness boost:** Slightly boost very recent posts (< 1 hour) to ensure timely content delivery.

**5. Blending:**
- Interleave ranked organic posts, ads, suggested follows, stories, and other content modules.
- Output: final ordered feed, paginated (20-30 posts per page).

**Serving Infrastructure:**
- **Feature Store:** Redis cluster storing pre-computed user features (updated hourly) and post features (updated every 5 minutes). Sub-millisecond lookups.
- **Model Serving:** TensorFlow Serving or Triton Inference Server on GPU instances. Model versioned and deployed via A/B framework.
- **A/B Testing Framework:** Each request is assigned to an experiment cohort. Different cohorts may use different models, feature sets, or score weights. Track metrics (engagement, time-spent, user satisfaction surveys) per cohort.
- **Logging Pipeline:** Log every ranking decision (post_id, score, position, features) to Kafka → HDFS. Used for model retraining and debugging.

**Feedback Loop and Model Training:**
- Continuous learning: retrain model daily on latest interaction data.
- Training data: (user, post, features_at_time_of_ranking, label) where label = {liked: 1, ignored: 0, hidden: -1}.
- Pipeline: Kafka → Spark (join impressions with interactions) → Training on GPU cluster → Model validation → Gradual rollout.
- **Beware of feedback loops:** Model promotes content → gets more engagement → reinforces model bias. Mitigate with exploration (show some random content to unbiased users for training data).

**Data Storage:**
- Post content: MySQL/PostgreSQL sharded by user_id.
- Social graph: Redis or dedicated graph DB.
- Features: Redis (online serving) + HDFS (training).
- Models: S3 (model artifacts) + Model Registry for versioning.
- Logs: Kafka → HDFS/S3.

**Scaling:**
- 500M DAU × 20 feed loads = 10B ranking requests/day ≈ 115K/sec.
- Each request ranks ~500 candidates in ~50ms total (feature fetch + inference + post-ranking).
- Need ~500 GPU-equipped ranking servers (each handling ~230 QPS).
- Feature store: Redis cluster with ~100 nodes (user features + post features).

**Key Trade-offs:**
- **Relevance vs. recency:** Pure ML ranking can surface old but "engaging" content. Users expect some recency. Solution: recency as a feature + freshness boost.
- **Engagement optimization vs. well-being:** Maximizing clicks can promote clickbait/outrage. Include negative signals (P(hide), P(report)) with high weights to counteract.
- **Model complexity vs. latency:** Deeper models rank better but slower inference. Use pre-ranking to filter cheaply, reserve expensive model for fewer candidates.`,
  },
  {
    slug: 'sysdesign-pastebin',
    title: 'Design Pastebin / Code Sharing',
    leetcode_id: -215,
    difficulty: 'Medium',
    category: 'System Design',
    lists: ['System Design'],
    topics: ['System Design', 'Object Storage', 'URL Generation'],
    content: `<p><strong>Design a text/code sharing service like Pastebin or GitHub Gist.</strong></p>
<p><strong>Requirements:</strong></p>
<ul>
<li>Users paste text/code and get a unique short URL to share</li>
<li>Content viewable by anyone with the URL (or optionally password-protected)</li>
<li>Syntax highlighting for 100+ programming languages</li>
<li>Optional expiration (10 min, 1 hour, 1 day, never)</li>
<li>Max paste size: 10MB</li>
<li>Support 10M new pastes per day, 100M reads per day</li>
<li>Raw text endpoint for programmatic access</li>
</ul>
<p><strong>Discuss: storage strategy, URL generation, expiration handling, and read-heavy optimization.</strong></p>`,
    solution: `**API Design:**
- POST /api/paste { content, language, expiration, password? } → { url, raw_url, delete_key }
- GET /p/{pasteId} → rendered HTML with syntax highlighting
- GET /raw/{pasteId} → raw text content
- DELETE /api/paste/{pasteId} { delete_key } → 204

**URL/ID Generation:**
- Generate a unique 8-character alphanumeric ID. Base62 (a-z, A-Z, 0-9): 62^8 = 218 trillion IDs — no collision risk.
- Options:
  - **Pre-generated Key Service (KGS):** Generate random 8-char keys offline, store in a keys DB. On paste creation, pop a key. No collision checking needed at write time. Fast and simple.
  - **Snowflake ID → Base62:** Generate a 64-bit unique ID (timestamp + worker_id + sequence), then Base62-encode. Guaranteed unique, sortable.
- **Best choice:** KGS for simplicity. Pre-generate millions of keys and serve from a Redis queue (RPOPLPUSH for atomic key allocation).

**Storage Architecture:**
- **Metadata DB (MySQL/PostgreSQL):**
  - pastes: (paste_id, user_id, language, created_at, expires_at, password_hash, title, size_bytes, is_public)
  - Sharded by paste_id (hash-based).
- **Content Storage:**
  - Small pastes (<64KB): store directly in the metadata DB as a TEXT column. Single read for metadata + content.
  - Large pastes (64KB - 10MB): store in S3/GCS. Metadata row stores the S3 key. Two reads but handles large content without bloating the DB.
  - This dual strategy optimizes for the common case (95% of pastes are <64KB) while supporting large files.

**Syntax Highlighting:**
- **Server-side rendering:** Use a library like Pygments (Python) or highlight.js (Node). Render highlighted HTML on first view and cache the result.
- **Client-side rendering:** Return raw text + language hint. JavaScript library (Prism.js, highlight.js) renders in the browser. Reduces server CPU but increases page load time.
- **Best hybrid:** Return raw text, render client-side for initial view. Cache the rendered HTML on the server for subsequent views.

**Expiration Handling:**
- Two strategies:
  1. **Lazy deletion:** On read, check expires_at. If expired, return 404 and delete in background. Simple, but expired data uses storage until accessed.
  2. **Active cleanup:** Cron job runs every hour, queries for expired pastes (WHERE expires_at < NOW()), deletes in batches. Frees storage proactively.
- Use both: lazy deletion for immediate correctness + cron cleanup for storage reclamation.

**Caching:**
- Redis cache for hot pastes. Cache key = paste_id, value = content + metadata.
- Cache on read: first access populates cache. TTL = min(paste_expiration, 24 hours).
- CDN for static assets (CSS, JS) and optionally for public paste content (cache with paste_id in the URL).
- Cache hit rate expectation: ~80% (popular pastes shared on social media get heavy traffic bursts).

**Key Design Decisions:**
- **Read-heavy optimization (10:1 ratio):** Cache-first architecture. Most reads hit Redis/CDN, not the database.
- **No user account required:** Anonymous pastes allowed. Optional login for paste management (list, edit, delete).
- **Abuse prevention:** Rate limit by IP (100 pastes/hour). Content scanning for malware/phishing links. CAPTCHA for anonymous users creating many pastes.

**Scaling:**
- Writes: 10M/day ≈ 115/sec. Single database shard handles this easily.
- Reads: 100M/day ≈ 1150/sec. With 80% cache hit rate, DB sees ~230/sec.
- Storage: 10M pastes/day × avg 5KB = 50GB/day = 18TB/year. Very manageable with S3 + DB.
- Scale horizontally by adding read replicas and cache nodes.

**Capacity Estimates:**
- Key space: 62^8 = 218T keys. At 10M/day, exhaustion in 60M years. No concern.
- Redis cache: 10M hot pastes × 10KB avg = 100GB. A few large Redis instances.
- Total storage after 5 years: ~90TB. S3 cost: ~$2K/month.`,
  },
  {
    slug: 'sysdesign-ticketmaster',
    title: 'Design Ticketmaster / Event Booking System',
    leetcode_id: -216,
    difficulty: 'Hard',
    category: 'System Design',
    lists: ['System Design'],
    topics: ['System Design', 'Concurrency', 'Booking', 'Queue'],
    content: `<p><strong>Design an event ticket booking system like Ticketmaster.</strong></p>
<p><strong>Requirements:</strong></p>
<ul>
<li>Browse events and view available seats/sections</li>
<li>Select specific seats or "best available"</li>
<li>Temporary seat hold during checkout (5-minute reservation)</li>
<li>Process payment and issue tickets</li>
<li>Handle flash sales — 100K+ users trying to buy tickets for a popular event simultaneously</li>
<li>No double-booking — each seat sold exactly once</li>
<li>Support 500K events per year, venues with up to 100K seats</li>
</ul>
<p><strong>Discuss: seat inventory management, concurrency control, virtual queue, payment integration, and handling flash sales.</strong></p>`,
    solution: `**The Core Challenge:** Preventing double-booking under extreme concurrency. When Taylor Swift tickets go on sale, 1M+ users hit the system simultaneously for 70K seats.

**Architecture Overview:**

**1. Virtual Queue / Waiting Room (critical for flash sales):**
- When demand > capacity, don't let everyone hit the booking system simultaneously. Use a virtual queue.
- **Flow:** User clicks "Buy" → placed in a virtual queue → assigned a random position → shown estimated wait time → when their turn arrives, granted a time-limited token (10 minutes) to select and purchase seats.
- **Implementation:** A separate Queue Service issues numbered tokens. Admit N users per minute based on the booking system's capacity. Use a Redis sorted set (score = queue position) or a dedicated queue (SQS with controlled consumers).
- This converts a stampede into a controlled flow, protecting the booking service from overload.

**2. Seat Inventory Service:**
- **Data model:**
  - events: (event_id, venue_id, name, date, status)
  - sections: (section_id, event_id, name, price_tier)
  - seats: (seat_id, section_id, row, number, status ENUM('available', 'held', 'sold'), held_by_user_id, hold_expires_at)
- **Status transitions:** available → held → sold (or held → available on timeout).
- **Concurrency control for seat selection:**
  - **Pessimistic locking:** SELECT ... FOR UPDATE on the seat row. Guarantees no double-booking but creates contention under high concurrency.
  - **Optimistic locking:** Use a version column. UPDATE seats SET status='held', version=version+1 WHERE seat_id=X AND status='available' AND version=V. If 0 rows affected, seat was taken — retry with another seat.
  - **Best approach for high concurrency:** Use Redis for real-time seat status. Atomic SETNX (set-if-not-exists) on key seat:{event_id}:{seat_id}. If successful, seat is held. Set TTL = 5 minutes for auto-expiry.
- **"Best Available" algorithm:** Pre-sort seats by desirability (center > sides, lower rows > upper). Walk through sorted list, attempt to hold the first N available seats atomically.

**3. Booking / Order Service:**
- **Hold phase:** User selects seats → Inventory Service holds them (5-minute TTL). Order created in PENDING state.
- **Payment phase:** User enters payment → Payment Service charges the card (via Stripe/Braintree). If payment succeeds → mark order CONFIRMED, seats status → SOLD. If payment fails → release hold, seats → AVAILABLE.
- **Timeout handling:** A scheduler checks for expired holds every 30 seconds. Alternatively, Redis TTL auto-expires holds — on next availability check, the seat is free.

**4. Payment Service:**
- Integrates with payment gateway (Stripe, Braintree).
- **Idempotency key** on every charge request (order_id) — prevents double-charging on retry.
- Handle async payment confirmations (webhooks from payment provider).
- Store payment records: (payment_id, order_id, amount, status, provider_transaction_id).

**Handling the Flash Sale Scenario:**
1. Event page shows "On sale at 10:00 AM." Before that, users see a countdown.
2. At 10:00 AM, users click "Buy" → routed to Virtual Queue.
3. Queue admits ~1000 users/minute (tuned to booking system capacity).
4. Each admitted user gets 10 minutes to browse seats, select, and pay.
5. Seat availability shown in near-real-time (Redis-backed, updated on every hold/release).
6. If user's hold expires, seats are released back to the pool.

**Data Storage:**
- **Seat inventory (real-time):** Redis. Key: seat:{event_id}:{seat_id}, Value: user_id. TTL: 300 seconds (hold duration). Atomic operations ensure no double-booking.
- **Persistent state:** PostgreSQL. Events, orders, payments, ticket records. Source of truth after booking is confirmed.
- **Queue state:** Redis sorted set or SQS.

**Key Design Decisions:**
- **Redis as the real-time inventory lock** — single-threaded, atomic, sub-millisecond. Handles 100K+ concurrent seat checks easily. PostgreSQL is the persistent record of truth, updated async after booking is confirmed.
- **Separate read and write concerns:** Seat availability map served from a read-optimized cache (updated every 1-2 seconds). Actual booking uses atomic Redis operations.
- **Oversell protection:** Even with Redis, edge cases exist (Redis failover). Add a final database-level unique constraint: UNIQUE(event_id, seat_id) on the tickets table. INSERT fails if seat already sold — last line of defense.

**Scaling:**
- Flash sale peak: 1M users in queue, 1000 admitted/minute, each doing ~5 seat-check operations = 5000 Redis ops/sec. Easily handled.
- Normal operations: 500K events/year, avg 1000 seats × 5 status checks per booking = moderate load.
- Shard by event_id — each popular event gets its own Redis instance.

**Capacity Estimates:**
- Seat records: 500K events × avg 10K seats = 5B seat records/year. Each ~100 bytes = 500GB/year in PostgreSQL.
- Redis memory per event: 100K seats × 50 bytes = 5MB. Even 1000 concurrent events = 5GB total.`,
  },
  {
    slug: 'sysdesign-google-docs',
    title: 'Design Google Docs / Collaborative Editing',
    leetcode_id: -217,
    difficulty: 'Hard',
    category: 'System Design',
    lists: ['System Design'],
    topics: ['System Design', 'CRDT', 'OT', 'Real-time', 'WebSocket'],
    content: `<p><strong>Design a real-time collaborative document editor like Google Docs.</strong></p>
<p><strong>Requirements:</strong></p>
<ul>
<li>Multiple users can edit the same document simultaneously</li>
<li>Changes appear in real-time for all collaborators (&lt;100ms latency)</li>
<li>Conflict-free — concurrent edits should be merged correctly</li>
<li>Document history and version tracking</li>
<li>Support rich text (bold, italic, headers, lists, images)</li>
<li>Offline editing with sync on reconnect</li>
<li>Support 10M documents, up to 50 concurrent editors per document</li>
</ul>
<p><strong>Discuss: conflict resolution algorithms (OT vs CRDT), real-time sync, document storage, and presence indicators.</strong></p>`,
    solution: `**The Core Challenge:** When two users simultaneously type at the same position, how do you merge their edits consistently across all clients?

**Conflict Resolution — Two Approaches:**

**1. Operational Transformation (OT) — Google Docs' approach:**
- Each edit is an "operation" (insert char 'a' at position 5, delete char at position 3).
- When the server receives concurrent operations from different clients, it **transforms** them against each other so they can be applied in any order and produce the same result.
- Example: User A inserts 'X' at position 2. User B inserts 'Y' at position 5. If A's op is applied first, B's position shifts (transform B: insert 'Y' at position 6). Both clients converge to the same document state.
- **Server is the single source of truth.** All operations are ordered by the server. Clients send ops → server transforms and broadcasts.
- **Pros:** Proven at scale (Google Docs), efficient wire format (small ops).
- **Cons:** Complex transformation logic, especially for rich text. Server is a bottleneck (single serialization point per document).

**2. Conflict-free Replicated Data Types (CRDT) — used by Figma, Yjs:**
- Each character has a unique ID (globally unique, ordered). Insertions create new IDs between existing ones.
- No central server needed for conflict resolution — CRDTs are designed to merge automatically.
- **Pros:** Works offline/peer-to-peer, no server bottleneck.
- **Cons:** Higher memory overhead (each character carries metadata), can produce surprising merge results for some edge cases.

**Recommended: OT for a Google Docs-like system** (server-centric, proven, simpler mental model for rich text).

**Architecture:**

**1. Collaboration Service (per-document session):**
- When a user opens a document, they establish a **WebSocket connection** to the Collaboration Service.
- The service manages a per-document session: list of connected clients, operation history buffer, current server version.
- **Operation flow:**
  1. Client generates an operation (e.g., insert 'a' at pos 5) and sends it via WebSocket.
  2. Server assigns a sequential version number to the operation.
  3. Server transforms the operation against any concurrent operations it has already applied (OT).
  4. Server applies the transformed operation to the server-side document state.
  5. Server broadcasts the transformed operation to all other connected clients.
  6. Each client applies the received operation (already transformed) to their local document.
- **Client-side buffering:** Client maintains a buffer of unacknowledged operations. When the server acknowledges an operation, the client removes it from the buffer. If the server sends an operation while the client has unacknowledged ops, the client transforms the received op against its buffer.

**2. Document Storage Service:**
- **Snapshot storage:** Periodically (every 100 operations or every 30 seconds), save a full document snapshot to the database. This is the checkpoint.
- **Operation log:** Store every operation in an append-only log (Kafka or a database table). Used for version history and replaying changes.
- **Storage schema:**
  - documents: (doc_id, owner_id, title, current_version, latest_snapshot_version, created_at, updated_at)
  - snapshots: (doc_id, version, content_json, created_at) — stores the full document at a point in time
  - operations: (doc_id, version, user_id, op_data_json, created_at) — every individual edit
- To load a document: fetch latest snapshot + all operations since that snapshot. Replay operations on the snapshot.

**3. Presence Service:**
- Shows which users are viewing/editing and their cursor positions.
- Each client sends cursor position updates via WebSocket (throttled to 5 updates/sec).
- Server broadcasts cursor positions to other clients in the session.
- Use a lightweight in-memory store (per session) — no persistence needed.

**4. Document Service (CRUD):**
- Create, list, share, delete documents. Manages permissions (owner, editor, viewer).
- Permissions stored in DB: doc_permissions (doc_id, user_id, role).

**Rich Text Representation:**
- Use a structured document model, not raw HTML. Example: Delta format (used by Quill editor) or ProseMirror's node-based model.
- Operations are defined on this model: insert text with attributes {bold: true}, delete range, format range.
- OT transformations are defined for each operation type pair.

**Offline Editing:**
- Client stores operations locally (IndexedDB) when offline.
- On reconnect: client sends buffered operations to server, server transforms them against any operations that happened while the client was offline.
- Potential for significant divergence if offline for a long time — user may see their document "jump" as concurrent edits are merged.

**Data Storage:**
- Document metadata + permissions: PostgreSQL, sharded by doc_id.
- Snapshots: S3/GCS (for large documents) or PostgreSQL JSONB (for smaller ones).
- Operation log: Kafka (real-time) + S3 (long-term archival).
- Active sessions: in-memory on the Collaboration Service instances.

**Key Design Decisions:**
- **One Collaboration Service instance per document** (or a small set of documents). All operations for a document are serialized through one server — this is required for OT to work correctly. Use consistent hashing to route all connections for a document to the same server.
- **If that server fails:** Clients reconnect to a new server. New server loads the latest snapshot + operation log to reconstruct state. Brief interruption (~seconds) but no data loss.
- **Document size limit:** Cap at ~10MB of text. For very large documents, consider splitting into sections that sync independently.

**Scaling:**
- 10M documents, but most are not actively edited. Peak concurrent editing: ~100K documents with 2+ editors.
- Each Collaboration Service instance handles ~5K concurrent document sessions (mostly idle WebSocket connections).
- 20 instances handle the active editing load. Stateless scaling is not possible (OT requires per-doc state) — use consistent hashing for affinity.
- WebSocket connections: 100K documents × avg 3 editors = 300K concurrent connections. ~60 servers at 5K connections each.

**Capacity Estimates:**
- Operations per document: ~1 op per keystroke. Active user types ~5 chars/sec. 100K active docs × 3 users × 5 ops/sec = 1.5M ops/sec globally.
- Operation size: ~100 bytes. 1.5M/sec × 100B = 150MB/sec through the operation pipeline.
- Snapshot storage: 10M docs × avg 50KB = 500GB. Updated snapshots: ~100K/day.`,
  },
  {
    slug: 'sysdesign-payment-system',
    title: 'Design a Payment System (Stripe/PayPal)',
    leetcode_id: -218,
    difficulty: 'Hard',
    category: 'System Design',
    lists: ['System Design'],
    topics: ['System Design', 'Distributed Transactions', 'Idempotency', 'Ledger'],
    content: `<p><strong>Design a payment processing system like Stripe or PayPal.</strong></p>
<p><strong>Requirements:</strong></p>
<ul>
<li>Accept payments via credit card, debit card, and bank transfer</li>
<li>Process charges, refunds, and payouts to merchants</li>
<li>Exactly-once payment processing — never double-charge</li>
<li>Handle 1M transactions per day</li>
<li>PCI DSS compliance for card data handling</li>
<li>Support multiple currencies</li>
<li>Provide a reconciliation system to detect discrepancies</li>
<li>99.999% availability for payment processing</li>
</ul>
<p><strong>Discuss: idempotency, double-entry ledger, payment state machine, reconciliation, and fault tolerance.</strong></p>`,
    solution: `**The Core Challenge:** Money cannot be lost, duplicated, or misattributed. Every cent must be accounted for. This system requires extreme reliability and correctness.

**Architecture Overview:**

**1. Payment Service (API layer):**
- POST /v1/charges { amount, currency, payment_method_id, idempotency_key, merchant_id }
- POST /v1/refunds { charge_id, amount, idempotency_key }
- GET /v1/charges/{charge_id}
- **Idempotency (critical):** Every mutating API call requires an idempotency_key (client-generated UUID). The server stores the key → response mapping. If the same key is sent again (e.g., client retried after timeout), return the stored response without re-processing. Stored in Redis with 24-hour TTL + persisted to DB.

**2. Payment State Machine:**
- Each payment goes through a strict state machine:
  CREATED → PROCESSING → AUTHORIZED → CAPTURED → SETTLED
  CREATED → PROCESSING → DECLINED
  CAPTURED → PARTIALLY_REFUNDED / FULLY_REFUNDED
- **Every state transition is persisted** before performing the action. If the system crashes mid-transition, it can be recovered.
- Table: payments (payment_id, merchant_id, amount, currency, status, idempotency_key, payment_method_id, created_at, updated_at)
- Table: payment_events (event_id, payment_id, from_status, to_status, timestamp, metadata)

**3. Payment Processing Flow (charge):**
1. API receives charge request → validate → check idempotency → create payment record (status=CREATED).
2. Tokenize card data (or use pre-stored token). Card data never touches application servers — use a PCI-compliant vault service (separate isolated environment).
3. Send authorization request to **Payment Service Provider (PSP)** / card network (Visa/Mastercard via acquiring bank).
4. PSP responds: AUTHORIZED or DECLINED. Update payment status.
5. For authorized payments: capture (settle) immediately or later (e.g., e-commerce captures at shipment).
6. Settlement: funds move from cardholder's bank → acquiring bank → merchant's account. Typically T+1 or T+2 days.

**4. Double-Entry Ledger (accounting backbone):**
- Every financial movement is recorded as a pair of entries: debit one account, credit another. Total debits always equal total credits.
- Ledger entries:
  - (ledger_id, account_id, amount, type ENUM('debit','credit'), payment_id, timestamp)
- Example — customer pays $100 to merchant:
  - Debit: customer_liability account +$100
  - Credit: merchant_balance account +$100
  - (Later, on payout) Debit: merchant_balance -$100, Credit: bank_clearing +$100
- **Why double-entry?** Makes it mathematically impossible to lose money silently. Any discrepancy is immediately detectable (debits ≠ credits for a transaction → alert).

**5. Reconciliation Service:**
- Daily batch job that cross-references:
  - Internal ledger entries vs. PSP settlement reports.
  - Internal payment records vs. bank statements.
- Detects discrepancies: payments we think settled but PSP says declined, amounts that don't match, missing transactions.
- Output: reconciliation report. Discrepancies trigger alerts for manual investigation.
- **Three-way reconciliation:** Internal DB ↔ PSP records ↔ Bank statements.

**6. Risk / Fraud Detection Service:**
- Run fraud checks before authorizing payments:
  - Velocity checks (too many transactions in short time).
  - Address Verification (AVS), CVV check.
  - ML-based fraud scoring (transaction amount, location, device fingerprint, historical patterns).
- High-risk transactions → decline or hold for manual review.

**Key Design Decisions:**
- **Exactly-once semantics via idempotency keys + state machine.** The combination ensures that retries don't cause double-charges, and crash recovery resumes from the last persisted state.
- **Separate PCI environment:** Card data (PANs) only exists in a PCI-compliant vault. Application servers never see raw card numbers — they work with tokens. This drastically reduces PCI audit scope.
- **Async settlement:** Authorization is synchronous (user waits). Settlement is async (batch, T+1). This mirrors how card networks actually work.
- **Multi-currency:** Store amounts as integers in the smallest unit (cents, pence). Store the currency code (ISO 4217). Conversion happens at well-defined points using locked exchange rates.

**Data Storage:**
- **Primary DB:** PostgreSQL with synchronous replication (cannot lose committed transactions). Sharded by merchant_id.
- **Ledger:** Append-only table in PostgreSQL. No updates or deletes. Immutable audit trail.
- **Idempotency store:** Redis (fast lookup) + PostgreSQL (durable).
- **Card vault:** Separate, isolated PostgreSQL in PCI-compliant environment. Encrypted at rest (AES-256) and in transit.
- **Event log:** Kafka for async processing (settlement, notifications, analytics).

**Fault Tolerance:**
- **Database:** Synchronous replication to standby. Automatic failover. RPO = 0 (no data loss).
- **Payment processing:** If PSP timeout occurs, do NOT retry blindly (could double-charge). Instead, query PSP for transaction status using their idempotency key. Resume from the known state.
- **Circuit breaker:** If PSP is down, fail fast and return an error. Don't queue payments (stale card authorizations may be declined later).

**Scaling:**
- 1M transactions/day ≈ 12 TPS average, ~100 TPS peak (Black Friday).
- PostgreSQL easily handles this with a single primary + replicas. Sharding needed at ~10M+ transactions/day.
- Read-heavy dashboard queries: serve from read replicas or a separate analytics DB (Redshift/BigQuery).

**Capacity Estimates:**
- Payment records: 1M/day × 1KB = 1GB/day = 365GB/year.
- Ledger entries: 2 entries per payment × 1M/day × 200B = 400MB/day.
- Idempotency cache: 1M keys/day × 200B × 24h retention = ~200MB in Redis. Trivial.`,
  },
  {
    slug: 'sysdesign-ad-click-aggregation',
    title: 'Design Ad Click Aggregation / Analytics',
    leetcode_id: -219,
    difficulty: 'Hard',
    category: 'System Design',
    lists: ['System Design'],
    topics: ['System Design', 'Stream Processing', 'Aggregation', 'Analytics'],
    content: `<p><strong>Design a real-time ad click aggregation and analytics system.</strong></p>
<p><strong>Requirements:</strong></p>
<ul>
<li>Track ad impressions and clicks in real-time</li>
<li>Aggregate click counts by ad_id per minute/hour/day</li>
<li>Support filtering by: ad_id, campaign_id, advertiser_id, country, device_type</li>
<li>Handle 10B ad impressions and 500M clicks per day</li>
<li>Query results available within 1 minute of the event</li>
<li>Support click-through rate (CTR) calculation</li>
<li>Detect click fraud (bots, click farms)</li>
<li>Data must be accurate — used for billing advertisers</li>
</ul>
<p><strong>Discuss: event ingestion, stream processing, storage for aggregation queries, exactly-once counting, and fraud detection.</strong></p>`,
    solution: `**The Core Challenge:** Counting accurately at massive scale (10B events/day = 115K events/sec), in near real-time, with breakdowns by multiple dimensions, where the counts are used for billing (money).

**Architecture — Lambda-like with emphasis on streaming:**

**1. Event Ingestion Layer:**
- Ad servers send impression/click events to an event collector endpoint.
- **Event schema:** { event_id (UUID), event_type (impression|click), ad_id, campaign_id, advertiser_id, timestamp, user_id, ip, country, device_type, user_agent }
- **Ingestion endpoint:** Lightweight HTTP/gRPC service that validates and forwards events to Kafka. Stateless, horizontally scalable.
- **Kafka topics:** ad_impressions (100 partitions), ad_clicks (50 partitions). Partitioned by ad_id for ordered processing per ad.
- At 115K events/sec, Kafka handles this easily with ~20 brokers.

**2. Stream Processing Layer (real-time aggregation):**
- **Apache Flink** (or Kafka Streams) consumes from Kafka topics and performs:
  - **Windowed aggregation:** Count impressions and clicks per (ad_id, minute), (ad_id, hour), (ad_id, day). Use tumbling windows.
  - **Multi-dimensional aggregation:** Also aggregate by (campaign_id, country, device_type, minute) for drill-down queries.
  - **Deduplication:** Use event_id to deduplicate retries. Maintain a set of seen event_ids in a rolling 5-minute window (Flink state, backed by RocksDB).
  - **Click fraud filtering:** Apply rules-based filters inline (see fraud detection below). Flagged events are counted separately.
- Flink output: aggregated counts written to the serving layer every minute.
- **Exactly-once semantics:** Flink with Kafka supports exactly-once via checkpointing + idempotent sinks. Critical for billing accuracy.

**3. Serving / Query Layer:**
- Aggregated data stored in an **OLAP database** optimized for fast analytical queries.
- **ClickHouse** (columnar, fast aggregations) or **Apache Druid** (real-time ingestion + fast slice-and-dice).
- Schema (ClickHouse):
  - ad_events_minutely: (timestamp_minute, ad_id, campaign_id, advertiser_id, country, device_type, impressions_count, clicks_count)
  - Pre-aggregated by minute. Hourly/daily roll-ups computed as materialized views.
- **Query examples:**
  - "Clicks on ad_id=123 in the last hour" → SELECT SUM(clicks_count) FROM ad_events_minutely WHERE ad_id=123 AND timestamp_minute > now() - interval 1 hour. Sub-second query.
  - "CTR by country for campaign_id=456 today" → SELECT country, SUM(clicks_count)/SUM(impressions_count) AS ctr FROM ad_events_minutely WHERE campaign_id=456 AND timestamp_minute > today() GROUP BY country.

**4. Click Fraud Detection:**
- **Inline rules (Flink, real-time):**
  - Same user_id clicking the same ad > 5 times in 10 minutes → flag.
  - Same IP clicking > 20 different ads in 1 minute → flag.
  - Known bot user-agent strings → discard.
- **Offline ML model (batch):**
  - Train on historical data to detect sophisticated fraud patterns (click farms, botnets with rotating IPs).
  - Features: click rate per IP, time-between-clicks distribution, geographic anomalies, device fingerprint diversity.
  - Run daily on raw event data in Spark. Flag suspicious clicks retroactively → adjust billing.
- Flagged clicks stored separately: fraud_clicks table. Not counted in billing aggregates.

**5. Reconciliation and Billing:**
- Nightly batch job (Spark) re-aggregates from raw events in S3 (source of truth).
- Compare batch-computed aggregates with real-time aggregates. If discrepancy > threshold (0.1%), investigate and use batch numbers for billing.
- Generate billing reports per advertiser: total impressions, clicks, CTR, spend = clicks × cost_per_click.

**Data Storage:**
- **Raw events:** Kafka → S3 (Parquet format, partitioned by date/hour). Retained for 90 days. Source of truth for reconciliation.
- **Real-time aggregates:** ClickHouse / Druid. Minutely granularity retained for 7 days, hourly for 90 days, daily for 2 years.
- **Flink state:** RocksDB (on local SSD) with periodic checkpoints to S3.
- **Fraud detection results:** PostgreSQL (flagged events + fraud scores).

**Key Design Decisions:**
- **Pre-aggregate, don't query raw events.** 10B events/day is too many to query ad-hoc. Pre-aggregate by (ad_id, minute, dimensions) to reduce data by 1000x.
- **Exactly-once counting for billing accuracy.** Use Flink checkpointing + idempotent writes to ClickHouse (upsert by primary key = timestamp_minute + ad_id + dimensions).
- **Dual path (streaming + batch) for trust.** Real-time aggregates serve dashboards. Batch re-computation verifies correctness for billing. If they diverge, batch wins.
- **Columnar storage (ClickHouse)** for fast GROUP BY queries across billions of rows. Compression ratios of 10-20x on numeric aggregate data.

**Scaling:**
- Ingestion: 115K events/sec → 20 Kafka brokers, 50-100 partitions per topic.
- Processing: Flink cluster with ~50 task slots. Each slot processes ~2K events/sec.
- Storage: Raw events in S3: 10B events × 500 bytes = 5TB/day. With Parquet compression: ~500GB/day. Cost: ~$3.5K/month for 90-day retention.
- ClickHouse: minutely aggregates for 7 days: ~500M rows. Compressed: ~50GB. Easily fits on a single high-memory node.

**Capacity Estimates:**
- Kafka throughput: 115K events/sec × 500 bytes = 57MB/sec. Well within Kafka's per-broker capacity (~100MB/sec).
- Flink processing latency: <30 seconds from event to aggregated result in ClickHouse.
- ClickHouse query latency: <100ms for typical dashboard queries (pre-aggregated, indexed by ad_id).`,
  },
  {
    slug: 'sysdesign-task-scheduler',
    title: 'Design a Distributed Task Scheduler',
    leetcode_id: -220,
    difficulty: 'Hard',
    category: 'System Design',
    lists: ['System Design'],
    topics: ['System Design', 'Distributed Systems', 'Scheduling', 'Queue'],
    content: `<p><strong>Design a distributed task scheduler that can execute millions of jobs reliably.</strong></p>
<p><strong>Requirements:</strong></p>
<ul>
<li>Schedule one-time tasks at a specific future time</li>
<li>Schedule recurring tasks (cron-like: "every day at 3am", "every 5 minutes")</li>
<li>At-least-once execution guarantee</li>
<li>Handle 10M scheduled tasks, 1M executions per day</li>
<li>Priority-based execution</li>
<li>Retry failed tasks with configurable backoff</li>
<li>Task dependencies (run task B only after task A completes)</li>
<li>Monitoring: execution status, latency, failure rates</li>
</ul>
<p><strong>Discuss: task storage, time-based triggering, worker management, exactly-once challenges, and fault tolerance.</strong></p>`,
    solution: `**Architecture Overview:**

Three main components: (1) Scheduler Service — manages task definitions and triggers, (2) Queue — buffers tasks ready for execution, (3) Worker Fleet — executes tasks.

**1. Task Definition and Storage:**
- **Task schema:**
  - tasks: (task_id, task_type, payload JSON, schedule_type ENUM('one_time','recurring'), execute_at TIMESTAMP, cron_expression, priority, max_retries, retry_backoff_ms, status, created_by, created_at, updated_at)
  - task_executions: (execution_id, task_id, status ENUM('queued','running','succeeded','failed','retrying'), worker_id, started_at, completed_at, error_message, attempt_number)
  - task_dependencies: (task_id, depends_on_task_id)
- **Database:** PostgreSQL. Tasks table is the source of truth.
- For recurring tasks: cron_expression parsed to compute next_execute_at after each execution.

**2. Trigger Service (the clock):**
- A background process that scans for tasks ready to execute.
- **Polling approach:** Every second, query: SELECT * FROM tasks WHERE execute_at <= NOW() AND status = 'pending' ORDER BY priority DESC, execute_at ASC LIMIT 1000.
- For each matched task: update status to 'queued', enqueue to the execution queue.
- **Problem with polling at scale:** Scanning 10M tasks every second is expensive.
- **Optimization — Time-partitioned priority queue:**
  - Use a **Redis sorted set** as a secondary index: key = scheduled_tasks, score = execute_at (Unix timestamp), member = task_id.
  - ZRANGEBYSCORE scheduled_tasks 0 {now} LIMIT 1000 — retrieves tasks due for execution in O(log N + K). Very fast.
  - When a task is triggered: ZREM from the sorted set, enqueue to Kafka/SQS.
  - For recurring tasks: after triggering, compute next_execute_at from cron expression and ZADD back to the sorted set.
- **Multiple trigger instances** for HA. Use distributed locking (Redlock or ZooKeeper) to prevent double-triggering. Only one trigger instance processes a given time window.

**3. Execution Queue:**
- **Kafka or SQS** with priority support.
- Multiple queues by priority: high_priority_queue, normal_queue, low_priority_queue.
- Workers consume from high-priority first (strict priority) or weighted (80% high, 15% normal, 5% low).
- Kafka partitioned by task_type — ensures tasks of the same type can be processed by specialized workers.

**4. Worker Fleet:**
- Stateless worker processes that pull tasks from the queue, execute them, and report results.
- **Execution:**
  1. Worker dequeues a task.
  2. Creates an execution record (status=running, started_at=now).
  3. Executes the task logic (HTTP call, function invocation, script execution — depends on task_type).
  4. On success: update execution status to succeeded. For recurring tasks: compute and schedule next occurrence.
  5. On failure: increment attempt_number. If < max_retries: re-enqueue with delay (exponential backoff). If >= max_retries: mark as permanently failed, alert.
- **Heartbeat:** Long-running tasks send periodic heartbeats. If no heartbeat for 2 minutes, the Scheduler assumes the worker died and re-enqueues the task (at-least-once guarantee).
- **Worker scaling:** Auto-scale based on queue depth. CloudWatch alarm on SQS queue length → trigger ASG scaling.

**5. Task Dependencies (DAG execution):**
- Model dependencies as a directed acyclic graph (DAG).
- When a task completes, check if any downstream tasks have all dependencies met. If so, enqueue them.
- Implementation:
  - task_dependencies table: (task_id, depends_on_task_id).
  - On task completion: SELECT task_id FROM task_dependencies WHERE depends_on_task_id = {completed_task_id}. For each, check if ALL dependencies are completed. If yes, enqueue.
- **Cycle detection:** Validate DAG at task creation time (topological sort check).

**Key Design Decisions:**
- **At-least-once vs exactly-once:** At-least-once is achievable and practical (re-execute on failure/timeout). Exactly-once is extremely hard in distributed systems. Instead, make tasks **idempotent** — executing twice produces the same result as once. Push idempotency responsibility to task authors.
- **Redis sorted set for time-based triggering:** Much faster than polling a SQL table. O(log N) for range queries vs full table scan.
- **Separate scheduler and worker concerns:** Scheduler decides WHEN to run. Workers decide HOW to run. This allows independent scaling and specialization.
- **Lease-based task ownership:** When a worker picks up a task, it acquires a lease (timestamp-based lock). If the lease expires without completion, another worker can pick it up.

**Monitoring and Observability:**
- Dashboard: tasks scheduled vs executed, success/failure rates, average execution time, queue depth, worker utilization.
- Alerting: task failure rate > threshold, queue depth growing (workers can't keep up), task execution time > SLA.
- Store metrics in Prometheus, visualize in Grafana.
- Log every state transition (structured logging → ELK stack).

**Data Storage:**
- Task definitions: PostgreSQL (source of truth), sharded by task_id.
- Time-based index: Redis sorted set (execute_at → task_id).
- Execution queue: Kafka or SQS.
- Execution history: PostgreSQL (recent) + S3 (archived, >30 days).
- Metrics: Prometheus + Grafana.

**Scaling:**
- 10M scheduled tasks: Redis sorted set with 10M members uses ~1GB RAM. ZRANGEBYSCORE is fast even at this scale.
- 1M executions/day ≈ 12 tasks/sec. Even a small worker fleet (10 workers) handles this. Scale to 100+ workers for burst loads.
- PostgreSQL: 1M execution records/day = 365M/year. Partition by month, archive to S3 after 90 days.

**Capacity Estimates:**
- Redis memory: 10M tasks × 100 bytes = 1GB.
- PostgreSQL tasks table: 10M rows × 500 bytes = 5GB.
- Execution history: 1M/day × 500 bytes = 500MB/day = 180GB/year.
- Kafka: 12 tasks/sec × 1KB = 12KB/sec. Trivial throughput.`,
  },
  {
    slug: 'sysdesign-ecommerce',
    title: 'Design an E-Commerce Platform (Amazon-Scale)',
    leetcode_id: -221,
    difficulty: 'Hard',
    category: 'System Design',
    lists: ['System Design'],
    topics: ['System Design', 'Microservices', 'Inventory', 'Checkout'],
    content: `<p><strong>Design an e-commerce platform at Amazon scale.</strong></p>
<p><strong>Requirements:</strong></p>
<ul>
<li>Product catalog with search and browse (100M+ products)</li>
<li>Shopping cart and checkout flow</li>
<li>Inventory management — prevent overselling</li>
<li>Order processing pipeline</li>
<li>Product recommendations ("customers who bought X also bought Y")</li>
<li>Support 500M monthly active users, 10M orders per day</li>
<li>Handle flash sales (Prime Day: 100x normal traffic spike)</li>
<li>99.99% availability for the checkout flow</li>
</ul>
<p><strong>Discuss: microservice decomposition, inventory consistency, checkout flow, search, and handling traffic spikes.</strong></p>`,
    solution: `**Architecture — Microservices:**
At Amazon scale, a monolith is impossible. Decompose into independently deployable services, each owning its data.

**Core Services:**

**1. Product Catalog Service:**
- Stores product information: (product_id, title, description, images, price, category, attributes, seller_id).
- Database: DynamoDB or PostgreSQL sharded by product_id. 100M products × 5KB = 500GB. Fits in a well-sharded DB.
- **Search:** Elasticsearch cluster indexing product title, description, category, attributes. Support faceted search (filter by price range, brand, rating). Full-text search + structured filters.
- **Browse:** Category tree hierarchy. Pre-compute category pages (top products per category) and cache.
- Heavy caching: product details rarely change. Redis/Memcached with 5-minute TTL. CDN for product images.

**2. Shopping Cart Service:**
- Cart is a user's intent to buy, not a commitment. Store in Redis for speed (key: user_id, value: list of {product_id, quantity}).
- Also persist to DynamoDB for durability (guest users need cart recovery after session expires).
- Cart does NOT reserve inventory — it's too early. Only the checkout flow reserves inventory.
- Cart merging: if guest user logs in, merge anonymous cart with their saved cart.

**3. Inventory Service (critical for correctness):**
- Tracks quantity available per product (or per product-warehouse for multi-warehouse).
- Schema: inventory (product_id, warehouse_id, quantity_available, quantity_reserved).
- **Prevent overselling:** On checkout, atomically decrement quantity_available and increment quantity_reserved:
  UPDATE inventory SET quantity_available = quantity_available - :qty, quantity_reserved = quantity_reserved + :qty WHERE product_id = :pid AND quantity_available >= :qty.
  If 0 rows affected → out of stock.
- **Database:** PostgreSQL with row-level locking for atomic updates. For extreme throughput (flash sales), use Redis atomic DECRBY with a floor check. Reconcile Redis with DB periodically.
- **Flash sale optimization:** Pre-load hot product inventory into Redis. All inventory checks go through Redis. Async sync to PostgreSQL. Accept minor risk of slight oversell (1-2 units) that can be corrected later.

**4. Order Service:**
- Manages the order lifecycle: CREATED → PAYMENT_PENDING → PAID → SHIPPING → DELIVERED → COMPLETED / RETURNED.
- **Checkout flow (transaction):**
  1. Validate cart items are still available (inventory check).
  2. Reserve inventory (Inventory Service).
  3. Calculate total (apply coupons, taxes, shipping).
  4. Process payment (Payment Service — see payment system design).
  5. If payment succeeds → create order (status=PAID), confirm inventory reservation.
  6. If payment fails → release inventory reservation.
- **Saga pattern:** The checkout spans multiple services (Inventory, Payment, Order). Use a saga (sequence of local transactions with compensating actions) instead of distributed transactions. If payment fails after inventory was reserved, the compensating action releases the reservation.
- Order DB: PostgreSQL sharded by user_id. Order table + order_items table.

**5. Recommendation Service:**
- **Collaborative filtering:** "Customers who bought X also bought Y." Precompute item-item similarity matrix using purchase history (Spark batch job nightly).
- **Real-time personalization:** Use user's browsing/purchase history as features. Score candidate products with a lightweight ML model (similar to news feed ranking).
- Serve recommendations from a pre-computed cache (Redis: product_id → [recommended_product_ids]).

**6. API Gateway / BFF (Backend for Frontend):**
- Routes requests to appropriate microservices.
- Aggregates responses (product page = Product Service + Review Service + Recommendation Service).
- Rate limiting, authentication, request validation.

**Key Design Decisions:**
- **Eventually consistent product catalog:** Product updates (price changes, new listings) propagate through CDC (Change Data Capture) to Elasticsearch and cache. Slight lag (seconds) is acceptable.
- **Strongly consistent inventory:** Inventory must be accurate to prevent overselling. Use synchronous writes to the inventory DB (or Redis for flash sales with post-reconciliation).
- **Saga over 2PC:** Distributed transactions (2PC) are slow and fragile. Sagas with compensating actions are more resilient to partial failures.
- **Idempotent order creation:** Use a client-generated order_token to prevent double-orders from retried checkout requests.

**Handling Flash Sales (Prime Day):**
- **Pre-scale:** Provision 10x capacity ahead of the event. Warm up caches with expected hot products.
- **Virtual queue:** For extremely popular deals (lightning deals), use a queue system (same as Ticketmaster) to control access.
- **Cache everything:** Product pages, search results, recommendations all served from cache. Only inventory checks and checkouts hit the DB.
- **Graceful degradation:** If recommendation service is overloaded, show static "trending products" instead. Checkout flow is never degraded.
- **Rate limiting:** Protect backend services from excessive load. Priority: checkout > search > browse > recommendations.

**Data Storage:**
- Product catalog: DynamoDB (primary) + Elasticsearch (search) + Redis (cache).
- Cart: Redis + DynamoDB.
- Inventory: PostgreSQL (source of truth) + Redis (hot products).
- Orders: PostgreSQL sharded by user_id.
- Recommendations: Redis (pre-computed).
- Images/media: S3 + CDN.

**Scaling:**
- 500M MAU, 10M orders/day ≈ 115 orders/sec. During Prime Day: 11.5K orders/sec. PostgreSQL sharded across 100 nodes handles this.
- Search: 1B queries/day ≈ 11.5K/sec. Elasticsearch cluster with 50+ nodes.
- Product pages: 10B page views/day ≈ 115K/sec. 95%+ served from cache/CDN.
- Inventory updates: 10M/day + 100M cart-views checking availability = ~1200/sec. Hot products may see 10K checks/sec — Redis handles this.

**Capacity Estimates:**
- Product catalog: 500GB in DynamoDB. 1TB in Elasticsearch (with full-text indexes).
- Orders: 10M/day × 2KB = 20GB/day = 7.3TB/year.
- User carts: 50M active carts × 1KB = 50GB in Redis.`,
  },
  {
    slug: 'sysdesign-cdn',
    title: 'Design a Content Delivery Network (CDN)',
    leetcode_id: -222,
    difficulty: 'Hard',
    category: 'System Design',
    lists: ['System Design'],
    topics: ['System Design', 'Caching', 'Networking', 'DNS'],
    content: `<p><strong>Design a Content Delivery Network (CDN) like CloudFront or Akamai.</strong></p>
<p><strong>Requirements:</strong></p>
<ul>
<li>Serve static content (images, JS, CSS, video segments) with low latency globally</li>
<li>Edge servers in 200+ locations worldwide (Points of Presence / PoPs)</li>
<li>Cache content at the edge, pull from origin on cache miss</li>
<li>Support cache invalidation/purge within 30 seconds globally</li>
<li>Handle 10M requests per second globally</li>
<li>Support HTTPS termination at the edge</li>
<li>DDoS protection</li>
<li>99.99% availability</li>
</ul>
<p><strong>Discuss: DNS-based routing, cache hierarchy, cache invalidation, origin shielding, and DDoS mitigation.</strong></p>`,
    solution: `**Architecture — Three Layers:**

**1. DNS-Based Request Routing (how users reach the nearest edge):**
- Customer configures their domain (static.example.com) as a CNAME pointing to the CDN's domain (d123.cdn.example.net).
- CDN operates an **authoritative DNS** that resolves d123.cdn.example.net to the IP of the optimal edge server for the requesting client.
- **Routing decision factors:**
  - Geographic proximity (GeoDNS): map client's resolver IP to a geographic region → return nearest PoP's IP.
  - Server health: exclude unhealthy PoPs.
  - Load: route away from overloaded PoPs.
  - Latency-based: use real-time latency measurements (anycast probes) to pick the fastest PoP, not just the closest.
- **DNS TTL:** Short (30-60 seconds) to allow quick rerouting on PoP failure.
- **Alternative: Anycast routing.** Announce the same IP from all PoPs via BGP. Network routing naturally directs packets to the nearest PoP. Simpler, but less control over traffic distribution.

**2. Edge Server (PoP) Architecture:**
- Each PoP has multiple edge servers (10-100 depending on traffic volume).
- **Edge server components:**
  - **Reverse proxy (Nginx/Varnish/custom):** Accepts client requests, serves from cache or fetches from origin.
  - **Cache storage:** Hot content in RAM (fastest), warm content on NVMe SSD. Typical edge server: 256GB RAM + 4TB SSD.
  - **TLS termination:** Edge server terminates HTTPS. Customer's TLS certificate stored securely on edge. Reduces latency (TLS handshake with nearby server, not distant origin).
- **Cache logic:**
  1. Client requests GET /images/logo.png.
  2. Edge server checks cache: (a) RAM cache (L1), (b) SSD cache (L2).
  3. **Cache hit:** Return content directly. Latency: 1-5ms.
  4. **Cache miss:** Fetch from the next tier (see cache hierarchy below).

**3. Cache Hierarchy (multi-tier):**
- **L1: Edge cache** (per-server) — RAM + SSD. Fastest. Caches the most popular content.
- **L2: Regional cache (Origin Shield)** — A designated PoP per region that aggregates cache misses from multiple edge PoPs. Before going to origin, edge servers check the regional cache.
  - **Why?** Prevents the origin from being hammered by cache misses from 200 PoPs simultaneously. Even if each PoP has a miss, the regional cache likely has it. Reduces origin load by 10-100x.
- **L3: Origin server** — The customer's server (e.g., S3 bucket, web server). Only hit on regional cache miss.
- **Flow on miss:** Edge L1 miss → Edge L2 (SSD) miss → Regional Cache → Origin.

**Cache Key and Invalidation:**
- **Cache key:** URL + relevant Vary headers (e.g., Accept-Encoding for gzip vs brotli). Optionally include query string, cookies (configurable per customer).
- **TTL-based expiration:** Origin sets Cache-Control headers (max-age, s-maxage). Edge respects these. Default: 24 hours if no header.
- **Purge/Invalidation:**
  - Customer calls purge API: POST /purge { urls: ["/images/logo.png"] }.
  - CDN control plane broadcasts purge command to ALL PoPs (fan-out via a pub/sub system or internal message bus).
  - Each PoP removes the item from cache. Target: complete purge within 30 seconds globally.
  - **Purge by pattern:** Wildcard purges (e.g., /images/*) — more expensive, requires cache scan.
- **Stale-while-revalidate:** Serve stale content while asynchronously fetching fresh content from origin. Reduces cache miss latency at the cost of briefly stale content.

**Key Design Decisions:**
- **Origin shielding is critical.** Without it, a cache miss for a popular resource causes 200 PoPs to simultaneously request from origin (thundering herd). Regional cache consolidates these into one request.
- **Consistent hashing for intra-PoP load balancing.** Within a PoP with 50 edge servers, use consistent hashing on the URL to route requests for the same content to the same server. Maximizes per-server cache hit rate.
- **Negative caching:** Cache 404 responses for a short TTL (e.g., 5 seconds) to prevent repeated origin hits for missing resources.
- **Connection reuse:** Maintain persistent HTTP/2 connections between edge → regional cache → origin. Avoids TCP/TLS handshake overhead on each miss.

**DDoS Protection:**
- **Rate limiting per IP** at the edge. Identify and block abusive IPs.
- **Anycast absorption:** Traffic distributed across all PoPs, so no single location is overwhelmed.
- **Traffic scrubbing:** Detect DDoS patterns (SYN floods, HTTP floods) and apply mitigation rules (e.g., challenge suspicious clients with CAPTCHAs or JS challenges).
- **Over-provisioned capacity:** PoPs have 10x headroom above normal traffic.

**Data Storage:**
- **Cache content:** In-memory (RAM) + local SSD on each edge server. No centralized cache store.
- **Configuration:** Centralized config DB (PostgreSQL) replicated to edge via a config distribution system. Customer routing rules, TLS certs, cache policies.
- **Access logs:** Each edge server writes logs locally → shipped to centralized logging (S3 + Athena for analytics) every minute.
- **Health checks:** Control plane continuously probes all edge servers. Unhealthy servers removed from DNS within 30 seconds.

**Scaling:**
- 10M requests/sec globally ÷ 200 PoPs = 50K requests/sec per PoP average (skewed — major cities handle 500K/sec).
- Each edge server handles ~5-10K requests/sec. A large PoP has 50-100 servers.
- Cache hit rate target: >95% for static content. This means origin sees <500K requests/sec (5% of 10M).
- Adding capacity: deploy more edge servers in a PoP, or add new PoPs in underserved regions.

**Capacity Estimates:**
- Edge server cache: 256GB RAM + 4TB SSD per server. Across 200 PoPs × avg 50 servers = 10,000 servers. Total cache capacity: 2.5PB RAM + 40PB SSD.
- Bandwidth: 10M req/sec × avg 100KB = 1TB/sec aggregate bandwidth. Distributed across 200 PoPs, this is manageable with peering agreements.
- Origin bandwidth (after 95% cache hit): 50K/sec × 100KB = 5GB/sec from origin. This is why origin shielding is essential.`,
  },
  {
    slug: 'sysdesign-monitoring',
    title: 'Design a Metrics/Monitoring System (Datadog/Prometheus)',
    leetcode_id: -223,
    difficulty: 'Hard',
    category: 'System Design',
    lists: ['System Design'],
    topics: ['System Design', 'Time Series', 'Aggregation', 'Alerting'],
    content: `<p><strong>Design a metrics collection and monitoring system like Datadog or Prometheus.</strong></p>
<p><strong>Requirements:</strong></p>
<ul>
<li>Collect metrics from 100K+ hosts (CPU, memory, disk, network, custom app metrics)</li>
<li>Each host reports 100+ metrics every 10 seconds</li>
<li>Store metrics with 10-second resolution for 7 days, 1-minute for 30 days, 1-hour for 1 year</li>
<li>Query: "avg CPU usage for service X in the last hour" with sub-second response</li>
<li>Dashboard visualization with real-time updates</li>
<li>Alerting: trigger alerts when metrics cross thresholds</li>
<li>Support tagging/labeling: host, service, region, environment</li>
<li>Handle 10M data points per second ingestion</li>
</ul>
<p><strong>Discuss: data model, time-series storage, downsampling, query engine, alerting pipeline, and scaling.</strong></p>`,
    solution: `**Architecture Overview:**

Four major subsystems: (1) Collection/Ingestion, (2) Storage, (3) Query Engine, (4) Alerting.

**1. Data Model:**
- A metric data point: (metric_name, tags, timestamp, value).
  - Example: { name: "cpu.usage", tags: {host: "web-01", service: "api", region: "us-east-1"}, timestamp: 1711843200, value: 72.5 }
- A **time series** is a unique combination of metric_name + tag set. Example: cpu.usage{host=web-01, service=api} is one time series.
- With 100K hosts × 100 metrics × ~10 tag combinations = ~100M unique time series. This is the cardinality.

**2. Collection / Ingestion:**
- **Agent-based collection:** A lightweight agent (like Datadog Agent or Prometheus Node Exporter) runs on each host. Collects system metrics (CPU, memory, disk) + custom app metrics.
- **Push vs Pull model:**
  - **Push (Datadog model):** Agent pushes metrics to a central ingestion endpoint every 10 seconds. Simpler for hosts behind firewalls / in ephemeral environments (containers, serverless).
  - **Pull (Prometheus model):** Central server scrapes metrics from each host's /metrics endpoint. Requires network accessibility. Simpler agent, but harder to scale the scraper.
- **Best for large scale: Push model** (scales to 100K+ hosts more easily).
- **Ingestion pipeline:**
  - Agent batches 100+ metrics into a single HTTP POST (compressed with gzip/zstd). Payload: ~5KB per batch.
  - Ingestion service (stateless, behind LB) validates, parses, and writes to a buffer (Kafka topic).
  - Kafka: 10M data points/sec × 100 bytes = 1GB/sec. Partitioned by metric_name hash.

**3. Time-Series Storage:**
- Specialized time-series database (TSDB). Options: InfluxDB, TimescaleDB (PostgreSQL extension), VictoriaMetrics, or custom (like Gorilla/Facebook's in-memory TSDB).
- **Write path:**
  - Consumer reads from Kafka, writes to TSDB in batches.
  - **In-memory buffer:** Batch recent data points (last few minutes) in RAM for fast queries and to amortize disk writes.
  - **Disk storage:** Append-only compressed blocks. Time-series data compresses extremely well because consecutive values are similar (delta encoding, XOR encoding — see Facebook Gorilla paper).
  - Compression ratio: 10-20x. 10M points/sec × 16 bytes/point = 160MB/sec raw → ~10-15MB/sec compressed on disk.
- **Data layout:** Partition by time (each block = 2 hours of data) and by metric/tag (each time series stored contiguously). Enables fast range queries for a single time series.
- **Downsampling (rollup):**
  - Raw data (10-second resolution): retained for 7 days.
  - 1-minute rollup: compute (min, max, avg, count, sum) per minute. Retained for 30 days.
  - 1-hour rollup: retained for 1 year.
  - Downsampling is a background job that processes completed time blocks. Reduces storage by 60x (10s → 1min) and 360x (10s → 1hr).
  - Rollups stored in the same TSDB, tagged with resolution. Query engine automatically selects the appropriate resolution based on the query time range.

**4. Query Engine:**
- **Query language:** PromQL-like. Examples:
  - avg(cpu.usage{service="api", region="us-east-1"}) last 1h — average CPU across all API hosts in us-east-1 over the last hour.
  - rate(http.requests.total{service="api"}[5m]) — request rate per second, computed from the counter over 5-minute windows.
- **Execution:**
  1. Parse query → identify metric name + tag filters + time range + aggregation function.
  2. Look up matching time series IDs from an **inverted index** (tag → set of time_series_ids). Intersection of multiple tag filters using bitmap operations.
  3. Fetch data points for matching time series from TSDB. Select appropriate resolution (10s if last hour, 1min if last day, 1hr if last month).
  4. Apply aggregation (avg, sum, max, percentile) across time series and time windows.
  5. Return result as a time series of (timestamp, value) pairs for charting.
- **Inverted index:** Maps each tag key-value pair to the set of time series that have that tag. Stored in an in-memory data structure (posting lists) or a dedicated index (like Prometheus's head block index). Critical for fast query execution.
- **Query caching:** Cache recent query results in Redis. Dashboard refreshes every 30 seconds — same query repeated. Cache with 15-second TTL.

**5. Alerting Engine:**
- **Alert rules:** Defined by users. Example: "Alert if avg(cpu.usage{service=api}) > 90% for 5 minutes."
- **Evaluation loop:** Every evaluation interval (15-30 seconds), the alerting engine runs all alert rules against the query engine.
- **Alert states:** OK → PENDING (threshold crossed but duration not met) → FIRING (threshold crossed for specified duration) → RESOLVED (metric back to normal).
- **Notification:** When alert fires, send to configured channels: PagerDuty, Slack, email, webhook.
- **Deduplication and grouping:** If 50 hosts trigger the same alert, group into a single notification. Don't spam the on-call engineer.
- **Scaling alert evaluation:** With 100K alert rules evaluated every 15 seconds = 6.7K evaluations/sec. Each evaluation is a query — need a fast query engine. Partition alert rules across multiple evaluator instances.

**Key Design Decisions:**
- **Time-series DB over general-purpose DB.** Time-series data has unique properties (append-only, high write throughput, range queries by time, similar consecutive values). Specialized storage (columnar, delta encoding, XOR compression) is 10-100x more efficient than row-based SQL.
- **Tag-based data model (not hierarchical).** Tags allow flexible querying (filter by any combination of host, service, region). Hierarchical models (host.cpu.usage) require knowing the hierarchy at query time.
- **Downsampling is essential for long-term storage.** Storing 10-second resolution for 1 year = 3.15B points per time series × 100M time series = impossible. Rollups reduce storage by 360x.
- **Pull vs Push trade-off:** Push scales better for large deployments (no single scraper bottleneck). Pull is simpler for small deployments and provides built-in service discovery (scrape targets = known hosts).

**Data Storage:**
- **Hot data (last 2 hours):** In-memory (RAM). 10M pts/sec × 16 bytes × 7200 sec = 1.15TB. Distributed across ~50 storage nodes (23GB each).
- **Warm data (2 hours - 7 days):** SSD-backed TSDB. Compressed: ~1.5TB (after delta/XOR encoding).
- **Cold data (7 days - 1 year, downsampled):** HDD or S3-backed object storage. ~500GB for 1-minute rollups, ~50GB for 1-hour rollups.
- **Inverted index:** In-memory. 100M time series × ~200 bytes metadata = 20GB. Replicated across query nodes.

**Scaling:**
- Ingestion: 10M pts/sec → Kafka (100 partitions, 30 brokers) → 50 storage nodes (200K pts/sec each). Each node has a write-ahead log + in-memory buffer.
- Queries: 1000 dashboard queries/sec (most cached). Query nodes read from local storage + coordinate across storage nodes for distributed queries.
- Alerting: 100K rules / 10 evaluator instances = 10K rules each, evaluated every 15 seconds. Each rule = 1 query. 10K queries per 15 sec = 667 queries/sec per evaluator.

**Capacity Estimates:**
- Daily data volume: 10M pts/sec × 16 bytes × 86400 sec = 13.8TB/day raw. Compressed: ~1TB/day.
- 7-day raw storage: 7TB compressed.
- 30-day 1-min rollup: 10M pts/sec ÷ 6 (aggregated) × 30 days × 16 bytes × compression = ~300GB.
- 1-year 1-hr rollup: ~50GB.
- Total storage: ~10TB for a full year of metrics from 100K hosts. Very manageable with modern hardware.`,
  },
];

export default problems;
