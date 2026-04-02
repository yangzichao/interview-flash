import type { NonAlgoProblem } from './seed-data-non-algo.js';

const behavioralExtra: NonAlgoProblem[] = [
  // ============================================================
  // BEHAVIORAL — EXTENDED SET
  // ============================================================

  // -9: Giving / Receiving Feedback
  {
    slug: 'behavioral-giving-receiving-feedback',
    title: 'Giving or Receiving Difficult Feedback',
    leetcode_id: -9,
    difficulty: 'Medium',
    category: 'Behavioral',
    lists: ['Behavioral'],
    topics: ['Communication', 'Feedback', 'Growth Mindset'],
    content: `<p><strong>The Question:</strong> "Tell me about a time you had to give difficult feedback to a colleague — or received feedback that was hard to hear. How did you handle it?"</p>
<p><strong>What the interviewer is looking for:</strong></p>
<ul>
<li>Emotional maturity and self-awareness</li>
<li>Ability to deliver constructive criticism without damaging relationships</li>
<li>Openness to receiving feedback and acting on it</li>
<li>Concrete behavioral change that resulted from the feedback</li>
</ul>
<p><strong>Guidelines:</strong></p>
<ul>
<li>Pick a specific, real instance — avoid generic platitudes</li>
<li>If you chose "giving feedback," demonstrate empathy and directness in balance</li>
<li>If you chose "receiving feedback," show that you didn't become defensive</li>
<li>Explain the outcome — did the relationship or work improve?</li>
</ul>`,
    solution: `**Framework:** STAR with emphasis on the conversation itself
**Key Elements:**
1. **Context:** What was the feedback about? A code quality issue, a communication pattern, a missed commitment? Set the scene briefly.
2. **Your approach to the conversation:** If giving — how did you prepare? Did you use specific examples, choose a private setting, lead with curiosity? If receiving — how did you manage your initial emotional reaction?
3. **The actual exchange:** Walk through how the conversation went. Show that you listened actively, asked clarifying questions, and stayed professional.
4. **Outcome:** What changed? Did the person improve? Did YOU improve? Was the working relationship strengthened?
5. **Reflection:** What did you learn about giving/receiving feedback that you still apply today?

**What makes it strong:**
- Shows both courage (willingness to have the hard conversation) and empathy (care for the other person)
- Specific behavioral change, not just "they took it well"
- Demonstrates a growth mindset — you see feedback as a gift, not an attack
- Maintains respect for the other person throughout the story

**Common mistakes:**
- Making it sound like you lectured someone and they thanked you
- Glossing over the difficulty — if it was easy, it's not a good example
- Not showing any personal vulnerability when discussing received feedback
- Choosing feedback about a trivial issue`,
  },

  // -10: Mentoring Juniors
  {
    slug: 'behavioral-mentoring-juniors',
    title: 'Mentoring a Junior Engineer',
    leetcode_id: -10,
    difficulty: 'Medium',
    category: 'Behavioral',
    lists: ['Behavioral'],
    topics: ['Mentorship', 'Leadership', 'Teaching'],
    content: `<p><strong>The Question:</strong> "Tell me about a time you mentored or coached a less experienced engineer. What was your approach and what was the outcome?"</p>
<p><strong>What the interviewer is looking for:</strong></p>
<ul>
<li>Ability to teach and grow others — a key senior/staff-level signal</li>
<li>Patience and adaptability in your communication style</li>
<li>Balancing teaching with letting them struggle productively</li>
<li>Evidence of multiplying your impact through others</li>
</ul>
<p><strong>Guidelines:</strong></p>
<ul>
<li>Show your mentoring philosophy, not just "I helped them with a bug"</li>
<li>Describe how you adapted your approach to their learning style</li>
<li>Highlight the mentee's growth as the outcome, not your own cleverness</li>
<li>At FAANG-level, this maps directly to "raises the bar" / "develops others" competencies</li>
</ul>`,
    solution: `**Framework:** Context → Your Approach → Challenges → Growth
**Key Elements:**
1. **Who and why:** Describe the mentee and the situation — new hire onboarding, intern project, someone struggling with a specific skill.
2. **Your intentional approach:**
   - Did you set regular 1:1s or pairing sessions?
   - Did you give them progressively harder tasks?
   - Did you create space for them to fail safely and learn from it?
3. **A specific challenge you navigated:** Maybe they were stuck and you resisted the urge to just give the answer. Maybe they lacked confidence and you helped them present their work.
4. **The mentee's growth:** Be specific — "They went from needing code review hand-holding to independently owning and shipping features within 3 months."
5. **What YOU learned:** Good mentoring stories show you also grew.

**What makes it strong:**
- Shows you invest in others, not just your own output
- Demonstrates teaching skill — breaking down complex concepts, meeting them where they are
- The mentee's success is clearly linked to your investment
- Shows you know when to step in vs. let them struggle

**Common mistakes:**
- Making it about how smart you are
- Only describing technical help, not professional development
- Not showing specific growth in the mentee
- Describing a single code review, not a sustained investment`,
  },

  // -11: Cross-Team Collaboration
  {
    slug: 'behavioral-cross-team-collaboration',
    title: 'Cross-Team Collaboration',
    leetcode_id: -11,
    difficulty: 'Hard',
    category: 'Behavioral',
    lists: ['Behavioral'],
    topics: ['Collaboration', 'Communication', 'Stakeholder Management'],
    content: `<p><strong>The Question:</strong> "Tell me about a time you had to work closely with another team to deliver a project. How did you manage the collaboration?"</p>
<p><strong>What the interviewer is looking for:</strong></p>
<ul>
<li>Ability to navigate different team cultures, priorities, and timelines</li>
<li>Communication skills across organizational boundaries</li>
<li>Dealing with misaligned incentives or competing priorities</li>
<li>Driving results when you don't control all the resources</li>
</ul>
<p><strong>Guidelines:</strong></p>
<ul>
<li>Pick a project that required genuine dependency on another team, not just a one-off request</li>
<li>Show how you proactively managed the relationship, not just waited for blockers</li>
<li>Demonstrate understanding of the other team's constraints and priorities</li>
<li>This question is especially important at staff+ levels, where cross-team work is the norm</li>
</ul>`,
    solution: `**Framework:** STAR with emphasis on communication and alignment
**Key Elements:**
1. **The dependency:** Why did you need the other team? What did each team own?
2. **Challenges you anticipated or encountered:**
   - Different priorities or timelines
   - Unclear ownership of shared components
   - Communication overhead or timezone differences
3. **Your tactics for effective collaboration:**
   - Set up a shared Slack channel, regular sync meetings, or a joint project doc
   - Defined clear interfaces and contracts early (APIs, data formats, SLAs)
   - Built personal relationships with key people on the other team
   - Escalated proactively when timelines slipped
4. **How you handled friction:** When priorities conflicted, how did you find common ground? Did you help the other team see mutual benefit?
5. **The result:** Shipped on time? Established a reusable collaboration pattern?

**What makes it strong:**
- Shows proactive communication, not reactive firefighting
- Demonstrates empathy for the other team's priorities
- Uses specific tactics (shared docs, defined APIs, escalation paths)
- Result benefits both teams, not just yours

**Common mistakes:**
- Describing the other team as an obstacle you overcame
- Not showing what YOU specifically did to facilitate
- Ignoring the relationship aspect — this isn't just project management
- Choosing a trivial collaboration (e.g., "I asked them to review my PR")`,
  },

  // -12: Ambiguity / Unclear Requirements
  {
    slug: 'behavioral-ambiguity-unclear-requirements',
    title: 'Working with Ambiguous Requirements',
    leetcode_id: -12,
    difficulty: 'Hard',
    category: 'Behavioral',
    lists: ['Behavioral'],
    topics: ['Ambiguity', 'Problem Solving', 'Initiative'],
    content: `<p><strong>The Question:</strong> "Tell me about a time you had to work on a project with unclear or ambiguous requirements. How did you handle it?"</p>
<p><strong>What the interviewer is looking for:</strong></p>
<ul>
<li>Comfort with ambiguity — a critical signal for senior roles</li>
<li>Ability to break down vague problems into actionable steps</li>
<li>Initiative to seek clarity rather than waiting for instructions</li>
<li>Judgment about when you have "enough" information to start</li>
</ul>
<p><strong>Guidelines:</strong></p>
<ul>
<li>This is one of the most important questions at Amazon (Bias for Action, Dive Deep) and Google (navigating ambiguity)</li>
<li>Show that you are comfortable making progress without perfect information</li>
<li>Demonstrate a structured approach to reducing uncertainty</li>
<li>Highlight the balance between analysis and action — you can't research forever</li>
</ul>`,
    solution: `**Framework:** Ambiguity → Clarification Strategy → Incremental Progress → Outcome
**Key Elements:**
1. **The ambiguity:** What was unclear — the goal, the scope, the technical approach, or the success criteria? Why was it ambiguous (new domain, new team, greenfield project)?
2. **How you sought clarity:**
   - Talked to stakeholders to understand the underlying problem, not just the stated request
   - Studied existing data, user behavior, or competitor products
   - Wrote a short proposal or RFC to make assumptions explicit and get feedback
3. **How you made progress despite ambiguity:**
   - Built a prototype or MVP to validate assumptions quickly
   - Broke the problem into smaller, less ambiguous pieces
   - Made explicit decisions about what you were NOT going to do
4. **How you communicated uncertainty:** Did you share your assumptions, flag risks, and create checkpoints to reassess?
5. **The outcome:** Did your approach prove correct? Did you have to pivot? Either is fine — show that your process was sound.

**What makes it strong:**
- Demonstrates structured thinking in unstructured situations
- Shows initiative — you drove clarity, not waited for it
- Balances speed with diligence
- Communicates assumptions and uncertainties transparently

**Common mistakes:**
- Saying "I just figured it out" without explaining HOW
- Waiting for someone else to provide requirements
- Over-engineering a plan before validating basic assumptions
- Not acknowledging the risks you were taking`,
  },

  // -13: Saying No / Pushing Back
  {
    slug: 'behavioral-saying-no-pushing-back',
    title: 'Saying No or Pushing Back',
    leetcode_id: -13,
    difficulty: 'Hard',
    category: 'Behavioral',
    lists: ['Behavioral'],
    topics: ['Communication', 'Judgment', 'Courage'],
    content: `<p><strong>The Question:</strong> "Tell me about a time you had to push back on a request from a manager, product partner, or senior stakeholder. How did you handle it?"</p>
<p><strong>What the interviewer is looking for:</strong></p>
<ul>
<li>Intellectual courage — willingness to disagree when it matters</li>
<li>Judgment — knowing WHEN to push back (not everything is worth fighting)</li>
<li>Professionalism — how you disagree without burning bridges</li>
<li>Outcome — did your pushback improve the decision?</li>
</ul>
<p><strong>Guidelines:</strong></p>
<ul>
<li>This maps to Amazon's "Have Backbone; Disagree and Commit" leadership principle</li>
<li>Show that you push back with data and alternatives, not just opinions</li>
<li>Be prepared to discuss a time you pushed back AND a time you committed after disagreeing</li>
<li>Demonstrate respect for the other person throughout</li>
</ul>`,
    solution: `**Framework:** STAR with emphasis on HOW you pushed back
**Key Elements:**
1. **The request you disagreed with:** What was being asked? Why did you believe it was the wrong approach? Be specific about the risks or costs you foresaw.
2. **Why you chose to push back (vs. just going along):** Was it a reversible vs. irreversible decision? Were there significant engineering, user, or business risks?
3. **How you pushed back:**
   - Led with data, not just intuition — "I analyzed X and found Y"
   - Proposed alternatives — "Instead of A, I suggest B because..."
   - Framed it around shared goals — "We both want Z, and I think this approach risks that"
   - Chose the right forum (1:1 vs. group) and the right tone
4. **The resolution:** Did they change course? Did you compromise? Did you disagree and commit?
5. **What happened:** Was your pushback vindicated? What did you learn about influence?

**What makes it strong:**
- Shows courage paired with professionalism
- Uses data and alternatives, not just "I don't think we should"
- Demonstrates judgment about which battles to pick
- Shows the ability to commit even after disagreeing (if that's how it went)

**Common mistakes:**
- Making the stakeholder look foolish or uninformed
- Framing yourself as the hero who saved the day
- Choosing a trivial example ("I pushed back on the color of a button")
- Not showing the resolution or what you learned`,
  },

  // -14: Technical Debt Decisions
  {
    slug: 'behavioral-technical-debt-decisions',
    title: 'Technical Debt Decisions',
    leetcode_id: -14,
    difficulty: 'Hard',
    category: 'Behavioral',
    lists: ['Behavioral'],
    topics: ['Technical Judgment', 'Trade-offs', 'Long-term Thinking'],
    content: `<p><strong>The Question:</strong> "Tell me about a time you had to make a decision about taking on technical debt. How did you approach it?"</p>
<p><strong>What the interviewer is looking for:</strong></p>
<ul>
<li>Mature understanding of tech debt as a strategic tool, not inherently bad</li>
<li>Ability to articulate trade-offs between speed and sustainability</li>
<li>Communication with non-technical stakeholders about technical trade-offs</li>
<li>Follow-through on paying down the debt</li>
</ul>
<p><strong>Guidelines:</strong></p>
<ul>
<li>Tech debt is sometimes the RIGHT choice — show nuance, not dogma</li>
<li>Explain the decision framework you used, not just the outcome</li>
<li>Describe how you communicated the trade-off to product or business partners</li>
<li>If you paid down the debt later, explain how you prioritized it</li>
</ul>`,
    solution: `**Framework:** Context → Trade-off Analysis → Decision → Follow-through
**Key Elements:**
1. **The situation:** What was the pressure — a launch date, a scaling emergency, a pivot? Why was the "clean" solution not feasible right now?
2. **The trade-off you identified:**
   - What was the cost of doing it "right" now? (time, opportunity cost)
   - What was the cost of the shortcut? (maintenance burden, future risk, team velocity)
   - Was the debt localized (easy to pay down later) or structural (compounds over time)?
3. **How you decided:** Did you quantify the trade-off? Discuss with the team? Create a follow-up ticket with a concrete plan?
4. **How you communicated it:** Did product/business stakeholders understand what they were trading? Did you frame it in their language (risk, timeline, cost)?
5. **The follow-through:** Did you actually pay down the debt? How did you prioritize it against new feature work?

**What makes it strong:**
- Shows pragmatism, not perfectionism
- Explicitly names the trade-offs rather than hand-waving
- Includes communication with non-engineers
- Demonstrates follow-through — the debt didn't become permanent

**Common mistakes:**
- Treating all tech debt as bad — sometimes it's the right call
- Not having a plan to pay it down
- Choosing an example where you just shipped sloppy code under pressure
- Not showing how you communicated the trade-off to stakeholders`,
  },

  // -15: Shipping vs Perfection Trade-offs
  {
    slug: 'behavioral-shipping-vs-perfection',
    title: 'Shipping vs. Perfection',
    leetcode_id: -15,
    difficulty: 'Medium',
    category: 'Behavioral',
    lists: ['Behavioral'],
    topics: ['Pragmatism', 'Delivery', 'Trade-offs'],
    content: `<p><strong>The Question:</strong> "Tell me about a time you had to choose between shipping something imperfect or delaying to make it better. What did you do?"</p>
<p><strong>What the interviewer is looking for:</strong></p>
<ul>
<li>Pragmatic judgment — knowing when "good enough" is actually good enough</li>
<li>Understanding of what "quality" means in context (not always the most polished code)</li>
<li>Ability to scope and cut without compromising core value</li>
<li>Awareness of diminishing returns on perfectionism</li>
</ul>
<p><strong>Guidelines:</strong></p>
<ul>
<li>This is NOT about cutting corners — it's about smart scoping</li>
<li>Show you understand the difference between essential quality (correctness, security) and nice-to-haves (perfect UI, full edge-case coverage)</li>
<li>Demonstrate how you decided what to cut and what to keep</li>
<li>The best answers show you iterated after shipping</li>
</ul>`,
    solution: `**Framework:** STAR with emphasis on scoping decisions
**Key Elements:**
1. **The tension:** What was the full vision vs. what was achievable in the timeline? Why couldn't you do both?
2. **How you decided what to ship:**
   - Identified the core value proposition — what is the minimum that delivers user value?
   - Separated "must-have" from "nice-to-have" features
   - Assessed risk: what could go wrong with the imperfect version?
3. **Stakeholder alignment:** How did you communicate the reduced scope? Did product/design agree?
4. **What you shipped:** Describe the v1 and its known limitations.
5. **The iteration:** How did you improve it after launch? Did user feedback validate your scoping decisions?

**What makes it strong:**
- Shows mature product sense, not just engineering ego
- Defines "quality" in terms of user impact, not code elegance
- Demonstrates iterative delivery mindset
- Includes concrete criteria for the cut line

**Common mistakes:**
- Making it sound like you just shipped bad code
- Not explaining the reasoning behind what you cut
- Choosing an example where the answer was obviously "just ship it"
- Not showing the follow-up iteration`,
  },

  // -16: Handling Multiple Priorities
  {
    slug: 'behavioral-handling-multiple-priorities',
    title: 'Handling Multiple Competing Priorities',
    leetcode_id: -16,
    difficulty: 'Medium',
    category: 'Behavioral',
    lists: ['Behavioral'],
    topics: ['Prioritization', 'Time Management', 'Communication'],
    content: `<p><strong>The Question:</strong> "Tell me about a time you had multiple important tasks or projects competing for your time. How did you prioritize?"</p>
<p><strong>What the interviewer is looking for:</strong></p>
<ul>
<li>A systematic approach to prioritization, not just "working harder"</li>
<li>Communication with stakeholders about timeline impacts</li>
<li>Ability to say no or defer things explicitly</li>
<li>Staying effective under load without burning out</li>
</ul>
<p><strong>Guidelines:</strong></p>
<ul>
<li>The strongest answers show a framework (impact vs. urgency, ICE scoring, etc.), not just instinct</li>
<li>Show that you proactively communicated rather than silently dropping things</li>
<li>Demonstrate that you made conscious trade-offs, not reactive task-switching</li>
<li>Avoid "I just worked nights and weekends" — that's not a sustainable strategy</li>
</ul>`,
    solution: `**Framework:** STAR with emphasis on the prioritization process
**Key Elements:**
1. **The competing demands:** What were the 2-3+ things on your plate? Why were they all "important"?
2. **Your prioritization framework:**
   - Impact: Which task had the highest business/user impact?
   - Urgency: What had a hard deadline vs. flexible timeline?
   - Dependencies: Was anyone blocked waiting on you?
   - Effort: Could you make quick progress on one to unblock it?
3. **Communication:** How did you proactively tell stakeholders about timeline changes? Did you renegotiate deadlines or scope?
4. **Delegation or help-seeking:** Did you identify work that could be delegated or shared?
5. **The outcome:** What got delivered? Were stakeholders satisfied with the trade-offs?

**What makes it strong:**
- Shows a repeatable prioritization process
- Proactive communication with all stakeholders
- Willingness to make hard trade-offs rather than trying to do everything
- Doesn't rely on heroics (working 80-hour weeks)

**Common mistakes:**
- "I just worked really hard and did everything" (not credible)
- Not explaining WHY you prioritized one thing over another
- Silently missing deadlines rather than communicating early
- Not showing the stakeholder communication aspect`,
  },

  // -17: Adapting to Change
  {
    slug: 'behavioral-adapting-to-change',
    title: 'Adapting to a Major Change',
    leetcode_id: -17,
    difficulty: 'Medium',
    category: 'Behavioral',
    lists: ['Behavioral'],
    topics: ['Adaptability', 'Resilience', 'Growth Mindset'],
    content: `<p><strong>The Question:</strong> "Tell me about a time your project or team went through a major change — a pivot, reorg, technology shift, or strategy change. How did you adapt?"</p>
<p><strong>What the interviewer is looking for:</strong></p>
<ul>
<li>Flexibility and openness to change</li>
<li>Ability to stay productive and positive during uncertainty</li>
<li>How you helped others through the transition</li>
<li>Whether you saw change as a threat or an opportunity</li>
</ul>
<p><strong>Guidelines:</strong></p>
<ul>
<li>Pick a change that was genuinely disruptive, not a minor process tweak</li>
<li>Show your emotional response honestly — it's okay to say it was hard at first</li>
<li>Highlight what you DID, not just how you felt</li>
<li>Bonus if you helped the team or organization adapt, not just yourself</li>
</ul>`,
    solution: `**Framework:** Change → Reaction → Adaptation → Outcome
**Key Elements:**
1. **The change:** What happened? A product pivot, a reorg, a tech stack migration, a leadership change? Explain why it was significant and disruptive.
2. **Your honest initial reaction:** It's okay to say you were frustrated, anxious, or skeptical. Authenticity matters. But show that you moved past it quickly.
3. **How you adapted:**
   - Sought to understand the WHY behind the change
   - Identified what you could control vs. what you couldn't
   - Upskilled quickly if the change required new technology or processes
   - Offered to help lead the transition
4. **How you helped others:** Did you mentor teammates through the change? Volunteer for the transition work nobody wanted? Maintain team morale?
5. **The result:** What was your personal outcome? What was the team outcome? In retrospect, was the change positive?

**What makes it strong:**
- Shows emotional intelligence — acknowledges difficulty without wallowing
- Demonstrates agency — you shaped the outcome rather than being a victim
- Helped others adapt, not just yourself
- Can articulate what you learned about navigating change

**Common mistakes:**
- Saying you were perfectly fine with it (unrealistic)
- Complaining about the change or those who made it
- Not showing specific actions you took
- Choosing a change that didn't actually affect you much`,
  },

  // -18: Customer/User Empathy
  {
    slug: 'behavioral-customer-user-empathy',
    title: 'Customer or User Empathy',
    leetcode_id: -18,
    difficulty: 'Medium',
    category: 'Behavioral',
    lists: ['Behavioral'],
    topics: ['User Focus', 'Product Sense', 'Empathy'],
    content: `<p><strong>The Question:</strong> "Tell me about a time you advocated for the user or customer, especially when it meant pushing back on a technical or business decision."</p>
<p><strong>What the interviewer is looking for:</strong></p>
<ul>
<li>Customer obsession — a top Amazon LP and critical at every FAANG company</li>
<li>Willingness to challenge internal convenience for user benefit</li>
<li>Ability to bridge the gap between technical implementation and user experience</li>
<li>Product thinking from an engineer</li>
</ul>
<p><strong>Guidelines:</strong></p>
<ul>
<li>Show that you think beyond the code to the human using your product</li>
<li>Describe how you gathered user signal (data, feedback, support tickets, your own usage)</li>
<li>Demonstrate that you took action, not just had an opinion</li>
<li>The best examples involve trade-offs — advocating for users sometimes means more engineering work</li>
</ul>`,
    solution: `**Framework:** User Signal → Insight → Advocacy → Impact
**Key Elements:**
1. **How you identified the user problem:** Did you notice it yourself? See it in data? Read support tickets? Talk to actual users?
2. **The insight:** What was the gap between what users needed and what was being built or proposed?
3. **Your advocacy:**
   - How you made the case internally — data, user stories, prototypes, demos
   - Who you had to convince — product, design, leadership, fellow engineers
   - How you framed it in terms they cared about (retention, NPS, revenue, not just "it's the right thing")
4. **The trade-off you navigated:** What was the cost of doing it the user-friendly way? More engineering time? A delayed launch?
5. **The result:** Did users benefit? Can you show the impact in metrics?

**What makes it strong:**
- Shows genuine empathy, not performative user concern
- Backed by data or direct user signal, not just assumptions
- Willing to do more work or push a deadline for user benefit
- Measurable impact on user experience

**Common mistakes:**
- Vague claims about caring about users without specific actions
- Not showing the trade-off — if there's no cost, it's not a meaningful advocacy
- Making it about technical elegance dressed up as user empathy
- Not quantifying the user impact`,
  },

  // -19: Owning a Mistake That Affected the Team
  {
    slug: 'behavioral-owning-a-mistake',
    title: 'Owning a Mistake That Affected the Team',
    leetcode_id: -19,
    difficulty: 'Hard',
    category: 'Behavioral',
    lists: ['Behavioral'],
    topics: ['Accountability', 'Integrity', 'Trust'],
    content: `<p><strong>The Question:</strong> "Tell me about a time you made a mistake that affected your team or a broader group. How did you handle it?"</p>
<p><strong>What the interviewer is looking for:</strong></p>
<ul>
<li>Accountability — owning it fully, not deflecting</li>
<li>Speed of response — how quickly did you move to fix it?</li>
<li>Transparency — did you communicate proactively or hope nobody noticed?</li>
<li>Systemic prevention — what did you put in place so it doesn't happen again?</li>
</ul>
<p><strong>Guidelines:</strong></p>
<ul>
<li>This is similar to "tell me about a failure" but specifically tests accountability and impact on others</li>
<li>Pick a mistake with real consequences — a bad deploy, a wrong architectural call, a miscommunication that caused rework</li>
<li>The focus should be on your RESPONSE to the mistake, not just the mistake itself</li>
<li>Interviewers want to see blameless postmortem thinking</li>
</ul>`,
    solution: `**Framework:** Mistake → Immediate Response → Root Cause → Prevention
**Key Elements:**
1. **The mistake:** Be specific and own it. "I pushed a config change without adequate testing and it caused 45 minutes of downtime for 10K users."
2. **Your immediate response:**
   - How quickly did you identify and acknowledge it?
   - Did you proactively tell your team/manager, or wait until someone noticed?
   - What did you do to mitigate the impact?
3. **Taking accountability:** Show that you didn't hide behind process, blame the review system, or deflect to others.
4. **Root cause analysis:** Go beyond "I should have been more careful." What systemic factor contributed? Lack of test coverage? No canary deploy? Insufficient documentation?
5. **Prevention:** What concrete changes did you implement? New tests, better CI/CD, a checklist, a process change?

**What makes it strong:**
- Full, unqualified ownership — "I made this mistake"
- Fast, transparent communication
- Systemic thinking — fixing the process, not just promising to try harder
- The prevention measures actually got implemented

**Common mistakes:**
- Minimizing the mistake or its impact
- Blaming the system instead of owning your part
- Promising to "be more careful" without systemic fixes
- Choosing a mistake that was really someone else's fault`,
  },

  // -20: Persuading Skeptics
  {
    slug: 'behavioral-persuading-skeptics',
    title: 'Persuading Skeptics of a Technical Idea',
    leetcode_id: -20,
    difficulty: 'Hard',
    category: 'Behavioral',
    lists: ['Behavioral'],
    topics: ['Influence', 'Communication', 'Technical Vision'],
    content: `<p><strong>The Question:</strong> "Tell me about a time you had to convince others to adopt a technical approach or idea they were initially skeptical about."</p>
<p><strong>What the interviewer is looking for:</strong></p>
<ul>
<li>Ability to influence without authority through evidence and communication</li>
<li>Patience and persistence — real influence takes time</li>
<li>Willingness to listen to and address counterarguments</li>
<li>Technical depth to back up your conviction</li>
</ul>
<p><strong>Guidelines:</strong></p>
<ul>
<li>This differs from "leadership" — it's specifically about overcoming resistance to a technical idea</li>
<li>Show that you genuinely engaged with the skeptics' concerns rather than steamrolling</li>
<li>Data, prototypes, and small experiments are stronger than arguments</li>
<li>The best answers show you incorporated feedback and your idea got better because of the skepticism</li>
</ul>`,
    solution: `**Framework:** Idea → Resistance → Persuasion Strategy → Outcome
**Key Elements:**
1. **Your idea and its merits:** What were you proposing? A new framework? A different architecture? A process change? Why did you believe in it?
2. **The resistance:** Why were people skeptical? Migration cost? Risk? "It's not broken, why fix it?" Understand and articulate their concerns fairly.
3. **Your persuasion approach:**
   - **Data:** Ran benchmarks, analyzed production metrics, or cited case studies
   - **Prototype:** Built a small proof-of-concept that demonstrated the benefit
   - **Incremental adoption:** Proposed a low-risk pilot instead of a big-bang migration
   - **Coalition building:** Found early adopters who could champion it with you
   - **Addressing concerns directly:** Modified your proposal to mitigate the specific risks people raised
4. **The evolution of your idea:** Show that skeptics' feedback made the idea BETTER — this is a sign of mature engineering.
5. **The outcome:** Was it adopted? What was the measurable impact?

**What makes it strong:**
- Shows "strong opinions, loosely held" — conviction + openness
- Uses evidence over arguments
- Incorporates feedback, doesn't just overcome objections
- Demonstrates patience — real influence is rarely instant

**Common mistakes:**
- Framing skeptics as obstacles rather than valuable feedback sources
- Winning the argument but losing the relationship
- Not showing that you genuinely considered alternative viewpoints
- Choosing an example where you were just obviously right and everyone else was wrong`,
  },

  // -21: Going Above and Beyond
  {
    slug: 'behavioral-going-above-and-beyond',
    title: 'Going Above and Beyond',
    leetcode_id: -21,
    difficulty: 'Easy',
    category: 'Behavioral',
    lists: ['Behavioral'],
    topics: ['Initiative', 'Ownership', 'Impact'],
    content: `<p><strong>The Question:</strong> "Tell me about a time you went above and beyond what was expected of you."</p>
<p><strong>What the interviewer is looking for:</strong></p>
<ul>
<li>Intrinsic motivation and ownership mentality</li>
<li>Ability to see opportunities beyond your immediate tasks</li>
<li>Initiative — doing things that need to be done without being asked</li>
<li>Impact that resulted from your extra effort</li>
</ul>
<p><strong>Guidelines:</strong></p>
<ul>
<li>This is NOT about working overtime — it's about exceeding expectations in scope or quality</li>
<li>The best examples show you identified a need nobody else was addressing</li>
<li>Show that your "above and beyond" had clear impact, not just activity</li>
<li>This maps to Amazon's "Ownership" and "Bias for Action" principles</li>
</ul>`,
    solution: `**Framework:** STAR with emphasis on WHY you chose to do more
**Key Elements:**
1. **The baseline expectation:** What were you supposed to deliver?
2. **What you noticed:** What additional opportunity or problem did you see that was outside your scope? Why did it matter?
3. **What you did:**
   - Did you build a tool that helped the whole team?
   - Did you write documentation that didn't exist?
   - Did you fix a systemic issue while working on a specific bug?
   - Did you reach out to a customer to understand their problem deeply?
4. **Why you chose to go further:** What motivated you? Genuine care for the product, the team, or the users.
5. **The impact:** How did your extra effort benefit others? Quantify if possible.

**What makes it strong:**
- The "extra" work had outsized impact relative to effort
- Shows ownership thinking — "not my job" isn't in your vocabulary
- Motivated by genuine care, not just seeking recognition
- Others benefited, not just you

**Common mistakes:**
- Conflating "above and beyond" with "worked overtime"
- Choosing something your manager explicitly asked you to do
- Not showing the impact of the extra work
- Making it sound like you have no boundaries (see burnout question)`,
  },

  // -22: Dealing with a Difficult Stakeholder
  {
    slug: 'behavioral-difficult-stakeholder',
    title: 'Dealing with a Difficult Stakeholder',
    leetcode_id: -22,
    difficulty: 'Hard',
    category: 'Behavioral',
    lists: ['Behavioral'],
    topics: ['Stakeholder Management', 'Communication', 'Emotional Intelligence'],
    content: `<p><strong>The Question:</strong> "Tell me about a time you had to work with a difficult stakeholder — someone who was demanding, unclear, or hard to work with. How did you manage the relationship?"</p>
<p><strong>What the interviewer is looking for:</strong></p>
<ul>
<li>Emotional intelligence in a professional context</li>
<li>Ability to manage up and across without burning bridges</li>
<li>Finding productive working patterns even with difficult people</li>
<li>Maintaining professionalism while protecting your team's capacity</li>
</ul>
<p><strong>Guidelines:</strong></p>
<ul>
<li>Never trash-talk the stakeholder — show empathy for their position</li>
<li>Focus on the BEHAVIORS that were difficult, not the person's character</li>
<li>Show how you adapted your communication style to work with them</li>
<li>The best answers show the relationship improved, not just that you survived it</li>
</ul>`,
    solution: `**Framework:** STAR with emphasis on relationship management
**Key Elements:**
1. **The situation:** Who was the stakeholder and what made them difficult? Be respectful — describe behaviors, not character. "They frequently changed requirements mid-sprint" not "They were annoying and unreasonable."
2. **Your diagnosis:** Why were they behaving that way? Were they under pressure from their leadership? Did they not trust engineering to deliver? Were they unfamiliar with how software development works?
3. **Your approach:**
   - Invested in understanding their actual goals and pressures
   - Adapted your communication frequency and style (e.g., more frequent updates for an anxious stakeholder)
   - Set clear expectations and documented agreements
   - Found a format that worked (e.g., weekly demos instead of written updates)
   - Built personal rapport beyond transactional interactions
4. **Boundary setting:** How did you protect your team from unreasonable demands while maintaining the relationship?
5. **The result:** Did the relationship improve? Did you find a productive working pattern? Was there mutual respect?

**What makes it strong:**
- Shows empathy — tries to understand the stakeholder's perspective
- Adapts communication style rather than expecting them to change
- Sets boundaries professionally
- The relationship genuinely improved, not just "I dealt with it"

**Common mistakes:**
- Bad-mouthing the stakeholder
- Positioning yourself as the victim
- Not showing what YOU changed about your approach
- Implying difficult stakeholders are always wrong (sometimes they have valid concerns)`,
  },

  // -23: Working with Someone You Disagree With Fundamentally
  {
    slug: 'behavioral-fundamental-disagreement',
    title: 'Working with Someone You Fundamentally Disagree With',
    leetcode_id: -23,
    difficulty: 'Hard',
    category: 'Behavioral',
    lists: ['Behavioral'],
    topics: ['Teamwork', 'Professional Maturity', 'Conflict Resolution'],
    content: `<p><strong>The Question:</strong> "Tell me about a time you had to work closely with someone whose approach or working style was fundamentally different from yours. How did you make it work?"</p>
<p><strong>What the interviewer is looking for:</strong></p>
<ul>
<li>Professional maturity — can you work productively with anyone?</li>
<li>Self-awareness about your own style and preferences</li>
<li>Ability to find value in different perspectives</li>
<li>Focus on outcomes over personal comfort</li>
</ul>
<p><strong>Guidelines:</strong></p>
<ul>
<li>This goes deeper than a one-time disagreement — it's about sustained collaboration with someone who thinks differently</li>
<li>Examples: a "move fast" person paired with a "measure twice" person; different communication styles; different quality bars</li>
<li>Show genuine effort to understand and adapt, not just tolerate</li>
<li>The best answers show you learned something valuable from the difference</li>
</ul>`,
    solution: `**Framework:** Difference → Understanding → Adaptation → Value
**Key Elements:**
1. **The difference:** What was fundamentally different about your approaches? Be specific and non-judgmental. "I prefer to plan thoroughly before coding; they prefer to prototype rapidly and iterate."
2. **The friction it caused:** How did this difference create real problems? Missed deadlines? Code quality issues? Miscommunication?
3. **How you sought understanding:** Did you have an honest conversation? Try to understand WHY they work that way? Find the valid reasoning behind their approach?
4. **How you adapted your collaboration:**
   - Defined clear working agreements (e.g., "we prototype first, then add test coverage before merging")
   - Played to each person's strengths
   - Found compromises that leveraged both styles
5. **What you learned:** The best answers show you genuinely gained something from working with someone different — a new perspective, a skill, a broader toolkit.

**What makes it strong:**
- Shows genuine curiosity about different approaches, not just tolerance
- Demonstrates that diversity of thought leads to better outcomes
- Specific adaptations, not just "we agreed to disagree"
- You learned something that changed how you work

**Common mistakes:**
- Framing the other person as wrong and yourself as accommodating
- Choosing a trivial difference (tabs vs. spaces)
- Not showing specific behavioral adaptations you made
- Implying you just put up with them rather than genuinely collaborating`,
  },

  // -24: Making a Decision with Incomplete Information
  {
    slug: 'behavioral-incomplete-information-decision',
    title: 'Making a Decision with Incomplete Information',
    leetcode_id: -24,
    difficulty: 'Hard',
    category: 'Behavioral',
    lists: ['Behavioral'],
    topics: ['Decision Making', 'Judgment', 'Risk Assessment'],
    content: `<p><strong>The Question:</strong> "Tell me about a time you had to make an important technical or product decision without having all the information you wanted."</p>
<p><strong>What the interviewer is looking for:</strong></p>
<ul>
<li>Decision-making process under uncertainty</li>
<li>Ability to assess risk and determine what's "good enough" information</li>
<li>Bias for action — not paralyzed by imperfect data</li>
<li>Intellectual honesty about confidence levels and assumptions</li>
</ul>
<p><strong>Guidelines:</strong></p>
<ul>
<li>This is distinct from "ambiguous requirements" — here, you had a clear goal but incomplete data to choose the right path</li>
<li>Show your reasoning process: what information you had, what you lacked, and why you decided to act anyway</li>
<li>Demonstrate how you mitigated the risk of being wrong</li>
<li>This maps to Amazon's "Bias for Action" and "Are Right, A Lot" principles</li>
</ul>`,
    solution: `**Framework:** Decision Context → Information Gap → Reasoning → Risk Mitigation → Outcome
**Key Elements:**
1. **The decision:** What choice did you face? What were the options? Why was it important?
2. **What you knew and what you didn't:** Be explicit. "I had performance data for scenario A but not B. I had 2 weeks of user feedback, not the 3 months I wanted."
3. **Why you decided to act now vs. wait for more data:** Was there a cost to delay? A window of opportunity closing? Diminishing returns on more research?
4. **Your reasoning process:**
   - What analogies or heuristics did you use?
   - What was your confidence level and why?
   - Did you consult others to stress-test your thinking?
5. **Risk mitigation:** How did you make the decision reversible or low-cost to correct?
   - Feature flags, A/B tests, phased rollouts
   - Defined clear metrics to validate the decision quickly
   - Had a rollback plan
6. **The outcome:** Were you right? If not, how quickly did you course-correct?

**What makes it strong:**
- Shows a repeatable decision-making framework, not just gut instinct
- Explicitly names what was unknown and why you proceeded anyway
- Includes concrete risk mitigation strategies
- Demonstrates intellectual honesty about confidence levels

**Common mistakes:**
- Making it sound like you just guessed and got lucky
- Not showing any risk mitigation
- Choosing a low-stakes decision where incomplete information didn't really matter
- Being unable to articulate WHY you chose one option over another`,
  },

  // -25: Onboarding to a New Codebase/Team
  {
    slug: 'behavioral-onboarding-new-codebase',
    title: 'Onboarding to a New Codebase or Team',
    leetcode_id: -25,
    difficulty: 'Easy',
    category: 'Behavioral',
    lists: ['Behavioral'],
    topics: ['Learning', 'Adaptability', 'Communication'],
    content: `<p><strong>The Question:</strong> "Tell me about a time you joined a new team or had to ramp up on an unfamiliar codebase. How did you get productive quickly?"</p>
<p><strong>What the interviewer is looking for:</strong></p>
<ul>
<li>Learning velocity — how quickly can you become productive in a new context?</li>
<li>Learning strategies — do you have a systematic approach to ramping up?</li>
<li>Humility and willingness to ask questions</li>
<li>Ability to contribute while still learning</li>
</ul>
<p><strong>Guidelines:</strong></p>
<ul>
<li>This is especially relevant for people joining FAANG — everyone ramps up on massive codebases</li>
<li>Show a structured approach, not just "I read the code"</li>
<li>Highlight how you balanced learning with early contributions</li>
<li>Bonus if you improved the onboarding experience for the next person</li>
</ul>`,
    solution: `**Framework:** Strategy → Execution → Early Wins → Long-term Ramp
**Key Elements:**
1. **Your ramp-up strategy:**
   - Read existing documentation, design docs, and ADRs
   - Set up the development environment and traced request flows end-to-end
   - Identified the "owner" of each system component and scheduled 1:1s
   - Started with small, well-scoped bugs or tasks to build familiarity
2. **How you asked for help effectively:**
   - Researched before asking — showed you'd done your homework
   - Asked specific questions, not "how does this work?"
   - Took notes and didn't ask the same question twice
3. **Early contributions:**
   - Fixed documentation gaps you found as a newcomer (fresh-eyes advantage)
   - Tackled small bugs to build confidence and credibility
   - Offered a newcomer's perspective in design reviews
4. **Ramp-up timeline:** How quickly did you go from onboarding to independently shipping features?
5. **Paying it forward:** Did you improve documentation or onboarding guides for the next person?

**What makes it strong:**
- Shows a systematic, repeatable approach to learning
- Balances humility (asking questions) with initiative (contributing early)
- Demonstrates a "fresh eyes" advantage — newcomers see things veterans miss
- Improved the path for the next person

**Common mistakes:**
- "I just read the code for a few weeks" — too passive
- Not showing early contributions
- Being unwilling to ask questions (trying to figure everything out alone)
- Not having a structured approach to ramp-up`,
  },

  // -26: Driving Alignment Across Teams
  {
    slug: 'behavioral-driving-alignment',
    title: 'Driving Alignment Across Teams',
    leetcode_id: -26,
    difficulty: 'Hard',
    category: 'Behavioral',
    lists: ['Behavioral'],
    topics: ['Leadership', 'Communication', 'Organizational Impact'],
    content: `<p><strong>The Question:</strong> "Tell me about a time you had to drive alignment on a technical direction or strategy across multiple teams or stakeholders with different opinions."</p>
<p><strong>What the interviewer is looking for:</strong></p>
<ul>
<li>Staff+ level organizational influence</li>
<li>Ability to synthesize diverse viewpoints into a coherent direction</li>
<li>Communication at scale — written proposals, presentations, workshops</li>
<li>Getting genuine buy-in, not just compliance</li>
</ul>
<p><strong>Guidelines:</strong></p>
<ul>
<li>This is a key staff/principal engineer competency at every FAANG company</li>
<li>Show the process of building consensus, not just the final decision</li>
<li>Demonstrate that you genuinely considered and incorporated different perspectives</li>
<li>The best answers show lasting alignment, not just a one-time decision</li>
</ul>`,
    solution: `**Framework:** Problem → Landscape → Process → Alignment → Outcome
**Key Elements:**
1. **Why alignment was needed:** What problem arose from teams going in different directions? Duplicated effort? Incompatible systems? Inconsistent user experience?
2. **The landscape of opinions:** What were the different positions and why did each team hold them? Show empathy for each viewpoint.
3. **Your alignment process:**
   - Wrote an RFC or strategy doc that laid out the options objectively
   - Had 1:1 conversations with key stakeholders BEFORE the group discussion
   - Organized a working session or review meeting with clear goals
   - Found common ground — what did everyone agree on? Start there
   - Addressed concerns individually — different people had different objections
4. **How you handled disagreement that remained:** Did you use data to break ties? Bring in a senior leader for a tiebreaker? Propose a time-boxed experiment?
5. **Lasting alignment:** Did you create shared documents, standards, or governance processes to maintain alignment beyond this one decision?

**What makes it strong:**
- Shows organizational thinking, not just technical thinking
- Genuine engagement with opposing viewpoints
- Creates durable alignment, not just a one-time decision
- Scalable process — could work for future alignment needs

**Common mistakes:**
- Making it sound like you just wrote a doc and everyone agreed
- Not showing that you understood why people disagreed
- Relying on authority ("my VP backed me") rather than persuasion
- Not creating lasting mechanisms for alignment`,
  },

  // -27: Improving a Process
  {
    slug: 'behavioral-improving-a-process',
    title: 'Improving a Team Process',
    leetcode_id: -27,
    difficulty: 'Medium',
    category: 'Behavioral',
    lists: ['Behavioral'],
    topics: ['Process Improvement', 'Initiative', 'Operational Excellence'],
    content: `<p><strong>The Question:</strong> "Tell me about a time you identified an inefficiency in a team process and improved it."</p>
<p><strong>What the interviewer is looking for:</strong></p>
<ul>
<li>Initiative to improve the way work is done, not just do the work</li>
<li>Analytical thinking — measuring the problem before jumping to solutions</li>
<li>Change management — getting others to adopt the improvement</li>
<li>Measurable impact on team productivity</li>
</ul>
<p><strong>Guidelines:</strong></p>
<ul>
<li>Examples: CI/CD pipeline speed, code review bottlenecks, incident response, deployment process, meeting overload, testing strategy</li>
<li>Show that you measured the problem (before/after metrics are gold)</li>
<li>Describe how you got buy-in — people resist process changes</li>
<li>This maps to Amazon's "Invent and Simplify" and Google's "Improve the machine, not just run it"</li>
</ul>`,
    solution: `**Framework:** Problem Identification → Measurement → Solution → Adoption → Impact
**Key Elements:**
1. **The problem you identified:** What was inefficient? How did you notice it? Was it something the team had accepted as "just how things are"?
2. **How you measured it:**
   - "Deploys were taking 45 minutes and failing 30% of the time"
   - "Code reviews had a 3-day average turnaround"
   - "We spent 4 hours per sprint in status meetings"
3. **Your proposed improvement:**
   - What did you change? Be specific about the solution
   - Why this approach over alternatives?
   - Was it a tool, a process, an automation, or a cultural change?
4. **How you drove adoption:**
   - Piloted with a small group first
   - Demonstrated the improvement with data
   - Made it easy for others to adopt (documentation, automation, defaults)
   - Got buy-in from team lead or manager
5. **The measurable result:** Before vs. after metrics. "Deploy time dropped from 45 min to 8 min. Failure rate went from 30% to 5%."

**What makes it strong:**
- Quantified before/after metrics
- Shows initiative — you weren't asked to do this
- Addresses the adoption challenge, not just the technical solution
- The improvement stuck — it's not just a tool nobody uses

**Common mistakes:**
- No measurements — "I think it helped" isn't enough
- Building something nobody adopted
- Not addressing the human/change management aspect
- Choosing a trivial improvement (e.g., "I renamed some variables")`,
  },

  // -28: Dealing with Burnout or Work-Life Balance
  {
    slug: 'behavioral-burnout-work-life-balance',
    title: 'Dealing with Burnout or Work-Life Balance',
    leetcode_id: -28,
    difficulty: 'Medium',
    category: 'Behavioral',
    lists: ['Behavioral'],
    topics: ['Self-Awareness', 'Sustainability', 'Well-being'],
    content: `<p><strong>The Question:</strong> "Tell me about a time you or your team experienced burnout or unsustainable working conditions. How did you handle it?"</p>
<p><strong>What the interviewer is looking for:</strong></p>
<ul>
<li>Self-awareness about your own limits and well-being</li>
<li>Willingness to address unsustainable situations proactively</li>
<li>Leadership in protecting team well-being (for senior roles)</li>
<li>Practical strategies, not just vague wellness talk</li>
</ul>
<p><strong>Guidelines:</strong></p>
<ul>
<li>This question is increasingly asked at FAANG companies — they know burnout is real</li>
<li>Be honest but professional — this isn't therapy, it's showing mature self-management</li>
<li>The best answers show systemic solutions, not just "I took a vacation"</li>
<li>If you're answering about your team, show how you created sustainable conditions for others</li>
</ul>`,
    solution: `**Framework:** Recognition → Response → Systemic Change → Outcome
**Key Elements:**
1. **Recognition:** How did you realize you/the team was burning out? What were the signals — declining code quality, missed deadlines, low morale, physical symptoms?
2. **Diagnosis:** What was causing it? Unrealistic commitments? Constant on-call pages? Scope creep? Poor prioritization? Understaffing?
3. **Your response:**
   - **For yourself:** How did you address it? Talked to your manager? Renegotiated commitments? Set boundaries?
   - **For your team:** Did you raise it with leadership? Advocate for headcount? Push back on scope?
4. **Systemic changes you drove:**
   - Improved on-call rotation or escalation policies
   - Better sprint planning and scope management
   - Automated toil that was consuming the team
   - Established sustainable pace norms
5. **The outcome:** Did the situation improve? Were the changes lasting? What did you learn about sustainability?

**What makes it strong:**
- Shows self-awareness without being unprofessional
- Addresses root causes, not just symptoms
- Demonstrates leadership in protecting team well-being
- Implements systemic changes, not just one-time fixes

**Common mistakes:**
- Being too raw or emotional — keep it professional
- "I just powered through" (this is the WRONG answer)
- Not showing what changed as a result
- Blaming the company without showing your agency in addressing it`,
  },

  // Additional questions to ensure comprehensive coverage

  // -29: Receiving and Acting on Negative Performance Feedback
  {
    slug: 'behavioral-negative-performance-feedback',
    title: 'Receiving Negative Performance Feedback',
    leetcode_id: -29,
    difficulty: 'Hard',
    category: 'Behavioral',
    lists: ['Behavioral'],
    topics: ['Self-Awareness', 'Growth Mindset', 'Resilience'],
    content: `<p><strong>The Question:</strong> "Tell me about a time you received critical feedback during a performance review or from your manager. How did you respond?"</p>
<p><strong>What the interviewer is looking for:</strong></p>
<ul>
<li>Emotional resilience — can you absorb criticism without shutting down?</li>
<li>Self-awareness — do you agree with the feedback or can you articulate why you see it differently?</li>
<li>Action-orientation — did you create a concrete improvement plan?</li>
<li>Growth trajectory — can you point to measurable improvement?</li>
</ul>
<p><strong>Guidelines:</strong></p>
<ul>
<li>This tests vulnerability and maturity — the interviewer is looking for authenticity</li>
<li>Don't pick feedback you think was unfair and then argue against it — that misses the point</li>
<li>Show a clear before/after arc: feedback received → specific changes → measurable improvement</li>
<li>It's fine to mention that the feedback was initially hard to hear — that's honest and relatable</li>
</ul>`,
    solution: `**Framework:** Feedback → Processing → Action Plan → Improvement
**Key Elements:**
1. **The feedback:** What was the specific critique? "My manager told me that while my technical output was strong, I wasn't communicating proactively enough with the broader team — people were often surprised by my decisions."
2. **Your initial reaction (be honest):** It's human to feel defensive. Briefly acknowledge that, then show how you moved past it.
3. **How you processed it:**
   - Did you ask for specific examples to understand the feedback deeply?
   - Did you seek a second opinion from a trusted peer?
   - Did you reflect on whether the feedback had merit?
4. **Your action plan:** What concrete steps did you take?
   - "I started sending weekly status updates to the team"
   - "I began sharing design decisions in our team channel before implementing"
   - "I asked my manager for monthly check-ins on this specific area"
5. **Measurable improvement:** In the next review cycle, what changed? Did the feedback shift? Did you receive positive recognition for the improvement?

**What makes it strong:**
- Genuine vulnerability paired with concrete action
- Shows the feedback was valid and you grew from it
- Specific behavioral changes, not vague promises
- Evidence that the improvement was recognized by others

**Common mistakes:**
- Choosing feedback you disagreed with and arguing against it
- Being so defensive in the story that it undermines your credibility
- Not showing concrete behavioral changes
- Picking feedback that's too minor to be meaningful`,
  },

  // -30: Handling a Production Incident or Outage
  {
    slug: 'behavioral-production-incident',
    title: 'Handling a Production Incident',
    leetcode_id: -30,
    difficulty: 'Medium',
    category: 'Behavioral',
    lists: ['Behavioral'],
    topics: ['Crisis Management', 'Problem Solving', 'Communication'],
    content: `<p><strong>The Question:</strong> "Tell me about a time you were involved in a critical production incident or outage. What was your role and how did you handle it?"</p>
<p><strong>What the interviewer is looking for:</strong></p>
<ul>
<li>Calm under pressure — can you think clearly when things are on fire?</li>
<li>Systematic debugging — not just random guessing</li>
<li>Communication during crisis — keeping stakeholders informed</li>
<li>Post-incident learning — driving improvements to prevent recurrence</li>
</ul>
<p><strong>Guidelines:</strong></p>
<ul>
<li>This is extremely common at FAANG companies where uptime is critical</li>
<li>Focus on your debugging PROCESS, not just the root cause</li>
<li>Show how you communicated with the team and stakeholders during the incident</li>
<li>The post-incident review and prevention measures are as important as the fix</li>
</ul>`,
    solution: `**Framework:** Detection → Triage → Resolution → Post-Incident
**Key Elements:**
1. **Detection and context:** How was the incident detected? Monitoring alert? Customer report? What was the impact (users affected, revenue, SLA breach)?
2. **Your role and triage:**
   - How did you assess severity and scope?
   - Who did you involve? How did you communicate to the broader org?
   - Did you establish an incident commander role?
3. **Debugging process:**
   - Walk through your systematic approach: checked logs, traced the request path, isolated the component, identified the root cause
   - Show your reasoning — what hypotheses did you test and eliminate?
   - How long did resolution take?
4. **Communication during the incident:**
   - How did you keep stakeholders updated?
   - Did you communicate customer-facing impact to support/comms teams?
5. **Post-incident:**
   - Did you write or contribute to a postmortem?
   - What systemic improvements resulted? (monitoring, testing, runbooks, architecture changes)
   - How did you ensure the same class of issue wouldn't recur?

**What makes it strong:**
- Shows calm, methodical approach under pressure
- Clear communication throughout the incident
- Systematic debugging, not lucky guessing
- Concrete preventive measures implemented after the incident

**Common mistakes:**
- Focusing only on the technical fix, not the communication and process
- Not mentioning postmortem or prevention
- Making it sound like you panicked or blamed others
- Choosing a trivial incident (a minor bug fix isn't an "incident")`,
  },

  // -31: Navigating Organizational Politics
  {
    slug: 'behavioral-navigating-org-politics',
    title: 'Navigating Organizational Politics',
    leetcode_id: -31,
    difficulty: 'Hard',
    category: 'Behavioral',
    lists: ['Behavioral'],
    topics: ['Organizational Awareness', 'Influence', 'Pragmatism'],
    content: `<p><strong>The Question:</strong> "Tell me about a time you had to navigate a politically complex situation at work to get something done."</p>
<p><strong>What the interviewer is looking for:</strong></p>
<ul>
<li>Organizational awareness — understanding how decisions really get made</li>
<li>Ability to build coalitions and find sponsors for ideas</li>
<li>Pragmatism — working within the system, not against it</li>
<li>Professionalism — navigating politics without being political</li>
</ul>
<p><strong>Guidelines:</strong></p>
<ul>
<li>This is NOT about being manipulative — it's about organizational effectiveness</li>
<li>Examples: getting buy-in for a migration, securing resources, resolving ownership disputes between teams</li>
<li>Show that you understand informal power structures, not just org charts</li>
<li>The best answers show that you achieved a good outcome for the organization, not just yourself</li>
</ul>`,
    solution: `**Framework:** Landscape → Strategy → Execution → Outcome
**Key Elements:**
1. **The situation:** What needed to happen and why was it politically complex? Competing team interests? Resource contention? Unclear ownership? A decision that had winners and losers?
2. **Your stakeholder analysis:**
   - Who were the key decision-makers and influencers?
   - What were their individual motivations and concerns?
   - Where did interests align and where did they conflict?
3. **Your strategy:**
   - Built relationships and trust with key people
   - Found win-win framings that addressed everyone's concerns
   - Got early alignment from influential people before bringing it to a wider group
   - Used data to depersonalize the decision
4. **Execution:**
   - Had private conversations before public meetings
   - Created a proposal that addressed stakeholder concerns explicitly
   - Built momentum gradually rather than forcing a single high-stakes decision
5. **The outcome:** How did it turn out? Was the solution good for the organization, not just you?

**What makes it strong:**
- Shows sophistication about how organizations work
- Achieves a good outcome without burning bridges
- Demonstrates empathy for all stakeholders' positions
- The outcome benefits the organization, not just your team

**Common mistakes:**
- Making it sound like you manipulated people
- Badmouthing leaders or other teams
- Not acknowledging the legitimate concerns of those who disagreed
- Confusing "politics" with "disagreement" — true political complexity involves power dynamics`,
  },
];

export default behavioralExtra;
